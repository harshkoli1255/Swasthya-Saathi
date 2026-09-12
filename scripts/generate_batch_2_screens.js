#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FILE_ID = "f956ad9a-5b0e-4f2b-a0ac-cd5669de5012";
const IMG_DIR = path.join(__dirname, "../design/patient_mobile_app/images");
const ARTIFACT_DIR = "/Users/harshkoli/.gemini/antigravity-ide/brain/60d07897-c7fb-4336-a16b-a06bf9922049";

function addAndRender(label, filename, jsx) {
  console.log(`\nRendering Ultra-Modern Screen: [${label}]...`);
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
    console.log(`✓ Screen Created: ${screenId}`);

    execFileSync("node", ["scripts/flowstep_call.js", "rename-screen", JSON.stringify({
      fileId: FILE_ID,
      screenId: screenId,
      name: label
    })], { encoding: "utf8" });

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
      console.error(`Render failed:`, content.text);
      return null;
    }
  } catch (err) {
    console.error(`Exception on ${label}:`, err.message);
    return null;
  }
}

// ── BATCH 2: DOCUMENT SCANNER, OCR PROCESSING, EXTRACTED REVIEW, MULTIPAGE CAROUSEL ──
const screensBatch2 = [
  // 13. DOCUMENT SCANNER CAMERA VIEWFINDER
  {
    label: "13 Document Scanner Camera",
    filename: "13_document_scanner_viewfinder.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0B0F19] text-white w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>

  {/* Camera Viewfinder Controls Top */}
  <div className="z-20 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] font-bold text-white/80">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-extrabold text-white/90">5G</span>
      <div className="w-5 h-2.5 rounded-[4px] border border-white/60 p-[1.5px] flex items-center"><div className="w-full h-full bg-white rounded-[2px]"></div></div>
    </div>
  </div>

  <header className="z-20 px-6 py-3 flex items-center justify-between">
    <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
    <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-white flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
      <span>Auto-Document Detection</span>
    </div>
    <button className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    </button>
  </header>

  {/* Center Camera Target Frame */}
  <main className="z-10 px-8 flex-1 flex flex-col items-center justify-center">
    <div className="relative w-full aspect-[3/4] max-h-[420px] rounded-3xl border-2 border-dashed border-[#10B981]/80 bg-[#1E293B]/20 backdrop-blur-[2px] p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(16,185,129,0.15)]">
      {/* 4 Glowing Corner Brackets */}
      <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#10B981] rounded-tl-xl"></div>
      <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#10B981] rounded-tr-xl"></div>
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-[#10B981] rounded-bl-xl"></div>
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#10B981] rounded-br-xl"></div>

      {/* Frame Guidance Message */}
      <div className="text-center mt-4">
        <span className="px-3 py-1 rounded-full bg-[#0F172A]/80 text-[11px] font-bold text-emerald-300">
          Hold steady • Align prescription inside
        </span>
      </div>

      <div className="text-center mb-4">
        <span className="text-xs font-semibold text-white/70">
          Shree Vishwakarma Ayurvedic Clinic Detected
        </span>
      </div>
    </div>
  </main>

  {/* Bottom Shutter Controls */}
  <footer className="z-20 px-8 py-6 bg-gradient-to-t from-[#0B0F19] to-transparent flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <button className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      </button>

      {/* Shutter Button */}
      <button className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center shadow-lg active:scale-95 transition-all">
        <div className="w-16 h-16 rounded-full bg-[#EA580C]"></div>
      </button>

      {/* Multi-page Counter */}
      <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col items-center justify-center text-[10px] font-extrabold text-white">
        <span>0</span>
        <span className="text-[8px] text-white/60 uppercase">Pages</span>
      </div>
    </div>
    <div className="w-28 h-1 bg-white/30 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 14. DOCUMENT OCR PROCESSING
  {
    label: "14 Document OCR Processing",
    filename: "14_document_ocr_processing.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8FAFC] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>

  {/* Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2"><span className="text-[10px] font-extrabold text-[#475569]">5G</span><div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div></div>
  </div>

  <header className="px-6 py-3 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
    <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">Document Intelligence</div>
    <span className="text-[10px] font-bold text-[#64748B]">PAGE 1 OF 1</span>
  </header>

  <main className="px-6 py-6 flex-1 flex flex-col items-center justify-center space-y-6 text-center">
    {/* Prescription Scanning Graphic */}
    <div className="relative w-48 h-64 rounded-2xl bg-white border-2 border-[#CBD5E1] shadow-md overflow-hidden p-3 flex flex-col justify-between">
      {/* Animated Laser Scanning Line */}
      <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#059669] to-transparent shadow-[0_0_12px_#059669]"></div>

      {/* Simulated Document Lines */}
      <div className="space-y-2 text-left opacity-60">
        <div className="w-20 h-2 bg-slate-300 rounded"></div>
        <div className="w-32 h-1.5 bg-slate-200 rounded"></div>
        <div className="w-28 h-1.5 bg-slate-200 rounded"></div>
        <div className="w-24 h-1.5 bg-slate-200 rounded"></div>
      </div>

      <div className="p-2 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] text-[10px] font-bold text-[#065F46] text-left">
        ✓ Avipattikar Churna 3g BD
      </div>
    </div>

    <div className="space-y-1 max-w-[280px]">
      <h2 className="text-lg font-extrabold text-[#0F172A]">Analyzing Prescription...</h2>
      <p className="text-xs text-[#64748B] leading-relaxed">
        Extracting AYUSH formulations, dosages, and prescribing clinic details for physician review.
      </p>
    </div>

    <div className="w-full max-w-[280px] p-3 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between text-xs font-semibold text-[#0F172A]">
      <span className="flex items-center gap-2">
        <svg className="w-4 h-4 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
        <span>Encrypted Local Extraction</span>
      </span>
      <span className="text-[#059669] font-bold">85%</span>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white text-center">
    <span className="text-[11px] text-[#94A3B8]">ABDM compliant OCR • Processed securely on hospital server</span>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-2" />
  </footer>
</div>`
  },

  // 15. EXTRACTED DOCUMENT FACTS REVIEW
  {
    label: "15 Extracted Document Review",
    filename: "15_extracted_document_review.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8FAFC] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>

  {/* Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2"><span className="text-[10px] font-extrabold text-[#475569]">5G</span><div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div></div>
  </div>

  <header className="px-6 py-3 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
    <div className="flex items-center gap-2">
      <button className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#334155]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span className="text-xs font-bold text-[#0F172A]">Review Extracted Prescription</span>
    </div>
    <span className="text-[10px] font-bold text-[#059669] px-2 py-0.5 bg-[#ECFDF5] rounded-md">OCR READY</span>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col gap-4 overflow-y-auto">
    {/* Prescription Header Info */}
    <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Prescribing Clinic</span>
        <span className="text-[10px] font-semibold text-[#EA580C]">Edit</span>
      </div>
      <div className="text-sm font-extrabold text-[#0F172A]">Shree Vishwakarma Ayurvedic Clinic, Pune</div>
      <div className="text-xs text-[#64748B]">Date: 18 August 2025 • Dr. R. K. Joshi (BAMS)</div>
    </div>

    {/* Extracted Formulations */}
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-[#334155]">
        <span>IDENTIFIED MEDICATIONS (2)</span>
        <span className="text-[#059669]">Confirmed</span>
      </div>

      {/* Medication 1 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-[#0F172A]">Avipattikar Churna</div>
          <span className="text-xs font-bold text-[#EA580C]">Edit</span>
        </div>
        <div className="text-xs text-[#64748B]">Dosage: 3g twice daily before food with lukewarm water</div>
        <div className="inline-block px-2 py-0.5 rounded bg-[#F1F5F9] text-[10px] font-semibold text-[#475569]">
          Indications: Amlapitta (Hyperacidity)
        </div>
      </div>

      {/* Medication 2 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-[#0F172A]">Sutshekhar Ras (Gold Coated)</div>
          <span className="text-xs font-bold text-[#EA580C]">Edit</span>
        </div>
        <div className="text-xs text-[#64748B]">Dosage: 1 tablet twice daily after meals</div>
        <div className="inline-block px-2 py-0.5 rounded bg-[#F1F5F9] text-[10px] font-semibold text-[#475569]">
          Indications: Pitta Samana & Burning sensation
        </div>
      </div>
    </div>

    {/* Verification Note */}
    <div className="p-3 rounded-2xl bg-[#FFF8F3] border border-[#F3DFD1] text-[11px] text-[#9A3412] leading-relaxed">
      <span className="font-bold">Doctor Verification:</span> Dr. Ayush Sharma will cross-examine these previous medications during your OPD consultation.
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-sm shadow-[0_6px_20px_rgba(234,88,12,0.25)] flex items-center justify-center gap-2">
      <span>Confirm Medicines & Add to Case</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  },

  // 24. MULTIPAGE DOCUMENT CAROUSEL
  {
    label: "24 Multipage Document Carousel",
    filename: "24_multipage_document_carousel.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8FAFC] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>

  {/* Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2"><span className="text-[10px] font-extrabold text-[#475569]">5G</span><div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div></div>
  </div>

  <header className="px-6 py-3 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
    <div className="flex items-center gap-2">
      <button className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#334155]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <span className="text-xs font-bold text-[#0F172A]">Attached Documents (2)</span>
    </div>
    <button className="text-xs font-bold text-[#EA580C] flex items-center gap-1">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
      <span>Add Page</span>
    </button>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col gap-4">
    <div className="space-y-1">
      <h2 className="text-lg font-extrabold text-[#0F172A]">Prescription & Lab Scans</h2>
      <p className="text-xs text-[#64748B]">Swipe or tap to review pages captured for Dr. Ayush Sharma.</p>
    </div>

    {/* Two Document Cards */}
    <div className="flex flex-col gap-3">
      {/* Page 1 */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-14 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB] font-bold text-xs">
            P1
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A]">Prescription Slip • Page 1</div>
            <div className="text-[10px] text-[#059669] font-medium">✓ 2 Medicines Extracted</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>

      {/* Page 2 */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-14 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center text-[#16A34A] font-bold text-xs">
            P2
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A]">Lab Report • Complete Blood Count</div>
            <div className="text-[10px] text-[#64748B]">Uploaded from Gallery • 18 Aug 2025</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#475569]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <button className="w-8 h-8 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </div>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-sm shadow-[0_6px_20px_rgba(234,88,12,0.25)] flex items-center justify-center gap-2">
      <span>Continue to Clinical Summary</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  }
];

// Execute Batch 2
for (const s of screensBatch2) {
  addAndRender(s.label, s.filename, s.jsx);
}

console.log("\nBatch 2 complete!");
