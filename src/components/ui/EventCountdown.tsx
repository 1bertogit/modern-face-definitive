import { useState, useEffect } from 'react';

interface EventCountdownProps {
  targetDate: string; // ISO 8601 format
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function useCountdown(targetDate: string): TimeLeft | null {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return null; // Event has passed
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default function EventCountdown({ targetDate, className = '' }: EventCountdownProps) {
  const timeLeft = useCountdown(targetDate);

  if (!timeLeft) {
    return null; // Event has passed or invalid date
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <div className={`flex flex-wrap gap-6 justify-center ${className}`}>
      {timeUnits.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="bg-primary-900 text-white px-6 py-4 rounded-lg min-w-[80px]">
            <p className="text-3xl md:text-4xl font-serif font-normal">{unit.value}</p>
          </div>
          <p className="text-[10px] text-softGray uppercase tracking-[0.2em] font-light mt-2">
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
}

