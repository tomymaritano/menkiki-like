# GitHub Issues — Ready to Create

Copy-paste these into GitHub Issues. Create labels first.

---

## Labels to Create

| Label | Color | Description |
|-------|-------|-------------|
| `phase-1` | `#0E8A16` | Foundation phase |
| `phase-2` | `#1D76DB` | Computer Vision phase |
| `phase-3` | `#5319E7` | Recommendations phase |
| `phase-4` | `#D93F0B` | Polish & Demo phase |
| `infra` | `#FBCA04` | Infrastructure & setup |
| `ux` | `#F9D0C4` | User experience |
| `ml` | `#C2E0C6` | Machine learning |
| `api` | `#BFD4F2` | API integration |
| `bug` | `#D73A4A` | Something isn't working |
| `enhancement` | `#A2EEEF` | New feature or improvement |

---

## Phase 1: Foundation (6 issues)

### Issue #1
**Title:** Setup Expo project with TypeScript

**Labels:** `phase-1`, `infra`

**Description:**
Initialize the Expo project with TypeScript configuration.

**Tasks:**
- [ ] Run `npx create-expo-app` with TypeScript template
- [ ] Verify TypeScript compilation works
- [ ] Add strict mode to tsconfig
- [ ] Test on iOS simulator and Android emulator

---

### Issue #2
**Title:** Configure ESLint and Prettier

**Labels:** `phase-1`, `infra`

**Description:**
Setup code quality tools for consistent code style.

**Tasks:**
- [ ] Install ESLint with React Native config
- [ ] Install Prettier
- [ ] Create `.eslintrc.js` configuration
- [ ] Create `.prettierrc` configuration
- [ ] Add lint scripts to package.json
- [ ] Run initial lint and fix issues

---

### Issue #3
**Title:** Setup Expo Router navigation

**Labels:** `phase-1`, `infra`

**Description:**
Install and configure file-based routing with Expo Router.

**Tasks:**
- [ ] Install expo-router and dependencies
- [ ] Create app directory structure
- [ ] Create placeholder screens: camera, detection, results
- [ ] Configure root layout
- [ ] Test navigation between screens

---

### Issue #4
**Title:** Create folder structure and base components

**Labels:** `phase-1`, `infra`

**Description:**
Establish project organization.

**Tasks:**
- [ ] Create `/components` directory
- [ ] Create `/hooks` directory
- [ ] Create `/utils` directory
- [ ] Create `/constants` directory
- [ ] Create `/types` directory
- [ ] Add base TypeScript types

---

### Issue #5
**Title:** Implement camera screen with Expo Camera

**Labels:** `phase-1`, `ux`

**Description:**
Build the main camera capture screen.

**Tasks:**
- [ ] Install expo-camera
- [ ] Request camera permissions
- [ ] Display camera viewfinder full-screen
- [ ] Add capture button
- [ ] Capture photo and store in state
- [ ] Navigate to detection screen with photo

**Acceptance Criteria:**
- Camera opens on app launch
- Permission denied shows explanation
- Captured photo is passed to next screen

---

### Issue #6
**Title:** Handle camera permissions gracefully

**Labels:** `phase-1`, `ux`

**Description:**
Implement proper permission handling UX.

**Tasks:**
- [ ] Check permission status on mount
- [ ] Show permission request with explanation
- [ ] Handle "denied" state with settings link
- [ ] Handle "never_ask_again" state
- [ ] Add loading state while checking

---

## Phase 2: Computer Vision (6 issues)

### Issue #7
**Title:** Setup TensorFlow.js React Native

**Labels:** `phase-2`, `ml`, `infra`

**Description:**
Install and configure TensorFlow.js for React Native.

**Tasks:**
- [ ] Install @tensorflow/tfjs
- [ ] Install @tensorflow/tfjs-react-native
- [ ] Install expo-gl for WebGL backend
- [ ] Configure metro bundler for model files
- [ ] Test basic TF.js initialization
- [ ] Verify WebGL backend loads

---

### Issue #8
**Title:** Integrate food classification model

**Labels:** `phase-2`, `ml`

**Description:**
Load and use a pre-trained food classification model.

**Tasks:**
- [ ] Research and select appropriate model (MobileNet food)
- [ ] Download model files
- [ ] Add model to assets
- [ ] Implement model loading on app start
- [ ] Add loading state during model init
- [ ] Handle model load errors

---

### Issue #9
**Title:** Implement image preprocessing pipeline

**Labels:** `phase-2`, `ml`

**Description:**
Process captured images for model inference.

**Tasks:**
- [ ] Resize image to model input size (224x224)
- [ ] Normalize pixel values
- [ ] Convert to tensor format
- [ ] Handle different image orientations
- [ ] Optimize for performance

---

### Issue #10
**Title:** Build detection screen UI

**Labels:** `phase-2`, `ux`

**Description:**
Create the screen showing classification results.

**Tasks:**
- [ ] Display captured photo thumbnail
- [ ] Show loading state during classification
- [ ] Display detected food category
- [ ] Show confidence percentage
- [ ] Add "Find nearby places" CTA button
- [ ] Add "Retake" secondary button

---

### Issue #11
**Title:** Implement classification logic

**Labels:** `phase-2`, `ml`

**Description:**
Run inference and interpret results.

**Tasks:**
- [ ] Run model inference on captured image
- [ ] Parse output tensor
- [ ] Apply softmax for probabilities
- [ ] Get top prediction with confidence
- [ ] Map model class to food category
- [ ] Handle classification errors

---

### Issue #12
**Title:** Handle low confidence classifications

**Labels:** `phase-2`, `ux`, `ml`

