# UniIdent Autofill Extension

A Manifest V3 browser extension for autofilling forms using your UniIdent vault on the Internet Computer (ICP).

## Features
- Detects and autofills standard form fields (name, email, github, etc.)
- Login with Internet Identity (mocked for demo)
- Fetches credentials from ICP (mocked for demo)
- Minimal popup UI: Login, View Data, Autofill Page
- Secure: Data is only stored in memory

## Install & Run (Developer Mode)
1. Clone or download this repo.
2. Open Chrome/Brave and go to `chrome://extensions`.
3. Enable "Developer mode" (top right).
4. Click "Load unpacked" and select the `extension/` folder.
5. Pin the UniIdent Autofill extension to your toolbar.
6. Click the icon to open the popup, login, and try autofill on any form page!

## File Structure
- `manifest.json` — Extension manifest (MV3)
- `popup.html` — Popup UI
- `popup.js` — Handles login, fetch, autofill
- `contentScript.js` — Detects and fills form fields
- `background.js` — Background logic (minimal)
- `style.css` — Minimal Tailwind-style CSS

## Notes
- Replace the mock `getUserData()` in `popup.js` with a real @dfinity/agent call for production.
- No data is stored in localStorage or synced to disk.
- For real Internet Identity login, integrate the official agent libraries.

---
Built with ❤️ for the Internet Computer 