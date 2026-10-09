import { useEffect, useState, useRef } from "react";

const ImpactCounter = ({
  end = 0,
  duration = 2000,
  suffix = "",
  label = "",
  icon = null,
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  // Keep the displayed and animated values numeric even if a caller passes
  // an omitted or invalid end prop.
  const target = Number.isFinite(Number(end)) ? Number(end) : 0;
  const animationDuration =
    Number.isFinite(Number(duration)) && Number(duration) > 0
      ? Number(duration)
      : 2000;

  useEffect(() => {
    const element = counterRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return undefined;

    const startTime = Date.now();
    const timer = setInterval(() => {
      const progress = Math.min(
        (Date.now() - startTime) / animationDuration,
        1,
      );

      setCount(Math.floor(target * progress));

      if (progress >= 1) clearInterval(timer);
    }, 16);

    return () => clearInterval(timer);
  }, [target, animationDuration, isVisible]);

  return (
    <div ref={counterRef} className="text-center p-6 animate-counter">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-medium">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
        {count.toLocaleString()}
        {suffix}
      </div>
      <div className="text-sm md:text-base text-muted-foreground font-medium">
        {label}
      </div>
    </div>
  );
};

export default ImpactCounter;
