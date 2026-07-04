# Sahayatha MFG — Manufacturing Inventory & BOM (Mobile App)

**Module 1 (Item Master) — offline Android app version.**

This works fully offline, on your phone, with no PC, no server, and no
internet connection needed once it's installed. All your data is stored
directly on the phone.

---

## Important: what changed from the web version

Earlier we built a version with a separate backend server (Node.js +
Express) that had to run on a PC. You asked for a real installable app
instead, so this version is different under the hood:

- **No server anymore.** The app stores everything in its own private
  storage on the phone (like how any normal app — Notes, WhatsApp, etc. —
  keeps its data on your phone).
- **Same screens, same features.** Add/Edit/Delete/Search/Export Excel all
  work exactly the same from your point of view.
- **Export Excel now opens your phone's Share screen** (Save to Files,
  send via WhatsApp, email it, etc.) instead of downloading to a computer.

I tested the storage logic directly (14 automated checks — add, edit,
delete, search, duplicate-code protection, etc.) and it all passed. What I
could **not** do from here is compile the final installable file — that
needs Android's official build tool, which only runs on a real computer.
That's the one step left for you.

---

## What you need to do (one-time, about 20-30 minutes)

### Step 1 — Install Android Studio
Download it free from **https://developer.android.com/studio** and
install it (Next → Next → Finish, like any program). The first time you
open it, it will download some additional Android components — let it
finish, this can take a while depending on your internet speed.

### Step 2 — Open this project
1. Unzip the file I gave you anywhere on your PC.
2. Open **Android Studio**.
3. Click **Open** (or File → Open).
4. Navigate into the unzipped folder and select the **`frontend/android`**
   folder specifically (not the whole project — the `android` folder
   inside `frontend`).
5. Click OK. Android Studio will "sync" the project — a progress bar runs
   at the bottom. Wait for it to finish (first time can take 5-10 minutes).

### Step 3 — Build the APK
1. In the top menu, click **Build**.
2. Click **Build Bundle(s) / APK(s)** → **Build APK(s)**.
3. Wait for it to finish — a notification appears bottom-right saying
   "APK(s) generated successfully."
4. Click **locate** in that notification. It opens a folder containing
   `app-debug.apk` — that's your installable app.

### Step 4 — Get it onto your phone
The simplest way:
1. Plug your phone into your PC with a USB cable.
2. Copy `app-debug.apk` onto your phone (drag it into your phone's
   Downloads folder, or send it to yourself via email/WhatsApp/Google Drive
   and download it on the phone).
3. On your phone, open the file using a Files app and tap **Install**.
4. Your phone may show a warning like "Install unknown apps" — this is
   normal for any app installed outside the Play Store. Tap **Settings**
   in that warning, allow installs from that source, then go back and tap
   Install again.

You'll now have a **Sahayatha MFG** app icon on your phone like any other
app. Open it, add your items, and everything is saved on the phone —
close the app, restart your phone, doesn't matter, the data stays.

---

## Trying it on your PC first (optional)

If you want to see the screens before building the APK, you can still run
it as a website on your PC to check everything looks right:

```bash
cd frontend
npm install
npm run dev
```
Then open the "Local" address it prints (something like
`http://localhost:5173`) in your PC's browser. Adding items here uses your
PC browser's own storage — it's separate from what ends up on your phone,
just for previewing the screens.

---

## What you can do in the app (Module 1 — Item Master)

- **Add Item** — top-right button opens a form (Item Code, Name, Category,
  Unit, Opening Stock, Minimum Stock, Supplier, Location, Remarks)
- **Edit** — pencil icon on any row
- **Delete** — trash icon on any row (asks for confirmation first)
- **Search** — instantly filters by code, name, category, supplier, or location
- **Export Excel** — builds a `.xlsx` file on the phone and opens the Share
  screen so you can save or send it
- **Stock gauge & status pill** — every item shows a colour-coded bar and a
  Safe / Low / Out-of-stock label, the same visual language Module 5
  (Live Stock) and Module 6 (Low Stock Alerts) will reuse later

---

## Project structure

```
frontend/
├── src/
│   ├── db/
│   │   └── localDb.js       ← the on-device "database" (replaces the old backend)
│   ├── api/
│   │   └── items.js         ← same function names as before, now calls localDb.js
│   ├── components/          ← item form, delete popup, sidebar, stock gauge
│   ├── pages/
│   │   └── ItemMaster.jsx   ← the Item Master screen (unchanged)
│   └── App.jsx
├── android/                 ← the native Android project — open THIS in Android Studio
└── capacitor.config.ts      ← app name & package ID

backend/                     ← kept from the earlier version, not used by the phone
                                app anymore. Safe to ignore for now.
```

---

## Troubleshooting

**Android Studio asks to update Gradle / SDK components**
→ Let it — click Update/Install when prompted. This only happens once.

**"Install blocked" on the phone**
→ Go to phone Settings → Security (or Apps) → allow installs from the app
you used to open the file (Files, Chrome, etc.), then try installing again.

**Build fails with a red error in Android Studio**
→ Take a screenshot and send it to me — I can tell you what it means and
how to fix it, since I can't run the exact build myself from here.

---

## What's next

Once the app is installed and working, tell me and I'll build
**Module 2 — Product Master & BOM** the same way, directly into this
project.
