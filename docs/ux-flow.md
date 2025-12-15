# UX Flow

## Overview

4 screens, linear flow, minimal decisions.

```
Camera → Detection → Results → Action (external)
```

---

## Screen 1: Camera

**Purpose:** Capture food photo

**Elements:**
- Full-screen camera viewfinder
- Capture button (center bottom)
- Flash toggle (optional)

**Behavior:**
- Opens immediately on app launch
- Requests camera permission if needed
- Tap capture → moves to Detection screen

**Edge Cases:**
- Permission denied → show explanation + settings link
- No camera available → show error state

---

## Screen 2: Detection

**Purpose:** Show classification result, confirm intent

**Elements:**
- Photo thumbnail (top)
- Detected food category (large text)
- Confidence indicator (subtle)
- "Find nearby places" CTA button
- "Retake" secondary action

**Behavior:**
- Runs classification on mount
- Shows loading state during inference
- Displays result with confidence

**Edge Cases:**
- Low confidence (< 60%) → show "Not sure" state with option to proceed
- Classification fails → show error with retry option

---

## Screen 3: Results

**Purpose:** Show nearby restaurants

**Elements:**
- Header with detected category
- List of restaurants:
  - Name
  - Rating (stars)
  - Distance
  - Price level (optional)
- Empty state if no results

**Behavior:**
- Requests location permission if needed
- Fetches from Google Places API
- Sorts by distance + rating hybrid

**Edge Cases:**
- Location denied → show explanation
- No results → suggest different category or area
- API error → show retry option

---

## Screen 4: Actions (External)

**Purpose:** Take action on selected restaurant

**Options:**
- Open in Google Maps (navigation)
- Call restaurant (if phone available)

**Behavior:**
- Tapping restaurant opens action sheet
- Actions open external apps

---

## Flow Diagram

```
┌─────────────┐
│   Camera    │
│  [Capture]  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Detection  │
│  [Pizza]    │
│  [Find]     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Results   │
│  - Place 1  │
│  - Place 2  │
│  - Place 3  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Actions   │
│  [Maps]     │
│  [Call]     │
└─────────────┘
```

---

## Design Principles

1. **Speed over features** — Every tap should feel instant
2. **Confidence over options** — Make decisions for the user
3. **Recovery over prevention** — Easy to go back and retry
4. **Native over custom** — Use platform conventions
