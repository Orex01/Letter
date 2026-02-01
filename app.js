/* ==========
   CONFIG
   ========== */

// Client-side gate (fine for a romantic surprise; not real security).
const SITE_PASSWORD = "iloveyou"; // <-- change this

const TRACKS = {
  letter: {
    title: "Letter",
    subtitle: "Press play — the text will follow.",
    src: "assets/letter.mp3",
    cues: [
      { t: 0.87, text: "My dear Lorena," },

      { t: 3.58, text: "I’ve been thinking a lot about you while writing this." },
      { t: 9.01, text: "About everything you are," },
      { t: 11.72, text: "everything you’ve been through," },
      { t: 14.44, text: "and everything you’re still becoming." },

      { t: 17.41, text: "And I want you to know something first, before anything else:" },
      { t: 22.8, text: "I am so proud of you." },

      { t: 30.95, text: "I know there were times when life felt unbearable." },
      { t: 36.34, text: "Times when your mind told you things that weren’t true." },
      { t: 41.51, text: "Times when getting through the day felt like a battle." },
      { t: 48.34, text: "Times when you felt tired of fighting" },
      { t: 51.06, text: "and didn’t know how much strength you had left." },

      { t: 56.5, text: "But you’re still here." },
      { t: 59.42, text: "And that matters more than I can ever put into words." },

      { t: 65.24, text: "You chose to keep going, even when it was hard." },
      { t: 68.09, text: "You chose to stay, even when it hurt." },
      { t: 75.61, text: "You chose life, even when it didn’t feel easy." },

      { t: 82.42, text: "That takes courage." },
      { t: 85.08, text: "That takes strength." },
      { t: 88.58, text: "That takes a heart that refuses to give up," },
      { t: 94.02, text: "even when it’s exhausted." },

      { t: 97.59, text: "And that’s you." },

      { t: 100.3, text: "I know some days are still heavy." },
      { t: 104.58, text: "I know sometimes your thoughts can be cruel to you." },
      { t: 109.02, text: "I know there are moments when you doubt yourself," },
      { t: 112.66, text: "when you feel weak," },
      { t: 116.02, text: "when you feel like you’re not enough." },

      { t: 122.66, text: "But please listen to me when I say this:" },

      { t: 125.3, text: "You are stronger than those thoughts." },
      { t: 129.67, text: "You are bigger than that pain." },
      { t: 135.34, text: "You are worth fighting for." },
      { t: 138.32, text: "Every single day." },

      { t: 141.15, text: "Your life is precious." },
      { t: 143.69, text: "Your smile is precious." },
      { t: 146.24, text: "Your dreams are precious." },
      { t: 149.07, text: "You are precious to me." },

      { t: 155.09, text: "There is nothing in this world that could replace you." },
      { t: 158.63, text: "No one else could be you." },
      { t: 162.64, text: "No one else could mean to me what you mean." },
      { t: 165.51, text: "My life is better because you are in it." },
      { t: 168.38, text: "My future is brighter because you are in it." },

      { t: 172.33, text: "And I need you here." },
      { t: 175.2, text: "I want you here." },
      { t: 178.07, text: "This world needs you here." },

      { t: 184.49, text: "You don’t have to be strong alone." },
      { t: 187.59, text: "You don’t have to carry everything by yourself." },

      { t: 192.59, text: "On the days when you feel tired, I’ll be strong for you." },
      { t: 198.37, text: "On the days when you feel lost, I’ll remind you who you are." },
      { t: 204.24, text: "On the days when you forget your worth," },
      { t: 206.85, text: "I’ll never forget it for you." },

      { t: 213.15, text: "You are not a burden." },
      { t: 215.93, text: "You are not weak." },
      { t: 218.77, text: "You are not broken." },

      { t: 221.68, text: "You are brave." },
      { t: 224.21, text: "You are kind." },
      { t: 227.53, text: "You are loved." },
      { t: 229.56, text: "You are enough." },

      { t: 231.84, text: "Every time you choose to keep going, you are winning." },
      { t: 235.25, text: "Every time you get up after a hard day, you are winning." },
      { t: 240.72, text: "Every time you stay, even when it’s difficult, you are winning." },

      { t: 247.23, text: "And I will always be here cheering for you." },

      { t: 252.36, text: "No matter what happens," },
      { t: 255.33, text: "no matter how dark things feel sometimes," },
      { t: 258.23, text: "please remember: you are never alone." },
      { t: 262.23, text: "You have me. You always will." },
      { t: 266.07, text: "My heart is with you, every step of the way." },

      { t: 271.18, text: "Thank you for staying." },
      { t: 274.03, text: "Thank you for fighting." },
      { t: 276.87, text: "Thank you for being here." },
      { t: 279.11, text: "Thank you for being you." },

      { t: 284.29, text: "I love you more than you know." },
      { t: 287.86, text: "And I’m so proud to walk through life with you." },

      { t: 292.56, text: "Always yours," },
      { t: 295.31, text: "[Your Name]" }
    ]
  },

  poem: {
    title: "Poem",
    subtitle: "A softer, shorter piece.",
    src: "assets/poem.mp3",
    cues: [
      { t: 1.01, text: "Lorena," },
      { t: 3.902, text: "I don’t have the right words most of the time," },
      { t: 6.795, text: "but somehow you still make me feel" },
      { t: 12.302, text: "like I’m saying enough." },

      { t: 16.023, text: "You’re beautiful—" },
      { t: 19.009, text: "not just in the way you look," },
      { t: 23.534, text: "but in the way you talk to me" },
      { t: 26.44, text: "like I actually matter," },
      { t: 29.345, text: "like I’m worth your time even from so far away." },

      { t: 32.251, text: "You’re strong too," },
      { t: 35.049, text: "not in that fake “I’m fine” way" },
      { t: 37.997, text: "people put on for the world," },
      { t: 40.946, text: "but in the way you’re still here" },
      { t: 43.894, text: "even when your mind turns against you," },
      { t: 50.409, text: "in the way you get through heavy days" },
      { t: 53.141, text: "and still somehow manage" },
      { t: 55.874, text: "to be gentle with me." },

      { t: 59.391, text: "I love the way you treat me," },
      { t: 62.311, text: "the way you listen," },
      { t: 65.228, text: "the way you turn a normal moment" },
      { t: 69.553, text: "into something I remember later" },
      { t: 72.563, text: "when I’m trying to sleep." },

      { t: 75.634, text: "Yeah, we joke around," },
      { t: 79.184, text: "mess around in games and calls," },
      { t: 82.021, text: "but underneath all of that" },
      { t: 86.766, text: "I’m honestly just really grateful" },
      { t: 90.776, text: "that out of everyone in this world," },
      { t: 93.391, text: "I get you on the other side of the screen." },

      { t: 97.418, text: "Thank you" },
      { t: 100.336, text: "for being this amazing person," },
      { t: 103.039, text: "for making distance feel a little less brutal," },
      { t: 110.48, text: "and for being the reason" },
      { t: 113.581, text: "I look forward to tomorrow" },
      { t: 116.216, text: "more than I did yesterday." }
    ]
  }
};

