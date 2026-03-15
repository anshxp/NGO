import { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Link } from "react-router-dom";
import TopInfoBar from "@/components/TopInfoBar";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Programs", href: "/programs" },
  { label: "Impact", href: "/impact" },
  { label: "Get Involved", href: "/get-involved" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <TopInfoBar />
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-medium border-b border-border"
            : "bg-background border-b border-border"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <NavLink to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="Divy Shrishti NGO" className="h-12 w-auto object-contain" />
              <div className="hidden sm:block">
                <p className="font-bold text-foreground text-base leading-tight">Divy Shrishti</p>
                <p className="text-muted-foreground text-xs leading-tight">Foundation</p>
              </div>
            </NavLink>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', link.href); window.dispatchEvent(new PopStateEvent('popstate')); }}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-secondary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <NavLink to="/donate">
                <Button className="bg-gradient-accent hover:opacity-90 text-primary-foreground gap-2 shadow-soft">
                  <Heart className="w-4 h-4" />
                  Donate Now
                </Button>
              </NavLink>
            </div>

            <button
              className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden border-t border-border bg-background animate-fade-in">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <NavLink to="/donate" onClick={() => setIsOpen(false)}>
                <Button className="w-full mt-2 bg-gradient-accent hover:opacity-90 text-primary-foreground gap-2">
                  <Heart className="w-4 h-4" />
                  Donate Now
                </Button>
              </NavLink>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Navigation;
