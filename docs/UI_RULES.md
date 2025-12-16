# UI Rules - Menkiki (Non-Negotiable)

## Rule 1: Safe Areas Are Sacred
```
NEVER hardcode top/bottom padding on full-screen views.
ALWAYS use: useSafeAreaInsets() + additional padding

Header content: paddingTop = insets.top + 16
Bottom content: paddingBottom = insets.bottom + 8
Tab bar: bottom = insets.bottom + 24
```

## Rule 2: Text Over Camera = Shadow Mandatory
```
ANY text rendered over camera feed MUST have:
- textShadowColor: 'rgba(0,0,0,0.8)'
- textShadowOffset: { width: 0, height: 1 }
- textShadowRadius: 4

NO EXCEPTIONS. Bright backgrounds will appear.
```

## Rule 3: Minimum Touch Target = 44x44
```
Interactive elements: minimum 44x44 points
Use hitSlop if visual element is smaller:
  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}

Shutter button: 76x76 minimum
Tab icons: 44x44 minimum
```

## Rule 4: One Opacity Token Per Purpose
```
Active elements: opacity 1.0
Secondary elements: opacity 0.7
Disabled elements: opacity 0.4
Placeholder/hints: opacity 0.6

NEVER use arbitrary opacities like 0.53 or 0.85
```

## Rule 5: Contrast Ratio Minimums
```
Large text (>18px): 3:1 minimum
Body text: 4.5:1 minimum
Critical UI: 7:1 target

Text on variable backgrounds: ALWAYS use pill/backdrop
```

## Rule 6: Spacing Uses 4px Grid
```
ONLY use: 4, 8, 12, 16, 20, 24, 32, 48
NEVER use: 5, 10, 15, 18, 22, 30, 50

Use SPACING tokens from theme.ts
```

## Rule 7: Icons Are Consistent
```
Same family: Lucide React Native (ONLY)
Same stroke width: 2 (default)
Same sizes: 16 / 20 / 24 / 32
Same colors: Use COLORS tokens

NEVER mix filled and outlined in same context
```

## Rule 8: States Are Visible
```
Every interactive element needs:
- Default state
- Pressed state (opacity 0.8 or scale 0.96)
- Disabled state (opacity 0.4)
- Loading state (if async)

Use activeOpacity={0.8} on TouchableOpacity
```

## Rule 9: Animations Are Subtle
```
Duration: 200-400ms
Easing: ease-out for entries, ease-in for exits
Scale: never more than 1.1x
Opacity: smooth transitions, no jumps

useNativeDriver: true (ALWAYS)
```

## Rule 10: No Magic Numbers in Styles
```
BAD:
  { marginTop: 47, paddingLeft: 23, fontSize: 17 }

GOOD:
  { marginTop: SPACING[12], paddingLeft: SPACING[6], fontSize: TYPOGRAPHY.size.md }

ALL values come from tokens.
```

---

## Quick Reference: Camera Screen Layout

```
┌─────────────────────────────┐
│      STATUS BAR (system)    │ ← insets.top
├─────────────────────────────┤
│    ↓ 16px padding           │
│         TITLE               │ ← fontSize 28, shadow
│        subtitle             │ ← fontSize 14, shadow
│    ↓ flex: 1                │
├─────────────────────────────┤
│                             │
│      CAMERA FEED            │
│    (with gradient overlay   │
│     at bottom)              │
│                             │
│    ┌─────────────────┐      │
│    │  FOCUS FRAME    │      │ ← centered
│    │  (corners only) │      │
│    └─────────────────┘      │
│                             │
│    [icon] [icon] [icon]     │ ← with pill background
│    "Tap to scan"            │ ← fontSize 15, shadow
│                             │
├─────────────────────────────┤
│    ↑ gradient overlay       │
│  ┌───────────────────────┐  │
│  │    SHUTTER BUTTON     │  │ ← 76x76, centered
│  └───────────────────────┘  │
│    ↓ space for tab bar      │
├─────────────────────────────┤
│   ┌─────────────────────┐   │ ← floating, 20px margins
│   │  [cam] [fav] [hist] │   │ ← 70px height
│   └─────────────────────┘   │
│    ↓ 24px + insets.bottom   │
└─────────────────────────────┘
```
