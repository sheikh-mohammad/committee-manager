/* ==========================================================================
   i18n.js — Urdu / English translations and helpers
   Loaded before store.js and app.js
   ========================================================================== */

const I18N = {
  en: {
    appName: "Committee Manager",
    // generic
    back: "Back",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    ok: "OK",
    yes: "Yes",
    no: "No",
    close: "Close",
    // home
    myCommittees: "My Committees",
    newCommittee: "New Committee",
    noCommittees: "No committees yet",
    noCommitteesHint: "Tap the button below to create your first committee.",
    backup: "Backup",
    exportData: "Export backup",
    importData: "Import backup",
    exportDone: "Backup file downloaded",
    importDone: "Backup imported successfully",
    importError: "That file could not be read",
    exportHint: "Save a copy of all your data to a file. Keep it safe.",
    manage: "Manage",
    // committee form
    committeeName: "Committee name",
    committeeNamePh: "e.g. Gulberg Committee",
    monthlyAmount: "Monthly amount (Rs)",
    numberOfMembers: "Number of members",
    startMonth: "Start month",
    dueDay: "Due day each month",
    createCommittee: "Create Committee",
    updateCommittee: "Save Changes",
    nameRequired: "Please enter a name",
    amountRequired: "Please enter a valid amount",
    membersRequired: "Number of members must be at least 2",
    dayRequired: "Due day must be between 1 and 28",
    // committee menu
    monthlyPayments: "Monthly Payments",
    drawNextTurn: "Draw Next Turn",
    manageMembers: "Members",
    shareSummary: "Share Summary",
    editCommittee: "Edit Committee",
    deleteCommittee: "Delete Committee",
    confirmDeleteCommittee: "Delete this committee and all its data? This cannot be undone.",
    committeeDetails: "Committee Details",
    perMonth: "per month",
    members: "members",
    // members
    membersTitle: "Members",
    addMember: "Add Member",
    memberName: "Member name",
    memberNamePh: "e.g. Ayesha Bibi",
    whatsappNumber: "WhatsApp number",
    whatsappHint: "With country code, e.g. 923001234567",
    noMembers: "No members yet",
    noMembersHint: "Add members below.",
    removeMember: "Remove",
    confirmRemoveMember: "Remove this member from the committee?",
    whatsappInvalid: "Enter a valid WhatsApp number",
    memberAdded: "Member added",
    memberRemoved: "Member removed",
    // payments
    paymentsTitle: "Payments",
    paid: "Paid",
    unpaid: "Not paid",
    markPaid: "Paid",
    markUnpaid: "Undo",
    paidCount: "Paid",
    unpaidCount: "Unpaid",
    noMembersForPay: "Add members first to record payments.",
    allPaid: "Everyone has paid this month.",
    month: "Month",
    due: "Due",
    // draw
    drawTitle: "Draw Next Turn",
    drawBtn: "DRAW NEXT TURN",
    drawBtnAgain: "DRAWING...",
    drawingNow: "Drawing...",
    congrats: "Congratulations!",
    turnGoes: "This turn goes to",
    history: "Draw History",
    turnNo: "Turn",
    allReceived: "All members have received the committee. Well done!",
    notEnoughMembers: "Add at least 2 members before drawing.",
    nextTurnLocked: "The next turn has already been drawn and is locked.",
    drawLockedHint: "This result is saved and can never be redrawn.",
    received: "Received",
    // reminders
    remind: "Remind",
    waReminder: "Assalam o Alaikum {name}, committee ki qist {amount} {dueDate} tak. Shukriya!",
    // share
    shareTitle: "Share Summary",
    shareIntro: "Send this month's summary to your family WhatsApp group.",
    shareWhatsapp: "Share on WhatsApp",
    copyText: "Copy text",
    copied: "Copied to clipboard",
    summaryFor: "Summary",
    // status
    saved: "Saved",
    deleted: "Deleted",
    turnReceivedOn: "Turn taken",
    noTurnYet: "Turn not taken",
    // install
    year: "Year",
  },

  ur: {
    appName: "کمیٹی مینیجر",
    back: "واپس",
    save: "محفوظ کریں",
    cancel: "منسوخ",
    delete: "حذف کریں",
    edit: "تبدیلی",
    add: "شامل کریں",
    ok: "ٹھیک ہے",
    yes: "ہاں",
    no: "نہیں",
    close: "بند کریں",
    myCommittees: "میری کمیٹیاں",
    newCommittee: "نئی کمیٹی",
    noCommittees: "ابھی کوئی کمیٹی نہیں",
    noCommitteesHint: "پہلی کمیٹی بنانے کے لیے نیچے والا بٹن دبائیں۔",
    backup: "بیک اپ",
    exportData: "بیک اپ محفوظ کریں",
    importData: "بیک اپ واپس لائیں",
    exportDone: "بیک اپ فائل ڈاؤن لوڈ ہوگئی",
    importDone: "بیک اپ کامیابی سے واپس آ گیا",
    importError: "یہ فائل پڑھی نہیں جا سکی",
    exportHint: "اپنے تمام ڈیٹا کی ایک کاپی فائل میں محفوظ کریں۔ اسے سنبھال کر رکھیں۔",
    manage: "انتظام",
    committeeName: "کمیٹی کا نام",
    committeeNamePh: "مثلاً گلبرگ کمیٹی",
    monthlyAmount: "ماہانہ رقم (روپے)",
    numberOfMembers: "ممبروں کی تعداد",
    startMonth: "شروع ہونے کا مہینہ",
    dueDay: "ہر مہینے تاریخ",
    createCommittee: "کمیٹی بنائیں",
    updateCommittee: "تبدیلیاں محفوظ کریں",
    nameRequired: "براہِ کرم نام لکھیں",
    amountRequired: "براہِ کرم صحیح رقم لکھیں",
    membersRequired: "ممبروں کی تعداد کم از کم ۲ ہونی چاہیے",
    dayRequired: "تاریخ ۱ سے ۲۸ کے درمیان ہونی چاہیے",
    monthlyPayments: "ماہانہ قسطیں",
    drawNextTurn: "اگلی باری نکالیں",
    manageMembers: "ممبران",
    shareSummary: "خلاصہ شیئر کریں",
    editCommittee: "کمیٹی میں تبدیلی",
    deleteCommittee: "کمیٹی حذف کریں",
    confirmDeleteCommittee: "یہ کمیٹی اور اس کا سارا ڈیٹا حذف کریں؟ یہ واپس نہیں آئے گا۔",
    committeeDetails: "کمیٹی کی تفصیل",
    perMonth: "فی مہینہ",
    members: "ممبران",
    membersTitle: "ممبران",
    addMember: "ممبر شامل کریں",
    memberName: "ممبر کا نام",
    memberNamePh: "مثلاً عائشہ بی بی",
    whatsappNumber: "واٹس ایپ نمبر",
    whatsappHint: "ملک کے کوڈ کے ساتھ، مثلاً 923001234567",
    noMembers: "ابھی کوئی ممبر نہیں",
    noMembersHint: "نیچے سے ممبر شامل کریں۔",
    removeMember: "ہٹائیں",
    confirmRemoveMember: "اس ممبر کو کمیٹی سے ہٹا دیں؟",
    whatsappInvalid: "صحیح واٹس ایپ نمبر لکھیں",
    memberAdded: "ممبر شامل ہو گیا",
    memberRemoved: "ممبر ہٹا دیا گیا",
    paymentsTitle: "قسطیں",
    paid: "ادا",
    unpaid: "باقی",
    markPaid: "ادا",
    markUnpaid: "واپس",
    paidCount: "ادا",
    unpaidCount: "باقی",
    noMembersForPay: "قسطیں لکھنے سے پہلے ممبر شامل کریں۔",
    allPaid: "اس مہینے سب نے ادا کر دیا ہے۔",
    month: "مہینہ",
    due: "تاریخ",
    drawTitle: "اگلی باری نکالیں",
    drawBtn: "اگلی باری نکالیں",
    drawBtnAgain: "نکالی جا رہی ہے...",
    drawingNow: "باری نکالی جا رہی ہے...",
    congrats: "مبارک ہو!",
    turnGoes: "یہ باری ان کی ہے",
    history: "باریوں کا ریکارڈ",
    turnNo: "باری",
    allReceived: "سب ممبران کمیٹی لے چکے ہیں۔ بہت اچھا!",
    notEnoughMembers: "باری نکالنے سے پہلے کم از کم ۲ ممبر شامل کریں۔",
    nextTurnLocked: "اگلی باری پہلے ہی نکالی جا چکی ہے اور محفوظ ہے۔",
    drawLockedHint: "یہ نتیجہ محفوظ ہو گیا ہے، اب دوبارہ نہیں نکالا جا سکتا۔",
    received: "لے لیا",
    remind: "یاد دلائیں",
    waReminder: "السلام علیکم {name}، کمیٹی کی قسط {amount} {dueDate} تک۔ شکریہ!",
    shareTitle: "خلاصہ شیئر کریں",
    shareIntro: "اس مہینے کا خلاصہ فیملی واٹس ایپ گروپ میں بھیجیں۔",
    shareWhatsapp: "واٹس ایپ پر شیئر کریں",
    copyText: "متن کاپی کریں",
    copied: "کاپی ہو گیا",
    summaryFor: "خلاصہ",
    saved: "محفوظ ہو گیا",
    deleted: "حذف ہو گیا",
    turnReceivedOn: "باری لے لی",
    noTurnYet: "باری نہیں لی",
    year: "سال",
  },
};

