
const SITE_PASSWORD_HASH = "e4ad93ca07acb8d908a3aa41e920ea4f4ef4f26e7f86cf8291c5db289780a5ae";

function rotr(n, x){ return (n >>> x) | (n << (32 - x)); }

function sha256HexFallback(str){
  const bytes = new TextEncoder().encode(str);

  const K = new Uint32Array([
    0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
  ]);

  let H0 = 0x6a09e667, H1 = 0xbb67ae85, H2 = 0x3c6ef372, H3 = 0xa54ff53a;
  let H4 = 0x510e527f, H5 = 0x9b05688c, H6 = 0x1f83d9ab, H7 = 0x5be0cd19;

  // Preprocess (padding)
  const l = bytes.length;
  const bitLenHi = (l / 0x20000000) | 0;          // (l*8) / 2^32
  const bitLenLo = (l << 3) >>> 0;                // (l*8) mod 2^32

  const withOne = new Uint8Array(l + 1);
  withOne.set(bytes);
  withOne[l] = 0x80;

  let paddedLen = withOne.length;
  while ((paddedLen % 64) !== 56) paddedLen++;
  const padded = new Uint8Array(paddedLen + 8);
  padded.set(withOne);

  // Append length (64-bit big-endian)
  padded[paddedLen + 0] = (bitLenHi >>> 24) & 0xff;
  padded[paddedLen + 1] = (bitLenHi >>> 16) & 0xff;
  padded[paddedLen + 2] = (bitLenHi >>> 8) & 0xff;
  padded[paddedLen + 3] = (bitLenHi >>> 0) & 0xff;
  padded[paddedLen + 4] = (bitLenLo >>> 24) & 0xff;
  padded[paddedLen + 5] = (bitLenLo >>> 16) & 0xff;
  padded[paddedLen + 6] = (bitLenLo >>> 8) & 0xff;
  padded[paddedLen + 7] = (bitLenLo >>> 0) & 0xff;

  const w = new Uint32Array(64);

  for (let i = 0; i < padded.length; i += 64){
    // 0..15
    for (let j = 0; j < 16; j++){
      const o = i + (j * 4);
      w[j] = ((padded[o] << 24) | (padded[o+1] << 16) | (padded[o+2] << 8) | (padded[o+3])) >>> 0;
    }
    // 16..63
    for (let j = 16; j < 64; j++){
      const s0 = (rotr(w[j-15],7) ^ rotr(w[j-15],18) ^ (w[j-15] >>> 3)) >>> 0;
      const s1 = (rotr(w[j-2],17) ^ rotr(w[j-2],19) ^ (w[j-2] >>> 10)) >>> 0;
      w[j] = (w[j-16] + s0 + w[j-7] + s1) >>> 0;
    }

    let a = H0, b = H1, c = H2, d = H3, e = H4, f = H5, g = H6, h = H7;

    for (let j = 0; j < 64; j++){
      const S1 = (rotr(e,6) ^ rotr(e,11) ^ rotr(e,25)) >>> 0;
      const ch = ((e & f) ^ (~e & g)) >>> 0;
      const temp1 = (h + S1 + ch + K[j] + w[j]) >>> 0;
      const S0 = (rotr(a,2) ^ rotr(a,13) ^ rotr(a,22)) >>> 0;
      const maj = ((a & b) ^ (a & c) ^ (b & c)) >>> 0;
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    H0 = (H0 + a) >>> 0;
    H1 = (H1 + b) >>> 0;
    H2 = (H2 + c) >>> 0;
    H3 = (H3 + d) >>> 0;
    H4 = (H4 + e) >>> 0;
    H5 = (H5 + f) >>> 0;
    H6 = (H6 + g) >>> 0;
    H7 = (H7 + h) >>> 0;
  }

  const H = [H0,H1,H2,H3,H4,H5,H6,H7];
  return H.map(x => x.toString(16).padStart(8,"0")).join("");
}

async function sha256Hex(str){
  try{
    if (globalThis.crypto?.subtle){
      const buf = new TextEncoder().encode(str);
      const digest = await crypto.subtle.digest("SHA-256", buf);
      return Array.from(new Uint8Array(digest)).map(b=>b.toString(16).padStart(2,"0")).join("");
    }
  }catch(_e){
    // fall back
  }
  return sha256HexFallback(str);
}


/* =========
   DISCORD WEBHOOK (obfuscated)
   =========
   IMPORTANT:
   - This only hides the webhook URL from casual "View Source".
     Anyone who can run your JS can still recover it.
   - For real secrecy, proxy webhook calls through a server/worker.
*/
const DISCORD_WEBHOOK_URL_PLAIN = ""; // optional (debug). Leave empty to use obfuscated blob.
const DISCORD_WEBHOOK_XOR_B64 = "jNnnunSWl/ZsytkihlKOYS2bn0Ee9qat5qC5QPjvzt3LnKf8PpmB7D6bmnnQFtp6ecfFWVDjja/jlp5L59Dj4LzZ8a1sxuKdftSHLN1k3z93n4svBrWdtqOtr0Sv+eHhvcSmuTWUy4lflMxysWOZLiTBvBY63p3TpQ=="; // XOR(urlBytes, keyBytes) then base64
const WEBHOOK_ENABLED = true;

// Internal cache
let _webhookUrlCache = null;

function _hexToBytes(hex){
  const out = new Uint8Array(hex.length / 2);
  for (let i=0;i<out.length;i++) out[i] = parseInt(hex.slice(i*2, i*2+2), 16);
  return out;
}
function _b64ToBytes(b64){
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i=0;i<bin.length;i++) out[i] = bin.charCodeAt(i);
  return out;
}
function _bytesToB64(bytes){
  let bin = "";
  const chunk = 0x8000;
  for (let i=0;i<bytes.length;i+=chunk){
    bin += String.fromCharCode(...bytes.subarray(i, i+chunk));
  }
  return btoa(bin);
}

