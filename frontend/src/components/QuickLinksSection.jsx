import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, FileText, Award, Heart } from "lucide-react";
import { NavLink } from "@/components/NavLink";
const QuickLinksSection = () => {
    const quickLinks = [
        {
            title: "Generate ID Card",
            description: "Get your member ID card instantly",
            icon: _jsx(CreditCard, { className: "w-8 h-8" }),
            link: "/membership",
            gradient: "from-primary to-primary/80",
        },
        {
            title: "Appointment Letter",
            description: "Download appointment documents",
            icon: _jsx(FileText, { className: "w-8 h-8" }),
            link: "/get-involved",
            gradient: "from-accent to-accent/80",
        },
        {
            title: "Generate Certificate",
            description: "Access your certificates",
            icon: _jsx(Award, { className: "w-8 h-8" }),
            link: "/impact",
            gradient: "from-primary to-accent",
        },
        {
            title: "Donate Us",
            description: "Support our mission",
            icon: _jsx(Heart, { className: "w-8 h-8" }),
            link: "/donate",
            gradient: "from-accent to-primary",
        },
    ];
    return (_jsx("section", { className: "py-12 bg-secondary/30", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-2xl md:text-3xl font-bold text-foreground mb-2", children: "Quick Access" }), _jsx("p", { className: "text-muted-foreground", children: "Fast access to essential services and resources" })] }), _jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6", children: quickLinks.map((link, index) => (_jsx(NavLink, { to: link.link, children: _jsx(Card, { className: "group overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-large cursor-pointer h-full", children: _jsxs(CardContent, { className: "p-6 text-center", children: [_jsx("div", { className: `w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${link.gradient} flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform duration-300 shadow-medium`, children: link.icon }), _jsx("h3", { className: "text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors", children: link.title }), _jsx("p", { className: "text-sm text-muted-foreground", children: link.description })] }) }) }, index))) })] }) }));
};
export default QuickLinksSection;
