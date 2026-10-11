/* ==========================================================================
   store.js — all data lives here, saved in the browser (localStorage).
   Data shape:
   {
     version: 1,
     lang: "en" | "ur",
     committees: [
       {
         id, name, amount, membersCount, startMonth, dueDay, createdAt,
         members: [ { id, name, whatsapp, receivedTurn, receivedMonth } ],
         payments: { "2026-10": { "<memberId>": true } },
         draws:    [ { memberId, name, month, turnNumber, date } ]
       }
     ]
   }
   ========================================================================== */

const STORAGE_KEY = "committee-manager-v1";

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function emptyDB() {
  return { version: 1, lang: "en", committees: [] };
}

let DB = emptyDB();

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.committees)) {
        DB = parsed;
        DB.committees.forEach(function (c) {
          c.members = c.members || [];
          c.payments = c.payments || {};
          c.draws = c.draws || [];
        });
      }
    }
  } catch (e) {
    console.warn("Could not read saved data:", e);
    DB = emptyDB();
  }
  return DB;
}

function saveDB() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DB));
  } catch (e) {
    alert("Storage full or unavailable: " + e.message);
  }
}

/* ---------------------------------- lang --------------------------------- */
function getSavedLang() { return DB.lang || "en"; }
function saveLang(lang) { DB.lang = lang; saveDB(); }

/* ------------------------------- committees ------------------------------ */
function getCommittees() { return DB.committees; }

function getCommittee(id) {
  return DB.committees.find(function (c) { return c.id === id; }) || null;
}

function createCommittee(data) {
  const c = {
    id: uid(),
    name: data.name,
    amount: Number(data.amount) || 0,
    membersCount: Number(data.membersCount) || 0,
    startMonth: data.startMonth || currentMonthKey(),
    dueDay: Number(data.dueDay) || 1,
    createdAt: new Date().toISOString(),
    members: [],
    payments: {},
    draws: [],
  };
  DB.committees.push(c);
  saveDB();
  return c;
}

function updateCommittee(id, data) {
  const c = getCommittee(id);
  if (!c) return null;
  c.name = data.name;
  c.amount = Number(data.amount) || 0;
  c.membersCount = Number(data.membersCount) || 0;
  c.startMonth = data.startMonth || c.startMonth;
  c.dueDay = Number(data.dueDay) || c.dueDay;
  saveDB();
  return c;
}

function deleteCommittee(id) {
  DB.committees = DB.committees.filter(function (c) { return c.id !== id; });
  saveDB();
}

/* --------------------------------- members ------------------------------- */
function addMember(committeeId, data) {
  const c = getCommittee(committeeId);
  if (!c) return null;
  const m = {
    id: uid(),
    name: (data.name || "").trim(),
    whatsapp: normalizePhone(data.whatsapp),
    receivedTurn: null,
    receivedMonth: null,
  };
  c.members.push(m);
  saveDB();
  return m;
}

function removeMember(committeeId, memberId) {
  const c = getCommittee(committeeId);
  if (!c) return;
  c.members = c.members.filter(function (m) { return m.id !== memberId; });
  // also drop this member's payment flags and draws so nothing is left dangling
  Object.keys(c.payments).forEach(function (mk) {
    if (c.payments[mk]) delete c.payments[mk][memberId];
  });
  c.draws = c.draws.filter(function (d) { return d.memberId !== memberId; });
  saveDB();
}

// Turn "0300 1234567" or "+92 300 1234567" into a wa.me friendly "923001234567"
function normalizePhone(raw) {
  let p = String(raw || "").replace(/[^0-9]/g, "");
  if (p.indexOf("00") === 0) p = p.slice(2);
  if (p.indexOf("0") === 0) p = "92" + p.slice(1); // local PK number -> +92
  if (p.length === 10 && p.indexOf("3") === 0) p = "92" + p; // 3001234567 -> 923001234567
  return p;
}

/* -------------------------------- payments ------------------------------- */
function getPayments(committeeId, month) {
  const c = getCommittee(committeeId);
  if (!c) return {};
  return c.payments[month] || {};
}

function isPaid(committeeId, month, memberId) {
  return !!getPayments(committeeId, month)[memberId];
}

function setPaid(committeeId, month, memberId, paid) {
  const c = getCommittee(committeeId);
  if (!c) return;
  c.payments[month] = c.payments[month] || {};
  if (paid) c.payments[month][memberId] = true;
  else delete c.payments[month][memberId];
  saveDB();
}

/* ---------------------------------- draws -------------------------------- */
function getDraws(committeeId) {
  const c = getCommittee(committeeId);
  return c ? c.draws : [];
}

function membersNotReceived(committeeId) {
  const c = getCommittee(committeeId);
  if (!c) return [];
  return c.members.filter(function (m) { return m.receivedTurn == null; });
}

function getTurnForMonth(committeeId, month) {
  const draws = getDraws(committeeId);
  return draws.find(function (d) { return d.month === month; }) || null;
}

// Picks a random member who has NOT received the committee yet and locks it in.
// Returns { done: true } | { locked: true, draw } | { member, turnNumber, draw }
function drawNextTurn(committeeId, month) {
  const c = getCommittee(committeeId);
  if (!c) return { error: "no-committee" };

  const monthDraw = getTurnForMonth(committeeId, month);
  if (monthDraw) return { locked: true, draw: monthDraw };

  const pool = membersNotReceived(committeeId);
  if (pool.length === 0) return { done: true };
  if (c.members.length < 2) return { error: "few-members" };

  const picked = pool[Math.floor(Math.random() * pool.length)];
  const turnNumber = c.draws.length + 1;

  picked.receivedTurn = turnNumber;
  picked.receivedMonth = month;

  const draw = {
    memberId: picked.id,
    name: picked.name,
    month: month,
    turnNumber: turnNumber,
    date: new Date().toISOString(),
  };
  c.draws.push(draw);
  saveDB();
  return { member: picked, turnNumber: turnNumber, draw: draw };
}

/* ------------------------------ export / import -------------------------- */
function exportData() {
  return JSON.stringify(DB, null, 2);
}

function importData(jsonText) {
  const parsed = JSON.parse(jsonText);
  if (!parsed || !Array.isArray(parsed.committees)) {
    throw new Error("Invalid backup file");
  }
  DB = parsed;
  DB.committees.forEach(function (c) {
    c.members = c.members || [];
    c.payments = c.payments || {};
    c.draws = c.draws || [];
  });
  saveDB();
  return DB;
}
