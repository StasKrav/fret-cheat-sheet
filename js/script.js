// ============ ОСНОВНОЙ КОД (ОСТАВЛЯЕМ БЕЗ ИЗМЕНЕНИЙ) ============
class GuitarNeck {
  constructor() {
    this.tuning = ["E4", "B3", "G3", "D3", "A2", "E2"];
    this.notes = {
      sharps: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"],
      flats: ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"],
    };
    this.equivalents = {
      "C#": "Db",
      Db: "C#",
      "D#": "Eb",
      Eb: "D#",
      "F#": "Gb",
      Gb: "F#",
      "G#": "Ab",
      Ab: "G#",
      "A#": "Bb",
      Bb: "A#",
    };
    this.frets = 12;
  }

  normalizeToSharps(note) {
    if (this.equivalents[note]) {
      const flatIndex = this.notes.flats.indexOf(note);
      if (flatIndex !== -1) return this.notes.sharps[flatIndex];
    }
    return note;
  }

  getNote(string, fret) {
    const openNote = this.tuning[string];
    const openNoteName = openNote.match(/^[A-G][#b]?/)[0];
    const octave = parseInt(openNote.slice(openNoteName.length));
    const normalizedOpenNote = this.normalizeToSharps(openNoteName);
    const openNoteIndex = this.notes.sharps.indexOf(normalizedOpenNote);
    const noteIndex = (openNoteIndex + fret) % 12;
    const noteOctave = octave + Math.floor((openNoteIndex + fret) / 12);
    return this.notes.sharps[noteIndex] + noteOctave;
  }

  getBaseNote(string, fret) {
    const fullNote = this.getNote(string, fret);
    return fullNote.replace(/[0-9]/g, "");
  }

  getChordRoot(chord) {
    const match = chord.match(/^[A-G][#♯b♭]?/);
    if (!match) return chord.charAt(0);
    let root = match[0];
    root = root.replace("♯", "#").replace("♭", "b");
    return this.normalizeToSharps(root);
  }

  extractTonic(chord) {
    return this.getChordRoot(chord);
  }

  getChordNotes(chord) {
    const root = this.getChordRoot(chord);
    const rootIndex = this.notes.sharps.indexOf(root);
    if (rootIndex === -1) return [root];

    if (chord.includes("maj7")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 4) % 12],
        this.notes.sharps[(rootIndex + 7) % 12],
        this.notes.sharps[(rootIndex + 11) % 12],
      ];
    } else if (chord.includes("m7")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 3) % 12],
        this.notes.sharps[(rootIndex + 7) % 12],
        this.notes.sharps[(rootIndex + 10) % 12],
      ];
    } else if (chord.includes("7")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 4) % 12],
        this.notes.sharps[(rootIndex + 7) % 12],
        this.notes.sharps[(rootIndex + 10) % 12],
      ];
    } else if (chord.includes("6")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 4) % 12],
        this.notes.sharps[(rootIndex + 7) % 12],
        this.notes.sharps[(rootIndex + 9) % 12],
      ];
    } else if (chord.includes("9")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 4) % 12],
        this.notes.sharps[(rootIndex + 7) % 12],
        this.notes.sharps[(rootIndex + 10) % 12],
        this.notes.sharps[(rootIndex + 14) % 12],
      ];
    } else if (chord.includes("dim7")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 3) % 12],
        this.notes.sharps[(rootIndex + 6) % 12],
        this.notes.sharps[(rootIndex + 9) % 12],
      ];
    } else if (chord.includes("m")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 3) % 12],
        this.notes.sharps[(rootIndex + 7) % 12],
      ];
    } else {
      return [
        root,
        this.notes.sharps[(rootIndex + 4) % 12],
        this.notes.sharps[(rootIndex + 7) % 12],
      ];
    }
  }

  // В классе GuitarNeck:
  getJazzManoucheChords(tonic) {
    const normalizedTonic = this.normalizeToSharps(tonic);
    const rootIndex = this.notes.sharps.indexOf(normalizedTonic);

    if (rootIndex === -1) return []; // Если тоника не найдена

    // Только характерные аккорды джаз-мануш
    return [
      `${tonic}6`, // Мажорный секстаккорд
      `${tonic}9`, // Мажорный нонаккорд
      `${this.notes.sharps[(rootIndex + 5) % 12]}7#9`, // Доминантсептаккорд с повышенной ноной
      `${this.notes.sharps[(rootIndex + 7) % 12]}m6`, // Минорный секстаккорд
      `${this.notes.sharps[(rootIndex + 10) % 12]}7b9`, // Доминантсептаккорд с пониженной ноной
      `${tonic}dim7`, // Уменьшенный септаккорд
    ];
  }
}

// ============ ПЕНТАТОНИКА - ПОЛНАЯ РЕАЛИЗАЦИЯ ============

class PentatonicManager {
  constructor() {
    this.neck = new GuitarNeck();
    this.isActive = false;
    this.currentConfig = null;

    // Паттерны боксов для минорной пентатоники (0 лад = открытая струна)
    // Формат: [бокс][степень][позиция] = [струна, лад, степень]
    // Заменяем boxPatterns в конструкторе PentatonicManager:
    this.boxPatterns = {
      minor: {
        1: [
          // Бокс 1: начинается с корня на 6 струне, лад 0
          [5, 0], // 6 струна, лад 0 - 1
          [5, 3], // 6 струна, лад 3 - 4
          [4, 0], // 5 струна, лад 0 - 1
          [4, 2], // 5 струна, лад 2 - ♭3
          [3, 0], // 4 струна, лад 0 - 1
          [3, 2], // 4 струна, лад 2 - ♭3
          [2, 0], // 3 струна, лад 0 - 1
          [2, 2], // 3 струна, лад 2 - ♭3
          [1, 0], // 2 струна, лад 0 - 1
          [1, 3], // 2 струна, лад 3 - 4
          [0, 0], // 1 струна, лад 0 - 1
          [0, 3], // 1 струна, лад 3 - 4
        ],
        2: [
          // Бокс 2: следующий за боксом 1
          [5, 3], // 6 струна, лад 3 - 4
          [5, 5], // 6 струна, лад 5 - 5
          [4, 2], // 5 струна, лад 2 - ♭3
          [4, 5], // 5 струна, лад 5 - ♭7
          [3, 2], // 4 струна, лад 2 - ♭3
          [3, 5], // 4 струна, лад 5 - ♭7
          [2, 2], // 3 струна, лад 2 - ♭3
          [2, 4], // 3 струна, лад 5 - ♭7
          [1, 3], // 2 струна, лад 3 - 4
          [1, 5], // 2 струна, лад 5 - 5
          [0, 3], // 1 струна, лад 3 - 4
          [0, 5], // 1 струна, лад 5 - 5
        ],
        3: [
          // Бокс 3
          [5, 5], // 6 струна, лад 5 - 5
          [5, 7], // 6 струна, лад 7 - ♭7
          [4, 5], // 5 струна, лад 5 - ♭7
          [4, 7], // 5 струна, лад 7 - 1 (октава выше)
          [3, 5], // 4 струна, лад 5 - ♭7
          [3, 7], // 4 струна, лад 7 - 1
          [2, 4], // 3 струна, лад 5 - ♭7
          [2, 7], // 3 струна, лад 7 - 1
          [1, 5], // 2 струна, лад 5 - 5
          [1, 8], // 2 струна, лад 7 - ♭7
          [0, 5], // 1 струна, лад 5 - 5
          [0, 7], // 1 струна, лад 7 - ♭7
        ],
        4: [
          // Бокс 4
          [5, 7], // 6 струна, лад 7 - ♭7
          [5, 10], // 6 струна, лад 8 - 1 (октава выше)
          [4, 7], // 5 струна, лад 7 - 1
          [4, 10], // 5 струна, лад 9 - ♭3
          [3, 7], // 4 струна, лад 7 - 1
          [3, 9], // 4 струна, лад 9 - ♭3
          [2, 7], // 3 струна, лад 7 - 1
          [2, 9], // 3 струна, лад 9 - ♭3
          [1, 8], // 2 струна, лад 7 - ♭7
          [1, 10], // 2 струна, лад 8 - 1
          [0, 7], // 1 струна, лад 7 - ♭7
          [0, 10], // 1 струна, лад 8 - 1
        ],
        5: [
          // Бокс 5
          [5, 10], // 6 струна, лад 8 - 1
          [5, 12], // 6 струна, лад 10 - ♭3
          [4, 10], // 5 струна, лад 9 - ♭3
          [4, 12], // 5 струна, лад 10 - 4
          [3, 9], // 4 струна, лад 9 - ♭3
          [3, 12], // 4 струна, лад 10 - 4
          [2, 9], // 3 струна, лад 9 - ♭3
          [2, 12], // 3 струна, лад 10 - 4
          [1, 10], // 2 струна, лад 8 - 1
          [1, 12], // 2 струна, лад 10 - ♭3
          [0, 10], // 1 струна, лад 8 - 1
          [0, 12], // 1 струна, лад 10 - ♭3
        ],
      },
    };
  }

