import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsUpdate {
    id: number;
    title: string;
    timestamp: string;
    category: string;
}

const NewsUpdatesWidget = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);

    const newsUpdates: NewsUpdate[] = [
        {
            id: 1,
            title: "New Health Camp organized in Rural Areas - 500+ beneficiaries served",
            timestamp: "2 hours ago",
            category: "Health",
        },
        {
            id: 2,
            title: "Women Empowerment Workshop scheduled for Dec 20th",
            timestamp: "5 hours ago",
            category: "Events",
        },
        {
            id: 3,
            title: "Environmental Drive: 10,000 trees planted this month",
            timestamp: "1 day ago",
            category: "Environment",
        },
        {
            id: 4,
            title: "Youth Leadership Program applications now open",
            timestamp: "2 days ago",
            category: "Education",
        },
        {
            id: 5,
            title: "Free Education Materials distributed to 200 children",
            timestamp: "3 days ago",
            category: "Education",
        },
    ];

    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setScrollPosition((prev) => (prev + 1) % newsUpdates.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [isPaused, newsUpdates.length]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-24 right-4 z-40 w-80 md:w-96 animate-slide-up">
            <Card className="border-2 border-primary shadow-large overflow-hidden">
                <div className="bg-gradient-primary text-primary-foreground p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        <h3 className="font-bold">News & Updates</h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsVisible(false)}
                        className="h-6 w-6 p-0 text-primary-foreground hover:bg-primary-foreground/20"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>
                <CardContent
                    className="p-0 h-64 overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div
                        className="transition-transform duration-500"
                        style={{ transform: `translateY(-${scrollPosition * 80}px)` }}
                    >
                        {newsUpdates.map((update) => (
                            <div
                                key={update.id}
                                className="p-4 border-b border-border hover:bg-secondary/50 transition-colors cursor-pointer h-20"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-foreground line-clamp-2">
                                            {update.title}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                                                {update.category}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {update.timestamp}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <div className="bg-secondary/30 p-2 text-center">
                    <p className="text-xs text-muted-foreground">
                        Hover to pause • Auto-scrolling updates
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default NewsUpdatesWidget;
