import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, FileText, Award, Heart } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const QuickLinksSection = () => {
    const quickLinks = [
        {
            title: "Generate ID Card",
            description: "Get your member ID card instantly",
            icon: <CreditCard className="w-8 h-8" />,
            link: "/membership",
            gradient: "from-primary to-primary/80",
        },
        {
            title: "Appointment Letter",
            description: "Download appointment documents",
            icon: <FileText className="w-8 h-8" />,
            link: "/get-involved",
            gradient: "from-accent to-accent/80",
        },
        {
            title: "Generate Certificate",
            description: "Access your certificates",
            icon: <Award className="w-8 h-8" />,
            link: "/impact",
            gradient: "from-primary to-accent",
        },
        {
            title: "Donate Us",
            description: "Support our mission",
            icon: <Heart className="w-8 h-8" />,
            link: "/donate",
            gradient: "from-accent to-primary",
        },
    ];

    return (
        <section className="py-12 bg-secondary/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                        Quick Access
                    </h2>
                    <p className="text-muted-foreground">
                        Fast access to essential services and resources
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickLinks.map((link, index) => (
                        <NavLink key={index} to={link.link}>
                            <Card className="group overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-large cursor-pointer h-full">
                                <CardContent className="p-6 text-center">
                                    <div
                                        className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${link.gradient} flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform duration-300 shadow-medium`}
                                    >
                                        {link.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                                        {link.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {link.description}
                                    </p>
                                </CardContent>
                            </Card>
                        </NavLink>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default QuickLinksSection;
