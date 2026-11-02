# ACAutomate

ACAutomate is a Windows desktop auto-clicker built with Tauri, Rust, React, and TypeScript.

## Features

- Single-click and hold modes with configurable mouse button and CPS.
- Configurable startup delay, interval randomization, and button hold time.
- Fixed click-count and maximum-duration limits.
- Minimized and advanced control views.
- F6 global start/stop hotkey.

## Development

Install the root and frontend dependencies, then run the Tauri development app:

```powershell
npm install
npm --prefix ohautomate-ui install
npm run tauri dev
```

Create a production build with:

```powershell
npm run tauri build
```
