# Menkiki — Food Photo → Restaurant Recommendations

A mobile app that recommends nearby restaurants based on a photo of the dish you want to eat.

Inspired by [Menkiki](https://www.menkiki.com/) (2015), a Japanese app created by Takuya Matsuyama before Inkdrop.

[![CI](https://github.com/tomymaritano/menkiki-like/actions/workflows/ci.yml/badge.svg)](https://github.com/tomymaritano/menkiki-like/actions/workflows/ci.yml)

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

## Features

- **AI Food Recognition** — MobileNet v2 for real-time classification
- **Restaurant Search** — Find nearby places via Google Places API
- **Quick Actions** — Call restaurant or open in Maps
- **Favorites** — Save your favorite spots
- **Search History** — Track past searches
- **Offline Mode** — Works with cached data
- **Dark Theme** — Modern, comfortable UI

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 54 (React Native) |
| Navigation | Expo Router |
| ML | TensorFlow.js + MobileNet v2 |
| Restaurant Data | Google Places API |
| Storage | AsyncStorage |
| Testing | Jest + React Native Testing Library |
| CI/CD | GitHub Actions |

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
cp .env.example .env
# Edit .env and add your API key
```

### Available Scripts

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm test           # Run tests
npm run test:coverage  # Run tests with coverage
npm run lint       # Lint code
npm run typecheck  # TypeScript check
```

---

## Project Structure

```
menkiki-like/
├── app/                    # Screens (Expo Router)
│   ├── _layout.tsx         # Root layout + ErrorBoundary
│   ├── index.tsx           # Camera screen
│   ├── detection.tsx       # Classification screen
│   ├── results.tsx         # Restaurant list
│   ├── favorites.tsx       # Saved restaurants
│   ├── history.tsx         # Search history
│   └── onboarding.tsx      # First-launch flow
├── src/
│   ├── components/         # UI components
│   ├── config/             # App configuration
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Business logic
│   ├── constants/          # App constants
│   ├── types/              # TypeScript types
│   └── utils/              # Utilities (logger)
├── __tests__/              # Test files
├── __mocks__/              # Jest mocks
└── docs/                   # Documentation
    └── store/              # App Store assets
```

---

## Development Phases

| Phase | Focus | Status |
|-------|-------|--------|
| 1 | Foundation (Expo, navigation, camera) | ✅ Complete |
| 2 | Computer Vision (TF.js, classification) | ✅ Complete |
| 3 | Recommendations (location, Places API) | ✅ Complete |
| 4 | Polish (animations, offline, actions) | ✅ Complete |
| 5 | Testing (Jest, RTL, coverage) | ✅ Complete |
| 6 | CI/CD (GitHub Actions) | ✅ Complete |
| 7 | Production Hardening | ✅ Complete |
| 8 | Advanced ML | ✅ Complete |
| 9 | App Store Readiness | ✅ Complete |

---

## Documentation

- [`docs/store/metadata.md`](docs/store/metadata.md) — App Store descriptions & keywords
- [`docs/store/privacy-policy.md`](docs/store/privacy-policy.md) — Privacy policy
- [`docs/store/screenshots.md`](docs/store/screenshots.md) — Screenshot guidelines
- [`docs/roadmap.md`](docs/roadmap.md) — Development phases

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

Current coverage:
- **50 tests** passing
- **100% component coverage**
- Hooks and services tested

---

## App Store

### iOS App Store
- Category: Food & Drink
- Rating: 4+
- [Privacy Policy](docs/store/privacy-policy.md)

### Google Play Store
- Category: Food & Drink
- Rating: Everyone
- [Privacy Policy](docs/store/privacy-policy.md)

See [store metadata](docs/store/metadata.md) for full descriptions and keywords.

---

## Version

**v2.2.0** — Production ready

---

## License

MIT

---

## Author

Built by [@tomymaritano](https://github.com/tomymaritano)
