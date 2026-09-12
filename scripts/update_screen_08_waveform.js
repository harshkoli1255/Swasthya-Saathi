#!/usr/bin/env node
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const FILE_ID = "f956ad9a-5b0e-4f2b-a0ac-cd5669de5012";
const SCREEN_ID = "fee35294-6fe9-42ce-9672-39e7c09b151b"; // 08 Voice Recording Listening
const IMG_DIR = path.join(__dirname, "../design/patient_mobile_app/images");
const ARTIFACT_DIR = "/Users/harshkoli/.gemini/antigravity-ide/brain/60d07897-c7fb-4336-a16b-a06bf9922049";

const jsx = `<!-- screenType: "mobile_android" width: "360" height: "780" -->
<div className="bg-[#FFFDFB] text-[#0F172A] w-full min-h-[780px] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] antialiased">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap');
  </style>

  {/* Status Bar */}
  <div className="px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-bold text-[#64748B]">
    <span>09:42</span>
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-extrabold text-[#475569]">5G</span>
      <div className="w-5 h-2.5 rounded-[4px] border border-[#64748B] p-[1.5px] flex items-center"><div className="w-full h-full bg-[#475569] rounded-[2px]"></div></div>
    </div>
  </div>

  {/* Listening Active Header with Live Pulsing Dot */}
  <header className="px-6 py-3 border-b border-[#F1E5DC] bg-[#FFFBF8] flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-ping"></span>
      <span className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">Listening • 00:14</span>
    </div>
    <button className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A]">Cancel</button>
  </header>

  {/* Active Speech Surface */}
  <main className="px-6 py-6 flex-1 flex flex-col justify-between space-y-6">
    <div className="space-y-1">
      <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wide">Chief Complaint • Question 1 of 4</span>
      <h2 className="text-lg font-extrabold text-[#0F172A]">What health trouble brings you here today?</h2>
    </div>

    {/* Dynamic Glowing Soundwave Visualizer (21 Static Harmonic Wave Bars) */}
    <div className="flex items-center justify-center gap-1.5 h-20 py-2">
      <div className="w-1.5 h-4 rounded-full bg-[#EA580C]/40"></div>
      <div className="w-1.5 h-7 rounded-full bg-[#EA580C]/60"></div>
      <div className="w-1.5 h-12 rounded-full bg-[#EA580C]/80"></div>
      <div className="w-1.5 h-6 rounded-full bg-[#EA580C]/70"></div>
      <div className="w-1.5 h-14 rounded-full bg-[#EA580C]"></div>
      <div className="w-1.5 h-9 rounded-full bg-[#EA580C]/80"></div>
      <div className="w-1.5 h-16 rounded-full bg-[#EA580C] shadow-[0_0_12px_rgba(234,88,12,0.5)]"></div>
      <div className="w-1.5 h-11 rounded-full bg-[#EA580C]"></div>
      <div className="w-1.5 h-7 rounded-full bg-[#EA580C]/80"></div>
      <div className="w-1.5 h-16 rounded-full bg-[#EA580C] shadow-[0_0_12px_rgba(234,88,12,0.5)]"></div>
      <div className="w-1.5 h-10 rounded-full bg-[#EA580C]"></div>
      <div className="w-1.5 h-14 rounded-full bg-[#EA580C]"></div>
      <div className="w-1.5 h-8 rounded-full bg-[#EA580C]/80"></div>
      <div className="w-1.5 h-15 rounded-full bg-[#EA580C]"></div>
      <div className="w-1.5 h-9 rounded-full bg-[#EA580C]/80"></div>
      <div className="w-1.5 h-12 rounded-full bg-[#EA580C]/80"></div>
      <div className="w-1.5 h-6 rounded-full bg-[#EA580C]/70"></div>
      <div className="w-1.5 h-13 rounded-full bg-[#EA580C]"></div>
      <div className="w-1.5 h-8 rounded-full bg-[#EA580C]/70"></div>
      <div className="w-1.5 h-10 rounded-full bg-[#EA580C]/60"></div>
      <div className="w-1.5 h-5 rounded-full bg-[#EA580C]/40"></div>
    </div>

    {/* Live Transcribed Stream Bubble */}
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
      Speak naturally. Tap below when you finish explaining.
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
    <div className="w-28 h-1 bg-slate-300 rounded-full mx-auto" />
  </footer>
</div>`;

console.log("Updating Screen 08 in Flowstep...");
execFileSync("node", ["scripts/flowstep_call.js", "edit-design", JSON.stringify({
  fileId: FILE_ID,
  screenId: SCREEN_ID,
  prompt: "Update waveform with static harmonic sound bars in orange",
  jsxContent: jsx
})], { encoding: "utf8" });

console.log("Re-rendering Screen 08 image...");
const imgRes = execFileSync("node", ["scripts/flowstep_call.js", "get-screen-image", JSON.stringify({
  fileId: FILE_ID,
  screenId: SCREEN_ID
})], { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });

const imgParsed = JSON.parse(imgRes);
const content = imgParsed.result.content[0];
if (content.type === "image") {
  const buf = Buffer.from(content.data, "base64");
  fs.writeFileSync(path.join(IMG_DIR, "08_voice_interview_recording_state.png"), buf);
  fs.writeFileSync(path.join(ARTIFACT_DIR, "08_voice_interview_recording_state.png"), buf);
  console.log(`✓ Updated & Saved: 08_voice_interview_recording_state.png (${buf.length} bytes)`);
} else {
  console.error("Failed to re-render screen 08:", content.text);
}