**Description:**
Handle edge cases when model isn't confident.

**Tasks:**
- [ ] Define confidence threshold (60%)
- [ ] Show "Not sure" state for low confidence
- [ ] Allow user to proceed anyway
- [ ] Suggest retaking photo
- [ ] Log low confidence cases for analysis

---

## Phase 3: Recommendations (7 issues)

### Issue #13
**Title:** Setup location services with Expo Location

**Labels:** `phase-3`, `infra`

**Description:**
Get user's current location.

**Tasks:**
- [ ] Install expo-location
- [ ] Request location permissions
- [ ] Get current coordinates
- [ ] Handle permission denial gracefully
- [ ] Add location loading state

---

### Issue #14
**Title:** Setup Google Places API

**Labels:** `phase-3`, `api`, `infra`

**Description:**
Configure Google Places API for restaurant search.

**Tasks:**
- [ ] Create Google Cloud project
- [ ] Enable Places API
- [ ] Generate API key
- [ ] Restrict API key to app bundle
- [ ] Store key securely (env variables)
- [ ] Test basic API call

---

### Issue #15
**Title:** Implement Nearby Search API call

**Labels:** `phase-3`, `api`

**Description:**
Fetch nearby restaurants based on category.

**Tasks:**
- [ ] Create Places API service module
- [ ] Implement Nearby Search request
- [ ] Map food category to search keyword
- [ ] Pass location coordinates
- [ ] Parse API response
- [ ] Handle API errors

---

### Issue #16
**Title:** Build results screen UI

**Labels:** `phase-3`, `ux`

**Description:**
Display list of nearby restaurants.

**Tasks:**
- [ ] Create restaurant list component
- [ ] Display restaurant name
- [ ] Show star rating
- [ ] Show distance from user
- [ ] Show price level (if available)
- [ ] Add header with detected category
- [ ] Handle empty results state

---

### Issue #17
**Title:** Implement results ranking algorithm

**Labels:** `phase-3`

**Description:**
Sort restaurants by relevance.

**Tasks:**
- [ ] Calculate distance from user location
- [ ] Get rating from API response
- [ ] Implement hybrid score: rating * 0.6 + proximity * 0.4
- [ ] Sort results by score
- [ ] Limit to top 10 results

---

### Issue #18
**Title:** Add Google Maps integration

**Labels:** `phase-3`, `ux`

**Description:**
Allow users to navigate to restaurants.

**Tasks:**
- [ ] Install expo-linking
- [ ] Create "Open in Maps" action
- [ ] Build Google Maps deep link URL
- [ ] Handle tap on restaurant
- [ ] Show action sheet with options

---

### Issue #19
**Title:** Add call restaurant action

**Labels:** `phase-3`, `ux`

**Description:**
Allow users to call restaurants directly.

**Tasks:**
- [ ] Get phone number from Places API
- [ ] Create "Call" action
- [ ] Use Linking to open phone dialer
- [ ] Handle missing phone number gracefully
- [ ] Add to action sheet

---

## Phase 4: Polish & Demo (6 issues)

### Issue #20
**Title:** Add loading states and animations

**Labels:** `phase-4`, `ux`

**Description:**
Improve perceived performance with loading feedback.

**Tasks:**
- [ ] Add skeleton loaders for results
- [ ] Add spinner for API calls
- [ ] Add fade transitions between screens
- [ ] Add button press feedback
- [ ] Consider haptic feedback

---

### Issue #21
**Title:** Implement comprehensive error handling

**Labels:** `phase-4`, `ux`

**Description:**
Handle all error states gracefully.

**Tasks:**
- [ ] Network error handling
- [ ] API error messages
- [ ] Model load failure recovery
- [ ] Retry mechanisms
- [ ] User-friendly error messages

---

### Issue #22
**Title:** Handle no internet state

**Labels:** `phase-4`, `ux`

**Description:**
Graceful degradation when offline.

**Tasks:**
- [ ] Detect network status
- [ ] Show offline message on results screen
- [ ] Allow camera and classification (works offline)
- [ ] Prompt to retry when online
- [ ] Cache last results (optional)

---

### Issue #23
**Title:** Optimize performance

**Labels:** `phase-4`, `infra`

**Description:**
Ensure smooth user experience.

**Tasks:**
- [ ] Profile model loading time
- [ ] Optimize image preprocessing
- [ ] Lazy load heavy components
- [ ] Optimize list rendering (FlatList)
- [ ] Measure and log performance metrics

---

### Issue #24
**Title:** Record demo video

**Labels:** `phase-4`

**Description:**
Create portfolio demo materials.

**Tasks:**
- [ ] Plan demo script (30-60 seconds)
- [ ] Record on physical device
- [ ] Edit and add annotations
- [ ] Upload to YouTube/Loom
- [ ] Add to README

---

### Issue #25
**Title:** Final code review and cleanup

**Labels:** `phase-4`, `infra`

**Description:**
Prepare codebase for portfolio showcase.

**Tasks:**
- [ ] Remove console.logs
- [ ] Add key comments where needed
- [ ] Ensure consistent code style
- [ ] Update README with final screenshots
- [ ] Verify all links work
- [ ] Tag v1.0 release

---

## GitHub Project Board

Create a Project with these columns:

| Column | Purpose |
|--------|---------|
| Backlog | All issues not yet planned |
| Planned | Issues for current phase |
| In Progress | Currently working on (max 2) |
| Review | Done, needs self-review |
| Done | Completed and merged |

**Workflow:**
1. Move Phase 1 issues to "Planned"
2. Pick one issue → "In Progress"
3. Complete → "Review" → "Done"
4. Repeat until phase complete
5. Move next phase to "Planned"