let LANG = "en";

function t(key, vars) {
  const table = I18N[LANG] || I18N.en;
  let str = table[key] != null ? table[key] : (I18N.en[key] != null ? I18N.en[key] : key);
  if (vars) {
    for (const k in vars) {
      str = str.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
    }
  }
  return str;
}

function setLang(lang) {
  LANG = lang === "ur" ? "ur" : "en";
  document.documentElement.lang = LANG;
  document.documentElement.dir = LANG === "ur" ? "rtl" : "ltr";
}

/* --------------------------------------------------------------------------
   Formatting helpers
   -------------------------------------------------------------------------- */

const MONTHS_EN = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
const MONTHS_EN_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_UR = ["جنوری", "فروری", "مارچ", "اپریل", "مئی", "جون",
  "جولائی", "اگست", "ستمبر", "اکتوبر", "نومبر", "دسمبر"];

// "2026-10" -> year 2026, monthIndex 9
function parseMonthKey(key) {
  const parts = String(key).split("-");
  return { year: parseInt(parts[0], 10), monthIndex: parseInt(parts[1], 10) - 1 };
}

function monthKey(year, monthIndex) {
  const m = String(monthIndex + 1).padStart(2, "0");
  return year + "-" + m;
}

function currentMonthKey() {
  const d = new Date();
  return monthKey(d.getFullYear(), d.getMonth());
}

