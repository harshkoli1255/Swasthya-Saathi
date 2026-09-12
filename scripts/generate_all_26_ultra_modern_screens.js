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

// ── BATCH 1: IDENTITY, CONSENT, VOICE PROCESSING, TRANSCRIPT REVIEW & EDIT, ADAPTIVE FOLLOWUP ──
const screensBatch1 = [
  // 02. LANGUAGE SELECTION BOTTOM SHEET
  {
    label: "02 Language Selector Sheet",
    filename: "02_language_selector_sheet.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A]/50 w-full min-h-[780px] flex flex-col justify-end font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
  </style>

  {/* Bottom Sheet Container */}
  <div className="bg-white rounded-t-[32px] px-6 pt-3 pb-6 flex flex-col gap-5 shadow-[0_-10px_40px_rgba(0,0,0,0.15)]">
    {/* Drag Handle */}
    <div className="w-12 h-1.5 bg-[#CBD5E1] rounded-full mx-auto" />

    {/* Header */}
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-[#EA580C]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
        <h2 className="text-lg font-extrabold text-[#0F172A]">Choose Language / भाषा चुनें</h2>
      </div>
      <p className="text-xs text-[#64748B]">You can speak or type in any language during your clinical intake.</p>
    </div>

    {/* Language Selection List */}
    <div className="flex flex-col gap-2.5">
      {/* English - Selected */}
      <div className="p-3.5 rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#059669] text-white font-bold flex items-center justify-center text-sm">EN</div>
          <div>
            <div className="text-sm font-bold text-[#0F172A]">English</div>
            <div className="text-[11px] text-[#059669] font-medium">Standard Clinical Terminology</div>
          </div>
        </div>
        <svg className="w-5 h-5 text-[#059669]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>

      {/* Hindi */}
      <div className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] font-bold flex items-center justify-center text-sm">हि</div>
          <div>
            <div className="text-sm font-bold text-[#0F172A]">हिन्दी (Hindi)</div>
            <div className="text-[11px] text-[#64748B]">नमस्ते! अपनी समस्या बोलकर बताएं</div>
          </div>
        </div>
      </div>

      {/* Marathi */}
      <div className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] font-bold flex items-center justify-center text-sm">म</div>
          <div>
            <div className="text-sm font-bold text-[#0F172A]">मराठी (Marathi)</div>
            <div className="text-[11px] text-[#64748B]">नमस्कार! आपली तक्रार सांगा</div>
          </div>
        </div>
      </div>

      {/* Gujarati */}
      <div className="p-3.5 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] font-bold flex items-center justify-center text-sm">ગુ</div>
          <div>
            <div className="text-sm font-bold text-[#0F172A]">ગુજરાતી (Gujarati)</div>
            <div className="text-[11px] text-[#64748B]">નમસ્તે! તમારી તકલીફ જણાવો</div>
          </div>
        </div>
      </div>
    </div>

    {/* Primary Action Button */}
    <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-sm shadow-[0_6px_20px_rgba(234,88,12,0.25)] transition-all">
      Confirm Language / भाषा सुनिश्चित करें
    </button>

    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </div>
</div>`
  },

  // 02b. ABHA MOBILE OTP VERIFICATION (SANDBOX LABELED)
  {
    label: "02b ABHA Mobile OTP Verification",
    filename: "02b_abha_otp_verified.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8FAFC] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>

  {/* Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-extrabold text-[#475569]">5G</span>
      <div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div>
    </div>
  </div>

  {/* Header */}
  <header className="px-6 py-3 flex items-center justify-between border-b border-[#E2E8F0] bg-white">
    <button className="w-8 h-8 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#334155]">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
    </button>
    <div className="text-xs font-bold text-[#0F172A]">ABHA Check-in</div>
    <div className="text-[11px] font-bold text-[#EA580C]">Step 2 of 4</div>
  </header>

  <main className="px-6 py-6 flex-1 flex flex-col gap-6">
    {/* Honest Sandbox Mock Badge */}
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs font-semibold w-fit">
      <svg className="w-3.5 h-3.5 text-[#D97706]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>ABDM Sandbox Mock / UAT Mode</span>
    </div>

    <div className="space-y-1.5">
      <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Enter 6-Digit OTP</h1>
      <p className="text-xs text-[#64748B] leading-relaxed">
        Code sent to mobile linked with ABHA ID <span className="font-bold text-[#0F172A]">91-4829-1029-4820</span> (+91 98765-•••••)
      </p>
    </div>

    {/* OTP 6-Digit Boxes */}
    <div className="flex items-center justify-between gap-2 py-2">
      <div className="w-11 h-14 rounded-2xl bg-white border-2 border-[#EA580C] text-lg font-extrabold text-[#0F172A] flex items-center justify-center shadow-sm">4</div>
      <div className="w-11 h-14 rounded-2xl bg-white border-2 border-[#EA580C] text-lg font-extrabold text-[#0F172A] flex items-center justify-center shadow-sm">8</div>
      <div className="w-11 h-14 rounded-2xl bg-white border-2 border-[#EA580C] text-lg font-extrabold text-[#0F172A] flex items-center justify-center shadow-sm">2</div>
      <div className="w-11 h-14 rounded-2xl bg-white border-2 border-[#EA580C] text-lg font-extrabold text-[#0F172A] flex items-center justify-center shadow-sm">9</div>
      <div className="w-11 h-14 rounded-2xl bg-white border border-[#CBD5E1] text-lg font-extrabold text-[#0F172A] flex items-center justify-center">1</div>
      <div className="w-11 h-14 rounded-2xl bg-white border border-[#CBD5E1] text-lg font-extrabold text-[#0F172A] flex items-center justify-center">6</div>
    </div>

    {/* Resend Timer & Link */}
    <div className="flex items-center justify-between text-xs text-[#64748B]">
      <span>Didn't receive SMS?</span>
      <button className="font-bold text-[#EA580C] hover:underline flex items-center gap-1">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        <span>Resend in 00:38</span>
      </button>
    </div>

    {/* Trust & Privacy Notice */}
    <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] flex items-start gap-3">
      <svg className="w-5 h-5 text-[#059669] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
      <div className="text-[11px] text-[#475569] leading-relaxed">
        <span className="font-bold text-[#0F172A]">Official ABDM Milestone 1 & 2:</span> Authenticates identity and securely links past OPD visits with your Ayushman Bharat Health Account.
      </div>
    </div>
  </main>

  {/* Sticky CTA Button */}
  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-sm shadow-[0_6px_20px_rgba(234,88,12,0.25)] transition-all flex items-center justify-center gap-2">
      <span>Verify OTP & Link Profile</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  },

  // 02c. ABHA VERIFIED PROFILE & LINKED HISTORY
  {
    label: "02c ABHA Verified Profile",
    filename: "02c_abha_verified_profile.png",
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
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <span className="text-xs font-bold text-[#0F172A]">ABHA Profile Linked</span>
    </div>
    <span className="text-[10px] font-bold text-[#059669] px-2 py-0.5 bg-[#ECFDF5] rounded-md">VERIFIED</span>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col gap-4">
    {/* Verified Patient Card */}
    <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm space-y-3">
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-white font-extrabold flex items-center justify-center text-base">
          RS
        </div>
        <div>
          <div className="text-base font-extrabold text-[#0F172A]">Rahul Sharma</div>
          <div className="text-xs text-[#64748B]">Male • 34 Years • Pune, MH</div>
        </div>
      </div>
      <div className="pt-3 border-t border-[#F1F5F9] grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-[10px] uppercase font-bold text-[#94A3B8]">ABHA Address</div>
          <div className="font-semibold text-[#0F172A] mt-0.5">rahul.sharma@abdm</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-[#94A3B8]">ABHA Number</div>
          <div className="font-semibold text-[#0F172A] mt-0.5">91-4829-1029-4820</div>
        </div>
      </div>
    </div>

    {/* Discovered Medical Records */}
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold text-[#334155] uppercase tracking-wide">Linked Clinical Records (2)</span>
        <span className="text-[#059669] font-semibold">Ready for Doctor</span>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A]">Kayachikitsa OPD Case Sheet</div>
            <div className="text-[10px] text-[#64748B]">14 Aug 2025 • Dr. D.Y. Patil Ayurveda Hospital</div>
          </div>
        </div>
        <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
      </div>

      <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A]">Avipattikar Formulation Prescription</div>
            <div className="text-[10px] text-[#64748B]">02 May 2025 • AYUSH Dispensary #4</div>
          </div>
        </div>
        <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
      </div>
    </div>

    {/* Consent Toggle Notice */}
    <div className="p-3.5 rounded-2xl bg-[#FFF8F3] border border-[#F3DFD1] flex items-center justify-between">
      <div className="text-xs text-[#9A3412] leading-tight">
        <div className="font-bold">Share records with Dr. Ayush Sharma?</div>
        <div className="text-[10px] text-[#C2410C] mt-0.5">Doctor can review past medications during visit</div>
      </div>
      <div className="w-11 h-6 bg-[#EA580C] rounded-full p-0.5 flex items-center justify-end">
        <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
      </div>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-sm shadow-[0_6px_20px_rgba(234,88,12,0.25)] flex items-center justify-center gap-2">
      <span>Proceed to Symptom Intake</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  },

  // 06. PATIENT CONSENT & DPDP ACT 2023 NOTICE
  {
    label: "06 Patient Consent & DPDP Notice",
    filename: "06_patient_consent_screen.png",
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
    <div className="text-xs font-bold text-[#0F172A]">Patient Privacy & Consent</div>
    <div className="w-8"></div>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col gap-4 overflow-y-auto">
    <div className="space-y-1">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0FDF4] border border-[#DCFCE7] text-[#16A34A] text-[10px] font-bold uppercase tracking-wider">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>DPDP Act 2023 Compliant</span>
      </div>
      <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Your Health Data, Your Full Control</h1>
      <p className="text-xs text-[#64748B] leading-relaxed">
        SwasthyaSaathi operates under Ministry of AYUSH & ABDM privacy guidelines. Choose your data permissions:
      </p>
    </div>

    {/* Granular Toggles */}
    <div className="flex flex-col gap-3">
      {/* Permission 1 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xs text-[#0F172A]">Voice Intake & Audio Capture</div>
          <div className="w-10 h-5 bg-[#059669] rounded-full p-0.5 flex items-center justify-end">
            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
        <p className="text-[11px] text-[#64748B] leading-relaxed">
          Record spoken symptoms in Hindi/English. Audio is used solely to generate your case sheet for today's doctor visit.
        </p>
      </div>

      {/* Permission 2 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xs text-[#0F172A]">Prescription OCR & Document Scan</div>
          <div className="w-10 h-5 bg-[#059669] rounded-full p-0.5 flex items-center justify-end">
            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
        <p className="text-[11px] text-[#64748B] leading-relaxed">
          Extract medicine names and dosages from past paper slips for physician review.
        </p>
      </div>

      {/* Permission 3 */}
      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-bold text-xs text-[#0F172A]">AYUSH Prakriti & Agni Markers</div>
          <div className="w-10 h-5 bg-[#059669] rounded-full p-0.5 flex items-center justify-end">
            <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
        <p className="text-[11px] text-[#64748B] leading-relaxed">
          Record constitutional markers exclusively for your consulting Ayurvedic physician.
        </p>
      </div>
    </div>

    {/* Clinical Scope Legal Clarification */}
    <div className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] text-[#475569] leading-relaxed">
      <span className="font-bold text-[#0F172A]">Clinical Boundaries:</span> SwasthyaSaathi uses AI solely to transcribe and organize patient statements. AI does not diagnose, prescribe, or replace certified clinical decision-making.
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-sm shadow-[0_6px_20px_rgba(234,88,12,0.25)] flex items-center justify-center gap-2">
      <span>I Agree & Continue to Intake</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  },

  // 09. VOICE PROCESSING STATE
  {
    label: "09 Voice Processing State",
    filename: "09_voice_processing_state.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FFFDFB] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  </style>

  {/* Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2"><span className="text-[10px] font-extrabold text-[#475569]">5G</span><div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div></div>
  </div>

  <header className="px-6 py-3 flex items-center justify-between border-b border-[#F1E5DC] bg-white">
    <div className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">Processing Audio</div>
    <button className="text-xs font-semibold text-[#64748B]">Cancel</button>
  </header>

  <main className="px-6 py-10 flex-1 flex flex-col items-center justify-center text-center space-y-6">
    {/* Concentric Pulsing Processing Ring */}
    <div className="relative w-28 h-28 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-[#EA580C]/10 animate-ping"></div>
      <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#EA580C] animate-spin"></div>
      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F97316] text-white flex items-center justify-center shadow-lg shadow-[#EA580C]/30">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
      </div>
    </div>

    <div className="space-y-1.5 max-w-[280px]">
      <h2 className="text-lg font-extrabold text-[#0F172A]">Structuring Your Symptoms...</h2>
      <p className="text-xs text-[#64748B] leading-relaxed">
        Transcribing Hindi speech and extracting clinical timeline for Dr. Ayush Sharma.
      </p>
    </div>

    {/* Stage Milestones */}
    <div className="w-full max-w-[300px] p-4 rounded-2xl bg-white border border-[#F1E5DC] text-left space-y-3 shadow-sm">
      <div className="flex items-center gap-2.5 text-xs text-[#059669] font-bold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Audio recording captured (00:18)</span>
      </div>
      <div className="flex items-center gap-2.5 text-xs text-[#059669] font-bold">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Hindi/English speech recognized</span>
      </div>
      <div className="flex items-center gap-2.5 text-xs text-[#EA580C] font-bold animate-pulse">
        <div className="w-2 h-2 rounded-full bg-[#EA580C]"></div>
        <span>Organizing symptom severity & duration...</span>
      </div>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#F1E5DC] bg-white text-center">
    <span className="text-[11px] text-[#94A3B8]">AI organizes words. Doctor independently examines.</span>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-2" />
  </footer>
</div>`
  },

  // 10. TRANSCRIPT REVIEW & EDIT (TYPING FALLBACK)
  {
    label: "10 Transcript Review & Edit",
    filename: "10_transcript_review_edit.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8FAFC] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
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
      <span className="text-xs font-bold text-[#0F172A]">Edit Transcript</span>
    </div>
    <button className="text-xs font-bold text-[#EA580C]">Reset</button>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col gap-4">
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-[#EA580C]">QUESTION 1 OF 4</span>
        <span className="text-[#64748B]">25% Complete</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-[#E2E8F0]">
        <div className="w-1/4 h-full rounded-full bg-[#EA580C]"></div>
      </div>
    </div>

    <div className="space-y-1">
      <h1 className="text-lg font-extrabold text-[#0F172A]">Edit your response / अपनी बात संपादित करें</h1>
      <p className="text-xs text-[#64748B]">Make any corrections before saving to your doctor's case sheet.</p>
    </div>

    {/* Textarea Surface */}
    <div className="p-4 rounded-2xl bg-white border-2 border-[#EA580C] flex-1 flex flex-col justify-between shadow-sm">
      <textarea
        className="w-full flex-1 bg-transparent text-sm text-[#0F172A] font-medium leading-relaxed resize-none focus:outline-none"
        defaultValue="Mujhe pichhle do hafte se khana khane ke baad pet me tevar jalan aur gas ki shikayat hai. Raat ko takleef badh jaati hai aur khatti dakar aati hai."
      />
      <div className="flex items-center justify-between pt-3 border-t border-[#F1F5F9] text-[11px] text-[#64748B]">
        <span>142 characters</span>
        <span className="text-[#059669] font-bold">✓ Hindi/English recognized</span>
      </div>
    </div>

    {/* Re-record alternative */}
    <div className="p-3.5 rounded-2xl bg-[#FFF8F3] border border-[#F3DFD1] flex items-center justify-between text-xs">
      <span className="text-[#9A3412]">Need to re-record with voice?</span>
      <button className="font-bold text-[#EA580C] hover:underline">Re-record voice</button>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex items-center gap-3">
    <button className="w-1/3 min-h-[52px] bg-white border border-[#CBD5E1] text-[#334155] font-bold rounded-2xl text-xs">
      Cancel
    </button>
    <button className="w-2/3 min-h-[52px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-xs shadow-[0_6px_20px_rgba(234,88,12,0.25)] flex items-center justify-center gap-1.5">
      <span>Save & Continue</span>
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
  </footer>
</div>`
  },

  // 11. ADAPTIVE FOLLOWUP QUESTION
  {
    label: "11 Adaptive Clinical Follow-up",
    filename: "11_adaptive_followup_question.png",
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
    <div className="text-xs font-bold text-[#EA580C]">QUESTION 2 OF 4 • 50%</div>
    <div className="w-8"></div>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col gap-4">
    {/* Clinical Context Tag */}
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#1D4ED8] text-xs font-semibold w-fit">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <span>Follow-up on: Stomach burning after meals</span>
    </div>

    <div className="space-y-1">
      <h1 className="text-lg font-extrabold text-[#0F172A] leading-snug">
        Does the burning happen immediately after meals, or 2–3 hours later?
      </h1>
      <p className="text-xs text-[#64748B]">खाने के तुरंत बाद या कुछ घंटों बाद?</p>
    </div>

    {/* Options */}
    <div className="flex flex-col gap-2.5">
      {/* Option A - Selected */}
      <div className="p-4 rounded-2xl border-2 border-[#059669] bg-[#ECFDF5] flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-[#0F172A]">Immediately after eating (within 30 mins)</div>
          <div className="text-xs text-[#059669] font-medium mt-0.5">खाने के तुरंत बाद • Suggestive of Amlapitta</div>
        </div>
        <svg className="w-5 h-5 text-[#059669] flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>

      {/* Option B */}
      <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-[#0F172A]">2 to 3 hours later or empty stomach</div>
          <div className="text-xs text-[#64748B] mt-0.5">2-3 घंटे बाद या खाली पेट</div>
        </div>
      </div>

      {/* Option C */}
      <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-[#0F172A]">Wakes me up at night from sleep</div>
          <div className="text-xs text-[#64748B] mt-0.5">रात को नींद से जगा देती है</div>
        </div>
      </div>

      {/* Option D */}
      <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#CBD5E1] flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-[#0F172A]">Constant throughout the day</div>
          <div className="text-xs text-[#64748B] mt-0.5">पूरे दिन लगातार बनी रहती है</div>
        </div>
      </div>
    </div>
  </main>

  <footer className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col gap-2">
    <button className="w-full min-h-[56px] bg-[#EA580C] hover:bg-[#C2410C] text-white font-bold rounded-2xl text-sm shadow-[0_6px_20px_rgba(234,88,12,0.25)] flex items-center justify-center gap-2">
      <span>Next: AYUSH Markers (Step 3)</span>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto mt-1" />
  </footer>
</div>`
  }
];

// Execute Batch 1
for (const s of screensBatch1) {
  addAndRender(s.label, s.filename, s.jsx);
}

console.log("\nBatch 1 complete!");
