import { Mail, Shield } from "lucide-react";

interface FooterProps {
  language: "ru" | "en";
}

export const Footer = ({ language }: FooterProps) => {
  const content = {
    en: {
      contact: "Organizing Committee Contact",
      privacy: "Privacy Policy",
      rights: "© 2025 Reputation House. All rights reserved.",
    },
    ru: {
      contact: "Контакты оргкомитета",
      privacy: "Политика конфиденциальности",
      rights: "© 2025 Reputation House. Все права защищены.",
    },
  };

  const text = content[language];

  return (
    <footer className="border-t border-border/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">{text.contact}</h3>
            <a
              href="mailto:awards@reputation.house"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="w-4 h-4" />
              awards@reputation.house
            </a>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4 text-primary">{text.privacy}</h3>
            <a
              href="#"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Shield className="w-4 h-4" />
              {text.privacy}
            </a>
          </div>

          <div className="text-center md:text-right">
            <div className="inline-flex items-center justify-end gap-3">
              <span className="text-xl font-bold">Night of Talents</span>
              <img src="/reputation-house.svg" alt="Reputation House" className="h-6 opacity-90" />
            </div>
            <div className="text-sm text-muted-foreground mt-2">by Reputation House</div>
          </div>
        </div>

        <div className="text-center text-sm text-muted-foreground border-t border-border/50 pt-8">
          {text.rights}
        </div>
      </div>
    </footer>
  );
};
