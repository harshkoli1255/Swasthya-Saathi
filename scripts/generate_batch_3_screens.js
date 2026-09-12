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

// ── BATCH 3: SYSTEM STATES, EDGE CASES, PHARMACY DISPENSARY TOKEN ──
const screensBatch3 = [
  // 19. NETWORK OFFLINE STATE
  {
    label: "19 Network Offline State",
    filename: "19_network_offline_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8FAFC] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>

  {/* Status Bar with Offline Indication */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-extrabold text-[#DC2626]">No Signal</span>
      <div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div>
    </div>
  </div>

  {/* Offline Floating Notice Banner */}
  <div className="mx-6 mt-2 p-3 rounded-2xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center gap-2.5 text-xs text-[#92400E]">
    <svg className="w-4 h-4 text-[#D97706] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>
    <div className="font-semibold">Hospital Wi-Fi Disconnected • Operating in Offline Mode</div>
  </div>

  <main className="px-6 py-6 flex-1 flex flex-col items-center justify-center text-center space-y-6">
    <div className="w-20 h-20 rounded-3xl bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center text-[#DC2626]">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
    </div>

    <div className="space-y-1.5 max-w-[280px]">
      <h2 className="text-xl font-extrabold text-[#0F172A]">You're Offline, But Your Intake Is Safe</h2>
      <p className="text-xs text-[#64748B] leading-relaxed">
        SwasthyaSaathi stores your case details locally on your device. Your data will auto-sync once clinic network reconnects.
      </p>
    </div>

    {/* Local Cached Token Card */}
    <div className="w-full max-w-[300px] p-5 rounded-3xl bg-[#090D16] text-white space-y-2 shadow-lg">
      <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Offline Hospital Token</div>
      <div className="text-3xl font-extrabold text-[#F97316]">OPD • A42</div>
      <div className="text-xs text-slate-300">Room 104 • Dr. Ayush Sharma</div>
      <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-1.5 text-[11px] text-[#10B981] font-semibold">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Valid for physical queue check-in</span>
      </div>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2.5">
    <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-sm shadow-[0_6px_20px_rgba(234,88,12,0.25)] flex items-center justify-center gap-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
      <span>Retry Network Connection</span>
    </button>
    <button className="text-center text-xs font-semibold text-[#64748B] hover:text-[#0F172A] py-1">
      Show Token to OPD Reception Desk
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 20. SESSION EXPIRED DIALOG
  {
    label: "20 Session Expired State",
    filename: "20_session_expired_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A]/60 w-full min-h-[780px] flex flex-col items-center justify-center p-6 font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>

  {/* Modal Dialog Card */}
  <div className="w-full max-w-[320px] rounded-3xl bg-white p-6 shadow-2xl space-y-5 text-center">
    <div className="w-14 h-14 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] text-[#EA580C] flex items-center justify-center mx-auto">
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    </div>

    <div className="space-y-1.5">
      <h3 className="text-lg font-extrabold text-[#0F172A]">Session Paused for Privacy</h3>
      <p className="text-xs text-[#64748B] leading-relaxed">
        To protect your medical records in a public hospital lobby, sessions lock after 10 minutes of inactivity.
      </p>
    </div>

    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-left flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center font-bold text-xs">RS</div>
      <div>
        <div className="font-bold text-[#0F172A]">Rahul Sharma</div>
        <div className="text-[10px] text-[#64748B]">Token OPD-A42 Saved</div>
      </div>
    </div>

    <div className="space-y-2 pt-1">
      <button className="w-full min-h-[50px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-xs shadow-md">
        Unlock with Phone Biometrics / PIN
      </button>
      <button className="w-full min-h-[44px] bg-white border border-[#CBD5E1] text-[#475569] font-bold rounded-2xl text-xs hover:bg-[#F8FAFC]">
        Start New Session
      </button>
    </div>
  </div>
</div>`
  },

  // 21. MIC PERMISSION DENIED RECOVERY
  {
    label: "21 Microphone Permission Denied",
    filename: "21_mic_permission_denied_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A]/50 w-full min-h-[780px] flex flex-col justify-end font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>

  <div className="bg-white rounded-t-[32px] px-6 pt-3 pb-6 flex flex-col gap-5 shadow-2xl">
    <div className="w-12 h-1.5 bg-[#CBD5E1] rounded-full mx-auto" />

    <div className="flex items-center gap-3.5">
      <div className="w-12 h-12 rounded-2xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
      </div>
      <div>
        <h2 className="text-base font-extrabold text-[#0F172A]">Microphone Access Required</h2>
        <p className="text-xs text-[#64748B] mt-0.5">Needed for Hindi/English voice symptom intake.</p>
      </div>
    </div>

    {/* 3 Step Instructions */}
    <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2.5 text-xs text-[#334155]">
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 rounded-full bg-[#E2E8F0] font-bold text-[10px] flex items-center justify-center text-[#475569]">1</span>
        <span>Open Android Settings &gt; Apps &gt; SwasthyaSaathi</span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 rounded-full bg-[#E2E8F0] font-bold text-[10px] flex items-center justify-center text-[#475569]">2</span>
        <span>Tap <strong className="text-[#0F172A]">Permissions</strong> &gt; <strong className="text-[#0F172A]">Microphone</strong></span>
      </div>
      <div className="flex items-center gap-2.5">
        <span className="w-5 h-5 rounded-full bg-[#E2E8F0] font-bold text-[10px] flex items-center justify-center text-[#475569]">3</span>
        <span>Select <strong className="text-[#059669]">"Allow only while using the app"</strong></span>
      </div>
    </div>

    <div className="space-y-2">
      <button className="w-full min-h-[54px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-xs shadow-md">
        Open Android App Settings
      </button>
      <button className="w-full min-h-[50px] bg-white border border-[#CBD5E1] text-[#334155] font-bold rounded-2xl text-xs hover:bg-[#F8FAFC]">
        Switch to Typing Mode Instead
      </button>
    </div>

    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </div>
</div>`
  },

  // 22. DOCUMENT PROCESSING FAILURE / RETAKE
  {
    label: "22 Document Processing Failure",
    filename: "22_document_processing_failure.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A]/50 w-full min-h-[780px] flex flex-col justify-end font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>

  <div className="bg-white rounded-t-[32px] px-6 pt-3 pb-6 flex flex-col gap-5 shadow-2xl">
    <div className="w-12 h-1.5 bg-[#CBD5E1] rounded-full mx-auto" />

    <div className="flex items-center gap-3.5">
      <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] text-[#EA580C] flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      </div>
      <div>
        <h2 className="text-base font-extrabold text-[#0F172A]">Prescription Unclear or Blurry</h2>
        <p className="text-xs text-[#64748B] mt-0.5">Could not reliably read medicine formulations.</p>
      </div>
    </div>

    <div className="p-4 rounded-2xl bg-[#FFFBF8] border border-[#F3DFD1] space-y-2 text-xs text-[#7C2D12]">
      <div className="font-bold">Tips for a Clearer Photo:</div>
      <div className="flex items-center gap-2"><span>•</span><span>Place paper flat under bright lobby light</span></div>
      <div className="flex items-center gap-2"><span>•</span><span>Ensure all 4 corners of prescription are inside frame</span></div>
      <div className="flex items-center gap-2"><span>•</span><span>Avoid hand tremors and harsh flash reflections</span></div>
    </div>

    <div className="space-y-2">
      <button className="w-full min-h-[54px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-xs shadow-md flex items-center justify-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
        <span>Retake Photo with Camera</span>
      </button>
      <button className="w-full min-h-[50px] bg-white border border-[#CBD5E1] text-[#334155] font-bold rounded-2xl text-xs hover:bg-[#F8FAFC]">
        Type Medicine Names Manually
      </button>
    </div>

    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </div>
</div>`
  },

  // 23. CAMERA UNAVAILABLE STATE
  {
    label: "23 Camera Unavailable State",
    filename: "23_camera_unavailable_state.png",
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
    <button className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#334155]">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
    </button>
    <div className="text-xs font-bold text-[#0F172A]">Camera Device Notice</div>
    <div className="w-8"></div>
  </header>

  <main className="px-6 py-10 flex-1 flex flex-col items-center justify-center text-center space-y-5">
    <div className="w-20 h-20 rounded-3xl bg-[#FEF2F2] border border-[#FEE2E2] text-[#DC2626] flex items-center justify-center">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M1 1l22 22M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56"/></svg>
    </div>

    <div className="space-y-1.5 max-w-[280px]">
      <h2 className="text-lg font-extrabold text-[#0F172A]">Camera Hardware In Use</h2>
      <p className="text-xs text-[#64748B] leading-relaxed">
        Another app might be using the camera, or hardware access is blocked by Android security policy.
      </p>
    </div>

    <div className="w-full max-w-[280px] p-4 rounded-2xl bg-white border border-[#E2E8F0] text-xs text-[#475569] space-y-2 text-left">
      <div className="font-bold text-[#0F172A]">Alternate Upload Options:</div>
      <div className="flex items-center gap-2 text-[#059669]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Upload photo from Device Gallery</span>
      </div>
      <div className="flex items-center gap-2 text-[#059669]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Pick existing PDF document</span>
      </div>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-sm shadow-[0_6px_20px_rgba(234,88,12,0.25)] flex items-center justify-center gap-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <span>Select from Gallery / Files</span>
    </button>
    <button className="text-center text-xs font-semibold text-[#64748B] py-1">
      Skip Prescription Upload &gt;
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 25. EMPTY HEALTH RECORDS STATE
  {
    label: "25 Empty Health Records State",
    filename: "25_empty_health_records_state.png",
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
      <span className="text-xs font-bold text-[#0F172A]">Medical History Records</span>
    </div>
    <div className="w-8"></div>
  </header>

  <main className="px-6 py-12 flex-1 flex flex-col items-center justify-center text-center space-y-6">
    <div className="w-20 h-20 rounded-3xl bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] flex items-center justify-center">
      <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
    </div>

    <div className="space-y-1.5 max-w-[280px]">
      <h2 className="text-lg font-extrabold text-[#0F172A]">No Prior Digital Records Found</h2>
      <p className="text-xs text-[#64748B] leading-relaxed">
        This is your first visit linked with ABHA ID <span className="font-bold text-[#0F172A]">91-4829-1029-4820</span>, or previous clinics haven't published digital records yet.
      </p>
    </div>

    <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] text-xs text-[#475569] space-y-1.5 text-left max-w-[300px]">
      <div className="font-bold text-[#0F172A]">You can still provide past context:</div>
      <div>• Photograph your paper prescription slips</div>
      <div>• Speak your ongoing medications directly to AI intake</div>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-sm shadow-[0_6px_20px_rgba(234,88,12,0.25)] flex items-center justify-center gap-2">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
      <span>Scan Paper Prescriptions</span>
    </button>
    <button className="w-full min-h-[50px] bg-white border border-[#CBD5E1] text-[#334155] font-bold rounded-2xl text-xs hover:bg-[#F8FAFC]">
      Start Fresh Intake with Symptoms
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  },

  // 26. EXIT CONFIRMATION BOTTOM SHEET
  {
    label: "26 Exit Confirmation Sheet",
    filename: "26_exit_confirmation_sheet.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A]/50 w-full min-h-[780px] flex flex-col justify-end font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>

  <div className="bg-white rounded-t-[32px] px-6 pt-3 pb-6 flex flex-col gap-5 shadow-2xl">
    <div className="w-12 h-1.5 bg-[#CBD5E1] rounded-full mx-auto" />

    <div className="flex items-center gap-3.5">
      <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] border border-[#FFEDD5] text-[#EA580C] flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>
      </div>
      <div>
        <h2 className="text-base font-extrabold text-[#0F172A]">Pause Symptom Intake?</h2>
        <p className="text-xs text-[#64748B] mt-0.5">Your progress up to Question 2 is saved as a draft.</p>
      </div>
    </div>

    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] space-y-1">
      <div className="font-bold text-[#0F172A]">Draft Status:</div>
      <div>Chief Complaint: Epigastric burning (2 weeks)</div>
      <div>Markers: Agni (Tikshnagni) saved</div>
    </div>

    <div className="space-y-2">
      <button className="w-full min-h-[54px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-xs shadow-md">
        Continue Answering (Keep Going)
      </button>
      <button className="w-full min-h-[50px] bg-white border border-[#CBD5E1] text-[#334155] font-bold rounded-2xl text-xs hover:bg-[#F8FAFC]">
        Save Draft & Return to Home
      </button>
      <button className="w-full py-2 text-center text-xs font-semibold text-[#DC2626] hover:underline">
        Discard Answers & Start Over
      </button>
    </div>

    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </div>
</div>`
  },

  // 27. POST-CONSULTATION PRESCRIPTION & PHARMACY TOKEN
  {
    label: "27 Prescription Pharmacy Token",
    filename: "27_prescription_pharmacy_token.png",
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
      <div className="w-6 h-6 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div>
        <div className="text-xs font-extrabold text-[#0F172A]">Consultation Concluded</div>
        <div className="text-[10px] text-[#64748B]">Dr. Ayush Sharma • Room 104</div>
      </div>
    </div>
    <span className="text-[10px] font-bold text-[#059669] px-2 py-0.5 bg-[#ECFDF5] rounded-md">COMPLETED</span>
  </header>

  <main className="px-6 py-4 flex-1 flex flex-col gap-4 overflow-y-auto">
    {/* Architectural Pharmacy Dispensary Card */}
    <div className="rounded-3xl bg-[#090D16] text-white p-5 shadow-lg space-y-3">
      <div className="flex items-center justify-between text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        <span>AYUSH DISPENSARY TOKEN</span>
        <span className="text-[#10B981]">DISPENSING NOW</span>
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-3xl font-extrabold text-[#F97316]">PHARMACY • P18</div>
        <span className="text-xs font-semibold text-slate-300">Counter 2</span>
      </div>

      <div className="pt-2 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-[10px] text-slate-400 uppercase">Queue Position</div>
          <div className="font-bold text-white mt-0.5">1 patient ahead</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400 uppercase">Est. Dispense Time</div>
          <div className="font-bold text-[#10B981] mt-0.5">~3 mins</div>
        </div>
      </div>
    </div>

    {/* Prescribed Ayurvedic Medicines */}
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-[#334155]">
        <span>PRESCRIBED FORMULATIONS (2)</span>
        <span className="text-[#059669]">Signed by Doctor</span>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] space-y-1">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#0F172A]">Avipattikar Churna (50g jar)</div>
          <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded">In Stock</span>
        </div>
        <div className="text-[11px] text-[#64748B]">Dosage: 1 teaspoon (3g) twice daily with lukewarm water before food</div>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] space-y-1">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-[#0F172A]">Sutshekhar Ras (30 tablets)</div>
          <span className="text-[10px] font-bold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded">In Stock</span>
        </div>
        <div className="text-[11px] text-[#64748B]">Dosage: 1 tablet twice daily after food</div>
      </div>
    </div>

    {/* Follow-up Note */}
    <div className="p-3 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] text-[11px] text-[#1E40AF] flex items-center justify-between">
      <span>Follow-up Visit: 14 Days (26 Sep 2026)</span>
      <button className="font-bold underline">Add to Calendar</button>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <button className="flex-1 min-h-[52px] bg-white border border-[#CBD5E1] text-[#334155] font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        <span>Download PDF</span>
      </button>
      <button className="flex-1 min-h-[52px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-xs shadow-md flex items-center justify-center gap-1.5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
        <span>Send to WhatsApp</span>
      </button>
    </div>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  }
];

// Execute Batch 3
for (const s of screensBatch3) {
  addAndRender(s.label, s.filename, s.jsx);
}

console.log("\nBatch 3 complete!");
