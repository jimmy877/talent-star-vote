import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
  language: "ru" | "en";
  onLanguageChange: (lang: "ru" | "en") => void;
}

export const LanguageSwitcher = ({ language, onLanguageChange }: LanguageSwitcherProps) => {
  return (
    <div className="bg-black/40 border border-[hsla(35,70%,60%,0.35)] shadow-sm rounded-full p-1 flex items-center gap-1">
      <Button
        size="sm"
        variant={language === "ru" ? "secondary" : "ghost"}
        onClick={() => onLanguageChange("ru")}
        className={`rounded-full px-3 h-7 text-xs ${language === "ru" ? "bg-red-600 text-white hover:bg-red-600" : "text-foreground/80"}`}
      >
        RU
      </Button>
      <Button
        size="sm"
        variant={language === "en" ? "secondary" : "ghost"}
        onClick={() => onLanguageChange("en")}
        className={`rounded-full px-3 h-7 text-xs ${language === "en" ? "bg-[hsl(0,0%,30%)] text-white hover:bg-[hsl(0,0%,30%)]" : "text-foreground/80"}`}
      >
        EN
      </Button>
    </div>
  );
};
