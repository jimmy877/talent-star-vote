import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQProps {
  language: "ru" | "en";
}

export const FAQ = ({ language }: FAQProps) => {
  const content = {
    en: {
      title: "Frequently Asked Questions",
      items: [
        {
          q: "Can I nominate multiple people in one category?",
          a: "Yes, you can nominate as many people as you like in each category without any restrictions.",
        },
        {
          q: "Can I vote for anyone?",
          a: "No, we ask you to refrain from voting for our leaders: Dima Sidorin, Dima Raketa, and Kristina Shinkaryova.",
        },
        {
          q: "Will my colleagues see my votes?",
          a: "No, all votes are completely confidential and anonymous.",
        },
        {
          q: "Can I edit my vote before the deadline?",
          a: "Yes, you can edit your nominations until the voting deadline.",
        },
        {
          q: "How are the results calculated?",
          a: "We sum up all votes, the organizing committee validates them, and announces the winners.",
        },
      ],
    },
    ru: {
      title: "Часто задаваемые вопросы",
      items: [
        {
          q: "Можно ли указать нескольких людей в одной номинации?",
          a: "Да, вы можете указать любое количество людей в каждой категории без ограничений.",
        },
        {
          q: "За всех ли можно голосовать?",
          a: "Нет, мы просим воздержаться от голосов за наших лидеров: Диму Сидорина, Диму Ракету и Кристину Шинкарёву.",
        },
        {
          q: "Видят ли коллеги мои голоса?",
          a: "Нет, все голоса полностью конфиденциальны и анонимны.",
        },
        {
          q: "Можно редактировать голос до дедлайна?",
          a: "Да, вы можете редактировать свои номинации до окончания срока голосования.",
        },
        {
          q: "Как учитываются результаты?",
          a: "Мы суммируем голоса, оргкомитет проверяет их и объявляет победителей.",
        },
      ],
    },
  };

  const text = content[language];

  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <HelpCircle className="w-12 h-12 text-accent mx-auto mb-4" />
        <h2 className="text-3xl md:text-4xl font-bold glow-text ">{text.title}</h2>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {text.items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="glass glass-hover px-6 rounded-2xl border-none"
          >
            <AccordionTrigger className="text-left hover:no-underline">
              <span className="font-semibold front-mont">{item.q}</span>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