/* ==========
   STATE
   ========== */

let currentKey = "letter";
let textMode = "live"; // "live" | "full"
let activeIndex = -1;
let rafId = null;
let isSeeking = false;
let isLoadingTrack = false;

const el = (id) => document.getElementById(id);

/* Safe element getter (prevents null crashes) */
function mustEl(id){
  const node = el(id);
  if (!node) throw new Error(`Missing element with id="${id}"`);
  return node;
}

/* If you prefer: replace mustEl() with el() and null-check each listener */
const gate = mustEl("gate");
const app = mustEl("app");
const gateForm = mustEl("gateForm");
const gateHint = mustEl("gateHint");
const passwordInput = mustEl("password");

const btnLetter = mustEl("btnLetter");
const btnPoem = mustEl("btnPoem");
const pillLetter = mustEl("pillLetter");
const pillPoem = mustEl("pillPoem");

const modeLive = mustEl("modeLive");
const modeFull = mustEl("modeFull");

const trackTitle = mustEl("trackTitle");
const trackSub = mustEl("trackSub");
const miniStatus = mustEl("miniStatus");

const audio = mustEl("audio");
const playBtn = mustEl("playBtn");
const playIcon = mustEl("playIcon");
const seek = mustEl("seek");
const vol = mustEl("vol");
const rateBtn = mustEl("rateBtn");

const lyrics = mustEl("lyrics");

const curTime = mustEl("curTime");
const durTime = mustEl("durTime");

const rewindBtn = mustEl("rewind");
const forwardBtn = mustEl("forward");
const lockBtn = mustEl("lockBtn");

/* ==========
   HELPERS
   ========== */

