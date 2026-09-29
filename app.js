/**
 * SparkyDraw - Modern Drawing Web App for Kids
 * Vanilla HTML5, CSS3, & JavaScript
 */

(function () {
  'use strict';

  // --- Constants & Defaults ---
  const DEFAULT_COLORS = [
    '#1e1e1e', // Black
    '#e11d48', // Red
    '#ea580c', // Orange
    '#eab308', // Yellow
    '#16a34a', // Green
    '#059669', // Emerald
    '#0284c7', // Sky Blue
    '#2563eb', // Royal Blue
    '#7c3aed', // Purple
    '#db2777', // Pink
    '#78350f', // Brown
    '#ffffff'  // White (Eraser/Corrector)
  ];

  const QUICK_PALETTE = [
    '#000000', '#4b5563', '#9ca3af', '#ffffff',
    '#ef4444', '#f97316', '#f59e0b', '#84cc16',
    '#10b981', '#06b6d4', '#3b82f6', '#6366f1',
    '#8b5cf6', '#d946ef', '#ec4899', '#f43f5e'
  ];

  const BRUSH_SIZES = [
    { size: 6, dotSize: 6, label: 'Fine (6px)' },
    { size: 12, dotSize: 11, label: 'Small (12px)' },
    { size: 20, dotSize: 18, label: 'Default / Large (20px)' }, // Default big enough for kids
    { size: 34, dotSize: 26, label: 'Extra Large (34px)' },
    { size: 52, dotSize: 34, label: 'Jumbo (52px)' }
  ];

  const STORAGE_KEYS = {
    COLORS: 'sparkydraw_colors_v1',
    ACTIVE_COLOR_IDX: 'sparkydraw_active_color_v1',
    BRUSH_SIZE: 'sparkydraw_brush_size_v1',
    CANVAS_DATA: 'sparkydraw_canvas_data_v1'
  };

  // --- State ---
  let colors = [];
  let activeColorIndex = 0;
  let activeBrushSize = BRUSH_SIZES[2].size; // 20px default
  let isDrawing = false;
  let strokePoints = [];
  let editingSlotIndex = null;
  let undoStack = [];
  let redoStack = [];
  const MAX_UNDO_STACK = 25;

  // --- DOM Elements ---
  const canvas = document.getElementById('drawingCanvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const colorSlotsGrid = document.getElementById('colorSlotsGrid');
  const brushSizeGroup = document.getElementById('brushSizeGroup');
  const btnReset = document.getElementById('btnReset');
  const btnSave = document.getElementById('btnSave');
  const btnUndo = document.getElementById('btnUndo');
  const btnRedo = document.getElementById('btnRedo');
  const btnClear = document.getElementById('btnClear');
  const colorPopover = document.getElementById('colorPopover');
  const btnClosePopover = document.getElementById('btnClosePopover');
  const nativeColorInput = document.getElementById('nativeColorInput');
  const popoverPreviewSwatch = document.getElementById('popoverPreviewSwatch');
  const quickSwatchesContainer = document.getElementById('quickSwatches');
  const toastMessage = document.getElementById('toastMessage');
  const brushCursor = document.getElementById('brushCursor');
  const clearDialog = document.getElementById('clearDialog');
  const btnCancelClear = document.getElementById('btnCancelClear');
  const btnConfirmClear = document.getElementById('btnConfirmClear');
  const leftDock = document.getElementById('leftDock');

  // --- Initialization ---
  function init() {
    loadPreferences();
    renderColorSlots();
    renderBrushSizes();
    renderQuickSwatches();
    setupCanvas();
    setupEventListeners();
    updateUndoRedoButtons();
    updateBrushCursor();
  }

  // --- Storage & State Management ---
  function loadPreferences() {
    try {
      const savedColors = localStorage.getItem(STORAGE_KEYS.COLORS);
      colors = savedColors ? JSON.parse(savedColors) : [...DEFAULT_COLORS];
      if (!Array.isArray(colors) || colors.length !== 12) {
        colors = [...DEFAULT_COLORS];
      }

      const savedIdx = localStorage.getItem(STORAGE_KEYS.ACTIVE_COLOR_IDX);
      activeColorIndex = savedIdx !== null ? parseInt(savedIdx, 10) : 0;
      if (isNaN(activeColorIndex) || activeColorIndex < 0 || activeColorIndex >= colors.length) {
        activeColorIndex = 0;
      }

      const savedSize = localStorage.getItem(STORAGE_KEYS.BRUSH_SIZE);
      activeBrushSize = savedSize ? parseInt(savedSize, 10) : BRUSH_SIZES[2].size;
      if (!BRUSH_SIZES.some(b => b.size === activeBrushSize)) {
        activeBrushSize = BRUSH_SIZES[2].size;
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using defaults.', e);
      colors = [...DEFAULT_COLORS];
      activeColorIndex = 0;
      activeBrushSize = BRUSH_SIZES[2].size;
    }
  }

  function savePreferences() {
    try {
      localStorage.setItem(STORAGE_KEYS.COLORS, JSON.stringify(colors));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_COLOR_IDX, activeColorIndex.toString());
      localStorage.setItem(STORAGE_KEYS.BRUSH_SIZE, activeBrushSize.toString());
    } catch (e) {
      console.warn('Could not save preferences to localStorage.', e);
    }
  }

  function resetToDefaults() {
    colors = [...DEFAULT_COLORS];
    activeColorIndex = 0;
    activeBrushSize = BRUSH_SIZES[2].size;
    savePreferences();

    renderColorSlots();
    renderBrushSizes();
    closeColorPopover();
    updateBrushCursor();
    showToast('Colors and brush size reset to original!');
  }

  // --- UI Rendering ---
  function renderColorSlots() {
    colorSlotsGrid.innerHTML = '';
    colors.forEach((color, index) => {
      const slot = document.createElement('button');
      slot.type = 'button';
      slot.className = 'color-slot' + (index === activeColorIndex ? ' active' : '');
      slot.style.backgroundColor = color;
      slot.dataset.index = index;
      slot.dataset.color = color;
      slot.title = `Color ${index + 1}: ${color} (Click to select/change)`;
      slot.setAttribute('aria-label', `Color slot ${index + 1}, ${color}`);
      slot.setAttribute('role', 'radio');
      slot.setAttribute('aria-checked', index === activeColorIndex ? 'true' : 'false');

      const editIndicator = document.createElement('span');
      editIndicator.className = 'slot-edit-indicator';
      editIndicator.innerHTML = '✎';
      slot.appendChild(editIndicator);

      slot.addEventListener('click', (e) => {
        e.stopPropagation();
        handleColorSlotClick(index, slot);
      });

      // Double-click directly opens native color picker for power users
      slot.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        openNativePickerForSlot(index, slot);
      });

      colorSlotsGrid.appendChild(slot);
    });
  }

  function renderBrushSizes() {
    brushSizeGroup.innerHTML = '';
    BRUSH_SIZES.forEach((b) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'brush-size-btn' + (b.size === activeBrushSize ? ' active' : '');
      btn.title = b.label;
      btn.setAttribute('aria-label', b.label);
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', b.size === activeBrushSize ? 'true' : 'false');

      const dot = document.createElement('div');
      dot.className = 'brush-dot';
      dot.style.width = `${b.dotSize}px`;
      dot.style.height = `${b.dotSize}px`;

      btn.appendChild(dot);

      btn.addEventListener('click', () => {
        activeBrushSize = b.size;
        savePreferences();
        renderBrushSizes();
        updateBrushCursor();
        showToast(`Brush size set to ${b.label}`);
      });

      brushSizeGroup.appendChild(btn);
    });
  }

  function renderQuickSwatches() {
    quickSwatchesContainer.innerHTML = '';
    QUICK_PALETTE.forEach((hex) => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = 'quick-swatch-item';
      swatch.style.backgroundColor = hex;
      swatch.title = hex;
      swatch.setAttribute('aria-label', `Preset ${hex}`);
      swatch.addEventListener('click', () => {
        if (editingSlotIndex !== null) {
          updateSlotColor(editingSlotIndex, hex);
        }
      });
      quickSwatchesContainer.appendChild(swatch);
    });
  }

  // --- Color Selection & Popover ---
  function handleColorSlotClick(index, slotElement) {
    const isAlreadyActive = activeColorIndex === index;
    activeColorIndex = index;
    savePreferences();
    renderColorSlots();
    updateBrushCursor();

    // Show popup towards the toolbar (adjacent to clicked slot)
    openColorPopover(index, slotElement, isAlreadyActive);
  }

  function openNativePickerForSlot(index, slotElement) {
    editingSlotIndex = index;
    nativeColorInput.value = colors[index];
    if (typeof nativeColorInput.showPicker === 'function') {
      try {
        nativeColorInput.showPicker();
      } catch (err) {
        nativeColorInput.click();
      }
    } else {
      nativeColorInput.click();
    }
  }

  function openColorPopover(index, slotElement, isAlreadyActive) {
    editingSlotIndex = index;
    const currentColor = colors[index];

    nativeColorInput.value = currentColor;
    popoverPreviewSwatch.style.backgroundColor = currentColor;

    const dockRect = leftDock.getBoundingClientRect();
    const slotRect = slotElement.getBoundingClientRect();

    // Position flyout directly adjacent to the dock toolbar, aligned with the clicked slot
    const popoverLeft = dockRect.right + 10;
    let popoverTop = slotRect.top - 15;

    // Prevent vertical overflow beyond viewport
    const maxTop = window.innerHeight - 250;
    if (popoverTop > maxTop) popoverTop = maxTop;
    if (popoverTop < 10) popoverTop = 10;

    colorPopover.style.left = `${popoverLeft}px`;
    colorPopover.style.top = `${popoverTop}px`;
    colorPopover.hidden = false;

    // Position the little arrow to point straight to the slot
    const arrow = colorPopover.querySelector('.popover-arrow');
    if (arrow) {
      const arrowRelativeTop = Math.max(12, Math.min(220, slotRect.top - popoverTop + (slotRect.height / 2) - 7));
      arrow.style.top = `${arrowRelativeTop}px`;
    }

    // If user clicked the already active slot, also open the native picker immediately
    if (isAlreadyActive) {
      if (typeof nativeColorInput.showPicker === 'function') {
        try {
          nativeColorInput.showPicker();
        } catch (e) {
          // ignore if user cancelled or blocked
        }
      }
    }
  }

  function closeColorPopover() {
    colorPopover.hidden = true;
    editingSlotIndex = null;
  }

  function updateSlotColor(index, newColor) {
    if (index >= 0 && index < colors.length) {
      colors[index] = newColor;
      nativeColorInput.value = newColor;
      popoverPreviewSwatch.style.backgroundColor = newColor;
      savePreferences();
      renderColorSlots();
      updateBrushCursor();
    }
  }

  // --- Canvas & Drawing Engine ---
  let dpr = 1;

  function setupCanvas() {
    dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Cache current content if resizing
    let cachedImage = null;
    if (canvas.width > 0 && canvas.height > 0) {
      try {
        cachedImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      } catch (e) {
        // Ignored
      }
    }

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (cachedImage) {
      ctx.putImageData(cachedImage, 0, 0);
    } else {
      // Check if we have a saved drawing in localStorage
      const savedDataUrl = localStorage.getItem(STORAGE_KEYS.CANVAS_DATA);
      if (savedDataUrl) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          saveCanvasSnapshot(); // Start undo history with loaded drawing
        };
        img.src = savedDataUrl;
      } else {
        clearCanvasInternal(false);
        saveCanvasSnapshot();
      }
    }
  }

  function clearCanvasInternal(recordUndo = true) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    if (recordUndo) {
      saveCanvasSnapshot();
      persistCanvas();
    }
  }

  function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function startDrawing(e) {
    // Only draw on primary mouse button or touch/pen
    if (e.button !== undefined && e.button !== 0) return;

    isDrawing = true;
    closeColorPopover();

    try {
      canvas.setPointerCapture(e.pointerId);
    } catch (err) {
      // Pointer capture fallback
    }

    const pos = getCanvasCoordinates(e);
    strokePoints = [pos];

    ctx.beginPath();
    ctx.strokeStyle = colors[activeColorIndex];
    ctx.fillStyle = colors[activeColorIndex];
    ctx.lineWidth = activeBrushSize;

    // Draw single dot in case of tap/click without drag
    ctx.arc(pos.x, pos.y, activeBrushSize / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  }

  function drawMove(e) {
    updateBrushCursorPos(e.clientX, e.clientY);

    if (!isDrawing) return;

    const pos = getCanvasCoordinates(e);
    strokePoints.push(pos);

    ctx.strokeStyle = colors[activeColorIndex];
    ctx.lineWidth = activeBrushSize;

    if (strokePoints.length === 2) {
      const p1 = strokePoints[0];
      const p2 = strokePoints[1];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    } else if (strokePoints.length > 2) {
      // Quadratic bezier curve interpolation between midpoints for ultra smooth strokes
      const lastIdx = strokePoints.length - 1;
      const p0 = strokePoints[lastIdx - 2];
      const p1 = strokePoints[lastIdx - 1];
      const p2 = strokePoints[lastIdx];

      const mid1 = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
      const mid2 = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      ctx.beginPath();
      ctx.moveTo(mid1.x, mid1.y);
      ctx.quadraticCurveTo(p1.x, p1.y, mid2.x, mid2.y);
      ctx.stroke();
    }
  }

  function stopDrawing(e) {
    if (!isDrawing) return;
    isDrawing = false;
    strokePoints = [];

    if (e && e.pointerId) {
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Ignore
      }
    }

    saveCanvasSnapshot();
    persistCanvas();
  }

  // --- Undo / Redo System ---
  function saveCanvasSnapshot() {
    try {
      const dataUrl = canvas.toDataURL('image/png');
      undoStack.push(dataUrl);
      if (undoStack.length > MAX_UNDO_STACK) {
        undoStack.shift();
      }
      redoStack = []; // Clear redo stack on new action
      updateUndoRedoButtons();
    } catch (err) {
      console.warn('Could not save canvas snapshot', err);
    }
  }

  function undo() {
    if (undoStack.length <= 1) return; // Keep at least the initial white state

    const current = undoStack.pop();
    redoStack.push(current);

    const previousDataUrl = undoStack[undoStack.length - 1];
    restoreCanvasFromDataUrl(previousDataUrl);
    updateUndoRedoButtons();
    persistCanvas();
    showToast('Undo');
  }

  function redo() {
    if (redoStack.length === 0) return;

    const nextDataUrl = redoStack.pop();
    undoStack.push(nextDataUrl);

    restoreCanvasFromDataUrl(nextDataUrl);
    updateUndoRedoButtons();
    persistCanvas();
    showToast('Redo');
  }

  function restoreCanvasFromDataUrl(dataUrl) {
    const img = new Image();
    img.onload = () => {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    };
    img.src = dataUrl;
  }

  function updateUndoRedoButtons() {
    btnUndo.disabled = undoStack.length <= 1;
    btnRedo.disabled = redoStack.length === 0;
  }

  let persistTimer = null;
  function persistCanvas() {
    clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      try {
        const dataUrl = canvas.toDataURL('image/png');
        localStorage.setItem(STORAGE_KEYS.CANVAS_DATA, dataUrl);
      } catch (err) {
        // LocalStorage quota might be exceeded for high-res images
      }
    }, 400);
  }

  // --- Saving Local PNG Image (SparkyDraw_YYYYMMDD_HHmmss.png) ---
  function saveDrawingToPNG() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    // Format: SparkyDraw_YYYYMMDD_HHmmss.png
    const filename = `SparkyDraw_${year}${month}${day}_${hours}${minutes}${seconds}.png`;

    try {
      // Export a clean white-backed canvas
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvas.width;
      exportCanvas.height = canvas.height;
      const exportCtx = exportCanvas.getContext('2d');

      // Fill pure white background
      exportCtx.fillStyle = '#ffffff';
      exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

      // Draw current artwork
      exportCtx.drawImage(canvas, 0, 0);

      const dataUrl = exportCanvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = filename;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      showToast(`Saved as ${filename}! ✨`);
    } catch (err) {
      console.error('Failed to export image', err);
      showToast('Error saving image. Please try again.');
    }
  }

  // --- Interactive Brush Cursor Follower ---
  function updateBrushCursor() {
    const activeColor = colors[activeColorIndex];
    brushCursor.style.width = `${activeBrushSize}px`;
    brushCursor.style.height = `${activeBrushSize}px`;
    brushCursor.style.backgroundColor = activeColor;
    
    // Provide nice outline contrast for white/dark colors
    if (activeColor.toLowerCase() === '#ffffff' || activeColor.toLowerCase() === '#fff') {
      brushCursor.style.borderColor = 'rgba(0, 0, 0, 0.6)';
    } else {
      brushCursor.style.borderColor = 'rgba(255, 255, 255, 0.9)';
    }
  }

  function updateBrushCursorPos(x, y) {
    brushCursor.style.left = `${x}px`;
    brushCursor.style.top = `${y}px`;
  }

  // --- Toast Notifications ---
  let toastTimer = null;
  function showToast(text) {
    toastMessage.textContent = text;
    toastMessage.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.hidden = true;
    }, 2400);
  }

  // --- Event Listeners ---
  function setupEventListeners() {
    // Canvas Pointer Events (Touch, Mouse, Pen)
    canvas.addEventListener('pointerdown', startDrawing);
    canvas.addEventListener('pointermove', drawMove);
    canvas.addEventListener('pointerup', stopDrawing);
    canvas.addEventListener('pointercancel', stopDrawing);
    canvas.addEventListener('pointerleave', () => {
      brushCursor.classList.remove('active');
    });
    canvas.addEventListener('pointerenter', () => {
      brushCursor.classList.add('active');
    });

    // Prevent context menu on long-press (tablet friendly)
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // Native Color Input
    nativeColorInput.addEventListener('input', (e) => {
      if (editingSlotIndex !== null) {
        updateSlotColor(editingSlotIndex, e.target.value);
      }
    });

    nativeColorInput.addEventListener('change', (e) => {
      if (editingSlotIndex !== null) {
        updateSlotColor(editingSlotIndex, e.target.value);
      }
    });

    // Close popover
    btnClosePopover.addEventListener('click', closeColorPopover);
    document.addEventListener('click', (e) => {
      if (!colorPopover.hidden && !colorPopover.contains(e.target) && !leftDock.contains(e.target)) {
        closeColorPopover();
      }
    });

    // Reset button
    btnReset.addEventListener('click', resetToDefaults);

    // Save PNG button
    btnSave.addEventListener('click', saveDrawingToPNG);

    // Undo / Redo
    btnUndo.addEventListener('click', undo);
    btnRedo.addEventListener('click', redo);

    // Clear Canvas Dialog
    btnClear.addEventListener('click', () => {
      clearDialog.hidden = false;
    });

    btnCancelClear.addEventListener('click', () => {
      clearDialog.hidden = true;
    });

    btnConfirmClear.addEventListener('click', () => {
      clearDialog.hidden = true;
      clearCanvasInternal(true);
      showToast('Canvas cleared!');
    });

    clearDialog.addEventListener('click', (e) => {
      if (e.target === clearDialog) {
        clearDialog.hidden = true;
      }
    });

    // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDrawingToPNG();
      } else if (e.key === 'Escape') {
        closeColorPopover();
        clearDialog.hidden = true;
      }
    });

    // Window Resize / Orientation Change
    let resizeTimer = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setupCanvas();
      }, 150);
    });
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
