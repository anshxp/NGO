import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
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
    return (_jsxs(_Fragment, { children: [_jsx(TopInfoBar, {}), _jsxs("header", { className: `sticky top-0 z-50 transition-all duration-300 ${scrolled
                    ? "bg-background/95 backdrop-blur-md shadow-medium border-b border-border"
                    : "bg-background border-b border-border"}`, children: [_jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "flex items-center justify-between h-16", children: [_jsxs(NavLink, { to: "/", className: "flex items-center gap-3 group", children: [_jsx("img", { src: logo, alt: "Divy Shrishti NGO", className: "h-12 w-auto object-contain" }), _jsxs("div", { className: "hidden sm:block", children: [_jsx("p", { className: "font-bold text-foreground text-base leading-tight", children: "Divy Shrishti" }), _jsx("p", { className: "text-muted-foreground text-xs leading-tight", children: "Foundation" })] })] }), _jsx("nav", { className: "hidden lg:flex items-center gap-1", children: navLinks.map((link) => (_jsx("a", { href: link.href, onClick: (e) => { e.preventDefault(); window.history.pushState({}, '', link.href); window.dispatchEvent(new PopStateEvent('popstate')); }, className: "px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary hover:bg-secondary transition-colors", children: link.label }, link.href))) }), _jsx("div", { className: "hidden lg:flex items-center gap-3", children: _jsx(NavLink, { to: "/donate", children: _jsxs(Button, { className: "bg-gradient-accent hover:opacity-90 text-primary-foreground gap-2 shadow-soft", children: [_jsx(Heart, { className: "w-4 h-4" }), "Donate Now"] }) }) }), _jsx("button", { className: "lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors", onClick: () => setIsOpen(!isOpen), "aria-label": "Toggle menu", children: isOpen ? _jsx(X, { className: "w-6 h-6" }) : _jsx(Menu, { className: "w-6 h-6" }) })] }) }), isOpen && (_jsx("div", { className: "lg:hidden border-t border-border bg-background animate-fade-in", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex flex-col gap-2", children: [navLinks.map((link) => (_jsx(NavLink, { to: link.href, className: "px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:text-primary hover:bg-secondary transition-colors", onClick: () => setIsOpen(false), children: link.label }, link.href))), _jsx(NavLink, { to: "/donate", onClick: () => setIsOpen(false), children: _jsxs(Button, { className: "w-full mt-2 bg-gradient-accent hover:opacity-90 text-primary-foreground gap-2", children: [_jsx(Heart, { className: "w-4 h-4" }), "Donate Now"] }) })] }) }))] })] }));
};
export default Navigation;
