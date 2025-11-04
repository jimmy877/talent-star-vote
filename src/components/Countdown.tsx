import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownProps {
  language: "ru" | "en";
  compact?: boolean;
  variant?: "panel" | "hero"; // hero = minimal gold on dark background
}

export const Countdown = ({ language, compact = false, variant = "panel" }: CountdownProps) => {
  // Deadline: November 14, 2025, 23:59 (TRT)
  const deadline = new Date("2025-11-14T23:59:59+03:00");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const distance = deadline.getTime() - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
        total: distance,
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const content = {
    en: {
      timeRemaining: "Time remaining",
      leftUntilEnd: "time left until voting ends",
      votingClosed: "Voting closed",
      days: "days",
      hours: "hours",
      minutes: "minutes",
      seconds: "seconds",
      deadline: "Voting closes on November 14, 2025, 23:59",
    },
    ru: {
      timeRemaining: "Осталось времени",
      leftUntilEnd: "осталось до конца голосования",
      votingClosed: "Голосование завершено",
      days: "дней",
      hours: "часов",
      minutes: "минут",
      seconds: "секунд",
      deadline: "Голосование закрывается 14 ноября 2025, 23:59",
    },
  } as const;

  const text = content[language];

  // Color based on time remaining
  const getColorClass = () => {
    if (timeLeft.total <= 0) return "text-destructive";
    if (timeLeft.days === 0 && timeLeft.hours < 1) return "text-destructive animate-pulse-glow";
    if (timeLeft.days === 0) return "text-orange-400";
    return "text-primary";
  };

  if (timeLeft.total <= 0) {
    return (
      <div className="glass p-6 rounded-2xl">
        <p className="text-xl font-semibold text-destructive">{text.votingClosed}</p>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Clock className="w-4 h-4" />
        <span className={getColorClass()}>
          {String(timeLeft.days).padStart(2, "0")}:{String(timeLeft.hours).padStart(2, "0")}:
          {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
        </span>
      </div>
    );
  }

  if (variant === "hero") {
    return (
      <div className="text-center">
        <p className="text-[16px] text-[#bb7239] mb-6 tracking-wide">
          {text.leftUntilEnd}
        </p>
        <div className="grid grid-cols-4 gap-8 md:gap-14 mb-6">
          {[
            { value: timeLeft.days, label: text.days },
            { value: timeLeft.hours, label: text.hours },
            { value: timeLeft.minutes, label: text.minutes },
            { value: timeLeft.seconds, label: text.seconds },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="gold-text text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bodoni  mb-1 text-[#fce9a4] font-thin">
                {String(item.value).padStart(2, "0")}
              </div>
              <div className="text-[12px] uppercase tracking-wide text-[#bb7239]">{item.label}</div>
            </div>
          ))}
        </div>
        <p className="text-[16px] mt-10 text-[#bb7239]">{text.deadline}</p>
      </div>
    );
  }

  return (
    <div className="glass p-8 rounded-3xl max-w-3xl mx-auto glow-border">
      <p className="text-sm text-muted-foreground mb-4">{text.timeRemaining}</p>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { value: timeLeft.days, label: text.days },
          { value: timeLeft.hours, label: text.hours },
          { value: timeLeft.minutes, label: text.minutes },
          { value: timeLeft.seconds, label: text.seconds },
        ].map((item, index) => (
          <div key={index} className="text-center">
            <div className={`text-4xl md:text-6xl font-bold ${getColorClass()} mb-2`}>
              {String(item.value).padStart(2, "0")}
            </div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{text.deadline}</p>
    </div>
  );
};

