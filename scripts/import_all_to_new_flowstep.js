#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const NEW_FILE_ID = "65fa0774-739d-4655-9126-e38534076f8f";
const IMG_DIR = path.join(__dirname, "../design/patient_mobile_app/images");
const ARTIFACT_DIR = "/Users/harshkoli/.gemini/antigravity-ide/brain/60d07897-c7fb-4336-a16b-a06bf9922049";

function addAndRender(label, filename, jsx) {
  console.log(`\nAdding [${label}] to new Flowstep file...`);
  try {
    const addRes = execFileSync("node", ["scripts/flowstep_call.js", "add-screen", JSON.stringify({
      fileId: NEW_FILE_ID,
      label: label,
      jsxContent: jsx
    })], { encoding: "utf8" });

    const parsed = JSON.parse(addRes);
    if (parsed.result?.isError) {
      console.error(`Error adding ${label}:`, parsed.result.content[0].text);
      return null;
    }

    const screenData = JSON.parse(parsed.result.content[0].text);
    const screenId = screenData.screenId;
    console.log(`✓ Screen created: ${screenId}`);

    const imgRes = execFileSync("node", ["scripts/flowstep_call.js", "get-screen-image", JSON.stringify({
      fileId: NEW_FILE_ID,
      screenId: screenId
    })], { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });

    const imgParsed = JSON.parse(imgRes);
    const content = imgParsed.result.content[0];
    if (content.type === "image") {
      const buf = Buffer.from(content.data, "base64");
      fs.writeFileSync(path.join(IMG_DIR, filename), buf);
      fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buf);
      console.log(`✓ Rendered & Saved: ${filename} (${buf.length} bytes)`);
      return { screenId, filename, size: buf.length };
    } else {
      console.error(`Render issue for ${label}:`, content.text);
      return null;
    }
  } catch (err) {
    console.error(`Exception on ${label}:`, err.message);
    return null;
  }
}

// ── COMPLETE 21-SCREEN MASTER INVENTORY ─────────────────────────────────────

