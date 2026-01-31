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
      { t: 0.00, text: "Hey love…" },
      { t: 3.20, text: "I made this because I wanted you to have something you can keep." },
      { t: 8.00, text: "Something you can listen to and read at the same time." },
      { t: 13.50, text: "…" }
    ]
  },
  poem: {
    title: "Poem",
    subtitle: "A softer, shorter piece.",
    src: "assets/poem.mp3",
cues: [
  { t: 1.010, text: "Lorena," },
  { t: 3.902, text: "I don’t have the right words most of the time," },
  { t: 6.795, text: "but somehow you still make me feel" },
  { t: 12.302, text: "like I’m saying enough." },

  { t: 16.023, text: "You’re beautiful—" },
  { t: 19.009, text: "not just in the way you look," },
  { t: 23.534, text: "but in the way you talk to me" },
  { t: 26.440, text: "like I actually matter," },
  { t: 29.345, text: "like I’m worth your time" },
  { t: 29.345, text: "even from so far away." },

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
  { t: 110.480, text: "and for being the reason" },
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

const el = (id) => document.getElementById(id);

const gate = el("gate");
const app = el("app");
const gateForm = el("gateForm");
const gateHint = el("gateHint");
const passwordInput = el("password");

const btnLetter = el("btnLetter");
const btnPoem = el("btnPoem");
const pillLetter = el("pillLetter");
const pillPoem = el("pillPoem");

const modeLive = el("modeLive");
const modeFull = el("modeFull");

const trackTitle = el("trackTitle");
const trackSub = el("trackSub");
const miniStatus = el("miniStatus");

const audio = el("audio");
const playBtn = el("playBtn");
const playIcon = el("playIcon");
const seek = el("seek");
const vol = el("vol");
const rateBtn = el("rateBtn");

const lyrics = el("lyrics");

const curTime = el("curTime");
const durTime = el("durTime");

const rewindBtn = el("rewind");
const forwardBtn = el("forward");
const lockBtn = el("lockBtn");

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
  audio.src = tr.src;
  audio.currentTime = 0;

  setPlayIcon(false);
  miniStatus.textContent = "Ready";
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
  renderText();
}

function setRate(){
  const rates = [1.0, 1.15, 1.25, 1.4];
  const cur = audio.playbackRate || 1.0;
  const idx = rates.indexOf(cur);
  const next = rates[(idx + 1) % rates.length];
  audio.playbackRate = next;
  rateBtn.textContent = `${next.toFixed(2).replace(/\.00$/,".0")}×`;
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
    arr.forEach((c) => {
      const div = document.createElement("div");
      div.className = "line";
      div.innerHTML = `<span class="t">${fmtTime(c.t)}</span>${escapeHtml(c.text)}`;
      div.addEventListener("click", () => { audio.currentTime = Math.max(0, c.t + 0.01); });
      lyrics.appendChild(div);
    });
    return;
  }

  arr.forEach((c) => {
    const div = document.createElement("div");
    div.className = "line";
    div.innerHTML = `<span class="t">${fmtTime(c.t)}</span>${escapeHtml(c.text)}`;
    div.addEventListener("click", () => { audio.currentTime = Math.max(0, c.t + 0.01); });
    lyrics.appendChild(div);
  });

  updateActiveLine(true);
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
    if (audio.paused) await audio.play();
    else audio.pause();
  }catch(_e){
    miniStatus.textContent = "Tap once, then press play.";
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
  miniStatus.textContent = "Ready";
});

audio.addEventListener("play", () => {
  setPlayIcon(true);
  miniStatus.textContent = "Playing";
  startRaf();
});

audio.addEventListener("pause", () => {
  setPlayIcon(false);
  miniStatus.textContent = "Paused";
  cancelRaf();
});

audio.addEventListener("ended", () => {
  setPlayIcon(false);
  miniStatus.textContent = "Finished";
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
seek.addEventListener("input", () => {
  if (!isFinite(audio.duration) || audio.duration <= 0) return;
  const p = Number(seek.value) / 1000;
  setSliderFill(seek, p * 100);
  audio.currentTime = p * audio.duration;
});

/* Defaults */
audio.volume = 1;
audio.playbackRate = 1.0;
rateBtn.textContent = "1.0×";
setSliderFill(vol, 100);
setSliderFill(seek, 0);

/* Mobile priming */
document.addEventListener("pointerdown", () => {}, { once:true });

