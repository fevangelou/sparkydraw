# SparkyDraw 🎨

A fast, lightweight, and delightful drawing web app designed for children using tablets, convertible laptops, or desktop computers.

Built with **pure Vanilla HTML5, CSS3, and JavaScript** — zero frameworks or build tools required. Ready to be hosted on GitHub Pages.

---

## ✨ Features

- **Pure Canvas Drawing Engine**:
  - Touch and stylus-friendly with full Pointer Events support.
  - Quadratic Bézier curve interpolation for smooth strokes without jagged lines.
  - High-DPI / Retina display support.
  - Touch-action optimization to prevent accidental scrolling, zooming, or gesture interference on tablets.
  - Dynamic brush cursor showing the active brush size and color.

- **Ubuntu-Style Left Dock**:
  - **12 Customizable Color Slots**: Rendered with **5px rounded borders** and subtle drop shadows.
  - **Color Picker Popover**: Click any color slot to select it and open the color picker flyout (using modern HTML `<input type="color">` and quick swatches) to customize that slot.
  - **Compact Brush Slot Button**: Uses a crisp SVG paintbrush icon with an indicator dot showing current color. Clicking it opens a dedicated **Brush Size Popover** with Photoshop-style dots (Fine 6px to Jumbo 52px) and a real-time stroke thickness preview.
  - **Reset UI Button**: Located below the brush selector to quickly restore default palette colors and brush size.

- **Windows RDP-Style Top Toolbar**:
  - Sleek, compact floating pill at the top of the screen.
  - **Fullscreen Toggle**: Uses the modern standard Fullscreen Web API (`requestFullscreen` / `exitFullscreen`) to hide all browser chrome and provide an immersive full-screen canvas (shortcut `F`).
  - **Save PNG Button**: Downloads the drawing directly to your local device with timestamped filenames formatted as `SparkyDraw_YYYYMMDD_HHmmss.png`.
  - **Undo & Redo**: Easy error recovery for young artists (plus `Ctrl+Z` / `Ctrl+Y` keyboard shortcuts).
  - **Clear Canvas**: With a gentle confirmation dialog to prevent accidental wipes.
  - **Help & Info Dialog**: Interactive modal with app overview, tips on how the left & top toolbars work, and version metadata (`v1.0 • 2026.09.29`).

- **Mobile & Tablet Friendly**:
  - **Portrait Mode**: Dock automatically transitions into a thumb-friendly horizontal dock at the bottom of the screen with touch scrolling and popovers opening upwards.
  - **Landscape Mode**: Left dock and top toolbar switch to ultra-compact layouts leaving maximum vertical height for drawing.
  - Safe orientation switching with offscreen canvas preservation.

- **Local Persistence (`localStorage`)**:
  - Remembers your custom colors, selected brush size, active color, and even artwork across page refreshes — no login required.

---

## 🚀 Running Locally

No installation or build steps are required. Simply open `index.html` in any modern web browser:

```bash
# Using Python 3 to serve locally:
python3 -m http.server 8080
```

Then visit: [http://localhost:8080](http://localhost:8080)

---

## 📁 File Structure

```text
SparkyDraw/
├── index.html    # App structure, top toolbar, left dock, canvas
├── app.css       # Ubuntu dock & RDP styles, responsive layouts
├── app.js        # Canvas drawing engine, color picker, local storage, export
└── README.md     # Documentation and usage guide
```
