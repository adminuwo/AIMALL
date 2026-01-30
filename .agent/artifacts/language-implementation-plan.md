# Global Language System Implementation Plan

## Overview
Implementing a fully functional global language system for AI-Mall application with support for:
- English (en)
- Hindi (hi)
- Sanskrit (sa)
- Marathi (mr)
- Bengali (bn)
- Punjabi (pa)
- German (de)

## Current State Analysis
✅ **Already Implemented:**
- `LanguageContext.jsx` with comprehensive translations
- `useLanguage()` hook available
- Language persistence in localStorage
- Multiple language support (en, hi, sa, mr, bn, pa, de, and more)

❌ **Missing:**
- Many components still use hardcoded text
- Landing page not fully translated
- Marketplace cards use hardcoded text
- Chat UI has hardcoded strings
- Profile/Settings pages need translation
- Help & FAQ not translated

## Implementation Steps

### Phase 1: Expand Translation Keys
Add missing translation keys to `LanguageContext.jsx` for:
1. **Landing Page**
   - Hero section (heading, subheading, button text, card descriptions)
   - How It Works section
   - Testimonials
   - Footer

2. **Marketplace**
   - Page title and subtitle
   - Category names
   - Search placeholder
   - Card buttons (USE, SUBSCRIBE, VIEW INFO)
   - Modal content
   - Empty states

3. **Chat**
   - All UI elements
   - System messages
   - Placeholders
   - Status indicators

4. **Profile & Settings**
   - Section headings
   - Form labels
   - Button text
   - Privacy messages

5. **Help & FAQ**
   - All questions and answers
   - Tab labels

### Phase 2: Update Components
Update these components to use `useLanguage()` hook:

**Landing Page:**
- `Hero.jsx` ✓
- `HowItWorks.jsx` ✓
- `Testimonials.jsx` ✓
- `Footer.jsx` ✓
- `Header.jsx` ✓

**Marketplace:**
- `Marketplace.jsx` ✓
- `ParallaxAgentCard.jsx` ✓

**Chat:**
- `Chat.jsx` ✓

**Profile:**
- `Profile.jsx` ✓
- `UserProfile.jsx` ✓

**Notifications:**
- `Notifications.jsx` ✓

**Admin:**
- Admin components (if needed)

### Phase 3: Testing
- Test language switching on all pages
- Verify no hardcoded text remains
- Check for layout issues with long translations
- Ensure localStorage persistence works

## Translation Keys Structure

```javascript
{
  // Landing Hero
  hero: {
    heading: "Discover & Deploy AI Solutions",
    subheading: "Your vendors marketplace for intelligent agents",
    aiMallButton: "AI Mall",
    aSeriesButton: "A Series",
    aiMallCardTitle: "AI Mall",
    aiMallCardDesc: "AI Mall is a marketplace where vendors build, showcase, and sell powerful AI agents to the world.",
    aSeriesCardTitle: "A Series",
    aSeriesCardDesc: "A Series is a curated collection of smart AI agents designed to handle real-world tasks effortlessly.",
    goToAIMall: "Go to AI Mall",
    goToASeries: "Go to A Series"
  },
  
  // Marketplace
  marketplace: {
    title: "AI MALL MARKETPLACE",
    subtitle: "DISCOVER INTELLIGENT AGENTS",
    searchPlaceholder: "Search agents...",
    useButton: "USE",
    subscribeButton: "SUBSCRIBE",
    viewInfoButton: "VIEW INFO",
    moreInCategory: "MORE IN {category}",
    noOtherApps: "No other apps in this category yet."
  },
  
  // ... and so on
}
```

## Success Criteria
✅ No hardcoded text in any component
✅ All pages translate instantly on language change
✅ Language persists across page refreshes
✅ Professional, natural translations
✅ No layout breaking with long text
✅ Fallback to English for missing keys