  detectPentatonicType(chord) {
    // Автоматическое определение по аккорду
    if (!chord) return "minor";

    const chordUpper = chord.toUpperCase();

    if (
      chord.includes("m") ||
      chord.includes("min") ||
      chord.includes("dim") ||
      chord.includes("-")
    ) {
      return "minor";
    } else if (
      chord.includes("maj") ||
      chord === chordUpper ||
      chord.includes("aug") ||
      chord.includes("+")
    ) {
      return "major";
    }

    // Для септаккордов определяем по базовому аккорду
    const baseChord = chord.replace(/[0-9#♯b♭]/g, "").replace(/7$/, "");
    return baseChord.includes("m") ? "minor" : "major";
  }

  getPentatonicNotes(root, type) {
    const rootIndex = this.neck.notes.sharps.indexOf(
      this.neck.normalizeToSharps(root),
    );

    if (type === "minor") {
      // Минорная пентатоника: 1, ♭3, 4, 5, ♭7
      return [
        this.neck.notes.sharps[rootIndex], // 1
        this.neck.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.neck.notes.sharps[(rootIndex + 5) % 12], // 4
        this.neck.notes.sharps[(rootIndex + 7) % 12], // 5
        this.neck.notes.sharps[(rootIndex + 10) % 12], // ♭7
      ];
    } else {
      // major
      // Мажорная пентатоника: 1, 2, 3, 5, 6
      return [
        this.neck.notes.sharps[rootIndex], // 1
        this.neck.notes.sharps[(rootIndex + 2) % 12], // 2
        this.neck.notes.sharps[(rootIndex + 4) % 12], // 3
        this.neck.notes.sharps[(rootIndex + 7) % 12], // 5
        this.neck.notes.sharps[(rootIndex + 9) % 12], // 6
      ];
    }
  }

  getBluesNote(root) {
    const rootIndex = this.neck.notes.sharps.indexOf(
      this.neck.normalizeToSharps(root),
    );
    // Возвращаем просто ноту как строку, как ожидается в остальном коде
    return this.neck.notes.sharps[(rootIndex + 6) % 12]; // ♭5
  }

  togglePentatonic() {
    const chord = this.getActiveChord();
    if (!chord) return alert("Введите аккорд");

    if (this.isActive) {
      this.hidePentatonic();
    } else {
      this.showPentatonic();
    }
  }

  showPentatonic() {
    const chord = this.getActiveChord();
    if (!chord) return alert("Введите аккорд");

    // Сбрасываем всё на грифе
    this.clearAllFretboardHighlights();

    // Определяем настройки
    const root = this.neck.extractTonic(chord);

    // Получаем выбранный тип пентатоники
    const typeRadios = document.querySelectorAll(
      'input[name="pentatonicType"]',
    );
    let selectedType = "minor";
    typeRadios.forEach((radio) => {
      if (radio.checked) selectedType = radio.value;
    });

    // Получаем опции
    const showBlues = document.getElementById("showBluesNote").checked;
    const activeBoxBtn = document.querySelector(".box-btn.active");
    const box = activeBoxBtn ? activeBoxBtn.dataset.box : "all";

    // Получаем ноты
    const pentatonicNotes = this.getPentatonicNotes(root, selectedType);
    const bluesNote =
      showBlues && selectedType === "minor" ? this.getBluesNote(root) : null;

    // Показываем панель управления
    document.getElementById("pentatonicControls").style.display = "block";
    document.getElementById("togglePentatonicBtn").classList.add("active");

    // Подсвечиваем ноты на грифе
    if (box === "all") {
      this.highlightAllPentatonicNotes(root, pentatonicNotes, bluesNote);
    } else {
      const boxNum = parseInt(box);
      // Используем всегда "minor", так как у нас только минорная пентатоника
      this.highlightPentatonicBox(
        root,
        boxNum,
        "minor", // фиксированный тип
        pentatonicNotes,
        bluesNote,
      );
    }

    // Обновляем информацию
    this.updatePentatonicInfo(
      root,
      selectedType,
      pentatonicNotes,
      bluesNote,
      box,
    );

    // Сохраняем конфигурацию
    this.currentConfig = { root, type: selectedType, box, showBlues };
    this.isActive = true;
  }

  // Получаем аккорд из активной вкладки
  getActiveChord() {
    const activeTab = document.querySelector(".tab-btn.active").dataset.tab;
    switch (activeTab) {
      case "blues":
        return document.getElementById("chordInputBlues").value.trim();
      case "general":
        return document.getElementById("chordInput").value.trim();
      case "manouche":
        return document.getElementById("chordInputManouche").value.trim();
      default:
        return document.getElementById("chordInput").value.trim();
    }
  }

  // НОВЫЙ МЕТОД: Полная очистка грифа
  clearAllFretboardHighlights() {
    const allFrets = document.querySelectorAll(".fret");
    allFrets.forEach((fret) => {
      // Удаляем ВСЕ классы подсветки
      fret.classList.remove(
        "highlight",
        "pentatonic-note",
        "pentatonic-root",
        "blues-note",
        "arpeggio-root",
        "arpeggio-third",
        "arpeggio-fifth",
        "arpeggio-second",
        "arpeggio-sixth",
        "arpeggio-seventh",
        "manouche-note",
        "manouche-root",
        "manouche-characteristic",
      );
      // Сбрасываем ВСЕ стили
      fret.style.fontWeight = "";
      fret.style.animation = "";
      fret.style.backgroundColor = "";
      fret.style.color = "";
      fret.style.borderColor = "";
    });
  }

  // НОВЫЙ МЕТОД: Подсветка всех нот пентатоники
  // НОВЫЙ МЕТОД: Подсветка всех нот пентатоники
  highlightAllPentatonicNotes(root, pentatonicNotes, bluesNote) {
    const allFrets = document.querySelectorAll(".fret");

    allFrets.forEach((fret) => {
      const note = fret.getAttribute("data-note");
      if (!note) return;

      const normalizedNote = this.neck.normalizeToSharps(note);

      // Проверяем, является ли нота пентатоники
      if (pentatonicNotes.includes(normalizedNote)) {
        // Если это корневая нота
        if (normalizedNote === root) {
          fret.classList.add("pentatonic-root");
          fret.classList.remove("pentatonic-note"); // Убираем обычный класс
          fret.style.fontWeight = "bold";
        } else {
          // Обычные ноты пентатоники
          fret.classList.add("pentatonic-note");
          fret.classList.remove("pentatonic-root"); // Убираем корневой класс
          fret.style.fontWeight = "";
        }
      }

      // Проверяем, является ли блюзовой нотой
      if (bluesNote && normalizedNote === bluesNote) {
        fret.classList.add("blues-note");
        fret.classList.remove("pentatonic-note", "pentatonic-root"); // Убираем конфликтующие классы
        fret.style.animation = "blues-note-pulse 2s infinite";
      }
    });
  }

  // НОВЫЙ МЕТОД: Подсветка конкретного бокса
  // НОВЫЙ МЕТОД: Подсветка конкретного бокса
  highlightPentatonicBox(root, boxNum, type, pentatonicNotes, bluesNote) {
    const rootNote = this.neck.normalizeToSharps(root);
    const rootIndex = this.neck.notes.sharps.indexOf(rootNote);

    // Получаем паттерн бокса
    const boxPattern = this.boxPatterns.minor[boxNum];
    if (!boxPattern) {
      console.error(`Паттерн для бокса ${boxNum} не найден`);
      return;
    }

    // Определяем позицию первого бокса для данной тоники
    let rootPositionOnString6 = null;
    for (let fret = 0; fret <= 12; fret++) {
      const note = this.neck.getBaseNote(5, fret); // 6 струна = индекс 5
      if (this.neck.normalizeToSharps(note) === rootNote) {
        rootPositionOnString6 = fret;
        break;
      }
    }

    if (rootPositionOnString6 === null) {
      console.error(`Не найдена позиция корня ${rootNote} на 6 струне`);
      return;
    }

    const shift = rootPositionOnString6;

    // Применяем паттерн со смещением
    boxPattern.forEach(([string, baseFret]) => {
      const fretNumber = baseFret + shift;

      // Проверяем границы грифа
      if (fretNumber > 12) return;

      // Находим элемент на грифе
      const fretElement = document.querySelector(
        `.fret[data-string="${string}"][data-fret="${fretNumber}"]`,
      );

      if (!fretElement) {
        console.warn(`Не найден элемент: струна ${string}, лад ${fretNumber}`);
        return;
      }

      const note = fretElement.getAttribute("data-note");
      if (!note) return;

      const normalizedNote = this.neck.normalizeToSharps(note);

      // Очищаем предыдущие классы пентатоники
      fretElement.classList.remove(
        "pentatonic-note",
        "pentatonic-root",
        "blues-note",
      );
      fretElement.style.fontWeight = "";
      fretElement.style.animation = "";

      // Проверяем и подсвечиваем
      if (pentatonicNotes.includes(normalizedNote)) {
        if (normalizedNote === rootNote) {
          // КОРНЕВАЯ НОТА - красный цвет
          fretElement.classList.add("pentatonic-root");
        } else {
          // Обычные ноты пентатоники - зеленый цвет
          fretElement.classList.add("pentatonic-note");
        }
      }

      if (bluesNote && normalizedNote === bluesNote) {
        fretElement.classList.add("blues-note");
        fretElement.style.animation = "blues-note-pulse 2s infinite";
      }
    });
  }

  hidePentatonic() {
    this.clearAllFretboardHighlights();

    // Скрываем панель пентатоники
    const pentatonicControls = document.getElementById("pentatonicControls");
    if (pentatonicControls) {
      pentatonicControls.style.display = "none";
    }

    document.getElementById("togglePentatonicBtn").classList.remove("active");

    const pentatonicInfo = document.getElementById("pentatonicInfo");
    if (pentatonicInfo) {
      pentatonicInfo.innerHTML = "";
    }

    this.isActive = false;
    this.currentConfig = null;
  }

  updateFromChordChange() {
    if (this.isActive) {
      this.showPentatonic();
    }
  }

  updatePentatonicInfo(root, type, pentatonicNotes, bluesNote, box) {
    const infoDiv = document.getElementById("pentatonicInfo");
    const typeName = type === "minor" ? "Минорная" : "Мажорная";
    const boxText = box === "all" ? "Все позиции" : `Бокс ${box}`;

    let info = `<div><strong>${typeName} пентатоника от ${root}</strong> | ${boxText}</div>`;

    // Простой список нот
    info += `<div>Ноты: ${pentatonicNotes.join(", ")}</div>`;

    if (bluesNote) {
      info += `<div style="color: var(--zenburn-blue);">+ блюзовая нота: ${bluesNote} (♭5)</div>`;
    }

    infoDiv.innerHTML = info;
  }
}

// ============ MANOUCHE SCALES - СПЕЦИФИЧЕСКИЕ ГАММЫ ДЖАЗ-МАНУШ ============

class ManoucheScales {
  constructor() {
    this.neck = new GuitarNeck();
    this.isActive = false;
    this.currentScale = null;

    // Цвета для разных типов нот в мануш-гаммах
    this.noteColors = {
      root: "var(--zenburn-red)",
      characteristic: "var(--zenburn-orange)", // Характерные ноты (♭3, ♭6, ♯4)
      tension: "var(--zenburn-blue)", // Напряженные ноты
      resolution: "var(--zenburn-green)", // Разрешающиеся ноты
      passing: "var(--zenburn-purple)", // Проходящие хроматические
    };
  }

  // Определяем все специфические гаммы мануш
  getScaleIntervals(scaleName) {
    const intervals = {
      // 1. ЦЫГАНСКАЯ МАЖОРНАЯ (основная)
      gypsyMajor: [0, 2, 3, 6, 7, 8, 11], // 1-2-♭3-♯4-5-♭6-7

      // 2. МАЖОРНАЯ ГАРМОНИЧЕСКАЯ
      harmonicMajor: [0, 2, 4, 5, 7, 8, 11], // 1-2-3-4-5-♭6-7

      // 3. МИНОРНАЯ ГАРМОНИЧЕСКАЯ С ♮6 (Django style)
      harmonicMinorNat6: [0, 2, 3, 5, 7, 9, 11], // 1-2-♭3-4-5-6-7

      // 4. ДОРИЙСКИЙ С ♯4
      dorianSharp4: [0, 2, 3, 6, 7, 9, 10], // 1-2-♭3-♯4-5-6-♭7

      // 5. DIMINISHED АРПЕДЖИО (симметричное)
      diminished: [0, 3, 6, 9], // 1-♭3-♭5-6 (♭♭7)

      // 6. ДВОЙНАЯ ХРОМАТИКА (характерные подходы)
      doubleChromatic: [0, 1, 2, 3, 4, 5], // Полутоновые пары

      // 7. МИКСОЛИДИЙСКИЙ ♭6 (для доминант)
      mixolydianFlat6: [0, 2, 4, 5, 7, 8, 10], // 1-2-3-4-5-♭6-♭7

      // 8. АЛЬТЕРИРОВАННАЯ (для V7alt)
      altered: [0, 1, 3, 4, 6, 8, 10], // 1-♭9-♯9-3-♯11-♭13-♭7
    };
    return intervals[scaleName] || intervals.gypsyMajor;
  }

  // Получаем ноты гаммы от тоники
  getScaleNotes(root, scaleName) {
    const rootNote = this.neck.normalizeToSharps(root);
    const rootIndex = this.neck.notes.sharps.indexOf(rootNote);

    if (rootIndex === -1) return [];

    const intervals = this.getScaleIntervals(scaleName);
    return intervals.map((interval) => {
      const noteIndex = (rootIndex + interval) % 12;
      return this.neck.notes.sharps[noteIndex];
    });
  }

  // Определяем тип гаммы по аккорду
  detectScaleForChord(chord) {
    const chordUpper = chord.toUpperCase();

    if (chord.includes("m")) {
      // Минорные аккорды
      if (chord.includes("m6") || chord.includes("m7")) {
        return "dorianSharp4"; // Для Am6, Am7
      }
      return "harmonicMinorNat6"; // Для Am, Am(maj7)
    } else if (chord.includes("7")) {
      // Доминанты
      if (chord.includes("7#9") || chord.includes("7alt")) {
        return "altered";
      } else if (chord.includes("7b9")) {
        return "mixolydianFlat6";
      }
      return "diminished"; // Django часто использует diminished над V7
    } else {
      // Мажорные аккорды
      if (chord.includes("6") || chord.includes("maj7")) {
        return "harmonicMajor";
      }
      return "gypsyMajor"; // По умолчанию для мажора
    }
  }

  // Получаем аккорд из активной вкладки
  getActiveChord() {
    const activeTab = document.querySelector(".tab-btn.active").dataset.tab;
    switch (activeTab) {
      case "manouche":
        return document.getElementById("chordInputManouche").value.trim();
      case "general":
        return document.getElementById("chordInput").value.trim();
      case "blues":
        return document.getElementById("chordInputBlues").value.trim();
      default:
        return document.getElementById("chordInputManouche").value.trim();
    }
  }

  // Показываем гамму на грифе
  showScale(scaleName = null) {
    const chord = this.getActiveChord();
    if (!chord) return alert("Введите аккорд");

    // Определяем гамму, если не указана
    if (!scaleName) {
      scaleName = this.detectScaleForChord(chord);
    }

    const root = this.neck.extractTonic(chord);
    const scaleNotes = this.getScaleNotes(root, scaleName);

    if (!scaleNotes.length) {
      console.error("Не удалось получить ноты гаммы");
      return;
    }

    // Очищаем гриф
    this.clearAllHighlights();

    // Показываем панель управления
    document.getElementById("manoucheControls").style.display = "block";
    document.getElementById("toggleManoucheBtn").classList.add("active");

    // Подсвечиваем ноты гаммы
    this.highlightScaleNotes(root, scaleNotes, scaleName);

    // Обновляем информацию
    this.updateScaleInfo(root, scaleName, scaleNotes);

    // Сохраняем текущую конфигурацию
    this.currentScale = { root, scaleName, notes: scaleNotes };
    this.isActive = true;

    setTimeout(() => {
      if (window.djangoFingerings) {
        const suggested = window.djangoFingerings.suggestFingering(chord);
        const btn = document.querySelector(`.fingering-btn[data-fingering="${suggested}"]`);
        if (btn) {
          btn.click();
        }
      }
    }, 300);
  }

  // Подсветка нот гаммы на грифе
  highlightScaleNotes(root, scaleNotes, scaleName) {
    const allFrets = document.querySelectorAll(".fret");
    const rootNote = this.neck.normalizeToSharps(root);

    // Определяем характерные ноты для этой гаммы
    const characteristicNotes = this.getCharacteristicNotes(root, scaleName);

    allFrets.forEach((fret) => {
      const note = fret.getAttribute("data-note");
      if (!note) return;

      const normalizedNote = this.neck.normalizeToSharps(note);

      // Проверяем, принадлежит ли нота гамме
      if (scaleNotes.includes(normalizedNote)) {
        fret.classList.add("manouche-note");

        // Корневая нота
        if (normalizedNote === rootNote) {
          fret.classList.add("manouche-root");
          fret.style.backgroundColor = this.noteColors.root;
          fret.style.fontWeight = "bold";
        }
        // Характерные ноты (♭3, ♭6, ♯4)
        else if (characteristicNotes.includes(normalizedNote)) {
          fret.classList.add("manouche-characteristic");
          fret.style.backgroundColor = this.noteColors.characteristic;
        }
        // Остальные ноты гаммы
        else {
          fret.style.backgroundColor = this.noteColors.resolution;
        }
      }
    });

    this.showGypsyJazzChords();
  }

  // Получаем характерные ноты для каждой гаммы
  getCharacteristicNotes(root, scaleName) {
    const rootNote = this.neck.normalizeToSharps(root);
    const rootIndex = this.neck.notes.sharps.indexOf(rootNote);

    const characteristicMap = {
      gypsyMajor: [
        this.neck.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.neck.notes.sharps[(rootIndex + 6) % 12], // ♯4
        this.neck.notes.sharps[(rootIndex + 8) % 12], // ♭6
      ],
      harmonicMajor: [
        this.neck.notes.sharps[(rootIndex + 8) % 12], // ♭6
      ],
      harmonicMinorNat6: [
        this.neck.notes.sharps[(rootIndex + 11) % 12], // 7 (мажорная)
      ],
      dorianSharp4: [
        this.neck.notes.sharps[(rootIndex + 6) % 12], // ♯4
      ],
      diminished: [
        this.neck.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.neck.notes.sharps[(rootIndex + 6) % 12], // ♭5
        this.neck.notes.sharps[(rootIndex + 9) % 12], // 6 (♭♭7)
      ],
    };

    return characteristicMap[scaleName] || [];
  }

  // Обновляем информацию о гамме
  updateScaleInfo(root, scaleName, scaleNotes) {
    const infoDiv = document.getElementById("manoucheInfo");
    const scaleNames = {
      gypsyMajor: "Цыганская мажорная",
      harmonicMajor: "Мажорная гармоническая",
      harmonicMinorNat6: "Минорная гармоническая с ♮6",
      dorianSharp4: "Дорийский с ♯4",
      diminished: "Diminished арпеджио",
      doubleChromatic: "Двойная хроматика",
      mixolydianFlat6: "Миксолидийский ♭6",
      altered: "Альтерированная",
    };

    const formula = this.getScaleFormula(scaleName);
    const characteristic = this.getCharacteristicDescription(scaleName);

    let info = `
      <div class="manouche-scale-header">
        <strong>${scaleNames[scaleName] || scaleName} от ${root}</strong>
        <span class="scale-formula">${formula}</span>
      </div>
      <div class="scale-notes">Ноты: <strong>${scaleNotes.join(", ")}</strong></div>
      <div class="scale-characteristic">${characteristic}</div>
      <div class="django-tip">${this.getDjangoTip(scaleName)}</div>
    `;

    infoDiv.innerHTML = info;
  }

  // Формулы гамм
  getScaleFormula(scaleName) {
    const formulas = {
      gypsyMajor: "1 - 2 - ♭3 - ♯4 - 5 - ♭6 - 7",
      harmonicMajor: "1 - 2 - 3 - 4 - 5 - ♭6 - 7",
      harmonicMinorNat6: "1 - 2 - ♭3 - 4 - 5 - 6 - 7",
      dorianSharp4: "1 - 2 - ♭3 - ♯4 - 5 - 6 - ♭7",
      diminished: "1 - ♭3 - ♭5 - 6 (♭♭7)",
      doubleChromatic: "Полутоновые пары",
      mixolydianFlat6: "1 - 2 - 3 - 4 - 5 - ♭6 - ♭7",
      altered: "1 - ♭9 - ♯9 - 3 - ♯11 - ♭13 - ♭7",
    };
    return formulas[scaleName] || "";
  }

  // Описание характерных особенностей
  getCharacteristicDescription(scaleName) {
    const descriptions = {
      gypsyMajor:
        '🎻 <em>Классический "цыганский" звук Django. Используй ♭3 и ♭6 для аутентичного колорита.</em>',
      harmonicMajor:
        "🎵 <em>Мажор с напряжённой ♭6. Отлично подходит для аккордов 6 и maj7.</em>",
      harmonicMinorNat6:
        '🎹 <em>Минор с мажорной септимой. Характерно для "Minor Swing".</em>',
      diminished:
        "⚡ <em>Симметричное арпеджио - основа техники Django! Используй как проходящие аккорды.</em>",
      dorianSharp4:
        "✨ <em>Дорийский с повышенной квартой. Придаёт современное звучание.</em>",
    };
    return descriptions[scaleName] || "";
  }

  // Советы Django для каждой гаммы
  getDjangoTip(scaleName) {
    const tips = {
      gypsyMajor:
        "💡 <strong>Совет Django:</strong> Акцентируй ♭3 и ♭6 в быстрых пассажах.",
      harmonicMajor:
        "💡 <strong>Совет Django:</strong> Разрешай ♭6 в 5 или ♭7.",
      diminished:
        "💡 <strong>Совет Django:</strong> Играй diminished арпеджио через каждые полтона.",
      harmonicMinorNat6:
        "💡 <strong>Совет Django:</strong> Используй мажорную септиму как подход к тонике.",
    };
    return tips[scaleName] || "";
  }

  // Очистка подсветки
  clearAllHighlights() {
    document.querySelectorAll(".fret").forEach((fret) => {
      fret.classList.remove(
        "manouche-note",
        "manouche-root",
        "manouche-characteristic",
        "manouche-tension",
      );
      fret.style.backgroundColor = "";
      fret.style.fontWeight = "";
    });
  }

  // Переключение видимости
  toggleManouche() {
    const chord = this.getActiveChord();
    if (!chord) return alert("Введите аккорд");

    if (this.isActive) {
      this.hideManouche();
    } else {
      this.showScale();
    }
  }

  // Скрыть панель
  hideManouche() {
    this.clearAllHighlights();

    // Скрываем панель Manouche
      const manoucheControls = document.getElementById("manoucheControls");
      if (manoucheControls) {
        manoucheControls.style.display = "none";
      }
      
      // Скрываем информацию о ликах
      const licksContainer = document.getElementById("licksInfoContainer");
      if (licksContainer) {
        licksContainer.style.display = "none";
      }

    document.getElementById("toggleManoucheBtn").classList.remove("active");
    const manoucheInfo = document.getElementById("manoucheInfo");
    if (manoucheInfo) {
      manoucheInfo.innerHTML = "";
    }
    this.isActive = false;
    this.currentScale = null;
  }

  // Обновить при изменении аккорда
  updateFromChordChange() {
    if (this.isActive) {
      this.showScale();
    }
  }

  showGypsyJazzChords() {
    const chord = this.getActiveChord();
    if (!chord) {
      alert("Введите аккорд");
      return;
    }

    const tonic = this.neck.extractTonic(chord);
    const chords = this.neck.getJazzManoucheChords(tonic);

    const sequenceDiv = document.getElementById("chordSequence");
    if (!sequenceDiv) return;

    if (!chords || chords.length === 0) {
      sequenceDiv.innerHTML = "<em>Не удалось получить аккорды</em>";
      sequenceDiv.style.display = "block";
      return;
    }

    let chordsHTML = chords
      .map(
        (chord) =>
          `<span class="chord-link" data-chord="${chord}">${chord}</span>`,
      )
      .join(", ");

    sequenceDiv.innerHTML = `
      <strong>Характерные аккорды джаз-мануш от ${tonic}:</strong><br>
      ${chordsHTML}
      <br><br>
      <em>Кликните на любой аккорд для просмотра на грифе</em>
    `;

    sequenceDiv.style.display = "block";

    // Обработчики кликов
    sequenceDiv.querySelectorAll(".chord-link").forEach((link) => {
      link.addEventListener("click", function () {
        const chord = this.getAttribute("data-chord");
        // Устанавливаем значение во все поля ввода
        document.getElementById("chordInput").value = chord;
        document.getElementById("chordInputBlues").value = chord;
        document.getElementById("chordInputManouche").value = chord;

        highlightChordNotes(chord);

        // Подсвечиваем выбранный аккорд
        sequenceDiv.querySelectorAll(".chord-link").forEach((l) => {
          l.style.background = "";
        });
        this.style.background = "rgba(143, 178, 143, 0.3)";
      });
    });
  }
}

// ============ DJANGO LICKS - ХАРАКТЕРНЫЕ ФРАЗЫ ============

class DjangoLicks {
  constructor() {
    this.neck = new GuitarNeck();
    this.licks = {
      // 1. Классический diminished run
      dimRun: {
        name: "Diminished Run",
        description: "Классическое diminished арпеджио Django",
        pattern: [
          [5, 0],
          [5, 3],
          [4, 1],
          [4, 4],
          [3, 2],
          [3, 5],
          [2, 3],
          [2, 6],
        ],
        notes: ["G", "Bb", "Db", "E", "G"],
        tempo: "Быстро",
        usage: "Over G7 → Cmaj",
      },

      // 2. Цыганская мажорная гамма
      gypsySweep: {
        name: "Gypsy Major Sweep",
        description: "Быстрый пассаж цыганской мажорной гаммы",
        pattern: [
          [5, 0],
          [4, 2],
          [4, 0],
          [3, 1],
          [3, 0],
          [2, 2],
          [2, 0],
          [1, 3],
          [1, 0],
        ],
        notes: ["G", "A", "Bb", "C#", "D", "Eb", "F#", "G"],
        tempo: "Очень быстро",
        usage: "Over G6",
      },

      // 3. Хроматический подход
      chromaticApproach: {
        name: "Chromatic Approach",
        description: "Хроматический подход к аккордовому тону",
        pattern: [
          [2, 5],
          [2, 6],
          [2, 7],
          [1, 5],
          [1, 6],
        ],
        notes: ["A", "Bb", "B", "C", "C#"],
        tempo: "Средне",
        usage: "Approaching Dm",
      },

      // 4. Тремоло-паттерн
      tremoloPattern: {
        name: "Tremolo Pattern",
        description: "Характерное тремоло Django",
        pattern: [
          [1, 3],
          [1, 3],
          [1, 3],
          [1, 3],
          [2, 2],
          [2, 2],
          [2, 2],
          [2, 2],
        ],
        notes: ["C", "C", "C", "C", "B", "B", "B", "B"],
        tempo: "Медленно с тремоло",
        usage: "Over Am7",
      },
    };
  }

  // Показать лик на грифе
  showLick(lickName, position = 0) {
    const lick = this.licks[lickName];
    if (!lick) return;
  
    // Сначала очищаем ВСЕ подсветки
    clearAllHighlights();
    
    // Очищаем подсветку ликов
    this.clearLickHighlight();
  
    // Применяем позицию (сдвиг ладов)
    lick.pattern.forEach(([string, fret], index) => {
      const actualFret = fret + position;
      if (actualFret > 12) return;
  
      const fretElement = document.querySelector(
        `.fret[data-string="${string}"][data-fret="${actualFret}"]`,
      );
  
      if (fretElement) {
        fretElement.classList.add("django-lick-note");
        fretElement.classList.add(`lick-note-${index % 4}`); // Для последовательности
  
        // Добавляем цифру порядка нот
        const orderSpan = document.createElement("span");
        orderSpan.className = "lick-order";
        orderSpan.textContent = (index + 1).toString();
        fretElement.appendChild(orderSpan);
      }
    });
  
    this.showLickInfo(lick);
  }

  // Информация о лике
  showLickInfo(lick) {
    const container = document.getElementById("licksInfoContainer");
    if (!container) return;
    
    // Показываем контейнер
    container.style.display = "block";
    
    container.innerHTML = `
      <div class="django-lick-info">
        <div class="lick-header">
          <strong>🎸 ${lick.name}</strong>
          <span class="lick-tempo">${lick.tempo}</span>
        </div>
        <div class="lick-description">${lick.description}</div>
        <div class="lick-notes">Ноты: <strong>${lick.notes.join(" - ")}</strong></div>
        <div class="lick-usage">Использование: ${lick.usage}</div>
        <div class="lick-tip">💡 <em>Практикуй медленно, затем увеличивай темп</em></div>
      </div>
    `;
  }

  clearLickHighlight() {
    document.querySelectorAll(".fret").forEach((fret) => {
      fret.classList.remove(
        "django-lick-note",
        "lick-note-0",
        "lick-note-1",
        "lick-note-2",
        "lick-note-3",
      );
      const orderSpan = fret.querySelector(".lick-order");
      if (orderSpan) orderSpan.remove();
    });
  }
}

// ============ DJANGO TYPICAL FINGERINGS ============

class DjangoFingerings {
  constructor() {
    this.neck = new GuitarNeck();
    
    // Типичные аппликатуры Django для разных гамм
    this.fingerings = {
      // 1. ОТКРЫТАЯ ПОЗИЦИЯ (для аккордов Am, Dm, E7)
      'open': {
        name: 'Открытая позиция',
        description: 'Базовая позиция для стандартных аккордов мануш',
        fingers: [
          // [string, fret, finger, isRoot, noteDegree]
          [5, 0, 'T', true, '1'],   // 6 струна, открытая, большой палец, корень
          [4, 2, '1', false, '3'],  // 5 струна, 2 лад, указательный
          [3, 2, '2', false, '5'],  // 4 струна, 2 лад, средний
          [2, 1, '3', false, '♭7'], // 3 струна, 1 лад, безымянный
          [1, 0, '0', false, '2'],  // 2 струна, открытая
          [0, 0, 'T', false, '5']   // 1 струна, открытая, большой палец
        ],
        chords: ['Am', 'Dm', 'E7', 'G'],
        tip: 'Используй большой палец для басовых нот на 6 и 1 струнах'
      },

      // 2. III ПОЗИЦИЯ (характерная для быстрых пассажей)
      'position3': {
        name: 'III позиция (любимая Django)',
        description: 'Центральная позиция для импровизации',
        fingers: [
          [5, 3, '1', true, '1'],   // 6 струна, 3 лад, указательный, корень
          [4, 5, '3', false, '3'],  // 5 струна, 5 лад, безымянный
          [3, 5, '4', false, '5'],  // 4 струна, 5 лад, мизинец
          [2, 4, '2', false, '♭7'], // 3 струна, 4 лад, средний
          [1, 3, '1', false, '2'],  // 2 струна, 3 лад, указательный
          [0, 3, '1', false, '5']   // 1 струна, 3 лад, указательный
        ],
        chords: ['C', 'F', 'A7'],
        tip: 'Держи пальцы компактно для быстрых перемещений'
      },

      // 3. V ПОЗИЦИЯ (для diminished арпеджио)
      'position5': {
        name: 'V позиция (diminished)',
        description: 'Оптимальная позиция для уменьшенных арпеджио',
        fingers: [
          [5, 5, '1', true, '1'],   // Корень
          [4, 7, '3', false, '♭3'], 
          [3, 5, '1', false, '♭5'], // Тот же палец, другая струна
          [2, 7, '3', false, '6'],  // ♭♭7
          [1, 6, '2', false, '♭3'], // Повтор ♭3 октавой выше
          [0, 5, '1', false, '1']   // Корень октавой выше
        ],
        chords: ['Gdim7', 'Bbdim7', 'Dbdim7', 'Edim7'],
        tip: 'Используй симметричность diminished - паттерн повторяется каждые 3 лада'
      },

      // 4. VII ПОЗИЦИЯ (цыганская мажорная гамма)
      'position7': {
        name: 'VII позиция (цыганская мажорная)',
        description: 'Высокая позиция для соло и быстрых пассажей',
        fingers: [
          [5, 7, '2', true, '1'],    // Корень
          [4, 9, '4', false, '♭3'],  // ♭3
          [3, 8, '3', false, '♯4'],  // ♯4 (характерная!)
          [2, 7, '2', false, '5'],   // 5
          [1, 10, '4', false, '♭6'], // ♭6
          [0, 7, '1', false, '7']    // 7
        ],
        chords: ['G6', 'Bm7', 'D7#9'],
        tip: 'Акцентируй ♭3 и ♭6 для аутентичного звучания'
      },

      // 5. ЛЮБИМАЯ АППЛИКАТУРА DJANGO (для Am6)
      'djangoFav': {
        name: 'Любимая аппликатура Django',
        description: 'Классическая форма для Am6 как в "Minor Swing"',
        fingers: [
          [5, 0, 'T', true, '1'],   // Открытая A
          [4, 1, '1', false, '♭3'], // Bb
          [3, 2, '2', false, '4'],  // C
          [2, 2, '3', false, '6'],  // F# (характерная!)
          [1, 0, '0', false, '1'],  // A октавой выше
          [0, 0, 'T', false, '4']   // C октавой выше
        ],
        chords: ['Am6', 'Dm6', 'E7b9'],
        tip: 'Используй большой палец для баса и верхней ноты одновременно'
      },

      // 6. ХРОМАТИЧЕСКАЯ АППЛИКАТУРА (для подходов)
      'chromatic': {
        name: 'Хроматическая аппликатура',
        description: 'Для хроматических подходов и мелизмов',
        fingers: [
          [5, 5, '1', true, '1'],   // Корень
          [5, 6, '1', false, '♭2'], // Полутон вверх
          [4, 5, '1', false, '5'],  // Квинта
          [4, 6, '2', false, '♭6'], // Полутон
          [3, 5, '1', false, '1'],  // Корень
          [3, 6, '2', false, '♭2']  // Полутон
        ],
        chords: ['любые доминанты'],
        tip: 'Играй соседними пальцами для точности хроматических ходов'
      }
    };
  }

  // Показать аппликатуру на грифе
  showFingering(fingeringKey, root = 'A') {
    const fingering = this.fingerings[fingeringKey];
    if (!fingering) return;

    // Очищаем предыдущую аппликатуру
    this.clearFingeringHighlight();

    // Применяем позицию в зависимости от тоники
    const rootNote = this.neck.normalizeToSharps(root);
    let rootPositionOnString6 = null;
    
    // Находим позицию корня на 6 струне
    for (let fret = 0; fret <= 12; fret++) {
      const note = this.neck.getBaseNote(5, fret);
      if (this.neck.normalizeToSharps(note) === rootNote) {
        rootPositionOnString6 = fret;
        break;
      }
    }

    // Если не нашли корень на 6 струне, используем 5 струну
    if (rootPositionOnString6 === null) {
      for (let fret = 0; fret <= 12; fret++) {
        const note = this.neck.getBaseNote(4, fret);
        if (this.neck.normalizeToSharps(note) === rootNote) {
          rootPositionOnString6 = fret - 5; // Компенсируем разницу
          break;
        }
      }
    }

    // Применяем аппликатуру со сдвигом
    fingering.fingers.forEach(([string, baseFret, finger, isRoot, degree]) => {
      const fretNumber = baseFret + (rootPositionOnString6 || 0);
      
      if (fretNumber < 0 || fretNumber > 12) return;

      const fretElement = document.querySelector(
        `.fret[data-string="${string}"][data-fret="${fretNumber}"]`
      );

      if (fretElement) {
        // Добавляем классы
        fretElement.classList.add('django-fingering-note');
        if (isRoot) {
          fretElement.classList.add('fingering-root');
        }
        
        // Добавляем цифру пальца
        const fingerSpan = document.createElement('span');
        fingerSpan.className = 'finger-number';
        fingerSpan.textContent = finger;
        fingerSpan.title = this.getFingerName(finger);
        fretElement.appendChild(fingerSpan);

        // Добавляем степень аккорда
        if (degree) {
          const degreeSpan = document.createElement('span');
          degreeSpan.className = 'note-degree';
          degreeSpan.textContent = degree;
          fretElement.appendChild(degreeSpan);
        }
      }
    });

    // Показываем информацию об аппликатуре
    this.showFingeringInfo(fingering);
  }

  // Имя пальца по символу
  getFingerName(finger) {
    const names = {
      'T': 'Большой палец',
      '1': 'Указательный',
      '2': 'Средний',
      '3': 'Безымянный',
      '4': 'Мизинец',
      '0': 'Открытая струна'
    };
    return names[finger] || finger;
  }

  // Информация об аппликатуре
  showFingeringInfo(fingering) {
    const diagramDiv = document.getElementById('fingeringDiagram');
    if (!diagramDiv) return;

    let html = `
      <div style="margin-bottom: 8px;">
        <strong style="color: var(--zenburn-yellow);">${fingering.name}</strong>
      </div>
      <div style="font-size: 10px; margin-bottom: 5px; color: var(--zenburn-fg-dim);">
        ${fingering.description}
      </div>
      <div style="margin: 5px 0;">
        <span style="color: var(--zenburn-green);">Подходит для:</span> 
        ${fingering.chords.join(', ')}
      </div>
      <div style="margin-top: 8px; padding: 8px; background: rgba(223, 175, 143, 0.1); border-radius: 3px;">
        <span style="color: var(--zenburn-orange);">💡 Совет:</span> 
        <em style="font-size: 10px;">${fingering.tip}</em>
      </div>
      <div style="margin-top: 10px; font-size: 9px; color: var(--zenburn-comment);">
        <div><span class="finger-legend" style="background: var(--zenburn-red);">T</span> = Большой палец</div>
        <div><span class="finger-legend" style="background: var(--zenburn-green);">1</span> = Указательный</div>
        <div><span class="finger-legend" style="background: var(--zenburn-blue);">2</span> = Средний</div>
        <div><span class="finger-legend" style="background: var(--zenburn-purple);">3</span> = Безымянный</div>
        <div><span class="finger-legend" style="background: var(--zenburn-orange);">4</span> = Мизинец</div>
      </div>
    `;

    diagramDiv.innerHTML = html;
  }

  clearFingeringHighlight() {
    document.querySelectorAll('.fret').forEach((fret) => {
      fret.classList.remove('django-fingering-note', 'fingering-root');
      // Удаляем старые спан
      const fingerSpan = fret.querySelector('.finger-number');
      const degreeSpan = fret.querySelector('.note-degree');
      if (fingerSpan) fingerSpan.remove();
      if (degreeSpan) degreeSpan.remove();
    });
  }

  // Автоматически выбрать аппликатуру по аккорду
  suggestFingering(chord) {
    const chordUpper = chord.toUpperCase();
    
    if (chord.includes('dim')) return 'position5';
    if (chord.includes('m6')) return 'djangoFav';
    if (chord.includes('7#9') || chord.includes('7b9')) return 'position7';
    if (chord.includes('m')) return 'open';
    if (chord.includes('6')) return 'position3';
    
    return 'open'; // по умолчанию
  }
}


// -------- конец классов ---------

// ============ АРПЕДЖИО ============
class ArpeggioManager {
  constructor() {
    this.neck = new GuitarNeck();
    this.currentArpeggio = null;
  }

  // Получаем аккорд из активной вкладки
  getActiveChord() {
    const activeTab = document.querySelector(".tab-btn.active").dataset.tab;
    switch (activeTab) {
      case "general":
        return document.getElementById("chordInput").value.trim();
      case "blues":
        return document.getElementById("chordInputBlues").value.trim();
      case "manouche":
        return document.getElementById("chordInputManouche").value.trim();
      default:
        return document.getElementById("chordInput").value.trim();
    }
  }

  getArpeggioType(chord) {
    // Определяем тип арпеджио по аккорду
    if (chord.includes("m")) {
      return "minor";
    }
    return "major"; // по умолчанию мажорное
  }

  getArpeggioNotes(root, type = "major") {
    const rootIndex = this.neck.notes.sharps.indexOf(
      this.neck.normalizeToSharps(root),
    );

    let notes = [];

    // Базовые ноты арпеджио
    if (type === "minor") {
      notes = [
        this.neck.notes.sharps[rootIndex], // 1
        this.neck.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.neck.notes.sharps[(rootIndex + 7) % 12], // 5
      ];
    } else {
      notes = [
        this.neck.notes.sharps[rootIndex], // 1
        this.neck.notes.sharps[(rootIndex + 4) % 12], // 3
        this.neck.notes.sharps[(rootIndex + 7) % 12], // 5
      ];
    }

    return notes;
  }

  addExtensions(notes, root, addSecond, addSixth, addSeventh) {
    const rootIndex = this.neck.notes.sharps.indexOf(
      this.neck.normalizeToSharps(root),
    );

    let extendedNotes = [...notes];

    if (addSecond) {
      extendedNotes.push(this.neck.notes.sharps[(rootIndex + 2) % 12]); // 2
    }

    if (addSixth) {
      extendedNotes.push(this.neck.notes.sharps[(rootIndex + 9) % 12]); // 6
    }

    if (addSeventh) {
      // Определяем тип септимы
      let seventhInterval = 11; // мажорная по умолчанию
      if (this.currentArpeggio && this.currentArpeggio.type === "minor") {
        seventhInterval = 10; // малая для минора
      }
      extendedNotes.push(
        this.neck.notes.sharps[(rootIndex + seventhInterval) % 12],
      ); // 7
    }

    return extendedNotes;
  }

  showArpeggio() {
    const chord = this.getActiveChord();
    if (!chord) return alert("Введите аккорд");

    const root = this.neck.extractTonic(chord);
    const type = this.getArpeggioType(chord);
    const addSecond = document.getElementById("addSecond").checked;
    const addSixth = document.getElementById("addSixth").checked;
    const addSeventh = document.getElementById("addSeventh").checked;

    const baseNotes = this.getArpeggioNotes(root, type);
    const extendedNotes = this.addExtensions(
      baseNotes,
      root,
      addSecond,
      addSixth,
      addSeventh,
    );

    this.currentArpeggio = {
      root,
      type,
      notes: extendedNotes,
      baseNotes,
    };

    this.visualizeArpeggio(extendedNotes, root, type);
    return this.currentArpeggio;
  }

  visualizeArpeggio(notes, root, type) {
    clearAllHighlights(); // Полная очистка перед арпеджио
    const rootNote = notes[0];
    const thirdNote = notes[1];
    const fifthNote = notes[2];
    document.querySelectorAll(".fret").forEach((fret) => {
      const note = fret.getAttribute("data-note");
      const normalizedNote = this.neck.normalizeToSharps(note);
      if (normalizedNote === rootNote) {
        fret.classList.add("arpeggio-root");
      } else if (normalizedNote === thirdNote) {
        fret.classList.add("arpeggio-third");
      } else if (normalizedNote === fifthNote) {
        fret.classList.add("arpeggio-fifth");
      } else if (notes.includes(normalizedNote)) {
        const rootIndex = this.neck.notes.sharps.indexOf(
          this.neck.normalizeToSharps(root),
        );
        const noteIndex = this.neck.notes.sharps.indexOf(normalizedNote);
        let interval = (noteIndex - rootIndex + 12) % 12;
        if (interval === 2) fret.classList.add("arpeggio-second");
        else if (interval === 9) fret.classList.add("arpeggio-sixth");
        else if (interval === 10 || interval === 11)
          fret.classList.add("arpeggio-seventh");
      }
    });
    this.showArpeggioInfo(root, type, notes);
  }

  showArpeggioInfo(root, type, notes) {
    const chordNotesDiv = document.getElementById("chordNotes");

    // Удаляем старую информацию об арпеджио
    const oldInfo = document.querySelector(".arpeggio-info");
    if (oldInfo) oldInfo.remove();

    // Создаем новую
    const arpeggioInfoDiv = document.createElement("div");
    arpeggioInfoDiv.className = "arpeggio-info";

    const typeName = type === "minor" ? "Минорное" : "Мажорное";
    const typeClass =
      type === "minor" ? "arpeggio-type-minor" : "arpeggio-type-major";
    const typeText = type === "minor" ? "min" : "maj";

    // Формируем схему
    let pattern = type === "minor" ? "1 - ♭3 - 5" : "1 - 3 - 5";
    const addSecond = document.getElementById("addSecond").checked;
    const addSixth = document.getElementById("addSixth").checked;
    const addSeventh = document.getElementById("addSeventh").checked;

    if (addSecond) pattern += " + 2";
    if (addSixth) pattern += " + 6";
    if (addSeventh) pattern += type === "minor" ? " + ♭7" : " + 7";

    arpeggioInfoDiv.innerHTML = `
            <strong>
                ${typeName} арпеджио от ${root}
                <span class="arpeggio-type-badge ${typeClass}">${typeText}</span>
            </strong>
            <div style="margin: 5px 0;">Ноты: <strong>${notes.join(", ")}</strong></div>
            <div class="arpeggio-pattern">🎵 ${pattern}</div>
        `;

    chordNotesDiv.parentNode.insertBefore(
      arpeggioInfoDiv,
      chordNotesDiv.nextSibling,
    );
  }

  clear() {
    document.querySelectorAll(".fret").forEach((fret) => {
      fret.classList.remove(
        "arpeggio-root",
        "arpeggio-third",
        "arpeggio-fifth",
        "arpeggio-second",
        "arpeggio-sixth",
        "arpeggio-seventh",
        "highlight",
      );
    });
    const arpeggioInfoDiv = document.querySelector(".arpeggio-info");
    if (arpeggioInfoDiv) arpeggioInfoDiv.remove();
    this.currentArpeggio = null;
  }

  updateExtensions() {
    if (this.currentArpeggio) {
      this.showArpeggio();
    }
  }
}

// ============ ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ============
let pentatonicManager;
let manoucheScales;
let djangoLicks;
let arpeggioManager;
let djangoFingerings;

// ============ ОСНОВНЫЕ ФУНКЦИИ ============

function renderFretBoard() {
  const neck = new GuitarNeck();
  const fretBoard = document.getElementById("fretBoard");
  const stringNames = ["e", "B", "G", "D", "A", "E"];

  let html = '<div class="fret-numbers"><span></span>';
  for (let fret = 0; fret <= 12; fret++) {
    html += fret === 0 ? "<span></span>" : `<span>${fret}</span>`;
  }
  html += "</div>";

  for (let string = 0; string < 6; string++) {
    html += `<div class="string"><div class="string-name">${stringNames[string]}</div>`;
    for (let fret = 0; fret <= 12; fret++) {
      const note = neck.getBaseNote(string, fret);
      const fullNote = neck.getNote(string, fret);
      const isNut = fret === 0;
      html += `<div class="fret ${isNut ? "nut" : ""}" 
                        data-string="${string}" 
                        data-fret="${fret}"
                        data-note="${note}"
                        data-full="${fullNote}">`;
      html += !isNut ? note : "○";
      html += `</div>`;
    }
    html += `</div>`;
  }

  fretBoard.innerHTML = html;
}

function clearAllHighlights() {
  document.querySelectorAll(".fret").forEach((fret) => {
    fret.classList.remove(
      "highlight",
      "pentatonic-note",
      "pentatonic-root",
      "blues-note",
      "arpeggio-root",
      "arpeggio-third",
      "arpeggio-fifth",
      "arpeggio-second",
      "arpeggio-sixth",
      "arpeggio-seventh",
      "manouche-note",
      "manouche-root",
      "manouche-characteristic",
      "django-lick-note",
      "lick-note-0",
      "lick-note-1",
      "lick-note-2",
      "lick-note-3",
    );
    fret.style.fontWeight = "";
    fret.style.animation = "";
    fret.style.backgroundColor = "";
    fret.style.color = "";
    fret.style.borderColor = "";

    // Удаляем порядковые номера из фраз Django
    const orderSpan = fret.querySelector(".lick-order");
    if (orderSpan) orderSpan.remove();
  });
}

function highlightChordNotes(chord) {
  clearAllHighlights();

  const neck = new GuitarNeck();
  const chordNotes = neck.getChordNotes(chord);

  document.querySelectorAll(".fret").forEach((fret) => {
    const note = fret.getAttribute("data-note");
    const normalizedNote = neck.normalizeToSharps(note);
    if (chordNotes.includes(normalizedNote)) {
      fret.classList.add("highlight");
    }
  });

  document.getElementById("chordNotes").textContent =
    `${chord}: ${chordNotes.join(", ")}`;
}

// ============ УПРАВЛЕНИЕ ВКЛАДКАМИ ============

// В функции setActiveTab добавьте:
function setActiveTab(tabId) {
  // Скрываем все вкладки
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.remove("active");
  });

