# 🚀 Quick Start Guide - NGO Website

## Running the Website

### Development Mode
```bash
cd /home/anshxhhh/Desktop/projects/NGO/frontend
npm run dev
```
**Access at**: http://localhost:8080/

### Production Build
```bash
cd /home/anshxhhh/Desktop/projects/NGO/frontend
npm run build
npm run preview
```

## 📁 Key Files & Components

### New Components (in `/frontend/src/components/`)
- `TopInfoBar.tsx` - Top bar with social media, news, contact, language
- `HeroCarousel.tsx` - Full-width slideshow with 4 slides
- `QuickLinksSection.tsx` - 4 quick access cards
- `NewsUpdatesWidget.tsx` - Floating news widget
- `ProgramSections.tsx` - 6 empowerment programs
- `GalleryCarousel.tsx` - Image gallery with navigation
- `DonationCategories.tsx` - 4 donation category cards
- `FloatingButtons.tsx` - WhatsApp, Translate, QR buttons
- `Navigation.tsx` - Enhanced with dropdowns (UPDATED)
- `Footer.tsx` - 5-section footer (UPDATED)

### Pages (in `/frontend/src/pages/`)
- `Index.tsx` - Home page with all new components
- `About.tsx` - About us page
- `Programs.tsx` - Programs listing
- `GetInvolved.tsx` - Volunteer/donation forms
- `Impact.tsx` - Success stories
- `Campaigns.tsx` - Active campaigns
- `Blog.tsx` - Blog posts
- `Contact.tsx` - Contact form
- `Donate.tsx` - Donation page (Razorpay)
- `Membership.tsx` - Membership registration

### Styling
- `/frontend/src/index.css` - Design system + new animations

## 🎨 Design Tokens

### Colors (HSL)
```css
--primary: 186 85% 35%;      /* Teal #008C95 */
--accent: 18 95% 62%;        /* Orange #FF7A42 */
--background: 0 0% 100%;     /* White */
--foreground: 215 25% 15%;   /* Dark Gray */
```

### Gradients
```css
--gradient-primary: linear-gradient(135deg, hsl(186 85% 35%), hsl(186 75% 45%));
--gradient-accent: linear-gradient(135deg, hsl(18 95% 62%), hsl(18 85% 70%));
--gradient-hero: linear-gradient(135deg, hsl(186 85% 35%) 0%, hsl(186 75% 45%) 50%, hsl(18 95% 62%) 100%);
```

### Shadows
```css
--shadow-soft: 0 4px 6px -1px hsl(186 85% 35% / 0.1), 0 2px 4px -1px hsl(186 85% 35% / 0.06);
--shadow-medium: 0 10px 15px -3px hsl(186 85% 35% / 0.1), 0 4px 6px -2px hsl(186 85% 35% / 0.05);
--shadow-large: 0 20px 25px -5px hsl(186 85% 35% / 0.1), 0 10px 10px -5px hsl(186 85% 35% / 0.04);
```

## 🔧 Customization

### Update News Ticker
Edit `/frontend/src/components/TopInfoBar.tsx`:
```typescript
const newsUpdates = [
  "Your news item 1",
  "Your news item 2",
  // Add more...
];
```

### Update Hero Slides
Edit `/frontend/src/components/HeroCarousel.tsx`:
```typescript
const slides: Slide[] = [
  {
    id: 1,
    title: "Your Title",
    subtitle: "Your Subtitle",
    description: "Your description",
    // ...
  },
];
```

### Update Programs
Edit `/frontend/src/components/ProgramSections.tsx`:
```typescript
const programs = [
  {
    title: "Program Name",
    icon: <Icon />,
    points: ["Point 1", "Point 2", ...],
    image: "url",
  },
];
```

### Update Donation Categories
Edit `/frontend/src/components/DonationCategories.tsx`:
```typescript
const categories = [
  {
    title: "Category Name",
    description: "Description",
    amount: "₹5,000",
    // ...
  },
];
```

## 📱 Features

### Auto-Playing Elements
- **Hero Carousel**: 5 seconds per slide
- **News Ticker**: 4 seconds per update
- **News Widget**: 3 seconds per item

### Interactive Elements
- **Hover Effects**: All cards and buttons
- **Pause on Hover**: News ticker and widget
- **Click Navigation**: Carousel arrows and dots
- **Dropdown Menus**: Navigation with multi-level

### Floating Elements
- **News Widget**: Bottom-right, closeable
- **Action Buttons**: Bottom-right stack
  - WhatsApp (green)
  - Translate (primary gradient)
  - QR Code (accent gradient)

## 🌐 Routes

```
/                - Home
/about           - About Us
/programs        - Programs
/impact          - Impact Stories
/get-involved    - Get Involved
/campaigns       - Campaigns
/blog            - Blog & News
/contact         - Contact Us
/donate          - Donate
/membership      - Membership
/login           - Admin Login
/admin           - Admin Dashboard (protected)
```

## 📊 Component Hierarchy

```
App
├── Navigation (with TopInfoBar)
├── Pages
│   ├── Index
│   │   ├── HeroCarousel
│   │   ├── ImpactCounter (existing)
│   │   ├── QuickLinksSection
│   │   ├── ProgramSections
│   │   ├── GalleryCarousel
│   │   ├── DonationCategories
│   │   └── NewsUpdatesWidget
│   ├── About
│   ├── Programs
│   ├── GetInvolved
│   ├── Impact
│   ├── Campaigns
│   ├── Blog
│   ├── Contact
│   ├── Donate
│   └── Membership
├── FloatingButtons
└── Footer (enhanced)
```

## 🎯 Quick Tips

1. **All components use the same design system** - No need to add custom styles
2. **Responsive by default** - Mobile, tablet, desktop all handled
3. **Animations are automatic** - Just use the classes: `animate-fade-in`, `animate-slide-up`, `animate-scale-in`
4. **Gradients are utilities** - Use `bg-gradient-primary`, `bg-gradient-accent`, `bg-gradient-hero`
5. **Shadows are utilities** - Use `shadow-soft`, `shadow-medium`, `shadow-large`

## 📞 Support

For questions or issues:
- Check `FINAL_COMPLETION_REPORT.md` for full details
- Check `VISUAL_GUIDE.md` for layout reference
- Check `ENHANCEMENT_SUMMARY.md` for implementation details

---

**Everything is ready to go! Just run `npm run dev` and enjoy your enhanced website! 🎉**
