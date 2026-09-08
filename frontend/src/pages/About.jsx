import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavLink } from "@/components/NavLink";
import { Heart, Users, Target, Eye, ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-volunteers.jpg";

const values = [
  { icon: Heart, title: "Compassion", description: "Every action we take is driven by genuine care for the people and communities we serve." },
  { icon: Target, title: "Impact-Driven", description: "We measure success by the real, lasting difference we create in people's lives." },
  { icon: Users, title: "Community-Led", description: "We believe communities hold the solutions — our role is to support and amplify their voices." },
  { icon: CheckCircle, title: "Transparency", description: "Full accountability to our donors, volunteers, and beneficiaries in everything we do." },
];
const team = [
  { name: "Ramesh Sharma", role: "Founder & Director", initials: "RS" },
  { name: "Kavita Patel", role: "Program Head – Education", initials: "KP" },
  { name: "Arvind Mishra", role: "Community Relations", initials: "AM" },
  { name: "Priya Joshi", role: "Finance & Compliance", initials: "PJ" },
];
const timeline = [
  { year: "2015", event: "Divy Shrishti founded in Indore with 10 volunteers" },
  { year: "2017", event: "Education for All program launched — 500 students in Year 1" },
  { year: "2019", event: "Expanded to 5 districts; crossed 10,000 beneficiaries" },
  { year: "2021", event: "Digital Literacy & Women Empowerment programs launched" },
  { year: "2023", event: "50,000+ lives touched; 100+ communities served" },
  { year: "2024", event: "National NGO Excellence Award received" },
];

const About = () => (
  <div className="min-h-screen">
    <Navigation />
    <section className="relative pt-0 pb-0">
      <div className="h-80 md:h-96 bg-cover bg-center relative" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">About Us</h1>
          <p className="text-lg text-white/85 max-w-xl animate-slide-up">A decade of compassion, community, and change.</p>
        </div>
      </div>
    </section>
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="border-2 border-primary/20 hover:border-primary transition-colors"><CardContent className="p-8"><div className="w-14 h-14 rounded-full bg-gradient-primary flex items-center justify-center mb-5"><Target className="w-7 h-7 text-white" /></div><h2 className="text-2xl font-bold text-foreground mb-3">Our Mission</h2><p className="text-muted-foreground leading-relaxed">To empower marginalized communities through accessible education, healthcare, and sustainable livelihood opportunities — creating self-reliant individuals and thriving communities across India.</p></CardContent></Card>
          <Card className="border-2 border-accent/20 hover:border-accent transition-colors"><CardContent className="p-8"><div className="w-14 h-14 rounded-full bg-gradient-accent flex items-center justify-center mb-5"><Eye className="w-7 h-7 text-white" /></div><h2 className="text-2xl font-bold text-foreground mb-3">Our Vision</h2><p className="text-muted-foreground leading-relaxed">A just and equitable India where every person — regardless of their background — has the opportunity to live with dignity, access quality education, and reach their full potential.</p></CardContent></Card>
        </div>
        <div className="max-w-3xl mx-auto text-center mb-20"><span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">Our Story</span><h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">From a Small Idea to a Movement</h2><p className="text-muted-foreground text-lg leading-relaxed mb-4">Divy Shrishti was born in 2015 when a group of Indore-based professionals saw the stark educational disparities in surrounding villages and decided to act. What started as weekend tutoring sessions for 30 children quickly grew into a full-fledged organization with programs in education, health, environment, and women empowerment.</p><p className="text-muted-foreground text-lg leading-relaxed">Today, we operate across 5 districts in Madhya Pradesh, with a network of 500+ volunteers, dedicated staff, and community partners — united by one goal: creating a more equitable India.</p></div>
        <div className="text-center mb-10"><span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">What We Stand For</span><h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Core Values</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">{values.map((val, i) => <Card key={i} className="group text-center hover:shadow-large hover:border-primary border-2 transition-all duration-300 animate-scale-in"><CardContent className="p-6"><div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"><val.icon className="w-6 h-6 text-white" /></div><h3 className="font-bold text-foreground text-lg mb-2">{val.title}</h3><p className="text-muted-foreground text-sm leading-relaxed">{val.description}</p></CardContent></Card>)}</div>
      </div>
    </section>
    <section className="py-16 bg-secondary/20"><div className="container mx-auto px-4"><div className="text-center mb-12"><span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">History</span><h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Journey</h2></div><div className="max-w-2xl mx-auto">{timeline.map((item, i) => <div key={i} className="flex gap-6 mb-8 last:mb-0"><div className="flex flex-col items-center"><div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xs shrink-0">{item.year.slice(2)}</div>{i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-primary/20 mt-2" />}</div><div className="pb-8"><p className="font-bold text-primary mb-1">{item.year}</p><p className="text-foreground">{item.event}</p></div></div>)}</div></div></section>
    <section className="py-16 md:py-24"><div className="container mx-auto px-4"><div className="text-center mb-12"><span className="inline-block text-sm font-semibold text-primary uppercase tracking-widest mb-3">Leadership</span><h2 className="text-3xl md:text-4xl font-bold text-foreground">Meet the Team</h2></div><div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">{team.map((member, i) => <Card key={i} className="text-center hover:shadow-large border-2 hover:border-primary transition-all"><CardContent className="p-6"><div className="w-16 h-16 rounded-full bg-gradient-hero text-white flex items-center justify-center mx-auto mb-4 font-bold text-xl">{member.initials}</div><h3 className="font-bold text-foreground text-sm mb-1">{member.name}</h3><p className="text-muted-foreground text-xs">{member.role}</p></CardContent></Card>)}</div></div></section>
    <section className="py-16 bg-gradient-hero text-primary-foreground"><div className="container mx-auto px-4 text-center"><h2 className="text-3xl md:text-4xl font-bold mb-4">Be Part of Our Story</h2><p className="text-primary-foreground/85 text-lg mb-8 max-w-xl mx-auto">Join us as a volunteer, donor, or partner and help us write the next chapter.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><NavLink to="/get-involved"><Button size="lg" className="bg-background text-foreground hover:bg-background/90 gap-2"><Users className="w-5 h-5" /> Get Involved</Button></NavLink><NavLink to="/contact"><Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary gap-2">Contact Us <ArrowRight className="w-4 h-4" /></Button></NavLink></div></div></section>
    <FloatingButtons /><Footer />
  </div>
);

export default About;
