/**
 * ReadingProgress.tsx
 * Reading progress bar that shows how much of the article has been read
 * Fixed at top of viewport, smooth animation with accent-500 color
 */

import { useState, useEffect } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculateProgress = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      // Show only when scrolled past 50px
      setIsVisible(scrollY > 50);

      // Calculate progress based on article visibility
      const scrollableHeight = articleHeight - windowHeight;
      const articleScrolled = scrollY - articleTop;

      if (articleScrolled <= 0) {
        setProgress(0);
      } else if (articleScrolled >= scrollableHeight) {
        setProgress(100);
      } else {
        setProgress((articleScrolled / scrollableHeight) * 100);
      }
    };

    // Initial calculation
    calculateProgress();

    // Listen for scroll events with passive listener for performance
    window.addEventListener('scroll', calculateProgress, { passive: true });
    window.addEventListener('resize', calculateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', calculateProgress);
      window.removeEventListener('resize', calculateProgress);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 h-1 bg-primary-900/10 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-gradient-to-r from-accent-500 to-accent-400 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
