/**
 * SparkyDraw i18n & Localization
 * Supports: English (en), Greek (el), Italian (it), Spanish (es), French (fr), German (de), Arabic (ar)
 */

const I18N = (function () {
    'use strict';

    const FLAGS = {
        en: `<svg viewBox="0 0 60 40" width="22" height="15" class="flag-svg" aria-hidden="true">
            <clipPath id="uk-clip"><rect width="60" height="40" rx="3"/></clipPath>
            <g clip-path="url(#uk-clip)">
                <rect width="60" height="40" fill="#012169"/>
                <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" stroke-width="8"/>
                <path d="M0 0 L60 40" stroke="#c8102e" stroke-width="4" clip-path="polygon(0 0, 30 20, 0 40)"/>
                <path d="M60 0 L0 40" stroke="#c8102e" stroke-width="4"/>
                <path d="M30 0 v40 M0 20 h60" stroke="#fff" stroke-width="12"/>
                <path d="M30 0 v40 M0 20 h60" stroke="#c8102e" stroke-width="7"/>
            </g>
        </svg>`,
        el: `<svg viewBox="0 0 60 40" width="22" height="15" class="flag-svg" aria-hidden="true">
            <clipPath id="el-clip"><rect width="60" height="40" rx="3"/></clipPath>
            <g clip-path="url(#el-clip)">
                <rect width="60" height="40" fill="#0d5eaf"/>
                <rect y="4.44" width="60" height="4.44" fill="#fff"/>
                <rect y="13.33" width="60" height="4.44" fill="#fff"/>
                <rect y="22.22" width="60" height="4.44" fill="#fff"/>
                <rect y="31.11" width="60" height="4.44" fill="#fff"/>
                <rect width="20" height="20" fill="#0d5eaf"/>
                <path d="M8 0 h4 v20 h-4 Z M0 8 h20 v4 h-20 Z" fill="#fff"/>
            </g>
        </svg>`,
        it: `<svg viewBox="0 0 60 40" width="22" height="15" class="flag-svg" aria-hidden="true">
            <clipPath id="it-clip"><rect width="60" height="40" rx="3"/></clipPath>
            <g clip-path="url(#it-clip)">
                <rect width="20" height="40" fill="#009246"/>
                <rect x="20" width="20" height="40" fill="#ffffff"/>
                <rect x="40" width="20" height="40" fill="#ce2b37"/>
            </g>
        </svg>`,
        es: `<svg viewBox="0 0 60 40" width="22" height="15" class="flag-svg" aria-hidden="true">
            <clipPath id="es-clip"><rect width="60" height="40" rx="3"/></clipPath>
            <g clip-path="url(#es-clip)">
                <rect width="60" height="10" fill="#aa151b"/>
                <rect y="10" width="60" height="20" fill="#f1bf00"/>
                <rect y="30" width="60" height="10" fill="#aa151b"/>
                <circle cx="15" cy="20" r="4.5" fill="#aa151b" opacity="0.85"/>
            </g>
        </svg>`,
        fr: `<svg viewBox="0 0 60 40" width="22" height="15" class="flag-svg" aria-hidden="true">
            <clipPath id="fr-clip"><rect width="60" height="40" rx="3"/></clipPath>
            <g clip-path="url(#fr-clip)">
                <rect width="20" height="40" fill="#002654"/>
                <rect x="20" width="20" height="40" fill="#ffffff"/>
                <rect x="40" width="20" height="40" fill="#ed2939"/>
            </g>
        </svg>`,
        de: `<svg viewBox="0 0 60 40" width="22" height="15" class="flag-svg" aria-hidden="true">
            <clipPath id="de-clip"><rect width="60" height="40" rx="3"/></clipPath>
            <g clip-path="url(#de-clip)">
                <rect width="60" height="13.33" fill="#000000"/>
                <rect y="13.33" width="60" height="13.33" fill="#dd0000"/>
                <rect y="26.66" width="60" height="13.33" fill="#ffce00"/>
            </g>
        </svg>`,
        ar: `<svg viewBox="0 0 60 40" width="22" height="15" class="flag-svg" aria-hidden="true">
            <clipPath id="ar-clip"><rect width="60" height="40" rx="3"/></clipPath>
            <g clip-path="url(#ar-clip)">
                <rect x="15" y="0" width="45" height="13.33" fill="#00732f"/>
                <rect x="15" y="13.33" width="45" height="13.34" fill="#ffffff"/>
                <rect x="15" y="26.67" width="45" height="13.33" fill="#000000"/>
                <rect x="0" y="0" width="15" height="40" fill="#e0162b"/>
            </g>
        </svg>`
    };

    const LANGUAGES = [
        { code: 'en', name: 'English', native: 'English' },
        { code: 'el', name: 'Greek', native: 'Ελληνικά' },
        { code: 'it', name: 'Italian', native: 'Italiano' },
        { code: 'es', name: 'Spanish', native: 'Español' },
        { code: 'fr', name: 'French', native: 'Français' },
        { code: 'de', name: 'German', native: 'Deutsch' },
        { code: 'ar', name: 'Arabic', native: 'العربية' }
    ];

    const TRANSLATIONS = {
        en: {
            undo: 'Undo',
            undoTitle: 'Undo last stroke (Ctrl+Z)',
            redo: 'Redo',
            redoTitle: 'Redo stroke (Ctrl+Y)',
            clear: 'Clear',
            clearTitle: 'Clear canvas',
            fullscreen: 'Fullscreen',
            fullscreenExit: 'Exit',
            fullscreenTitleEnter: 'Toggle Fullscreen (F)',
            fullscreenTitleExit: 'Exit Fullscreen (F)',
            help: 'Help',
            helpTitle: 'About SparkyDraw & Help',
            savePng: 'Save',
            savePngTitle: 'Save drawing to local PNG image',
            colorsTitle: 'Colors',
            brushTitle: 'Brush',
            brushSlotTitle: 'Choose Brush Size: {size}px',
            reset: 'Reset',
            resetTitle: 'Reset colors and brush size to defaults',
            changeColor: 'Change Color',
            pickAnyColor: 'Pick any color',
            brushSizeHeading: 'Brush Size',
            sizeLabel: 'Size:',
            brushFine: 'Fine (6px)',
            brushSmall: 'Small (12px)',
            brushMedium: 'Default / Large (20px)',
            brushLarge: 'Extra Large (34px)',
            brushJumbo: 'Jumbo (52px)',
            clearDialogTitle: 'Start a new drawing?',
            clearDialogText: 'This will clear your canvas. You can always use Undo if you change your mind!',
            keepDrawing: 'Keep Drawing',
            clearCanvas: 'Clear Canvas',
            helpIntro: 'SparkyDraw is a simple, delightful drawing app designed for children (and not only!), compatible with any device and screen format, touch-friendly or not and in any orientation. It remembers your artwork and settings across visits, exports high-resolution PNG images locally and adapts easily in small or big screen, in both portrait and landscape modes!',
            helpLeftTitle: 'Left Toolbar',
            helpLeftColors: 'Colors: Click any of the 12 color slots to pick your drawing color. Click it again to open the color picker and customize that slot.',
            helpLeftBrush: 'Brush: Click the brush icon to choose your stroke thickness (from fine details to jumbo marker) with live preview.',
            helpLeftReset: 'Reset: Click the red Reset button at the bottom of the dock to restore default colors and brush size.',
            helpTopTitle: 'Top Toolbar',
            helpTopUndo: 'Undo & Redo: Instantly undo (Ctrl+Z) or redo (Ctrl+Y) your strokes.',
            helpTopClear: 'Clear: Wipe the canvas clean to start fresh.',
            helpTopFullscreen: 'Fullscreen: Hide all browser borders and distractions for full-screen drawing (F key).',
            helpTopSave: 'Save: Save your drawing directly to your device as SparkyDraw_YYYYMMDD_HHmmss.png.',
            gotIt: 'Got it!',
            language: 'Language',
            toastSaved: 'Saved as {filename}! ✨',
            toastUndo: 'Undo',
            toastRedo: 'Redo',
            toastCleared: 'Canvas cleared!',
            toastReset: 'Colors and brush size reset to original!',
            toastBrushSize: 'Brush size set to {size}',
            toastFullscreenErr: 'Fullscreen not permitted: {err}',
            toastLangChanged: 'Language changed to {lang}'
        },
        el: {
            undo: 'Αναίρεση',
            undoTitle: 'Αναίρεση τελευταίας γραμμής (Ctrl+Z)',
            redo: 'Επανάληψη',
            redoTitle: 'Επανάληψη γραμμής (Ctrl+Y)',
            clear: 'Καθαρισμός',
            clearTitle: 'Καθαρισμός καμβά',
            fullscreen: 'Πλήρης οθόνη',
            fullscreenExit: 'Έξοδος',
            fullscreenTitleEnter: 'Πλήρης οθόνη (F)',
            fullscreenTitleExit: 'Έξοδος από πλήρη οθόνη (F)',
            help: 'Βοήθεια',
            helpTitle: 'Σχετικά με το SparkyDraw & Βοήθεια',
            savePng: 'Αποθήκευση',
            savePngTitle: 'Αποθήκευση ζωγραφιάς ως εικόνα PNG',
            colorsTitle: 'Χρώματα',
            brushTitle: 'Πινέλο',
            brushSlotTitle: 'Επιλογή μεγέθους πινέλου: {size}px',
            reset: 'Επαναφορά',
            resetTitle: 'Επαναφορά αρχικών χρωμάτων και μεγέθους πινέλου',
            changeColor: 'Αλλαγή Χρώματος',
            pickAnyColor: 'Επιλογή χρώματος',
            brushSizeHeading: 'Μέγεθος Πινέλου',
            sizeLabel: 'Μέγεθος:',
            brushFine: 'Λεπτό (6px)',
            brushSmall: 'Μικρό (12px)',
            brushMedium: 'Προεπιλογή / Μεσαίο (20px)',
            brushLarge: 'Μεγάλο (34px)',
            brushJumbo: 'Γίγας (52px)',
            clearDialogTitle: 'Νέα ζωγραφιά;',
            clearDialogText: 'Αυτό θα καθαρίσει τον καμβά σας. Μπορείτε πάντα να χρησιμοποιήσετε την Αναίρεση αν αλλάξετε γνώμη!',
            keepDrawing: 'Συνέχεια ζωγραφικής',
            clearCanvas: 'Καθαρισμός καμβά',
            helpIntro: 'Το SparkyDraw είναι μια απλή, απολαυστική εφαρμογή ζωγραφικής σχεδιασμένη για παιδιά (και όχι μόνο!), συμβατή με κάθε συσκευή και τύπο οθόνης, με υποστήριξη αφής ή μη και σε οποιονδήποτε προσανατολισμό. Θυμάται τα έργα και τις ρυθμίσεις σας μεταξύ των επισκέψεων, εξάγει εικόνες PNG υψηλής ανάλυσης τοπικά και προσαρμόζεται εύκολα σε μικρές ή μεγάλες οθόνες, τόσο σε κάθετη όσο και σε οριζόντια προβολή!',
            helpLeftTitle: 'Αριστερή γραμμή εργαλείων',
            helpLeftColors: 'Χρώματα: Κάντε κλικ σε ένα από τα 12 χρώματα για να ζωγραφίσετε. Κάντε κλικ ξανά για να επιλέξετε άλλο χρώμα.',
            helpLeftBrush: 'Πινέλο: Κάντε κλικ στο εικονίδιο πινέλου για να επιλέξετε πάχος γραμμής με ζωντανή προεπισκόπηση.',
            helpLeftReset: 'Επαναφορά: Πατήστε το κόκκινο κουμπί στο κάτω μέρος για να επαναφέρετε τα αρχικά χρώματα και πινέλο.',
            helpTopTitle: 'Πάνω γραμμή εργαλείων',
            helpTopUndo: 'Αναίρεση & Επανάληψη: Διορθώστε γρήγορα (Ctrl+Z / Ctrl+Y) κάθε λάθος.',
            helpTopClear: 'Καθαρισμός: Καθαρίστε τον καμβά για να ξεκινήσετε από την αρχή.',
            helpTopFullscreen: 'Πλήρης οθόνη: Αποκρύψτε τα περιθώρια του περιηγητή για να ζωγραφίζετε άνετα (πλήκτρο F).',
            helpTopSave: 'Αποθήκευση: Αποθηκεύστε τη ζωγραφιά στη συσκευή σας ως SparkyDraw_YYYYMMDD_HHmmss.png.',
            gotIt: 'Κατάλαβα!',
            language: 'Γλώσσα',
            toastSaved: 'Αποθηκεύτηκε ως {filename}! ✨',
            toastUndo: 'Αναίρεση',
            toastRedo: 'Επανάληψη',
            toastCleared: 'Ο καμβάς καθαρίστηκε!',
            toastReset: 'Επαναφορά αρχικών χρωμάτων και μεγέθους πινέλου!',
            toastBrushSize: 'Μέγεθος πινέλου: {size}',
            toastFullscreenErr: 'Δεν επιτρέπεται πλήρης οθόνη: {err}',
            toastLangChanged: 'Η γλώσσα άλλαξε σε {lang}'
        },
        it: {
            undo: 'Annulla',
            undoTitle: 'Annulla ultimo tratto (Ctrl+Z)',
            redo: 'Ripeti',
            redoTitle: 'Ripeti tratto (Ctrl+Y)',
            clear: 'Cancella',
            clearTitle: 'Cancella la tela',
            fullscreen: 'Schermo intero',
            fullscreenExit: 'Esci',
            fullscreenTitleEnter: 'Schermo intero (F)',
            fullscreenTitleExit: 'Esci da schermo intero (F)',
            help: 'Aiuto',
            helpTitle: 'Informazioni su SparkyDraw & Aiuto',
            savePng: 'Salva',
            savePngTitle: 'Salva il disegno in un file PNG locale',
            colorsTitle: 'Colori',
            brushTitle: 'Pennello',
            brushSlotTitle: 'Dimensione pennello: {size}px',
            reset: 'Ripristina',
            resetTitle: 'Ripristina colori e pennello predefiniti',
            changeColor: 'Cambia Colore',
            pickAnyColor: 'Scegli qualsiasi colore',
            brushSizeHeading: 'Dimensione Pennello',
            sizeLabel: 'Dimensione:',
            brushFine: 'Sottile (6px)',
            brushSmall: 'Piccolo (12px)',
            brushMedium: 'Predefinito / Medio (20px)',
            brushLarge: 'Grande (34px)',
            brushJumbo: 'Gigante (52px)',
            clearDialogTitle: 'Iniziare un nuovo disegno?',
            clearDialogText: 'Questo cancellerà la tela. Puoi sempre usare Annulla se cambi idea!',
            keepDrawing: 'Continua a disegnare',
            clearCanvas: 'Cancella tela',
            helpIntro: 'SparkyDraw è un\'applicazione di disegno semplice e deliziosa progettata per bambini (e non solo!), compatibile con qualsiasi dispositivo e formato di schermo, touch o meno e in qualsiasi orientamento. Ricorda i tuoi disegni e impostazioni tra le visite, esporta localmente immagini PNG ad alta risoluzione e si adatta facilmente a schermi piccoli o grandi, sia in modalità verticale che orizzontale!',
            helpLeftTitle: 'Barra laterale',
            helpLeftColors: 'Colori: Clicca su uno dei 12 colori per disegnare. Clicca di nuovo per personalizzare lo slot.',
            helpLeftBrush: 'Pennello: Clicca sull\'icona del pennello per scegliere lo spessore con anteprima in tempo reale.',
            helpLeftReset: 'Ripristina: Clicca sul pulsante rosso per ripristinare i colori e la dimensione del pennello.',
            helpTopTitle: 'Barra superiore',
            helpTopUndo: 'Annulla & Ripeti: Correggi rapidamente (Ctrl+Z / Ctrl+Y) qualsiasi tratto.',
            helpTopClear: 'Cancella: Pulisci la tela per ricominciare da capo.',
            helpTopFullscreen: 'Schermo intero: Nascondi i bordi del browser per concentrarti sul disegno (tasto F).',
            helpTopSave: 'Salva: Salva il tuo disegno direttamente sul tuo dispositivo come SparkyDraw_YYYYMMDD_HHmmss.png.',
            gotIt: 'Ho capito!',
            language: 'Lingua',
            toastSaved: 'Salvato come {filename}! ✨',
            toastUndo: 'Annulla',
            toastRedo: 'Ripeti',
            toastCleared: 'Tela cancellata!',
            toastReset: 'Colori e pennello ripristinati!',
            toastBrushSize: 'Pennello impostato a {size}',
            toastFullscreenErr: 'Schermo intero non consentito: {err}',
            toastLangChanged: 'Lingua cambiata in {lang}'
        },
        es: {
            undo: 'Deshacer',
            undoTitle: 'Deshacer último trazo (Ctrl+Z)',
            redo: 'Rehacer',
            redoTitle: 'Rehacer trazo (Ctrl+Y)',
            clear: 'Borrar',
            clearTitle: 'Borrar lienzo',
            fullscreen: 'Pantalla completa',
            fullscreenExit: 'Salir',
            fullscreenTitleEnter: 'Pantalla completa (F)',
            fullscreenTitleExit: 'Salir de pantalla completa (F)',
            help: 'Ayuda',
            helpTitle: 'Acerca de SparkyDraw & Ayuda',
            savePng: 'Guardar',
            savePngTitle: 'Guardar dibujo en una imagen PNG local',
            colorsTitle: 'Colores',
            brushTitle: 'Pincel',
            brushSlotTitle: 'Tamaño del pincel: {size}px',
            reset: 'Restablecer',
            resetTitle: 'Restablecer colores y tamaño de pincel predeterminados',
            changeColor: 'Cambiar Color',
            pickAnyColor: 'Elegir cualquier color',
            brushSizeHeading: 'Tamaño del Pincel',
            sizeLabel: 'Tamaño:',
            brushFine: 'Fino (6px)',
            brushSmall: 'Pequeño (12px)',
            brushMedium: 'Predeterminado / Mediano (20px)',
            brushLarge: 'Grande (34px)',
            brushJumbo: 'Gigante (52px)',
            clearDialogTitle: '¿Empezar un nuevo dibujo?',
            clearDialogText: 'Esto borrará tu lienzo. ¡Siempre puedes usar Deshacer si cambias de opinión!',
            keepDrawing: 'Seguir dibujando',
            clearCanvas: 'Borrar lienzo',
            helpIntro: 'SparkyDraw es una aplicación de dibujo simple y encantadora diseñada para niños (¡y no solo para ellos!), compatible con cualquier dispositivo y formato de pantalla, táctil o no y en cualquier orientación. ¡Recuerda tus dibujos y ajustes entre visitas, exporta imágenes PNG de alta resolución localmente y se adapta fácilmente a pantallas pequeñas o grandes, tanto en modo vertical como horizontal!',
            helpLeftTitle: 'Barra lateral',
            helpLeftColors: 'Colores: Haz clic en cualquiera de los 12 colores para pintar. Haz clic de nuevo para personalizar esa casilla.',
            helpLeftBrush: 'Pincel: Haz clic en el icono del pincel para elegir el grosor con vista previa en vivo.',
            helpLeftReset: 'Restablecer: Haz clic en el botón rojo de abajo para volver a los colores y pincel predeterminados.',
            helpTopTitle: 'Barra superior',
            helpTopUndo: 'Deshacer & Rehacer: Corrige al instante (Ctrl+Z / Ctrl+Y) cualquier error.',
            helpTopClear: 'Borrar: Limpia el lienzo para empezar de nuevo.',
            helpTopFullscreen: 'Pantalla completa: Oculta los bordes del navegador para concentrarte en dibujar (tecla F).',
            helpTopSave: 'Guardar: Guarda tu dibujo en tu dispositivo como SparkyDraw_YYYYMMDD_HHmmss.png.',
            gotIt: '¡Entendido!',
            language: 'Idioma',
            toastSaved: '¡Guardado como {filename}! ✨',
            toastUndo: 'Deshacer',
            toastRedo: 'Rehacer',
            toastCleared: '¡Lienzo borrado!',
            toastReset: '¡Colores y pincel restablecidos a los originales!',
            toastBrushSize: 'Tamaño de pincel: {size}',
            toastFullscreenErr: 'Pantalla completa no permitida: {err}',
            toastLangChanged: 'Idioma cambiado a {lang}'
        },
        fr: {
            undo: 'Annuler',
            undoTitle: 'Annuler le dernier trait (Ctrl+Z)',
            redo: 'Rétablir',
            redoTitle: 'Rétablir le trait (Ctrl+Y)',
            clear: 'Effacer',
            clearTitle: 'Effacer la toile',
            fullscreen: 'Plein écran',
            fullscreenExit: 'Quitter',
            fullscreenTitleEnter: 'Plein écran (F)',
            fullscreenTitleExit: 'Quitter le plein écran (F)',
            help: 'Aide',
            helpTitle: 'À propos de SparkyDraw & Aide',
            savePng: 'Enregistrer',
            savePngTitle: 'Enregistrer le dessin au format PNG',
            colorsTitle: 'Couleurs',
            brushTitle: 'Pinceau',
            brushSlotTitle: 'Taille du pinceau : {size}px',
            reset: 'Réinitialiser',
            resetTitle: 'Rétablir les couleurs et la taille de pinceau par défaut',
            changeColor: 'Changer de Couleur',
            pickAnyColor: 'Choisir une couleur',
            brushSizeHeading: 'Taille du Pinceau',
            sizeLabel: 'Taille :',
            brushFine: 'Fin (6px)',
            brushSmall: 'Petit (12px)',
            brushMedium: 'Par défaut / Moyen (20px)',
            brushLarge: 'Grand (34px)',
            brushJumbo: 'Géant (52px)',
            clearDialogTitle: 'Commencer un nouveau dessin ?',
            clearDialogText: 'Cela effacera votre toile. Vous pourrez toujours utiliser Annuler en cas d\'erreur !',
            keepDrawing: 'Continuer à dessiner',
            clearCanvas: 'Effacer la toile',
            helpIntro: 'SparkyDraw est une application de dessin simple et réjouissante conçue pour les enfants (et pas seulement !), compatible avec tous les appareils et formats d\'écran, tactiles ou non et dans toutes les orientations. Elle mémorise vos créations et réglages d\'une visite à l\'autre, exporte localement des images PNG haute résolution et s\'adapte facilement aux petits comme aux grands écrans, en mode portrait comme paysage !',
            helpLeftTitle: 'Barre latérale',
            helpLeftColors: 'Couleurs : Cliquez sur l\'une des 12 couleurs pour dessiner. Cliquez à nouveau pour la personnaliser.',
            helpLeftBrush: 'Pinceau : Cliquez sur l\'icône du pinceau pour choisir l\'épaisseur avec un aperçu en direct.',
            helpLeftReset: 'Réinitialiser : Cliquez sur le bouton rouge en bas pour restaurer les réglages d\'origine.',
            helpTopTitle: 'Barre supérieure',
            helpTopUndo: 'Annuler & Rétablir : Corrigez facilement (Ctrl+Z / Ctrl+Y) toute maladresse.',
            helpTopClear: 'Effacer : Remettez la toile à blanc pour recommencer.',
            helpTopFullscreen: 'Plein écran : Masquez les bordures du navigateur pour dessiner en toute immersion (touche F).',
            helpTopSave: 'Enregistrer : Téléchargez votre création au format SparkyDraw_YYYYMMDD_HHmmss.png.',
            gotIt: 'Compris !',
            language: 'Langue',
            toastSaved: 'Enregistré sous {filename} ! ✨',
            toastUndo: 'Annuler',
            toastRedo: 'Rétablir',
            toastCleared: 'Toile effacée !',
            toastReset: 'Couleurs et taille de pinceau réinitialisées !',
            toastBrushSize: 'Taille du pinceau : {size}',
            toastFullscreenErr: 'Plein écran non autorisé : {err}',
            toastLangChanged: 'Langue changée en {lang}'
        },
        de: {
            undo: 'Rückgängig',
            undoTitle: 'Letzten Strich rückgängig machen (Ctrl+Z)',
            redo: 'Wiederholen',
            redoTitle: 'Strich wiederholen (Ctrl+Y)',
            clear: 'Löschen',
            clearTitle: 'Leinwand leeren',
            fullscreen: 'Vollbild',
            fullscreenExit: 'Beenden',
            fullscreenTitleEnter: 'Vollbildmodus (F)',
            fullscreenTitleExit: 'Vollbild beenden (F)',
            help: 'Hilfe',
            helpTitle: 'Über SparkyDraw & Hilfe',
            savePng: 'Speichern',
            savePngTitle: 'Zeichnung lokal als PNG-Bild speichern',
            colorsTitle: 'Farben',
            brushTitle: 'Pinsel',
            brushSlotTitle: 'Pinselgröße: {size}px',
            reset: 'Zurücksetzen',
            resetTitle: 'Farben und Pinselgröße auf Standard zurücksetzen',
            changeColor: 'Farbe Ändern',
            pickAnyColor: 'Beliebige Farbe wählen',
            brushSizeHeading: 'Pinselgröße',
            sizeLabel: 'Größe:',
            brushFine: 'Fein (6px)',
            brushSmall: 'Klein (12px)',
            brushMedium: 'Standard / Mittel (20px)',
            brushLarge: 'Groß (34px)',
            brushJumbo: 'Riesig (52px)',
            clearDialogTitle: 'Neue Zeichnung beginnen?',
            clearDialogText: 'Dadurch wird die Leinwand geleert. Du kannst es jederzeit mit Rückgängig wiederherstellen!',
            keepDrawing: 'Weiterzeichnen',
            clearCanvas: 'Leinwand leeren',
            helpIntro: 'SparkyDraw ist eine einfache, tolle Zeichen-App für Kinder (und nicht nur für sie!), kompatibel mit jedem Gerät und Bildschirmformat, mit Touchscreen oder Maus und in jeder Ausrichtung. Sie merkt sich deine Kunstwerke und Einstellungen über Besuche hinweg, exportiert hochauflösende PNG-Bilder lokal und passt sich mühelos an kleine oder große Bildschirme an, sowohl im Hoch- als auch im Querformat!',
            helpLeftTitle: 'Linke Symbolleiste',
            helpLeftColors: 'Farben: Klicke auf eine der 12 Farben zum Malen. Klicke erneut, um den Farbton anzupassen.',
            helpLeftBrush: 'Pinsel: Klicke auf das Pinselsymbol, um die Strichstärke mit Live-Vorschau auszuwählen.',
            helpLeftReset: 'Zurücksetzen: Klicke auf die rote Taste unten, um die Standardfarben und Pinselgröße wiederherzustellen.',
            helpTopTitle: 'Obere Symbolleiste',
            helpTopUndo: 'Rückgängig & Wiederholen: Korrigiere schnell (Ctrl+Z / Ctrl+Y) jeden Strich.',
            helpTopClear: 'Löschen: Leere die Leinwand, um frisch anzufangen.',
            helpTopFullscreen: 'Vollbild: Verberge störende Browserleisten für ungestörtes Malen (Taste F).',
            helpTopSave: 'Speichern: Speichere dein Bild als SparkyDraw_YYYYMMDD_HHmmss.png auf deinem Gerät.',
            gotIt: 'Verstanden!',
            language: 'Sprache',
            toastSaved: 'Gespeichert als {filename}! ✨',
            toastUndo: 'Rückgängig',
            toastRedo: 'Wiederholen',
            toastCleared: 'Leinwand geleert!',
            toastReset: 'Farben und Pinselgröße zurückgesetzt!',
            toastBrushSize: 'Pinselgröße auf {size} gesetzt',
            toastFullscreenErr: 'Vollbild nicht erlaubt: {err}',
            toastLangChanged: 'Sprache geändert auf {lang}'
        },
        ar: {
            undo: 'تراجع',
            undoTitle: 'تراجع عن آخر خطوة (Ctrl+Z)',
            redo: 'إعادة',
            redoTitle: 'إعادة الخطوة (Ctrl+Y)',
            clear: 'مسح',
            clearTitle: 'مسح لوحة الرسم',
            fullscreen: 'ملء الشاشة',
            fullscreenExit: 'خروج',
            fullscreenTitleEnter: 'تبديل ملء الشاشة (F)',
            fullscreenTitleExit: 'الخروج من ملء الشاشة (F)',
            help: 'مساعدة',
            helpTitle: 'حول SparkyDraw والمساعدة',
            savePng: 'حفظ',
            savePngTitle: 'حفظ الرسم كصورة PNG على جهازك',
            colorsTitle: 'الألوان',
            brushTitle: 'الفرشاة',
            brushSlotTitle: 'اختيار حجم الفرشاة: {size} بكسل',
            reset: 'إعادة ضبط',
            resetTitle: 'استعادة الألوان وحجم الفرشاة الافتراضي',
            changeColor: 'تغيير اللون',
            pickAnyColor: 'اختر أي لون',
            brushSizeHeading: 'حجم الفرشاة',
            sizeLabel: 'الحجم:',
            brushFine: 'دقيق (6 بكسل)',
            brushSmall: 'صغير (12 بكسل)',
            brushMedium: 'افتراضي / عريض (20 بكسل)',
            brushLarge: 'عريض جداً (34 بكسل)',
            brushJumbo: 'ضخم (52 بكسل)',
            clearDialogTitle: 'بدء رسم جديد؟',
            clearDialogText: 'سيؤدي هذا إلى مسح لوحة الرسم. يمكنك دائماً استخدام التراجع إذا غيرت رأيك!',
            keepDrawing: 'متابعة الرسم',
            clearCanvas: 'مسح اللوحة',
            helpIntro: 'تطبيق SparkyDraw هو تطبيق رسم بسيط ورائع مصمم للأطفال (وليس لهم فقط!)، متوافق مع أي جهاز وتنسيق شاشة، سواء كانت تعمل باللمس أم لا وفي أي اتجاه. يتذكر أعمالك الفنية وإعداداتك بين الزيارات، ويصدّر صور PNG عالية الدقة محلياً، ويتكيف بسهولة مع الشاشات الصغيرة أو الكبيرة، في كلا الوضعين الرأسي والأفقي!',
            helpLeftTitle: 'شريط الأدوات الجانبي',
            helpLeftColors: 'الألوان: انقر فوق أي من خانات الألوان الـ 12 لاختيار لون الرسم. انقر فوقها مرة أخرى لفتح منتقي الألوان وتخصيصها.',
            helpLeftBrush: 'الفرشاة: انقر فوق أيقونة الفرشاة لاختيار سمك الخط (من التفاصيل الدقيقة إلى القلم العريض) مع معاينة فورية.',
            helpLeftReset: 'إعادة الضبط: انقر فوق زر إعادة الضبط الأحمر لاستعادة الألوان وحجم الفرشاة الأصلي.',
            helpTopTitle: 'شريط الأدوات العلوي',
            helpTopUndo: 'تراجع وإعادة: التراجع الفوري (Ctrl+Z) أو الإعادة (Ctrl+Y) لخطوات الرسم.',
            helpTopClear: 'مسح: مسح لوحة الرسم بالكامل للبدء من جديد.',
            helpTopFullscreen: 'ملء الشاشة: إخفاء إطارات المتصفح لتجربة رسم خالية من التشتيت (زر F).',
            helpTopSave: 'حفظ: احفظ رسمتك مباشرة على جهازك بتنسيق PNG باسم SparkyDraw_YYYYMMDD_HHmmss.png.',
            gotIt: 'فهمت!',
            language: 'اللغة',
            toastSaved: 'تم الحفظ باسم {filename}! ✨',
            toastUndo: 'تراجع',
            toastRedo: 'إعادة',
            toastCleared: 'تم مسح اللوحة!',
            toastReset: 'تمت استعادة الألوان وحجم الفرشاة الافتراضي!',
            toastBrushSize: 'تم ضبط حجم الفرشاة على {size}',
            toastFullscreenErr: 'وضع ملء الشاشة غير متاح: {err}',
            toastLangChanged: 'تم تغيير اللغة إلى {lang}'
        }
    };

    const STORAGE_KEY = 'sparkydraw_lang_v1';
    let currentLang = 'en';

    function detectLanguage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved && TRANSLATIONS[saved]) {
                return saved;
            }

            const browserLang = (navigator.languages && navigator.languages.length ? navigator.languages[0] : navigator.language || 'en').toLowerCase();
            const primary = browserLang.split('-')[0];
            if (TRANSLATIONS[primary]) {
                return primary;
            }
        } catch (e) {
            // Fallback to English
        }
        return 'en';
    }

    function init() {
        currentLang = detectLanguage();
    }

    function setLanguage(code) {
        if (TRANSLATIONS[code]) {
            currentLang = code;
            try {
                localStorage.setItem(STORAGE_KEY, code);
            } catch (e) { }
        }
    }

    function getLanguage() {
        return currentLang;
    }

    function t(key, params = {}) {
        const langData = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
        let text = langData[key] || TRANSLATIONS.en[key] || key;
        for (const [k, v] of Object.entries(params)) {
            text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
        }
        return text;
    }

    function getFlagSvg(code) {
        return FLAGS[code] || FLAGS.en;
    }

    function getLanguages() {
        return LANGUAGES;
    }

    init();

    return {
        t,
        setLanguage,
        getLanguage,
        getFlagSvg,
        getLanguages,
        FLAGS
    };
})();
