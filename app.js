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
        { size: 6, dotSize: 6, key: 'brushFine', fallback: 'Fine (6px)' },
        { size: 12, dotSize: 11, key: 'brushSmall', fallback: 'Small (12px)' },
        { size: 20, dotSize: 18, key: 'brushMedium', fallback: 'Default / Large (20px)' }, // Default big enough for kids
        { size: 34, dotSize: 26, key: 'brushLarge', fallback: 'Extra Large (34px)' },
        { size: 52, dotSize: 34, key: 'brushJumbo', fallback: 'Jumbo (52px)' }
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
    let isCanvasInitialized = false;
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
    const btnFullscreen = document.getElementById('btnFullscreen');
    const btnHelp = document.getElementById('btnHelp');
    const helpDialog = document.getElementById('helpDialog');
    const btnCloseHelp = document.getElementById('btnCloseHelp');
    const btnGotIt = document.getElementById('btnGotIt');
    const btnBrushSlot = document.getElementById('btnBrushSlot');
    const brushPopover = document.getElementById('brushPopover');
    const btnCloseBrushPopover = document.getElementById('btnCloseBrushPopover');
    const brushPreviewCircle = document.getElementById('brushPreviewCircle');
    const brushPreviewValue = document.getElementById('brushPreviewValue');
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

    // --- i18n DOM Elements ---
    const btnLang = document.getElementById('btnLang');
    const lblLang = document.getElementById('lblLang');
    const currentFlag = document.getElementById('currentFlag');
    const langPopover = document.getElementById('langPopover');
    const langList = document.getElementById('langList');
    const lblUndo = document.getElementById('lblUndo');
    const lblRedo = document.getElementById('lblRedo');
    const lblClear = document.getElementById('lblClear');
    const lblFullscreen = document.getElementById('lblFullscreen');
    const lblHelp = document.getElementById('lblHelp');
    const lblSave = document.getElementById('lblSave');
    const dockColorsTitle = document.getElementById('dockColorsTitle');
    const dockBrushTitle = document.getElementById('dockBrushTitle');
    const lblReset = document.getElementById('lblReset');
    const lblColorPopoverTitle = document.getElementById('lblColorPopoverTitle');
    const lblPickAnyColor = document.getElementById('lblPickAnyColor');
    const lblBrushPopoverTitle = document.getElementById('lblBrushPopoverTitle');
    const lblBrushSizePreview = document.getElementById('lblBrushSizePreview');
    const clearDialogTitle = document.getElementById('clearDialogTitle');
    const helpIntro = document.getElementById('helpIntro');
    const helpLeftTitle = document.getElementById('helpLeftTitle');
    const helpLeftColors = document.getElementById('helpLeftColors');
    const helpLeftBrush = document.getElementById('helpLeftBrush');
    const helpLeftReset = document.getElementById('helpLeftReset');
    const helpTopTitle = document.getElementById('helpTopTitle');
    const helpTopUndo = document.getElementById('helpTopUndo');
    const helpTopClear = document.getElementById('helpTopClear');
    const helpTopFullscreen = document.getElementById('helpTopFullscreen');
    const helpTopSave = document.getElementById('helpTopSave');

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
        updateBrushSlotUI();
        updateFullscreenUI();
        applyTranslations();
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
        updateBrushSlotUI();
        closeAllPopovers();
        updateBrushCursor();
        showToast(I18N.t('toastReset'));
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
        if (!brushSizeGroup) return;
        brushSizeGroup.innerHTML = '';
        BRUSH_SIZES.forEach((b) => {
            const label = I18N.t(b.key);
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'brush-size-btn' + (b.size === activeBrushSize ? ' active' : '');
            btn.title = label;
            btn.setAttribute('aria-label', label);
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
                updateBrushSlotUI();
                updateBrushCursor();
                showToast(I18N.t('toastBrushSize', { size: label }));
            });

            brushSizeGroup.appendChild(btn);
        });

        // Update live preview in brush popover
        if (brushPreviewCircle) {
            brushPreviewCircle.style.width = `${activeBrushSize}px`;
            brushPreviewCircle.style.height = `${activeBrushSize}px`;
            brushPreviewCircle.style.backgroundColor = colors[activeColorIndex];
        }
        if (brushPreviewValue) {
            brushPreviewValue.textContent = `${activeBrushSize} px`;
        }
    }

    function updateBrushSlotUI() {
        if (!btnBrushSlot) return;
        const sizeTitle = I18N.t('brushSlotTitle', { size: activeBrushSize });
        btnBrushSlot.title = sizeTitle;
        btnBrushSlot.setAttribute('aria-label', sizeTitle);
        btnBrushSlot.classList.toggle('active', brushPopover && !brushPopover.hidden);
    }

    function openBrushPopover() {
        closeColorPopover(); // Mutual exclusion with color popover

        const isCurrentlyOpen = !brushPopover.hidden;
        if (isCurrentlyOpen) {
            closeBrushPopover();
            return;
        }

        const dockRect = leftDock.getBoundingClientRect();
        const slotRect = btnBrushSlot.getBoundingClientRect();
        const isBottomDock = dockRect.top > window.innerHeight - 130 || dockRect.width > dockRect.height * 1.5;

        brushPopover.hidden = false;
        btnBrushSlot.classList.add('active');

        const popoverWidth = brushPopover.offsetWidth || 256;
        const popoverHeight = brushPopover.offsetHeight || 160;
        const arrow = brushPopover.querySelector('.popover-arrow');

        if (isBottomDock) {
            // Position above the brush button in mobile portrait mode
            brushPopover.classList.add('arrow-bottom');
            brushPopover.classList.remove('arrow-left');

            let popoverLeft = slotRect.left + (slotRect.width / 2) - (popoverWidth / 2);
            popoverLeft = Math.max(8, Math.min(window.innerWidth - popoverWidth - 8, popoverLeft));

            let popoverTop = dockRect.top - popoverHeight - 12;
            if (popoverTop < 10) popoverTop = 10;

            brushPopover.style.left = `${popoverLeft}px`;
            brushPopover.style.top = `${popoverTop}px`;

            if (arrow) {
                const arrowX = Math.max(16, Math.min(popoverWidth - 16, slotRect.left + (slotRect.width / 2) - popoverLeft));
                arrow.style.left = `${arrowX}px`;
                arrow.style.top = 'auto';
                arrow.style.bottom = '-7px';
            }
        } else {
            // Position to the right of the brush button in landscape / desktop mode
            brushPopover.classList.add('arrow-left');
            brushPopover.classList.remove('arrow-bottom');

            let popoverLeft = dockRect.right + 10;
            if (popoverLeft + popoverWidth > window.innerWidth - 8) {
                popoverLeft = window.innerWidth - popoverWidth - 8;
            }

            let popoverTop = slotRect.top - 15;
            const maxTop = window.innerHeight - popoverHeight - 10;
            if (popoverTop > maxTop) popoverTop = maxTop;
            if (popoverTop < 10) popoverTop = 10;

            brushPopover.style.left = `${popoverLeft}px`;
            brushPopover.style.top = `${popoverTop}px`;

            if (arrow) {
                const arrowY = Math.max(12, Math.min(popoverHeight - 16, slotRect.top - popoverTop + (slotRect.height / 2) - 7));
                arrow.style.left = '-7px';
                arrow.style.top = `${arrowY}px`;
                arrow.style.bottom = 'auto';
            }
        }

        renderBrushSizes();
    }

    function closeBrushPopover() {
        if (brushPopover) {
            brushPopover.hidden = true;
        }
        if (btnBrushSlot) {
            btnBrushSlot.classList.remove('active');
        }
    }

    function closeAllPopovers() {
        closeColorPopover();
        closeBrushPopover();
        closeLanguagePopover();
    }

    // --- Language Selector & Translations ---
    function openLanguagePopover() {
        closeColorPopover();
        closeBrushPopover();

        const isCurrentlyOpen = !langPopover.hidden;
        if (isCurrentlyOpen) {
            closeLanguagePopover();
            return;
        }

        renderLanguageMenu();
        langPopover.hidden = false;
        btnLang.setAttribute('aria-expanded', 'true');

        const btnRect = btnLang.getBoundingClientRect();
        const popoverWidth = 185;
        let popoverLeft = btnRect.left + (btnRect.width / 2) - (popoverWidth / 2);
        popoverLeft = Math.max(8, Math.min(window.innerWidth - popoverWidth - 8, popoverLeft));
        const popoverTop = btnRect.bottom + 8;

        langPopover.style.left = `${popoverLeft}px`;
        langPopover.style.top = `${popoverTop}px`;
    }

    function closeLanguagePopover() {
        if (langPopover) {
            langPopover.hidden = true;
        }
        if (btnLang) {
            btnLang.setAttribute('aria-expanded', 'false');
        }
    }

    function renderLanguageMenu() {
        if (!langList) return;
        langList.innerHTML = '';
        const current = I18N.getLanguage();

        I18N.getLanguages().forEach((l) => {
            const item = document.createElement('button');
            item.type = 'button';
            item.className = 'lang-item' + (l.code === current ? ' active' : '');
            item.setAttribute('role', 'menuitem');
            item.setAttribute('data-code', l.code);
            item.innerHTML = `
                <span class="lang-flag-box">${I18N.getFlagSvg(l.code)}</span>
                <span class="lang-names">
                    <span class="lang-name-native">${l.native}</span>
                    <span class="lang-name-en">${l.name}</span>
                </span>
                <svg class="lang-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                selectLanguage(l.code);
            });
            langList.appendChild(item);
        });
    }

    function selectLanguage(code) {
        I18N.setLanguage(code);
        applyTranslations();
        closeLanguagePopover();
        const langObj = I18N.getLanguages().find(l => l.code === code) || { name: code };
        showToast(I18N.t('toastLangChanged', { lang: langObj.name }));
    }

    function formatHelpBullet(element, text) {
        if (!element) return;
        const colonIdx = text.indexOf(':');
        if (colonIdx !== -1) {
            const title = text.slice(0, colonIdx).trim();
            const desc = text.slice(colonIdx + 1).trim();
            element.innerHTML = `<strong>${title}:</strong> ${desc}`;
        } else {
            element.textContent = text;
        }
    }

    function applyTranslations() {
        const lang = I18N.getLanguage();
        document.documentElement.lang = lang;

        // Current flag & top bar language label
        if (currentFlag) currentFlag.innerHTML = I18N.getFlagSvg(lang);
        if (lblLang) lblLang.textContent = lang.toUpperCase();
        if (btnLang) btnLang.title = I18N.t('language');

        // Top toolbar buttons
        if (btnUndo) btnUndo.title = I18N.t('undoTitle');
        if (lblUndo) lblUndo.textContent = I18N.t('undo');
        if (btnRedo) btnRedo.title = I18N.t('redoTitle');
        if (lblRedo) lblRedo.textContent = I18N.t('redo');
        if (btnClear) btnClear.title = I18N.t('clearTitle');
        if (lblClear) lblClear.textContent = I18N.t('clear');
        updateFullscreenUI();
        if (btnHelp) btnHelp.title = I18N.t('helpTitle');
        if (lblHelp) lblHelp.textContent = I18N.t('help');
        if (btnSave) btnSave.title = I18N.t('savePngTitle');
        if (lblSave) lblSave.textContent = I18N.t('savePng');

        // Left dock
        if (dockColorsTitle) dockColorsTitle.textContent = I18N.t('colorsTitle');
        if (dockBrushTitle) dockBrushTitle.textContent = I18N.t('brushTitle');
        updateBrushSlotUI();
        if (btnReset) btnReset.title = I18N.t('resetTitle');
        if (lblReset) lblReset.textContent = I18N.t('reset');

        // Color & Brush popovers
        if (lblColorPopoverTitle) lblColorPopoverTitle.textContent = I18N.t('changeColor');
        if (lblPickAnyColor) lblPickAnyColor.textContent = I18N.t('pickAnyColor');
        if (lblBrushPopoverTitle) lblBrushPopoverTitle.textContent = I18N.t('brushSizeHeading');
        if (lblBrushSizePreview) lblBrushSizePreview.textContent = I18N.t('sizeLabel');

        // Clear Dialog
        if (clearDialogTitle) clearDialogTitle.textContent = I18N.t('clearDialogTitle');
        const clearDesc = clearDialog ? clearDialog.querySelector('.dialog-text') : null;
        if (clearDesc) clearDesc.textContent = I18N.t('clearDialogText');
        if (btnCancelClear) btnCancelClear.textContent = I18N.t('keepDrawing');
        if (btnConfirmClear) btnConfirmClear.textContent = I18N.t('clearCanvas');

        // Help Modal
        if (helpIntro) helpIntro.textContent = I18N.t('helpIntro');
        if (helpLeftTitle) helpLeftTitle.textContent = I18N.t('helpLeftTitle');
        formatHelpBullet(helpLeftColors, I18N.t('helpLeftColors'));
        formatHelpBullet(helpLeftBrush, I18N.t('helpLeftBrush'));
        formatHelpBullet(helpLeftReset, I18N.t('helpLeftReset'));
        if (helpTopTitle) helpTopTitle.textContent = I18N.t('helpTopTitle');
        formatHelpBullet(helpTopUndo, I18N.t('helpTopUndo'));
        formatHelpBullet(helpTopClear, I18N.t('helpTopClear'));
        formatHelpBullet(helpTopFullscreen, I18N.t('helpTopFullscreen'));
        formatHelpBullet(helpTopSave, I18N.t('helpTopSave'));
        if (btnGotIt) btnGotIt.textContent = I18N.t('gotIt');

        // Re-render brush sizes to update tooltips/labels
        renderBrushSizes();
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
        closeBrushPopover(); // Mutual exclusion with brush popover
        editingSlotIndex = index;
        const currentColor = colors[index];

        nativeColorInput.value = currentColor;
        popoverPreviewSwatch.style.backgroundColor = currentColor;

        const dockRect = leftDock.getBoundingClientRect();
        const slotRect = slotElement.getBoundingClientRect();
        const isBottomDock = dockRect.top > window.innerHeight - 130 || dockRect.width > dockRect.height * 1.5;

        colorPopover.hidden = false;
        const popoverWidth = 220;
        const popoverHeight = colorPopover.offsetHeight || 190;
        const arrow = colorPopover.querySelector('.popover-arrow');

        if (isBottomDock) {
            // Bottom dock in mobile portrait mode -> place popover ABOVE the slot
            colorPopover.classList.add('arrow-bottom');
            colorPopover.classList.remove('arrow-left');

            let popoverLeft = slotRect.left + (slotRect.width / 2) - (popoverWidth / 2);
            popoverLeft = Math.max(8, Math.min(window.innerWidth - popoverWidth - 8, popoverLeft));

            let popoverTop = dockRect.top - popoverHeight - 12;
            if (popoverTop < 10) popoverTop = 10;

            colorPopover.style.left = `${popoverLeft}px`;
            colorPopover.style.top = `${popoverTop}px`;

            if (arrow) {
                const arrowX = Math.max(16, Math.min(popoverWidth - 16, slotRect.left + (slotRect.width / 2) - popoverLeft));
                arrow.style.left = `${arrowX}px`;
                arrow.style.top = 'auto';
                arrow.style.bottom = '-7px';
            }
        } else {
            // Left dock in desktop or landscape mode -> place popover to the RIGHT of dock
            colorPopover.classList.add('arrow-left');
            colorPopover.classList.remove('arrow-bottom');

            let popoverLeft = dockRect.right + 10;
            if (popoverLeft + popoverWidth > window.innerWidth - 8) {
                popoverLeft = window.innerWidth - popoverWidth - 8;
            }

            let popoverTop = slotRect.top - 15;
            const maxTop = window.innerHeight - popoverHeight - 10;
            if (popoverTop > maxTop) popoverTop = maxTop;
            if (popoverTop < 10) popoverTop = 10;

            colorPopover.style.left = `${popoverLeft}px`;
            colorPopover.style.top = `${popoverTop}px`;

            if (arrow) {
                const arrowY = Math.max(12, Math.min(popoverHeight - 16, slotRect.top - popoverTop + (slotRect.height / 2) - 7));
                arrow.style.left = '-7px';
                arrow.style.top = `${arrowY}px`;
                arrow.style.bottom = 'auto';
            }
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
            updateBrushSlotUI();
            updateBrushCursor();
            if (brushPreviewCircle) {
                brushPreviewCircle.style.backgroundColor = newColor;
            }
        }
    }

    // --- Canvas & Drawing Engine ---
    let dpr = 1;

    function setupCanvas() {
        dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Cache current content to offscreen canvas before resizing (ONLY once initialized, on resize/rotation)
        let tempCanvas = null;
        if (isCanvasInitialized && canvas.width > 0 && canvas.height > 0) {
            tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(canvas, 0, 0);
        }

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Clear to white background
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        if (tempCanvas) {
            // Restore cached drawing seamlessly without clipping or distorting on window resize / orientation change
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(tempCanvas, 0, 0);
            ctx.restore();
        } else {
            // Initial page load or browser refresh: restore from persistent drawing memory
            restoreSavedCanvas();
        }

        isCanvasInitialized = true;
    }

    function clearCanvasInternal(recordUndo = true) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.restore();

        try {
            localStorage.removeItem(STORAGE_KEYS.CANVAS_DATA);
        } catch (e) { }
        clearFromIndexedDB();

        if (recordUndo) {
            saveCanvasSnapshot();
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
        closeAllPopovers();

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
        showToast(I18N.t('toastUndo'));
    }

    function redo() {
        if (redoStack.length === 0) return;

        const nextDataUrl = redoStack.pop();
        undoStack.push(nextDataUrl);

        restoreCanvasFromDataUrl(nextDataUrl);
        updateUndoRedoButtons();
        persistCanvas();
        showToast(I18N.t('toastRedo'));
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

    // --- IndexedDB Backing Store (Quota-Free Canvas Storage) ---
    const IDB_NAME = 'SparkyDrawDB';
    const IDB_STORE = 'canvas_store';
    const IDB_KEY = 'latest_drawing';

    function openIndexedDB(callback) {
        if (!window.indexedDB) {
            callback(null);
            return;
        }
        try {
            const req = indexedDB.open(IDB_NAME, 1);
            req.onupgradeneeded = () => {
                const db = req.result;
                if (!db.objectStoreNames.contains(IDB_STORE)) {
                    db.createObjectStore(IDB_STORE);
                }
            };
            req.onsuccess = () => callback(req.result);
            req.onerror = () => callback(null);
        } catch (e) {
            callback(null);
        }
    }

    function saveToIndexedDB(dataUrl) {
        openIndexedDB((db) => {
            if (!db) return;
            try {
                const tx = db.transaction(IDB_STORE, 'readwrite');
                tx.objectStore(IDB_STORE).put(dataUrl, IDB_KEY);
            } catch (e) { }
        });
    }

    function loadFromIndexedDB(callback) {
        openIndexedDB((db) => {
            if (!db) {
                callback(null);
                return;
            }
            try {
                const tx = db.transaction(IDB_STORE, 'readonly');
                const req = tx.objectStore(IDB_STORE).get(IDB_KEY);
                req.onsuccess = () => callback(req.result || null);
                req.onerror = () => callback(null);
            } catch (e) {
                callback(null);
            }
        });
    }

    function clearFromIndexedDB() {
        openIndexedDB((db) => {
            if (!db) return;
            try {
                const tx = db.transaction(IDB_STORE, 'readwrite');
                tx.objectStore(IDB_STORE).delete(IDB_KEY);
            } catch (e) { }
        });
    }

    function restoreSavedCanvas() {
        let savedDataUrl = null;
        try {
            savedDataUrl = localStorage.getItem(STORAGE_KEYS.CANVAS_DATA);
        } catch (e) { }

        if (savedDataUrl) {
            renderDataUrlToCanvas(savedDataUrl);
        } else {
            // Check IndexedDB fallback
            loadFromIndexedDB((idbDataUrl) => {
                if (idbDataUrl) {
                    renderDataUrlToCanvas(idbDataUrl);
                } else {
                    saveCanvasSnapshot(); // Start undo stack with blank canvas
                }
            });
        }
    }

    function renderDataUrlToCanvas(dataUrl) {
        const img = new Image();
        img.onload = () => {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.restore();

            try {
                undoStack = [canvas.toDataURL('image/png')];
            } catch (e) {
                undoStack = [dataUrl];
            }
            redoStack = [];
            updateUndoRedoButtons();
        };
        img.src = dataUrl;
    }

    let persistTimer = null;
    function saveCanvasToStorage() {
        try {
            // Prefer PNG for clean, lossless quality
            let dataUrl = canvas.toDataURL('image/png');
            try {
                localStorage.setItem(STORAGE_KEYS.CANVAS_DATA, dataUrl);
            } catch (quotaErr) {
                // If PNG exceeds ~5MB localStorage quota, fall back to high-quality JPEG
                try {
                    dataUrl = canvas.toDataURL('image/jpeg', 0.92);
                    localStorage.setItem(STORAGE_KEYS.CANVAS_DATA, dataUrl);
                } catch (jpegErr) {
                    console.warn('LocalStorage quota exceeded for canvas data', jpegErr);
                }
            }
            // Always back up to IndexedDB as well (no 5MB quota limit)
            saveToIndexedDB(dataUrl);
        } catch (err) {
            console.warn('Could not persist canvas', err);
        }
    }

    function persistCanvas() {
        clearTimeout(persistTimer);
        persistTimer = setTimeout(saveCanvasToStorage, 250);
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

            showToast(I18N.t('toastSaved', { filename }));
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

    // --- Fullscreen API Support ---
    function isFullscreen() {
        return Boolean(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
    }

    function isFullscreenSupported() {
        return Boolean(
            document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled
        );
    }

    function toggleFullscreen() {
        if (!isFullscreen()) {
            const docEl = document.documentElement;
            if (docEl.requestFullscreen) {
                docEl.requestFullscreen().catch(err => {
                    showToast(I18N.t('toastFullscreenErr', { err: err.message }));
                });
            } else if (docEl.webkitRequestFullscreen) {
                docEl.webkitRequestFullscreen();
            } else if (docEl.mozRequestFullScreen) {
                docEl.mozRequestFullScreen();
            } else if (docEl.msRequestFullscreen) {
                docEl.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => { });
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    function updateFullscreenUI() {
        if (!btnFullscreen) return;
        const inFs = isFullscreen();
        const iconEnter = btnFullscreen.querySelector('.icon-fs-enter');
        const iconExit = btnFullscreen.querySelector('.icon-fs-exit');
        const label = document.getElementById('lblFullscreen');

        if (iconEnter && iconExit) {
            iconEnter.style.display = inFs ? 'none' : 'block';
            iconExit.style.display = inFs ? 'block' : 'none';
        }
        if (label) {
            label.textContent = inFs ? I18N.t('fullscreenExit') : I18N.t('fullscreen');
        }
        btnFullscreen.title = inFs ? I18N.t('fullscreenTitleExit') : I18N.t('fullscreenTitleEnter');
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
        if (btnCloseBrushPopover) {
            btnCloseBrushPopover.addEventListener('click', closeBrushPopover);
        }
        if (btnBrushSlot) {
            btnBrushSlot.addEventListener('click', (e) => {
                e.stopPropagation();
                openBrushPopover();
            });
        }
        if (btnLang) {
            btnLang.addEventListener('click', (e) => {
                e.stopPropagation();
                openLanguagePopover();
            });
        }
        document.addEventListener('click', (e) => {
            if (!colorPopover.hidden && !colorPopover.contains(e.target) && !leftDock.contains(e.target)) {
                closeColorPopover();
            }
            if (brushPopover && !brushPopover.hidden && !brushPopover.contains(e.target) && !leftDock.contains(e.target)) {
                closeBrushPopover();
            }
            if (langPopover && !langPopover.hidden && !langPopover.contains(e.target) && !btnLang.contains(e.target)) {
                closeLanguagePopover();
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

        // Fullscreen Toggle
        if (btnFullscreen) {
            if (!isFullscreenSupported() && !document.documentElement.requestFullscreen && !document.documentElement.webkitRequestFullscreen) {
                btnFullscreen.style.display = 'none'; // Hide if browser explicitly forbids fullscreen API
            } else {
                btnFullscreen.addEventListener('click', toggleFullscreen);
            }
        }

        // Fullscreen change observers
        ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(evt => {
            document.addEventListener(evt, () => {
                updateFullscreenUI();
                setTimeout(setupCanvas, 150);
            });
        });

        btnCancelClear.addEventListener('click', () => {
            clearDialog.hidden = true;
        });

        btnConfirmClear.addEventListener('click', () => {
            clearDialog.hidden = true;
            clearCanvasInternal(true);
            showToast(I18N.t('toastCleared'));
        });

        clearDialog.addEventListener('click', (e) => {
            if (e.target === clearDialog) {
                clearDialog.hidden = true;
            }
        });

        // Help / About Dialog
        if (btnHelp && helpDialog) {
            btnHelp.addEventListener('click', () => {
                closeAllPopovers();
                helpDialog.hidden = false;
            });
        }
        if (btnCloseHelp) {
            btnCloseHelp.addEventListener('click', () => {
                helpDialog.hidden = true;
            });
        }
        if (btnGotIt) {
            btnGotIt.addEventListener('click', () => {
                helpDialog.hidden = true;
            });
        }
        if (helpDialog) {
            helpDialog.addEventListener('click', (e) => {
                if (e.target === helpDialog) {
                    helpDialog.hidden = true;
                }
            });
        }

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
                closeAllPopovers();
                clearDialog.hidden = true;
                if (helpDialog) helpDialog.hidden = true;
            } else if (e.key === 'f' || e.key === 'F') {
                if (!e.ctrlKey && !e.metaKey && document.activeElement.tagName !== 'INPUT') {
                    e.preventDefault();
                    toggleFullscreen();
                }
            }
        });

        // Window Resize / Orientation Change
        let resizeTimer = null;
        const handleViewportChange = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                setupCanvas();
                closeAllPopovers();
            }, 120);
        };

        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('orientationchange', handleViewportChange);
        if (window.screen && window.screen.orientation) {
            window.screen.orientation.addEventListener('change', handleViewportChange);
        }

        // Auto-save immediately before page unload / accidental browser refresh
        window.addEventListener('beforeunload', () => {
            clearTimeout(persistTimer);
            saveCanvasToStorage();
        });
        window.addEventListener('pagehide', () => {
            clearTimeout(persistTimer);
            saveCanvasToStorage();
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
