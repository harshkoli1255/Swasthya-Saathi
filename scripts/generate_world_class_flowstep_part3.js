#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FILE_ID = "5c6562ac-898c-42a7-ac94-c73fe43edd3e";
const IMG_DIR = path.join(__dirname, "../design/patient_mobile_app/images");
const ARTIFACT_DIR = "/Users/harshkoli/.gemini/antigravity-ide/brain/60d07897-c7fb-4336-a16b-a06bf9922049";

function addAndRender(label, filename, jsx) {
  console.log(`\nAdding [${label}]...`);
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
    console.log(`✓ Created: ${screenId}`);

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
      console.log(`✓ Rendered: ${filename} (${buf.length} bytes)`);
      return { screenId, filename, size: buf.length };
    }
  } catch (err) {
    console.error(`Exception on ${label}:`, err.message);
    return null;
  }
}

const finalScreens = [
  // 09. Voice Audio Processing
  {
    label: "09 Voice Audio Processing",
    filename: "09_voice_processing_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2"><span className="text-[10px]">5G</span><div className="w-5 h-2.5 rounded-sm border border-[#64748B] p-0.5 flex items-center"><div className="w-full h-full bg-[#64748B] rounded-[1px]"></div></div></div>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs">SS</div>
      <span className="text-xs font-bold text-[#0F172A]">SwasthyaSaathi</span>
    </div>
    <span className="text-xs text-[#64748B]">Analyzing Audio</span>
  </header>

  <main className="px-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-16 h-16 rounded-full border-4 border-[#C2410C]/20 border-t-[#C2410C] animate-spin" />
    <div className="space-y-1">
      <h2 className="text-lg font-extrabold text-[#0F172A]">Converting speech to text...</h2>
      <p className="text-xs text-[#64748B]">Extracting symptoms, timelines, and clinical context</p>
    </div>
  </main>

  <footer className="px-6 py-3 border-t border-[#E2E8F0] bg-white text-center">
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 14. Document OCR Processing
  {
    label: "14 Document OCR Processing",
    filename: "14_document_ocr_processing.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2"><span className="text-[10px]">5G</span><div className="w-5 h-2.5 rounded-sm border border-[#64748B] p-0.5 flex items-center"><div className="w-full h-full bg-[#64748B] rounded-[1px]"></div></div></div>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Document Analysis</span>
  </header>

  <main className="px-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-20 h-28 rounded-2xl bg-white border-2 border-[#15803D] flex items-center justify-center relative shadow-sm">
      <svg className="w-8 h-8 text-[#15803D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <div className="absolute inset-x-0 top-1/2 h-1 bg-[#15803D] animate-pulse" />
    </div>
    <div>
      <h2 className="text-lg font-extrabold text-[#0F172A]">Scanning medical document...</h2>
      <p className="text-xs text-[#64748B] mt-1">Reading handwritten medicines and dosages</p>
    </div>
  </main>

  <footer className="px-6 py-3 border-t border-[#E2E8F0] bg-white text-center">
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 18. Network Offline State
  {
    label: "18 Network Offline State",
    filename: "19_network_offline_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <span className="text-[10px] font-bold text-[#DC2626]">No Signal ⚠️</span>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-lg bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs">SS</div>
      <span className="text-xs font-bold text-[#0F172A]">SwasthyaSaathi</span>
    </div>
    <span className="text-[10px] font-bold text-[#DC2626] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">Offline</span>
  </header>

  <main className="px-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C2410C]">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
    </div>
    <div className="space-y-1">
      <h2 className="text-lg font-extrabold text-[#0F172A]">No Internet Connection</h2>
      <p className="text-xs text-[#64748B]">इंटरनेट कनेक्शन नहीं है</p>
      <p className="text-xs text-[#475569] leading-relaxed max-w-xs pt-1">
        Your answers are safely encrypted on this device. We will automatically submit them once connection is restored.
      </p>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white space-y-2">
    <button className="w-full min-h-[52px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm shadow-sm">
      Retry Connection
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 19. Session Expired State
  {
    label: "19 Session Expired State",
    filename: "20_session_expired_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <span className="text-[10px]">5G</span>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white">
    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Session Notice</span>
  </header>

  <main className="px-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-[#64748B]">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    </div>
    <div className="space-y-1">
      <h2 className="text-lg font-extrabold text-[#0F172A]">Intake Session Expired</h2>
      <p className="text-xs text-[#64748B]">सत्र समाप्त • Timed out due to 15m inactivity</p>
      <p className="text-xs text-[#475569] leading-relaxed max-w-xs pt-1">
        Please scan the clinic QR code again to start fresh or resume your consultation queue.
      </p>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white space-y-2">
    <button className="w-full min-h-[52px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm shadow-sm">
      Scan Clinic QR Code Again →
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 20. Mic Permission Denied
  {
    label: "20 Mic Permission Denied",
    filename: "21_mic_permission_denied_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <span className="text-[10px]">5G</span>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <button className="text-base text-[#64748B]">←</button>
    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Audio Permission</span>
  </header>

  <main className="px-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-[#DC2626]">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
    </div>
    <div>
      <h2 className="text-lg font-extrabold text-[#0F172A]">Microphone Access Denied</h2>
      <p className="text-xs text-[#475569] mt-1 max-w-xs leading-relaxed">
        Allow microphone permission in Android settings to speak symptoms, or continue by typing.
      </p>
    </div>

    <div className="w-full p-4 bg-white rounded-2xl border border-[#E2E8F0] text-left text-xs space-y-1.5 shadow-2xs">
      <div className="font-bold text-[#0F172A]">How to enable:</div>
      <div className="text-[#475569]">1. Open Android Settings &gt; Apps &gt; SwasthyaSaathi</div>
      <div className="text-[#475569]">2. Tap Permissions &gt; Microphone &gt; Allow</div>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white space-y-2.5">
    <button className="w-full min-h-[52px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm shadow-sm">
      Open Android Settings
    </button>
    <button className="w-full py-1 text-center text-xs font-semibold text-[#64748B]">
      Continue by typing answers instead →
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 21. Document Processing Failure Recovery
  {
    label: "21 Document Processing Failure",
    filename: "22_document_processing_failure.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <span className="text-[10px]">5G</span>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white">
    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Scan Diagnostics</span>
  </header>

  <main className="px-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C2410C]">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    </div>
    <div>
      <h2 className="text-lg font-extrabold text-[#0F172A]">Document Could Not Be Read</h2>
      <p className="text-xs text-[#475569] mt-1 max-w-xs leading-relaxed">
        The image was too blurry or lighting was dim to extract medicine names accurately.
      </p>
    </div>

    <div className="w-full p-4 bg-white rounded-2xl border border-[#E2E8F0] text-left text-xs space-y-1 shadow-2xs">
      <div className="font-bold text-[#0F172A]">Tips for a clear scan:</div>
      <div className="text-[#475569]">• Avoid glare, flash reflection, and shadows</div>
      <div className="text-[#475569]">• Place slip flat on a contrasting dark background</div>
      <div className="text-[#475569]">• Hold phone steady directly above document</div>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white space-y-2.5">
    <button className="w-full min-h-[52px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm shadow-sm">
      Retake Photo
    </button>
    <button className="w-full py-1 text-center text-xs font-semibold text-[#64748B]">
      Skip &amp; hand paper slip to doctor →
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 22. Camera Unavailable State
  {
    label: "22 Camera Unavailable State",
    filename: "23_camera_unavailable_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <span className="text-[10px]">5G</span>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white">
    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Camera Diagnostics</span>
  </header>

  <main className="px-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C2410C]">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"/></svg>
    </div>
    <div>
      <h2 className="text-lg font-extrabold text-[#0F172A]">Camera Sensor Unavailable</h2>
      <p className="text-xs text-[#475569] mt-1 max-w-xs leading-relaxed">
        Camera is either disabled in settings or in use by another Android application.
      </p>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white space-y-2.5">
    <button className="w-full min-h-[52px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm shadow-sm">
      Open Android Settings
    </button>
    <button className="w-full min-h-[48px] bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold rounded-2xl text-xs">
      Choose Photo from Gallery
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 23. Multi-Page Document Carousel
  {
    label: "23 Multi-Page Document Carousel",
    filename: "24_multipage_document_carousel.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A] text-white w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400">
    <span>09:42</span>
    <span className="text-[10px]">5G</span>
  </div>

  <header className="px-6 py-3 flex items-center justify-between border-b border-slate-800">
    <button className="text-xs font-semibold text-slate-300">✕ Cancel</button>
    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Page 2 of 2 Viewfinder</span>
    <button className="text-xs font-bold text-[#C2410C] bg-white px-3 py-1 rounded-full">Done (2) ✓</button>
  </header>

  <main className="px-6 flex-1 flex flex-col items-center justify-center">
    <div className="w-full h-72 rounded-2xl border-2 border-emerald-400/80 relative flex flex-col items-center justify-center p-4 text-center bg-slate-900/40">
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />
      <span className="text-xs font-semibold text-emerald-300">Hold steady • Edge aligned</span>
    </div>
  </main>

  <footer className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      <div className="w-16 h-20 rounded-xl border-2 border-emerald-400 bg-slate-800 flex flex-col items-center justify-center text-[10px] shrink-0">
        <span className="font-bold">Page 1</span>
        <span className="text-emerald-400 text-[9px]">✓ Saved</span>
      </div>
      <div className="w-16 h-20 rounded-xl border-2 border-dashed border-[#C2410C] bg-slate-900 flex flex-col items-center justify-center text-[10px] shrink-0 text-amber-300">
        <span className="font-bold">Page 2</span>
        <span className="text-slate-400 text-[9px]">Active</span>
      </div>
    </div>

    <div className="flex items-center justify-around pt-1">
      <button className="text-xs text-slate-400 font-semibold">Gallery</button>
      <button className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-[#C2410C] shadow-lg">
        <div className="w-12 h-12 rounded-full bg-white" />
      </button>
      <button className="text-xs text-emerald-400 font-bold">Finish</button>
    </div>
    <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 24. Empty Health Records State
  {
    label: "24 Empty Health Records State",
    filename: "25_empty_health_records_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <span className="text-[10px]">5G</span>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <button className="text-base text-[#64748B]">←</button>
    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">ABDM Records</span>
    <span className="text-xs font-bold text-[#15803D]">Verified</span>
  </header>

  <main className="px-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
    <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#15803D]">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
    </div>
    <div>
      <h2 className="text-lg font-extrabold text-[#0F172A]">No Prior OPD Records Found</h2>
      <p className="text-xs text-[#64748B] mt-0.5">कोई पिछला डिजिटल रिकॉर्ड नहीं है</p>
      <p className="text-xs text-[#475569] mt-2 leading-relaxed max-w-xs">
        Your ABHA ID (<strong>91-4829-1029-4820</strong>) is verified. Today's symptom intake and doctor prescription will form your first digital health entry.
      </p>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white space-y-2">
    <button className="w-full min-h-[52px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm shadow-sm">
      Proceed to Symptom Intake →
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 25. Exit Confirmation Bottom Sheet
  {
    label: "25 Exit Intake Confirmation Sheet",
    filename: "26_exit_confirmation_sheet.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A]/50 w-full min-h-[780px] flex flex-col justify-end font-sans">
  <div className="bg-white rounded-t-[28px] p-6 pb-8 flex flex-col gap-4 border-t border-[#E2E8F0] shadow-2xl">
    <div className="w-10 h-1 rounded-full bg-[#CBD5E1] mx-auto" />
    
    <div>
      <h2 className="text-lg font-extrabold text-[#0F172A]">Leave intake session?</h2>
      <p className="text-xs text-[#64748B] mt-0.5">क्या आप सत्र छोड़ना चाहते हैं?</p>
    </div>

    <p className="text-xs text-[#475569] leading-relaxed">
      Your answers for <strong>Questions 1 &amp; 2</strong> are saved as a temporary draft for 15 minutes.
    </p>

    <div className="flex flex-col gap-2.5 pt-2">
      <button className="w-full min-h-[52px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm shadow-sm">
        Continue Intake (Recommended)
      </button>
      <button className="w-full min-h-[48px] bg-white border border-[#E2E8F0] text-[#0F172A] font-semibold rounded-2xl text-xs">
        Save Draft &amp; Exit to Home
      </button>
      <button className="text-xs font-semibold text-[#DC2626] py-1 text-center">
        Discard answers and start over
      </button>
    </div>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </div>
</div>`
  },

  // 26. Post-Consultation Digital Prescription & Pharmacy Token
  {
    label: "26 Post-Consultation Prescription",
    filename: "27_prescription_pharmacy_token.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>10:15</span>
    <span className="text-[10px]">5G</span>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <div>
      <h1 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Consultation Complete</h1>
      <p className="text-[10px] text-[#64748B]">Room 104 • Dr. Ayush Sharma</p>
    </div>
    <span className="text-[10px] font-bold text-[#15803D] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#15803D]/20">Discharged</span>
  </header>

  <main className="px-6 py-4 flex-1 flex flex-col space-y-3.5 overflow-y-auto">
    {/* Pharmacy Token Badge */}
    <div className="p-4 bg-[#0F172A] text-white rounded-2xl text-center space-y-1">
      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Pharmacy Pickup Token</div>
      <div className="text-3xl font-black text-[#10B981]">TOKEN P-18</div>
      <div className="text-xs text-slate-300">Ground Floor Pharmacy • Counter 2</div>
    </div>

    {/* Prescribed Medicines */}
    <div className="space-y-2 pt-1 border-t border-[#E2E8F0]">
      <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide block">Prescribed Medicines (2)</span>
      <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] space-y-0.5 text-xs">
        <div className="font-bold text-[#0F172A]">1. Avipattikar Churna</div>
        <div className="text-[11px] text-[#475569]">3g with warm water twice daily before food • 15 Days</div>
      </div>
      <div className="p-3 bg-white rounded-xl border border-[#E2E8F0] space-y-0.5 text-xs">
        <div className="font-bold text-[#0F172A]">2. Kamdudha Ras</div>
        <div className="text-[11px] text-[#475569]">1 tablet after meals twice daily • 10 Days</div>
      </div>
    </div>

    {/* Dietary Advice */}
    <div className="p-3 bg-[#FFF8F3] border border-[#F3DFD1] rounded-xl text-xs space-y-1">
      <span className="font-bold text-[#C2410C]">🥗 Dietary Advice (पथ्य / अपथ्य):</span>
      <div className="text-[11px] text-[#475569] leading-relaxed">
        • Fresh warm food, moong dal, pomegranate.<br/>
        • Strictly avoid sour curd, excess red chillies, and fried food.
      </div>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white space-y-2">
    <button className="w-full min-h-[50px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-xs shadow-sm">
      Download Official PDF Prescription
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  }
];

(async () => {
  for (const s of finalScreens) {
    addAndRender(s.label, s.filename, s.jsx);
  }
  console.log("\nAll remaining master screens successfully rendered into new workspace!");
})();
