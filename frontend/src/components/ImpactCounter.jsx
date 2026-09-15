import { useEffect, useState, useRef } from "react";

const ImpactCounter = ({ end, duration = 2000, suffix = "", label, icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !isVisible) setIsVisible(true); }, { threshold: 0.1 });
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [isVisible]);
  useEffect(() => {
    if (!isVisible) return;
    const startTime = Date.now(); const endTime = startTime + duration;
    const timer = setInterval(() => {
      const remaining = endTime - Date.now(); const progress = Math.min((duration - remaining) / duration, 1);
      if (remaining <= 0) { setCount(end); clearInterval(timer); } else setCount(Math.floor(end * progress));
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, isVisible]);
  return <div ref={counterRef} className="text-center p-6 animate-counter"><div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-medium">{icon}</div><div className="text-4xl md:text-5xl font-bold text-foreground mb-2">{count.toLocaleString()}{suffix}</div><div className="text-sm md:text-base text-muted-foreground font-medium">{label}</div></div>;
};
export default ImpactCounter;
