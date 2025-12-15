# Menkiki-like — Food Photo → Restaurant Recommendations

A mobile app that recommends nearby restaurants based on a photo of the dish you want to eat.

Inspired by [Menkiki](https://www.menkiki.com/) (2015), a Japanese app created by Takuya Matsuyama before Inkdrop.

---

## Problem

Finding restaurants usually requires typing keywords, filters, and browsing reviews.
This creates friction when users already know what they want to eat — they just want it nearby.

## Solution

Reduce search friction to zero:

1. **Take a photo** of a dish you want to eat
2. **AI detects** the food category using on-device computer vision
3. **Get recommendations** for nearby restaurants serving that dish

No typing. No filters. Just intent.

---

## Screenshots

| Camera | Detection | Results |
|--------|-----------|---------|
| Point at food | AI classification | Nearby places |

*Screenshots coming soon*

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Mobile-first (iOS & Android) | Target use case is on-the-go |
| On-device computer vision | No paid AI APIs, works offline |
| Minimal UX (4 screens) | Reduce friction, fast iteration |
| One city (Buenos Aires) for v1 | Higher data quality, easier validation |
| No accounts, no social features | Not needed for core value |

See full decision log in [`docs/decisions.md`](docs/decisions.md).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo (React Native) |
| Navigation | Expo Router |
| Computer Vision | TensorFlow.js |
| Restaurant Data | Google Places API |
| Camera | Expo Camera |
| Location | Expo Location |

---

## Project Structure

```
menkiki-like/
├── app/                    # Screens (Expo Router)
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Camera screen
│   ├── detection.tsx       # Classification screen
│   └── results.tsx         # Restaurant list
├── src/
│   ├── components/         # Reusable components
│   ├── hooks/              # Custom React hooks
│   │   ├── useClassifier   # AI classification
│   │   ├── useLocation     # GPS positioning
│   │   └── useRestaurants  # Places search
│   ├── services/           # Business logic
│   │   ├── classifier      # Image classification
│   │   ├── places          # Google Places API
│   │   └── tensorflow      # TF.js setup
│   ├── constants/          # App constants
│   └── types/              # TypeScript types
└── docs/                   # Product documentation
```

---

## Documentation

- [`docs/scope.md`](docs/scope.md) — What's in and out of v1
- [`docs/ux-flow.md`](docs/ux-flow.md) — User journey and screens
- [`docs/architecture.md`](docs/architecture.md) — System design
- [`docs/decisions.md`](docs/decisions.md) — Product & technical decisions
- [`docs/roadmap.md`](docs/roadmap.md) — Development phases

---

## Roadmap

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Foundation (Expo, navigation, camera) | ✅ Complete |
| 2 | Computer Vision (TF.js, classification) | ✅ Complete |
| 3 | Recommendations (location, Places API) | ✅ Complete |
| 4 | Polish & Demo | 🚧 In Progress |

See detailed breakdown in [`docs/roadmap.md`](docs/roadmap.md).

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo Go app on your phone
- (Optional) Google Places API key

### Installation

```bash
# Clone the repo
git clone https://github.com/tomymaritano/menkiki-like.git
cd menkiki-like

# Install dependencies
npm install

# Start development
npx expo start
```

### Environment Variables (Optional)

To use real Google Places data instead of mock data:

```bash
# Create .env file
echo "EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your_api_key" > .env
```

### Running on Device

1. Install Expo Go on your phone
2. Scan the QR code from terminal
3. Grant camera and location permissions

---

## Features

- [x] Camera capture with permissions
- [x] Food image classification (mock)
- [x] Location-based restaurant search
- [x] Google Maps integration
- [x] Dark mode UI
- [ ] Real TFLite model
- [ ] Call restaurant action
- [ ] Demo video

---

## Status

**In development** — Portfolio project demonstrating product thinking and mobile development.

---

## License

MIT

---

## Author

Built by [@tomymaritano](https://github.com/tomymaritano)
