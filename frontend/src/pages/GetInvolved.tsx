import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Users, Heart, Briefcase, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { enquiryAPI } from "@/lib/apiClient";

const GetInvolved = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", interest: "volunteer", message: "" });
  const [loading, setLoading] = useState(false);

  const handleWayClick = (interest: string) => {
    setFormData(prev => ({ ...prev, interest: interest.toLowerCase() }));
    setTimeout(() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await enquiryAPI.submitEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: `Interest in: ${formData.interest}`,
        message: formData.message.trim(),
      });
      toast.success("Thank you! We'll be in touch soon.");
      setFormData({ name: "", email: "", phone: "", interest: "volunteer", message: "" });
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Failed to submit form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const ways = [
    { icon: <Users className="w-8 h-8" />, title: "Volunteer", description: "Join our community of passionate volunteers and contribute your time and skills to meaningful projects.", features: ["Flexible scheduling", "Training provided", "Community of changemakers", "Personal growth opportunities"], cta: "Become a Volunteer" },
    { icon: <Heart className="w-8 h-8" />, title: "Donate", description: "Your financial support helps us expand our reach and deepen our impact across communities.", features: ["Tax deductible donations", "100% transparency", "Monthly giving options", "Impact reports"], cta: "Make a Donation" },
    { icon: <Briefcase className="w-8 h-8" />, title: "Internships", description: "Gain real-world experience with meaningful projects while contributing to social impact.", features: ["Hands-on projects", "Mentorship from experts", "Certificate of completion", "Career development"], cta: "Apply for Internship" },
    { icon: <Briefcase className="w-8 h-8" />, title: "Join Our Team", description: "Work with us full-time or as an intern and make social impact your career.", features: ["Purpose-driven work", "Collaborative culture", "Learning opportunities", "Competitive benefits"], cta: "View Openings" },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <section className="pt-32 pb-16 md:pb-24 bg-gradient-hero"><div className="container mx-auto px-4 text-center"><h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground animate-fade-in">Get Involved</h1><p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto animate-slide-up">There are many ways to contribute to our mission. Find the one that fits your passion and availability.</p></div></section>
      <section className="py-16 md:py-24"><div className="container mx-auto px-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">{ways.map((way, index) => <Card key={way.title} className="border-2 hover:border-primary transition-all duration-300 hover:shadow-large animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}><CardContent className="p-8"><div className="w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center mb-6 shadow-medium">{way.icon}</div><h2 className="text-2xl font-bold mb-3 text-foreground">{way.title}</h2><p className="text-muted-foreground mb-6 leading-relaxed">{way.description}</p><ul className="space-y-2 mb-6">{way.features.map(feature => <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground"><div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" /><span>{feature}</span></li>)}</ul><Button onClick={() => way.title === "Donate" ? navigate("/donate") : handleWayClick(way.title)} className="w-full bg-gradient-accent hover:opacity-90 transition-opacity group">{way.cta}<ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></Button></CardContent></Card>)}</div></div></section>
      <section id="form-section" className="py-16 md:py-24 bg-secondary/30"><div className="container mx-auto px-4"><div className="max-w-2xl mx-auto"><Card className="border-2 shadow-large"><CardContent className="p-8 md:p-12"><div className="text-center mb-8"><h2 className="text-3xl font-bold mb-4 text-foreground">Express Your Interest</h2><p className="text-muted-foreground">Fill out this form and we'll get back to you with next steps.</p></div><form onSubmit={handleSubmit} className="space-y-6"><div><Label htmlFor="name">Full Name *</Label><Input id="name" required maxLength={100} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your name" className="mt-2" /></div><div><Label htmlFor="email">Email Address *</Label><Input id="email" type="email" required maxLength={254} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="you@example.com" className="mt-2" /></div><div><Label htmlFor="phone">Phone Number</Label><Input id="phone" type="tel" maxLength={30} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 9876543210" className="mt-2" /></div><div><Label htmlFor="interest">I'm interested in *</Label><select id="interest" required value={formData.interest} onChange={e => setFormData({ ...formData, interest: e.target.value })} className="w-full mt-2 px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"><option value="volunteer">Volunteering</option><option value="donate">Making a Donation</option><option value="partner">Partnership Opportunities</option><option value="career">Career Opportunities</option></select></div><div><Label htmlFor="message">Message</Label><Textarea id="message" maxLength={2000} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} placeholder="Tell us more about your interest..." rows={4} className="mt-2" /></div><Button type="submit" size="lg" disabled={loading} className="w-full bg-gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50">{loading ? "Submitting..." : "Submit"}</Button></form></CardContent></Card></div></div></section>
      <section className="py-16 md:py-24"><div className="container mx-auto px-4"><div className="max-w-4xl mx-auto text-center"><h2 className="text-3xl md:text-5xl font-bold mb-8 text-foreground">Why Get Involved?</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{[["1","Make Real Impact","See the direct results of your contributions in communities and lives."],["2","Grow as a Leader","Develop skills, build networks, and gain experience in social impact."],["3","Join a Community","Connect with like-minded people who share your passion for change."]].map(([number,title,text]) => <div key={number} className="space-y-3"><div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-xl">{number}</div><h3 className="text-xl font-bold text-foreground">{title}</h3><p className="text-muted-foreground">{text}</p></div>)}</div></div></div></section>
      <Footer />
    </div>
  );
};

export default GetInvolved;
