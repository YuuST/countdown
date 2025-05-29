"use client";
import React, { useEffect, useState } from "react";

interface Config {
  message: string;
  countdownTo: string;
}

export function Countdown({ config }: { config: Config }) {
  const targetDate = new Date(config.countdownTo);
  const [now, setNow] = useState(new Date());
  const [showFirework, setShowFirework] = useState(false);

  useEffect(() => {
    if (now >= targetDate) {
      setShowFirework(true);
      return;
    }
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [now, targetDate]);

  const diff = targetDate.getTime() - now.getTime();
  const isPast = diff <= 0;
  const absDiff = Math.abs(diff);
  const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((absDiff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((absDiff / (1000 * 60)) % 60);
  const seconds = Math.floor((absDiff / 1000) % 60);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-white"
      style={{
        background:
          "linear-gradient(135deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
      }}
    >
      <h1 className="text-4xl font-bold mb-6">Remaining time</h1>
      <div className="text-2xl mb-2">
        {targetDate.toLocaleDateString()} {targetDate.toLocaleTimeString()}
      </div>
      <div className="text-6xl font-mono mb-4">
        {isPast
          ? "00:00:00"
          : `${days}d ${hours.toString().padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`}
      </div>
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
