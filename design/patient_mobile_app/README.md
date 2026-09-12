# 📱 SwasthyaSaathi Ultra-Modern Android Patient App — Flowstep Visual Design Suite

> Master Design Workspace: [Flowstep App](https://app.flowstep.ai/file?activeFileId=f956ad9a-5b0e-4f2b-a0ac-cd5669de5012)  
> Workspace File ID: `f956ad9a-5b0e-4f2b-a0ac-cd5669de5012`  
> Organization: `94b00a72-4341-4d0a-8760-f057c67815cc`  
> Designed for **Android 14+ / Material 3** (360×780dp mobile viewport), bilingual Hindi/English accessibility, DPDP Act 2023 compliance, and ABDM M1/M2/M3 standards.

---

## 🎨 Design Foundation & Modern Aesthetic

1. **Typography**:
   - Primary: **Plus Jakarta Sans** (`400`, `500`, `600`, `700`, `800`) for ultra-clean, modern geometric readability.
   - Multilingual: **Noto Sans Devanagari** (`400`, `500`, `600`, `700`) for native Hindi, Marathi, and Gujarati scripts.
   - Zero generic serif or system font defaults.

2. **Vector Line Iconography**:
   - Strict **Lucide-style 24×24 SVG line icons** (`strokeWidth="2"` / `strokeLinecap="round"` / `strokeLinejoin="round"`).
   - **Zero raw emojis** anywhere in the interface.
   - Consistent stroke weights, bounding boxes, and visual hierarchy.

3. **Color System**:
   - **Medical Saffron**: `#EA580C` (Primary CTA, active states, glowing acoustic focus).
   - **Clinical Emerald**: `#059669` / `#10B981` (ABDM verification, confirmed markers, valid tokens).
   - **Architectural Slate**: `#090D16` / `#0F172A` (Boarding-pass token, dark camera viewfinder, dispensary token).
   - **Neutral Light**: `#F8FAFC` base surface, `#FFFFFF` crisp elevated cards, hairline borders `#E2E8F0`.

4. **Android Native Ergonomics**:
   - Native 24dp Android dynamic status bar (clock 09:42, 5G, signal, battery).
   - 32dp native bottom gesture navigation bar.
   - Minimum 56dp primary touch targets with generous 24dp (`px-6`) gutters.
   - Anti-card architectural layout: breathing room, generous whitespaces, zero overlapping elements.

---

## 📂 26 Screen Suite Catalog

All screens are rendered directly into `design/patient_mobile_app/images/`:

| # | Screen Label | Rendered Asset | Clinical Context & Design Highlights |
|---|---|---|---|
| **01** | `01 Welcome & Onboarding` | [`01_welcome_language_screen.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/01_welcome_language_screen.png) | High-contrast entry, 56dp Saffron QR scan button, 14-digit ABHA check-in pill, trust strip. |
| **02** | `02 Language Selector Sheet` | [`02_language_selector_sheet.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/02_language_selector_sheet.png) | Rounded-t-3xl modal sheet with native script radio cards (EN, हिन्दी, मराठी, ગુજરાતી). |
| **03** | `03 ABHA Input (Step 1)` | [`02_abha_identity_verification.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/02_abha_identity_verification.png) | 14-digit ABHA input, explicit "ABDM Mock Sandbox (Local Development)" badge. |
| **04** | `02b ABHA Mobile OTP Verification` | [`02b_abha_otp_verified.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/02b_abha_otp_verified.png) | 6-digit OTP boxes, 60s countdown timer, resend link, 256-bit encryption badge. |
| **05** | `02c ABHA Verified Profile` | [`02c_abha_verified_profile.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/02c_abha_verified_profile.png) | Verified patient profile (Rahul Sharma, 34M), 2 discovered clinical records, consent toggle. |
| **06** | `06 Patient Consent & DPDP Notice` | [`06_patient_consent_screen.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/06_patient_consent_screen.png) | DPDP Act 2023 compliance, granular permission toggles for voice, OCR, AYUSH markers. |
| **07** | `07 Voice Intake (Question 1/4)` | [`03_voice_intake_chief_complaint.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/03_voice_intake_chief_complaint.png) | Chief Complaint intake, symptom chips, 80dp glowing mic orb, keyboard typing fallback. |
| **08** | `08 Voice Recording Listening` | [`08_voice_interview_recording_state.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/08_voice_interview_recording_state.png) | Active listening with 21 harmonic audio wave bars, live duration `● 00:14`, live speech stream bubble. |
| **09** | `09 Voice Processing State` | [`09_voice_processing_state.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/09_voice_processing_state.png) | Concentric pulsing processing ring, live milestone pipeline, clinical structuring notice. |
| **10** | `10 Transcript Review & Edit` | [`10_transcript_review_edit.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/10_transcript_review_edit.png) | Bilingual transcript editor, character count, recognition confirmation, re-record action. |
| **11** | `11 Adaptive Clinical Follow-up` | [`11_adaptive_followup_question.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/11_adaptive_followup_question.png) | Follow-up on epigastric burning timeline, 4 tactile option cards with emerald active selection. |
| **12** | `12 AYUSH Prakriti Intake` | [`04_ayush_prakriti_profile.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/04_ayush_prakriti_profile.png) | Clinical markers: Agni (Digestion), Nidra (Sleep), Weather aggravation (Hot/Cold/Rainy). |
| **13** | `13 Document Scanner Camera` | [`13_document_scanner_viewfinder.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/13_document_scanner_viewfinder.png) | Dark slate `#0B0F19` camera viewfinder, emerald auto-detection corner brackets, shutter button. |
| **14** | `14 Document OCR Processing` | [`14_document_ocr_processing.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/14_document_ocr_processing.png) | Animated laser scanning line, recognized medicine chips, local hospital encryption badge. |
| **15** | `15 Extracted Document Review` | [`15_extracted_document_review.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/15_extracted_document_review.png) | Extracted clinic, date, and medicines (Avipattikar Churna, Sutshekhar Ras) with dosages. |
| **16** | `16 Clinical Case Review Summary` | [`16_clinical_case_review_summary.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/16_clinical_case_review_summary.png) | Pre-consultation summary for Dr. Sharma, ABDM linkage, symptom timeline, physician notice. |
| **17** | `17 OPD Token & Live Queue` | [`07_opd_token_live_queue.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/07_opd_token_live_queue.png) | Architectural boarding-pass token (OPD • A42), live queue position (3 ahead), consultation stepper. |
| **18** | `19 Network Offline State` | [`19_network_offline_state.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/19_network_offline_state.png) | Offline banner, local token card (OPD-A42), retry button, reception check-in instruction. |
| **19** | `20 Session Expired State` | [`20_session_expired_state.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/20_session_expired_state.png) | 10-minute inactivity privacy lock, biometric unlock button, saved token reminder. |
| **20** | `21 Microphone Permission Denied` | [`21_mic_permission_denied_state.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/21_mic_permission_denied_state.png) | 3-step Android permission recovery flow, open settings button, typing mode fallback. |
| **21** | `22 Document Processing Failure` | [`22_document_processing_failure.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/22_document_processing_failure.png) | Blurry image recovery tips, retake photo button, manual entry fallback. |
| **22** | `23 Camera Unavailable State` | [`23_camera_unavailable_state.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/23_camera_unavailable_state.png) | Hardware lock detection, alternate gallery/PDF upload buttons, skip upload option. |
| **23** | `24 Multipage Document Carousel` | [`24_multipage_document_carousel.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/24_multipage_document_carousel.png) | 2-page preview cards (Prescription P1, Lab Report P2), delete/view actions, add page button. |
| **24** | `25 Empty Health Records State` | [`25_empty_health_records_state.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/25_empty_health_records_state.png) | Encouraging first-visit empty state, paper scan CTA, fresh symptom intake CTA. |
| **25** | `26 Exit Confirmation Sheet` | [`26_exit_confirmation_sheet.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/26_exit_confirmation_sheet.png) | Pause intake sheet, draft preservation summary, keep going vs save draft vs discard. |
| **26** | `27 Prescription Pharmacy Token` | [`27_prescription_pharmacy_token.png`](file:///Users/harshkoli/Patient-Case-Taking-Software/design/patient_mobile_app/images/27_prescription_pharmacy_token.png) | Architectural pharmacy token (PHARMACY • P18), dispensing counter, medicine pickup, WhatsApp/PDF. |

---

## 🔒 Strict Phase 1 Boundary

- **Phase**: **PHASE 1 — DESIGN ONLY**
- **Flutter Codebase**: 100% untouched (`git status --porcelain mobile/` is empty).
- **Implementation**: Blocked until user explicitly reviews and replies `"APPROVED — IMPLEMENT THE DESIGN"`.
