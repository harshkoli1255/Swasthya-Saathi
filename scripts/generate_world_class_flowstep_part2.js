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

const remainingScreens = [
  // 02. Language Bottom Sheet
  {
    label: "02 Language Selector Sheet",
    filename: "02_language_selector_sheet.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A]/40 w-full min-h-[780px] flex flex-col justify-end font-sans">
  <div className="bg-white rounded-t-[28px] p-6 pb-8 flex flex-col gap-5 border-t border-[#E2E8F0] shadow-2xl">
    <div className="w-10 h-1 rounded-full bg-[#CBD5E1] mx-auto" />
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-extrabold text-[#0F172A]">Select Consultation Language</h2>
        <p className="text-xs text-[#64748B] mt-0.5">अपनी भाषा चुनें • Select preferred language</p>
      </div>
      <button className="w-7 h-7 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] text-xs font-bold">✕</button>
    </div>

    <div className="flex flex-col gap-2">
      <button className="flex items-center justify-between p-3.5 rounded-2xl border-2 border-[#C2410C] bg-[#FFF8F3]">
        <div className="flex items-center gap-3">
          <span className="text-base font-bold text-[#C2410C]">हिन्दी</span>
          <span className="text-xs text-[#64748B]">Hindi</span>
        </div>
        <div className="w-5 h-5 rounded-full bg-[#C2410C] flex items-center justify-center text-white text-[10px]">✓</div>
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[#0F172A]">English</span>
          <span className="text-xs text-[#64748B]">English</span>
        </div>
        <div className="w-5 h-5 rounded-full border border-[#CBD5E1]" />
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[#0F172A]">मराठी</span>
          <span className="text-xs text-[#64748B]">Marathi</span>
        </div>
        <div className="w-5 h-5 rounded-full border border-[#CBD5E1]" />
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[#0F172A]">বাংলা</span>
          <span className="text-xs text-[#64748B]">Bengali</span>
        </div>
        <div className="w-5 h-5 rounded-full border border-[#CBD5E1]" />
      </button>

      <button className="flex items-center justify-between p-3.5 rounded-2xl border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]">
        <div className="flex items-center gap-3">
          <span className="text-base font-semibold text-[#0F172A]">தமிழ்</span>
          <span className="text-xs text-[#64748B]">Tamil</span>
        </div>
        <div className="w-5 h-5 rounded-full border border-[#CBD5E1]" />
      </button>
    </div>

    <button className="w-full min-h-[52px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm shadow-sm transition-all mt-1">
      Confirm Language / भाषा चुनें
    </button>
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </div>
</div>`
  },

  // 03. ABHA Identity Verification (Step 1)
  {
    label: "03 ABHA Input (Step 1)",
    filename: "02_abha_identity_verification.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px]">5G</span>
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
      <div className="w-5 h-2.5 rounded-sm border border-[#64748B] p-0.5 flex items-center"><div className="w-full h-full bg-[#64748B] rounded-[1px]"></div></div>
    </div>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <div className="flex items-center gap-2">
      <button className="text-base text-[#64748B]">←</button>
      <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Identity Linkage</span>
    </div>
    <span className="text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#15803D]/20">Step 1 of 3</span>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col justify-between">
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Link your ABHA Health ID</h1>
        <p className="text-xs text-[#64748B] mt-1">अपनी 14-अंकों की आभा आईडी या आधार नंबर दर्ज करें</p>
      </div>

      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0FDF4] border border-[#15803D]/20 text-xs font-medium text-[#15803D]">
        <svg className="w-3.5 h-3.5 text-[#15803D]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>ABDM Mock Sandbox (Local Development) Active</span>
      </div>

      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold text-[#0F172A] block">14-Digit ABHA Number</label>
        <input
          type="text"
          placeholder="e.g. 91-4829-1029-4820"
          defaultValue="91-4829-1029-4820"
          className="w-full min-h-[52px] px-4 rounded-2xl border-2 border-[#C2410C] bg-white text-sm font-semibold text-[#0F172A] focus:outline-none"
        />
        <span className="text-[11px] text-[#64748B] block">You will receive an OTP on your linked phone</span>
      </div>
    </div>

    <div className="space-y-3 pt-4">
      <button className="w-full min-h-[54px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all">
        <span>Send Verification OTP →</span>
      </button>

      <button className="w-full py-1 text-center text-xs font-semibold text-[#64748B] hover:text-[#0F172A]">
        Skip for now • Continue as Walk-in Guest →
      </button>
    </div>
  </main>

  <footer className="px-6 py-3 border-t border-[#E2E8F0] bg-white text-center">
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 04. ABHA OTP Verification (Step 2)
  {
    label: "04 ABHA OTP Verification (Step 2)",
    filename: "02b_abha_otp_verified.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px]">5G</span>
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
      <div className="w-5 h-2.5 rounded-sm border border-[#64748B] p-0.5 flex items-center"><div className="w-full h-full bg-[#64748B] rounded-[1px]"></div></div>
    </div>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <button className="text-base text-[#64748B]">←</button>
    <span className="text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#15803D]/20">Step 2 of 3</span>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col justify-between">
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Enter 6-digit OTP</h1>
        <p className="text-xs text-[#64748B] mt-1">Code sent to phone linked with ABHA ending in <strong>•••• 4820</strong></p>
      </div>

      <div className="flex justify-between gap-2 py-4">
        {['4', '8', '2', '', '', ''].map((d, i) => (
          <div key={i} className={\`w-12 h-14 rounded-2xl flex items-center justify-center text-lg font-bold border-2 \${i < 3 ? 'border-[#C2410C] bg-white text-[#0F172A]' : 'border-[#CBD5E1] bg-white text-[#94A3B8]'}\`}>
            {d}
          </div>
        ))}
      </div>

      <div className="text-center text-xs text-[#64748B]">
        Resend code in <span className="font-bold text-[#C2410C]">00:38</span>
      </div>
    </div>

    <div className="space-y-3 pt-4">
      <button className="w-full min-h-[54px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all">
        <span>Verify &amp; Link Health ID →</span>
      </button>
      <button className="w-full py-1 text-center text-xs font-semibold text-[#64748B]">Change ABHA number</button>
    </div>
  </main>

  <footer className="px-6 py-3 border-t border-[#E2E8F0] bg-white text-center">
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 05. ABHA Verified Demographic Profile (Step 3)
  {
    label: "05 ABHA Verified Profile (Step 3)",
    filename: "02c_abha_verified_profile.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px]">5G</span>
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
      <div className="w-5 h-2.5 rounded-sm border border-[#64748B] p-0.5 flex items-center"><div className="w-full h-full bg-[#64748B] rounded-[1px]"></div></div>
    </div>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <button className="text-base text-[#64748B]">←</button>
    <span className="text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-2.5 py-0.5 rounded-full border border-[#15803D]/20">Step 3 of 3</span>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col justify-between">
    <div className="space-y-4">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] border border-[#15803D]/20 text-xs font-bold text-[#15803D] mb-2">
          ✓ Verified via ABDM Sandbox
        </div>
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Identity Confirmed</h1>
        <p className="text-xs text-[#64748B] mt-0.5">Your official national demographic profile</p>
      </div>

      <div className="p-4 rounded-2xl bg-white border border-[#E2E8F0] space-y-3 shadow-sm">
        <div className="flex items-center gap-3.5 pb-3 border-b border-[#E2E8F0]">
          <div className="w-12 h-12 rounded-2xl bg-[#C2410C]/10 text-[#C2410C] font-black text-sm flex items-center justify-center">
            RS
          </div>
          <div>
            <div className="text-base font-bold text-[#0F172A]">Rahul Sharma</div>
            <div className="text-xs text-[#64748B]">Male • 34 Years</div>
          </div>
        </div>
        <div className="space-y-1 text-xs">
          <div className="text-[#64748B]">ABHA Number: <span className="font-mono font-bold text-[#0F172A]">91-4829-1029-4820</span></div>
          <div className="text-[#64748B]">ABHA Address: <span className="font-mono text-[#0F172A]">rahul.sharma@abdm</span></div>
          <div className="text-[#64748B]">District: <span className="text-[#0F172A]">Nagpur, Maharashtra</span></div>
        </div>
      </div>
    </div>

    <div className="space-y-3 pt-4">
      <button className="w-full min-h-[54px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all">
        <span>Proceed to Clinical Consent →</span>
      </button>
    </div>
  </main>

  <footer className="px-6 py-3 border-t border-[#E2E8F0] bg-white text-center">
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 06. Patient Clinical Consent
  {
    label: "06 Patient Clinical Consent",
    filename: "06_patient_consent_screen.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px]">5G</span>
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg>
      <div className="w-5 h-2.5 rounded-sm border border-[#64748B] p-0.5 flex items-center"><div className="w-full h-full bg-[#64748B] rounded-[1px]"></div></div>
    </div>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <button className="text-base text-[#64748B]">←</button>
    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Clinical Privacy</span>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col justify-between space-y-4">
    <div>
      <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">Patient Clinical Consent</h1>
      <p className="text-xs text-[#64748B] mt-1">रोगी सहमति • How your health data is used today</p>
    </div>

    <div className="space-y-4 pt-1">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] text-[#15803D] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
        <div className="text-xs leading-relaxed text-[#475569]">
          <strong className="text-[#0F172A] block mb-0.5 font-bold">Physician Makes All Decisions</strong>
          AI only organizes your spoken symptoms. Every medical diagnosis and prescription is determined exclusively by your consulting doctor.
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] text-[#15803D] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
        <div className="text-xs leading-relaxed text-[#475569]">
          <strong className="text-[#0F172A] block mb-0.5 font-bold">Confidential &amp; Encrypted</strong>
          Your voice recordings and past documents are encrypted and shared only with your treating physician for this OPD encounter.
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#F0FDF4] text-[#15803D] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
        <div className="text-xs leading-relaxed text-[#475569]">
          <strong className="text-[#0F172A] block mb-0.5 font-bold">ABDM Compliant</strong>
          Digital record linkage follows National Health Authority guidelines. You retain full control over your health locker.
        </div>
      </div>
    </div>

    <div className="pt-2">
      <label className="flex items-center gap-3 p-3.5 bg-white border border-[#CBD5E1] rounded-2xl cursor-pointer">
        <input type="checkbox" defaultChecked className="w-4 h-4 text-[#C2410C] rounded border-[#CBD5E1]" />
        <span className="text-xs font-semibold text-[#0F172A]">I understand and agree to OPD case intake</span>
      </label>
    </div>

    <div className="pt-2">
      <button className="w-full min-h-[54px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all">
        <span>Accept &amp; Start Intake →</span>
      </button>
    </div>
  </main>

  <footer className="px-6 py-3 border-t border-[#E2E8F0] bg-white text-center">
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 10. Transcript Review & Edit
  {
    label: "10 Transcript Review & Edit",
    filename: "10_transcript_review_edit.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2"><span className="text-[10px]">5G</span><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg><div className="w-5 h-2.5 rounded-sm border border-[#64748B] p-0.5 flex items-center"><div className="w-full h-full bg-[#64748B] rounded-[1px]"></div></div></div>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <button className="text-base text-[#64748B]">←</button>
    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Review Spoken Words</span>
    <button className="text-xs font-bold text-[#C2410C]">Reset</button>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col justify-between space-y-4">
    <div>
      <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Edit your response / अपनी बात जांचें</h1>
      <p className="text-xs text-[#64748B] mt-1">Make any corrections before saving to your case summary.</p>
    </div>

    <div className="flex-1 flex flex-col gap-2">
      <div className="p-4 bg-white rounded-2xl border-2 border-[#C2410C] flex-1 flex flex-col shadow-sm">
        <textarea
          className="w-full flex-1 bg-transparent text-sm text-[#0F172A] leading-relaxed resize-none focus:outline-none"
          defaultValue="Mujhe pichhle do hafte se khana khane ke baad pet me tevar jalan aur gas ki shikayat hai. Raat ko takleef badh jaati hai."
        />
        <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] text-[11px] text-[#64748B]">
          <span>118 characters</span>
          <span className="text-[#15803D] font-semibold">✓ Hindi / English Mixed</span>
        </div>
      </div>
    </div>

    <div className="space-y-3 pt-2">
      <button className="w-full min-h-[54px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm">
        <span>Save Response &amp; Continue →</span>
      </button>
      <button className="w-full py-1 text-center text-xs font-semibold text-[#64748B]">Re-record with voice</button>
    </div>
  </main>

  <footer className="px-6 py-3 border-t border-[#E2E8F0] bg-white text-center">
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 11. Adaptive Follow-up Question
  {
    label: "11 Adaptive Follow-up Question",
    filename: "11_adaptive_followup_question.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2"><span className="text-[10px]">5G</span><svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/></svg><div className="w-5 h-2.5 rounded-sm border border-[#64748B] p-0.5 flex items-center"><div className="w-full h-full bg-[#64748B] rounded-[1px]"></div></div></div>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white">
    <div className="flex items-center justify-between mb-2">
      <button className="text-sm font-semibold text-[#64748B]">← Back</button>
      <span className="text-xs font-bold text-[#C2410C] tracking-wide uppercase">Question 2 of 4</span>
      <span className="text-xs font-semibold text-[#64748B]">50%</span>
    </div>
    <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
      <div className="w-1/2 h-full bg-[#C2410C] rounded-full"></div>
    </div>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col justify-between space-y-4">
    <div className="space-y-2">
      <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider">Duration &amp; Timeline</span>
      <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">How long have you had this stomach pain?</h1>
      <p className="text-xs text-[#64748B]">यह दर्द कितने दिनों से हो रहा है?</p>
    </div>

    <div className="space-y-2.5">
      <button className="w-full p-4 rounded-2xl border border-[#CBD5E1] bg-white text-left hover:border-[#C2410C] transition-colors">
        <div className="text-sm font-bold text-[#0F172A]">Less than 24 hours / 24 घंटे से कम</div>
      </button>

      <button className="w-full p-4 rounded-2xl border-2 border-[#C2410C] bg-[#FFF8F3] text-left">
        <div className="text-sm font-bold text-[#C2410C]">2 to 7 days / 2 से 7 दिन ✓</div>
      </button>

      <button className="w-full p-4 rounded-2xl border border-[#CBD5E1] bg-white text-left hover:border-[#C2410C] transition-colors">
        <div className="text-sm font-bold text-[#0F172A]">2 to 4 weeks / 2 से 4 सप्ताह</div>
      </button>

      <button className="w-full p-4 rounded-2xl border border-[#CBD5E1] bg-white text-left hover:border-[#C2410C] transition-colors">
        <div className="text-sm font-bold text-[#0F172A]">More than a month / 1 महीने से अधिक</div>
      </button>
    </div>

    <div className="space-y-3 pt-4">
      <button className="w-full min-h-[54px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all">
        <span>Save &amp; Next Question →</span>
      </button>
    </div>
  </main>

  <footer className="px-6 py-3 border-t border-[#E2E8F0] bg-white text-center">
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  },

  // 13. Document Scanner Viewfinder
  {
    label: "13 Document Scanner Viewfinder",
    filename: "13_document_scanner_viewfinder.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#0F172A] text-white w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-slate-400">
    <span>09:42</span>
    <div className="flex items-center gap-2"><span className="text-[10px]">5G</span><div className="w-5 h-2.5 rounded-sm border border-slate-400 p-0.5 flex items-center"><div className="w-full h-full bg-slate-400 rounded-[1px]"></div></div></div>
  </div>

  <header className="px-6 py-3 flex items-center justify-between border-b border-slate-800">
    <button className="text-xs font-semibold text-slate-300">✕ Cancel</button>
    <span className="text-xs font-bold text-white uppercase tracking-wider">Scan Prescription</span>
    <button className="text-xs font-bold bg-slate-800 px-3 py-1 rounded-full">Flash ⚡</button>
  </header>

  <main className="px-6 flex-1 flex flex-col items-center justify-center">
    <div className="w-full h-80 rounded-2xl border-2 border-dashed border-white/60 relative flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-400" />
      <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-400" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-400" />

      <div className="text-sm font-bold text-white">Align prescription inside this frame</div>
      <div className="text-xs text-slate-400 mt-1">Hold steady under good lighting</div>
    </div>
  </main>

  <footer className="p-6 bg-slate-950 flex items-center justify-around">
    <button className="text-xs text-slate-400 font-semibold">Gallery</button>
    <button className="w-18 h-18 rounded-full border-4 border-white flex items-center justify-center bg-[#C2410C] shadow-lg active:scale-95 transition-transform">
      <div className="w-14 h-14 rounded-full bg-white" />
    </button>
    <button className="text-xs text-slate-400 font-semibold">Skip</button>
  </footer>
</div>`
  },

  // 15. Extracted Document Review
  {
    label: "15 Extracted Document Review",
    filename: "15_extracted_document_review.png",
    jsx: `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#F8F9FA] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-sans">
  <div className="px-6 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-semibold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2"><span className="text-[10px]">5G</span><div className="w-5 h-2.5 rounded-sm border border-[#64748B] p-0.5 flex items-center"><div className="w-full h-full bg-[#64748B] rounded-[1px]"></div></div></div>
  </div>

  <header className="px-6 py-3 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
    <button className="text-base text-[#64748B]">←</button>
    <span className="text-xs font-bold text-[#0F172A] uppercase tracking-wide">Extracted Medicines</span>
    <span className="text-xs font-bold text-[#15803D]">2 Verified</span>
  </header>

  <main className="px-6 py-5 flex-1 flex flex-col justify-between space-y-4">
    <div>
      <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Prescription Review</h1>
      <p className="text-xs text-[#64748B] mt-1">Verify that extracted medications match your physical paper slip.</p>
    </div>

    <div className="space-y-3">
      <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] space-y-1.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#0F172A]">1. Avipattikar Churna</span>
          <span className="text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded">94% match</span>
        </div>
        <div className="text-xs text-[#475569]">Dosage: 3g with warm water twice daily</div>
        <div className="flex gap-3 pt-2 text-xs font-semibold">
          <button className="text-[#C2410C]">Edit ✎</button>
          <button className="text-[#DC2626]">Remove ✕</button>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-[#E2E8F0] space-y-1.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#0F172A]">2. Sutshekhar Ras</span>
          <span className="text-xs font-bold text-[#15803D] bg-[#F0FDF4] px-2 py-0.5 rounded">89% match</span>
        </div>
        <div className="text-xs text-[#475569]">Dosage: 1 tablet after meals</div>
        <div className="flex gap-3 pt-2 text-xs font-semibold">
          <button className="text-[#C2410C]">Edit ✎</button>
          <button className="text-[#DC2626]">Remove ✕</button>
        </div>
      </div>
    </div>

    <div className="space-y-3 pt-4">
      <button className="w-full min-h-[54px] bg-[#C2410C] hover:bg-[#9A3412] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 shadow-sm transition-all">
        <span>Confirm Medications &amp; Proceed →</span>
      </button>
    </div>
  </main>

  <footer className="px-6 py-3 border-t border-[#E2E8F0] bg-white text-center">
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`
  }
];

(async () => {
  for (const s of remainingScreens) {
    addAndRender(s.label, s.filename, s.jsx);
  }
  console.log("\nAll remaining world-class screens rendered successfully!");
})();
