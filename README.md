# Committee Manager (کمیٹی مینیجر)

A very simple, mobile-first web app for Pakistani families who run a **committee (BC)**.
Big buttons, large text, **Urdu / English** toggle, and it works on a cheap Android phone.

> **No login. No server. No monthly fee.** All data is saved on your own phone
> (browser `localStorage`). Use the **Export** button to keep a backup file.

Live example (yours): `https://committee-manager.vercel.app`

---

## Features

1. **Create a committee** — name, monthly amount (rupees), number of members, start month, due day.
2. **Add members** — name + WhatsApp number.
3. **Monthly payments** — see who paid and who has not. **One tap** marks a member as paid.
4. **Draw next turn** — a big **Draw next turn** button picks a random member who has not
   received the committee yet, with a short live animation. The result is **saved and locked** —
   it can never be redrawn.
5. **Reminders** — a **Remind** button next to each unpaid member opens WhatsApp with a ready
   Roman-Urdu message (via a `wa.me` link):
   > Assalam o Alaikum [name], committee ki qist Rs 5,000 5 Oct 2026 tak. Shukriya!
6. **Share summary** — sends this month's paid list and whose turn it is to the family group
   (uses the phone's Share sheet, or WhatsApp).

---

## How it is built (and why)

**Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.**

Why not Next.js? This app has no server, no login and no database — everything lives on the
phone. A static site is smaller, loads faster on a slow phone, works offline, and deploys free
on Vercel. Simpler to maintain too.

| File | What it does |
|------|--------------|
| `index.html` | The page shell (top bar + app container). |
| `styles.css` | All the styling: big buttons, large text, RTL support for Urdu. |
| `i18n.js` | All Urdu + English text, number/money/date formatting. |
| `store.js` | All data: create committee, members, payments, draws, export/import. Saved in `localStorage`. |
| `app.js` | Screens, navigation (hash router) and every button action. |
| `manifest.json` + `icon.svg` | Makes it installable on the phone home screen. |
| `vercel.json` | Tiny config for free Vercel hosting. |

One screen per task. No dashboards.

---

## Test it on YOUR COMPUTER

1. Open the folder `committee-manager`.
2. **Double-click `index.html`.** It opens in your browser. Done.

> Tip: if anything looks broken when opened this way, use the local server method below
> (some browsers block saving data on `file://`).

---

## Test it on YOUR PHONE (same Wi-Fi)

Your computer's address on the network is **`192.168.100.4`** (checked today).

1. Make sure the phone and the PC are on the **same Wi-Fi**.
2. Open a terminal in the project folder and run a tiny web server:

   ```powershell
   npx --yes serve -l 8080 .
   ```

   (First run downloads a tiny tool — that is normal. You only need Node, which you already have.)

3. On your phone, open the browser and go to:

   ```
   http://192.168.100.4:8080
   ```

4. If it does not load, Windows Firewall may be blocking it — allow Node/npx when asked.

> The IP `192.168.100.4` can change when you reconnect to Wi-Fi. Re-run the `ipconfig` command
> to find it again (look for "IPv4 Address").

---

## Deploy free on Vercel (do this once — best way to use on the phone)

1. The code is already on GitHub:
   <https://github.com/sheikh-mohammad/committee-manager>
2. Go to <https://vercel.com> and sign in **with GitHub**.
3. Click **Add New… → Project**.
4. Find `committee-manager` and click **Import**.
5. Framework preset: **Other**. Leave **Build Command** empty. Leave **Output Directory** empty
   (root). Click **Deploy**.
6. After ~20 seconds you get a link like `https://committee-manager.vercel.app`.
7. Open that link on your phone. Then tap the browser menu **⋮ → Add to Home screen**.
   It now opens like a normal app.

From now on, every time the code is pushed to GitHub, Vercel redeploys automatically.

---

## How your mother uses it (in order)

1. **New Committee** → type name, amount, number of members, month and due day → **Create**.
2. Tap the committee → **Members** → add each person's name and WhatsApp number.
3. Each month tap **Monthly Payments**:
   - Tap **Paid** once when someone pays (the row turns green).
   - Tap **Remind** to open WhatsApp for someone who has not paid.
4. On the meeting day tap **Draw Next Turn** → the big button runs a quick animation and
   announces the winner. It is saved forever.
5. Tap **Share Summary** → **Share on WhatsApp** to post the month's list to the family group.

---

## Data safety (important)

- Data is stored **only on that phone/browser**. Clearing browser data will erase it.
- **Do this every month:** Home → **Backup → Export backup**. It downloads a `.json` file.
  Save it to Google Drive / WhatsApp to yourself.
- To move to a new phone: install the app there, then **Backup → Import backup** and pick the file.

---

## Urdu / English

Tap the **اردو / English** button in the top-right at any time. The whole app flips language,
and Urdu mode also lays the app out right-to-left. The WhatsApp reminder text stays in
**Roman Urdu** on purpose, so it is easy to read for everyone.

---

## Troubleshooting

- **Data disappeared** → the browser data was cleared, or you opened it with a different
  link (e.g. `file://` vs `http://`). Restore from your backup file.
- **Remind button does nothing** → the member has no WhatsApp number; add one in **Members**.
- **Phone can't open the local link** → check same Wi-Fi, and allow Node through the firewall.
- **WhatsApp link** → numbers are auto-converted to international format (e.g. `0300…` → `92300…`).
