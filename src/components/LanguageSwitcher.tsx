import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  language: "ru" | "en";
  onLanguageChange: (lang: "ru" | "en") => void;
}

export const LanguageSwitcher = ({ language, onLanguageChange }: LanguageSwitcherProps) => {
  return (
    <div className="glass p-1 rounded-full flex items-center gap-1">
      <Globe className="w-4 h-4 ml-2 text-muted-foreground" />
      <Button
        size="sm"
        variant={language === "ru" ? "default" : "ghost"}
        onClick={() => onLanguageChange("ru")}
        className="rounded-full px-4"
      >
        RU
      </Button>
      <Button
        size="sm"
        variant={language === "en" ? "default" : "ghost"}
        onClick={() => onLanguageChange("en")}
        className="rounded-full px-4"
      >
        EN
      </Button>
    </div>
  );
};
