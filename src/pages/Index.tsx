import { useState, useRef } from "react";
import { Hero } from "@/components/Hero";
import { NominationCard } from "@/components/NominationCard";
import { StickyTimer } from "@/components/StickyTimer";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Award,
  Sparkles,
  GraduationCap,
  Users,
  Heart,
  Lightbulb,
  Trophy,
  Handshake,
  Briefcase,
  Rocket,
  Shield,
} from "lucide-react";

interface Nominee {
  id: string;
  name: string;
  story: string;
}

const Index = () => {
  const [language, setLanguage] = useState<"ru" | "en">("ru");
  const [agreed, setAgreed] = useState(false);
  const [nominations, setNominations] = useState<Record<string, Nominee[]>>({});
  const { toast } = useToast();
  const votingRef = useRef<HTMLDivElement>(null);
  const [submitting, setSubmitting] = useState(false);

  // Google Apps Script endpoint (env first, then fallback)
  const GS_ENDPOINT = import.meta.env.VITE_GS_ENDPOINT ||
    "https://script.google.com/macros/s/AKfycbw_65secyc7bQooNxSDuR2XVzxBbtBd6bDpmkaX_dcA-Wk12BwP3sbt8xdUk8rW_91Q/exec";
  const GS_SECRET = import.meta.env.VITE_GS_SECRET as string | undefined;

  async function sendToGoogle(payload: any) {
    const body = new URLSearchParams();
    if (GS_SECRET) body.append("t", GS_SECRET);
    body.append("json", JSON.stringify(payload));
    try {
      const res = await fetch(GS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
        body,
      });
      try { const j = await res.json(); return !!j?.ok || res.ok; } catch { /* fallthrough */ }
      return res.ok;
    } catch (e) {
      // Fallback for strict CORS: fire-and-forget
      try {
        await fetch(GS_ENDPOINT, { method: "POST", body, mode: "no-cors" });
        return true; // cannot read response, assume success
      } catch {
        return false;
      }
    }
  }

  const scrollToVoting = () => {
    votingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleShowRules = () => {
    toast({
      title: language === "ru" ? "Правила и прозрачность" : "Rules & Transparency",
      description:
        language === "ru"
          ? "Голосование анонимное. Результаты будут объявлены после подведения итогов организационным комитетом."
          : "Voting is anonymous. Results will be announced after being validated by the organizing committee.",
    });
  };

  const handleSubmit = async () => {
    if (!agreed) {
      toast({
        title: language === "ru" ? "Требуется согласие" : "Consent Required",
        description:
          language === "ru"
            ? "Пожалуйста, подтвердите корректность указанных данных"
            : "Please confirm the correctness of the provided data",
        variant: "destructive",
      });
      return;
    }

    // Count filled nominations
    const filledNominations = Object.values(nominations).filter(
      (nominees) => nominees.some((n) => n.name.trim())
    ).length;

    if (filledNominations === 0) {
      toast({
        title: language === "ru" ? "Добавьте номинантов" : "Add Nominees",
        description:
          language === "ru"
            ? "Пожалуйста, заполните хотя бы одну номинацию"
            : "Please fill in at least one nomination",
        variant: "destructive",
      });
      return;
    }

    // Send to Google Sheet via Apps Script
    setSubmitting(true);
    // Sanitize nominations to reduce noise
    const compactNominations = Object.fromEntries(
      Object.entries(nominations).map(([k, arr]) => [
        k,
        (arr || []).filter((n) => (n?.name || "").trim() || (n?.story || "").trim()),
      ])
    );

    // Titles and order (current language) so Apps Script может красиво разложить по колонкам
    const nominationTitles = Object.fromEntries(
      (nominations_list || []).map((n) => [n.id, n.title])
    );
    const nominationOrder = (nominations_list || []).map((n) => n.id).filter((id) =>
      (compactNominations as any)[id]?.length
    );

    const ok = await sendToGoogle({
      language,
      agreed,
      filledNominations,
      nominations: compactNominations,
      nominationTitles,
      nominationOrder,
      userAgent: navigator.userAgent,
      ts: new Date().toISOString(),
    });
    setSubmitting(false);
    if (!ok) {
      toast({
        title: language === "ru" ? "Ошибка отправки" : "Submission Error",
        description:
          language === "ru"
            ? "Не удалось отправить данные. Попробуйте ещё раз позже."
            : "Could not submit your vote. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    // Success
    toast({
      title: language === "ru" ? "🎉 Спасибо за участие!" : "🎉 Thank You for Voting!",
      description:
        language === "ru"
          ? `Ваш голос успешно отправлен! Вы проголосовали в ${filledNominations} ${
              filledNominations === 1 ? "номинации" : "номинациях"
            }.`
          : `Your vote has been submitted successfully! You voted in ${filledNominations} ${
              filledNominations === 1 ? "category" : "categories"
            }.`,
    });
  };

  const nominationsData = {
    ru: [
      {
        id: "employee",
        title: "Сотрудник года",
        description:
          "Главная индивидуальная награда премии. Присуждается человеку, который внёс наибольший вклад в развитие Reputation House, стал примером вовлечённости, профессионализма и духа компании.",
        icon: <Award className="w-6 h-6" />,
      },
      {
        id: "newcomer",
        title: "Открытие года",
        description:
          "Награда для тех, кто присоединился к команде в 2025 году и уже успел заявить о себе. Это новички, которые быстро адаптировались, показали результаты и стали частью культуры RH.",
        icon: <Sparkles className="w-6 h-6" />,
      },
      {
        id: "step",
        title: "STEP года",
        description:
          "Для тех, кто проводил обучающие STEP-сессии, помогая коллегам расти и делиться знаниями, сделал вклад в развитие командной экспертизы.",
        icon: <GraduationCap className="w-6 h-6" />,
      },
      {
        id: "manager",
        title: "Руководитель года",
        description:
          "Для тимлидов и руководителей отделов, которые добились высоких результатов, за умение вести команду через вызовы и создавать поддерживающую атмосферу.",
        icon: <Users className="w-6 h-6" />,
      },
      {
        id: "hero",
        title: "Тихий герой",
        description:
          "Кто редко бывает на передовой, но без кого многое бы не случилось. Люди, создающие фундамент успеха. Тихий герой, создающий опору для команды.",
        icon: <Shield className="w-6 h-6" />,
      },
      {
        id: "supportive",
        title: "The Most Supportive Talent of the Year 2025",
        description:
          "Награда для человека, влияющего на создание уникальной культуры, его действия поддерживают, объединяют, вдохновляют коллег на новые свершения.",
        icon: <Heart className="w-6 h-6" />,
      },
      {
        id: "idea",
        title: "Идея года",
        description:
          "Для идеи, инициативы, которая реально сработала — улучшила процесс, вдохновила других, упростила задачу, сделала команду эффективнее или принесла ощутимую пользу компании.",
        icon: <Lightbulb className="w-6 h-6" />,
      },
      {
        id: "team",
        title: "Команда года",
        description:
          "Главная командная награда. Для отдела или проектной команды, показавших выдающиеся результаты, взаимодействие и вклад в развитие Reputation House в 2025 году.",
        icon: <Trophy className="w-6 h-6" />,
      },
      {
        id: "collaboration",
        title: "Коллаборация года",
        description:
          "За совместный проект или лучшее взаимодействие между командами, отделами. Когда синергия, обмен опытом и взаимопомощь дали эффект, которого не достичь поодиночке.",
        icon: <Handshake className="w-6 h-6" />,
      },
      {
        id: "case",
        title: "Кейс года",
        description:
          "Для людей, команд, отделов, реализовавших запуск, кейс или проект (внутренний и внешний).",
        icon: <Briefcase className="w-6 h-6" />,
      },
      {
        id: "innovation",
        title: "Инновация года",
        description:
          "За эффективные решения, внедрение автоматизации, IT-решений, ИИ-решений, которые улучшили работу всей команды. За технологии, которые двигают Reputation House вперёд.",
        icon: <Rocket className="w-6 h-6" />,
      },
    ],
    en: [
      {
        id: "employee",
        title: "Employee of the Year",
        description:
          "The main individual award. Given to the person who made the greatest contribution to Reputation House's development, became an example of engagement, professionalism, and company spirit.",
        icon: <Award className="w-6 h-6" />,
      },
      {
        id: "newcomer",
        title: "Newcomer of the Year",
        description:
          "For those who joined the team in 2025 and have already made their mark. Newcomers who quickly adapted, showed results, and became part of RH culture.",
        icon: <Sparkles className="w-6 h-6" />,
      },
      {
        id: "step",
        title: "STEP of the Year",
        description:
          "For those who conducted educational STEP sessions, helping colleagues grow and share knowledge, contributing to team expertise development.",
        icon: <GraduationCap className="w-6 h-6" />,
      },
      {
        id: "manager",
        title: "Manager of the Year",
        description:
          "For team leads and department heads who achieved high results, for the ability to lead teams through challenges and create a supportive atmosphere.",
        icon: <Users className="w-6 h-6" />,
      },
      {
        id: "hero",
        title: "Silent Hero",
        description:
          "Those rarely on the front lines, but without whom much wouldn't happen. People who create the foundation of success. A silent hero creating support for the team.",
        icon: <Shield className="w-6 h-6" />,
      },
      {
        id: "supportive",
        title: "The Most Supportive Talent of the Year 2025",
        description:
          "Award for a person influencing the creation of a unique culture, whose actions support, unite, and inspire colleagues to new achievements.",
        icon: <Heart className="w-6 h-6" />,
      },
      {
        id: "idea",
        title: "Idea of the Year",
        description:
          "For an idea or initiative that actually worked — improved a process, inspired others, simplified a task, made the team more effective, or brought tangible benefits to the company.",
        icon: <Lightbulb className="w-6 h-6" />,
      },
      {
        id: "team",
        title: "Team of the Year",
        description:
          "The main team award. For a department or project team that showed outstanding results, interaction, and contribution to Reputation House's development in 2025.",
        icon: <Trophy className="w-6 h-6" />,
      },
      {
        id: "collaboration",
        title: "Collaboration of the Year",
        description:
          "For a joint project or best interaction between teams and departments. When synergy, experience exchange, and mutual assistance produced an effect unattainable alone.",
        icon: <Handshake className="w-6 h-6" />,
      },
      {
        id: "case",
        title: "Case of the Year",
        description:
          "For people, teams, and departments who implemented a launch, case, or project (internal and external).",
        icon: <Briefcase className="w-6 h-6" />,
      },
      {
        id: "innovation",
        title: "Innovation of the Year",
        description:
          "For effective solutions, implementation of automation, IT solutions, AI solutions that improved the entire team's work. For technologies that move Reputation House forward.",
        icon: <Rocket className="w-6 h-6" />,
      },
    ],
  };

  const content = {
    ru: {
      about: "О премии",
      aboutText:
        "Night of Talents Award — это ежегодная премия Reputation House, созданная для признания выдающихся достижений и вклада наших сотрудников. Мы отмечаем тех, кто делает невозможное возможным.",
      rules: "Правила и прозрачность",
      voting: "Голосование",
      submitButton: "Отправить голос(а)",
      agreementText: "Подтверждаю корректность указанных данных",
    },
    en: {
      about: "About the Award",
      aboutText:
        "Night of Talents Award is an annual Reputation House award created to recognize the outstanding achievements and contributions of our employees. We celebrate those who make the impossible possible.",
      rules: "Rules & Transparency",
      voting: "Voting",
      submitButton: "Submit Vote(s)",
      agreementText: "I confirm the correctness of the provided data",
    },
  };

  const text = content[language];
  const nominations_list = nominationsData[language];

  return (
    <div className="min-h-screen">
      <Hero
        language={language}
        onLanguageChange={setLanguage}
        onScrollToVoting={scrollToVoting}
        onShowRules={handleShowRules}
      />

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 glow-text">{text.about}</h2>
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">{text.aboutText}</p>
        <Button variant="link" onClick={handleShowRules} className="text-primary">
          {text.rules} →
        </Button>
      </section>

      {/* Voting Section */}
      <section ref={votingRef} className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 glow-text">{text.voting}</h2>

        <div className="grid gap-8">
          {nominations_list.map((nomination) => (
            <NominationCard
              key={nomination.id}
              title={nomination.title}
              description={nomination.description}
              icon={nomination.icon}
              language={language}
              onNomineesChange={(nominees) => {
                setNominations((prev) => ({
                  ...prev,
                  [nomination.id]: nominees,
                }));
              }}
            />
          ))}
        </div>

        {/* Submit Section */}
        <div className="mt-16 glass p-8 rounded-3xl max-w-2xl mx-auto">
          <div className="flex items-start gap-3 mb-6">
            <Checkbox
              id="agreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <label htmlFor="agreement" className="text-sm leading-relaxed cursor-pointer">
              {text.agreementText}
            </label>
          </div>

          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!agreed || submitting}
            className="w-full text-lg py-6 bg-gradient-to-r from-primary to-secondary hover:shadow-glow-lg transition-all duration-300"
          >
            {submitting ? (language === 'ru' ? 'Отправляем...' : 'Submitting...') : text.submitButton}
          </Button>
        </div>
      </section>

      <FAQ language={language} />
      <Footer language={language} />
      <StickyTimer language={language} />
    </div>
  );
};

export default Index;
