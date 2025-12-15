# Key Product & Technical Decisions

This document captures the reasoning behind major decisions. Useful for interviews and future reference.

---

## Product Decisions

### Why this project?

**Context:** Wanted a portfolio project that demonstrates product thinking, not just code.

**Decision:** Clone a real product (Menkiki) that:
- Has proven market validation
- Combines mobile + ML + APIs
- Has clear, constrained scope
- Shows technical depth

**Alternative considered:** Building something "original" — rejected because validation matters more than novelty for portfolio.

---

### Why one city only?

**Context:** Multi-city support adds complexity without learning value.

**Decision:** Buenos Aires only for v1.

**Benefits:**
- Can manually validate restaurant data quality
- Simpler UX (no city selection)
- Faster to iterate
- Can expand later if needed

**Trade-off:** Less impressive scope, but more polished execution.

---

### Why these 5 food categories?

**Context:** Need categories that are visually distinct and available locally.

**Decision:** Pizza, Sushi, Ramen, Burgers, Empanadas

**Criteria:**
1. Visually distinctive (ML can classify reliably)
2. Common in Buenos Aires
3. Clear Google Places keyword mapping
4. Represent diverse cuisines

**Not included:** Pasta (too similar to other dishes), Tacos (less common in BA), Generic categories (too broad).

---

### Why no user accounts?

**Context:** Accounts add significant complexity.

**Decision:** No accounts in v1.

**Reasoning:**
- Core value doesn't require identity
- Eliminates auth complexity
- No password/security concerns
- Faster to build and test

**Future:** Could add for favorites, history, personalization.

---

## Technical Decisions

### Why Expo over bare React Native?

**Context:** Need cross-platform mobile development.

**Decision:** Expo managed workflow.

**Benefits:**
- Faster setup
- Camera/Location modules included
- OTA updates
- Simpler build process
- Good enough for portfolio

**Trade-off:** Less native control, but not needed for this project.

---

### Why on-device ML over cloud APIs?

**Context:** Need food image classification.

**Options evaluated:**

| Option | Cost | Latency | Offline |
|--------|------|---------|---------|
| OpenAI Vision | $$$ | High | No |
| Google Vision | $$ | Medium | No |
| AWS Rekognition | $$ | Medium | No |
| TensorFlow Lite | Free | Low | Yes |

**Decision:** TensorFlow Lite

**Reasoning:**
1. Zero per-request cost
2. Works offline
3. Faster response (no network)
4. Demonstrates ML skills
5. Privacy-friendly

**Trade-off:** Less accurate than cloud models, but good enough for 5 categories.

---

### Why Google Places over alternatives?

**Context:** Need restaurant data.

**Options evaluated:**

| Option | Data Quality | Free Tier | Integration |
|--------|--------------|-----------|-------------|
| Google Places | Excellent | Generous | Easy |
| Yelp Fusion | Good | Limited | Medium |
| Foursquare | Good | Limited | Medium |
| Custom scraping | Variable | "Free" | Hard |

**Decision:** Google Places API

**Reasoning:**
1. Best data coverage globally
2. Free tier sufficient for portfolio
3. Well-documented
4. Includes ratings, photos, hours
5. Easy Maps integration

---

### Why no backend?

**Context:** Could build a backend for caching, analytics, etc.

**Decision:** Client-only architecture for v1.

**Reasoning:**
1. Core features don't require backend
2. Faster iteration without deployment
3. Zero hosting costs
4. Simpler architecture to explain
5. Can add later if needed

**What would trigger backend:**
- User accounts
- Usage analytics
- Custom ML model serving
- Rate limit management

---

### Why AsyncStorage over SQLite?

**Context:** Need local storage for caching.

**Decision:** AsyncStorage

**Reasoning:**
- Simple key-value sufficient
- No complex queries needed
- Built into Expo
- Less setup than SQLite

**When to reconsider:** If adding history, favorites, or complex local data.

---

## Process Decisions

### Why document decisions?

**Context:** Portfolio projects often lack context.

**Decision:** Maintain decision log.

**Benefits:**
- Shows thought process to recruiters
- Helps remember reasoning later
- Demonstrates senior-level thinking
- Useful in interviews

---

### Why GitHub Issues over Notion/Linear?

**Context:** Need task management.

**Decision:** GitHub Issues + Projects

**Reasoning:**
1. Everything in one place
2. Visible to recruiters
3. Free
4. Good enough for solo project
5. Demonstrates GitHub proficiency