function fmtTime(s){
  if (!isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${String(r).padStart(2,"0")}`;
}

function escapeHtml(str){
  // If you need older browser support, replace replaceAll with split/join.
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function getCues(){
  return TRACKS[currentKey].cues.slice().sort((a,b)=>a.t-b.t);
}

function setSliderFill(rangeEl, percent0to100){
  const p = Math.max(0, Math.min(100, percent0to100));
  rangeEl.style.setProperty("--p", `${p}%`);
}

function setPlayIcon(playing){
  playIcon.textContent = playing ? "❚❚" : "▶";
}

function setStatus(msg){
  miniStatus.textContent = msg;
}

function setTrackPills(){
  const letterActive = currentKey === "letter";
  btnLetter.classList.toggle("active", letterActive);
  btnPoem.classList.toggle("active", !letterActive);

  pillLetter.textContent = letterActive ? "Selected" : "Tap";
  pillPoem.textContent = !letterActive ? "Selected" : "Tap";

  pillLetter.classList.toggle("ghost", !letterActive);
  pillPoem.classList.toggle("ghost", letterActive);
}

function setTrack(key){
  currentKey = key;
  setTrackPills();

  const tr = TRACKS[currentKey];
  trackTitle.textContent = tr.title;
  trackSub.textContent = tr.subtitle;

  activeIndex = -1;

  audio.pause();
  cancelRaf();
  isLoadingTrack = true;
  setPlayIcon(false);
  setStatus("Loading…");

  // Reset display state before loading the new media.
  audio.src = tr.src;
  audio.load();
  audio.currentTime = 0;

  curTime.textContent = "0:00";
  durTime.textContent = "0:00";

  seek.value = "0";
  setSliderFill(seek, 0);

  renderText();
}

function setTextMode(mode){
  textMode = mode;
  modeLive.classList.toggle("active", mode === "live");
  modeFull.classList.toggle("active", mode === "full");
  modeLive.setAttribute("aria-selected", mode === "live" ? "true" : "false");
  modeFull.setAttribute("aria-selected", mode === "full" ? "true" : "false");

  // Let CSS adapt visuals (timestamps, cursor, spacing, etc.)
  lyrics.classList.toggle("fullMode", mode === "full");
  renderText();
}

function setRate(){
  const rates = [1.0, 1.15, 1.25, 1.4];
  const cur = audio.playbackRate || 1.0;

  // Robust float compare (indexOf can fail on floats in some cases)
  let idx = rates.findIndex(r => Math.abs(r - cur) < 1e-9);
  if (idx < 0) idx = 0;

  const next = rates[(idx + 1) % rates.length];
  audio.playbackRate = next;

  // 1.40 -> 1.4, 1.00 -> 1.0
  const label = next.toFixed(2).replace(/0+$/,"").replace(/\.$/,"");
  rateBtn.textContent = `${label}×`;
}

function cueIndexForTime(t, arr){
  let lo = 0, hi = arr.length - 1;
  if (hi < 0) return -1;
  if (t < arr[0].t) return -1;
  if (t >= arr[hi].t) return hi;

  while (lo <= hi){
    const mid = (lo + hi) >> 1;
    const a = arr[mid].t;
    const b = (mid + 1 <= arr.length - 1) ? arr[mid + 1].t : Infinity;
    if (t >= a && t < b) return mid;
    if (t < a) hi = mid - 1;
    else lo = mid + 1;
  }
  return -1;
}

function updateActiveLine(forceScroll=false){
  if (textMode !== "live") return;

  const arr = getCues();
  const idx = cueIndexForTime(audio.currentTime, arr);

  if (idx === activeIndex && !forceScroll) return;
  activeIndex = idx;

  const nodes = lyrics.querySelectorAll(".line");
  nodes.forEach(n => n.classList.remove("active","next"));

  if (idx >= 0 && nodes[idx]){
    nodes[idx].classList.add("active");
    if (nodes[idx + 1]) nodes[idx + 1].classList.add("next");

    const container = lyrics;
    const target = nodes[idx];
    const cRect = container.getBoundingClientRect();
    const tRect = target.getBoundingClientRect();
    const offset = (tRect.top - cRect.top) - (cRect.height * 0.35);
    container.scrollTop += offset;
  }
}

function renderText(){
  const arr = getCues();
  lyrics.innerHTML = "";

  if (textMode === "full"){
    // Render a clean, readable version (no timestamps, no seeking-on-tap).
    // We still keep each cue as its own block for simplicity.
    arr.forEach((c) => {
      const div = document.createElement("div");
      div.className = "line";
      div.textContent = c.text;
      lyrics.appendChild(div);
    });
  } else {
    // Live mode: timestamps + tap-to-seek + active highlight.
    arr.forEach((c) => {
      const div = document.createElement("div");
      div.className = "line";
      div.innerHTML = `<span class="t">${fmtTime(c.t)}</span>${escapeHtml(c.text)}`;
      div.addEventListener("click", () => {
        audio.currentTime = Math.max(0, c.t + 0.01);
      });
      lyrics.appendChild(div);
    });
  }

  if (textMode === "live") updateActiveLine(true);
}

function startRaf(){
  cancelRaf();
  const tick = () => {
    updateActiveLine(false);
    rafId = requestAnimationFrame(tick);
  };
  rafId = requestAnimationFrame(tick);
}

function cancelRaf(){
  if (rafId) cancelAnimationFrame(rafId);
  rafId = null;
}

/* ==========
   PASSWORD GATE
   ========== */

function unlock(){
  gate.classList.add("hidden");
  app.classList.remove("hidden");
  setTrack("letter");
}

gateForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const pw = passwordInput.value.trim();
  if (pw === SITE_PASSWORD){
    gateHint.textContent = "";
    unlock();
  } else {
    gateHint.textContent = "Not quite — try again.";
    passwordInput.focus();
    passwordInput.select();
  }
});

/* ==========
   EVENTS
   ========== */

btnLetter.addEventListener("click", () => setTrack("letter"));
btnPoem.addEventListener("click", () => setTrack("poem"));

modeLive.addEventListener("click", () => setTextMode("live"));
modeFull.addEventListener("click", () => setTextMode("full"));

lockBtn.addEventListener("click", () => {
  audio.pause();
  cancelRaf();
  app.classList.add("hidden");
  gate.classList.remove("hidden");
  passwordInput.value = "";
  gateHint.textContent = "";
  passwordInput.focus();
});

/* ==========
   PLAYER
   ========== */

playBtn.addEventListener("click", async () => {
  try{
    // If the browser hasn't finished loading metadata yet, try anyway.
    if (isLoadingTrack) setStatus("Loading…");

    if (audio.paused) await audio.play();
    else audio.pause();
  }catch{
    setStatus("Tap once, then press play.");
  }
});

rewindBtn.addEventListener("click", () => {
  audio.currentTime = Math.max(0, audio.currentTime - 10);
});

forwardBtn.addEventListener("click", () => {
  audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + 10);
});

vol.addEventListener("input", () => {
  audio.volume = Number(vol.value);
  setSliderFill(vol, audio.volume * 100);
});

rateBtn.addEventListener("click", () => setRate());

audio.addEventListener("loadedmetadata", () => {
  durTime.textContent = fmtTime(audio.duration);
  isLoadingTrack = false;
  setStatus("Ready");
});

audio.addEventListener("canplay", () => {
  // This fires earlier than loadedmetadata in some browsers; keep it resilient.
  isLoadingTrack = false;
  if (audio.paused) setStatus("Ready");
});

audio.addEventListener("error", () => {
  isLoadingTrack = false;
  setPlayIcon(false);
  cancelRaf();
  // This usually means a bad path / missing mp3.
  setStatus("Audio missing (check assets path)");
});

audio.addEventListener("play", () => {
  setPlayIcon(true);
  setStatus("Playing");
  startRaf();
});

audio.addEventListener("pause", () => {
  setPlayIcon(false);
  setStatus("Paused");
  cancelRaf();
});

audio.addEventListener("ended", () => {
  setPlayIcon(false);
  setStatus("Finished");
  cancelRaf();
});

audio.addEventListener("timeupdate", () => {
  curTime.textContent = fmtTime(audio.currentTime);

  if (!isSeeking && isFinite(audio.duration) && audio.duration > 0){
    const p = audio.currentTime / audio.duration;
    const v = Math.round(p * 1000);
    seek.value = String(v);
    setSliderFill(seek, p * 100);
  }
  if (textMode === "live") updateActiveLine(false);
});

/* Seek interactions */
seek.addEventListener("pointerdown", () => { isSeeking = true; });
seek.addEventListener("pointerup", () => { isSeeking = false; });
seek.addEventListener("pointercancel", () => { isSeeking = false; });
seek.addEventListener("pointerleave", () => { isSeeking = false; });
seek.addEventListener("input", () => {
  if (!isFinite(audio.duration) || audio.duration <= 0) return;
  const p = Number(seek.value) / 1000;
  setSliderFill(seek, p * 100);
  audio.currentTime = p * audio.duration;
});

/* Defaults */
seek.max = "1000";       // IMPORTANT: matches the math used above
seek.min = "0";
seek.value = "0";

audio.volume = 1;
audio.playbackRate = 1.0;
rateBtn.textContent = "1.0×";

setSliderFill(vol, 100);
setSliderFill(seek, 0);

/* Mobile priming */
document.addEventListener("pointerdown", () => {}, { once:true });
