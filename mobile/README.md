# 📱 SwasthyaSaathi Patient Mobile Application

The **SwasthyaSaathi Patient Mobile Application** is built with **Flutter 3**, strictly adhering to the approved **Flowstep Design System** as the visual source of truth and integrated with the **FastAPI Clinical Backend** (`http://127.0.0.1:8000/api/v1`).

---

## 🛡 Clinical Governance Principle
> **"AI ASSISTS. PHYSICIAN DECIDES."**  
> The mobile app serves purely as a structured pre-consultation intake tool. It captures symptoms, speech narratives, constitutional markers, and paper prescriptions before the patient meets their doctor.

---

## 🎨 Design System & Flowstep Tokens

All visual tokens are centralized in [`lib/core/theme/app_theme.dart`](lib/core/theme/app_theme.dart):
- **Primary Saffron**: `#EA580C` (Actions, active recording, token highlights)
- **Clinical Emerald**: `#059669` (Verified statuses, checkmarks, AYUSH indicators)
- **Dark Slate**: `#090D16` (Boarding pass token cards, dark headers)
- **Surface Background**: `#F8FAFC` (Clean clinical environment)
- **Corner Radii**:
  - `radiusCard: 20.0`
  - `radiusButton: 16.0`
  - `radiusSheet: 32.0`
- **Touch Targets**: Standard `56.0` height minimum with subtle elevation shadows.

---

## 📋 Canonical 26-Screen Inventory

1. **Screen 01**: Welcome & Language Entry (`WelcomeScreen`)
2. **Screen 02**: Language Selector Sheet (`LanguageSelectorBottomSheet`)
3. **Screen 03**: ABHA ID Input (`AbhaInputScreen`)
4. **Screen 04**: ABHA OTP Verification (`AbhaOtpScreen`)
5. **Screen 05**: ABHA Verified Demographic Profile (`AbhaProfileScreen`)
6. **Screen 06**: Patient Data Privacy & Consent Notice (`ConsentScreen`)
7. **Screen 07**: Voice Intake Chief Complaint Idle (`InterviewScreen`)
8. **Screen 08**: Voice Recording Listening (`InterviewPhase.question1Listening`)
9. **Screen 09**: Voice Processing State (`InterviewPhase.question1Processing`)
10. **Screen 10**: Transcript Review & Edit (`InterviewPhase.question1ReviewEdit`)
11. **Screen 11**: Adaptive Clinical Follow-up (`InterviewPhase.adaptiveFollowup`)
12. **Screen 12**: AYUSH Prakriti Intake (`InterviewPhase.ayushPrakriti`)
13. **Screen 13**: Document Scanner Viewfinder (`DocumentPhase.viewfinder`)
14. **Screen 14**: Document OCR Processing (`DocumentPhase.processing`)
15. **Screen 15**: Extracted Document Review (`DocumentPhase.extractedReview`)
16. **Screen 16**: Clinical Case Review Summary (`ReviewScreen`)
17. **Screen 17**: OPD Token & Live Queue Status (`CompletionScreen`)
18. **Screen 18**: Network Offline State (`OfflineStateScreen`)
19. **Screen 19**: Session Inactivity / Lock State (`SystemStateModals.showSessionExpiredDialog`)
20. **Screen 20**: Microphone Permission Denied (`MicrophonePermissionDeniedScreen`)
21. **Screen 21**: Document Processing Failure (`DocumentPhase.failure`)
22. **Screen 22**: Camera Unavailable State (`CameraUnavailableScreen`)
23. **Screen 23**: Multi-page Document Carousel (`DocumentPhase.multipage`)
24. **Screen 24**: Empty Health Records State (`EmptyHealthRecordsScreen`)
25. **Screen 25**: Exit Confirmation Sheet (`SystemStateModals.showExitConfirmationSheet`)
26. **Screen 26**: Dispensary Token Reference (`PharmacyTokenScreen`)

---

## 🛠 Running & Building Locally

### 1. Prerequisites
- Flutter SDK `3.13.2+`
- Android Studio / Android SDK (API 34+)

### 2. Dependencies
```bash
flutter pub get
```

### 3. Connect to Backend via ADB Reverse Tunnel
When testing on a physical device:
```bash
adb reverse tcp:8000 tcp:8000
```

### 4. Run App
```bash
# Debug run
flutter run

# Build Android APK (arm64)
flutter build apk --debug --target-platform android-arm64
adb install -r build/app/outputs/flutter-apk/app-debug.apk
```

---

## 🧪 Testing

```bash
# Static analysis
flutter analyze  # Must pass with 0 issues

# Unit & widget tests
flutter test     # All tests must pass
```
