import { LanguageSwitcher } from "@/components/LanguageSwitcher";

interface HeaderProps {
  language: "ru" | "en";
  onLanguageChange: (lang: "ru" | "en") => void;
}

// Minimal overlay header: only language switcher in the top-right,
// matching the reference where there is no visible navbar/logo.
export const Header = ({ language, onLanguageChange }: HeaderProps) => {
  return (
    <header className="pointer-events-none fixed top-0 right-0 z-50 w-full">
      <div className="mx-auto px-4 py-3">
        <div className="flex justify-end">
          <div className="pointer-events-auto">
            <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
          </div>
        </div>
      </div>
    </header>
  );
};

