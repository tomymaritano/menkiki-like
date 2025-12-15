# Menkiki-like — Food Photo → Restaurant Recommendations

A mobile app that recommends nearby restaurants based on a photo of the dish you want to eat.

Inspired by [Menkiki](https://www.menkiki.com/) (2015), a Japanese app created by Takuya Matsuyama before Inkdrop.

---

## Problem

Finding restaurants usually requires typing keywords, filters, and browsing reviews.
This creates friction when users already know what they want to eat — they just want it nearby.

## Solution

Reduce search friction to zero:

- Take a photo of a dish
- Detect the food category using on-device computer vision
- Recommend nearby restaurants serving that dish

No typing. No filters. Just intent.

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
| Computer Vision | TensorFlow Lite (on-device) |
| Restaurant Data | Google Places API |
| Camera | Expo Camera |
| Location | Expo Location |
| Storage | AsyncStorage |

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
| 1 | Foundation (Expo, navigation, camera) | Planned |
| 2 | Computer Vision (TFLite, classification) | Planned |
| 3 | Recommendations (location, Places API) | Planned |
| 4 | Polish & Demo | Planned |

See detailed breakdown in [`docs/roadmap.md`](docs/roadmap.md).

---

## Demo

Coming soon.

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/menkiki-like.git
cd menkiki-like

# Install dependencies
npm install

# Start development
npx expo start
```

---

## Status

**In development** — Portfolio project demonstrating product thinking and mobile development.

---

## License

MIT
