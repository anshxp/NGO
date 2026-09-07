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

interface Campaign { _id: string; id?: string; title: string; description: string; goal: number; raised: number; imageUrl?: string; donationCount?: number; dontaionCount?: number; endDate?: string; }

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await campaignAPI.getActiveCampaigns();
                setCampaigns(response.data?.campaigns || response.data || []);
            } catch (error) {
                console.error('Error fetching campaigns:', error);
                toast({ title: 'Error', description: 'Failed to load campaigns', variant: 'destructive' });
            } finally { setLoading(false); }
        };
        fetchCampaigns();
    }, [toast]);

    const getPercentage = (raised: number, goal: number) => goal ? Math.min(100, Math.round((raised / goal) * 100)) : 0;

    return (
        <div className="min-h-screen"><Navigation />
            <section className="pt-32 pb-16 bg-gradient-hero"><div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary-foreground">Our Active Campaigns</h1><p className="text-lg md:text-xl text-primary-foreground/90">Join our ongoing campaigns and make a real difference in the lives of thousands</p></div></div></section>
            <section className="py-16 md:py-24"><div className="container mx-auto px-4">
                {loading ? <div className="text-center py-12">Loading campaigns...</div> : campaigns.length === 0 ? <div className="text-center py-12 text-muted-foreground"><p>No active campaigns at the moment.</p><NavLink to="/contact"><Button variant="link">Contact us to start one</Button></NavLink></div> :
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{campaigns.map((campaign, index) => { const percentage = getPercentage(campaign.raised || 0, campaign.goal || 0); return <Card key={campaign._id || index} className="overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-large">
                        <div className="relative h-64 overflow-hidden"><img src={campaign.imageUrl || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"} alt={campaign.title} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" /><div className="absolute bottom-4 left-4 right-4"><h3 className="text-2xl font-bold text-white mb-2">{campaign.title}</h3></div></div>
                        <CardContent className="p-6"><p className="text-muted-foreground mb-6 line-clamp-3">{campaign.description}</p>
                            <div className="mb-4"><div className="flex justify-between text-sm mb-2"><span className="text-foreground font-semibold">Raised: ₹{(campaign.raised || 0).toLocaleString()}</span><span className="text-muted-foreground">Goal: ₹{(campaign.goal || 0).toLocaleString()}</span></div><div className="w-full h-3 bg-secondary rounded-full overflow-hidden"><div className="h-full bg-gradient-primary transition-all duration-500" style={{ width: `${percentage}%` }} /></div><p className="text-xs text-muted-foreground mt-1 text-right">{percentage}% funded</p></div>
                            <div className="grid grid-cols-2 gap-4 mb-6"><div className="flex items-center gap-2"><Users className="w-5 h-5 text-primary" /><div><p className="text-sm font-semibold text-foreground">{campaign.donationCount ?? campaign.dontaionCount ?? 0}</p><p className="text-xs text-muted-foreground">Donors</p></div></div><div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-accent" /><div><p className="text-sm font-semibold text-foreground">{campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : 'Ongoing'}</p><p className="text-xs text-muted-foreground">Deadline</p></div></div></div>
                            <div className="flex gap-3"><NavLink to="/donate" className="flex-1"><Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">Donate Now</Button></NavLink><NavLink to="/get-involved" className="flex-1"><Button variant="outline" className="w-full">Volunteer</Button></NavLink></div>
                        </CardContent></Card>; })}</div>}
            </div></section>
            <section className="py-16 md:py-24 bg-secondary/30"><div className="container mx-auto px-4"><div className="max-w-3xl mx-auto text-center"><Target className="w-16 h-16 mx-auto mb-6 text-primary" /><h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Start Your Own Campaign</h2><p className="text-lg text-muted-foreground mb-8">Have an idea for a social cause? Partner with us to launch your own campaign and create lasting impact.</p><NavLink to="/contact"><Button size="lg" className="bg-gradient-accent hover:opacity-90 transition-opacity shadow-medium">Get in Touch</Button></NavLink></div></div></section>
            <FloatingButtons /><Footer />
        </div>
    );
};
export default Campaigns;
