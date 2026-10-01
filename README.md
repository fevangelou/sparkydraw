# SparkyDraw 🎨

> **Live Web App:** [https://sparkydraw.app](https://sparkydraw.app)

SparkyDraw is a simple, delightful drawing web app designed for children (and not only!), compatible with any device and screen format (touch, pen/pointer & mouse friendly) and in any orientation. It remembers your artwork and settings across visits, exports high-resolution PNG images locally and adapts easily in small or big screens, in both portrait and landscape modes!

Built with **vanilla HTML, CSS & JS** — zero external frameworks, libraries or build tools.

---

## ✨ Features

- **Pure Canvas Drawing Engine**:
    - **Multi-Input Support**: Smooth drawing with touch, stylus/pen, or mouse using standard Pointer Events.
    - **Smooth Interpolation**: Quadratic Bézier curve smoothing for natural, fluid strokes without jagged lines or gaps.
    - **High-DPI / Retina Ready**: Automatically scales with `window.devicePixelRatio` for razor-sharp rendering on modern displays.
    - **Touch-Action Optimization**: Prevents accidental zooming, pinch gestures, or page scrolling while drawing.
    - **Dynamic Brush Cursor**: Interactive cursor displaying real-time stroke thickness and active color.
    - **Intelligent Orientation Auto-Fit**: When rotating between portrait and landscape (or resizing screens), the app automatically scans the artwork bounds; if strokes would overflow the new viewport, it scales and centers the drawing seamlessly so no artwork is ever clipped off-canvas.

- **Adaptive Colors & Brush Toolbar**:
    - **12 Customizable Color Slots**: Rendered with rounded borders, active glow indicators, and subtle drop shadows.
    - **Color Picker Popover**: Click any color slot to choose that color, or click it again to open the color picker flyout (with a native `<input type="color">` and 16 quick kid-friendly swatches) to customize that slot.
    - **Scrollable Colors & Pinned Tools**: Only the color swatches scroll on smaller screens, keeping the Brush and Reset buttons always visible and accessible across all devices.
    - **Brush Size Selector**: Clean SVG paintbrush icon that opens a roomy, touch-padded **Brush Size Popover** featuring 5 sizes (Fine 6px, Small 12px, Medium 20px, Large 34px, Jumbo 52px), generous 44px tap targets, and a real-time stroke thickness preview.
    - **Reset UI Button**: Easily restore the default 12 color slots and default brush size with a single tap.

- **Floating Top Toolbar**:
    - **Undo & Redo**: Multi-step history stack (up to 25 actions) with automatic button state management.
    - **Clear Canvas Dialog**: Prevents accidental wipes with a gentle confirmation modal before clearing.
    - **Fullscreen Mode**: Utilizes the modern Fullscreen Web API (`requestFullscreen` / `exitFullscreen`) to hide browser chrome for distraction-free drawing (keyboard shortcut `F`).
    - **Save Button**: Downloads the artwork directly to your device as a crisp, high-resolution PNG with timestamped filenames (`SparkyDraw_YYYYMMDD_HHmmss.png`).
    - **Language Selector**: Top toolbar menu with crisp vector SVG flags and native language names.
    - **Help & Info Modal**: Overview dialog with SparkyDraw branding, toolbar guides, and version metadata (`v1.0 • 2026.09.29`).

- **Multi-Lingual Support (i18n)**:
    - **7 Supported Languages**: English (`en`), Greek (`el`), Italian (`it`), Spanish (`es`), French (`fr`), German (`de`), and Arabic (`ar`).
    - **Automatic Language Detection**: Detects the browser/OS language on page load with default fallback to English.
    - **Scoped Arabic RTL**: Right-To-Left text layout is gracefully applied specifically to the Help/Info dialog when Arabic is selected, keeping the canvas and toolbars unified.
    - **Complete Localization**: All button labels, tooltips, dialogs, popovers, and toast notifications adapt dynamically in real-time.

- **Mobile & Tablet Optimized**:
    - **Adaptive Layouts**: Automatically switches between a desktop/landscape left dock and a thumb-friendly bottom horizontal dock in mobile portrait mode.
    - **Popovers That Adapt**: Color and brush popovers dynamically open upwards from bottom docks or to the side from vertical docks.
    - **Overflow & Text Protection**: Button labels use `white-space: nowrap` and CSS line-clamping to prevent awkward wrapping across all supported languages.

- **Persistent Drawing Memory (`localStorage` + `IndexedDB`)**:
    - **Accidental Refresh Protection**: Continuously saves drawing data and synchronously flushes before `beforeunload` / `pagehide`, ensuring artwork is preserved even on unexpected page reloads.
    - **Dual-Tier Storage Architecture**: Saves to `localStorage` with intelligent compression fallback, coupled with an automatic **IndexedDB** (`SparkyDrawDB`) backing store to eliminate 5MB quota restrictions on ultra-high-resolution screens.
    - **Preferences Saved**: Remembers customized color slots, active color index, selected brush size, and chosen language.

- **Progressive Web App (PWA) & Offline-First Engine**:
    - **True Offline Support**: Powered by a Service Worker (`sw.js`) that pre-caches the complete application shell and runtime-caches web fonts, allowing instant launch without any internet connection (even in Airplane mode).
    - **Installable Native App Experience**: Includes a Web App Manifest (`manifest.webmanifest`) enabling "Add to Home Screen" / "Install App" on Android, iOS, Windows, macOS, and ChromeOS with standalone window display.
    - **Full-Logo Splash Screen**: Features an in-app and native PWA boot splash screen displaying the golden glowing star and gradient "SparkyDraw" brand typography, providing an instant native startup experience.

---

## ⌨️ Keyboard Shortcuts

| Shortcut                                     | Action                         |
| :------------------------------------------- | :----------------------------- |
| `Ctrl + Z` / `Cmd + Z`                       | Undo last stroke               |
| `Ctrl + Y` / `Cmd + Y` or `Ctrl + Shift + Z` | Redo stroke                    |
| `Ctrl + S` / `Cmd + S`                       | Save image to local PNG        |
| `F`                                          | Toggle Fullscreen mode         |
| `Esc`                                        | Close open popovers or dialogs |

---

## 🚀 Running Locally

No installation or build steps are required. Simply open `index.html` in any modern web browser or serve it via a local static web server:

```bash
# Using Python 3:
python3 -m http.server 8080

# Or using Node.js:
npx serve .
```

Then visit: [http://localhost:8080](http://localhost:8080) or open [https://sparkydraw.app](https://sparkydraw.app).

---

## 📁 File Structure

```text
SparkyDraw/
├── index.html            # Semantic HTML5 markup, splash screen, toolbars, popovers, canvas
├── app.css               # Design tokens, splash animations, responsive layouts, RTL styles
├── app.js                # Drawing engine, pointer events, undo/redo, PWA registration, storage
├── i18n.js               # Localization dictionary, vector SVG flags, language detection
├── sw.js                 # Service worker: offline pre-caching, runtime font caching
├── manifest.webmanifest  # PWA manifest: standalone display, metadata, icons
├── favicon.svg           # Vector star icon favicon
├── icons/                # High-resolution PWA icons (192px, 512px, maskable, apple-touch-icon)
└── README.md             # Documentation, feature guide, and shortcuts
```

---

## 📄 License

Open-source web application for educational, personal, and creative drawing.
