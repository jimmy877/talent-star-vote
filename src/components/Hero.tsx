import { Button } from "@/components/ui/button";
import { Countdown } from "@/components/Countdown";

interface HeroProps {
  language: "ru" | "en";
  onScrollToVoting: () => void;
  onShowRules: () => void;
}

export const Hero = ({ language, onScrollToVoting, onShowRules }: HeroProps) => {
  const content = {
    en: {
      nightOf: "NIGHT of",
      talents: "TALENTS",
      by: "by",
      rh: "REPUTATION HOUSE",
      tagline: "Celebrate the people who make the impossible possible",
      voteButton: "Start Voting",
      rulesButton: "Rules & Transparency",
    },
    ru: {
      nightOf: "NIGHT of",
      talents: "TALENTS",
      by: "by",
      rh: "REPUTATION HOUSE",
      tagline: "Отмечаем тех, кто делает невозможное возможным",
      voteButton: "Перейти к голосованию",
      rulesButton: "правила и прозрачность",
    },
  } as const;

  const text = content[language];

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden hero-vignette">
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center animate-fade-in">
        {/* NIGHT of with lines */}
        <div className="mb-6 flex items-center justify-center gap-6">
          <span className="gold-line-soft w-24 md:w-40" />
          <div className="gold-text font-serif tracking-[0.15em] text-3xl md:text-5xl uppercase">
            {text.nightOf}
          </div>
          <span className="gold-line-soft w-24 md:w-40" />
        </div>

        {/* TALENTS big */}
        <h1 className="gold-text font-serif font-bold leading-none text-[64px] md:text-[120px] lg:text-[160px]">
          {text.talents}
        </h1>
        <div className="gold-line mt-4 mb-6 w-4/5 mx-auto" />

        {/* by REPUTATION HOUSE */}
        <div className="mb-10 text-[hsl(38,35%,75%)]">
          <span className="italic mr-2">{text.by}</span>
          <span className="gold-text tracking-wide font-semibold">{text.rh}</span>
        </div>

        {/* Countdown */}
        <div className="mb-10">
          <Countdown language={language} variant="hero" />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Button
            size="lg"
            onClick={onScrollToVoting}
            className="text-base md:text-lg px-8 py-6 rounded-full bg-[hsl(32,70%,46%)] hover:bg-[hsl(32,70%,42%)] text-white shadow-lg"
          >
            {text.voteButton}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onShowRules}
            className="text-base md:text-lg px-8 py-6 rounded-full border-[hsl(35,55%,60%)] text-[hsl(35,55%,80%)] hover:bg-white/5"
          >
            {text.rulesButton}
          </Button>
        </div>

        {/* Tagline */}
        <p className="mt-8 text-sm text-[hsl(35,35%,70%)]">{text.tagline}</p>
      </div>
    </section>
  );
};

