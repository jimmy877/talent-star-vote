import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Sparkles } from "lucide-react";

interface HeroProps {
  language: "ru" | "en";
  onLanguageChange: (lang: "ru" | "en") => void;
  onScrollToVoting: () => void;
  onShowRules: () => void;
}

export const Hero = ({ language, onLanguageChange, onScrollToVoting, onShowRules }: HeroProps) => {
  const content = {
    en: {
      title: "Night of Talents Award",
      subtitle: "by Reputation House",
      description: "Celebrate the people who make impossible happen.",
      voteButton: "Start Voting",
      rulesButton: "Rules & Transparency",
      deadline: "Voting closes on",
    },
    ru: {
      title: "Премия «Ночь Талантов»",
      subtitle: "от Reputation House",
      description: "Отмечаем тех, кто делает невозможное возможным.",
      voteButton: "Перейти к голосованию",
      rulesButton: "Правила и прозрачность",
      deadline: "Голосование закрывается",
    },
  };

  const text = content[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
      
      {/* Particles */}
      {[...Array(28)].map((_, i) => (
        <div
          key={i}
          className="absolute particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        />
      ))}

      {/* Language Switcher */}
      <div className="absolute top-8 right-8 z-20">
        <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Sparkles className="w-8 h-8 text-accent animate-pulse" />
          <h1 className="text-5xl md:text-6xl leading-tight font-bold glow-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {text.title}
          </h1>
          <Sparkles className="w-8 h-8 text-accent animate-pulse" style={{ animationDelay: "0.5s" }} />
        </div>

        <div className="flex items-center justify-center gap-3 text-secondary font-medium mb-4">
          <p className="text-xl md:text-2xl">{text.subtitle}</p>
          <img
            src="/reputation-house.svg"
            alt="Reputation House"
            className="h-6 md:h-8 opacity-90"
            loading="eager"
            decoding="async"
          />
        </div>

        <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
          {text.description}
        </p>

        {/* Countdown Timer */}
        <div className="mb-12">
          <Countdown language={language} />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={onScrollToVoting}
            className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105"
          >
            {text.voteButton}
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={onShowRules}
            className="text-lg px-8 py-6 glass glass-hover border-primary/30"
          >
            {text.rulesButton}
          </Button>
        </div>
      </div>
    </section>
  );
};
