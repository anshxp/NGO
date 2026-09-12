import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    const handleWayClick = (interest) => {
        setFormData(prev => ({ ...prev, interest: interest.toLowerCase() }));
        setTimeout(() => document.getElementById("form-section")?.scrollIntoView({ behavior: "smooth" }), 100);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading)
            return;
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
        }
        catch (error) {
            toast.error(error?.response?.data?.error || "Failed to submit form. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    const ways = [
        { icon: _jsx(Users, { className: "w-8 h-8" }), title: "Volunteer", description: "Join our community of passionate volunteers and contribute your time and skills to meaningful projects.", features: ["Flexible scheduling", "Training provided", "Community of changemakers", "Personal growth opportunities"], cta: "Become a Volunteer" },
        { icon: _jsx(Heart, { className: "w-8 h-8" }), title: "Donate", description: "Your financial support helps us expand our reach and deepen our impact across communities.", features: ["Tax deductible donations", "100% transparency", "Monthly giving options", "Impact reports"], cta: "Make a Donation" },
        { icon: _jsx(Briefcase, { className: "w-8 h-8" }), title: "Internships", description: "Gain real-world experience with meaningful projects while contributing to social impact.", features: ["Hands-on projects", "Mentorship from experts", "Certificate of completion", "Career development"], cta: "Apply for Internship" },
        { icon: _jsx(Briefcase, { className: "w-8 h-8" }), title: "Join Our Team", description: "Work with us full-time or as an intern and make social impact your career.", features: ["Purpose-driven work", "Collaborative culture", "Learning opportunities", "Competitive benefits"], cta: "View Openings" },
    ];
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Navigation, {}), _jsx("section", { className: "pt-32 pb-16 md:pb-24 bg-gradient-hero", children: _jsxs("div", { className: "container mx-auto px-4 text-center", children: [_jsx("h1", { className: "text-4xl md:text-6xl font-bold mb-6 text-primary-foreground animate-fade-in", children: "Get Involved" }), _jsx("p", { className: "text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto animate-slide-up", children: "There are many ways to contribute to our mission. Find the one that fits your passion and availability." })] }) }), _jsx("section", { className: "py-16 md:py-24", children: _jsx("div", { className: "container mx-auto px-4", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto", children: ways.map((way, index) => _jsx(Card, { className: "border-2 hover:border-primary transition-all duration-300 hover:shadow-large animate-scale-in", style: { animationDelay: `${index * 100}ms` }, children: _jsxs(CardContent, { className: "p-8", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center mb-6 shadow-medium", children: way.icon }), _jsx("h2", { className: "text-2xl font-bold mb-3 text-foreground", children: way.title }), _jsx("p", { className: "text-muted-foreground mb-6 leading-relaxed", children: way.description }), _jsx("ul", { className: "space-y-2 mb-6", children: way.features.map(feature => _jsxs("li", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" }), _jsx("span", { children: feature })] }, feature)) }), _jsxs(Button, { onClick: () => way.title === "Donate" ? navigate("/donate") : handleWayClick(way.title), className: "w-full bg-gradient-accent hover:opacity-90 transition-opacity group", children: [way.cta, _jsx(ArrowRight, { className: "ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" })] })] }) }, way.title)) }) }) }), _jsx("section", { id: "form-section", className: "py-16 md:py-24 bg-secondary/30", children: _jsx("div", { className: "container mx-auto px-4", children: _jsx("div", { className: "max-w-2xl mx-auto", children: _jsx(Card, { className: "border-2 shadow-large", children: _jsxs(CardContent, { className: "p-8 md:p-12", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-3xl font-bold mb-4 text-foreground", children: "Express Your Interest" }), _jsx("p", { className: "text-muted-foreground", children: "Fill out this form and we'll get back to you with next steps." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Full Name *" }), _jsx(Input, { id: "name", required: true, maxLength: 100, value: formData.name, onChange: e => setFormData({ ...formData, name: e.target.value }), placeholder: "Your name", className: "mt-2" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "email", children: "Email Address *" }), _jsx(Input, { id: "email", type: "email", required: true, maxLength: 254, value: formData.email, onChange: e => setFormData({ ...formData, email: e.target.value }), placeholder: "you@example.com", className: "mt-2" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "phone", children: "Phone Number" }), _jsx(Input, { id: "phone", type: "tel", maxLength: 30, value: formData.phone, onChange: e => setFormData({ ...formData, phone: e.target.value }), placeholder: "+91 9876543210", className: "mt-2" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "interest", children: "I'm interested in *" }), _jsxs("select", { id: "interest", required: true, value: formData.interest, onChange: e => setFormData({ ...formData, interest: e.target.value }), className: "w-full mt-2 px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring", children: [_jsx("option", { value: "volunteer", children: "Volunteering" }), _jsx("option", { value: "donate", children: "Making a Donation" }), _jsx("option", { value: "partner", children: "Partnership Opportunities" }), _jsx("option", { value: "career", children: "Career Opportunities" })] })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "message", children: "Message" }), _jsx(Textarea, { id: "message", maxLength: 2000, value: formData.message, onChange: e => setFormData({ ...formData, message: e.target.value }), placeholder: "Tell us more about your interest...", rows: 4, className: "mt-2" })] }), _jsx(Button, { type: "submit", size: "lg", disabled: loading, className: "w-full bg-gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50", children: loading ? "Submitting..." : "Submit" })] })] }) }) }) }) }), _jsx("section", { className: "py-16 md:py-24", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [_jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-8 text-foreground", children: "Why Get Involved?" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [["1", "Make Real Impact", "See the direct results of your contributions in communities and lives."], ["2", "Grow as a Leader", "Develop skills, build networks, and gain experience in social impact."], ["3", "Join a Community", "Connect with like-minded people who share your passion for change."]].map(([number, title, text]) => _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto font-bold text-xl", children: number }), _jsx("h3", { className: "text-xl font-bold text-foreground", children: title }), _jsx("p", { className: "text-muted-foreground", children: text })] }, number)) })] }) }) }), _jsx(Footer, {})] }));
};
export default GetInvolved;
