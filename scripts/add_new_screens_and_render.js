#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FILE_ID = "65fa0774-739d-4655-9126-e38534076f8f";
const IMG_DIR = path.join(__dirname, "../design/patient_mobile_app/images");
const ARTIFACT_DIR = "/Users/harshkoli/.gemini/antigravity-ide/brain/60d07897-c7fb-4336-a16b-a06bf9922049";

function addAndRender(label, filename, jsx) {
  console.log(`\nAdding [${label}] to Flowstep...`);
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
    console.log(`✓ Created screen ID: ${screenId}`);

    // Set screen name
    execFileSync("node", ["scripts/flowstep_call.js", "rename-screen", JSON.stringify({
      fileId: FILE_ID,
      screenId: screenId,
      name: label
    })], { encoding: "utf8" });

    // Render image
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
      console.log(`✓ Rendered & Saved: ${filename} (${buf.length} bytes)`);
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

// ── 5 BRAND NEW MODERN ANDROID HEALTHCARE SCREENS ───────────────────────────

const newScreens = [
  // 1. Camera Unavailable / Hardware Failure State
  {
    label: "22 Camera Unavailable State",
    filename: "23_camera_unavailable_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  {/* Android Status Bar */}
  <div className="px-5 pt-2 flex items-center justify-between text-[11px] font-semibold text-[#73777A]">
    <span>09:42</span>
    <div className="flex items-center gap-1.5">
      <span>5G</span>
      <span>📶</span>
      <span>🔋 95%</span>
    </div>
  </div>

  {/* App Bar */}
  <header className="px-5 py-2.5 flex items-center justify-between border-b border-[#E6E4DD] bg-white">
    <div className="flex items-center gap-2">
      <button className="text-base text-[#73777A]">✕</button>
      <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Document Scanner</span>
    </div>
    <span className="text-[11px] font-semibold text-[#73777A]">Help ❓</span>
  </header>

  {/* Main Recovery Content */}
  <main className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-16 h-16 rounded-full bg-[#FFF5EE] border border-[#E86114]/30 flex items-center justify-center text-3xl">
      📷✕
    </div>
    <div>
      <h1 className="text-lg font-extrabold text-[#0F172A]">Camera Access Needed / कैमरा अनुमति चाहिए</h1>
      <p className="text-xs text-[#45484A] mt-1.5 leading-relaxed max-w-xs mx-auto">
        SwasthyaSaathi needs camera access to scan handwritten doctor slips and previous lab prescriptions.
      </p>
    </div>

    {/* Actionable Troubleshooting Steps */}
    <div className="w-full p-4 bg-white rounded-xl border border-[#E6E4DD] text-left text-xs space-y-2 shadow-sm">
      <div className="font-bold text-[#0F172A]">How to enable camera:</div>
      <div className="flex items-start gap-2 text-[#45484A]">
        <span className="w-4 h-4 rounded-full bg-[#F5F4F0] text-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
        <span>Open Android Settings &gt; Apps &gt; SwasthyaSaathi</span>
      </div>
      <div className="flex items-start gap-2 text-[#45484A]">
        <span className="w-4 h-4 rounded-full bg-[#F5F4F0] text-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
        <span>Tap Permissions &gt; Camera &gt; Allow while using app</span>
      </div>
    </div>
  </main>

  {/* Bottom Actions */}
  <footer className="p-5 bg-white border-t border-[#E6E4DD] space-y-2.5">
    <button className="w-full min-h-[52px] bg-[#E86114] hover:bg-[#C2410C] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm">
      <span>⚙️ Open Android Settings</span>
    </button>
    <button className="w-full min-h-[48px] bg-white border border-[#E6E4DD] text-[#0F172A] font-semibold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-[#F5F4F0]">
      <span>🖼️ Choose Photo from Gallery</span>
    </button>
    <button className="w-full py-1 text-center text-xs font-semibold text-[#73777A] hover:text-[#0F172A]">
      Skip scanning • Hand paper slip to doctor in person →
    </button>
    {/* Android System Gesture Bar */}
    <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-2" />
  </footer>
</div>`
  },

  // 2. Multi-Page Document Scanner & Page Reorder Carousel
  {
    label: "23 Multi-Page Document Carousel",
    filename: "24_multipage_document_carousel.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A] text-white w-full min-h-[780px] flex flex-col justify-between font-sans">
  {/* Android Status Bar */}
  <div className="px-5 pt-2 flex items-center justify-between text-[11px] font-semibold text-slate-400">
    <span>09:42</span>
    <div className="flex items-center gap-1.5">
      <span>5G</span>
      <span>📶</span>
      <span>🔋 95%</span>
    </div>
  </div>

  {/* Viewfinder Header */}
  <header className="px-5 py-3 flex items-center justify-between border-b border-slate-800">
    <button className="text-sm font-semibold text-slate-300">✕ Cancel</button>
    <div className="text-center">
      <div className="text-xs font-bold text-white uppercase tracking-wider">Multi-Page Scanner</div>
      <div className="text-[10px] text-emerald-400 font-semibold">Page 2 of 2 in Viewfinder</div>
    </div>
    <button className="text-xs font-bold text-[#E86114] bg-[#FFF5EE] px-3 py-1.5 rounded-full">
      Done (2) ✓
    </button>
  </header>

  {/* Active Camera Viewfinder Area */}
  <main className="px-5 flex-1 flex flex-col items-center justify-center">
    <div className="w-full h-72 rounded-2xl border-2 border-emerald-500/80 relative flex flex-col items-center justify-center p-4 text-center bg-slate-900/50">
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        Document Edge Detected
      </div>
      <p className="text-xs text-slate-300 mt-2">Hold steady • Capturing Page 2</p>
    </div>
  </main>

  {/* Bottom Captured Pages Carousel Strip & Controls */}
  <footer className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
    {/* Page Thumbnail Strip */}
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <div className="relative w-16 h-20 rounded-lg border-2 border-emerald-500 bg-slate-800 flex flex-col items-center justify-center text-[10px] shrink-0">
        <span className="text-xs">📄</span>
        <span className="font-bold text-white">Page 1</span>
        <span className="text-[9px] text-emerald-400">✓ Ready</span>
        <button className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[9px] font-bold">✕</button>
      </div>

      <div className="w-16 h-20 rounded-lg border-2 border-dashed border-[#E86114] bg-slate-900 flex flex-col items-center justify-center text-[10px] shrink-0 text-amber-300">
        <span className="text-xs">📷</span>
        <span className="font-bold">Page 2</span>
        <span className="text-[9px] text-slate-400">Live</span>
      </div>

      <button className="w-16 h-20 rounded-lg border border-dashed border-slate-700 bg-slate-900/40 flex flex-col items-center justify-center text-[10px] shrink-0 text-slate-400 hover:text-white">
        <span className="text-base">+</span>
        <span>Add Page</span>
      </button>
    </div>

    {/* Shutter Bar */}
    <div className="flex items-center justify-around pt-1">
      <button className="text-xs text-slate-400 flex flex-col items-center gap-1">
        <span className="text-lg">🖼️</span>
        <span>Gallery</span>
      </button>

      <button className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-[#E86114] shadow-lg active:scale-95 transition-transform">
        <div className="w-12 h-12 rounded-full bg-white" />
      </button>

      <button className="text-xs text-emerald-400 font-bold flex flex-col items-center gap-1">
        <span className="text-lg">✓</span>
        <span>Process 2</span>
      </button>
    </div>

    <div className="w-32 h-1 bg-slate-700 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 3. Empty Health Records State (ABHA Verified with No Prior Records)
  {
    label: "24 Empty Health Records State",
    filename: "25_empty_health_records_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  {/* Android Status Bar */}
  <div className="px-5 pt-2 flex items-center justify-between text-[11px] font-semibold text-[#73777A]">
    <span>09:42</span>
    <div className="flex items-center gap-1.5">
      <span>5G</span>
      <span>📶</span>
      <span>🔋 95%</span>
    </div>
  </div>

  {/* App Bar */}
  <header className="px-5 py-3 flex items-center justify-between border-b border-[#E6E4DD] bg-white">
    <div className="flex items-center gap-2">
      <button className="text-base text-[#73777A]">←</button>
      <div>
        <h1 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Historical Records</h1>
        <p className="text-[10px] text-[#73777A]">ABDM Network Sync</p>
      </div>
    </div>
    <span className="px-2 py-0.5 rounded-full bg-[#EBF6EE] text-[10px] font-bold text-[#1E7B48]">✓ ABHA Active</span>
  </header>

  <main className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-16 h-16 rounded-2xl bg-[#EBF6EE] border border-[#1E7B48]/30 flex items-center justify-center text-3xl">
      📁✓
    </div>

    <div>
      <h2 className="text-lg font-extrabold text-[#0F172A]">No Previous Clinic Records Found</h2>
      <p className="text-xs text-[#73777A] font-medium mt-0.5">कोई पिछला डिजिटल रिकॉर्ड नहीं मिला</p>
      <p className="text-xs text-[#45484A] mt-2 leading-relaxed max-w-xs mx-auto">
        Your ABHA ID (<strong>91-4829-1029-4820</strong>) is verified, but no previous outpatient visits have been logged on this network yet.
      </p>
    </div>

    <div className="p-3.5 bg-white rounded-xl border border-[#E6E4DD] text-left text-xs space-y-1.5 w-full shadow-sm">
      <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
        <span>✨</span>
        <span>What happens today:</span>
      </div>
      <div className="text-[#45484A] text-[11px] leading-relaxed">
        Today's symptom intake, doctor examination, and herbal prescriptions will create your first official digital health entry in your ABHA health locker.
      </div>
    </div>
  </main>

  <footer className="p-5 bg-white border-t border-[#E6E4DD] space-y-2">
    <button className="w-full min-h-[52px] bg-[#E86114] hover:bg-[#C2410C] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm">
      <span>Proceed to Symptom Case Taking →</span>
    </button>
    <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-2" />
  </footer>
</div>`
  },

  // 4. Cancel Intake / Exit Confirmation Dialog Bottom Sheet
  {
    label: "25 Exit Intake Confirmation Sheet",
    filename: "26_exit_confirmation_sheet.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#191C1E]/60 w-full min-h-[780px] flex flex-col justify-end font-sans">
  {/* Android Modal Bottom Sheet Container */}
  <div className="bg-white rounded-t-[28px] p-6 flex flex-col gap-4 border-t border-[#E6E4DD] shadow-2xl">
    {/* Drag Handle */}
    <div className="w-10 h-1 rounded-full bg-[#E6E4DD] mx-auto" />

    {/* Sheet Header */}
    <div className="flex items-start gap-3.5">
      <div className="w-12 h-12 rounded-xl bg-[#FFF5EE] border border-[#E86114]/30 flex items-center justify-center text-2xl shrink-0">
        ⏳
      </div>
      <div>
        <h2 className="text-base font-extrabold text-[#0F172A]">Leave intake session?</h2>
        <p className="text-xs text-[#73777A] font-medium">क्या आप सत्र छोड़ना चाहते हैं?</p>
      </div>
    </div>

    {/* Body Explanation */}
    <p className="text-xs text-[#45484A] leading-relaxed">
      Your answers for <strong>Question 1 & 2</strong> are saved as a temporary draft. If you leave now, you can resume your intake within <strong>15 minutes</strong> by scanning the clinic QR code again.
    </p>

    {/* Action Hierarchy */}
    <div className="flex flex-col gap-2.5 pt-2">
      <button className="w-full min-h-[52px] bg-[#E86114] hover:bg-[#C2410C] text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm">
        <span>Continue Intake (Recommended)</span>
      </button>

      <button className="w-full min-h-[48px] bg-white border border-[#E6E4DD] text-[#0F172A] font-semibold rounded-xl text-xs flex items-center justify-center hover:bg-[#F5F4F0]">
        <span>Save Draft & Exit to Home</span>
      </button>

      <button className="w-full py-2 text-center text-xs font-semibold text-[#BA1A1A] hover:underline">
        Discard answers and start over
      </button>
    </div>

    {/* Android System Gesture Bar */}
    <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </div>
</div>`
  },

  // 5. Post-Consultation Digital Prescription & Pharmacy Token
  {
    label: "26 Post-Consultation Prescription Token",
    filename: "27_prescription_pharmacy_token.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FBFBFA] text-[#191C1E] w-full min-h-[780px] flex flex-col justify-between font-sans">
  {/* Android Status Bar */}
  <div className="px-5 pt-2 flex items-center justify-between text-[11px] font-semibold text-[#73777A]">
    <span>10:15</span>
    <div className="flex items-center gap-1.5">
      <span>5G</span>
      <span>📶</span>
      <span>🔋 92%</span>
    </div>
  </div>

  {/* App Bar */}
  <header className="px-5 py-2.5 flex items-center justify-between border-b border-[#E6E4DD] bg-white">
    <div className="flex items-center gap-2">
      <span className="w-6 h-6 rounded-full bg-[#EBF6EE] text-[#1E7B48] flex items-center justify-center font-bold text-xs">✓</span>
      <div>
        <div className="text-xs font-bold text-[#0F172A]">Consultation Complete</div>
        <div className="text-[10px] text-[#73777A]">Prescription Issued • Room 104</div>
      </div>
    </div>
    <span className="text-[10px] font-bold text-[#1E7B48] bg-[#EBF6EE] px-2 py-0.5 rounded-full">Discharged</span>
  </header>

  <main className="px-5 py-3 flex-1 flex flex-col space-y-3 overflow-y-auto">
    {/* Pharmacy Dispensation Token Badge */}
    <div className="p-4 bg-[#0F172A] text-white rounded-2xl shadow-md text-center space-y-1 relative overflow-hidden">
      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Pharmacy Dispensation Token</div>
      <div className="text-3xl font-extrabold text-[#10B981] tracking-tight">TOKEN P-18</div>
      <div className="text-xs text-slate-300">Ground Floor Pharmacy • Counter 2</div>
      <div className="pt-2 mt-2 border-t border-slate-800 flex items-center justify-around text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block">Status</span>
          <span className="font-bold text-emerald-400">Packaging Rx</span>
        </div>
        <div className="w-px h-6 bg-slate-800"></div>
        <div>
          <span className="text-[10px] text-slate-400 block">Queue</span>
          <span className="font-bold text-white">2 patients ahead</span>
        </div>
      </div>
    </div>

    {/* Prescribed Medicines List */}
    <div className="p-3.5 bg-white rounded-xl border border-[#E6E4DD] space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Prescribed Herbal Medicines (2)</span>
        <span className="text-[10px] font-semibold text-[#1E7B48]">AYUSH Formulary</span>
      </div>

      <div className="p-2.5 bg-[#F5F4F0] rounded-lg text-xs space-y-0.5">
        <div className="font-bold text-[#0F172A]">1. Avipattikar Churna (अविपत्तिकर चूर्ण)</div>
        <div className="text-[11px] text-[#45484A]">3g with warm water twice daily before meals • 15 Days</div>
      </div>

      <div className="p-2.5 bg-[#F5F4F0] rounded-lg text-xs space-y-0.5">
        <div className="font-bold text-[#0F172A]">2. Kamdudha Ras (कामदुधा रस)</div>
        <div className="text-[11px] text-[#45484A]">1 tablet with milk twice daily after meals • 10 Days</div>
      </div>
    </div>

    {/* Lifestyle & Dietary Guidance (Pathya/Apathya) */}
    <div className="p-3 bg-[#FFF5EE] border border-[#E86114]/20 rounded-xl text-xs space-y-1">
      <span className="font-bold text-[#C2410C] block">🥗 Dietary Advice (पथ्य / अपथ्य):</span>
      <div className="text-[#45484A] text-[11px] leading-relaxed">
        • Eat fresh warm food, pomegranate, and boiled water.<br/>
        • Strictly avoid sour curd, excess red chillies, and fried snacks.
      </div>
    </div>
  </main>

  <footer className="p-4 bg-white border-t border-[#E6E4DD] space-y-2">
    <button className="w-full min-h-[50px] bg-[#E86114] hover:bg-[#C2410C] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm">
      <span>📥 Download Official PDF Prescription</span>
    </button>
    <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  }
];

// Execute rendering sequentially
(async () => {
  console.log(`Adding 5 brand new screens to Flowstep file: ${FILE_ID}`);
  for (const s of newScreens) {
    addAndRender(s.label, s.filename, s.jsx);
  }
  console.log("\nAll 5 new screens rendered and saved successfully!");
})();
