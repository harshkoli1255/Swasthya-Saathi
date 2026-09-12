#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FILE_ID = "91cc9ad4-73f7-45e6-be8a-b8dda086b3c6";
const IMG_DIR = path.join(__dirname, "../design/patient_mobile_app/images");
const ARTIFACT_DIR = "/Users/harshkoli/.gemini/antigravity-ide/brain/60d07897-c7fb-4336-a16b-a06bf9922049";

if (!fs.existsSync(IMG_DIR)) {
  fs.mkdirSync(IMG_DIR, { recursive: true });
}

function addAndRenderScreen(label, filename, jsx) {
  console.log(`\n=== Adding screen: ${label} ===`);
  try {
    const addRes = execFileSync("node", ["scripts/flowstep_call.js", "add-screen", JSON.stringify({
      fileId: FILE_ID,
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
    console.log(`Created screen ID: ${screenId}`);

    const imgRes = execFileSync("node", ["scripts/flowstep_call.js", "get-screen-image", JSON.stringify({
      fileId: FILE_ID,
      screenId: screenId
    })], { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });

    const imgParsed = JSON.parse(imgRes);
    const content = imgParsed.result.content[0];
    if (content.type === "image") {
      const buf = Buffer.from(content.data, "base64");
      const localPath = path.join(IMG_DIR, filename);
      const artifactPath = path.join(ARTIFACT_DIR, filename);
      fs.writeFileSync(localPath, buf);
      fs.writeFileSync(artifactPath, buf);
      console.log(`Saved: ${filename} (${buf.length} bytes)`);
      return { screenId, filename, size: buf.length };
    } else {
      console.error(`Render failed for ${label}:`, content.text);
      return null;
    }
  } catch (err) {
    console.error(`Exception on ${label}:`, err.message);
    return null;
  }
}

// ── SCREEN DEFINITIONS ───────────────────────────────────────────────────

const screens = [
  // 1. Language Selection Bottom Sheet
  {
    label: "Language Selection Sheet",
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

    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm mt-2 shadow-sm">
      Confirm Language / भाषा की पुष्टि करें
    </button>
  </div>
</div>`
  },

  // 2. Voice Interview Active Recording State
  {
    label: "Voice Interview Recording State",
    filename: "08_voice_interview_recording_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">AYUSH Digital Health Mission</div>
      </div>
    </div>
    <div className="bg-[#F5F4F0] border border-[#E6E4DD] px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[#45484A]">
      AYUSH OPD
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-5">
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-[#E86114]">Question 1 of 4 • Chief Complaint</span>
        <span className="text-xs font-bold text-[#BA1A1A] flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#BA1A1A] animate-ping" /> 00:08
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#E6E4DD]">
        <div className="w-1/4 h-full rounded-full bg-[#E86114]" />
      </div>
    </div>

    <div>
      <h1 className="text-2xl font-bold text-[#191C1E] leading-snug">
        What health problems are you experiencing today? / आज आपको क्या समस्या है?
      </h1>
      <p className="text-sm text-[#45484A] mt-1.5">
        Listening in Hindi & English. Speak naturally at your own pace.
      </p>
    </div>

    <div className="flex flex-col items-center justify-center py-6 gap-3">
      <div className="w-28 h-28 rounded-full bg-[#FEF2F2] border-4 border-[#BA1A1A]/30 flex items-center justify-center animate-pulse shadow-lg">
        <div className="w-20 h-20 rounded-full bg-[#BA1A1A] flex items-center justify-center text-white text-3xl shadow-md">
          🎙️
        </div>
      </div>
      <div className="flex items-center gap-1.5 py-1 px-3 bg-[#FEF2F2] rounded-full border border-[#BA1A1A]/20">
        <span className="w-2 h-2 rounded-full bg-[#BA1A1A]" />
        <span className="text-xs font-bold text-[#BA1A1A]">Listening... Speak clearly</span>
      </div>
      <div className="flex items-center gap-1 h-6">
        <div className="w-1 h-3 bg-[#BA1A1A] rounded-full" />
        <div className="w-1 h-6 bg-[#BA1A1A] rounded-full" />
        <div className="w-1 h-4 bg-[#BA1A1A] rounded-full" />
        <div className="w-1 h-7 bg-[#BA1A1A] rounded-full" />
        <div className="w-1 h-5 bg-[#BA1A1A] rounded-full" />
        <div className="w-1 h-2 bg-[#BA1A1A] rounded-full" />
      </div>
    </div>

    <div className="p-4 bg-white rounded-xl border border-[#E6E4DD] flex flex-col gap-2 shadow-sm">
      <div className="text-xs font-semibold text-[#73777A] uppercase tracking-wider">Live Voice Capture / आपकी बात</div>
      <div className="text-sm text-[#191C1E] italic leading-relaxed">
        &quot;Mujhe pichhle do hafte se pet me jalan aur acidity ho rahi hai khana khane ke baad...&quot;
      </div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex items-center gap-3">
    <button className="flex-1 min-h-[52px] bg-white border border-[#E6E4DD] text-[#73777A] font-semibold rounded-xl text-sm">
      Cancel / रद्द करें
    </button>
    <button className="flex-[2] min-h-[52px] bg-[#BA1A1A] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm">
      <span>Done Speaking / बोलना समाप्त करें</span> ✓
    </button>
  </footer>
</div>`
  },

  // 3. Voice Processing State
  {
    label: "Voice Processing & ASR State",
    filename: "09_voice_processing_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">AYUSH Digital Health Mission</div>
      </div>
    </div>
    <div className="bg-[#F5F4F0] border border-[#E6E4DD] px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[#45484A]">
      AYUSH OPD
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col items-center justify-center text-center gap-6">
    <div className="w-20 h-20 rounded-2xl bg-[#FFF5EE] border border-[#E86114]/20 flex items-center justify-center text-[#E86114] text-3xl shadow-sm">
      ⏳
    </div>

    <div>
      <h2 className="text-xl font-bold text-[#191C1E]">Transcribing & Understanding...</h2>
      <p className="text-sm text-[#73777A] mt-1">आपकी बात को चिकित्सा केस शीट में तैयार किया जा रहा है</p>
    </div>

    <div className="w-full max-w-[280px] p-4 bg-white rounded-xl border border-[#E6E4DD] flex flex-col gap-3 text-left">
      <div className="flex items-center gap-2.5">
        <span className="text-[#1E7B48] font-bold text-xs">✓</span>
        <span className="text-xs text-[#191C1E] font-medium">Audio received (4.2 seconds)</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="text-[#E86114] font-bold text-xs">●</span>
        <span className="text-xs text-[#191C1E] font-medium">Converting speech to text...</span>
      </div>
      <div className="flex items-center gap-2.5 opacity-40">
        <span className="text-[#73777A] font-bold text-xs">○</span>
        <span className="text-xs text-[#73777A]">Structuring symptoms & timeline</span>
      </div>
    </div>

    <p className="text-xs text-[#73777A] max-w-[260px] leading-relaxed">
      You will be able to review and correct the written transcript before proceeding.
    </p>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] text-center">
    <span className="text-xs text-[#73777A]">Secure in-transit encryption • HIPAA & ABDM compliant</span>
  </footer>
</div>`
  },

  // 4. Adaptive Follow-up Question State
  {
    label: "Adaptive Follow-up Question",
    filename: "11_adaptive_followup_question.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">AYUSH Digital Health Mission</div>
      </div>
    </div>
    <div className="bg-[#F5F4F0] border border-[#E6E4DD] px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[#45484A]">
      AYUSH OPD
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-5">
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-[#E86114]">Question 2 of 4 • Duration & Timeline</span>
        <span className="text-xs font-semibold text-[#73777A]">50%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#E6E4DD]">
        <div className="w-1/2 h-full rounded-full bg-[#E86114]" />
      </div>
    </div>

    <div className="py-1 px-2.5 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg text-xs font-medium text-[#1E7B48] flex items-center gap-1.5 w-fit">
      <span>✓</span> Identified symptom: Stomach Burning & Acidity
    </div>

    <div>
      <h1 className="text-2xl font-bold text-[#191C1E] leading-snug">
        How long have you had this stomach burning? / यह समस्या कितने समय से है?
      </h1>
      <p className="text-sm text-[#45484A] mt-1.5">
        We only ask what we need to clarify your medical timeline.
      </p>
    </div>

    <div className="flex flex-col gap-2.5">
      <button className="flex items-center justify-between p-3.5 rounded-xl border-2 border-[#E86114] bg-[#FFF5EE]">
        <span className="text-sm font-semibold text-[#191C1E]">Less than 1 week / 1 सप्ताह से कम</span>
        <div className="w-5 h-5 rounded-full bg-[#E86114] flex items-center justify-center text-white text-xs">✓</div>
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6E4DD] bg-white">
        <span className="text-sm font-medium text-[#191C1E]">1 to 4 weeks / 1 से 4 सप्ताह</span>
        <div className="w-5 h-5 rounded-full border-2 border-[#E6E4DD]" />
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6E4DD] bg-white">
        <span className="text-sm font-medium text-[#191C1E]">1 to 6 months / 1 से 6 महीने</span>
        <div className="w-5 h-5 rounded-full border-2 border-[#E6E4DD]" />
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-xl border border-[#E6E4DD] bg-white">
        <span className="text-sm font-medium text-[#191C1E]">More than 6 months (Chronic) / 6 महीने से अधिक</span>
        <div className="w-5 h-5 rounded-full border-2 border-[#E6E4DD]" />
      </button>
    </div>

    <div className="mt-auto p-3.5 bg-white rounded-xl border border-[#E6E4DD] flex items-center justify-between">
      <span className="text-xs text-[#45484A]">Prefer to speak?</span>
      <button className="text-xs font-semibold text-[#E86114] flex items-center gap-1">
        🎙️ Record voice instead
      </button>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex items-center gap-3">
    <button className="flex-1 min-h-[52px] bg-white border border-[#E6E4DD] text-[#191C1E] font-semibold rounded-xl text-sm">
      Previous
    </button>
    <button className="flex-1 min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Continue / आगे बढ़ें →
    </button>
  </footer>
</div>`
  },

  // 5. Document Scanner Camera Viewfinder
  {
    label: "Document Scanner Viewfinder",
    filename: "13_document_scanner_viewfinder.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#191C1E] text-white w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="px-5 py-4 flex items-center justify-between">
    <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-sm">✕</button>
    <div className="text-center">
      <div className="text-sm font-bold">Medical Document Capture</div>
      <div className="text-[10px] text-white/70">Prescription / Lab Report</div>
    </div>
    <button className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white text-sm">⚡</button>
  </header>

  <main className="flex-1 px-5 flex flex-col items-center justify-center">
    <div className="w-full aspect-[3/4] max-w-[300px] border-2 border-dashed border-white/40 rounded-2xl relative flex flex-col items-center justify-between p-4 overflow-hidden bg-black/30">
      <div className="w-full flex justify-between">
        <div className="w-5 h-5 border-t-2 border-l-2 border-[#E86114]" />
        <div className="w-5 h-5 border-t-2 border-r-2 border-[#E86114]" />
      </div>

      <div className="text-center bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-xs text-white/90">
        Align prescription inside frame
      </div>

      <div className="w-full flex justify-between">
        <div className="w-5 h-5 border-b-2 border-l-2 border-[#E86114]" />
        <div className="w-5 h-5 border-b-2 border-r-2 border-[#E86114]" />
      </div>
    </div>

    <div className="text-xs text-white/60 mt-4 text-center">
      Keep paper flat and ensure good lighting
    </div>
  </main>

  <footer className="p-6 bg-black/80 backdrop-blur flex items-center justify-between">
    <button className="flex flex-col items-center gap-1 text-white/80">
      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-lg">🖼️</div>
      <span className="text-[10px]">Gallery</span>
    </button>

    <button className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center p-1">
      <div className="w-14 h-14 rounded-full bg-white active:scale-95 transition-transform" />
    </button>

    <button className="flex flex-col items-center gap-1 text-white/80">
      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-lg">ℹ️</div>
      <span className="text-[10px]">Help</span>
    </button>
  </footer>
</div>`
  },

  // 6. Extracted Document Information Review
  {
    label: "Extracted Document Review",
    filename: "15_extracted_document_review.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Prescription OCR Review</div>
      </div>
    </div>
    <div className="bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[#1E7B48]">
      ✓ OCR Verified
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-4">
    <div>
      <div className="text-xs font-semibold text-[#E86114] uppercase tracking-wider mb-1">Prescription Analysis</div>
      <h1 className="text-2xl font-bold text-[#191C1E] leading-snug">Information Extracted from Document / पर्चे की जानकारी</h1>
      <p className="text-xs text-[#45484A] mt-1">Found 2 medications and 1 clinical observation. Confirm before adding to case sheet.</p>
    </div>

    <div className="p-3 bg-white rounded-xl border border-[#E6E4DD] flex items-center gap-3">
      <div className="w-12 h-14 bg-[#F5F4F0] rounded-lg border border-[#E6E4DD] flex items-center justify-center text-xl shrink-0">📄</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold text-[#191C1E] truncate">Dr_Sharma_Prescription_2026.jpg</div>
        <div className="text-[10px] text-[#73777A]">Captured via camera • Confidence 94%</div>
      </div>
      <button className="text-xs font-semibold text-[#E86114]">Retake</button>
    </div>

    <div className="flex flex-col gap-2.5">
      <div className="text-xs font-semibold text-[#45484A] uppercase tracking-wider">Identified Medications</div>

      <div className="p-3.5 bg-white rounded-xl border border-[#E6E4DD] flex items-start justify-between">
        <div>
          <div className="text-sm font-bold text-[#191C1E]">Avipattikar Churna</div>
          <div className="text-xs text-[#45484A] mt-0.5">Dosage: 3g twice daily before meals</div>
          <div className="text-[10px] text-[#1E7B48] font-medium mt-1">Source: Prescription OCR • Lines 4-5</div>
        </div>
        <span className="text-xs font-semibold text-[#E86114]">Edit</span>
      </div>

      <div className="p-3.5 bg-white rounded-xl border border-[#E6E4DD] flex items-start justify-between">
        <div>
          <div className="text-sm font-bold text-[#191C1E]">Sutshekhar Ras</div>
          <div className="text-xs text-[#45484A] mt-0.5">Dosage: 1 tablet in morning</div>
          <div className="text-[10px] text-[#1E7B48] font-medium mt-1">Source: Prescription OCR • Line 7</div>
        </div>
        <span className="text-xs font-semibold text-[#E86114]">Edit</span>
      </div>
    </div>

    <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-[#1E7B48] flex items-center gap-2 mt-auto">
      <span>✓</span> Your physician will visually verify this prescription against the physical copy.
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex items-center gap-3">
    <button className="flex-1 min-h-[52px] bg-white border border-[#E6E4DD] text-[#191C1E] font-semibold rounded-xl text-sm">
      + Add Another
    </button>
    <button className="flex-1 min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Confirm & Continue →
    </button>
  </footer>
</div>`
  },

  // 7. Case Sheet Review & Summary
  {
    label: "Case Sheet Review Summary",
    filename: "16_clinical_case_review_summary.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Pre-Consultation Case Sheet</div>
      </div>
    </div>
    <div className="bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[#1E7B48]">
      Review Ready
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
    <div>
      <div className="text-xs font-semibold text-[#E86114] uppercase tracking-wider mb-1">Final Verification</div>
      <h1 className="text-2xl font-bold text-[#191C1E] leading-snug">Review your intake summary / जानकारी की समीक्षा</h1>
      <p className="text-xs text-[#45484A] mt-1">This structured sheet will be handed to your attending AYUSH doctor.</p>
    </div>

    <div className="bg-white rounded-xl border border-[#E6E4DD] divide-y divide-[#E6E4DD] shadow-sm">
      <div className="p-3.5 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold text-[#73777A] uppercase">Chief Complaint / मुख्य समस्या</div>
          <div className="text-sm font-bold text-[#191C1E] mt-0.5">Stomach pain & burning after meals</div>
          <div className="text-[10px] text-[#1E7B48] mt-0.5">Verified from patient voice</div>
        </div>
        <button className="text-xs font-semibold text-[#E86114]">Edit</button>
      </div>

      <div className="p-3.5 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold text-[#73777A] uppercase">Duration & Severity / अवधि</div>
          <div className="text-sm font-bold text-[#191C1E] mt-0.5">2 weeks • Moderate intensity</div>
        </div>
        <button className="text-xs font-semibold text-[#E86114]">Edit</button>
      </div>

      <div className="p-3.5 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold text-[#73777A] uppercase">AYUSH Prakriti Markers / आयुष प्रकृति</div>
          <div className="text-sm font-bold text-[#191C1E] mt-0.5">Agni: Tikshnagni (Acidity) • Nidra: Sound</div>
        </div>
        <button className="text-xs font-semibold text-[#E86114]">Edit</button>
      </div>

      <div className="p-3.5 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-semibold text-[#73777A] uppercase">Prescriptions / पूर्व पर्चे</div>
          <div className="text-sm font-bold text-[#191C1E] mt-0.5">1 Document attached (Avipattikar Churna)</div>
        </div>
        <button className="text-xs font-semibold text-[#E86114]">View</button>
      </div>
    </div>

    <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-[#1E7B48] flex items-start gap-2">
      <span className="font-bold">✓</span>
      <div>
        <span className="font-semibold">Linked with ABHA:</span> Rahul Sharma (12-3456-7890-1234)
      </div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex flex-col gap-2">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm">
      <span>Confirm & Submit to Doctor / पुष्टि करें</span> →
    </button>
    <div className="text-center text-[10px] text-[#73777A]">
      Once submitted, your OPD token will be generated instantly.
    </div>
  </footer>
</div>`
  },

  // 8. Network Offline State
  {
    label: "Network Offline State",
    filename: "19_network_offline_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">AYUSH Digital Health Mission</div>
      </div>
    </div>
    <div className="bg-[#FEF2F2] border border-[#BA1A1A]/20 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[#BA1A1A]">
      ● Offline
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col items-center justify-center text-center gap-5">
    <div className="w-20 h-20 rounded-2xl bg-[#F5F4F0] border border-[#E6E4DD] flex items-center justify-center text-3xl text-[#73777A]">
      📡
    </div>

    <div>
      <h1 className="text-2xl font-bold text-[#191C1E]">No Internet Connection</h1>
      <p className="text-sm font-medium text-[#73777A] mt-1">इंटरनेट कनेक्शन उपलब्ध नहीं है</p>
    </div>

    <div className="p-4 bg-white rounded-xl border border-[#E6E4DD] max-w-[280px] text-xs text-[#45484A] leading-relaxed">
      Your recorded symptoms and responses are safely saved on this device. We will automatically resume when connection is restored.
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex flex-col gap-2.5">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm shadow-sm">
      Retry Connection / पुनः प्रयास करें
    </button>
    <button className="w-full py-2 text-center text-xs text-[#45484A] font-medium">
      Continue in offline review mode
    </button>
  </footer>
</div>`
  },

  // 9. Microphone Permission Denied State
  {
    label: "Permission Denied State",
    filename: "21_mic_permission_denied_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Permission Settings</div>
      </div>
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col items-center justify-center text-center gap-5">
    <div className="w-20 h-20 rounded-2xl bg-[#FEF2F2] border border-[#BA1A1A]/30 flex items-center justify-center text-3xl text-[#BA1A1A]">
      🎙️⃠
    </div>

    <div>
      <h1 className="text-2xl font-bold text-[#191C1E]">Microphone Permission Needed</h1>
      <p className="text-sm font-medium text-[#73777A] mt-1">माइक अनुमति आवश्यक है</p>
    </div>

    <p className="text-xs text-[#45484A] max-w-[280px] leading-relaxed">
      To record your symptoms in your own language, please grant microphone permission in Android app settings.
    </p>

    <div className="w-full max-w-[280px] p-3.5 bg-white rounded-xl border border-[#E6E4DD] flex flex-col gap-2 text-left">
      <div className="text-xs font-bold text-[#191C1E]">How to enable:</div>
      <div className="text-[11px] text-[#45484A]">1. Tap &quot;Open App Settings&quot; below</div>
      <div className="text-[11px] text-[#45484A]">2. Select Permissions → Microphone</div>
      <div className="text-[11px] text-[#45484A]">3. Choose &quot;Allow while using app&quot;</div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex flex-col gap-2.5">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm shadow-sm">
      Open Android Settings / सेटिंग्स खोलें
    </button>
    <button className="w-full min-h-[48px] bg-white border border-[#E6E4DD] text-[#191C1E] font-medium rounded-xl text-xs">
      Continue by typing answers instead
    </button>
  </footer>
</div>`
  }
];

// Run sequentially
for (const s of screens) {
  addAndRenderScreen(s.label, s.filename, s.jsx);
}

console.log("\nAll screens generated and rendered successfully!");
