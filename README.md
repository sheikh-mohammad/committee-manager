# Committee Manager (کمیٹی مینیجر)

A very simple, mobile-first web app for Pakistani families who run a committee (BC).
Big buttons, large text, Urdu / English toggle, works offline on a cheap Android phone.

**No login. No server. All data stays on your phone (localStorage).**
Use the Export / Import buttons to keep a backup.

---

## What it does

1. **Create a committee** — name, monthly amount (rupees), number of members, start month, due day.
2. **Add members** — name + WhatsApp number.
3. **Monthly payments** — see who paid and who has not. One tap marks a member as paid.
4. **Draw next turn** — a big button picks a random member who has not received the committee yet,
   with a short animation. The result is saved and can never be redrawn.
5. **Reminders** — a "Remind on WhatsApp" button next to each unpaid member opens WhatsApp
   with a ready Roman-Urdu message.
6. **Share summary** — sends this month's paid list and whose turn it is to the family WhatsApp group.

---

## Run it locally

You only need a browser. But to test on your phone you should either:

- **Option A (easy):** double-click `index.html` to open it on your computer.
- **Option B (recommended):** run a tiny local web server (see the guide the assistant gave you).

## Deploy free on Vercel

1. Push this folder to GitHub.
2. Go to <https://vercel.com> → **Add New Project** → import this repository.
3. Framework preset: **Other**. Build command: (leave empty). Output directory: `.` (root).
4. Click **Deploy**. You get a link like `https://committee-manager.vercel.app`.
5. Open that link on your phone. Done — add it to your home screen.

---

## Tech

Plain HTML, CSS and JavaScript. No frameworks, no build step, no dependencies.
