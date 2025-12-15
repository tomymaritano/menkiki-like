# Architecture Overview

## System Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App (Expo)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Camera    │  │  TFLite     │  │   Location      │  │
│  │   Module    │  │  Model      │  │   Services      │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
│         │                │                   │           │
│         ▼                ▼                   ▼           │
│  ┌─────────────────────────────────────────────────────┐│
│  │                   App Logic                          ││
│  │  • Image preprocessing                               ││
│  │  • Classification handling                           ││
│  │  • Results ranking                                   ││
│  └──────────────────────┬──────────────────────────────┘│
│                         │                                │
└─────────────────────────┼────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Google Places API   │
              │   (Nearby Search)     │
              └───────────────────────┘
```

---

## Client Layer

### Framework
**Expo (React Native)**

- Cross-platform iOS/Android from single codebase
- Expo Camera for image capture
- Expo Location for GPS
- Expo Router for navigation
- EAS for builds (future)

### State Management
**React Context + useState**

- Simple app state (no complex flows)
- No Redux/MobX overhead
- Context for:
  - Current photo
  - Classification result
  - Location data

### Storage
**AsyncStorage**

- Cache recent classifications (optional)
- Store user preferences (optional)
- No sensitive data

---

## AI Layer

### Model
**TensorFlow Lite**

- Pre-trained food classification model
- Runs entirely on-device
- No network required for inference

### Model Options (Evaluated)

| Model | Size | Accuracy | Speed |
|-------|------|----------|-------|
| MobileNet v2 (food subset) | ~14MB | Good | Fast |
| EfficientNet-Lite | ~20MB | Better | Medium |
| Custom fine-tuned | Variable | Best | Variable |

**Decision:** Start with MobileNet v2, upgrade if needed.

### Preprocessing Pipeline

```
Raw Image → Resize (224x224) → Normalize → Tensor → Model → Softmax → Top Category
```

---

## Data Layer

### Restaurant Data
**Google Places API — Nearby Search**

- No backend required
- Real-time data
- Includes ratings, photos, hours
- Cost: Free tier sufficient for portfolio

### API Flow

```
1. Get user location (lat, lng)
2. Map food category → search keyword
3. Call Places Nearby Search
4. Filter and rank results
5. Display to user
```

### Ranking Algorithm (v1)

```
score = (rating * 0.6) + (1 / distance_km * 0.4)
```

Simple hybrid of quality and proximity.

---

## Why No Backend?

| Concern | Solution |
|---------|----------|
| User data | Not collected in v1 |
| API keys | Expo secure store + app restrictions |
| Rate limiting | Google's free tier is generous |
| Custom logic | All runs on client |
| Analytics | Expo/Firebase Analytics (optional) |

**Benefits:**
- Faster iteration
- Zero hosting costs
- Simpler deployment
- No server maintenance

**Future consideration:**
Backend may be needed for:
- User accounts
- Custom ML models
- Usage analytics
- A/B testing

---

## Security Considerations

1. **API Key Protection**
   - Store in environment variables
   - Restrict key to app bundle ID
   - Never commit to repo

2. **Permissions**
   - Request only when needed
   - Graceful degradation if denied
   - Clear explanation of why

3. **Data Privacy**
   - Photos processed locally
   - Location used only for search
   - No data sent to custom servers
