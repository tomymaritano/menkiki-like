# Roadmap

## Overview

4 phases, each delivering incremental value. Each phase ends with a working (if limited) app.

---

## Phase 1: Foundation

**Goal:** Working app skeleton with camera capture.

### Tasks

1. **Project Setup**
   - Initialize Expo project
   - Configure TypeScript
   - Setup ESLint + Prettier
   - Create folder structure

2. **Navigation**
   - Install Expo Router
   - Create screen files
   - Setup navigation flow

3. **Camera Integration**
   - Implement camera screen
   - Handle permissions
   - Capture and store photo

### Deliverable
App that captures photos and navigates between screens.

---

## Phase 2: Computer Vision

**Goal:** On-device food classification working.

### Tasks

1. **TensorFlow Lite Setup**
   - Install tfjs + tfjs-react-native
   - Configure bundler for model files
   - Test basic inference

2. **Model Integration**
   - Select/download food classification model
   - Load model on app start
   - Implement preprocessing pipeline

3. **Classification Flow**
   - Process captured image
   - Run inference
   - Display result with confidence
   - Handle edge cases (low confidence, errors)

4. **Category Mapping**
   - Map model outputs to food categories
   - Map categories to Places API keywords

### Deliverable
App that classifies food photos and shows detected category.

---

## Phase 3: Recommendations

**Goal:** Full flow from photo to restaurant list.

### Tasks

1. **Location Services**
   - Request location permission
   - Get current coordinates
   - Handle permission denial

2. **Places API Integration**
   - Setup API key securely
   - Implement Nearby Search call
   - Parse response data

3. **Results Screen**
   - Display restaurant list
   - Show name, rating, distance
   - Handle empty/error states

4. **Actions**
   - Open in Google Maps
   - Call restaurant
   - Handle missing data gracefully

5. **Ranking Logic**
   - Implement distance + rating hybrid
   - Sort results
   - Limit to top N results

### Deliverable
Complete working app: photo → classification → nearby restaurants.

---

## Phase 4: Polish & Demo

**Goal:** Portfolio-ready quality.

### Tasks

1. **UX Polish**
   - Loading states and animations
   - Error messages and recovery
   - Permission explanation screens
   - Haptic feedback

2. **Edge Cases**
   - No internet handling
   - No results handling
   - Invalid photo handling
   - Low confidence handling

3. **Performance**
   - Model loading optimization
   - Image preprocessing speed
   - List rendering optimization

4. **Demo Materials**
   - Record demo video
   - Take screenshots
   - Update README with visuals

5. **Code Quality**
   - Code review and cleanup
   - Add key comments
   - Ensure consistent style

### Deliverable
Polished app ready to show in interviews, with demo video.

---

## Future Phases (Out of Scope)

These are documented but not planned for v1:

### Phase 5: Extended Categories
- Add more food categories
- Improve ML model accuracy
- Custom model training

### Phase 6: Multi-City
- City selection
- Localized categories
- Different API regions

### Phase 7: User Features
- User accounts
- Favorites
- Search history
- Personalization

---

## Timeline Guidance

No time estimates provided intentionally. Each phase can be completed when ready. Focus on quality over speed.

**Recommended approach:**
1. Complete each phase fully before moving on
2. Test thoroughly at each phase
3. Commit and document progress
4. Don't skip to later phases