const masterScreens = [
  // 01. Welcome Screen
  {
    label: "01 Welcome & Language",
    filename: "01_welcome_language_screen.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="px-5 pt-3 pb-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-[#0F172A] flex items-center justify-center text-[#FBFBFA] font-bold text-xs tracking-tight">SS</div>
      <div>
        <div className="text-[13px] font-bold text-[#0F172A] leading-none">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A] font-medium tracking-wide">National AYUSH Clinical OPD</div>
      </div>
    </div>
    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E6E4DD] bg-white text-xs font-semibold text-[#191C1E] shadow-sm">
      <span>🌐</span>
      <span>English / हिन्दी</span>
      <span className="text-[10px] text-[#73777A]">▾</span>
    </button>
  </header>

  <main className="px-5 py-3 flex-1 flex flex-col justify-center">
    <div className="space-y-2 mb-6">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF6EE] border border-[#1E7B48]/20 text-[11px] font-medium text-[#1E7B48]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1E7B48]"></span>
        ABDM & Ayushman Bharat Verified
      </div>
      <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
        Fast, private OPD intake before you meet your doctor.
      </h1>
      <p className="text-xs text-[#45484A] leading-relaxed">
        Speak or type your symptoms in your preferred language. Your doctor will review your case summary when your token is called.
      </p>
    </div>

    <div className="space-y-3">
      <button className="w-full min-h-[54px] bg-[#E86114] hover:bg-[#C2410C] active:scale-[0.99] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-sm transition-transform">
        <span className="text-base">📷</span>
        <span>Scan Clinic QR Code to Begin</span>
      </button>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-[#E6E4DD]"></div>
        <span className="flex-shrink mx-3 text-[11px] font-semibold text-[#73777A] uppercase tracking-wider">or check in with id</span>
        <div className="flex-grow border-t border-[#E6E4DD]"></div>
      </div>

      <button className="w-full min-h-[50px] bg-white border border-[#E6E4DD] text-[#0F172A] font-semibold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#F5F4F0] active:scale-[0.99]">
        <span>🆔</span>
        <span>Check in with 14-Digit ABHA / Aadhaar</span>
      </button>

      <button className="w-full py-2 text-center text-xs font-semibold text-[#73777A] hover:text-[#0F172A]">
        Walk-in patient without ABHA? Continue as Guest →
      </button>
    </div>
  </main>

  <footer className="px-5 py-3 border-t border-[#E6E4DD] bg-white flex items-center justify-between text-[11px] text-[#73777A]">
    <div className="flex items-center gap-1.5">
      <span>🔒</span>
      <span>256-bit Encrypted • Local OPD Storage</span>
    </div>
    <span className="font-semibold text-[#0F172A]">AI assists. Physician decides.</span>
  </footer>
</div>`
  },

  // 02. Language Selection Sheet
  {
    label: "02 Language Selector Sheet",
    filename: "02_language_selector_sheet.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#191C1E]/40 w-full min-h-[780px] flex flex-col justify-end font-sans">
  <div className="bg-white rounded-t-[24px] p-5 pb-8 flex flex-col gap-5 border-t border-[#E6E4DD] shadow-xl">
    <div className="w-10 h-1 rounded-full bg-[#E6E4DD] mx-auto" />
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-[#191C1E]">Select Language / भाषा चुनें</h2>
        <p className="text-xs text-[#73777A] mt-0.5">Choose your preferred language for consultation</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-[#F5F4F0] flex items-center justify-center text-[#45484A] text-sm font-semibold">✕</div>
    </div>

    <div className="flex flex-col gap-2.5">
      <button className="flex items-center justify-between p-3.5 rounded-xl border-2 border-[#E86114] bg-[#FFF5EE]">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-[#E86114]">हिन्दी</span>
          <span className="text-xs text-[#73777A]">Hindi</span>
        </div>
        <div className="w-5 h-5 rounded-full bg-[#E86114] flex items-center justify-center text-white text-xs">✓</div>
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6E4DD] bg-white">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[#191C1E]">English</span>
          <span className="text-xs text-[#73777A]">English</span>
        </div>
        <div className="w-5 h-5 rounded-full border-2 border-[#E6E4DD]" />
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6E4DD] bg-white">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[#191C1E]">मराठी</span>
          <span className="text-xs text-[#73777A]">Marathi</span>
        </div>
        <div className="w-5 h-5 rounded-full border-2 border-[#E6E4DD]" />
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6E4DD] bg-white">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[#191C1E]">বাংলা</span>
          <span className="text-xs text-[#73777A]">Bengali</span>
        </div>
        <div className="w-5 h-5 rounded-full border-2 border-[#E6E4DD]" />
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6E4DD] bg-white">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[#191C1E]">தமிழ்</span>
          <span className="text-xs text-[#73777A]">Tamil</span>
        </div>
        <div className="w-5 h-5 rounded-full border-2 border-[#E6E4DD]" />
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6E4DD] bg-white">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[#191C1E]">తెలుగు</span>
          <span className="text-xs text-[#73777A]">Telugu</span>
        </div>
        <div className="w-5 h-5 rounded-full border-2 border-[#E6E4DD]" />
      </button>
    </div>

    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm mt-2">
      Confirm Language / भाषा चुनें
    </button>
  </div>
</div>`
  },

  // 03. ABHA Verification (Step 1)
  {
    label: "03 ABHA Input Step 1",
    filename: "02_abha_identity_verification.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">ABDM Verification</div>
      </div>
    </div>
    <span className="text-xs font-semibold text-[#1E7B48] bg-[#EBF6EE] px-2.5 py-1 rounded-full border border-[#1E7B48]/30">Step 1 of 3</span>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-4">
    <div>
      <h1 className="text-xl font-bold text-[#191C1E] leading-snug">Link Your ABHA Health ID / आभा आईडी दर्ज करें</h1>
      <p className="text-xs text-[#45484A] mt-1">Connect your verified national health profile or use Aadhaar</p>
    </div>

    <div className="p-3 bg-[#EBF6EE] border border-[#1E7B48]/30 rounded-xl text-xs text-[#1E7B48] flex items-center gap-2 font-medium">
      <span>🛡️</span>
      <span>ABDM Mock Sandbox (Local Dev) active</span>
    </div>

    <div className="flex flex-col gap-3">
      <div>
        <label className="text-xs font-semibold text-[#191C1E] block mb-1.5">14-Digit ABHA Number or @abdm address</label>
        <input
          type="text"
          placeholder="e.g. 91-4829-1029-4820"
          className="w-full min-h-[50px] px-3.5 rounded-xl border border-[#E6E4DD] bg-white text-sm text-[#191C1E] placeholder-[#73777A] focus:outline-none focus:border-[#E86114]"
        />
        <span className="text-[11px] text-[#73777A] mt-1 block">You will receive an OTP on your Aadhaar-linked phone</span>
      </div>

      <div className="p-3.5 rounded-xl border border-[#E6E4DD] bg-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-lg">🆔</span>
          <div>
            <div className="text-xs font-semibold text-[#191C1E]">Don't remember your ABHA?</div>
            <div className="text-[10px] text-[#73777A]">Verify using your 12-digit Aadhaar Number</div>
          </div>
        </div>
        <button className="text-xs font-bold text-[#E86114]">Use Aadhaar</button>
      </div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex flex-col gap-3">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Send OTP Verification →
    </button>
    <button className="text-center text-xs font-semibold text-[#73777A] py-1">
      Skip for now • Continue as Walk-in Guest
    </button>
  </footer>
</div>`
  },

  // 04. ABHA OTP Entry (Step 2)
  {
    label: "04 ABHA OTP Step 2",
    filename: "02b_abha_otp_verified.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">ABDM Verification</div>
      </div>
    </div>
    <span className="text-xs font-semibold text-[#1E7B48] bg-[#EBF6EE] px-2.5 py-1 rounded-full border border-[#1E7B48]/30">Step 2 of 3</span>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-5">
    <div>
      <h1 className="text-xl font-bold text-[#191C1E] leading-snug">Enter Verification OTP / ओटीपी दर्ज करें</h1>
      <p className="text-xs text-[#45484A] mt-1">6-digit code sent to phone linked with ABHA ending in <strong>•••• 4820</strong></p>
    </div>

    <div className="flex justify-between gap-2 my-2">
      <div className="w-12 h-14 rounded-xl border-2 border-[#E86114] bg-white flex items-center justify-center text-lg font-bold text-[#191C1E]">4</div>
      <div className="w-12 h-14 rounded-xl border-2 border-[#E86114] bg-white flex items-center justify-center text-lg font-bold text-[#191C1E]">8</div>
      <div className="w-12 h-14 rounded-xl border-2 border-[#E86114] bg-white flex items-center justify-center text-lg font-bold text-[#191C1E]">2</div>
      <div className="w-12 h-14 rounded-xl border border-[#E6E4DD] bg-white flex items-center justify-center text-lg font-bold text-[#191C1E]"></div>
      <div className="w-12 h-14 rounded-xl border border-[#E6E4DD] bg-white flex items-center justify-center text-lg font-bold text-[#191C1E]"></div>
      <div className="w-12 h-14 rounded-xl border border-[#E6E4DD] bg-white flex items-center justify-center text-lg font-bold text-[#191C1E]"></div>
    </div>

    <div className="text-center text-xs text-[#73777A]">
      Resend OTP in <span className="font-bold text-[#E86114]">00:42</span>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex flex-col gap-3">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Verify & Link Records →
    </button>
    <button className="text-center text-xs font-semibold text-[#73777A] py-1">
      Change ABHA / Phone Number
    </button>
  </footer>
</div>`
  },

  // 05. ABHA Verified Demographic Profile (Step 3)
  {
    label: "05 ABHA Verified Profile Step 3",
    filename: "02c_abha_verified_profile.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">ABDM Verification</div>
      </div>
    </div>
    <span className="text-xs font-semibold text-[#1E7B48] bg-[#EBF6EE] px-2.5 py-1 rounded-full border border-[#1E7B48]/30">Step 3 of 3</span>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-4">
    <div className="p-4 rounded-xl border-2 border-[#1E7B48] bg-[#EBF6EE] flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#1E7B48] flex items-center justify-center text-white text-lg font-bold">✓</div>
      <div>
        <div className="text-sm font-bold text-[#1E7B48]">Identity Verified via ABDM</div>
        <div className="text-xs text-[#191C1E]">ABDM Mock Sandbox (Local Dev)</div>
      </div>
    </div>

    <div className="p-4 bg-white rounded-xl border border-[#E6E4DD] flex flex-col gap-3">
      <div className="flex items-center gap-3 pb-3 border-b border-[#E6E4DD]">
        <div className="w-12 h-12 rounded-full bg-[#FFF5EE] border border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-sm">RS</div>
        <div>
          <div className="text-base font-bold text-[#191C1E]">Rahul Sharma</div>
          <div className="text-xs text-[#73777A]">Male • 34 Years • ABHA: 91-4829-1029-4820</div>
        </div>
      </div>
      <div className="text-xs text-[#45484A] leading-relaxed">
        Your verified identity and historical health summaries will be presented to the consulting doctor during today's intake.
      </div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD]">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Proceed to Clinical Consent →
    </button>
  </footer>
</div>`
  },

  // 06. Patient Clinical Consent
  {
    label: "06 Patient Consent",
    filename: "06_patient_consent_screen.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Clinical Privacy</div>
      </div>
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-4">
    <div>
      <h1 className="text-xl font-bold text-[#191C1E] leading-snug">Patient Clinical Consent / रोगी सहमति</h1>
      <p className="text-xs text-[#45484A] mt-1">Please review how your health data is used during this intake session.</p>
    </div>

    <div className="flex flex-col gap-3">
      <div className="p-3.5 bg-white rounded-xl border border-[#E6E4DD] flex items-start gap-3">
        <span className="text-lg">🔒</span>
        <div className="text-xs text-[#45484A] leading-relaxed">
          <strong className="text-[#191C1E] block mb-0.5">1. Private & Encrypted</strong>
          Your spoken answers and uploaded medical documents are encrypted and shared only with your treating physician.
        </div>
      </div>

      <div className="p-3.5 bg-white rounded-xl border border-[#E6E4DD] flex items-start gap-3">
        <span className="text-lg">🩺</span>
        <div className="text-xs text-[#45484A] leading-relaxed">
          <strong className="text-[#191C1E] block mb-0.5">2. Physician Decision Only</strong>
          AI only organizes your responses. All medical diagnosis and treatment decisions are made exclusively by your doctor.
        </div>
      </div>

      <div className="p-3.5 bg-white rounded-xl border border-[#E6E4DD] flex items-start gap-3">
        <span className="text-lg">🏛️</span>
        <div className="text-xs text-[#45484A] leading-relaxed">
          <strong className="text-[#191C1E] block mb-0.5">3. ABDM Compliance</strong>
          Data linkage conforms to Ayushman Bharat Digital Mission guidelines. You may revoke consent at any time.
        </div>
      </div>
    </div>

    <label className="flex items-center gap-3 p-3 bg-[#FFF5EE] border border-[#E86114]/30 rounded-xl cursor-pointer">
      <input type="checkbox" defaultChecked className="w-4 h-4 text-[#E86114] rounded border-[#E6E4DD]" />
      <span className="text-xs font-semibold text-[#191C1E]">I understand and agree to OPD intake case taking</span>
    </label>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD]">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Accept & Start Case Taking →
    </button>
  </footer>
</div>`
  },

  // 07. Voice Intake Ready State (Question 1/4)
  {
    label: "07 Voice Intake Ready",
    filename: "03_voice_intake_chief_complaint.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="px-5 pt-3 pb-2 border-b border-[#E6E4DD] bg-white">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <button className="text-base text-[#73777A] pr-1">←</button>
        <span className="text-xs font-bold text-[#E86114] tracking-wide uppercase">Question 1 of 4 • Chief Complaint</span>
      </div>
      <span className="text-xs font-bold text-[#73777A]">25%</span>
    </div>
    <div className="w-full h-1.5 rounded-full bg-[#E6E4DD]">
      <div className="w-1/4 h-full rounded-full bg-[#E86114]" />
    </div>
  </header>

  <main className="px-5 py-4 flex-1 flex flex-col justify-between">
    <div className="space-y-3">
      <h1 className="text-xl font-extrabold text-[#0F172A] leading-snug">
        What health problem brings you to the clinic today?
      </h1>
      <p className="text-sm font-medium text-[#73777A] leading-relaxed">
        आज आपको क्या स्वास्थ्य समस्या है?
      </p>
      <div className="p-3 bg-white border border-[#E6E4DD] rounded-xl text-xs text-[#45484A] leading-relaxed">
        💡 Speak naturally in Hindi, English, Marathi, or your regional language. Mention what hurts, when it started, and any medicines you took.
      </div>
    </div>

    <div className="space-y-2">
      <span className="text-[11px] font-bold text-[#73777A] uppercase tracking-wider">Quick Suggestions (Tap to add)</span>
      <div className="flex flex-wrap gap-2">
        <button className="px-3 py-1.5 rounded-full bg-white border border-[#E6E4DD] text-xs font-medium text-[#191C1E] hover:border-[#E86114]">
          Stomach burning / जलन
        </button>
        <button className="px-3 py-1.5 rounded-full bg-white border border-[#E6E4DD] text-xs font-medium text-[#191C1E] hover:border-[#E86114]">
          Fever / बुखार
        </button>
        <button className="px-3 py-1.5 rounded-full bg-white border border-[#E6E4DD] text-xs font-medium text-[#191C1E] hover:border-[#E86114]">
          Acid gas / गैस
        </button>
        <button className="px-3 py-1.5 rounded-full bg-white border border-[#E6E4DD] text-xs font-medium text-[#191C1E] hover:border-[#E86114]">
          Joint stiffness / जोड़ों का दर्द
        </button>
      </div>
    </div>

    <div className="flex flex-col items-center justify-center py-4 space-y-3">
      <div className="relative">
        <div className="absolute -inset-2 rounded-full bg-[#FFF5EE] animate-pulse"></div>
        <button className="relative w-20 h-20 rounded-full bg-[#E86114] text-white flex items-center justify-center shadow-lg hover:bg-[#C2410C] active:scale-95 transition-transform">
          <span className="text-3xl">🎙️</span>
        </button>
      </div>
      <div className="text-center">
        <div className="text-sm font-bold text-[#0F172A]">Tap to Speak Symptoms</div>
        <div className="text-xs text-[#73777A]">बोलने के लिए माइक दबाएं</div>
      </div>
    </div>

    <div className="pt-2 text-center">
      <button className="text-xs font-semibold text-[#E86114] hover:underline flex items-center justify-center gap-1.5 mx-auto">
        <span>⌨️</span>
        <span>Prefer to type your answer instead? Click here</span>
      </button>
    </div>
  </main>

  <footer className="p-4 bg-white border-t border-[#E6E4DD] flex items-center justify-between">
    <button className="text-xs font-semibold text-[#73777A]">Cancel Intake</button>
    <button className="px-5 py-2.5 rounded-xl bg-[#F5F4F0] text-xs font-bold text-[#73777A] cursor-not-allowed">
      Next Question →
    </button>
  </footer>
</div>`
  },

  // 08. Voice Recording Active State
  {
    label: "08 Voice Recording Listening",
    filename: "08_voice_interview_recording_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A] text-white w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="px-5 pt-4 pb-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping"></span>
      <span className="text-xs font-bold tracking-widest text-[#EF4444] uppercase">Listening • 00:08</span>
    </div>
    <button className="text-xs text-slate-400 font-semibold">Cancel</button>
  </header>

  <div className="px-5 py-2">
    <p className="text-xs text-slate-400 font-medium">Question 1 of 4: Chief Complaint</p>
    <h2 className="text-base font-bold text-slate-100">What health problem brings you here today?</h2>
  </div>

  <main className="px-5 flex-1 flex flex-col justify-center space-y-6">
    <div className="flex items-center justify-center gap-1.5 h-16 px-4">
      {[12, 28, 44, 20, 56, 32, 60, 48, 24, 64, 40, 52, 28, 60, 36, 48, 20, 56, 32, 40, 16].map((h, i) => (
        <div key={i} style={{ height: \`\${h}px\` }} className="w-1.5 rounded-full bg-[#E86114] opacity-90 transition-all duration-100"></div>
      ))}
    </div>

    <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>Transcribing speech in real-time...</span>
        <span className="text-[#10B981] font-semibold">✓ Hindi / English Mixed</span>
      </div>
      <p className="text-sm font-medium text-slate-100 leading-relaxed italic">
        "Mujhe pichhle do hafte se khana khane ke baad pet me tevar jalan hoti hai, aur raat ko khatti dakar aati hai..."
      </p>
    </div>

    <p className="text-center text-xs text-slate-400">
      Speak clearly into the microphone. Tap below when you have finished.
    </p>
  </main>

  <footer className="p-5 bg-slate-900 border-t border-slate-800 flex flex-col gap-3">
    <button className="w-full min-h-[54px] bg-[#E86114] hover:bg-[#C2410C] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg">
      <span className="text-base">■</span>
      <span>Done Speaking / बोलना समाप्त</span>
    </button>
    <button className="text-center text-xs text-slate-400 hover:text-white py-1">
      Restart / दोबारा बोलें
    </button>
  </footer>
</div>`
  },

  // 09. Audio Speech-to-Text Processing
  {
    label: "09 Voice Processing State",
    filename: "09_voice_processing_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Processing Audio</div>
      </div>
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col items-center justify-center gap-4 text-center">
    <div className="w-16 h-16 rounded-full border-4 border-[#E86114]/20 border-t-[#E86114] animate-spin" />
    <div>
      <h2 className="text-lg font-bold text-[#191C1E]">Converting speech to text...</h2>
      <p className="text-xs text-[#45484A] mt-1">Extracting clinical symptoms and timelines</p>
    </div>
  </main>
</div>`
  },

  // 10. Transcript Review & Edit
  {
    label: "10 Transcript Review Edit",
    filename: "10_transcript_review_edit.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Edit Transcript</div>
      </div>
    </div>
    <button className="text-xs font-semibold text-[#E86114]">Reset</button>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-4">
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-[#E86114]">Question 1 of 4 • Review Words</span>
        <span className="text-xs font-semibold text-[#73777A]">25%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#E6E4DD]">
        <div className="w-1/4 h-full rounded-full bg-[#E86114]" />
      </div>
    </div>

    <div>
      <h1 className="text-xl font-bold text-[#191C1E] leading-snug">Edit your response / अपनी बात संपादित करें</h1>
      <p className="text-xs text-[#45484A] mt-1">Make any corrections to the text before saving it to your case sheet.</p>
    </div>

    <div className="p-4 bg-white rounded-xl border-2 border-[#E86114] flex-1 flex flex-col">
      <textarea
        className="w-full flex-1 bg-transparent text-sm text-[#191C1E] leading-relaxed resize-none focus:outline-none"
        defaultValue="Mujhe pichhle do hafte se khana khane ke baad pet me tevar jalan aur gas ki shikayat hai. Raat ko takleef badh jaati hai."
      />
      <div className="flex items-center justify-between pt-3 border-t border-[#E6E4DD] text-[11px] text-[#73777A]">
        <span>118 characters</span>
        <span className="text-[#1E7B48] font-medium">✓ Hindi/English mixed recognized</span>
      </div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex items-center gap-3">
    <button className="flex-1 min-h-[52px] bg-white border border-[#E6E4DD] text-[#191C1E] font-semibold rounded-xl text-sm">
      Cancel
    </button>
    <button className="flex-1 min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Save & Continue →
    </button>
  </footer>
</div>`
  },

  // 11. Adaptive Follow-up Question
  {
    label: "11 Adaptive Followup Question",
    filename: "11_adaptive_followup_question.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Adaptive Follow-up</div>
      </div>
    </div>
    <span className="text-xs font-semibold text-[#73777A]">Step 2 of 4</span>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-4">
    <div>
      <span className="text-xs font-semibold text-[#E86114] uppercase tracking-wide">Question 2 • Duration & Timeline</span>
      <h1 className="text-xl font-bold text-[#191C1E] leading-snug mt-1">How many days have you had this stomach pain?</h1>
      <p className="text-xs text-[#45484A] mt-0.5">यह दर्द कितने दिनों से हो रहा है?</p>
    </div>

    <div className="flex flex-col gap-2.5">
      <button className="p-4 rounded-xl border border-[#E6E4DD] bg-white text-left hover:border-[#E86114]">
        <div className="text-sm font-semibold text-[#191C1E]">Less than 24 hours / 24 घंटे से कम</div>
      </button>
      <button className="p-4 rounded-xl border-2 border-[#E86114] bg-[#FFF5EE] text-left">
        <div className="text-sm font-bold text-[#E86114]">2 to 7 days / 2 से 7 दिन ✓</div>
      </button>
      <button className="p-4 rounded-xl border border-[#E6E4DD] bg-white text-left hover:border-[#E86114]">
        <div className="text-sm font-semibold text-[#191C1E]">2 to 4 weeks / 2 से 4 सप्ताह</div>
      </button>
      <button className="p-4 rounded-xl border border-[#E6E4DD] bg-white text-left hover:border-[#E86114]">
        <div className="text-sm font-semibold text-[#191C1E]">More than a month / 1 महीने से अधिक</div>
      </button>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD]">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Next Question →
    </button>
  </footer>
</div>`
  },

  // 12. AYUSH Clinical Markers
  {
    label: "12 AYUSH Prakriti Intake",
    filename: "04_ayush_prakriti_profile.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="px-5 pt-3 pb-2 border-b border-[#E6E4DD] bg-white">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <button className="text-base text-[#73777A] pr-1">←</button>
        <span className="text-xs font-bold text-[#1E7B48] tracking-wide uppercase">AYUSH Clinical Markers • Step 3 of 4</span>
      </div>
      <span className="text-xs font-bold text-[#73777A]">75%</span>
    </div>
    <div className="w-full h-1.5 rounded-full bg-[#E6E4DD]">
      <div className="w-3/4 h-full rounded-full bg-[#1E7B48]" />
    </div>
  </header>

  <main className="px-5 py-3.5 flex-1 flex flex-col space-y-4 overflow-y-auto">
    <div>
      <h1 className="text-lg font-extrabold text-[#0F172A]">Constitutional Markers / प्रकृति विवरण</h1>
      <p className="text-xs text-[#45484A] mt-0.5">These physiological patterns help your AYUSH physician customize herbal formulations.</p>
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#0F172A]">1. Agni (Digestion & Appetite / अग्नि)</label>
        <span className="text-[10px] text-[#73777A]">Select 1</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="p-2.5 rounded-xl border border-[#E6E4DD] bg-white text-left hover:border-[#1E7B48]">
          <div className="text-xs font-bold text-[#0F172A]">Samagni (Balanced)</div>
          <div className="text-[10px] text-[#73777A]">Normal timely hunger</div>
        </button>
        <button className="p-2.5 rounded-xl border-2 border-[#1E7B48] bg-[#EBF6EE] text-left">
          <div className="text-xs font-bold text-[#1E7B48]">Tikshnagni (Sharp) ✓</div>
          <div className="text-[10px] text-[#1E7B48]">Frequent burning hunger</div>
        </button>
        <button className="p-2.5 rounded-xl border border-[#E6E4DD] bg-white text-left hover:border-[#1E7B48]">
          <div className="text-xs font-bold text-[#0F172A]">Mandagni (Slow)</div>
          <div className="text-[10px] text-[#73777A]">Heavy stomach, low appetite</div>
        </button>
        <button className="p-2.5 rounded-xl border border-[#E6E4DD] bg-white text-left hover:border-[#1E7B48]">
          <div className="text-xs font-bold text-[#0F172A]">Vishamagni (Irregular)</div>
          <div className="text-[10px] text-[#73777A]">Unpredictable digestion</div>
        </button>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#0F172A]">2. Nidra (Sleep Pattern / निद्रा)</label>
        <span className="text-[10px] text-[#73777A]">Select 1</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button className="p-2.5 rounded-xl border border-[#E6E4DD] bg-white text-center hover:border-[#1E7B48]">
          <div className="text-xs font-bold text-[#0F172A]">Deep</div>
          <div className="text-[10px] text-[#73777A]">गहरी नींद</div>
        </button>
        <button className="p-2.5 rounded-xl border-2 border-[#1E7B48] bg-[#EBF6EE] text-center">
          <div className="text-xs font-bold text-[#1E7B48]">Broken ✓</div>
          <div className="text-[10px] text-[#1E7B48]">खंडित नींद</div>
        </button>
        <button className="p-2.5 rounded-xl border border-[#E6E4DD] bg-white text-center hover:border-[#1E7B48]">
          <div className="text-xs font-bold text-[#0F172A]">Insomnia</div>
          <div className="text-[10px] text-[#73777A]">कम नींद</div>
        </button>
      </div>
    </div>

    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#0F172A]">3. Weather Trouble / मौसम से परेशानी</label>
        <span className="text-[10px] text-[#73777A]">Select 1</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button className="p-2.5 rounded-xl border-2 border-[#1E7B48] bg-[#EBF6EE] text-center">
          <div className="text-xs font-bold text-[#1E7B48]">Hot / गर्मी ✓</div>
          <div className="text-[10px] text-[#1E7B48]">Pitta aggravation</div>
        </button>
        <button className="p-2.5 rounded-xl border border-[#E6E4DD] bg-white text-center hover:border-[#1E7B48]">
          <div className="text-xs font-bold text-[#0F172A]">Cold / ठंड</div>
          <div className="text-[10px] text-[#73777A]">Vata aggravation</div>
        </button>
        <button className="p-2.5 rounded-xl border border-[#E6E4DD] bg-white text-center hover:border-[#1E7B48]">
          <div className="text-xs font-bold text-[#0F172A]">Rainy / नमी</div>
          <div className="text-[10px] text-[#73777A]">Kapha aggravation</div>
        </button>
      </div>
    </div>
  </main>

  <footer className="p-4 bg-white border-t border-[#E6E4DD] flex items-center gap-3">
    <button className="px-4 min-h-[50px] bg-white border border-[#E6E4DD] text-[#73777A] font-semibold rounded-xl text-xs">
      Back
    </button>
    <button className="flex-1 min-h-[50px] bg-[#1E7B48] hover:bg-[#165c36] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm">
      <span>Save Markers & Continue →</span>
    </button>
  </footer>
</div>`
  },

  // 13. Document Scanner Viewfinder
  {
    label: "13 Document Scanner Viewfinder",
    filename: "13_document_scanner_viewfinder.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A] text-white w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="px-5 py-4 flex items-center justify-between">
    <button className="text-sm font-semibold">✕ Cancel</button>
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Scan Prescription</span>
    <button className="text-xs font-semibold bg-slate-800 px-3 py-1.5 rounded-full">⚡ Flash</button>
  </header>

  <main className="px-5 flex-1 flex flex-col items-center justify-center">
    <div className="w-full h-80 rounded-2xl border-2 border-dashed border-white/60 relative flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#E86114]" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#E86114]" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#E86114]" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#E86114]" />

      <span className="text-2xl mb-2">📄</span>
      <div className="text-sm font-semibold text-white">Align prescription or doctor's slip inside this frame</div>
      <div className="text-xs text-slate-400 mt-1">Make sure writing is clear and well-lit</div>
    </div>
  </main>

  <footer className="p-6 bg-slate-950 flex items-center justify-around">
    <button className="text-xs text-slate-400 flex flex-col items-center gap-1">
      <span className="text-xl">🖼️</span>
      <span>Gallery</span>
    </button>
    <button className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center bg-[#E86114] shadow-lg">
      <div className="w-14 h-14 rounded-full bg-white" />
    </button>
    <button className="text-xs text-slate-400 flex flex-col items-center gap-1">
      <span className="text-xl">⏭️</span>
      <span>Skip</span>
    </button>
  </footer>
</div>`
  },

  // 14. Document OCR Processing
  {
    label: "14 Document OCR Processing",
    filename: "14_document_ocr_processing.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">OCR Analysis</div>
      </div>
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col items-center justify-center gap-4 text-center">
    <div className="relative">
      <div className="w-20 h-28 bg-white rounded-xl border-2 border-[#E86114] shadow-md flex items-center justify-center text-2xl">
        📄
      </div>
      <div className="absolute inset-x-0 top-1/2 h-1 bg-[#E86114] animate-pulse" />
    </div>

    <div>
      <h2 className="text-lg font-bold text-[#191C1E]">Scanning medical document...</h2>
      <p className="text-xs text-[#45484A] mt-1">Extracting handwritten medicines and clinical notes</p>
    </div>
  </main>
</div>`
  },

  // 15. Extracted Document Review
  {
    label: "15 Extracted Document Review",
    filename: "15_extracted_document_review.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Document Verification</div>
      </div>
    </div>
    <span className="text-xs font-semibold text-[#1E7B48]">2 Detected</span>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-4">
    <div>
      <h1 className="text-xl font-bold text-[#191C1E] leading-snug">Extracted Information / पहचानी गई जानकारी</h1>
      <p className="text-xs text-[#45484A] mt-1">Verify that the extracted medicines match your physical document.</p>
    </div>

    <div className="flex flex-col gap-3">
      <div className="p-4 bg-white rounded-xl border border-[#E6E4DD] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#191C1E]">1. Avipattikar Churna</span>
          <span className="text-xs font-semibold text-[#1E7B48] bg-[#EBF6EE] px-2 py-0.5 rounded">94% match</span>
        </div>
        <div className="text-xs text-[#45484A]">Dosage: 3g with warm water twice daily</div>
        <div className="flex gap-2 pt-2 border-t border-[#E6E4DD] text-xs">
          <button className="text-[#E86114] font-semibold">Edit ✎</button>
          <button className="text-[#BA1A1A] font-semibold">Remove ✕</button>
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl border border-[#E6E4DD] flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#191C1E]">2. Sutshekhar Ras</span>
          <span className="text-xs font-semibold text-[#1E7B48] bg-[#EBF6EE] px-2 py-0.5 rounded">89% match</span>
        </div>
        <div className="text-xs text-[#45484A]">Dosage: 1 tablet after food</div>
        <div className="flex gap-2 pt-2 border-t border-[#E6E4DD] text-xs">
          <button className="text-[#E86114] font-semibold">Edit ✎</button>
          <button className="text-[#BA1A1A] font-semibold">Remove ✕</button>
        </div>
      </div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD]">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Confirm Extracted Medications →
    </button>
  </footer>
</div>`
  },

  // 16. Case Summary Review Sheet
  {
    label: "16 Clinical Case Review Summary",
    filename: "16_clinical_case_review_summary.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="px-5 pt-3 pb-2 border-b border-[#E6E4DD] bg-white flex items-center justify-between">
    <div className="flex items-center gap-2">
      <button className="text-base text-[#73777A]">←</button>
      <div>
        <h1 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Case Summary Review</h1>
        <p className="text-[10px] text-[#73777A]">OPD Kayachikitsa Department</p>
      </div>
    </div>
    <span className="px-2 py-0.5 rounded-full bg-[#EBF6EE] text-[10px] font-bold text-[#1E7B48]">✓ Verified Ready</span>
  </header>

  <main className="px-5 py-3 flex-1 flex flex-col space-y-3.5 overflow-y-auto">
    <div>
      <h2 className="text-base font-extrabold text-[#0F172A]">Review before submitting to doctor</h2>
      <p className="text-xs text-[#45484A] mt-0.5">Please confirm that your symptoms and past medications are accurate.</p>
    </div>

    <div className="p-3 bg-white rounded-xl border border-[#E6E4DD] flex items-center justify-between">
      <div>
        <div className="text-xs font-bold text-[#0F172A]">Rahul Sharma • Male, 34y</div>
        <div className="text-[10px] text-[#73777A]">ABHA: 91-4829-1029-4820 • Linked via ABDM</div>
      </div>
      <span className="text-xs text-[#1E7B48] font-bold">✓ ABHA Verified</span>
    </div>

    <div className="p-3.5 bg-white rounded-xl border border-[#E6E4DD] space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#E86114] uppercase tracking-wider">Chief Complaint / मुख्य समस्या</span>
        <button className="text-[11px] font-semibold text-[#E86114] hover:underline">Edit ✎</button>
      </div>
      <p className="text-xs text-[#191C1E] font-medium leading-relaxed">
        "Severe burning sensation in the stomach and acid reflux after meals for 2 weeks. Condition worsens at night with sour burps."
      </p>
      <div className="flex gap-2 pt-1">
        <span className="px-2 py-0.5 rounded-md bg-[#FFF5EE] text-[10px] font-semibold text-[#C2410C]">Duration: 14 Days</span>
        <span className="px-2 py-0.5 rounded-md bg-[#FFF5EE] text-[10px] font-semibold text-[#C2410C]">Severity: Moderate</span>
      </div>
    </div>

    <div className="p-3.5 bg-white rounded-xl border border-[#E6E4DD] space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#1E7B48] uppercase tracking-wider">AYUSH Markers / प्रकृति विवरण</span>
        <button className="text-[11px] font-semibold text-[#1E7B48] hover:underline">Edit ✎</button>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div>
          <span className="text-[10px] text-[#73777A] block">Agni (Digestion)</span>
          <span className="font-bold text-[#0F172A]">Tikshnagni (Sharp)</span>
        </div>
        <div>
          <span className="text-[10px] text-[#73777A] block">Nidra (Sleep)</span>
          <span className="font-bold text-[#0F172A]">Broken (खंडित)</span>
        </div>
        <div>
          <span className="text-[10px] text-[#73777A] block">Satmya</span>
          <span className="font-bold text-[#0F172A]">Heat Sensitive</span>
        </div>
      </div>
    </div>

    <div className="p-3 bg-white rounded-xl border border-[#E6E4DD] flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <span className="text-base">📄</span>
        <div>
          <div className="text-xs font-bold text-[#0F172A]">1 Prescription Attached</div>
          <div className="text-[10px] text-[#73777A]">Avipattikar Churna, Sutshekhar Ras extracted</div>
        </div>
      </div>
      <button className="text-[11px] font-semibold text-[#E86114] hover:underline">Review ✎</button>
    </div>

    <div className="p-2.5 bg-[#FFF5EE] rounded-lg text-[11px] text-[#C2410C] flex items-start gap-1.5">
      <span>ℹ️</span>
      <span>Your doctor will independently examine your case and make all clinical decisions. AI only assists in intake.</span>
    </div>
  </main>

  <footer className="p-4 bg-white border-t border-[#E6E4DD] space-y-2">
    <button className="w-full min-h-[52px] bg-[#E86114] hover:bg-[#C2410C] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm">
      <span>Submit Case to OPD Queue →</span>
    </button>
  </footer>
</div>`
  },

  // 17. OPD Token & Live Queue Tracker
  {
    label: "17 OPD Token Live Queue",
    filename: "07_opd_token_live_queue.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="px-5 pt-3 pb-2 border-b border-[#E6E4DD] bg-white flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-[#EBF6EE] text-[#1E7B48] flex items-center justify-center font-bold text-xs">✓</span>
      <div>
        <div className="text-xs font-bold text-[#0F172A]">Intake Complete</div>
        <div className="text-[10px] text-[#73777A]">National AYUSH OPD • Room 104</div>
      </div>
    </div>
    <span className="text-[10px] font-semibold text-[#73777A]">09:42 AM</span>
  </header>

  <main className="px-5 py-3.5 flex-1 flex flex-col space-y-3.5 overflow-y-auto">
    <div className="p-4 bg-[#0F172A] text-white rounded-2xl shadow-md text-center space-y-1.5 relative overflow-hidden">
      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Your Assigned OPD Token</div>
      <div className="text-4xl font-extrabold text-[#E86114] tracking-tight">OPD - A42</div>
      <div className="text-xs text-slate-300 font-medium">General AYUSH & Kayachikitsa Dept</div>
      <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-around text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block">Calling Now</span>
          <span className="font-bold text-white">Token A-39</span>
        </div>
        <div className="w-px h-6 bg-slate-800"></div>
        <div>
          <span className="text-[10px] text-slate-400 block">Queue Position</span>
          <span className="font-bold text-[#E86114]">3 ahead of you</span>
        </div>
        <div className="w-px h-6 bg-slate-800"></div>
        <div>
          <span className="text-[10px] text-slate-400 block">Est. Wait</span>
          <span className="font-bold text-emerald-400">~12-15 mins</span>
        </div>
      </div>
    </div>

    <div className="p-3.5 bg-white rounded-xl border border-[#E6E4DD] flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-[#EBF6EE] border border-[#1E7B48]/30 flex items-center justify-center text-[#1E7B48] font-bold text-sm">
        DA
      </div>
      <div className="flex-1">
        <div className="text-xs font-bold text-[#0F172A]">Dr. Ayush Sharma, MD (Ayu)</div>
        <div className="text-[11px] text-[#45484A]">Senior Consulting Physician • Room 104</div>
        <div className="text-[10px] text-[#1E7B48] font-semibold mt-0.5">● Active in Consultation</div>
      </div>
    </div>

    <div className="p-3.5 bg-white rounded-xl border border-[#E6E4DD] space-y-2.5">
      <span className="text-[11px] font-bold text-[#73777A] uppercase tracking-wider block">Consultation Progress</span>
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#1E7B48] text-white flex items-center justify-center text-[10px] font-bold">✓</span>
          <span className="font-semibold text-[#0F172A]">Case Intake Submitted & Linked to ABHA</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-5 h-5 rounded-full bg-[#E86114] text-white flex items-center justify-center text-[10px] font-bold">●</span>
          <span className="font-bold text-[#E86114]">Waiting in Room 104 Outer Lobby (Current)</span>
        </div>
        <div className="flex items-center gap-2.5 opacity-40">
          <span className="w-5 h-5 rounded-full border border-[#73777A] flex items-center justify-center text-[10px]">3</span>
          <span className="font-medium text-[#73777A]">Doctor Examination & Pulse Diagnosis (Nadi)</span>
        </div>
        <div className="flex items-center gap-2.5 opacity-40">
          <span className="w-5 h-5 rounded-full border border-[#73777A] flex items-center justify-center text-[10px]">4</span>
          <span className="font-medium text-[#73777A]">Digital Prescription & Pharmacy Token</span>
        </div>
      </div>
    </div>

    <div className="p-3 bg-[#FFF5EE] border border-[#E86114]/20 rounded-xl text-xs text-[#45484A] leading-relaxed">
      📢 <strong>What to do next:</strong> Please sit in Waiting Area B. Your token A-42 will be displayed on the digital screen and announced over the PA system in Hindi and English.
    </div>
  </main>

  <footer className="p-4 bg-white border-t border-[#E6E4DD] flex items-center gap-3">
    <button className="flex-1 min-h-[50px] bg-white border border-[#E6E4DD] text-[#0F172A] font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-[#F5F4F0]">
      <span>📄</span>
      <span>View Case Sheet</span>
    </button>
    <button className="flex-1 min-h-[50px] bg-[#E86114] hover:bg-[#C2410C] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm">
      <span>📲</span>
      <span>Save to Phone / SMS</span>
    </button>
  </footer>
</div>`
  },

  // 18. Network Offline State
  {
    label: "18 Network Offline State",
    filename: "19_network_offline_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Offline Mode</div>
      </div>
    </div>
    <span className="text-xs font-semibold text-[#BA1A1A] bg-[#BA1A1A]/10 px-2.5 py-1 rounded-full">Offline</span>
  </header>

  <main className="p-6 flex-1 flex flex-col items-center justify-center text-center gap-4">
    <div className="w-16 h-16 rounded-full bg-[#FFF5EE] border border-[#E86114]/30 flex items-center justify-center text-3xl">
      📡
    </div>
    <div>
      <h2 className="text-lg font-bold text-[#191C1E]">No Internet Connection / इंटरनेट नहीं है</h2>
      <p className="text-xs text-[#45484A] mt-1.5 leading-relaxed max-w-xs">
        Don't worry! Your intake answers are safely stored on this phone. We will automatically submit them once connection is restored.
      </p>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD]">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Retry Connection 🔄
    </button>
  </footer>
</div>`
  },

  // 19. Session Expired State
  {
    label: "19 Session Expired State",
    filename: "20_session_expired_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Session Notice</div>
      </div>
    </div>
  </header>

  <main className="p-6 flex-1 flex flex-col items-center justify-center text-center gap-4">
    <div className="w-16 h-16 rounded-full bg-[#F5F4F0] flex items-center justify-center text-3xl">
      ⏳
    </div>
    <div>
      <h2 className="text-lg font-bold text-[#191C1E]">Session Expired / सत्र समाप्त</h2>
      <p className="text-xs text-[#45484A] mt-1.5 leading-relaxed max-w-xs">
        Your temporary intake session has timed out due to inactivity. Please scan the clinic QR code again to resume.
      </p>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD]">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Scan Clinic QR Again →
    </button>
  </footer>
</div>`
  },

  // 20. Mic Permission Denied State
  {
    label: "20 Mic Permission Denied",
    filename: "21_mic_permission_denied_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Permission Needed</div>
      </div>
    </div>
  </header>

  <main className="p-6 flex-1 flex flex-col items-center justify-center text-center gap-4">
    <div className="w-16 h-16 rounded-full bg-[#BA1A1A]/10 text-[#BA1A1A] flex items-center justify-center text-3xl">
      🎙️✕
    </div>
    <div>
      <h2 className="text-lg font-bold text-[#191C1E]">Microphone Access Denied</h2>
      <p className="text-xs text-[#45484A] mt-1.5 leading-relaxed max-w-xs">
        To speak your symptoms, please allow microphone access in your Android settings, or continue by typing your answers.
      </p>
    </div>

    <div className="w-full p-4 bg-white rounded-xl border border-[#E6E4DD] text-left text-xs space-y-2">
      <div className="font-semibold text-[#191C1E]">How to enable:</div>
      <div className="text-[#45484A]">1. Open Android Settings > Apps > SwasthyaSaathi</div>
      <div className="text-[#45484A]">2. Tap Permissions > Microphone > Allow</div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex flex-col gap-3">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Open Android Settings
    </button>
    <button className="text-center text-xs font-semibold text-[#73777A] py-1">
      Continue by typing answers instead
    </button>
  </footer>
</div>`
  },

  // 21. Document Processing Failure Recovery
  {
    label: "21 Document Failure Recovery",
    filename: "22_document_processing_failure.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Scan Error</div>
      </div>
    </div>
  </header>

  <main className="p-6 flex-1 flex flex-col items-center justify-center text-center gap-4">
    <div className="w-16 h-16 rounded-full bg-[#FFF5EE] border border-[#E86114]/30 flex items-center justify-center text-3xl">
      ⚠️
    </div>
    <div>
      <h2 className="text-lg font-bold text-[#191C1E]">Document Could Not Be Read</h2>
      <p className="text-xs text-[#45484A] mt-1.5 leading-relaxed max-w-xs">
        The image was too blurry or the lighting was too dim to accurately extract prescriptions.
      </p>
    </div>

    <div className="w-full p-4 bg-white rounded-xl border border-[#E6E4DD] text-left text-xs space-y-1.5">
      <div className="font-semibold text-[#191C1E]">Tips for a clear scan:</div>
      <div className="text-[#45484A]">• Avoid glare and shadows on the paper</div>
      <div className="text-[#45484A]">• Place prescription on a flat, contrasting surface</div>
      <div className="text-[#45484A]">• Hold camera steady directly above document</div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex flex-col gap-3">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Retake Photo 📷
    </button>
    <button className="text-center text-xs font-semibold text-[#73777A] py-1">
      Skip & Hand Physical Paper to Doctor
    </button>
  </footer>
</div>`
  }
];

// Execute sequential batch upload
(async () => {
  console.log(`Starting migration of 21 screens to new Flowstep file: ${NEW_FILE_ID}`);
  for (const s of masterScreens) {
    addAndRender(s.label, s.filename, s.jsx);
  }
  console.log("\n=======================================================");
  console.log("All 21 screens successfully imported into new Flowstep account!");
  console.log(`Live file URL: https://app.flowstep.ai/file?activeFileId=${NEW_FILE_ID}`);
  console.log("=======================================================");
})();