/** Decode the webhook URL (sync) */
function resolveDiscordWebhookUrl(){
  if (_webhookUrlCache !== null) return _webhookUrlCache;

  if (DISCORD_WEBHOOK_URL_PLAIN && DISCORD_WEBHOOK_URL_PLAIN.startsWith("https://")){
    _webhookUrlCache = DISCORD_WEBHOOK_URL_PLAIN;
    return _webhookUrlCache;
  }

  if (!DISCORD_WEBHOOK_XOR_B64 || DISCORD_WEBHOOK_XOR_B64.includes("PASTE")){
    _webhookUrlCache = "";
    return "";
  }

  try{
    const data = _b64ToBytes(DISCORD_WEBHOOK_XOR_B64);
    const k = _hexToBytes(SITE_PASSWORD_HASH);
    for (let i=0;i<data.length;i++) data[i] = data[i] ^ k[i % k.length];
    _webhookUrlCache = new TextDecoder().decode(data);
    return _webhookUrlCache;
  }catch(_e){
    _webhookUrlCache = "";
    return "";
  }
}

/**
 * Helper: generate a new obfuscated blob in the browser console:
 *   makeWebhookXorB64("https://discord.com/api/webhooks/....")
 * Paste the result into DISCORD_WEBHOOK_XOR_B64 and keep DISCORD_WEBHOOK_URL_PLAIN empty.
 */
function makeWebhookXorB64(url){
  const u = new TextEncoder().encode(String(url));
  const k = _hexToBytes(SITE_PASSWORD_HASH);
  for (let i=0;i<u.length;i++) u[i] = u[i] ^ k[i % k.length];
  return _bytesToB64(u);
}

// Queue/batch to avoid Discord rate limits
const WEBHOOK_FLUSH_INTERVAL_MS = 1500;
const WEBHOOK_MAX_EMBEDS_PER_SEND = 10;

function _randId(len=16){
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  try{
    const a = new Uint8Array(len);
    crypto.getRandomValues(a);
    let s = "";
    for (let i=0;i<len;i++) s += alphabet[a[i] % alphabet.length];
    return s;
  }catch{
    let s="";
    for (let i=0;i<len;i++) s += alphabet[(Math.random()*alphabet.length)|0];
    return s;
  }
}

const SESSION_ID = _randId(12);
const VISITOR_KEY = "visitor_id_v1";
const VISITOR_ID = (() => {
  try{
    const cur = localStorage.getItem(VISITOR_KEY);
    if (cur) return cur;
    const v = _randId(18);
    localStorage.setItem(VISITOR_KEY, v);
    return v;
  }catch{
    return _randId(18);
  }
})();

let _eventSeq = 0;
let _queue = [];
let _flushTimer = null;
let _ipInfoPromise = null;

function _ctx(){
  const n = navigator;
  const c = n.connection || n.mozConnection || n.webkitConnection;
  return {
    iso: new Date().toISOString(),
    local: new Date().toLocaleString(),
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    lang: n.language,
    ua: n.userAgent,
    platform: n.platform,
    referrer: document.referrer || "(none)",
    url: location.href,
    title: document.title || "(no title)",
    screen: `${screen.width}x${screen.height}`,
    viewport: `${innerWidth}x${innerHeight}`,
    online: (typeof n.onLine === "boolean") ? String(n.onLine) : "(unknown)",
    conn: c ? `${c.effectiveType || "?"} down:${c.downlink ?? "?"} rtt:${c.rtt ?? "?"}` : "(unknown)",
    cores: (n.hardwareConcurrency ? String(n.hardwareConcurrency) : "(unknown)"),
    mem: (n.deviceMemory ? String(n.deviceMemory) : "(unknown)"),
    vis: document.visibilityState
  };
}

