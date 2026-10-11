/* ==========================================================================
   app.js — screens, navigation and interactions
   ========================================================================== */

const appEl = document.getElementById("app");
const titleEl = document.getElementById("appTitle");
const backEl = document.getElementById("btnBack");
const langEl = document.getElementById("btnLang");

/* ------------------------------- small helpers --------------------------- */
function escapeHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function initials(name) {
  const parts = String(name || "?").trim().split(/\s+/);
  return parts[0] ? parts[0][0].toUpperCase() : "?";
}

let toastTimer = null;
function toast(msg) {
  let el = document.getElementById("toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "toast";
    el.className = "toast";
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
}

// Bottom-sheet confirm dialog
function confirmBox(message, confirmLabel) {
  return new Promise(function (resolve) {
    const backdrop = document.createElement("div");
    backdrop.className = "modal-backdrop";
    backdrop.innerHTML =
      '<div class="modal">' +
      '<p>' + escapeHtml(message) + '</p>' +
      '<div class="btn-row">' +
      '<button class="btn btn-ghost" data-res="no">' + escapeHtml(t("cancel")) + '</button>' +
      '<button class="btn btn-danger" data-res="yes">' + escapeHtml(confirmLabel || t("yes")) + '</button>' +
      '</div></div>';
    document.body.appendChild(backdrop);
    backdrop.addEventListener("click", function (e) {
      if (e.target === backdrop) { backdrop.remove(); resolve(false); return; }
      const res = e.target.getAttribute && e.target.getAttribute("data-res");
      if (res) { backdrop.remove(); resolve(res === "yes"); }
    });
  });
}

/* --------------------------------- routing ------------------------------- */
function go(hash) {
  if (location.hash === hash) render();
  else location.hash = hash;
}

function parseRoute() {
  const h = location.hash.replace(/^#\/?/, "");
  const parts = h.split("/").filter(Boolean);
  if (parts[0] === "new") return { name: "new" };
  if (parts[0] === "backup") return { name: "backup" };
  if (parts[0] === "committee" && parts[1]) {
    const id = parts[1];
    const sub = parts[2];
    if (sub === "members") return { name: "members", id: id };
    if (sub === "payments") return { name: "payments", id: id };
    if (sub === "draw") return { name: "draw", id: id };
    if (sub === "share") return { name: "share", id: id };
    if (sub === "edit") return { name: "edit", id: id };
    return { name: "committee", id: id };
  }
  return { name: "home" };
}

function setHeader(title, showBack) {
  titleEl.textContent = title;
  backEl.classList.toggle("hidden", !showBack);
  langEl.textContent = LANG === "en" ? "اردو" : "English";
}

/* ---------------------------------- screens ------------------------------ */
function screenHome() {
  const committees = getCommittees();
  setHeader(t("appName"), false);

  let body;
  if (committees.length === 0) {
    body =
      '<div class="empty">' +
      '<span class="emoji">🤝</span>' +
      '<h2>' + escapeHtml(t("noCommittees")) + "</h2>" +
      '<p>' + escapeHtml(t("noCommitteesHint")) + "</p>" +
      "</div>";
  } else {
    body = '<ul class="list">';
    committees.forEach(function (c) {
      const received = c.members.filter(function (m) { return m.receivedTurn != null; }).length;
      body +=
        '<li class="list-item tappable" data-action="open-committee" data-id="' + c.id + '">' +
        '<div class="avatar">' + escapeHtml(initials(c.name)) + "</div>" +
        '<div class="item-main">' +
        '<div class="item-title">' + escapeHtml(c.name) + "</div>" +
        '<div class="item-sub">Rs ' + formatMoney(c.amount) + " · " +
        formatNumber(c.members.length) + " " + escapeHtml(t("members")) +
        " · " + formatNumber(received) + "/" + formatNumber(c.draws.length) +
        "</div></div>" +
        '<span class="badge badge-turn">›</span>' +
        "</li>";
    });
    body += "</ul>";
  }

  appEl.innerHTML =
    body +
    '<div class="mt">' +
    '<button class="btn" data-action="new-committee">＋ ' + escapeHtml(t("newCommittee")) + "</button>" +
    "</div>" +
    '<div class="mt">' +
    '<button class="btn btn-ghost" data-action="backup">🗄️ ' + escapeHtml(t("backup")) + "</button>" +
    "</div>";
}

function committeeFormHTML(c) {
  const isEdit = !!c;
  const data = c || {
    name: "",
    amount: "",
    membersCount: "",
    startMonth: currentMonthKey(),
    dueDay: 5,
  };
  const dayOptions = [];
  for (let d = 1; d <= 28; d++) {
    dayOptions.push(
      '<option value="' + d + '"' + (Number(data.dueDay) === d ? " selected" : "") + ">" + d + "</option>"
    );
  }

  return (
    '<div class="card">' +
    '<div class="field">' +
    '<label for="f-name">' + escapeHtml(t("committeeName")) + "</label>" +
    '<input id="f-name" type="text" inputmode="text" placeholder="' + escapeHtml(t("committeeNamePh")) + '" value="' + escapeHtml(data.name) + '" />' +
    "</div>" +

    '<div class="field">' +
    '<label for="f-amount">' + escapeHtml(t("monthlyAmount")) + "</label>" +
    '<input id="f-amount" type="number" inputmode="numeric" min="1" step="1" placeholder="5000" value="' + escapeHtml(data.amount) + '" />' +
    "</div>" +

    '<div class="field-row">' +
    '<div class="field">' +
    '<label for="f-count">' + escapeHtml(t("numberOfMembers")) + "</label>" +
    '<input id="f-count" type="number" inputmode="numeric" min="2" step="1" placeholder="10" value="' + escapeHtml(data.membersCount) + '" />' +
    "</div>" +
    '<div class="field">' +
    '<label for="f-day">' + escapeHtml(t("dueDay")) + "</label>" +
    '<select id="f-day">' + dayOptions.join("") + "</select>" +
    "</div></div>" +

    '<div class="field">' +
    '<label for="f-start">' + escapeHtml(t("startMonth")) + "</label>" +
    '<input id="f-start" type="month" value="' + escapeHtml(data.startMonth) + '" />' +
    "</div>" +

    '<button class="btn" data-action="' + (isEdit ? "save-edit-committee" : "save-committee") + '" data-id="' + (isEdit ? c.id : "") + '">' +
    "💾 " + escapeHtml(isEdit ? t("updateCommittee") : t("createCommittee")) +
    "</button>" +
    "</div>"
  );
}

function screenNew() {
  setHeader(t("newCommittee"), true);
  appEl.innerHTML = committeeFormHTML(null);
}

function screenEdit(id) {
  const c = getCommittee(id);
  if (!c) { go("#/"); return; }
  setHeader(t("editCommittee"), true);
  appEl.innerHTML = committeeFormHTML(c);
}

function screenCommittee(id) {
  const c = getCommittee(id);
  if (!c) { go("#/"); return; }
  setHeader(c.name, true);

  const received = c.members.filter(function (m) { return m.receivedTurn != null; }).length;

  appEl.innerHTML =
    '<div class="stat-grid mb">' +
    '<div class="stat"><div class="num">Rs ' + formatMoney(c.amount) + '</div><div class="lbl">' + escapeHtml(t("perMonth")) + "</div></div>" +
    '<div class="stat"><div class="num">' + formatNumber(c.members.length) + '</div><div class="lbl">' + escapeHtml(t("members")) + "</div></div>" +
    '<div class="stat"><div class="num">' + formatNumber(received) + '</div><div class="lbl">' + escapeHtml(t("received")) + "</div></div>" +
    '<div class="stat"><div class="num">' + escapeHtml(dueDateLabel(c.startMonth, c.dueDay)) + '</div><div class="lbl">' + escapeHtml(t("due")) + "</div></div>" +
    "</div>" +

    '<button class="btn mb" data-action="open-payments" data-id="' + c.id + '">💵 ' + escapeHtml(t("monthlyPayments")) + "</button>" +
    '<button class="btn mb" data-action="open-draw" data-id="' + c.id + '">🎡 ' + escapeHtml(t("drawNextTurn")) + "</button>" +
    '<button class="btn btn-secondary mb" data-action="open-members" data-id="' + c.id + '">👥 ' + escapeHtml(t("manageMembers")) + "</button>" +
    '<button class="btn btn-ghost mb" data-action="open-share" data-id="' + c.id + '">📤 ' + escapeHtml(t("shareSummary")) + "</button>" +
    '<button class="btn btn-ghost mb" data-action="edit-committee" data-id="' + c.id + '">✏️ ' + escapeHtml(t("editCommittee")) + "</button>" +
    '<button class="btn btn-danger-ghost" data-action="delete-committee" data-id="' + c.id + '">🗑️ ' + escapeHtml(t("deleteCommittee")) + "</button>";
}

/* --------------------------------- members ------------------------------- */
function screenMembers(id) {
  const c = getCommittee(id);
  if (!c) { go("#/"); return; }
  setHeader(t("membersTitle"), true);

  let list;
  if (c.members.length === 0) {
    list = '<div class="empty"><span class="emoji">👥</span><h3>' +
      escapeHtml(t("noMembers")) + "</h3><p>" + escapeHtml(t("noMembersHint")) + "</p></div>";
  } else {
    list = '<ul class="list">';
    c.members.forEach(function (m) {
      const taken = m.receivedTurn != null;
      list +=
        '<li class="list-item">' +
        '<div class="avatar' + (taken ? " received" : "") + '">' + escapeHtml(initials(m.name)) + "</div>" +
        '<div class="item-main">' +
        '<div class="item-title">' + escapeHtml(m.name) + "</div>" +
        '<div class="item-sub">' + (m.whatsapp ? "📱 " + escapeHtml(m.whatsapp) : "") +
        " · " + escapeHtml(taken ? t("turnReceivedOn") : t("noTurnYet")) +
        "</div></div>" +
        '<button class="btn-small btn-danger-ghost btn" data-action="remove-member" data-id="' + c.id +
        '" data-mid="' + m.id + '">' + escapeHtml(t("removeMember")) + "</button>" +
        "</li>";
    });
    list += "</ul>";
  }

  appEl.innerHTML =
    list +
    '<div class="card mt">' +
    '<div class="field">' +
    '<label for="f-mname">' + escapeHtml(t("memberName")) + "</label>" +
    '<input id="f-mname" type="text" placeholder="' + escapeHtml(t("memberNamePh")) + '" />' +
    "</div>" +
    '<div class="field">' +
    '<label for="f-mwa">' + escapeHtml(t("whatsappNumber")) + "</label>" +
    '<input id="f-mwa" type="tel" inputmode="tel" placeholder="923001234567" />' +
    '<div class="hint">' + escapeHtml(t("whatsappHint")) + "</div>" +
    "</div>" +
    '<button class="btn" data-action="add-member" data-id="' + c.id + '">＋ ' + escapeHtml(t("addMember")) + "</button>" +
    "</div>";
}
/* --------------------------------- payments ------------------------------ */
let paymentsMonth = currentMonthKey();

function screenPayments(id) {
  const c = getCommittee(id);
  if (!c) { go("#/"); return; }
  setHeader(t("paymentsTitle"), true);

  if (c.members.length === 0) {
    appEl.innerHTML = '<div class="empty"><span class="emoji">💵</span><h3>' +
      escapeHtml(t("noMembersForPay")) + "</h3></div>" +
      '<button class="btn btn-secondary" data-action="open-members" data-id="' + c.id + '">👥 ' +
      escapeHtml(t("manageMembers")) + "</button>";
    return;
  }

  const pays = getPayments(id, paymentsMonth);
  const paidCount = c.members.filter(function (m) { return pays[m.id]; }).length;
  const unpaidCount = c.members.length - paidCount;

  let rows = "";
  c.members.forEach(function (m) {
    const paid = !!pays[m.id];
    rows +=
      '<div class="card' + (paid ? " is-paid" : "") + '">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
      '<div class="avatar">' + escapeHtml(initials(m.name)) + "</div>" +
      '<div class="item-main">' +
      '<div class="item-title">' + escapeHtml(m.name) + "</div>" +
      '<div class="item-sub">Rs ' + formatMoney(c.amount) + " · " +
      '<span class="badge ' + (paid ? "badge-paid" : "badge-unpaid") + '">' +
      escapeHtml(paid ? t("paid") : t("unpaid")) + "</span></div></div>" +
      "</div>" +
      '<div class="btn-row mt">' +
      (paid ? "" :
        '<button class="btn btn-wa" data-action="remind-member" data-id="' + c.id +
        '" data-mid="' + m.id + '">💬 ' + escapeHtml(t("remind")) + "</button>") +
      '<button class="btn ' + (paid ? "btn-ghost" : "btn-secondary") + '" data-action="toggle-paid" data-id="' + c.id +
      '" data-mid="' + m.id + '">' + escapeHtml(paid ? t("markUnpaid") : t("markPaid")) + "</button>" +
      "</div>" +
      "</div>";
  });

  appEl.innerHTML =
    '<div class="card">' +
    '<div class="btn-row" style="align-items:center">' +
    '<button class="btn btn-ghost btn-small" data-action="pay-prev" data-id="' + c.id + '">‹</button>' +
    '<div class="grow center"><strong style="font-size:1.15rem">' + escapeHtml(monthLabel(paymentsMonth)) + "</strong>" +
    '<div class="muted" style="font-size:0.9rem">' + escapeHtml(t("due")) + ": " + escapeHtml(dueDateLabel(paymentsMonth, c.dueDay)) + "</div></div>" +
    '<button class="btn btn-ghost btn-small" data-action="pay-next" data-id="' + c.id + '">›</button>' +
    "</div></div>" +

    '<div class="stat-grid mb">' +
    '<div class="stat"><div class="num">' + formatNumber(paidCount) + '</div><div class="lbl">' + escapeHtml(t("paidCount")) + "</div></div>" +
    '<div class="stat"><div class="num">' + formatNumber(unpaidCount) + '</div><div class="lbl">' + escapeHtml(t("unpaidCount")) + "</div></div>" +
    "</div>" +

    (unpaidCount === 0 ? '<div class="card center">🎉 ' + escapeHtml(t("allPaid")) + "</div>" : "") +
    rows;
}

function shiftPaymentsMonth(id, delta) {
  const { year, monthIndex } = parseMonthKey(paymentsMonth);
  const d = new Date(year, monthIndex + delta, 1);
  paymentsMonth = monthKey(d.getFullYear(), d.getMonth());
  render();
}
/* ----------------------------------- draw -------------------------------- */
let drawing = false;

function drawHistoryHTML(c) {
  if (c.draws.length === 0) return "";
  let rows = '<h3 class="section-title">' + escapeHtml(t("history")) + "</h3><ul class='list'>";
  c.draws.slice().reverse().forEach(function (d) {
    rows +=
      '<li class="list-item">' +
      '<div class="avatar received">' + escapeHtml(formatNumber(d.turnNumber)) + "</div>" +
      '<div class="item-main">' +
      '<div class="item-title">' + escapeHtml(d.name) + "</div>" +
      '<div class="item-sub">' + escapeHtml(t("turnNo")) + " " + escapeHtml(formatNumber(d.turnNumber)) +
      " · " + escapeHtml(monthLabel(d.month)) + "</div></div>" +
      '<span class="badge badge-turn">✓</span>' +
      "</li>";
  });
  rows += "</ul>";
  return rows;
}

function screenDraw(id) {
  const c = getCommittee(id);
  if (!c) { go("#/"); return; }
  setHeader(t("drawTitle"), true);

  const month = currentMonthKey();
  const monthTurn = getTurnForMonth(id, month);
  const remaining = membersNotReceived(id).length;

  let stage, controls;

  if (c.members.length < 2) {
    stage =
      '<div class="draw-stage"><div class="draw-name">👥</div>' +
      '<div class="draw-label">' + escapeHtml(t("notEnoughMembers")) + "</div></div>";
    controls =
      '<button class="btn btn-secondary mt" data-action="open-members" data-id="' + c.id + '">👥 ' +
      escapeHtml(t("manageMembers")) + "</button>";
  } else if (monthTurn) {
    stage =
      '<div class="draw-stage win"><div class="draw-label">' + escapeHtml(monthLabel(month)) + "</div>" +
      '<div class="draw-name">' + escapeHtml(monthTurn.name) + "</div>" +
      '<div class="draw-turn">' + escapeHtml(t("turnNo")) + " " + escapeHtml(formatNumber(monthTurn.turnNumber)) +
      " · " + escapeHtml(t("congrats")) + "</div></div>";
    controls = '<div class="card center mt muted">🔒 ' + escapeHtml(t("drawLockedHint")) + "</div>";
  } else if (remaining === 0) {
    stage =
      '<div class="draw-stage"><div class="draw-name">🎉</div>' +
      '<div class="draw-label">' + escapeHtml(t("allReceived")) + "</div></div>";
    controls = "";
  } else {
    stage =
      '<div class="draw-stage"><div class="draw-label">' + escapeHtml(monthLabel(month)) + "</div>" +
      '<div class="draw-name">🎡</div>' +
      '<div class="draw-turn">' + escapeHtml(t("drawingNow")) + " · " + formatNumber(remaining) + "</div></div>";
    controls =
      '<button class="btn btn-mega mt" data-action="draw-go" data-id="' + c.id + '">🎡 ' +
      escapeHtml(t("drawBtn")) + "</button>" +
      '<div class="center muted mt">' + escapeHtml(t("drawLockedHint")) + "</div>";
  }

  appEl.innerHTML = stage + controls + '<div class="mt">' + drawHistoryHTML(c) + "</div>";
}

function runDraw(id) {
  if (drawing) return;
  const month = currentMonthKey();
  const res = drawNextTurn(id, month);

  if (res.error === "few-members") { toast(t("notEnoughMembers")); return; }
  if (res.locked || res.done || res.error) { render(); return; }

  drawing = true;
  const c = getCommittee(id);
  const names = c.members.map(function (m) { return m.name; });
  const nameEl = appEl.querySelector(".draw-name");
  const turnEl = appEl.querySelector(".draw-turn");
  const stageEl = appEl.querySelector(".draw-stage");
  const btn = appEl.querySelector('[data-action="draw-go"]');

  if (btn) { btn.disabled = true; btn.textContent = t("drawBtnAgain"); }
  if (nameEl) nameEl.classList.add("rolling");
  if (turnEl) turnEl.textContent = t("drawingNow");

  let ticks = 0;
  const total = 22;
  const timer = setInterval(function () {
    if (nameEl) nameEl.textContent = names[Math.floor(Math.random() * names.length)];
    ticks++;
    if (ticks >= total) {
      clearInterval(timer);
      if (nameEl) {
        nameEl.classList.remove("rolling");
        nameEl.textContent = res.member.name;
      }
      if (turnEl) {
        turnEl.textContent = t("turnNo") + " " + formatNumber(res.turnNumber) + " · " + t("congrats");
      }
      if (stageEl) stageEl.classList.add("win");
      drawing = false;
      setTimeout(render, 1700);
    }
  }, 90);
}
/* ------------------------------ reminders / share ------------------------ */
function waReminderMessage(c, m) {
  const amount = "Rs " + (Number(c.amount) || 0).toLocaleString("en-US");
  const due = dueDateLabelLatin(paymentsMonth, c.dueDay);
  return "Assalam o Alaikum " + m.name + ", committee ki qist " + amount + " " + due + " tak. Shukriya!";
}

function openWhatsApp(number, text) {
  const url = "https://wa.me/" + (number || "") + "?text=" + encodeURIComponent(text);
  window.open(url, "_blank");
}

function buildSummary(c) {
  const month = paymentsMonth;
  const pays = getPayments(c.id, month);
  const paid = c.members.filter(function (m) { return !!pays[m.id]; });
  const unpaid = c.members.filter(function (m) { return !pays[m.id]; });
  const turn = getTurnForMonth(c.id, month);

  const lines = [];
  lines.push("Committee: " + c.name);
  lines.push("Month: " + dueDateLabelLatin(month, 1) + "  |  Due: " + dueDateLabelLatin(month, c.dueDay));
  lines.push("");
  lines.push("PAID (" + paid.length + "):");
  paid.forEach(function (m) { lines.push("- " + m.name); });
  lines.push("");
  lines.push("NOT PAID (" + unpaid.length + "):");
  unpaid.forEach(function (m) { lines.push("- " + m.name); });
  lines.push("");
  lines.push("Turn: " + (turn ? turn.name + " (Turn " + turn.turnNumber + ")" : "not drawn yet"));
  return lines.join("\n");
}

function screenShare(id) {
  const c = getCommittee(id);
  if (!c) { go("#/"); return; }
  setHeader(t("shareTitle"), true);

  const summary = buildSummary(c);

  appEl.innerHTML =
    '<p class="muted">' + escapeHtml(t("shareIntro")) + "</p>" +
    '<div class="summary-box mb">' + escapeHtml(summary) + "</div>" +
    '<button class="btn btn-wa mb" data-action="share-wa" data-id="' + c.id + '">📤 ' +
    escapeHtml(t("shareWhatsapp")) + "</button>" +
    '<button class="btn btn-ghost" data-action="copy-summary" data-id="' + c.id + '">📋 ' +
    escapeHtml(t("copyText")) + "</button>";
}

/* --------------------------------- backup -------------------------------- */
function screenBackup() {
  setHeader(t("backup"), true);
  appEl.innerHTML =
    '<div class="card">' +
    '<p class="muted">' + escapeHtml(t("exportHint")) + "</p>" +
    '<button class="btn mb" data-action="export-data">⬇️ ' + escapeHtml(t("exportData")) + "</button>" +
    '<button class="btn btn-secondary" data-action="import-data">⬆️ ' + escapeHtml(t("importData")) + "</button>" +
    '<input type="file" id="importFile" accept="application/json,.json" class="hidden" />' +
    "</div>";
}

function downloadBackup() {
  const blob = new Blob([exportData()], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "committee-backup-" + new Date().toISOString().slice(0, 10) + ".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast(t("exportDone"));
}

/* --------------------------------- render -------------------------------- */
function render() {
  const route = parseRoute();
  switch (route.name) {
    case "new": screenNew(); break;
    case "edit": screenEdit(route.id); break;
    case "committee": screenCommittee(route.id); break;
    case "members": screenMembers(route.id); break;
    case "payments": screenPayments(route.id); break;
    case "draw": screenDraw(route.id); break;
    case "share": screenShare(route.id); break;
    case "backup": screenBackup(); break;
    default: screenHome();
  }
  window.scrollTo(0, 0);
}

/* ------------------------------- form values ----------------------------- */
function readCommitteeForm(c) {
  const name = document.getElementById("f-name").value.trim();
  const amount = document.getElementById("f-amount").value;
  const count = document.getElementById("f-count").value;
  const day = document.getElementById("f-day").value;
  const start = document.getElementById("f-start").value;

  if (!name) { toast(t("nameRequired")); return null; }
  if (!amount || Number(amount) <= 0) { toast(t("amountRequired")); return null; }
  if (!count || Number(count) < 2) { toast(t("membersRequired")); return null; }
  if (!day || Number(day) < 1 || Number(day) > 28) { toast(t("dayRequired")); return null; }

  return { name: name, amount: amount, membersCount: count, dueDay: day, startMonth: start || currentMonthKey() };
}

/* --------------------------------- events -------------------------------- */
appEl.addEventListener("click", function (e) {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.getAttribute("data-action");
  const id = el.getAttribute("data-id");

  switch (action) {
    case "new-committee":
      go("#/new");
      break;
    case "open-committee":
      go("#/committee/" + id);
      break;
    case "open-members":
      go("#/committee/" + id + "/members");
      break;
    case "open-payments":
      paymentsMonth = currentMonthKey();
      go("#/committee/" + id + "/payments");
      break;
    case "open-draw":
      go("#/committee/" + id + "/draw");
      break;
    case "open-share":
      paymentsMonth = currentMonthKey();
      go("#/committee/" + id + "/share");
      break;
    case "edit-committee":
      go("#/committee/" + id + "/edit");
      break;
    case "save-committee": {
      const data = readCommitteeForm(null);
      if (!data) return;
      const c = createCommittee(data);
      toast(t("saved"));
      go("#/committee/" + c.id);
      break;
    }
    case "save-edit-committee": {
      const data = readCommitteeForm();
      if (!data) return;
      updateCommittee(id, data);
      toast(t("saved"));
      go("#/committee/" + id);
      break;
    }
    case "delete-committee":
      confirmBox(t("confirmDeleteCommittee"), t("delete")).then(function (yes) {
        if (yes) { deleteCommittee(id); toast(t("deleted")); go("#/"); }
      });
      break;
    case "backup":
      go("#/backup");
      break;
    case "add-member": {
      const nameEl = document.getElementById("f-mname");
      const waEl = document.getElementById("f-mwa");
      const name = nameEl.value.trim();
      if (!name) { toast(t("nameRequired")); nameEl.focus(); return; }
      addMember(id, { name: name, whatsapp: waEl.value });
      toast(t("memberAdded"));
      render();
      break;
    }
    case "remove-member": {
      const mid = el.getAttribute("data-mid");
      confirmBox(t("confirmRemoveMember"), t("removeMember")).then(function (yes) {
        if (yes) { removeMember(id, mid); toast(t("memberRemoved")); render(); }
      });
      break;
    }
    case "toggle-paid": {
      const mid = el.getAttribute("data-mid");
      setPaid(id, paymentsMonth, mid, !isPaid(id, paymentsMonth, mid));
      render();
      break;
    }
    case "pay-prev":
      shiftPaymentsMonth(id, -1);
      break;
    case "pay-next":
      shiftPaymentsMonth(id, 1);
      break;
    case "draw-go":
      runDraw(id);
      break;
    case "remind-member": {
      const mid = el.getAttribute("data-mid");
      const c = getCommittee(id);
      const m = c && c.members.find(function (x) { return x.id === mid; });
      if (!c || !m) return;
      if (!m.whatsapp) { toast(t("whatsappInvalid")); return; }
      openWhatsApp(m.whatsapp, waReminderMessage(c, m));
      break;
    }
    case "share-wa": {
      const c = getCommittee(id);
      if (!c) return;
      const summary = buildSummary(c);
      if (navigator.share) {
        navigator.share({ text: summary }).catch(function () {});
      } else {
        openWhatsApp("", summary);
      }
      break;
    }
    case "copy-summary": {
      const c = getCommittee(id);
      if (!c) return;
      const summary = buildSummary(c);
      if (navigator.clipboard) {
        navigator.clipboard.writeText(summary).then(function () { toast(t("copied")); });
      } else {
        const ta = document.createElement("textarea");
        ta.value = summary;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        toast(t("copied"));
      }
      break;
    }
    case "export-data":
      downloadBackup();
      break;
    case "import-data": {
      const input = document.getElementById("importFile");
      if (input) input.click();
      break;
    }
  }
});

/* import file picker (change event) */
appEl.addEventListener("change", function (e) {
  if (e.target && e.target.id === "importFile") {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        importData(String(reader.result));
        toast(t("importDone"));
        go("#/");
        render();
      } catch (err) {
        toast(t("importError"));
      }
    };
    reader.readAsText(file);
  }
});

backEl.addEventListener("click", function () {
  if (history.length > 1) history.back();
  else go("#/");
});

langEl.addEventListener("click", function () {
  const next = LANG === "en" ? "ur" : "en";
  setLang(next);
  saveLang(next);
  render();
});

window.addEventListener("hashchange", render);

/* ---------------------------------- start -------------------------------- */
loadDB();
setLang(getSavedLang());
render();
