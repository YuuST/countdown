"use client";
import React, { useEffect, useState } from "react";

interface Config {
  message: string;
  countdownTo: string;
}

export function Countdown({ config }: { config: Config }) {
  // Helper: get the correct salary date for the current or next month
  function getSalaryDate(now: Date, day: number): Date {
    // Clamp day to 1-31
    let inputDay = Math.max(1, Math.min(31, day));
    // Get year/month
    let year = now.getFullYear();
    let month = now.getMonth();
    // Get last day of this month
    let lastDay = new Date(year, month + 1, 0).getDate();
    if (inputDay > lastDay) inputDay = lastDay;
    let salaryDate = new Date(year, month, inputDay, 9, 0, 0, 0); // 9:00 AM
    // If salary date already passed, move to next month
    if (salaryDate < now) {
      month += 1;
      if (month > 11) {
        month = 0;
        year += 1;
      }
      lastDay = new Date(year, month + 1, 0).getDate();
      if (inputDay > lastDay) inputDay = lastDay;
      salaryDate = new Date(year, month, inputDay, 9, 0, 0, 0);
    }
    // If salary date is Sat/Sun, move to previous Friday
    let weekday = salaryDate.getDay();
    if (weekday === 6) salaryDate.setDate(salaryDate.getDate() - 1); // Saturday -> Friday
    if (weekday === 0) salaryDate.setDate(salaryDate.getDate() - 2); // Sunday -> Friday
    return salaryDate;
  }

  // Parse config.countdownTo as a day (1-31)
  let day = 1;
  try {
    const d = new Date(config.countdownTo);
    if (!isNaN(d.getDate())) day = d.getDate();
    // If config.countdownTo is a number string, use it
    if (/^\d{1,2}$/.test(config.countdownTo)) day = parseInt(config.countdownTo, 10);
  } catch {}

  const [now, setNow] = useState(new Date());
  const [showFirework, setShowFirework] = useState(false);
  const [fireworkStart, setFireworkStart] = useState<Date | null>(null);
  const [salaryDate, setSalaryDate] = useState(() => getSalaryDate(new Date(), day));

  // Update salary date if month changes
  useEffect(() => {
    setSalaryDate(getSalaryDate(now, day));
  }, [now, day]);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const diff = salaryDate.getTime() - now.getTime();
    if (diff <= 0 && !showFirework) {
      setShowFirework(true);
      setFireworkStart(new Date());
    }
    if (showFirework && fireworkStart) {
      // After 5 minutes, reset to next month
      const elapsed = now.getTime() - fireworkStart.getTime();
      if (elapsed >= 5 * 60 * 1000) {
        setShowFirework(false);
        setFireworkStart(null);
        setSalaryDate(getSalaryDate(new Date(salaryDate.getFullYear(), salaryDate.getMonth() + 1, 1), day));
      }
    }
  }, [now, salaryDate, showFirework, fireworkStart, day]);

  const diff = salaryDate.getTime() - now.getTime();
  const isPast = diff <= 0;
  const absDiff = Math.abs(diff);
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((absDiff / 1000) % 60);

  // Format date as dd/mm/yyyy
  const formatDate = (date: Date) =>
    `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;

  // If day is 0, hide the countdown/time field
  const hideCountdown = day === 0;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white"
      style={{
        background:
          "linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
      }}
    >
      <h1 className="text-4xl font-bold mb-6">Remaining time</h1>
      {!hideCountdown && (
        <>
          <div className="text-2xl mb-2">
            {formatDate(salaryDate)} {salaryDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            {" "}
            <span className="text-lg font-semibold">(
              {salaryDate.toLocaleDateString(undefined, { weekday: "long" })}
            )</span>
          </div>
          <div className="text-6xl font-mono mb-4">
            {days > 0
              ? `${days}d ${hours.toString().padStart(2, "0")}:${minutes
                  .toString()
                  .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
              : `${hours.toString().padStart(2, "0")}:${minutes
                  .toString()
                  .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
          </div>
        </>
      )}
      <div className="text-xl mb-8">{config.message}</div>
      {showFirework && <FireworkAnimation />}
    </div>
  );
}

function FireworkAnimation() {
  // Simple CSS firework animation
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="firework-container">
        <div className="firework" />
        <div className="firework delay-1" />
        <div className="firework delay-2" />
      </div>
      <style jsx>{`
        .firework-container {
          position: relative;
          width: 300px;
          height: 300px;
        }
        .firework {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 6px;
          height: 120px;
          background: linear-gradient(180deg, #fff 0%, #f0f 100%);
          border-radius: 3px;
          transform: translate(-50%, -50%) scaleY(0);
          animation: firework-burst 1s ease-out forwards;
        }
        .firework.delay-1 {
          animation-delay: 0.3s;
          transform: translate(-50%, -50%) rotate(45deg) scaleY(0);
        }
        .firework.delay-2 {
          animation-delay: 0.6s;
          transform: translate(-50%, -50%) rotate(-45deg) scaleY(0);
        }
        @keyframes firework-burst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scaleY(0);
          }
          80% {
            opacity: 1;
            transform: translate(-50%, -50%) scaleY(1.1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scaleY(1.2);
          }
        }
      `}</style>
    </div>
  );
}