  // Показываем активную вкладку
  document.getElementById(`${tabId}Tab`).classList.add("active");

  // Обновляем кнопки вкладок
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  document
    .querySelector(`.tab-btn[data-tab="${tabId}"]`)
    .classList.add("active");

  // Очищаем подсветку при переключении вкладок
  clearAllHighlights();

  // Скрываем все панели управления
  document
    .querySelectorAll(
      ".arpeggio-controls, .pentatonic-controls, .manouche-controls",
    )
    .forEach((panel) => {
      panel.style.display = "none";
    });

  // Сбрасываем активные состояния кнопок
  document
    .querySelectorAll(
      ".arpeggio-btn.active, .pentatonic-btn.active, .manouche-btn.active",
    )
    .forEach((btn) => btn.classList.remove("active"));

  // Скрываем блок аккордов
  document.getElementById("chordSequence").style.display = "none";

  // Очищаем информацию
  document.getElementById("chordNotes").textContent = "";
}

// Синхронизация полей ввода
function syncChordInputs(event) {
  const value = event.target.value;
  // Синхронизируем со всеми полями
  ["chordInput", "chordInputBlues", "chordInputManouche"].forEach((id) => {
    if (
      document.getElementById(id) &&
      document.getElementById(id) !== event.target
    ) {
      document.getElementById(id).value = value;
    }
  });
}

