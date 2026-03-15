import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import heroImage from "@/assets/hero-volunteers.jpg";

const slides = [
  {
    title: "Empowering Communities,\nChanging Lives",
    subtitle: "We work across education, health, and sustainable development to create lasting impact in underserved communities across India.",
    cta: { label: "Our Programs", href: "/programs" },
    cta2: { label: "Donate Now", href: "/donate" },
    image: heroImage,
    badge: "🌱 Transforming 100+ Communities",
  },
  {
    title: "Education For\nEvery Child",
    subtitle: "Providing quality education, digital skills, and mentorship to over 25,000 students every year, regardless of their background.",
    cta: { label: "Learn More", href: "/programs" },
    cta2: { label: "Get Involved", href: "/get-involved" },
    image: heroImage,
    badge: "📚 25,000+ Students Supported",
  },
  {
    title: "Together We Build\nA Better Tomorrow",
    subtitle: "Join thousands of volunteers, donors, and partners who are creating real, measurable change in the communities that need it most.",
    cta: { label: "Join Us", href: "/get-involved" },
    cta2: { label: "Our Impact", href: "/impact" },
    image: heroImage,
    badge: "❤️ 50,000+ Lives Touched",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);
  const slide = slides[current];

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{ backgroundImage: `url(${slide.image})` }}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-transparent" />

      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6 animate-fade-in">
            <span className="text-sm font-medium text-white">{slide.badge}</span>
          </div>

          {/* Title */}
          <h1
            key={current + "title"}
            className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 animate-slide-up whitespace-pre-line"
          >
            {slide.title}
          </h1>

          {/* Subtitle */}
          <p
            key={current + "sub"}
            className="text-lg md:text-xl text-white/85 mb-10 leading-relaxed animate-slide-up"
          >
            {slide.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <NavLink to={slide.cta.href}>
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white shadow-large px-8">
                {slide.cta.label}
              </Button>
            </NavLink>
            <NavLink to={slide.cta2.href}>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-foreground px-8"
              >
                {slide.cta2.label}
              </Button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-primary" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
