import { useState, useEffect } from "react";
import { Phone, Facebook, Twitter, Instagram, Linkedin, Youtube, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

    return (
        <div className="bg-gradient-primary text-primary-foreground py-2 border-b border-primary/20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
                    {/* Social Media Icons */}
                    <div className="flex items-center gap-3">
                        <a
                            href="#"
                            className="hover:text-accent transition-colors"
                            aria-label="Facebook"
                        >
                            <Facebook className="w-4 h-4" />
                        </a>
                        <a
                            href="#"
                            className="hover:text-accent transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a
                            href="#"
                            className="hover:text-accent transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a
                            href="#"
                            className="hover:text-accent transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-4 h-4" />
                        </a>
                        <a
                            href="#"
                            className="hover:text-accent transition-colors"
                            aria-label="YouTube"
                        >
                            <Youtube className="w-4 h-4" />
                        </a>
                    </div>

                    {/* News Ticker */}
                    <div className="flex-1 overflow-hidden mx-4 hidden md:block">
                        <div className="relative h-6">
                            <div
                                className="absolute inset-0 flex items-center transition-transform duration-500"
                                style={{ transform: `translateY(-${currentNewsIndex * 24}px)` }}
                            >
                                {newsUpdates.map((news, index) => (
                                    <div
                                        key={index}
                                        className="h-6 flex items-center whitespace-nowrap"
                                    >
                                        <span className="text-accent mr-2">📢</span>
                                        <span className="font-medium">{news}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact & Language */}
                    <div className="flex items-center gap-4">
                        <a
                            href="tel:+917311234567"
                            className="flex items-center gap-2 hover:text-accent transition-colors"
                        >
                            <Phone className="w-4 h-4" />
                            <span className="hidden lg:inline">+91 731-123-4567</span>
                        </a>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 gap-2 text-primary-foreground hover:text-accent hover:bg-primary-foreground/10"
                                >
                                    <Globe className="w-4 h-4" />
                                    <span>{selectedLanguage.flag}</span>
                                    <span className="hidden sm:inline">{selectedLanguage.name}</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {languages.map((lang) => (
                                    <DropdownMenuItem
                                        key={lang.code}
                                        onClick={() => setSelectedLanguage(lang)}
                                        className="cursor-pointer"
                                    >
                                        <span className="mr-2">{lang.flag}</span>
                                        {lang.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopInfoBar;
