import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, Calendar } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { campaignAPI } from "@/lib/apiClient";
import { useToast } from "@/components/ui/use-toast";
const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await campaignAPI.getActiveCampaigns();
                setCampaigns(response.data?.campaigns || response.data || []);
            }
            catch (error) {
                console.error('Error fetching campaigns:', error);
                toast({ title: 'Error', description: 'Failed to load campaigns', variant: 'destructive' });
            }
            finally {
                setLoading(false);
            }
        };
        fetchCampaigns();
    }, [toast]);
    const getPercentage = (raised, goal) => goal ? Math.min(100, Math.round((raised / goal) * 100)) : 0;
    return (_jsxs("div", { className: "min-h-screen", children: [_jsx(Navigation, {}), _jsx("section", { className: "pt-32 pb-16 bg-gradient-hero", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [_jsx("h1", { className: "text-4xl md:text-6xl font-bold mb-6 text-primary-foreground", children: "Our Active Campaigns" }), _jsx("p", { className: "text-lg md:text-xl text-primary-foreground/90", children: "Join our ongoing campaigns and make a real difference in the lives of thousands" })] }) }) }), _jsx("section", { className: "py-16 md:py-24", children: _jsx("div", { className: "container mx-auto px-4", children: loading ? _jsx("div", { className: "text-center py-12", children: "Loading campaigns..." }) : campaigns.length === 0 ? _jsxs("div", { className: "text-center py-12 text-muted-foreground", children: [_jsx("p", { children: "No active campaigns at the moment." }), _jsx(NavLink, { to: "/contact", children: _jsx(Button, { variant: "link", children: "Contact us to start one" }) })] }) :
                        _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: campaigns.map((campaign, index) => {
                                const percentage = getPercentage(campaign.raised || 0, campaign.goal || 0);
                                return _jsxs(Card, { className: "overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-large", children: [_jsxs("div", { className: "relative h-64 overflow-hidden", children: [_jsx("img", { src: campaign.imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80", alt: campaign.title, className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" }), _jsx("div", { className: "absolute bottom-4 left-4 right-4", children: _jsx("h3", { className: "text-2xl font-bold text-white mb-2", children: campaign.title }) })] }), _jsxs(CardContent, { className: "p-6", children: [_jsx("p", { className: "text-muted-foreground mb-6 line-clamp-3", children: campaign.description }), _jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex justify-between text-sm mb-2", children: [_jsxs("span", { className: "text-foreground font-semibold", children: ["Raised: \u20B9", (campaign.raised || 0).toLocaleString()] }), _jsxs("span", { className: "text-muted-foreground", children: ["Goal: \u20B9", (campaign.goal || 0).toLocaleString()] })] }), _jsx("div", { className: "w-full h-3 bg-secondary rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-primary transition-all duration-500", style: { width: `${percentage}%` } }) }), _jsxs("p", { className: "text-xs text-muted-foreground mt-1 text-right", children: [percentage, "% funded"] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5 text-primary" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: campaign.donationCount ?? campaign.dontaionCount ?? 0 }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Donors" })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Calendar, { className: "w-5 h-5 text-accent" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Ongoing' }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Deadline" })] })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsx(NavLink, { to: "/donate", className: "flex-1", children: _jsx(Button, { className: "w-full bg-gradient-primary hover:opacity-90 transition-opacity", children: "Donate Now" }) }), _jsx(NavLink, { to: "/get-involved", className: "flex-1", children: _jsx(Button, { variant: "outline", className: "w-full", children: "Volunteer" }) })] })] })] }, campaign._id || index);
                            }) }) }) }), _jsx("section", { className: "py-16 md:py-24 bg-secondary/30", children: _jsx("div", { className: "container mx-auto px-4", children: _jsxs("div", { className: "max-w-3xl mx-auto text-center", children: [_jsx(Target, { className: "w-16 h-16 mx-auto mb-6 text-primary" }), _jsx("h2", { className: "text-3xl md:text-5xl font-bold mb-6 text-foreground", children: "Start Your Own Campaign" }), _jsx("p", { className: "text-lg text-muted-foreground mb-8", children: "Have an idea for a social cause? Partner with us to launch your own campaign and create lasting impact." }), _jsx(NavLink, { to: "/contact", children: _jsx(Button, { size: "lg", className: "bg-gradient-accent hover:opacity-90 transition-opacity shadow-medium", children: "Get in Touch" }) })] }) }) }), _jsx(FloatingButtons, {}), _jsx(Footer, {})] }));
};
export default Campaigns;
