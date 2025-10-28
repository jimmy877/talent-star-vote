import { useState, useEffect } from "react";
import { Countdown } from "./Countdown";

interface StickyTimerProps {
  language: "ru" | "en";
}

export const StickyTimer = ({ language }: StickyTimerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 800);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
      <div className="glass p-4 rounded-2xl shadow-glow">
        <Countdown language={language} compact />
      </div>
    </div>
  );
};
