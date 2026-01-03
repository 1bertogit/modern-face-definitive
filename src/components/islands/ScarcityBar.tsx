import { useEffect, useState } from 'react';

interface ScarcityBarProps {
  percentage: number;
  label: string;
  subLabel?: string;
  animate?: boolean;
  variant?: 'default' | 'minimal';
}

export default function ScarcityBar({
  percentage,
  label,
  subLabel,
  animate = true,
  variant = 'default',
}: ScarcityBarProps) {
  const [currentPercentage, setCurrentPercentage] = useState(animate ? 0 : percentage);

  useEffect(() => {
    if (!animate) return;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentPercentage((prev) => {
          if (prev >= percentage) {
            clearInterval(interval);
            return percentage;
          }
          return prev + 1;
        });
      }, 20);

      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(timer);
  }, [percentage, animate]);

  if (variant === 'minimal') {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
            {label}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-accent-500">
            {currentPercentage}% vendido
          </span>
        </div>

        <div className="relative h-[2px] bg-gray-200">
          <div
            className="absolute inset-y-0 left-0 bg-accent-500 transition-all duration-700 ease-out"
            style={{ width: `${currentPercentage}%` }}
          />
        </div>

        {subLabel && (
          <p className="mt-3 text-xs text-gray-500">{subLabel}</p>
        )}
      </div>
    );
  }

  return (
    <div className="w-full py-6 border-t border-b border-white/10">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
          {label}
        </span>
        <span className="text-sm font-medium text-accent-400">
          {currentPercentage}% vendido
        </span>
      </div>

      <div className="relative h-[2px] bg-white/10">
        <div
          className="absolute inset-y-0 left-0 bg-accent-500 transition-all duration-700 ease-out"
          style={{ width: `${currentPercentage}%` }}
        />
      </div>

      {subLabel && (
        <p className="mt-4 text-xs text-gray-500">{subLabel}</p>
      )}
    </div>
  );
}
