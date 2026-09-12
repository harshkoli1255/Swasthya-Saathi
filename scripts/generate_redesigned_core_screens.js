#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FILE_ID = "91cc9ad4-73f7-45e6-be8a-b8dda086b3c6";
const IMG_DIR = path.join(__dirname, "../design/patient_mobile_app/images");
const ARTIFACT_DIR = "/Users/harshkoli/.gemini/antigravity-ide/brain/60d07897-c7fb-4336-a16b-a06bf9922049";

function addAndRenderScreen(label, filename, jsx) {
  console.log(`\n=== Adding elevated screen: ${label} ===`);
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

// ── ELEVATED FIRST-PRINCIPLES MODERN ANDROID SCREENS ────────────────────────

const elevatedScreens = [
  // 1. ELEVATED WELCOME SCREEN (Anti-card, breathable, authoritative)
  {
    label: "Elevated Welcome Screen",
    filename: "01_welcome_language_screen.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  {/* Top App Bar with Government Trust Marks and Language Selector */}
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

  {/* Hero Message & Hospital Orientation */}
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

    {/* Primary Action Area — Direct, Uncluttered, Accessible */}
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

  {/* Footer Trust Guarantee */}
  <footer className="px-5 py-3 border-t border-[#E6E4DD] bg-white flex items-center justify-between text-[11px] text-[#73777A]">
    <div className="flex items-center gap-1.5">
      <span>🔒</span>
      <span>256-bit Encrypted • Local OPD Storage</span>
    </div>
    <span className="font-semibold text-[#0F172A]">AI assists. Physician decides.</span>
  </footer>
</div>`
  },

  // 2. ELEVATED VOICE INTAKE READY STATE (Question 1/4 - Pure breathing typography, no empty card clutter)
  {
    label: "Elevated Voice Intake Ready",
    filename: "03_voice_intake_chief_complaint.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  {/* Progress Header */}
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

  {/* Main Conversational Question Surface */}
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

    {/* Quick Suggestion Chips (Tappable shortcuts) */}
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

    {/* Dedicated Voice Focal Interaction Area */}
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

    {/* Typing Fallback Link */}
    <div className="pt-2 text-center">
      <button className="text-xs font-semibold text-[#E86114] hover:underline flex items-center justify-center gap-1.5 mx-auto">
        <span>⌨️</span>
        <span>Prefer to type your answer instead? Click here</span>
      </button>
    </div>
  </main>

  {/* Footer Control */}
  <footer className="p-4 bg-white border-t border-[#E6E4DD] flex items-center justify-between">
    <button className="text-xs font-semibold text-[#73777A]">Cancel Intake</button>
    <button className="px-5 py-2.5 rounded-xl bg-[#F5F4F0] text-xs font-bold text-[#73777A] cursor-not-allowed">
      Next Question →
    </button>
  </footer>
</div>`
  },

  // 3. ELEVATED VOICE RECORDING ACTIVE STATE (Real-time dynamic listening)
  {
    label: "Elevated Voice Recording State",
    filename: "08_voice_interview_recording_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A] text-white w-full min-h-[780px] flex flex-col justify-between font-sans">
  {/* Dark Immersive Recording Header */}
  <header className="px-5 pt-4 pb-2 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping"></span>
      <span className="text-xs font-bold tracking-widest text-[#EF4444] uppercase">Listening • 00:08</span>
    </div>
    <button className="text-xs text-slate-400 font-semibold">Cancel</button>
  </header>

  {/* Question Reminder */}
  <div className="px-5 py-2">
    <p className="text-xs text-slate-400 font-medium">Question 1 of 4: Chief Complaint</p>
    <h2 className="text-base font-bold text-slate-100">What health problem brings you here today?</h2>
  </div>

  {/* Central Waveform & Live Streaming Transcript Surface */}
  <main className="px-5 flex-1 flex flex-col justify-center space-y-6">
    {/* Dynamic Audio Visualizer Bars */}
    <div className="flex items-center justify-center gap-1.5 h-16 px-4">
      {[12, 28, 44, 20, 56, 32, 60, 48, 24, 64, 40, 52, 28, 60, 36, 48, 20, 56, 32, 40, 16].map((h, i) => (
        <div key={i} style={{ height: \`\${h}px\` }} className="w-1.5 rounded-full bg-[#E86114] opacity-90 transition-all duration-100"></div>
      ))}
    </div>

    {/* Live Recognized Text Stream Container */}
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

  {/* Big Tactile "Done Speaking" Action */}
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

  // 4. ELEVATED AYUSH PRAKRITI CLINICAL PROFILE (Conversational, structured, clean radio pills)
  {
    label: "Elevated AYUSH Prakriti Intake",
    filename: "04_ayush_prakriti_profile.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  {/* App Bar */}
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

    {/* Section 1: Agni (Digestive Fire) */}
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

    {/* Section 2: Nidra (Sleep Quality) */}
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

    {/* Section 3: Weather Sensitivity (Satmya) */}
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

  {/* Bottom Action Bar */}
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

  // 5. ELEVATED CLINICAL CASE REVIEW & SUMMARY (Doctor-ready sheet, high trust, clean metadata)
  {
    label: "Elevated Case Review Summary",
    filename: "16_clinical_case_review_summary.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  {/* Institutional Header */}
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

    {/* Section 1: Patient Demographic & ABHA Link */}
    <div className="p-3 bg-white rounded-xl border border-[#E6E4DD] flex items-center justify-between">
      <div>
        <div className="text-xs font-bold text-[#0F172A]">Rahul Sharma • Male, 34y</div>
        <div className="text-[10px] text-[#73777A]">ABHA: 91-4829-1029-4820 • Linked via ABDM</div>
      </div>
      <span className="text-xs text-[#1E7B48] font-bold">✓ ABHA Verified</span>
    </div>

    {/* Section 2: Chief Complaint Summary */}
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

    {/* Section 3: AYUSH Constitutional Markers */}
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

    {/* Section 4: Attached Prescriptions */}
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

  {/* Primary Submit to OPD Queue Action */}
  <footer className="p-4 bg-white border-t border-[#E6E4DD] space-y-2">
    <button className="w-full min-h-[52px] bg-[#E86114] hover:bg-[#C2410C] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm">
      <span>Submit Case to OPD Queue →</span>
    </button>
  </footer>
</div>`
  },

  // 6. ELEVATED OPD TOKEN & LIVE QUEUE TRACKER (The definitive reassuring completion experience)
  {
    label: "Elevated OPD Token and Live Queue",
    filename: "07_opd_token_live_queue.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  {/* Success App Bar */}
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
    {/* Authoritative Token Stamp Card */}
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

    {/* Consulting Physician Info */}
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

    {/* Live 4-Stage Stepper */}
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

    {/* Clear Instructions */}
    <div className="p-3 bg-[#FFF5EE] border border-[#E86114]/20 rounded-xl text-xs text-[#45484A] leading-relaxed">
      📢 <strong>What to do next:</strong> Please sit in Waiting Area B. Your token A-42 will be displayed on the digital screen and announced over the PA system in Hindi and English.
    </div>
  </main>

  {/* Actions */}
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
  }
];

// Execute rendering sequentially
(async () => {
  for (const s of elevatedScreens) {
    addAndRenderScreen(s.label, s.filename, s.jsx);
  }
  console.log("\nAll elevated screens rendered successfully!");
})();
