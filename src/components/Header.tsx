import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface HeaderProps {
  language: "ru" | "en";
  onLanguageChange: (lang: "ru" | "en") => void;
}

export const Header = ({ language, onLanguageChange }: HeaderProps) => {
  return (
    <header className="  z-[99999] sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-background/60 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-8 w-auto"
            loading="eager"
            decoding="async"
          />
        </a>
        <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
      </div>
    </header>
  );
};

