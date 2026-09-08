import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Leaf, Code, Heart, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import educationImage from "@/assets/program-education.jpg";
import communityImage from "@/assets/program-community.jpg";
import leadershipImage from "@/assets/program-leadership.jpg";

const Programs = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const filters = [
    { id: "all", label: "All Programs" },
    { id: "education", label: "Education" },
    { id: "community", label: "Community" },
    { id: "leadership", label: "Leadership" },
  ];
  const programs = [
    { category: "education", title: "Education for All", description: "Comprehensive education support including tutoring, mentorship, and learning resources for underprivileged children. We focus on foundational literacy, STEM education, and holistic development.", image: educationImage, icon: <BookOpen className="w-6 h-6" />, impact: "25,000+ students supported annually", cta: "Join as Tutor" },
    { category: "education", title: "Digital Literacy", description: "Bridging the digital divide by teaching computer skills, internet safety, and digital citizenship to children and adults in underserved communities.", image: educationImage, icon: <Code className="w-6 h-6" />, impact: "5,000+ trained in digital skills", cta: "Teach Tech Skills" },
    { category: "community", title: "Community Development", description: "Grassroots initiatives focused on environmental sustainability, neighborhood improvement, and civic engagement. We empower communities to lead their own development.", image: communityImage, icon: <Leaf className="w-6 h-6" />, impact: "100+ communities transformed", cta: "Start a Project" },
    { category: "community", title: "Health & Wellness", description: "Health awareness campaigns, free health check-ups, mental health support, and nutrition programs for marginalized communities.", image: communityImage, icon: <Heart className="w-6 h-6" />, impact: "50,000+ health screenings conducted", cta: "Volunteer in Health" },
    { category: "leadership", title: "Leadership Development", description: "Intensive training programs designed to cultivate the next generation of social leaders through workshops, mentorship, and real-world project experience.", image: leadershipImage, icon: <Users className="w-6 h-6" />, impact: "3,000+ leaders trained", cta: "Join Leadership Track" },
    { category: "leadership", title: "Youth Empowerment", description: "Programs focused on building confidence, communication skills, and career readiness among youth from disadvantaged backgrounds.", image: leadershipImage, icon: <Sparkles className="w-6 h-6" />, impact: "10,000+ youth empowered", cta: "Mentor Youth" },
  ];
  const filteredPrograms = activeFilter === "all" ? programs : programs.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="pt-32 pb-16 md:pb-24 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground">Our Programs</h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto">Comprehensive initiatives designed to create lasting impact in education, community development, and leadership.</p>
        </div>
      </section>
      <section className="py-8 bg-card border-b border-border sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((filter) => (
              <Button key={filter.id} onClick={() => setActiveFilter(filter.id)} variant={activeFilter === filter.id ? "default" : "outline"} className={activeFilter === filter.id ? "bg-gradient-primary" : ""}>{filter.label}</Button>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program, index) => (
              <Card key={index} className="group overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-large">
                <div className="relative h-56 overflow-hidden">
                  <img src={program.image} alt={program.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-large">{program.icon}</div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{program.title}</h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{program.description}</p>
                  <div className="flex items-center gap-2 mb-4 text-sm text-primary font-medium"><TrendingUp className="w-4 h-4" /><span>{program.impact}</span></div>
                  <Button onClick={() => document.getElementById("get-involved")?.scrollIntoView({ behavior: "smooth" })} className="w-full bg-gradient-accent hover:opacity-90 transition-opacity group/btn">{program.cta}<ArrowRight className="ml-2 w-4 h-4" /></Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section id="get-involved" className="py-16 md:py-24 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-primary-foreground">Can't Find What You're Looking For?</h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 mb-8">We're always expanding our programs based on community needs. Share your ideas or get in touch to learn more.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <NavLink to="/get-involved"><Button size="lg" className="bg-background text-foreground hover:bg-background/90">Get Involved</Button></NavLink>
              <NavLink to="/contact"><Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">Contact Us</Button></NavLink>
            </div>
          </div>
        </div>
      </section>
      <FloatingButtons />
      <Footer />
    </div>
  );
};

export default Programs;
