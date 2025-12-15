# App Store Screenshots Guide

## Required Sizes

### iOS (App Store Connect)
| Device | Size (pixels) | Required |
|--------|---------------|----------|
| iPhone 6.7" | 1290 x 2796 | Yes |
| iPhone 6.5" | 1284 x 2778 | Yes |
| iPhone 5.5" | 1242 x 2208 | Yes |
| iPad Pro 12.9" | 2048 x 2732 | If supporting iPad |

### Android (Play Store)
| Type | Size (pixels) | Required |
|------|---------------|----------|
| Phone | 1080 x 1920 (min) | Yes |
| 7" Tablet | 1200 x 1920 | Optional |
| 10" Tablet | 1800 x 2560 | Optional |

---

## Screenshot Sequence

### 1. Camera Screen (Hero Shot)
**What to show:**
- Full camera view with viewfinder
- Food photo in frame (pizza or burger works well)
- Clean, appetizing food image

**Text overlay:**
- "Snap any food photo"

**Tips:**
- Use high-quality food image
- Show the camera UI clearly
- Ensure good lighting in the photo

---

### 2. Detection/Analysis Screen
**What to show:**
- Loading animation (PulsingDot)
- "Analyzing..." state
- Or: Detection complete with category shown

**Text overlay:**
- "AI recognizes your craving"

**Tips:**
- Capture the moment of recognition
- Show confidence percentage if visible

---

### 3. Results Screen
**What to show:**
- List of restaurant cards
- Restaurant names, ratings, distances visible
- Multiple results (3-4 cards)

**Text overlay:**
- "Find nearby restaurants"

**Tips:**
- Use realistic restaurant names
- Show variety of ratings (4.5, 4.2, etc.)
- Ensure text is readable

---

### 4. Action Sheet
**What to show:**
- Restaurant card with action sheet open
- "Open in Maps" and "Call Restaurant" options visible

**Text overlay:**
- "Call or get directions"

**Tips:**
- Show the action sheet prominently
- Restaurant info should be visible behind

---

### 5. Favorites Screen
**What to show:**
- Favorites list with saved restaurants
- Heart icons visible
- Empty state OR populated list

**Text overlay:**
- "Save your favorites"

**Tips:**
- Show 2-3 favorited restaurants
- Demonstrate the feature clearly

---

## Screenshot Creation Process

### Using Expo
```bash
# Run on simulator
npx expo start --ios
npx expo start --android

# Use simulator screenshot tools:
# iOS: Cmd + S
# Android: Cmd + S or device screenshot button
```

### Using Fastlane (Recommended for automation)
```bash
# Install fastlane
gem install fastlane

# Initialize (creates Fastfile)
fastlane init

# Capture screenshots
fastlane snapshot
```

### Manual Process
1. Run app on device/simulator
2. Navigate to each screen
3. Take screenshot
4. Add text overlays in Figma/Sketch/Canva
5. Export at required sizes

---

## Design Guidelines

### Text Overlays
- Font: SF Pro (iOS) / Roboto (Android)
- Size: Large enough to read in thumbnail
- Position: Top or bottom third
- Background: Semi-transparent dark gradient

### Color Scheme
- Background: #000000 (matches app)
- Primary text: #FFFFFF
- Accent: App's primary color

### Do's
- Use real app screenshots
- Show actual functionality
- Keep text minimal
- Maintain consistent style across all screenshots

### Don'ts
- Don't use placeholder text
- Don't show error states
- Don't include status bar time/battery that looks fake
- Don't use competitor logos/names

---

## Checklist

- [ ] Camera screen screenshot
- [ ] Detection screen screenshot
- [ ] Results list screenshot
- [ ] Action sheet screenshot
- [ ] Favorites screen screenshot
- [ ] Text overlays added
- [ ] Exported for iPhone 6.7"
- [ ] Exported for iPhone 6.5"
- [ ] Exported for iPhone 5.5"
- [ ] Exported for Android Phone
- [ ] Preview in App Store Connect
- [ ] Preview in Play Console

---

## Tools Recommended

| Tool | Purpose | Link |
|------|---------|------|
| Figma | Screenshot mockups | figma.com |
| Canva | Quick text overlays | canva.com |
| Fastlane | Automated screenshots | fastlane.tools |
| AppMockUp | Device frames | app-mockup.com |
| Screenshots Pro | Store previews | screenshots.pro |
