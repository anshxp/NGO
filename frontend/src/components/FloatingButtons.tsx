import { useState } from "react";
import { MessageCircle, Globe, QrCode, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const FloatingButtons = () => {
    const [showQR, setShowQR] = useState(false);

    const handleWhatsApp = () => {
        window.open("https://wa.me/917311234567", "_blank");
    };

    const handleTranslate = () => {
        // Google Translate widget integration
        const googleTranslateElement = document.getElementById("google_translate_element");
        if (googleTranslateElement) {
            googleTranslateElement.click();
        }
    };

    return (
        <>
            {/* Floating Buttons Container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
                {/* WhatsApp Button */}
                <Button
                    onClick={handleWhatsApp}
                    className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-large flex items-center justify-center group transition-all hover:scale-110"
                    aria-label="Contact us on WhatsApp"
                >
                    <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </Button>

                {/* Translate Button */}
                <Button
                    onClick={handleTranslate}
                    className="w-14 h-14 rounded-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-large flex items-center justify-center group transition-all hover:scale-110"
                    aria-label="Translate page"
                >
                    <Globe className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                </Button>

                {/* QR Code Button */}
                <Button
                    onClick={() => setShowQR(!showQR)}
                    className="w-14 h-14 rounded-full bg-gradient-accent hover:opacity-90 text-primary-foreground shadow-large flex items-center justify-center group transition-all hover:scale-110"
                    aria-label="Show QR code"
                >
                    <QrCode className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </Button>
            </div>

            {/* QR Code Modal */}
            {showQR && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-card rounded-xl shadow-large p-6 max-w-sm mx-4 relative animate-scale-in">
                        <Button
                            onClick={() => setShowQR(false)}
                            variant="ghost"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                        <h3 className="text-xl font-bold text-foreground mb-4 text-center">
                            Scan to Connect
                        </h3>
                        <div className="bg-white p-4 rounded-lg mb-4">
                            {/* QR Code placeholder - replace with actual QR code */}
                            <div className="w-64 h-64 bg-gradient-to-br from-primary to-accent flex items-center justify-center rounded-lg">
                                <QrCode className="w-32 h-32 text-white" />
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground text-center">
                            Scan this QR code to visit our website or save our contact information
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default FloatingButtons;