// Инициализация вкладок
function initTabs() {
  // Обработчики для вкладок
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.dataset.tab;
      setActiveTab(tabId);
    });
  });

  // Синхронизация полей ввода
  ["chordInput", "chordInputBlues", "chordInputManouche"].forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", syncChordInputs);
    }
  });
}

// ============ ИНИЦИАЛИЗАЦИЯ МОДУЛЕЙ ============

function initPentatonic() {
  pentatonicManager = new PentatonicManager();
  window.pentatonicManager = pentatonicManager;

  document
    .getElementById("togglePentatonicBtn")
    .addEventListener("click", function () {
      if (pentatonicManager.isActive) {
        pentatonicManager.hidePentatonic();
        this.classList.remove("active");
      } else {
        pentatonicManager.showPentatonic();
        this.classList.add("active");
      }
    });

  // Обработчики изменений настроек
  document.querySelectorAll('input[name="pentatonicType"]').forEach((radio) => {
    radio.addEventListener("change", function () {
      if (pentatonicManager.isActive) {
        pentatonicManager.showPentatonic();
      }
    });
  });

  document
    .getElementById("showBluesNote")
    .addEventListener("change", function () {
      if (pentatonicManager.isActive) {
        pentatonicManager.showPentatonic();
      }
    });

  // Кнопки боксов
  document.querySelectorAll(".box-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".box-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      if (pentatonicManager.isActive) {
        pentatonicManager.showPentatonic();
      }
    });
  });
}

