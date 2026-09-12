#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FILE_ID = "91cc9ad4-73f7-45e6-be8a-b8dda086b3c6";
const IMG_DIR = path.join(__dirname, "../design/patient_mobile_app/images");
const ARTIFACT_DIR = "/Users/harshkoli/.gemini/antigravity-ide/brain/60d07897-c7fb-4336-a16b-a06bf9922049";

function addAndRenderScreen(label, filename, jsx) {
  console.log(`\n=== Adding screen: ${label} ===`);
  try {
    const addRes = execFileSync("node", ["scripts/flowstep_call.js", "add-screen", JSON.stringify({
      fileId: FILE_ID,
      label: label,
      jsxContent: jsx
    })], { encoding: "utf8" });

    const parsed = JSON.parse(addRes);
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
      fs.writeFileSync(path.join(IMG_DIR, filename), buf);
      fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buf);
      console.log(`Saved: ${filename} (${buf.length} bytes)`);
      return { screenId, filename };
    }
  } catch (err) {
    console.error(`Exception on ${label}:`, err.message);
  }
}

// ── SCREENS ──────────────────────────────────────────────────────────────

const remainingScreens = [
  // 1. Transcript Review & Edit (Typing Fallback)
  {
    label: "Transcript Review and Edit",
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
        <span className="text-xs font-semibold text-[#E86114]">Question 1 of 4 • Review Written Words</span>
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

    <div className="flex-1 flex flex-col gap-2">
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
    </div>

    <div className="p-3 bg-[#FFF5EE] border border-[#E86114]/20 rounded-xl text-xs text-[#C2410C] flex items-center justify-between">
      <span>Need to re-record with voice?</span>
      <button className="font-bold underline">Re-record voice</button>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex items-center gap-3">
    <button className="flex-1 min-h-[52px] bg-white border border-[#E6E4DD] text-[#191C1E] font-semibold rounded-xl text-sm">
      Cancel
    </button>
    <button className="flex-1 min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm">
      Save Answer / सहेजें →
    </button>
  </footer>
</div>`
  },

  // 2. Document OCR Processing State
  {
    label: "Document OCR Processing",
    filename: "14_document_ocr_processing.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">OCR Prescription Reader</div>
      </div>
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col items-center justify-center text-center gap-6">
    <div className="w-36 h-48 bg-white rounded-2xl border-2 border-[#E86114] shadow-md p-4 relative overflow-hidden flex flex-col justify-between">
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#E86114] to-transparent absolute top-12 left-0 animate-bounce" />
      <div className="flex justify-between items-center opacity-40">
        <div className="w-12 h-2 bg-[#191C1E] rounded" />
        <div className="w-6 h-2 bg-[#191C1E] rounded" />
      </div>
      <div className="flex flex-col gap-2 opacity-30">
        <div className="w-full h-1.5 bg-[#191C1E] rounded" />
        <div className="w-4/5 h-1.5 bg-[#191C1E] rounded" />
        <div className="w-3/4 h-1.5 bg-[#191C1E] rounded" />
      </div>
      <div className="flex justify-between items-center opacity-40">
        <div className="w-10 h-2 bg-[#191C1E] rounded" />
        <div className="w-10 h-2 bg-[#191C1E] rounded" />
      </div>
    </div>

    <div>
      <h2 className="text-xl font-bold text-[#191C1E]">Analyzing Prescription...</h2>
      <p className="text-sm text-[#73777A] mt-1">पर्चे से दवाइयां और निर्देश पढ़े जा रहे हैं</p>
    </div>

    <div className="w-full max-w-[280px] p-4 bg-white rounded-xl border border-[#E6E4DD] flex flex-col gap-2.5 text-left text-xs">
      <div className="flex items-center gap-2">
        <span className="text-[#1E7B48] font-bold">✓</span>
        <span className="font-medium text-[#191C1E]">Image uploaded & decrypted</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[#E86114] font-bold">●</span>
        <span className="font-medium text-[#191C1E]">Extracting handwritten clinical text...</span>
      </div>
      <div className="flex items-center gap-2 opacity-40">
        <span className="text-[#73777A]">○</span>
        <span className="text-[#73777A]">Matching AYUSH medicines database</span>
      </div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] text-center">
    <span className="text-xs text-[#73777A]">Encrypted under ABDM Health Data Privacy guidelines</span>
  </footer>
</div>`
  },

  // 3. Document OCR Failure Recovery
  {
    label: "Document Processing Failure",
    filename: "22_document_processing_failure.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Capture Assistance</div>
      </div>
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col items-center justify-center text-center gap-5">
    <div className="w-20 h-20 rounded-2xl bg-[#FEF2F2] border border-[#BA1A1A]/30 flex items-center justify-center text-3xl text-[#BA1A1A]">
      ⚠️
    </div>

    <div>
      <h1 className="text-2xl font-bold text-[#191C1E]">Document Could Not Be Read</h1>
      <p className="text-sm font-medium text-[#73777A] mt-1">पर्चे की लिखावट स्पष्ट नहीं है</p>
    </div>

    <div className="p-4 bg-white rounded-xl border border-[#E6E4DD] max-w-[280px] text-xs text-[#45484A] text-left flex flex-col gap-2">
      <div className="font-bold text-[#191C1E]">Common reasons:</div>
      <div>• Photo was blurry or out of focus</div>
      <div>• Glare from flash or harsh room light</div>
      <div>• Document was partially folded</div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex flex-col gap-2.5">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm shadow-sm">
      Retake Photo / दोबारा फोटो लें
    </button>
    <button className="w-full min-h-[48px] bg-white border border-[#E6E4DD] text-[#191C1E] font-medium rounded-xl text-xs">
      Skip & hand physical paper to doctor
    </button>
  </footer>
</div>`
  },

  // 4. Session Expired / Invalid QR Link
  {
    label: "Session Expired State",
    filename: "20_session_expired_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Session Validation</div>
      </div>
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col items-center justify-center text-center gap-5">
    <div className="w-20 h-20 rounded-2xl bg-[#F5F4F0] border border-[#E6E4DD] flex items-center justify-center text-3xl text-[#73777A]">
      ⏱️
    </div>

    <div>
      <h1 className="text-2xl font-bold text-[#191C1E]">Session Link Expired</h1>
      <p className="text-sm font-medium text-[#73777A] mt-1">सत्र समाप्त हो गया है</p>
    </div>

    <p className="text-xs text-[#45484A] max-w-[280px] leading-relaxed">
      For your privacy and security, intake sessions expire after 30 minutes of inactivity. Please scan the OPD reception QR code again.
    </p>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex flex-col gap-2.5">
    <button className="w-full min-h-[52px] bg-[#E86114] text-white font-semibold rounded-xl text-sm shadow-sm">
      Scan New OPD QR Code / नया QR स्कैन करें
    </button>
    <button className="w-full py-2 text-center text-xs text-[#45484A] font-medium">
      Ask OPD Reception desk for assistance
    </button>
  </footer>
</div>`
  },

  // 5. Polished OPD Token & Live Queue Tracker
  {
    label: "OPD Token Live Queue",
    filename: "07_opd_token_live_queue.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <header className="bg-white border-b border-[#E6E4DD] px-5 py-3.5 flex items-center justify-between min-h-[64px]">
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl border-2 border-[#E86114] flex items-center justify-center text-[#E86114] font-bold text-xs">SS</div>
      <div>
        <div className="font-bold text-sm text-[#191C1E]">SwasthyaSaathi</div>
        <div className="text-[10px] text-[#73777A]">Government AYUSH Hospital</div>
      </div>
    </div>
    <div className="bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-1 rounded-lg text-[10px] font-semibold text-[#1E7B48]">
      ● Intake Complete
    </div>
  </header>

  <main className="p-5 flex-1 flex flex-col gap-4">
    <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-[#1E7B48] flex items-center gap-2">
      <span>✓</span> Case sheet submitted and transmitted to doctor workstation.
    </div>

    <div className="bg-white rounded-2xl border border-[#E6E4DD] p-6 text-center shadow-sm flex flex-col items-center gap-3">
      <div className="text-xs font-semibold text-[#73777A] uppercase tracking-wider">Your OPD Token / आपका टोकन</div>
      <div className="text-4xl font-extrabold text-[#191C1E] tracking-tight">OPD-A42</div>

      <div className="w-full grid grid-cols-2 gap-4 py-3 border-y border-[#E6E4DD] my-1">
        <div>
          <div className="text-2xl font-bold text-[#E86114]">12 mins</div>
          <div className="text-[11px] text-[#73777A]">Estimated wait</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-[#191C1E]">3</div>
          <div className="text-[11px] text-[#73777A]">Patients ahead</div>
        </div>
      </div>

      <div className="w-full p-3 bg-[#F5F4F0] rounded-xl text-left">
        <div className="text-sm font-bold text-[#191C1E]">Dr. Ayush Sharma</div>
        <div className="text-xs text-[#45484A]">MD Ayurveda • General Medicine</div>
        <div className="text-xs text-[#E86114] font-medium mt-1">📍 Room 104 • Ground Floor</div>
      </div>
    </div>

    <div className="bg-white rounded-xl border border-[#E6E4DD] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-semibold text-[#45484A]">
        <span>Consultation Status</span>
        <span className="text-[#1E7B48]">Ready for Doctor</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#1E7B48] text-white flex items-center justify-center text-xs font-bold shrink-0">✓</div>
        <div className="flex-1 h-1 bg-[#1E7B48] rounded-full" />
        <div className="w-6 h-6 rounded-full bg-[#E86114] text-white flex items-center justify-center text-xs font-bold shrink-0">●</div>
        <div className="flex-1 h-1 bg-[#E6E4DD] rounded-full" />
        <div className="w-6 h-6 rounded-full bg-[#E6E4DD] text-[#73777A] flex items-center justify-center text-xs font-bold shrink-0">○</div>
      </div>

      <div className="flex justify-between text-[10px] text-[#73777A]">
        <span>Intake Done</span>
        <span className="font-bold text-[#E86114]">Waiting in Queue</span>
        <span>With Doctor</span>
      </div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] flex flex-col gap-2">
    <button className="w-full min-h-[48px] bg-white border border-[#E6E4DD] text-[#191C1E] font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm">
      📥 Download Token Slip (PDF)
    </button>
    <button className="w-full min-h-[48px] bg-[#BA1A1A] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm">
      📞 Hospital Help Desk
    </button>
  </footer>
</div>`
  }
];

for (const s of remainingScreens) {
  addAndRenderScreen(s.label, s.filename, s.jsx);
}

console.log("\nAll remaining screens generated and rendered successfully!");
