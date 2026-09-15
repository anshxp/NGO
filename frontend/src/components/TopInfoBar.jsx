import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Phone, Facebook, Twitter, Instagram, Linkedin, Youtube, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
const TopInfoBar = () => {
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
    const newsUpdates = [
        "New Health Camp organized in Rural Areas - 500+ beneficiaries served",
        "Women Empowerment Workshop scheduled for Dec 20th - Register Now!",
        "Environmental Drive: 10,000 trees planted this month",
        "Youth Leadership Program applications now open",
        "Free Education Materials distributed to 200 children",
    ];
    const languages = [
        { code: "en", name: "English", flag: "🇬🇧" },
        { code: "hi", name: "हिंदी", flag: "🇮🇳" },
        { code: "mr", name: "मराठी", flag: "🇮🇳" },
    ];
    const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentNewsIndex((prev) => (prev + 1) % newsUpdates.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [newsUpdates.length]);
    return (_jsx("div", { className: "bg-gradient-primary text-primary-foreground py-2 border-b border-primary/20", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-2 text-sm", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("a", { href: "#", className: "hover:text-accent transition-colors", "aria-label": "Facebook", children: _jsx(Facebook, { className: "w-4 h-4" }) }), _jsx("a", { href: "#", className: "hover:text-accent transition-colors", "aria-label": "Twitter", children: _jsx(Twitter, { className: "w-4 h-4" }) }), _jsx("a", { href: "#", className: "hover:text-accent transition-colors", "aria-label": "Instagram", children: _jsx(Instagram, { className: "w-4 h-4" }) }), _jsx("a", { href: "#", className: "hover:text-accent transition-colors", "aria-label": "LinkedIn", children: _jsx(Linkedin, { className: "w-4 h-4" }) }), _jsx("a", { href: "#", className: "hover:text-accent transition-colors", "aria-label": "YouTube", children: _jsx(Youtube, { className: "w-4 h-4" }) })] }), _jsx("div", { className: "flex-1 overflow-hidden mx-4 hidden md:block", children: _jsx("div", { className: "relative h-6", children: _jsx("div", { className: "absolute inset-0 flex items-center transition-transform duration-500", style: { transform: `translateY(-${currentNewsIndex * 24}px)` }, children: newsUpdates.map((news, index) => (_jsxs("div", { className: "h-6 flex items-center whitespace-nowrap", children: [_jsx("span", { className: "text-accent mr-2", children: "\uD83D\uDCE2" }), _jsx("span", { className: "font-medium", children: news })] }, index))) }) }) }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("a", { href: "tel:+917311234567", className: "flex items-center gap-2 hover:text-accent transition-colors", children: [_jsx(Phone, { className: "w-4 h-4" }), _jsx("span", { className: "hidden lg:inline", children: "+91 731-123-4567" })] }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 gap-2 text-primary-foreground hover:text-accent hover:bg-primary-foreground/10", children: [_jsx(Globe, { className: "w-4 h-4" }), _jsx("span", { children: selectedLanguage.flag }), _jsx("span", { className: "hidden sm:inline", children: selectedLanguage.name })] }) }), _jsx(DropdownMenuContent, { align: "end", children: languages.map((lang) => (_jsxs(DropdownMenuItem, { onClick: () => setSelectedLanguage(lang), className: "cursor-pointer", children: [_jsx("span", { className: "mr-2", children: lang.flag }), lang.name] }, lang.code))) })] })] })] }) }) }));
};
export default TopInfoBar;
