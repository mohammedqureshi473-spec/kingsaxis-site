import fs from "node:fs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const failures = [];

function fail(label, detail = "") {
  failures.push(detail ? `${label}: ${detail}` : label);
}

if (!html.includes('id="public-simulation-notice"')) {
  fail("Missing persistent public-simulation notice");
}

const forbidden = [
  ["Source-visible access gate", /DEMO_CODE|KINGS2026|type=["']password["']/i],
  ["Personal Kingsgas/Gmail address", /@(gmail|kingsgas)\.com/i],
  ["Owner personal name", /\b(?:Mohammed|Qureshi)\b/i],
  ["Indian mobile-like value", /(?:^|\D)(?:\+91[- ]?)?[6-9]\d{4}[ -]?\d{5}(?:\D|$)/],
  ["Driving-licence-like value", /\bDL[- ]?MH\d{1,2}[ -]?\d{6,14}\b/i],
  ["RFID-like value", /\bRF-\d{2}-\d{4}\b/],
  ["Credential-like value", /\bKGS-\d{4}-\d{5}\b/],
  ["Maharashtra vehicle-like value", /\bMH[- ]?\d{1,2}[- ]?[A-Z]{1,3}[- ]?\d{3,4}\b/],
  ["Misleading 2FA claim", /2FA enforced/i],
  ["Misleading secure-invitation claim", /secure one-time link/i],
  ["Misleading live-session claim", /sessions? terminated/i],
  ["Misleading confidentiality claim", /PRIVATE DEMO|Unauthorized access prohibited/i]
];

for (const [label, pattern] of forbidden) {
  if (pattern.test(html)) fail(label);
}

const emails = html.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [];
for (const email of emails) {
  if (!email.toLowerCase().endsWith("@example.invalid")) {
    fail("Non-synthetic email", email.replace(/^[^@]+/, "[redacted]"));
  }
}

const blockedBusinessWords = /\b(owner|admin|manager|station|depot|kings|gas|msrtc|driver access|payment|legal|accounts|engineering|project|command|supervisor|staff|user|vendor|operator|employee|retrofitter|auditor|viewer|fuel|logistics|finance|it|hr|shift|route|trip|report|invoice|document|approval|access|control|centre|center|network|vehicle|bus|device|work|team|system|overview|dashboard|schedule|maintenance|quality|security|role|scope|activity|support|executive|operations|conversion|purchase|order|delivery|testing|status|risk|issue|claim|supplier|authority|terminal|warehouse)\b/i;
const personLike = /^(?:[A-Z]\.?|[A-Z][a-z'’-]+)(?:\s+(?:[A-Z]\.?|[A-Z][a-z'’-]+)){1,3}$/;

for (const pattern of [
  /\buser\s*:\s*['"]([^'"]+)['"]/g,
  /\bdriver\s*:\s*['"]([^'"]+)['"]/g,
  /\bname\s*:\s*['"]([^'"]+)['"]/g
]) {
  for (const match of html.matchAll(pattern)) {
    const value = match[1].trim();
    if (
      value.length <= 45 &&
      !value.startsWith("Demo ") &&
      !blockedBusinessWords.test(value) &&
      personLike.test(value)
    ) {
      fail("Person-like value is not explicitly synthetic", value);
    }
  }
}

if (failures.length) {
  console.error("Public demo safety check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Public demo safety check passed: persistent notice present; ${emails.length} email values are synthetic; no forbidden realistic identifiers or operational-security claims found.`
);
