import { Heart, Users, Sprout, GraduationCap, Home, Leaf } from "lucide-react";

const ProgramSections = () => {
    const programs = [
        {
            title: "Health Empowerment",
            icon: <Heart className="w-12 h-12 text-primary" />,
            points: [
                "Free medical checkups and health camps in rural and urban areas",
                "Distribution of medicines and health awareness programs",
                "Mental health counseling and support services",
                "Nutrition and wellness workshops for communities",
            ],
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
        },
        {
            title: "Rural Empowerment",
            icon: <Home className="w-12 h-12 text-accent" />,
            points: [
                "Skill development programs for rural youth and adults",
                "Agricultural training and sustainable farming techniques",
                "Infrastructure development and community building projects",
                "Financial literacy and microfinance support programs",
            ],
            image: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
        },
        {
            title: "Women Empowerment",
            icon: <Users className="w-12 h-12 text-primary" />,
            points: [
                "Vocational training and entrepreneurship development",
                "Self-defense workshops and legal awareness programs",
                "Leadership development and confidence building sessions",
                "Support groups and mentorship programs for women",
            ],
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
        },
        {
            title: "Youth Empowerment",
            icon: <Sprout className="w-12 h-12 text-accent" />,
            points: [
                "Leadership training and personality development programs",
                "Career guidance and skill enhancement workshops",
                "Sports and cultural activities for holistic development",
                "Volunteer opportunities and community service projects",
            ],
            image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1200&q=80",
        },
        {
            title: "Environmental Help",
            icon: <Leaf className="w-12 h-12 text-primary" />,
            points: [
                "Tree plantation drives and afforestation programs",
                "Waste management and recycling awareness campaigns",
                "Clean water initiatives and conservation projects",
                "Climate change awareness and sustainable living workshops",
            ],
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
        },
        {
            title: "Education Empowerment",
            icon: <GraduationCap className="w-12 h-12 text-accent" />,
            points: [
                "Free education and tutoring for underprivileged children",
                "Distribution of books, uniforms, and learning materials",
                "Digital literacy programs and computer training",
                "Scholarship programs and educational support services",
            ],
            image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
        },
    ];

    return (
        <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
                        Our Empowerment Programs
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                        Comprehensive initiatives designed to create lasting change across multiple sectors of society
                    </p>
                </div>

                <div className="space-y-16">
                    {programs.map((program, index) => (
                        <div
                            key={index}
                            className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                } gap-8 items-center`}
                        >
                            {/* Image */}
                            <div className="w-full lg:w-1/2">
                                <div className="relative overflow-hidden rounded-xl shadow-large group">
                                    <img
                                        src={program.image}
                                        alt={program.title}
                                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="w-full lg:w-1/2">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground shadow-medium">
                                        {program.icon}
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                                        {index + 1}. {program.title}
                                    </h3>
                                </div>
                                <div className="space-y-3">
                                    {program.points.map((point, pointIndex) => (
                                        <div key={pointIndex} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-xs font-bold text-primary">
                                                    {pointIndex + 1}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">
                                                {point}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProgramSections;
