# Scope v1

## Target City

**Buenos Aires, Argentina**

Single city focus allows:
- Higher quality restaurant data
- Faster iteration cycles
- Easier UX validation
- Simpler edge case handling

---

## Supported Food Categories

| Category | Places API Keyword |
|----------|-------------------|
| Pizza | pizza |
| Sushi | sushi |
| Ramen | ramen |
| Burgers | hamburger |
| Empanadas | empanadas |

Categories chosen based on:
- Visual distinctiveness (easier ML classification)
- Availability in Buenos Aires
- Common user intent

---

## Platforms

- iOS
- Android

Both via single Expo codebase.

---

## In Scope

- Camera capture
- On-device food classification
- Location-based restaurant search
- Results list with basic info
- Open in Google Maps action
- Call restaurant action

---

## Out of Scope (v1)

| Feature | Reason |
|---------|--------|
| User accounts | Not needed for core value |
| Reviews/Ratings | Google Places provides this |
| Social features | Scope creep |
| Custom ML training | Pre-trained model sufficient |
| Backend services | Client-only for v1 |
| Multiple cities | Focus on one market first |
| Favorites/History | Requires persistence layer |
| Delivery integration | Different product |

---

## Success Criteria

1. User can take photo and get restaurant recommendations in < 5 seconds
2. Classification accuracy > 80% for supported categories
3. App works fully offline (except Places API calls)
4. Smooth UX with no crashes on common flows
