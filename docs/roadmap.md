# Roadmap

## Overview

Phased development approach. Each phase delivers incremental value with a working app.

**Current Version:** v2.1.0

---

## ✅ Phase 1: Foundation (COMPLETE)

**Goal:** Working app skeleton with camera capture.

- [x] Initialize Expo project with TypeScript
- [x] Configure ESLint + Prettier
- [x] Setup Expo Router navigation
- [x] Implement camera screen
- [x] Handle camera permissions
- [x] Create folder structure

**Release:** v1.0.0

---

## ✅ Phase 2: Computer Vision (COMPLETE)

**Goal:** On-device food classification.

- [x] Install TensorFlow.js + React Native adapter
- [x] Implement MobileNet v2 model
- [x] Create image-to-tensor pipeline
- [x] Map ImageNet labels to food categories
- [x] Handle low confidence results
- [x] Fallback mock classifier

**Release:** v2.0.0

---

## ✅ Phase 3: Recommendations (COMPLETE)

**Goal:** Full flow from photo to restaurant list.

- [x] Location services with expo-location
- [x] Google Places API integration
- [x] Mock data fallback (Buenos Aires)
- [x] Results screen with ranking
- [x] Action sheet (Maps, Call)
- [x] Distance + rating hybrid score

**Release:** v1.0.0

---

## ✅ Phase 4: Polish & UX (COMPLETE)

**Goal:** Portfolio-ready quality.

- [x] Loading animations (PulsingDot, SkeletonCard, FadeIn)
- [x] Offline detection banner
- [x] Onboarding flow (4 slides)
- [x] Splash screen integration
- [x] Error states and recovery
- [x] Favorites with AsyncStorage
- [x] Search history

**Release:** v2.1.0

---

## 🔄 Phase 5: Testing (CURRENT)

**Goal:** Confidence in code quality.

### 5.1 Unit Tests
- [ ] Setup Jest + React Native Testing Library
- [ ] Test hooks (useClassifier, useFavorites, useHistory)
- [ ] Test services (classifier, places)
- [ ] Test utility functions
- [ ] Aim for 80%+ coverage on business logic

### 5.2 Component Tests
- [ ] Test UI components in isolation
- [ ] Snapshot tests for key screens
- [ ] Test user interactions

### 5.3 Integration Tests
- [ ] Test navigation flows
- [ ] Test async storage persistence
- [ ] Test API error handling

**Deliverable:** Test suite with CI integration.

---

## 📋 Phase 6: CI/CD Pipeline

**Goal:** Automated quality checks.

### 6.1 GitHub Actions
- [ ] Lint on every PR
- [ ] Run tests on every PR
- [ ] Type check with TypeScript
- [ ] Build check (expo prebuild)

### 6.2 Quality Gates
- [ ] Require passing checks for merge
- [ ] Code coverage reporting
- [ ] Bundle size tracking

### 6.3 Release Automation
- [ ] Auto-tag on merge to main
- [ ] Generate changelog
- [ ] Create GitHub releases

**Deliverable:** Automated pipeline for quality assurance.

---

## 📋 Phase 7: Production Hardening

**Goal:** Production-ready reliability.

### 7.1 Error Handling
- [ ] Error boundaries for crash recovery
- [ ] Sentry or similar error tracking
- [ ] Graceful degradation

### 7.2 Performance
- [ ] Image compression before classification
- [ ] Lazy load screens
- [ ] Optimize re-renders with memo
- [ ] Profile and fix bottlenecks

### 7.3 Security
- [ ] Secure API key storage
- [ ] Input validation
- [ ] Network request timeout handling

### 7.4 Accessibility
- [ ] Screen reader support
- [ ] Accessible labels
- [ ] Color contrast compliance
- [ ] Touch target sizes

**Deliverable:** Production-grade stability and accessibility.

---

## 📋 Phase 8: Advanced ML

**Goal:** Improved classification accuracy.

### 8.1 Custom Model
- [ ] Prepare Food-101 dataset
- [ ] Fine-tune MobileNet on food images
- [ ] Convert to TensorFlow.js format
- [ ] Test accuracy improvements

### 8.2 Extended Categories
- [ ] Add 10+ food categories
- [ ] Improve label mapping
- [ ] Handle multi-label predictions

### 8.3 Model Optimization
- [ ] Quantize model for smaller size
- [ ] Benchmark inference speed
- [ ] A/B test vs MobileNet

**Deliverable:** 80%+ accuracy on food classification.

---

## 📋 Phase 9: App Store Readiness

**Goal:** Ready for public release.

### 9.1 Assets
- [ ] App icon (all sizes)
- [ ] Splash screen image
- [ ] Screenshots for store listing
- [ ] Demo video

### 9.2 Store Listing
- [ ] App description
- [ ] Keywords/tags
- [ ] Privacy policy
- [ ] Terms of service

### 9.3 Build & Submit
- [ ] EAS Build configuration
- [ ] TestFlight (iOS)
- [ ] Internal testing (Android)
- [ ] Submit for review

**Deliverable:** App published to stores.

---

## Progress Summary

| Phase | Status | Version |
|-------|--------|---------|
| 1. Foundation | ✅ Complete | v1.0.0 |
| 2. Computer Vision | ✅ Complete | v2.0.0 |
| 3. Recommendations | ✅ Complete | v1.0.0 |
| 4. Polish & UX | ✅ Complete | v2.1.0 |
| 5. Testing | 🔄 In Progress | - |
| 6. CI/CD Pipeline | 📋 Planned | - |
| 7. Production Hardening | 📋 Planned | - |
| 8. Advanced ML | 📋 Planned | - |
| 9. App Store | 📋 Planned | - |

---

## Recommended Order

Follow phases sequentially:

1. **Testing first** - Ensures existing code works before adding more
2. **CI/CD** - Automates quality checks going forward
3. **Production Hardening** - Makes app stable
4. **Advanced ML** - Improves core feature
5. **App Store** - Final polish for release

Each phase builds on the previous. Don't skip ahead.