function initManouche() {
  manoucheScales = new ManoucheScales();
  window.manoucheScales = manoucheScales;

  djangoLicks = new DjangoLicks();
  window.djangoLicks = djangoLicks;

  document
    .getElementById("toggleManoucheBtn")
    .addEventListener("click", function () {
      if (manoucheScales.isActive) {
        manoucheScales.hideManouche();
        this.classList.remove("active");
      } else {
        manoucheScales.showScale();
        this.classList.add("active");
      }
    });

  // Кнопки выбора гаммы
  document.querySelectorAll(".scale-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      document
        .querySelectorAll(".scale-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      const scaleName = this.dataset.scale;
      if (scaleName === "auto") {
        manoucheScales.showScale();
      } else {
        manoucheScales.showScale(scaleName);
      }
    });
  });

  // Кнопки фраз Django
  document.querySelectorAll(".lick-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const lickName = this.dataset.lick;
      
      // Сбрасываем активные состояния других кнопок
      document.querySelectorAll(".lick-btn").forEach((b) => {
        b.classList.remove("active");
      });
      this.classList.add("active");
      
      djangoLicks.showLick(lickName);
    });
  });
}

function initArpeggio() {
  arpeggioManager = new ArpeggioManager();
  window.arpeggioManager = arpeggioManager;

  document
    .getElementById("showArpeggioBtn")
    .addEventListener("click", function () {
      const arpeggioControls = document.querySelector(".arpeggio-controls");
      const isVisible = arpeggioControls.style.display !== "none";

      if (isVisible) {
        arpeggioControls.style.display = "none";
        this.classList.remove("active");
        arpeggioManager.clear();
      } else {
        arpeggioControls.style.display = "block";
        this.classList.add("active");
        arpeggioManager.showArpeggio();
      }
    });

  // Чекбоксы расширений
  ["addSecond", "addSixth", "addSeventh"].forEach((id) => {
    document.getElementById(id).addEventListener("change", function () {
      if (arpeggioManager && arpeggioManager.currentArpeggio) {
        arpeggioManager.showArpeggio();
      }
    });
  });
}

