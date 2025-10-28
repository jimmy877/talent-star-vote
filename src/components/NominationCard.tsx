import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Nominee {
  id: string;
  name: string;
  story: string;
}

interface NominationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  language: "ru" | "en";
  onNomineesChange: (nominees: Nominee[]) => void;
}

export const NominationCard = ({
  title,
  description,
  icon,
  language,
  onNomineesChange,
}: NominationCardProps) => {
  const [nominees, setNominees] = useState<Nominee[]>([
    { id: "1", name: "", story: "" },
  ]);

  const content = {
    en: {
      namePlaceholder: "Enter nominee name...",
      storyPlaceholder: "Why are you nominating this person? Share their story...",
      addNominee: "Add Another Nominee",
      remove: "Remove",
      count: "nominees added",
      maxChars: "characters remaining",
    },
    ru: {
      namePlaceholder: "Введите имя номинанта...",
      storyPlaceholder: "Почему вы номинируете этого человека? Расскажите историю...",
      addNominee: "Добавить номинанта",
      remove: "Удалить",
      count: "номинантов добавлено",
      maxChars: "символов осталось",
    },
  };

  const text = content[language];

  const addNominee = () => {
    const newNominee = { id: Date.now().toString(), name: "", story: "" };
    const updatedNominees = [...nominees, newNominee];
    setNominees(updatedNominees);
    onNomineesChange(updatedNominees);
  };

  const removeNominee = (id: string) => {
    const updatedNominees = nominees.filter((n) => n.id !== id);
    setNominees(updatedNominees);
    onNomineesChange(updatedNominees);
  };

  const updateNominee = (id: string, field: "name" | "story", value: string) => {
    const updatedNominees = nominees.map((n) =>
      n.id === id ? { ...n, [field]: value } : n
    );
    setNominees(updatedNominees);
    onNomineesChange(updatedNominees);
  };

  const filledCount = nominees.filter((n) => n.name.trim()).length;
  const maxStoryLength = 2000;

  return (
    <div className="glass glass-hover p-6 rounded-2xl animate-fade-in">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary glow-border">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
        </div>
      </div>

      <div className="space-y-4 mt-6">
        {nominees.map((nominee, index) => (
          <div
            key={nominee.id}
            className="p-4 rounded-xl bg-background/50 border border-border space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {language === "ru" ? "Номинант" : "Nominee"} #{index + 1}
              </span>
              {nominees.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeNominee(nominee.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4 mr-1" />
                  {text.remove}
                </Button>
              )}
            </div>

            <Input
              placeholder={text.namePlaceholder}
              value={nominee.name}
              onChange={(e) => updateNominee(nominee.id, "name", e.target.value)}
              className="bg-background"
            />

            <div className="relative">
              <Textarea
                placeholder={text.storyPlaceholder}
                value={nominee.story}
                onChange={(e) => {
                  if (e.target.value.length <= maxStoryLength) {
                    updateNominee(nominee.id, "story", e.target.value);
                  }
                }}
                className="bg-background min-h-[120px] resize-none"
              />
              <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                {maxStoryLength - nominee.story.length} {text.maxChars}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={addNominee}
          className="glass-hover border-primary/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          {text.addNominee}
        </Button>

        {filledCount > 0 && (
          <Badge variant="secondary" className="glass">
            {filledCount} {text.count}
          </Badge>
        )}
      </div>
    </div>
  );
};