async function _fetchJson(url, timeoutMs=3500){
  const ctrl = new AbortController();
  const t = setTimeout(()=>ctrl.abort(), timeoutMs);
  try{
    const r = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.json();
  } finally {
    clearTimeout(t);
  }
}

async function getIpInfo(){
  if (_ipInfoPromise) return _ipInfoPromise;
  _ipInfoPromise = (async () => {
    // Try a few services, normalize results
    try{
      const j = await _fetchJson("https://ipwho.is/?fields=success,ip,country,country_code,region,city,timezone,isp,org,asn", 4000);
      if (j && (j.success === true || typeof j.success === "undefined") && j.ip){
        return {
          ip: j.ip,
          country: j.country,
          region: j.region,
          city: j.city,
          tz: j.timezone,
          isp: j.isp || j.org,
          asn: j.asn ? String(j.asn) : ""
        };
      }
    }catch(_e){}

    try{
      const j = await _fetchJson("https://ipapi.co/json/", 4000);
      if (j && (j.ip || j.ip_address)){
        return {
          ip: j.ip || j.ip_address,
          country: j.country_name || j.country,
          region: j.region || j.region_code,
          city: j.city,
          tz: j.timezone,
          isp: j.org || j.asn || "",
          asn: j.asn || ""
        };
      }
    }catch(_e){}

    try{
      const j = await _fetchJson("https://api.ipify.org?format=json", 3500);
      if (j && j.ip) return { ip: j.ip };
    }catch(_e){}

    return { ip: "" };
  })();
  return _ipInfoPromise;
}

function _toField(name, value, inline=false){
  const v = (value == null || value === "") ? "(n/a)" : String(value);
  return { name, value: v.length > 1024 ? (v.slice(0, 1021) + "...") : v, inline };
}

function logEvent(event, details = {}){
  if (!WEBHOOK_ENABLED) return;
    const _wh = resolveDiscordWebhookUrl();
  if (!_wh) return;
  _eventSeq++;
  _queue.push({ event, details, seq: _eventSeq, ts: new Date().toISOString() });

  if (_queue.length >= WEBHOOK_MAX_EMBEDS_PER_SEND){
    _flushNow();
    return;
  }
  if (_flushTimer) return;
  _flushTimer = setTimeout(_flushNow, WEBHOOK_FLUSH_INTERVAL_MS);
}

async function _flushNow(){
  if (_flushTimer){
    clearTimeout(_flushTimer);
    _flushTimer = null;
  }
  if (!_queue.length) return;

  const batch = _queue.splice(0, WEBHOOK_MAX_EMBEDS_PER_SEND);
  const ctx = _ctx();
  const ip = await getIpInfo();
  const webhookUrl = resolveDiscordWebhookUrl();
  if (!webhookUrl) return;


  const embeds = batch.map(item => {
    const d = item.details || {};
    const fields = [
      _toField("Session", SESSION_ID, true),
      _toField("Visitor", VISITOR_ID, true),
      _toField("Seq", `#${item.seq}`, true),
      _toField("Time (ISO)", item.ts, false),
      _toField("Time (Local)", ctx.local, false),
      _toField("IP", ip.ip || "(unavailable)", true),
      _toField("City/Region", [ip.city, ip.region].filter(Boolean).join(", ") || "(n/a)", true),
      _toField("Country", ip.country || "(n/a)", true),
      _toField("ISP/Org", ip.isp || "(n/a)", false),
      _toField("Visibility", ctx.vis, true),
      _toField("Online", ctx.online, true),
      _toField("Connection", ctx.conn, false),
      _toField("URL", ctx.url, false)
    ];

    // Append event-specific details
    for (const [k,v] of Object.entries(d)){
      fields.push(_toField(k, (typeof v === "string") ? v : JSON.stringify(v), false));
    }

    return {
      title: item.event,
      timestamp: item.ts,
      fields
    };
  });

  const payload = {
    username: "Love Letter Logger",
    embeds
  };

  try{
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    });
  }catch(_e){
    // drop if fails (avoid breaking UX)
  }
}