// ============ УПРАВЛЕНИЕ ПОЯСНИТЕЛЬНЫМ ТЕКСТОМ ============

// Проверяем, показывать ли подсказки (только при первом заходе)
function shouldShowHelpText() {
  return localStorage.getItem("hideHelpText") !== "true";
}

// Скрываем пояснительный текст
function hideHelpText() {
  document.querySelectorAll(".tab-help-text").forEach((text) => {
    text.style.display = "none";
  });
  // Запоминаем, что пользователь уже видел подсказки
  localStorage.setItem("hideHelpText", "true");
}

// Показываем пояснительный текст (только если первый раз)
function showHelpText() {
  if (shouldShowHelpText()) {
    const activeTab = document.querySelector(".tab-btn.active").dataset.tab;
    const helpText = document.querySelector(`#${activeTab}Tab .tab-help-text`);
    if (helpText) {
      helpText.style.display = "block";
    }
  }
}

// Кнопка для скрытия подсказок навсегда
function createHideHelpButton() {
  // Добавляем кнопку в каждую вкладку
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    const helpText = pane.querySelector(".tab-help-text");
    if (helpText) {
      const hideButton = document.createElement("button");
      hideButton.textContent = "Скрыть подсказки навсегда";
      hideButton.style.cssText = `
        margin-top: 10px;
        padding: 4px 8px;
        font-size: 11px;
        background: rgba(127, 159, 127, 0.3);
        color: var(--zenburn-fg-dim);
        border: 1px solid var(--zenburn-comment);
        cursor: pointer;
      `;
      hideButton.onclick = function () {
        hideHelpText();
        this.style.display = "none";
      };

      // Проверяем, не скрыты ли уже подсказки
      if (!shouldShowHelpText()) {
        helpText.style.display = "none";
      } else {
        helpText.appendChild(hideButton);
      }
    }
  });
}

