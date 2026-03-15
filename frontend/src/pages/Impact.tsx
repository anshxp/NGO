import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import ImpactCounter from "@/components/ImpactCounter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
import { Heart, ArrowRight, BookOpen, Leaf, Users, Stethoscope, Award, Globe } from "lucide-react";

const stories = [
  {
    name: "Meena, 14",
    location: "Barwani, MP",
    story: "After joining our Education for All program, Meena went from near-dropout to scoring 92% in her board exams. She now aspires to become a doctor.",
    program: "Education",
    initials: "M",
  },
  {
    name: "Raju's Family",
    location: "Dhar District",
    story: "Through our Community Development program, Raju's village installed a solar water pump, eliminating a 3km daily walk for 200 families.",
    program: "Community",
    initials: "R",
  },
  {
    name: "Sunita Devi, 32",
    location: "Indore Rural",
    story: "Our Women Empowerment program helped Sunita start a self-help group. She now runs a small tailoring enterprise employing 8 women in her village.",
    program: "Empowerment",
    initials: "S",
  },
];

const programImpacts = [
  {
    icon: BookOpen,
    title: "Education",
    stat: "25,000+",
    label: "Students Supported",
    color: "bg-blue-500",
    achievements: ["Free tutoring in 50+ villages", "Digital literacy for 5,000+", "Scholarships for 1,200 students"],
  },
  {
    icon: Users,
    title: "Community Dev",
    stat: "100+",
    label: "Communities Transformed",
    color: "bg-green-500",
    achievements: ["Solar energy in 30 villages", "100+ community gardens", "Clean water access for 20,000"],
  },
  {
    icon: Stethoscope,
    title: "Health",
    stat: "50,000+",
    label: "Health Screenings",
    color: "bg-red-500",
    achievements: ["80 free health camps", "Mental health support", "Malnutrition programs for 3,000+"],
  },
  {
    icon: Leaf,
    title: "Environment",
    stat: "10,000",
    label: "Trees Planted",
    color: "bg-teal-500",
    achievements: ["Waste management in 20 towns", "Eco-education for 8,000 kids", "3 river clean-up drives"],
  },
];

const awards = [
  { title: "National NGO Excellence Award", year: "2024", org: "Ministry of Social Justice" },
  { title: "Best Community Initiative", year: "2023", org: "NITI Aayog" },
  { title: "Education Champion Award", year: "2022", org: "UNICEF India" },
];

const Impact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="pt-20 pb-16 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full mb-5">
            Measuring What Matters
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">Our Impact</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto animate-slide-up">
            Numbers tell part of the story. Behind every statistic is a real person whose life has changed for the better.
          </p>
        </div>
      </section>

      {/* Impact Counters */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <ImpactCounter />
        </div>
      </section>

      {/* Program Impact Breakdown */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">By Program</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Impact Across All Areas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programImpacts.map((prog, i) => (
              <Card
                key={i}
                className="group hover:shadow-large border-2 hover:border-primary transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${prog.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <prog.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-1">{prog.title}</h3>
                  <p className="text-3xl font-bold text-primary mb-1">{prog.stat}</p>
                  <p className="text-muted-foreground text-sm mb-4">{prog.label}</p>
                  <ul className="space-y-1.5">
                    {prog.achievements.map((a, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">✓</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">Real People</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Stories of Change</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Every program we run has touched real lives. Here are just a few of those stories.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((s, i) => (
              <Card key={i} className="hover:shadow-large border-2 hover:border-primary transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-hero text-white font-bold text-xl flex items-center justify-center shrink-0">
                      {s.initials}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{s.name}</h3>
                      <p className="text-muted-foreground text-sm">{s.location}</p>
                      <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full mt-1">
                        {s.program}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed italic">"{s.story}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">Recognition</span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Awards & Recognition</h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            {awards.map((award, i) => (
              <Card key={i} className="hover:border-primary border-2 transition-colors">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-accent flex items-center justify-center shrink-0">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{award.title}</p>
                    <p className="text-muted-foreground text-sm">{award.org} • {award.year}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Globe className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Help Us Create More Impact</h2>
          <p className="text-primary-foreground/85 text-lg mb-8 max-w-xl mx-auto">
            Every contribution — big or small — adds to these numbers and changes a real life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink to="/donate">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90 gap-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-500" /> Donate Now
              </Button>
            </NavLink>
            <NavLink to="/get-involved">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2">
                Volunteer <ArrowRight className="w-4 h-4" />
              </Button>
            </NavLink>
          </div>
        </div>
      </section>

      <FloatingButtons />
      <Footer />
    </div>
  );
};

export default Impact;