// Capture unexpected errors (helpful diagnostics)
window.addEventListener("error", (e) => {
  logEvent("js_error", { message: e.message, file: e.filename, line: e.lineno, col: e.colno });
});
window.addEventListener("unhandledrejection", (e) => {
  logEvent("promise_rejection", { reason: String(e.reason || "") });
});

// Track tab visibility
document.addEventListener("visibilitychange", () => {
  logEvent("visibility_change", { state: document.visibilityState });
});
 
// Best-effort DevTools detector (not reliable on all devices/browsers)
let _devtoolsOpen = false;
setInterval(() => {
  try{
    if (innerWidth < 700) return; // avoid noisy mobile false-positives
    const threshold = 160;
    const open = (Math.abs(outerWidth - innerWidth) > threshold) || (Math.abs(outerHeight - innerHeight) > threshold);
    if (open && !_devtoolsOpen){
      _devtoolsOpen = true;
      logEvent("devtools_open");
    } else if (!open && _devtoolsOpen){
      _devtoolsOpen = false;
      logEvent("devtools_close");
    }
  }catch(_e){}
}, 2000);

// <-- change this

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
      { t: 295.31, text: "Oren" }
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

/* ==========
   SMOOTH PLAYBACK FIXES
   ========== */

/* Some browsers (notably iOS Safari) can throw when setting currentTime too early
   or can ignore initial load right after un-hiding the container. These helpers
   make playback resilient without requiring the user to toggle tracks. */

let pendingSeekTo = null;
let pendingPlayAfterLoad = false;

let _lastUserGestureAt = 0;
function noteUserGesture(){ _lastUserGestureAt = Date.now(); }

// Capture general gestures (helps with autoplay policies + debugging)
document.addEventListener("pointerdown", noteUserGesture, { passive:true });
document.addEventListener("keydown", noteUserGesture, { passive:true });

function safeSetCurrentTime(t){
  try{
    audio.currentTime = t;
    pendingSeekTo = null;
    return true;
  }catch(_e){
    pendingSeekTo = t;
    return false;
  }
}

async function playWithRecovery(){
  noteUserGesture();

  // Ensure source is set (defensive)
  try{
    if (!audio.src) setTrack(currentKey || "letter");
  }catch(_e){}

  // If nothing is loaded yet, ask the browser to load.
  try{
    if (audio.readyState === 0) audio.load();
  }catch(_e){}

  try{
    await audio.play();
    pendingPlayAfterLoad = false;
    return true;
  }catch(e){
    // Retry once (common transient errors: AbortError when a load is in flight)
    try{
      audio.load();
      await audio.play();
      pendingPlayAfterLoad = false;
      return true;
    }catch(e2){
      const name = (e2 && e2.name) ? e2.name : (e && e.name) ? e.name : "";
      if (name === "NotAllowedError"){
        setStatus("Tap again, then press play (browser policy).");
      } else if (name === "NotSupportedError"){
        setStatus("Audio format/source not supported.");
      } else {
        setStatus("Couldn’t start audio — try again.");
      }
      pendingPlayAfterLoad = false;
      return false;
    }
  }
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
  logEvent("set_track", { track: key });
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
  audio.preload = "auto";
  audio.load();
  safeSetCurrentTime(0);

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

  if (_rateDebounce) clearTimeout(_rateDebounce);
  _rateDebounce = setTimeout(() => logEvent("rate_change", { rate: String(next) }), 300);
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
        logEvent("cue_seek", { track: currentKey, to: fmtTime(c.t), cue: c.text.slice(0, 60) });
        safeSetCurrentTime(Math.max(0, c.t + 0.01));
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
  // Some browsers need a tick after un-hiding before media reliably loads.
  setTimeout(() => { try{ if (audio.readyState === 0) audio.load(); }catch(_e){} }, 50);
  logEvent("unlocked");
}

gateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const pw = passwordInput.value.trim();

  // Log attempt (never send the password itself)
  logEvent("password_attempt", { length: String(pw.length) });

  const ok = (await sha256Hex(pw)) === SITE_PASSWORD_HASH;

  if (ok){
    gateHint.textContent = "";
    logEvent("password_success");
    unlock();
  } else {
    gateHint.textContent = "Not quite — try again.";
    logEvent("password_fail");
    passwordInput.focus();
    passwordInput.select();
  }
});
/* ==========
   EVENTS
   ========== */

btnLetter.addEventListener("click", () => { setTrack("letter"); logEvent("select_track", { track: "letter" }); });
btnPoem.addEventListener("click", () => { setTrack("poem"); logEvent("select_track", { track: "poem" }); });

modeLive.addEventListener("click", () => { setTextMode("live"); logEvent("text_mode", { mode: "live" }); });
modeFull.addEventListener("click", () => { setTextMode("full"); logEvent("text_mode", { mode: "full" }); });

