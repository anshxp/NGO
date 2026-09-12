import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { enquiryAPI } from "@/lib/apiClient";
const Contact = () => {
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await enquiryAPI.submitEnquiry(formData);
            if (response.data?.success !== false) {
                toast.success("Thank you for your message! We'll get back to you soon.");
                setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
            }
        }
        catch (error) {
            console.error("Error submitting enquiry:", error);
            toast.error(error.response?.data?.error || error.message || "Failed to submit message. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    const contactInfo = [
        { icon: _jsx(MapPin, { className: "w-6 h-6" }), title: "Visit Us", details: ["Indore, Madhya Pradesh", "India"] },
        { icon: _jsx(Phone, { className: "w-6 h-6" }), title: "Call Us", details: ["+91 (731) 123-4567", "+91 (731) 123-4568"] },
        { icon: _jsx(Mail, { className: "w-6 h-6" }), title: "Email Us", details: ["info@divysrishti.org", "volunteer@divysrishti.org"] },
        { icon: _jsx(Clock, { className: "w-6 h-6" }), title: "Office Hours", details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 2:00 PM"] },
    ];
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Navigation, {}), _jsx("section", { className: "pt-32 pb-16 md:pb-24 bg-gradient-primary", children: _jsxs("div", { className: "container mx-auto px-4 text-center", children: [_jsx("h1", { className: "text-4xl md:text-6xl font-bold mb-6 text-primary-foreground animate-fade-in", children: "Contact Us" }), _jsx("p", { className: "text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto animate-slide-up", children: "Have questions or want to learn more? We'd love to hear from you." })] }) }), _jsx("section", { className: "py-16 md:py-24", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16", children: contactInfo.map((info, index) => (_jsx(Card, { className: "text-center hover:shadow-medium transition-shadow animate-scale-in", style: { animationDelay: `${index * 100}ms` }, children: _jsxs(CardContent, { className: "p-6", children: [_jsx("div", { className: "w-14 h-14 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4", children: info.icon }), _jsx("h3", { className: "text-lg font-bold mb-3 text-foreground", children: info.title }), _jsx("div", { className: "space-y-1", children: info.details.map((detail, idx) => _jsx("p", { className: "text-sm text-muted-foreground", children: detail }, idx)) })] }) }, index))) }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto", children: [_jsx(Card, { className: "border-2 shadow-large", children: _jsxs(CardContent, { className: "p-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-foreground", children: "Send Us a Message" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [_jsxs("div", { children: [_jsx(Label, { htmlFor: "name", children: "Your Name *" }), _jsx(Input, { id: "name", required: true, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), placeholder: "John Doe", className: "mt-2" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "email", children: "Your Email *" }), _jsx(Input, { id: "email", type: "email", required: true, value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), placeholder: "you@example.com", className: "mt-2" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "phone", children: "Phone (Optional)" }), _jsx(Input, { id: "phone", type: "tel", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), placeholder: "+91 XXXXX XXXXX", className: "mt-2" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "subject", children: "Subject *" }), _jsx(Input, { id: "subject", required: true, value: formData.subject, onChange: (e) => setFormData({ ...formData, subject: e.target.value }), placeholder: "How can we help?", className: "mt-2" })] }), _jsxs("div", { children: [_jsx(Label, { htmlFor: "message", children: "Message *" }), _jsx(Textarea, { id: "message", required: true, value: formData.message, onChange: (e) => setFormData({ ...formData, message: e.target.value }), placeholder: "Tell us more about your inquiry...", rows: 5, className: "mt-2" })] }), _jsxs(Button, { type: "submit", size: "lg", disabled: loading, className: "w-full bg-gradient-primary hover:opacity-90 transition-opacity group disabled:opacity-50", children: [loading ? "Sending..." : "Send Message", _jsx(Send, { className: "ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" })] })] })] }) }), _jsxs("div", { className: "space-y-6", children: [_jsx(Card, { className: "border-2 overflow-hidden", children: _jsx("div", { className: "h-64 bg-secondary flex items-center justify-center", children: _jsxs("div", { className: "text-center p-8", children: [_jsx(MapPin, { className: "w-12 h-12 mx-auto mb-4 text-primary" }), _jsx("p", { className: "text-sm text-muted-foreground mb-2", children: "Interactive Map" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Indore, Madhya Pradesh, India" })] }) }) }), _jsx(Card, { className: "border-2", children: _jsxs(CardContent, { className: "p-8", children: [_jsx("h3", { className: "text-xl font-bold mb-4 text-foreground", children: "Quick Links" }), _jsxs("ul", { className: "space-y-3", children: [_jsx("li", { children: _jsx("a", { href: "#", className: "text-primary hover:underline font-medium", children: "Volunteer Application Form \u2192" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "text-primary hover:underline font-medium", children: "Partnership Inquiry \u2192" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "text-primary hover:underline font-medium", children: "Media & Press Kit \u2192" }) }), _jsx("li", { children: _jsx("a", { href: "#", className: "text-primary hover:underline font-medium", children: "Frequently Asked Questions \u2192" }) })] })] }) }), _jsx(Card, { className: "border-2 bg-gradient-accent text-accent-foreground", children: _jsxs(CardContent, { className: "p-6", children: [_jsx("h3", { className: "text-lg font-bold mb-2", children: "Need Immediate Assistance?" }), _jsx("p", { className: "text-sm mb-4 opacity-90", children: "For urgent matters, please call our hotline:" }), _jsx("p", { className: "text-2xl font-bold", children: "+91 (731) 123-4567" })] }) })] })] })] }) }), _jsx(Footer, {})] }));
};
export default Contact;
