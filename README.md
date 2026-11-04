# OHClicker

OHClicker is an auto-clicker desktop app built with Tauri (Rust backend) and React/TypeScript. It's designed for precise clicking automation with features like screen mapping, coordinate jitter, boundary boxes, and custom click sequences.

## Features

- **Rust backend:** Fast, low-latency click loops and global hotkey handling.
- **Visual screen mapping:** Multi-display support to pick coordinates and set bounding boxes visually.
- **Sequences and jitter:** Support for multi-step click lists and random coordinate offsets to mimic natural movement.
- **Dual views:** Switch between a full control panel (`ACAdvView`) and a compact mini widget (`ACMiniView`).
- **Native overlays:** Transparent click-through markers and boundary lines.
- **Profiles:** Save, load, and validate configuration files.
- **Global hotkeys:** Quick shortcuts to start/stop or trigger actions from anywhere.

## Tech Stack

- **Backend:** Rust, Tauri v2
- **Frontend:** React, TypeScript, Vite, Tailwind CSS