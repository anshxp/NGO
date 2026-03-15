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
import { gql } from "@/lib/graphqlClient";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // GraphQL mutation to submit enquiry
      const mutation = `
        mutation SubmitEnquiry($name: String!, $email: String!, $phone: String!, $subject: String!, $message: String!) {
          submitEnquiry(name: $name, email: $email, phone: $phone, subject: $subject, message: $message) {
            success
            message
          }
        }
      `;
      
      const result = await gql(mutation, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "+91",
        subject: formData.subject,
        message: formData.message
      });
      
      if (result.submitEnquiry?.success) {
        toast.success("Thank you for your message! We'll get back to you soon.");
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      }
    } catch (error: any) {
      console.error("Error submitting enquiry:", error);
      toast.error(error.message || "Failed to submit message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      details: ["Indore, Madhya Pradesh", "India"],
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us",
      details: ["+91 (731) 123-4567", "+91 (731) 123-4568"],
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: ["info@divysrishti.org", "volunteer@divysrishti.org"],
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Office Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 2:00 PM"],
    },
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pb-24 bg-gradient-primary">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground animate-fade-in">
            Contact Us
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto animate-slide-up">
            Have questions or want to learn more? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover:shadow-medium transition-shadow animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6">
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center mb-4">
                    {info.icon}
                  </div>
                  <h3 className="text-lg font-bold mb-3 text-foreground">{info.title}</h3>
                  <div className="space-y-1">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Form & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Form */}
            <Card className="border-2 shadow-large">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-foreground">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Your Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone (Optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="How can we help?"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="mt-2"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={loading}
                    className="w-full bg-gradient-primary hover:opacity-90 transition-opacity group disabled:opacity-50"
                  >
                    {loading ? "Sending..." : "Send Message"}
                    <Send className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Map & Info */}
            <div className="space-y-6">
              <Card className="border-2 overflow-hidden">
                <div className="h-64 bg-secondary flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <p className="text-sm text-muted-foreground mb-2">Interactive Map</p>
                    <p className="text-xs text-muted-foreground">
                      Indore, Madhya Pradesh, India
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-foreground">Quick Links</h3>
                  <ul className="space-y-3">
                    <li>
                      <a href="#" className="text-primary hover:underline font-medium">
                        Volunteer Application Form →
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline font-medium">
                        Partnership Inquiry →
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline font-medium">
                        Media & Press Kit →
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-primary hover:underline font-medium">
                        Frequently Asked Questions →
                      </a>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 bg-gradient-accent text-accent-foreground">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-2">Need Immediate Assistance?</h3>
                  <p className="text-sm mb-4 opacity-90">
                    For urgent matters, please call our hotline:
                  </p>
                  <p className="text-2xl font-bold">+91 (731) 123-4567</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
