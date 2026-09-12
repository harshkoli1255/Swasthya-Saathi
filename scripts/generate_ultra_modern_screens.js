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

// ── ULTRA-MODERN MASTER SCREENS (PLUS JAKARTA SANS + LUCIDE ICONS) ──────────

const screens = [
  // 01. ULTRA-MODERN WELCOME SCREEN
  {
    label: "01 Welcome & Onboarding",
    filename: "01_welcome_language_screen.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8FAFC] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#EA580C]/20 antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
  </style>

  {/* Modern Dynamic Android Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B] tracking-tight">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] tracking-widest font-extrabold text-[#475569]">5G</span>
      <svg className="w-3.5 h-3.5 fill-[#475569]" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
      <div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center">
        <div className="w-full h-full bg-[#475569] rounded-[2px]"></div>
      </div>
    </div>
  </div>

  {/* Top Navigation Bar with Dynamic Language Switcher Pill */}
  <header className="px-6 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-[#090D16] text-white flex items-center justify-center font-extrabold text-xs shadow-sm">
        SS
      </div>
      <div>
        <div className="text-[13px] font-extrabold tracking-tight text-[#0F172A] leading-none">SwasthyaSaathi</div>
        <div className="text-[10px] font-medium text-[#64748B] mt-0.5">AYUSH Clinical OPD</div>
      </div>
    </div>
    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC]">
      <svg className="w-3.5 h-3.5 text-[#64748B]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
      <span>हिन्दी / EN</span>
      <svg className="w-3 h-3 text-[#94A3B8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
    </button>
  </header>

  {/* Main Hero & Welcome Experience — Completely Card-Free */}
  <main className="px-6 flex-1 flex flex-col justify-center space-y-7">
    <div className="space-y-3.5">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#059669]/20 text-[11px] font-bold text-[#059669]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse"></span>
        ABDM &amp; Ministry of AYUSH Verified
      </div>

      <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-[-0.03em] leading-[1.18]">
        Private clinical intake, before you meet your doctor.
      </h1>

      <p className="text-sm text-[#475569] leading-relaxed font-medium">
        Speak or type your symptoms in your preferred language. Your physician reviews this summary when your token is called.
      </p>
    </div>

    {/* Primary Interactive Focal Actions */}
    <div className="space-y-3 pt-1">
      <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] active:scale-[0.98] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2.5 shadow-[0_8px_20px_rgba(234,88,12,0.22)] transition-all">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>
        <span>Scan Clinic QR Code to Begin</span>
      </button>

      <button className="w-full min-h-[52px] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] active:scale-[0.98] text-[#0F172A] font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all">
        <svg className="w-4 h-4 text-[#64748B]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="12" y2="16"/></svg>
        <span>Check in with 14-Digit ABHA Health ID</span>
      </button>

      <div className="text-center pt-1">
        <button className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] py-1">
          Walk-in patient without ABHA? Continue as Guest →
        </button>
      </div>
    </div>
  </main>

  {/* Institutional Trust Footnote */}
  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <div className="flex items-center justify-between text-[11px] text-[#64748B]">
      <div className="flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span className="font-medium">Encrypted • Local Hospital Session</span>
      </div>
      <span className="font-bold text-[#0F172A]">AI assists. Physician decides.</span>
    </div>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  },

  // 02. ULTRA-MODERN VOICE INTAKE READY (FLUID GLOWING IRIS ORB)
  {
    label: "07 Voice Intake (Question 1/4)",
    filename: "03_voice_intake_chief_complaint.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8FAFC] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#EA580C]/20 antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
  </style>

  {/* Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-extrabold text-[#475569]">5G</span>
      <svg className="w-3.5 h-3.5 fill-[#475569]" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
      <div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div>
    </div>
  </div>

  {/* Clean Progress App Bar */}
  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white">
    <div className="flex items-center justify-between mb-2">
      <button className="text-xs font-semibold text-[#64748B] flex items-center gap-1 hover:text-[#0F172A]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>Back</span>
      </button>
      <span className="text-xs font-extrabold text-[#EA580C] tracking-wider uppercase">Question 1 of 4</span>
      <span className="text-xs font-bold text-[#64748B]">25%</span>
    </div>
    <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
      <div className="w-1/4 h-full bg-[#EA580C] rounded-full transition-all"></div>
    </div>
  </header>

  {/* Conversational Prompt Surface */}
  <main className="px-6 py-5 flex-1 flex flex-col justify-between">
    <div className="space-y-2">
      <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight leading-snug">
        What health trouble brings you to the clinic today?
      </h1>
      <p className="text-sm text-[#475569] font-medium">
        आज आपको क्या स्वास्थ्य समस्या है?
      </p>
      <p className="text-xs text-[#64748B] leading-relaxed pt-1">
        Speak naturally in Hindi, Marathi, or English. Tell us where it hurts, when it started, and any medicines you took.
      </p>
    </div>

    {/* Quick Suggestion Chips */}
    <div className="space-y-2">
      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Common Symptoms (Tap to add)</span>
      <div className="flex flex-wrap gap-2">
        <button className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#334155] hover:border-[#EA580C] shadow-[0_2px_6px_rgba(0,0,0,0.03)] transition-colors">
          Stomach burning / जलन
        </button>
        <button className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#334155] hover:border-[#EA580C] shadow-[0_2px_6px_rgba(0,0,0,0.03)] transition-colors">
          Fever / बुखार
        </button>
        <button className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#334155] hover:border-[#EA580C] shadow-[0_2px_6px_rgba(0,0,0,0.03)] transition-colors">
          Sour reflux / गैस
        </button>
        <button className="px-3.5 py-1.5 rounded-full bg-white border border-[#E2E8F0] text-xs font-semibold text-[#334155] hover:border-[#EA580C] shadow-[0_2px_6px_rgba(0,0,0,0.03)] transition-colors">
          Joint pain / जोड़ों का दर्द
        </button>
      </div>
    </div>

    {/* Modern Fluid Glowing Iris Sound Orb */}
    <div className="flex flex-col items-center justify-center py-6 space-y-3">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-[#EA580C]/20 via-[#F97316]/20 to-[#FB923C]/10 blur-md animate-pulse"></div>
        <button className="relative w-22 h-22 rounded-full bg-gradient-to-tr from-[#C2410C] via-[#EA580C] to-[#FB923C] text-white flex items-center justify-center shadow-[0_8px_25px_rgba(234,88,12,0.35)] hover:scale-105 active:scale-95 transition-all">
          <svg className="w-9 h-9 fill-current" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
        </button>
      </div>
      <div className="text-center">
        <div className="text-sm font-bold text-[#0F172A]">Tap to Speak Symptoms</div>
        <div className="text-xs text-[#64748B]">बोलने के लिए माइक दबाएं</div>
      </div>
    </div>

    {/* Keyboard Typing Fallback Link */}
    <div className="text-center">
      <button className="text-xs font-semibold text-[#475569] hover:text-[#EA580C] inline-flex items-center gap-1.5 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="6" y1="8" x2="6" y2="8"/><line x1="10" y1="8" x2="10" y2="8"/><line x1="14" y1="8" x2="14" y2="8"/><line x1="18" y1="8" x2="18" y2="8"/><line x1="6" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="18" y2="12"/><line x1="7" y1="16" x2="17" y2="16"/></svg>
        <span>Prefer to type your answer instead?</span>
      </button>
    </div>
  </main>

  {/* Footer */}
  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <div className="flex items-center justify-between text-xs">
      <button className="font-semibold text-[#64748B] hover:text-[#0F172A]">Cancel Intake</button>
      <span className="font-medium text-[#94A3B8]">Speak or type to proceed</span>
    </div>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  },

  // 03. ULTRA-MODERN ACTIVE VOICE LISTENING (LIGHT/WARM HARMONIZED THEME)
  {
    label: "08 Voice Recording Listening",
    filename: "08_voice_interview_recording_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FFFDFB] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#EA580C]/20 antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
  </style>

  {/* Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-extrabold text-[#475569]">5G</span>
      <svg className="w-3.5 h-3.5 fill-[#475569]" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
      <div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div>
    </div>
  </div>

  {/* Listening Active Header with Live Dot */}
  <header className="px-6 py-3 border-b border-[#F1E5DC] bg-[#FFFBF8] flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-ping"></span>
      <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">Listening • 00:08</span>
    </div>
    <button className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A]">Cancel</button>
  </header>

  {/* Active Speech Surface */}
  <main className="px-6 py-6 flex-1 flex flex-col justify-between space-y-6">
    <div className="space-y-1">
      <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wide">Chief Complaint</span>
      <h2 className="text-lg font-extrabold text-[#0F172A]">What health trouble brings you here today?</h2>
    </div>

    {/* Dynamic Waveform Visualizer */}
    <div className="flex items-center justify-center gap-1.5 h-16 py-2">
      {[16, 28, 48, 22, 58, 36, 62, 44, 28, 64, 42, 56, 32, 60, 38, 48, 24, 52, 34, 40, 18].map((h, i) => (
        <div key={i} style={{ height: \`\${h}px\` }} className="w-1.5 rounded-full bg-[#EA580C] opacity-90 transition-all"></div>
      ))}
    </div>

    {/* Live Transcribed Stream */}
    <div className="p-4 rounded-2xl bg-[#FFF8F3] border border-[#F3DFD1] space-y-2 shadow-sm">
      <div className="flex items-center justify-between text-[11px] text-[#9A3412]">
        <span className="font-semibold">Transcribing speech in real-time...</span>
        <span className="font-bold text-[#059669]">✓ Hindi / English</span>
      </div>
      <p className="text-sm font-medium text-[#0F172A] leading-relaxed italic">
        "Mujhe pichhle do hafte se khana khane ke baad pet me tevar jalan hoti hai, aur raat ko khatti dakar aati hai..."
      </p>
    </div>

    <p className="text-center text-xs text-[#64748B]">
      Speak clearly. Tap below when you finish explaining.
    </p>
  </main>

  {/* Tactile Done Speaking Button */}
  <footer className="px-6 py-4 border-t border-[#F1E5DC] bg-white flex flex-col gap-2.5">
    <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] active:scale-[0.98] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(234,88,12,0.25)] transition-all">
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg>
      <span>Done Speaking / बोलना समाप्त</span>
    </button>
    <button className="text-center text-xs font-semibold text-[#64748B] hover:text-[#0F172A] py-1">
      Restart audio / दोबारा बोलें
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  },

  // 04. ULTRA-MODERN AYUSH PRAKRITI CLINICAL PROFILE
  {
    label: "12 AYUSH Prakriti Intake",
    filename: "04_ayush_prakriti_profile.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8FAFC] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#EA580C]/20 antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
  </style>

  {/* Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-extrabold text-[#475569]">5G</span>
      <svg className="w-3.5 h-3.5 fill-[#475569]" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
      <div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div>
    </div>
  </div>

  {/* Progress Header */}
  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white">
    <div className="flex items-center justify-between mb-2">
      <button className="text-xs font-semibold text-[#64748B] flex items-center gap-1 hover:text-[#0F172A]">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        <span>Back</span>
      </button>
      <span className="text-xs font-bold text-[#059669] tracking-wide uppercase">AYUSH Profile • Step 3 of 4</span>
      <span className="text-xs font-bold text-[#64748B]">75%</span>
    </div>
    <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
      <div className="w-3/4 h-full bg-[#059669] rounded-full transition-all"></div>
    </div>
  </header>

  {/* Main Form — Modern Sectional Dividers (No Heavy Cards) */}
  <main className="px-6 py-4 flex-1 flex flex-col space-y-5 overflow-y-auto">
    <div className="space-y-1">
      <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Constitutional Markers / प्रकृति विवरण</h1>
      <p className="text-xs text-[#475569] leading-relaxed font-medium">
        These physiological indicators help your AYUSH physician customize herbal formulations.
      </p>
    </div>

    {/* Section 1: Agni */}
    <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#0F172A]">1. Agni (Digestion &amp; Appetite / अग्नि)</span>
        <span className="text-[10px] font-semibold text-[#64748B]">Select 1</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="p-3 rounded-2xl border border-[#E2E8F0] bg-white text-left hover:border-[#059669] shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-colors">
          <div className="text-xs font-bold text-[#0F172A]">Samagni (Balanced)</div>
          <div className="text-[10px] text-[#64748B] mt-0.5">Normal timely hunger</div>
        </button>
        <button className="p-3 rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] text-left shadow-[0_2px_6px_rgba(5,150,105,0.08)]">
          <div className="text-xs font-bold text-[#059669]">Tikshnagni (Sharp) ✓</div>
          <div className="text-[10px] text-[#059669] mt-0.5 font-medium">Frequent acid hunger</div>
        </button>
        <button className="p-3 rounded-2xl border border-[#E2E8F0] bg-white text-left hover:border-[#059669] shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-colors">
          <div className="text-xs font-bold text-[#0F172A]">Mandagni (Slow)</div>
          <div className="text-[10px] text-[#64748B] mt-0.5">Sluggish appetite</div>
        </button>
        <button className="p-3 rounded-2xl border border-[#E2E8F0] bg-white text-left hover:border-[#059669] shadow-[0_2px_4px_rgba(0,0,0,0.02)] transition-colors">
          <div className="text-xs font-bold text-[#0F172A]">Vishamagni (Irregular)</div>
          <div className="text-[10px] text-[#64748B] mt-0.5">Unpredictable hunger</div>
        </button>
      </div>
    </div>

    {/* Section 2: Nidra */}
    <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#0F172A]">2. Nidra (Sleep Quality / निद्रा)</span>
        <span className="text-[10px] font-semibold text-[#64748B]">Select 1</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button className="p-3 rounded-2xl border border-[#E2E8F0] bg-white text-center hover:border-[#059669] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-bold text-[#0F172A]">Deep</div>
          <div className="text-[10px] text-[#64748B] mt-0.5">गहरी नींद</div>
        </button>
        <button className="p-3 rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] text-center shadow-[0_2px_6px_rgba(5,150,105,0.08)]">
          <div className="text-xs font-bold text-[#059669]">Broken ✓</div>
          <div className="text-[10px] text-[#059669] mt-0.5 font-medium">खंडित नींद</div>
        </button>
        <button className="p-3 rounded-2xl border border-[#E2E8F0] bg-white text-center hover:border-[#059669] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-bold text-[#0F172A]">Insomnia</div>
          <div className="text-[10px] text-[#64748B] mt-0.5">अनिद्रा</div>
        </button>
      </div>
    </div>

    {/* Section 3: Weather */}
    <div className="space-y-2 pt-2 border-t border-[#E2E8F0]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#0F172A]">3. Weather Aggravation / मौसम</span>
        <span className="text-[10px] font-semibold text-[#64748B]">Select 1</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button className="p-3 rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] text-center shadow-[0_2px_6px_rgba(5,150,105,0.08)]">
          <div className="text-xs font-bold text-[#059669]">Hot / गर्मी ✓</div>
          <div className="text-[10px] text-[#059669] mt-0.5 font-medium">Pitta flare</div>
        </button>
        <button className="p-3 rounded-2xl border border-[#E2E8F0] bg-white text-center hover:border-[#059669] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-bold text-[#0F172A]">Cold / ठंड</div>
          <div className="text-[10px] text-[#64748B] mt-0.5">Vata flare</div>
        </button>
        <button className="p-3 rounded-2xl border border-[#E2E8F0] bg-white text-center hover:border-[#059669] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
          <div className="text-xs font-bold text-[#0F172A]">Rainy / नमी</div>
          <div className="text-[10px] text-[#64748B] mt-0.5">Kapha flare</div>
        </button>
      </div>
    </div>
  </main>

  {/* Footer */}
  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <button className="w-full min-h-[54px] bg-[#059669] hover:bg-[#047857] active:scale-[0.98] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(5,150,105,0.22)] transition-all">
      <span>Save Clinical Markers &amp; Continue →</span>
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  },

  // 05. ULTRA-MODERN CLINICAL CASE REVIEW SUMMARY
  {
    label: "16 Clinical Case Review Summary",
    filename: "16_clinical_case_review_summary.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8FAFC] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#EA580C]/20 antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
  </style>

  {/* Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-extrabold text-[#475569]">5G</span>
      <svg className="w-3.5 h-3.5 fill-[#475569]" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
      <div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div>
    </div>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <div className="flex items-center gap-2">
      <button className="text-base text-[#64748B]">←</button>
      <div>
        <h1 className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Case Intake Summary</h1>
        <p className="text-[10px] text-[#64748B]">OPD Kayachikitsa Department</p>
      </div>
    </div>
    <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[10px] font-bold text-[#059669] border border-[#059669]/20">✓ Ready</span>
  </header>

  <main className="px-6 py-4 flex-1 flex flex-col space-y-4 overflow-y-auto">
    {/* Patient Demographic Line */}
    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
      <div>
        <div className="text-sm font-extrabold text-[#0F172A]">Rahul Sharma • Male, 34y</div>
        <div className="text-xs text-[#64748B] font-mono mt-0.5">ABHA: 91-4829-1029-4820</div>
      </div>
      <span className="text-xs font-bold text-[#059669] bg-[#ECFDF5] px-2.5 py-0.5 rounded-full">ABDM Linked</span>
    </div>

    {/* Section 1: Chief Complaint */}
    <div className="space-y-1.5 pb-3 border-b border-[#E2E8F0]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">Chief Complaint / मुख्य समस्या</span>
        <button className="text-xs font-semibold text-[#EA580C] hover:underline">Edit ✎</button>
      </div>
      <p className="text-xs text-[#1E293B] font-medium leading-relaxed">
        "Severe burning sensation in stomach after meals for 2 weeks. Worsens at night with sour acid reflux."
      </p>
      <div className="flex gap-2 pt-1 text-[11px] font-semibold text-[#64748B]">
        <span>Duration: 14 Days</span>
        <span>•</span>
        <span>Severity: Moderate</span>
      </div>
    </div>

    {/* Section 2: AYUSH Constitutional Markers */}
    <div className="space-y-1.5 pb-3 border-b border-[#E2E8F0]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">AYUSH Markers / प्रकृति विवरण</span>
        <button className="text-xs font-semibold text-[#059669] hover:underline">Edit ✎</button>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs pt-1">
        <div>
          <span className="text-[10px] text-[#64748B] block">Agni (Digestion)</span>
          <span className="font-bold text-[#0F172A]">Tikshnagni (Sharp)</span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748B] block">Nidra (Sleep)</span>
          <span className="font-bold text-[#0F172A]">Broken (खंडित)</span>
        </div>
        <div>
          <span className="text-[10px] text-[#64748B] block">Satmya</span>
          <span className="font-bold text-[#0F172A]">Heat Sensitive</span>
        </div>
      </div>
    </div>

    {/* Section 3: Prescriptions Attached */}
    <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
      <div>
        <div className="text-xs font-bold text-[#0F172A]">1 Prescription Attached (OCR Verified)</div>
        <div className="text-[10px] text-[#64748B] mt-0.5">Avipattikar Churna, Sutshekhar Ras</div>
      </div>
      <button className="text-xs font-semibold text-[#EA580C] hover:underline">View ✎</button>
    </div>

    {/* Clinical Boundary Notice */}
    <div className="p-3.5 bg-white border border-[#E2E8F0] rounded-2xl text-[11px] text-[#475569] leading-relaxed shadow-2xs">
      <div className="font-bold text-[#0F172A] mb-0.5">Physician Examination Notice:</div>
      This summary will be handed over to Dr. Ayush Sharma. AI assists in case intake; your doctor independently examines and prescribes.
    </div>
  </main>

  {/* Primary Submit Action */}
  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <button className="w-full min-h-[54px] bg-[#EA580C] hover:bg-[#C2410C] active:scale-[0.98] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(234,88,12,0.22)] transition-all">
      <span>Submit Case Summary to OPD Queue →</span>
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  },

  // 06. ULTRA-MODERN OPD TOKEN & LIVE QUEUE TRACKER
  {
    label: "17 OPD Token & Live Queue",
    filename: "07_opd_token_live_queue.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8FAFC] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#EA580C]/20 antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
  </style>

  {/* Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-extrabold text-[#475569]">5G</span>
      <svg className="w-3.5 h-3.5 fill-[#475569]" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
      <div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div>
    </div>
  </div>

  {/* Header */}
  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="w-5 h-5 rounded-full bg-[#ECFDF5] text-[#059669] flex items-center justify-center font-bold text-xs">✓</span>
      <div>
        <div className="text-xs font-bold text-[#0F172A]">Intake Submitted</div>
        <div className="text-[10px] text-[#64748B]">National AYUSH OPD • Room 104</div>
      </div>
    </div>
    <span className="text-[11px] font-bold text-[#64748B]">09:42 AM</span>
  </header>

  <main className="px-6 py-4 flex-1 flex flex-col space-y-4 overflow-y-auto">
    {/* Modern Architectural Boarding Pass Token */}
    <div className="p-5 bg-[#090D16] text-white rounded-3xl shadow-[0_10px_30px_rgba(9,13,22,0.18)] text-center space-y-2 relative overflow-hidden">
      <div className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Official OPD Token</div>
      <div className="text-4xl font-black text-[#FB923C] tracking-tight">OPD • A42</div>
      <div className="text-xs text-slate-300 font-medium">General AYUSH &amp; Kayachikitsa Dept</div>
      
      <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-around text-xs">
        <div>
          <span className="text-[10px] text-slate-400 block">Calling Now</span>
          <span className="font-bold text-white">Token A-39</span>
        </div>
        <div className="w-px h-6 bg-slate-800"></div>
        <div>
          <span className="text-[10px] text-slate-400 block">Queue Position</span>
          <span className="font-bold text-[#FB923C]">3 ahead</span>
        </div>
        <div className="w-px h-6 bg-slate-800"></div>
        <div>
          <span className="text-[10px] text-slate-400 block">Est. Wait</span>
          <span className="font-bold text-emerald-400">~12-15 mins</span>
        </div>
      </div>
    </div>

    {/* Attending Physician Card */}
    <div className="flex items-center gap-3 p-3.5 bg-white border border-[#E2E8F0] rounded-2xl shadow-2xs">
      <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] border border-[#059669]/20 text-[#059669] font-black text-xs flex items-center justify-center shrink-0">
        DA
      </div>
      <div>
        <div className="text-xs font-extrabold text-[#0F172A]">Dr. Ayush Sharma, MD (Ayu)</div>
        <div className="text-[11px] text-[#475569]">Senior Consulting Physician • Room 104</div>
        <div className="text-[10px] text-[#059669] font-bold mt-0.5">● Active in Consultation</div>
      </div>
    </div>

    {/* Live 4-Stage Consultation Timeline */}
    <div className="space-y-2 pt-1">
      <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">Consultation Progress</span>
      <div className="space-y-2 text-xs font-medium">
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-4 rounded-full bg-[#059669] text-white flex items-center justify-center text-[9px] font-bold">✓</span>
          <span className="font-bold text-[#0F172A]">Case Intake Submitted &amp; Linked</span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="w-4 h-4 rounded-full bg-[#EA580C] text-white flex items-center justify-center text-[9px] font-bold">●</span>
          <span className="font-bold text-[#EA580C]">Waiting in Room 104 Outer Lobby (Now)</span>
        </div>
        <div className="flex items-center gap-2.5 opacity-40">
          <span className="w-4 h-4 rounded-full border border-[#64748B] flex items-center justify-center text-[9px]">3</span>
          <span className="text-[#64748B]">Pulse &amp; Tongue Clinical Examination</span>
        </div>
        <div className="flex items-center gap-2.5 opacity-40">
          <span className="w-4 h-4 rounded-full border border-[#64748B] flex items-center justify-center text-[9px]">4</span>
          <span className="text-[#64748B]">Digital Prescription &amp; Pharmacy Token</span>
        </div>
      </div>
    </div>

    <p className="text-xs text-[#64748B] leading-relaxed pt-1 font-medium">
      Please sit in <strong>Waiting Area B</strong>. Token A-42 will be called on the digital screen and announced in Hindi and English.
    </p>
  </main>

  {/* Actions */}
  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <button className="flex-1 min-h-[50px] bg-white border border-[#E2E8F0] text-[#0F172A] font-bold rounded-2xl text-xs hover:bg-[#F8FAFC]">
        View Case Sheet
      </button>
      <button className="flex-1 min-h-[50px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-xs shadow-sm">
        Save to Phone / SMS
      </button>
    </div>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  }
];

// Execute
(async () => {
  for (const s of screens) {
    addAndRender(s.label, s.filename, s.jsx);
  }
  console.log("\nCore ultra-modern screens rendered successfully!");
})();