// Автоматически скрываем подсказки при любом действии пользователя
function setupAutoHideHelpText() {
  // Все кнопки, которые что-то показывают
  const actionButtons = [
    "#highlightChordBtn",
    "#showArpeggioBtn",
    "#togglePentatonicBtn",
    "#toggleManoucheBtn",
    ".scale-btn",
    ".lick-btn",
    ".box-btn",
  ];

  actionButtons.forEach((selector) => {
    document.querySelectorAll(selector).forEach((button) => {
      button.addEventListener("click", hideHelpText);
    });
  });

  // При вводе текста тоже скрываем
  document.querySelectorAll('input[type="text"]').forEach((input) => {
    input.addEventListener("input", hideHelpText);
  });
}

// ============ ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ============
document.addEventListener("DOMContentLoaded", function () {
  renderFretBoard();
  initTabs();
  initArpeggio();
  initPentatonic();
  initManouche();
  initDjangoFingerings();
  createHideHelpButton();
  setupAutoHideHelpText();
  showHelpText();
  

  // Кнопка показа аккорда
  document
    .getElementById("highlightChordBtn")
    .addEventListener("click", function () {
      // Получаем аккорд из активной вкладки
      const activeTab = document.querySelector(".tab-btn.active").dataset.tab;
      let chord = "";

      switch (activeTab) {
        case "general":
          chord = document.getElementById("chordInput").value.trim();
          break;
        case "blues":
          chord = document.getElementById("chordInputBlues").value.trim();
          break;
        case "manouche":
          chord = document.getElementById("chordInputManouche").value.trim();
          break;
      }

      if (chord) {
        // Скрываем все другие визуализации
        if (arpeggioManager) {
          arpeggioManager.clear();
          document.querySelector(".arpeggio-controls").style.display = "none";
          document.getElementById("showArpeggioBtn").classList.remove("active");
        }

        if (pentatonicManager && pentatonicManager.isActive) {
          pentatonicManager.hidePentatonic();
          document
            .getElementById("togglePentatonicBtn")
            .classList.remove("active");
        }

        if (manoucheScales && manoucheScales.isActive) {
          manoucheScales.hideManouche();
          document
            .getElementById("toggleManoucheBtn")
            .classList.remove("active");
        }

        // Показываем аккорд
        highlightChordNotes(chord);
      } else {
        alert("Введите аккорд в поле ввода");
      }
    });

  // Обработчик Enter для всех полей ввода
  ["chordInput", "chordInputBlues", "chordInputManouche"].forEach((id) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          document.getElementById("highlightChordBtn").click();
        }
      });
    }
  });

  // ============ ИНИЦИАЛИЗАЦИЯ DJANGO FINGERINGS ============
  function initDjangoFingerings() {
    djangoFingerings = new DjangoFingerings();
    window.djangoFingerings = djangoFingerings;
  
    // Обработчики для кнопок аппликатур
    document.querySelectorAll('.fingering-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        // Активная кнопка
        document.querySelectorAll('.fingering-btn').forEach((b) => {
          b.classList.remove('active');
        });
        this.classList.add('active');
  
        // Получаем выбранную аппликатуру
        const fingeringKey = this.dataset.fingering;
        
        // Получаем текущий аккорд
        const chord = manoucheScales.getActiveChord();
        const root = manoucheScales.neck.extractTonic(chord);
        
        // Показываем аппликатуру
        djangoFingerings.showFingering(fingeringKey, root);
      });
    });
  
    // Автоматически предлагать аппликатуру при выборе гаммы
    document.querySelectorAll('.scale-btn').forEach((btn) => {
      btn.addEventListener('click', function () {
        // Через 100ms показываем рекомендованную аппликатуру
        setTimeout(() => {
          const chord = manoucheScales.getActiveChord();
          if (chord) {
            const suggested = djangoFingerings.suggestFingering(chord);
            const btn = document.querySelector(`.fingering-btn[data-fingering="${suggested}"]`);
            if (btn) {
              btn.click();
            }
          }
        }, 100);
      });
    });
  }
  
});