lockBtn.addEventListener("click", () => {
  logEvent("locked", { track: currentKey, at: fmtTime(audio.currentTime) });
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


/* Webhook debounced logs for noisy controls */
let _volDebounce = null;
let _rateDebounce = null;

playBtn.addEventListener("click", async () => {
  noteUserGesture();
  logEvent("play_button", { track: currentKey, paused: String(audio.paused) });

  // If the user presses play while a new track is still initializing,
  // remember the intent and auto-try again on canplay/metadata.
  if (audio.paused && isLoadingTrack){
    pendingPlayAfterLoad = true;
    setStatus("Loading…");
    // Still attempt now (often works), but we also retry on canplay.
  }

  if (audio.paused){
    await playWithRecovery();
  } else {
    audio.pause();
  }
});
rewindBtn.addEventListener("click", () => {
  safeSetCurrentTime(Math.max(0, audio.currentTime - 10));
  logEvent("rewind_10s", { track: currentKey, at: fmtTime(audio.currentTime) });
});

forwardBtn.addEventListener("click", () => {
  safeSetCurrentTime(Math.min(audio.duration || Infinity, audio.currentTime + 10));
  logEvent("forward_10s", { track: currentKey, at: fmtTime(audio.currentTime) });
});

vol.addEventListener("input", () => {
  if (_volDebounce) clearTimeout(_volDebounce);
  _volDebounce = setTimeout(() => logEvent("volume_change", { vol: String(vol.value) }), 600);
  audio.volume = Number(vol.value);
  setSliderFill(vol, audio.volume * 100);
});

rateBtn.addEventListener("click", () => setRate());

audio.addEventListener("loadedmetadata", () => {
  logEvent("track_loaded", { track: currentKey, duration: fmtTime(audio.duration) });
  durTime.textContent = fmtTime(audio.duration);
  isLoadingTrack = false;
  setStatus("Ready");
  if (pendingSeekTo != null) safeSetCurrentTime(pendingSeekTo);
  if (pendingPlayAfterLoad && audio.paused) playWithRecovery();
});

audio.addEventListener("canplay", () => {
  // This fires earlier than loadedmetadata in some browsers; keep it resilient.
  isLoadingTrack = false;
  if (audio.paused) setStatus("Ready");
  if (pendingSeekTo != null) safeSetCurrentTime(pendingSeekTo);
  if (pendingPlayAfterLoad && audio.paused) playWithRecovery();
});

audio.addEventListener("error", () => {
  logEvent("audio_error", { track: currentKey, src: audio.currentSrc || audio.src || "" });
  isLoadingTrack = false;
  setPlayIcon(false);
  cancelRaf();
  // This usually means a bad path / missing mp3.
  setStatus("Audio missing (check assets path)");
});

audio.addEventListener("play", () => {
  logEvent("audio_play", { track: currentKey, at: fmtTime(audio.currentTime), rate: String(audio.playbackRate) });
  setPlayIcon(true);
  setStatus("Playing");
  startRaf();
});

audio.addEventListener("pause", () => {
  logEvent("audio_pause", { track: currentKey, at: fmtTime(audio.currentTime) });
  setPlayIcon(false);
  setStatus("Paused");
  cancelRaf();
});

audio.addEventListener("ended", () => {
  logEvent("audio_end", { track: currentKey });
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
seek.addEventListener("pointerup", () => { isSeeking = false; logEvent("seek", { track: currentKey, to: fmtTime(audio.currentTime) }); });
seek.addEventListener("pointercancel", () => { isSeeking = false; });
seek.addEventListener("pointerleave", () => { isSeeking = false; });
seek.addEventListener("input", () => {
  if (!isFinite(audio.duration) || audio.duration <= 0) return;
  const p = Number(seek.value) / 1000;
  setSliderFill(seek, p * 100);
  safeSetCurrentTime(p * audio.duration);
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

/* Mobile priming (best-effort): unlocks the audio pipeline on the first tap */
document.addEventListener("pointerdown", async () => {
  noteUserGesture();
  try{
    if (!audio.src) return;
    const prevMuted = audio.muted;
    const prevVol = audio.volume;
    audio.muted = true;
    audio.volume = 0;
    await audio.play();
    audio.pause();
    safeSetCurrentTime(0);
    audio.muted = prevMuted;
    audio.volume = prevVol;
    if (audio.paused) setStatus("Ready");
    logEvent("audio_primed");
  }catch(_e){}
}, { once:true, passive:true });


window.addEventListener("DOMContentLoaded", () => {
  logEvent("page_open");
});