function monthLabel(key, short) {
  const { year, monthIndex } = parseMonthKey(key);
  if (LANG === "ur") {
    return MONTHS_UR[monthIndex] + " " + year;
  }
  return (short ? MONTHS_EN_SHORT[monthIndex] : MONTHS_EN[monthIndex]) + " " + year;
}

function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

// Human readable due date, e.g. "5 Oct 2026" / "۵ اکتوبر ۲۰۲۶"
function dueDateLabel(key, day) {
  const { year, monthIndex } = parseMonthKey(key);
  const d = Math.min(day, daysInMonth(year, monthIndex));
  if (LANG === "ur") {
    return toUrduDigits(d + " " + MONTHS_UR[monthIndex] + " " + year);
  }
  return d + " " + MONTHS_EN_SHORT[monthIndex] + " " + year;
}

const URDU_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toUrduDigits(str) {
  return String(str).replace(/[0-9]/g, function (d) { return URDU_DIGITS[+d]; });
}

function formatMoney(n) {
  const num = Number(n) || 0;
  const s = num.toLocaleString("en-US");
  return LANG === "ur" ? toUrduDigits(s) : s;
}

function formatNumber(n) {
  const num = Number(n) || 0;
  const s = num.toLocaleString("en-US");
  return LANG === "ur" ? toUrduDigits(s) : s;
}
