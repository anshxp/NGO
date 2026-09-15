import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/NavLink";
const GalleryCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const galleryImages = [
        {
            url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
            title: "Community Health Camp",
            category: "Health",
        },
        {
            url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
            title: "Education Program",
            category: "Education",
        },
        {
            url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
            title: "Tree Plantation Drive",
            category: "Environment",
        },
        {
            url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80",
            title: "Women Empowerment Workshop",
            category: "Women",
        },
        {
            url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
            title: "Youth Leadership Training",
            category: "Youth",
        },
        {
            url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
            title: "Rural Development Project",
            category: "Rural",
        },
    ];
    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    };
    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    };
    const goToImage = (index) => {
        setCurrentIndex(index);
    };
    return (_jsx("section", { className: "py-16 md:py-24 bg-secondary/30", children: _jsxs("div", { className: "container mx-auto px-4", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-3xl md:text-5xl font-bold text-foreground mb-4", children: "Our Impact Gallery" }), _jsx("p", { className: "text-lg text-muted-foreground max-w-2xl mx-auto", children: "Witness the transformative journey of communities we serve" })] }), _jsxs("div", { className: "relative max-w-5xl mx-auto mb-8", children: [_jsxs("div", { className: "relative overflow-hidden rounded-xl shadow-large aspect-video", children: [_jsx("img", { src: galleryImages[currentIndex].url, alt: galleryImages[currentIndex].title, className: "w-full h-full object-cover" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-6 text-primary-foreground", children: [_jsx("span", { className: "inline-block px-3 py-1 bg-primary rounded-full text-sm font-medium mb-2", children: galleryImages[currentIndex].category }), _jsx("h3", { className: "text-2xl font-bold", children: galleryImages[currentIndex].title })] })] }), _jsx("button", { onClick: prevImage, className: "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground/90 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-medium", "aria-label": "Previous image", children: _jsx(ChevronLeft, { className: "w-6 h-6" }) }), _jsx("button", { onClick: nextImage, className: "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-foreground/90 backdrop-blur-sm flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-medium", "aria-label": "Next image", children: _jsx(ChevronRight, { className: "w-6 h-6" }) })] }), _jsx("div", { className: "flex gap-4 justify-center mb-8 overflow-x-auto pb-4", children: galleryImages.map((image, index) => (_jsx("button", { onClick: () => goToImage(index), className: `flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${index === currentIndex
                            ? "border-primary shadow-medium scale-110"
                            : "border-border hover:border-primary/50"}`, children: _jsx("img", { src: image.url, alt: image.title, className: "w-full h-full object-cover" }) }, index))) }), _jsx("div", { className: "flex gap-2 justify-center mb-8", children: galleryImages.map((_, index) => (_jsx("button", { onClick: () => goToImage(index), className: `h-2 rounded-full transition-all ${index === currentIndex
                            ? "w-8 bg-primary"
                            : "w-2 bg-border hover:bg-primary/50"}`, "aria-label": `Go to image ${index + 1}` }, index))) }), _jsx("div", { className: "text-center", children: _jsx(NavLink, { to: "/impact", children: _jsxs(Button, { size: "lg", className: "bg-gradient-primary hover:opacity-90 transition-opacity shadow-medium group", children: ["See More Images", _jsx(ExternalLink, { className: "ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" })] }) }) })] }) }));
};
export default GalleryCarousel;
