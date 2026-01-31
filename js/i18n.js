// js/i18n.js
const translations = {
  en: {
    // App
    "app.name": "Fret Cheat Sheet",

    // Tabs
    "tab.general": "General",
    "tab.blues": "Blues",
    "tab.manouche": "Gypsy Jazz",

    // General tab
    "general.input.placeholder": "C, Am7, G7, Dm6...",
    "general.show": "Show",
    "general.chord": "Chord",
    "general.notes": "Notes",
    "general.formula": "Formula",
    "general.arpeggio": "Arpeggio",
    "general.scale": "Scale",
    "general.inversions": "Inversions",

    // Arpeggio
    "arpeggio.settings": "Arpeggio Settings",
    "arpeggio.addSecond": "Add 2nd (9th)",
    "arpeggio.addSixth": "Add 6th (13th)",
    "arpeggio.addSeventh": "Add 7th",
    "arpeggio.hint":
      "🎵 Arpeggio shows chord notes individually on the fretboard",

    // Blues tab
    "blues.input.placeholder": "A7, E7, G7...",
    "blues.pentatonic": "Pentatonic",
    "blues.bluesNote": "Blue note (♭5)",
    "blues.settings": "Blues Settings",
    "blues.box": "Box:",
    "blues.boxAll": "All",
    "blues.chordInfo": "Blues chord",

    // Manouche tab
    "manouche.input.placeholder": "Am6, D7#9, G6...",
    "manouche.scalesChords": "Scales & Chords",
    "manouche.scales": "Scales",
    "manouche.licks": " Exercise",
    "manouche.fingerings": "Signature chords",
    "manouche.chord": "Chord",
    "manouche.style": "Style:",
    "manouche.jazzManouche": "Jazz Manouche",

    // Scale names
    "scale.auto": "Auto",
    "scale.gypsyMajor": "Gypsy Major",
    "scale.harmonicMajor": "Harmonic Maj",
    "scale.harmonicMinor": "Harmonic Min",
    "scale.harmonicMinorNat6": " Min ♮6",
    "scale.dorianSharp4": "Dorian ♯4",
    "scale.diminished": "Diminished",
    "scale.doubleChromatic": "Chromatic",
    "scale.mixolydianFlat6": "Mixolydian ♭6",
    "scale.altered": "Altered",

    // Lick names
    "lick.dimRun": "Dim Run",
    "lick.gypsySweep": "Gypsy Scale",
    "lick.chromaticApproach": "Chromatic",
    "exercise1": "Ex1",
    "exercise2": "Ex2",
    "exercise3": "Ex3",
    "exercise4": "Ex4",
    "exercise5": "Ex5",

    // Fingering names (только названия кнопок)
    "fingering.Am6": "Am6",
    "fingering.G6": "G6",
    "fingering.D7sharp9": "D7#9",
    "fingering.E7": "E7",
    "fingering.Bdim7": "Bdim7",
    "fingering.Dm6": "Dm6",
    "fingering.Am7": "Am7",
    "fingering.D9": "D9",
    "fingering.C#dim7": "C#dim7",
    "fingering.Cmaj7": "Cmaj7",
    "fingering.Cm7": "Cm7",
    "fingering.G♯dim7": "G♯dim7",

    // UI Elements
    "ui.help": "Help",
    "ui.fullscreen": "Fullscreen",

    // Errors
    "error.scaleNotes": "Failed to get scale notes",
    "error.chordNotes": "Failed to get chord notes",
    "error.elementNotFound": "Element not found",
    "error.noChord": "Please enter a chord",


    'ui.feedback': 'Feedback',
            'feedback.title': 'Feedback',
            'feedback.email': 'Email',
            'feedback.telegram': 'Telegram',
            'feedback.copy': 'Copy',
            'feedback.copied': 'Copied!',
            'feedback.openEmail': 'Open Email Client',
            'feedback.openTelegram': 'Open Telegram',
            'feedback.hint': 'Choose contact method',
  },

  ru: {
    // App
    "app.name": "Fret Cheat Sheet",

    // Tabs
    "tab.general": "Общее",
    "tab.blues": "Блюз",
    "tab.manouche": "Цыганский Джаз",

    // General tab
    "general.input.placeholder": "C, Am7, G7, Dm6...",
    "general.show": "Показать",
    "general.chord": "Аккорд",
    "general.notes": "Ноты",
    "general.formula": "Формула",
    "general.arpeggio": "Арпеджио",
    "general.scale": "Гамма",
    "general.inversions": "Обращения",

    // Arpeggio
    "arpeggio.settings": "Настройки арпеджио",
    "arpeggio.addSecond": "Добавить 2 (нону)",
    "arpeggio.addSixth": "Добавить 6 (терцдециму)",
    "arpeggio.addSeventh": "Добавить 7 (септиму)",
    "arpeggio.hint": "🎵 Арпеджио покажет ноты аккорда по отдельности на грифе",

    // Blues tab
    "blues.input.placeholder": "A7, E7, G7...",
    "blues.pentatonic": "Пентатоника",
    "blues.bluesNote": "Блюзовая нота (♭5)",
    "blues.settings": "Блюзовые настройки",
    "blues.box": "Бокс:",
    "blues.boxAll": "Все",
    "blues.chordInfo": "Блюзовый аккорд",

    // Manouche tab
    "manouche.input.placeholder": "Am6, D7#9, G6...",
    "manouche.scalesChords": "Гаммы и Аккорды",
    "manouche.scales": "Гаммы",
    "manouche.licks": "Упражнения",
    "manouche.fingerings": "Характерные Аккорды",
    "manouche.chord": "Аккорд",
    "manouche.style": "Стиль:",
    "manouche.jazzManouche": "Джаз-мануш",

    // Scale names
    "scale.auto": "Auto",
    "scale.gypsyMajor": "Gypsy Maj",
    "scale.harmonicMajor": "Harmonic Maj",
    "scale.harmonicMinor": "Harmonic Min",
    "scale.harmonicMinorNat6": "Min ♮6",
    "scale.dorianSharp4": "Dorian ♯4",
    "scale.diminished": "Diminished",
    "scale.doubleChromatic": "Chromatic",
    "scale.mixolydianFlat6": "Mixolydian ♭6",
    "scale.altered": "Altered",

    // Lick names
    "lick.dimRun": "Dim Run",
    "lick.gypsySweep": "Gypsy Scale",
    "lick.chromaticApproach": "Chromatic",
    "exercise1": "Ex1",
    "exercise2": "Ex2",
    "exercise3": "Ex3",
    "exercise4": "Ex4",
    "exercise5": "Ex5",

    // Fingering names
    "fingering.Am6": "Am6",
    "fingering.G6": "G6",
    "fingering.D7sharp9": "D7#9",
    "fingering.E7": "E7",
    "fingering.Bdim7": "Bdim7",
    "fingering.Dm6": "Dm6",
    "fingering.Am7": "Am7",
    "fingering.D9": "D9",
    "fingering.C#dim7": "C#dim7",
    "fingering.Cmaj7": "Cmaj7",
    "fingering.Cm7": "Cm7",
    "fingering.G♯dim7": "G♯dim7",

    // UI Elements
    "ui.help": "Помощь",
    "ui.fullscreen": "На весь экран",

    // Errors
    "error.scaleNotes": "Не удалось получить ноты гаммы",
    "error.chordNotes": "Не удалось получить ноты аккорда",
    "error.elementNotFound": "Элемент не найден",
    "error.noChord": "Пожалуйста, введите аккорд",

    'ui.feedback': 'Обратная связь',
            'feedback.title': 'Обратная связь',
            'feedback.email': 'Email',
            'feedback.telegram': 'Telegram',
            'feedback.copy': 'Копировать',
            'feedback.copied': 'Скопировано!',
            'feedback.openEmail': 'Открыть почтовый клиент',
            'feedback.openTelegram': 'Открыть Telegram',
            'feedback.hint': 'Выберите способ связи',
  },
};

class I18n {
  constructor() {
    this.currentLang = "en";
    this.translations = translations;
  }

  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLang = lang;
      this.translatePage();
      localStorage.setItem("preferredLanguage", lang);
      return true;
    }
    return false;
  }

  t(key, defaultValue = "") {
    const translation = this.translations[this.currentLang];
    if (translation && translation[key]) {
      return translation[key];
    }
    // Fallback to English if current language doesn't have the key
    if (this.currentLang !== "en" && this.translations.en[key]) {
      return this.translations.en[key];
    }
    return defaultValue || key;
  }

  translateElement(element) {
    const key = element.getAttribute("data-i18n");
    if (key) {
      element.textContent = this.t(key);
    }

    const placeholderKey = element.getAttribute("data-i18n-placeholder");
    if (placeholderKey && element.placeholder !== undefined) {
      element.placeholder = this.t(placeholderKey);
    }

    const titleKey = element.getAttribute("data-i18n-title");
    if (titleKey && element.title !== undefined) {
      element.title = this.t(titleKey);
    }

    const valueKey = element.getAttribute("data-i18n-value");
    if (valueKey && element.value !== undefined) {
      element.value = this.t(valueKey);
    }
  }

  translatePage() {
    // Translate all elements with i18n attributes
    document
      .querySelectorAll(
        "[data-i18n], [data-i18n-placeholder], [data-i18n-title], [data-i18n-value]",
      )
      .forEach((element) => {
        this.translateElement(element);
      });

    // Update dynamic content if needed
    this.updateDynamicContent();
  }

  updateDynamicContent() {
    // Update scale info if shown
    if (window.manoucheScales && manoucheScales.currentScale) {
      const scaleName = manoucheScales.currentScale.scaleName;
      const displayName = this.t(`scale.${scaleName}`, scaleName);

      const infoDiv = document.getElementById("manoucheScaleInfo");
      if (infoDiv) {
        const header = infoDiv.querySelector(".manouche-scale-header");
        if (header) {
          const strong = header.querySelector("strong");
          if (strong) {
            const root = manoucheScales.currentScale.root;
            strong.textContent = `${displayName} from ${root}`;
          }
        }
      }
    }

    // Update pentatonic info if shown
    if (window.pentatonicManager && pentatonicManager.currentConfig) {
      const infoDiv = document.getElementById("pentatonicInfo");
      if (infoDiv) {
        const typeName =
          pentatonicManager.currentConfig.type === "minor"
            ? this.t("scale.harmonicMinor", "Minor")
            : this.t("scale.gypsyMajor", "Major");
        const root = pentatonicManager.currentConfig.root;
        const box =
          pentatonicManager.currentConfig.box === "all"
            ? this.t("blues.boxAll", "All")
            : `Box ${pentatonicManager.currentConfig.box}`;

        const firstLine = infoDiv.querySelector("div:first-child");
        if (firstLine) {
          firstLine.innerHTML = `<strong>${typeName} pentatonic from ${root}</strong> | ${box}`;
        }
      }
    }
  }

  getCurrentLanguage() {
    return this.currentLang;
  }
}

// Create global instance
const i18n = new I18n();
window.i18n = i18n;
