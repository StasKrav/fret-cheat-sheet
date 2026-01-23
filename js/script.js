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
    this.frets = 19;
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

    // Приводим к нижнему регистру
    const chordLower = chord.toLowerCase();

    // 1. dim7 - ПЕРВЫМ!
    if (chordLower.includes("dim7")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.notes.sharps[(rootIndex + 6) % 12], // ♭5
        this.notes.sharps[(rootIndex + 9) % 12], // 6 (♭♭7)
      ];
    }

    // 1. m7 (проверяем ДО '7')
    if (chord.includes("m7")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.notes.sharps[(rootIndex + 7) % 12], // 5
        this.notes.sharps[(rootIndex + 10) % 12], // ♭7
      ];
    }

    // 2. maj7 (проверяем ДО '7')
    else if (chord.includes("maj7")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 4) % 12], // 3
        this.notes.sharps[(rootIndex + 7) % 12], // 5
        this.notes.sharps[(rootIndex + 11) % 12], // 7
      ];
    }

    // 3. m9 (проверяем ДО '9')
    else if (chord.includes("m9")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.notes.sharps[(rootIndex + 7) % 12], // 5
        this.notes.sharps[(rootIndex + 10) % 12], // ♭7
        this.notes.sharps[(rootIndex + 14) % 12], // 9
      ];
    }

    // 4. m6 (проверяем ДО '6')
    else if (
      chord.includes("m6") ||
      (chord.includes("m") && chord.includes("6"))
    ) {
      return [
        root,
        this.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.notes.sharps[(rootIndex + 7) % 12], // 5
        this.notes.sharps[(rootIndex + 9) % 12], // 6
      ];
    }

    // 5. maj9 (проверяем ДО '9')
    else if (chord.includes("maj9")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 4) % 12], // 3
        this.notes.sharps[(rootIndex + 7) % 12], // 5
        this.notes.sharps[(rootIndex + 11) % 12], // 7
        this.notes.sharps[(rootIndex + 14) % 12], // 9
      ];
    }

    // 7. 9
    else if (chord.includes("9")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 4) % 12], // 3
        this.notes.sharps[(rootIndex + 7) % 12], // 5
        this.notes.sharps[(rootIndex + 10) % 12], // ♭7
        this.notes.sharps[(rootIndex + 14) % 12], // 9
      ];
    }

    // 8. 7
    else if (chord.includes("7")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 4) % 12], // 3
        this.notes.sharps[(rootIndex + 7) % 12], // 5
        this.notes.sharps[(rootIndex + 10) % 12], // ♭7
      ];
    }

    // 9. 6
    else if (chord.includes("6")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 4) % 12], // 3
        this.notes.sharps[(rootIndex + 7) % 12], // 5
        this.notes.sharps[(rootIndex + 9) % 12], // 6
      ];
    }

    // 10. m (минор)
    else if (chord.includes("m")) {
      return [
        root,
        this.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.notes.sharps[(rootIndex + 7) % 12], // 5
      ];
    }

    // 11. По умолчанию - мажор
    else {
      return [
        root,
        this.notes.sharps[(rootIndex + 4) % 12], // 3
        this.notes.sharps[(rootIndex + 7) % 12], // 5
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
          [5, 0],
          [5, 12], // 6 струна, лад 0 - 1
          [5, 3],
          [5, 15], // 6 струна, лад 3 - 4
          [4, 0],
          [4, 12], // 5 струна, лад 0 - 1
          [4, 2],
          [4, 14], // 5 струна, лад 2 - ♭3
          [3, 0],
          [3, 12], // 4 струна, лад 0 - 1
          [3, 2],
          [3, 14], // 4 струна, лад 2 - ♭3
          [2, 0],
          [2, 12], // 3 струна, лад 0 - 1
          [2, 2],
          [2, 14], // 3 струна, лад 2 - ♭3
          [1, 0],
          [1, 12], // 2 струна, лад 0 - 1
          [1, 3],
          [1, 15], // 2 струна, лад 3 - 4
          [0, 0],
          [0, 12], // 1 струна, лад 0 - 1
          [0, 3],
          [0, 15], // 1 струна, лад 3 - 4
        ],
        2: [
          // Бокс 2: следующий за боксом 1
          [5, 3],
          [5, 15],
          [5, -9], // 6 струна, лад 3 - 4
          [5, 5],
          [5, 17],
          [5, -7], // 6 струна, лад 5 - 5
          [4, 2],
          [4, 14],
          [4, -10], // 5 струна, лад 2 - ♭3
          [4, 5],
          [4, 17],
          [4, -7], // 5 струна, лад 5 - ♭7
          [3, 2],
          [3, 14], // 4 струна, лад 2 - ♭3
          [3, 5],
          [3, 17],
          [3, -7], // 4 струна, лад 5 - ♭7
          [2, 2],
          [2, 14], // 3 струна, лад 2 - ♭3
          [2, 4],
          [2, 16],
          [2, -8], // 3 струна, лад 5 - ♭7
          [1, 3],
          [1, 15],
          [1, -9], // 2 струна, лад 3 - 4
          [1, 5],
          [1, 17],
          [1, -7], // 2 струна, лад 5 - 5
          [0, 3],
          [0, 15],
          [0, -9], // 1 струна, лад 3 - 4
          [0, 5],
          [0, 17],
          [0, -7], // 1 струна, лад 5 - 5
        ],
        3: [
          // Бокс 3
          [5, 5],
          [5, 17],
          [5, -7], // 6 струна, лад 5 - 5
          [5, 7],
          [5, 19],
          [5, -5], // 6 струна, лад 7 - ♭7
          [4, 5],
          [4, 17],
          [4, -7], // 5 струна, лад 5 - ♭7
          [4, 7],
          [4, 19],
          [4, -5], // 5 струна, лад 7 - 1 (октава выше)
          [3, 5],
          [3, 17],
          [3, -7], // 4 струна, лад 5 - ♭7
          [3, 7],
          [3, 19],
          [3, -5], // 4 струна, лад 7 - 1
          [2, 4],
          [2, 16],
          [2, -8], // 3 струна, лад 5 - ♭7
          [2, 7],
          [2, 19],
          [2, -5], // 3 струна, лад 7 - 1
          [1, 5],
          [1, 17],
          [1, -7], // 2 струна, лад 5 - 5
          [1, 8],
          [1, -4], // 2 струна, лад 7 - ♭7
          [0, 5],
          [0, 17],
          [0, -7], // 1 струна, лад 5 - 5
          [0, 7],
          [0, 19],
          [0, -5], // 1 струна, лад 7 - ♭7
        ],
        4: [
          // Бокс 4
          [5, 7],
          [5, 19],
          [5, -5], // 6 струна, лад 7 - ♭7
          [5, 10],
          [5, -2], // 6 струна, лад 8 - 1 (октава выше)
          [4, 7],
          [4, 19],
          [4, -5], // 5 струна, лад 7 - 1
          [4, 10],
          [4, -2], // 5 струна, лад 9 - ♭3
          [3, 7],
          [3, 19],
          [3, -5], // 4 струна, лад 7 - 1
          [3, 9],
          [3, -3], // 4 струна, лад 9 - ♭3
          [2, 7],
          [2, 19],
          [2, -5], // 3 струна, лад 7 - 1
          [2, 9],
          [2, -3], // 3 струна, лад 9 - ♭3
          [1, 8],
          [1, -4], // 2 струна, лад 7 - ♭7
          [1, 10],
          [1, -2], // 2 струна, лад 8 - 1
          [0, 7],
          [0, 19],
          [0, -5], // 1 струна, лад 7 - ♭7
          [0, 10],
          [0, -2], // 1 струна, лад 8 - 1
        ],
        5: [
          // Бокс 5
          [5, 10],
          [5, -2], // 6 струна, лад 8 - 1
          [5, 12],
          [5, 0], // 6 струна, лад 10 - ♭3
          [4, 10],
          [4, -2], // 5 струна, лад 9 - ♭3
          [4, 12],
          [4, 0], // 5 струна, лад 10 - 4
          [3, 9],
          [3, -3], // 4 струна, лад 9 - ♭3
          [3, 12],
          [3, 0], // 4 струна, лад 10 - 4
          [2, 9],
          [2, -3], // 3 струна, лад 9 - ♭3
          [2, 12],
          [2, 0], // 3 струна, лад 10 - 4
          [1, 10],
          [1, -2], // 2 струна, лад 8 - 1
          [1, 12],
          [1, 0], // 2 струна, лад 10 - ♭3
          [0, 10],
          [0, -2], // 1 струна, лад 8 - 1
          [0, 12],
          [0, 0], // 1 струна, лад 10 - ♭3
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
    if (!chord) return;

    if (this.isActive) {
      this.hidePentatonic();
    } else {
      this.showPentatonic();
    }
  }

  showPentatonic() {
    const chord = this.getActiveChord();
    if (!chord) return;

    // Очищаем гриф перед отрисовкой
    clearAllHighlights();

    // Определяем настройки
    const root = this.neck.extractTonic(chord);

    // Получаем выбранный тип пентатоники (фиксируем как minor для блюза)
    const selectedType = "minor";

    // Получаем опции
    const showBlues =
      document.getElementById("showBluesNote")?.checked || false;
    const activeBoxBtn = document.querySelector(".box-btn.active");
    const box = activeBoxBtn ? activeBoxBtn.dataset.box : "all";

    // Получаем ноты
    const pentatonicNotes = this.getPentatonicNotes(root, selectedType);
    const bluesNote =
      showBlues && selectedType === "minor" ? this.getBluesNote(root) : null;

    // Подсвечиваем ноты на грифе
    if (box === "all") {
      this.highlightAllPentatonicNotes(root, pentatonicNotes, bluesNote);
    } else {
      const boxNum = parseInt(box);
      this.highlightPentatonicBox(
        root,
        boxNum,
        "minor",
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
    return document.getElementById("chordInputBlues")?.value.trim() || "";
  }

  // НОВЫЙ МЕТОД: Полная очистка грифа

  clearFretboardHighlights() {
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
      if (fretNumber > 19) return;

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
    // НЕ очищаем здесь гриф!
    // Вместо этого сбрасываем состояние

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
    // Всегда создаем/получаем элемент
    let infoDiv = document.getElementById("pentatonicInfo");

    if (!infoDiv) {
      infoDiv = document.createElement("div");
      infoDiv.id = "pentatonicInfo";
      infoDiv.className = "info-box pentatonic-info";
      infoDiv.style.cssText = "display: block; margin-top: 15px;";

      // Добавляем в blues-tab
      const bluesTab =
        document.getElementById("blues-tab") ||
        document.querySelector('.tab-content[data-tab="blues"]');
      if (bluesTab) bluesTab.appendChild(infoDiv);
    }

    // Используем i18n для перевода
    const typeName =
      type === "minor"
        ? i18n.t("scale.harmonicMinor", "Minor")
        : i18n.t("scale.gypsyMajor", "Major");

    const boxText =
      box === "all"
        ? i18n.t("blues.boxAll", "All positions")
        : `${i18n.t("blues.box", "Box")} ${box}`;

    let info = `<div><strong>${typeName} pentatonic from ${root}</strong> | ${boxText}</div>`;
    info += `<div>${i18n.t("general.notes", "Notes")}: ${pentatonicNotes.join(", ")}</div>`;

    if (bluesNote) {
      info += `<div style="color: var(--zenburn-blue);">+ ${i18n.t("blues.bluesNote", "Blue note")}: ${bluesNote} (♭5)</div>`;
    }

    infoDiv.innerHTML = info;
    infoDiv.style.display = "block";
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

      // 3. ГАРМОНИЧЕСКИЙ МИНОР (добавьте!)
      harmonicMinor: [0, 2, 3, 5, 7, 8, 11], // 1-2-♭3-4-5-♭6-7

      // 4. МИНОРНАЯ ГАРМОНИЧЕСКАЯ С ♮6 (Django style)
      harmonicMinorNat6: [0, 2, 3, 5, 7, 9, 11], // 1-2-♭3-4-5-6-7

      // 5. ДОРИЙСКИЙ С ♯4
      dorianSharp4: [0, 2, 3, 6, 7, 9, 10], // 1-2-♭3-♯4-5-6-♭7

      // 6. DIMINISHED АРПЕДЖИО (симметричное)
      diminished: [0, 3, 6, 9], // 1-♭3-♭5-6 (♭♭7)

      // 7. ДВОЙНАЯ ХРОМАТИКА (характерные подходы)
      doubleChromatic: [0, 1, 2, 3, 4, 5], // Полутоновые пары

      // 8. МИКСОЛИДИЙСКИЙ ♭6 (для доминант)
      mixolydianFlat6: [0, 2, 4, 5, 7, 8, 10], // 1-2-3-4-5-♭6-♭7

      // 9. АЛЬТЕРИРОВАННАЯ (для V7alt)
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
    return document.getElementById("chordInputManouche")?.value.trim() || "";
  }

  // Показываем гамму на грифе
  showScale(scaleName = null) {
    const chord = this.getActiveChord();
    if (!chord) return;

    // Определяем гамму, если не указана
    if (!scaleName) {
      scaleName = this.detectScaleForChord(chord);
    }

    const root = this.neck.extractTonic(chord);
    const scaleNotes = this.getScaleNotes(root, scaleName);

    if (!scaleNotes.length) {
      console.error(i18n.t("error.scaleNotes", "Failed to get scale notes"));
      return;
    }

    // НЕ очищаем здесь! Очистка делается в обработчиках кнопок

    // Показываем панель управления
    document.getElementById("manoucheControls").style.display = "block";
    document.getElementById("showManoucheBtn").classList.add("active");

    // Подсвечиваем ноты гаммы
    this.highlightScaleNotes(root, scaleNotes, scaleName);

    // Обновляем информацию
    this.updateScaleInfo(root, scaleName, scaleNotes);

    // Сохраняем текущую конфигурацию
    this.currentScale = { root, scaleName, notes: scaleNotes };
    this.isActive = true;
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
          fret.style.color = "white";
          fret.style.fontWeight = "bold";
          fret.style.fontSize = "16px";
          fret.style.boxShadow = "0 0 8px rgba(204, 147, 147, 0.7)";
        }
        // Характерные ноты (♭3, ♭6, ♯4)
        else if (characteristicNotes.includes(normalizedNote)) {
          fret.classList.add("manouche-characteristic");
          fret.style.backgroundColor = this.noteColors.characteristic;
          fret.style.color = "white";
          fret.style.fontWeight = "bold";
        }
        // Остальные ноты гаммы
        else {
          fret.style.backgroundColor = this.noteColors.resolution;
          fret.style.color = "var(--zenburn-bg)";
          fret.style.fontWeight = "normal";
        }
      }
    });
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
    const infoDiv = document.getElementById("manoucheScaleInfo");
    if (!infoDiv) return;

    const scaleDisplayName = i18n.t(`scale.${scaleName}`, scaleName);
    const formula = this.getScaleFormula(scaleName);
    const characteristic = this.getCharacteristicDescription(scaleName);

    let info = `
      <div class="manouche-scale-header">
        <strong>${scaleDisplayName} from ${root}</strong>
        <span class="scale-formula">${formula}</span>
      </div>
      <div class="scale-notes">Notes: <strong>${scaleNotes.join(", ")}</strong></div>
      <div class="scale-characteristic">${characteristic}</div>
    `;

    infoDiv.innerHTML = info;
    infoDiv.style.display = "block";
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
  // В ManoucheScales
  highlightScaleNotes(root, scaleNotes, scaleName) {
    // НЕ очищаем здесь! Очистка делается в обработчиках
    const allFrets = document.querySelectorAll(".fret");
    const rootNote = this.neck.normalizeToSharps(root);

    // Определяем характерные ноты
    const characteristicNotes = this.getCharacteristicNotes(root, scaleName);

    allFrets.forEach((fret) => {
      const note = fret.getAttribute("data-note");
      if (!note) return;

      const normalizedNote = this.neck.normalizeToSharps(note);

      if (scaleNotes.includes(normalizedNote)) {
        fret.classList.add("manouche-note");

        if (normalizedNote === rootNote) {
          fret.classList.add("manouche-root");
          fret.style.backgroundColor = this.noteColors.root;
          fret.style.fontWeight = "bold";
        } else if (characteristicNotes.includes(normalizedNote)) {
          fret.classList.add("manouche-characteristic");
          fret.style.backgroundColor = this.noteColors.characteristic;
        } else {
          fret.style.backgroundColor = this.noteColors.resolution;
        }
      }
    });
  }

  // Переключение видимости
  toggleManouche() {
    const chord = this.getActiveChord();
    if (!chord) return;

    if (this.isActive) {
      this.hideManouche();
    } else {
      this.showScale();
    }
  }

  // Скрыть панель
  hideManouche() {
    // НЕ очищаем здесь! Очистка делается в централизованной функции
    // this.clearAllHighlights(); // <-- УДАЛИТЕ или ЗАКОММЕНТИРУЙТЕ

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

    document.getElementById("showManoucheBtn").classList.remove("active");
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
      return;
    }

    const tonic = this.neck.extractTonic(chord);
    const chords = this.neck.getJazzManoucheChords(tonic);

    const sequenceDiv = document.getElementById("chordSequence");
    if (!sequenceDiv) return;

    if (!chords || chords.length === 0) {
      sequenceDiv.innerHTML =
        "<em>" + i18n.t("general.chord", "No chords found") + "</em>";
      sequenceDiv.style.display = "block";
      return;
    }

    let chordsHTML = chords
      .map(
        (chord) =>
          `<span class="chord-link" data-chord="${chord}">${chord}</span>`,
      )
      .join(", ");

    // Используем i18n для перевода
    sequenceDiv.innerHTML = `
    <strong>${i18n.t("manouche.jazzManouche", "Characteristic Jazz Manouche chords")} from ${tonic}:</strong><br>
    ${chordsHTML}
    <br><br>
    <em>${i18n.t("general.chord", "Click any chord to view on fretboard")}</em>
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
  // В DjangoLicks
  showLick(lickName, position = 0) {
    const lick = this.licks[lickName];
    if (!lick) return;

    // Очищаем гриф
    clearAllHighlights();

    lick.pattern.forEach(([string, fret], index) => {
      const actualFret = fret + position;

      // Проверяем границы грифа (у вас 19 ладов)
      if (actualFret < 0 || actualFret > 19) return;

      const fretElement = document.querySelector(
        `.fret[data-string="${string}"][data-fret="${actualFret}"]`,
      );

      if (fretElement) {
        // Очищаем предыдущие классы
        fretElement.classList.remove(
          "django-lick-note",
          "lick-note-0",
          "lick-note-1",
          "lick-note-2",
          "lick-note-3",
          "highlight",
          "manouche-note",
        );

        // Добавляем класс фразы
        fretElement.classList.add("django-lick-note");
        fretElement.classList.add(`lick-note-${index % 4}`);

        // Добавляем номер ноты в последовательности
        const orderSpan = document.createElement("span");
        orderSpan.className = "lick-order";
        orderSpan.textContent = (index + 1).toString();

        // Удаляем старый номер, если есть
        const oldOrderSpan = fretElement.querySelector(".lick-order");
        if (oldOrderSpan) oldOrderSpan.remove();

        fretElement.appendChild(orderSpan);

        // Устанавливаем цвет в зависимости от позиции
        const colors = [
          "var(--zenburn-red)",
          "var(--zenburn-green)",
          "var(--zenburn-blue)",
          "var(--zenburn-yellow)",
        ];
        fretElement.style.backgroundColor = colors[index % 4];
        fretElement.style.color = "white";
        fretElement.style.fontWeight = "bold";
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

    // Используем i18n для перевода
    container.innerHTML = `
      <div class="django-lick-info">
        <div class="lick-header">
          <strong>🎸 ${lick.name}</strong>
          <span class="lick-tempo">${lick.tempo}</span>
        </div>
        <div class="lick-description">${lick.description}</div>
        <div class="lick-notes">${i18n.t("general.notes", "Notes")}: <strong>${lick.notes.join(" - ")}</strong></div>
        <div class="lick-usage">${i18n.t("manouche.licks", "Usage")}: ${lick.usage}</div>
        <div class="lick-tip">💡 <em>Practice slowly, then increase tempo</em></div>
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
    // В классе DjangoFingerings (в конструкторе) ЗАМЕНИТЕ fingerings:
    this.fingerings = {
      // 1. АМ6 (Minor Swing) - самая известная
      Am6: {
        name: "Am6 (Minor Swing)",
        description: 'Классический аккорд из "Minor Swing"',
        chord: "Am6",
        fingers: [
          // [string, fret, finger, note]
          [5, 5, "A"], // Открытая A - большой палец
          [4, 0, "C", true], // 1 лад - C (3 ступень)
          [3, 4, "D"], // 2 лад - D (4 ступень)
          [2, 5, "F#"], // 2 лад - F# (6 ступень - характерно!)
          [1, 5, "A"], // Открытая A
          [0, 0, "A", true], // Открытая A
        ],
        tip: "F# (6 ступень) - фирменный звук мануш! Django играл этот аккорд постоянно.",
      },

      // 2. Д7#9 (характерный доминант)
      D7sharp9: {
        name: "D7#9 (блюзовый доминант)",
        description: "Доминанта с повышенной ноной - любимый звук Django",
        chord: "D7#9",
        fingers: [
          [5, 0, "A", true], // Открытая A (5 ступень)
          [4, 5, "D"], // Открытая D (1)
          [3, 4, "F#"], // 1 лад - F (♭3 или #9)
          [2, 5, "B"], // 2 лад - A (5)
          [1, 6, "F"], // 1 лад - C# (3)
          [0, 0, "E", true], // 2 лад - E (♭7)
        ],
        tip: '#9 создаёт "блюзовое" напряжение - как между мажором и минором',
      },

      // 3. G6 (цыганский мажор)
      G6: {
        name: "G6 (цыганский мажор)",
        description: "Мажорный секстаккорд - основа мануш",
        chord: "G6",
        fingers: [
          [5, 3, "G"], // 3 лад - G
          [4, 0, "F#", true], // 2 лад - F# (7)
          [3, 2, "E"], // Открытая D (5)
          [2, 4, "B"], // Открытая B (3)
          [1, 3, "D"], // Открытая G (1)
          [0, 0, "B", true], // 3 лад - B (3 октавой выше)
        ],
        tip: "Большой палец редко используется выше 5 лада - это нижние позиции",
      },

      // 4. E7 (проходящий доминант)
      E7: {
        name: "E7 (открытая позиция)",
        description: "Открытый доминантсептаккорд",
        chord: "E7",
        fingers: [
          [5, 0, "E", true], // Открытая E
          [4, 7, "B"], // 2 лад - B (5)
          [3, 6, "G"], // 1 лад - G (♭7)
          [2, 7, "E"], // Открытая E
          [1, 5, "B"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      // 5. DIM7 (уменьшенный проходящий)
      Bdim7: {
        name: "Bdim7 (симметричный)",
        description: "Уменьшенный аккорд для переходов",
        chord: "Bdim7",
        fingers: [
          [5, 0, "B", true], // 7 лад - B
          [4, 0, "G", true], // 6 лад - G (♭5)
          [3, 9, "E♭"], // 5 лад - E♭ (♭♭7)
          [2, 10, "B"], // 4 лад - B (1 октавой выше)
          [1, 9, "G"], // 6 лад - G
          [0, 10, "E♭"], // 5 лад - E♭
        ],
        tip: 'Все пальцы на 1-2 ладах друг от друга - "паучья" аппликатура Django',
      },

      // 6. DМ6 (Minor Swing) - самая известная
      Dm6: {
        name: "Dm6 (Minor Swing)",
        description: 'Классический аккорд из "Minor Swing"',
        chord: "Dm6",
        fingers: [
          // [string, fret, finger, note]
          [5, 10, "D"], // Открытая A - большой палец
          [4, 0, "A", true], // 1 лад - C (3 ступень)
          [3, 9, "B"], // 2 лад - D (4 ступень)
          [2, 10, "F"], // 2 лад - F# (6 ступень - характерно!)
          [1, 10, "A"], // Открытая A
          [0, 0, "E", true], // Открытая A
        ],
        tip: "F# (6 ступень) - фирменный звук мануш! Django играл этот аккорд постоянно.",
      },

      // 7. Am (проходящий доминант)
      Am7: {
        name: "Am7",
        description: "Простой ля-минор септ-аккорд",
        chord: "Am",
        fingers: [
          [5, 5, "A"], // Открытая E
          [4, 0, "A", true], // 2 лад - B (5)
          [3, 5, "G"], // 1 лад - G (♭7)
          [2, 5, "C"], // Открытая E
          [1, 5, "E"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      // 8. В9 (проходящий доминант)
      D9: {
        name: "D9",
        description: "D9",
        chord: "D9",
        fingers: [
          [5, 0, "E", true], // Открытая E
          [4, 5, "D"], // 2 лад - B (5)
          [3, 4, "F#"], // 1 лад - G (♭7)
          [2, 5, "C"], // Открытая E
          [1, 5, "E"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      // 9. C#dim7 (проходящий доминант)
      "C#dim7": {
        name: "C#dim7",
        description: "C#dim7",
        chord: "C#dim7",
        fingers: [
          [5, 0, "E", true], // Открытая E
          [4, 4, "C#"], // 2 лад - B (5)
          [3, 5, "G"], // 1 лад - G (♭7)
          [2, 3, "A#"], // Открытая E
          [1, 5, "E"], // Открытая B
          [0, 3, "G"], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      // 10. Cmaj7 (проходящий доминант)
      Cmaj7: {
        name: "Cmaj7",
        description: "Cmaj7",
        chord: "Cmaj7",
        fingers: [
          [5, 0, "E", true], // Открытая E
          [4, 3, "C"], // 2 лад - B (5)
          [3, 5, "G"], // 1 лад - G (♭7)
          [2, 4, "B"], // Открытая E
          [1, 5, "E"], // Открытая B
          [0, 3, "G"], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      // 11. Cmaj7 (проходящий доминант)
      Cm7: {
        name: "Cm7",
        description: "Cm7",
        chord: "Cm7",
        fingers: [
          [5, 0, "E", true], // Открытая E
          [4, 3, "C"], // 2 лад - B (5)
          [3, 0, "D", true], // 1 лад - G (♭7)
          [2, 3, "A#"], // Открытая E
          [1, 4, "D#"], // Открытая B
          [0, 3, "G"], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      // 12. G♯ dim7
      "G♯dim7": {
        name: "G♯ dim7",
        description: "G♯ dim7",
        chord: "G♯ dim7",
        fingers: [
          [5, 4, "G#"], // Открытая E
          [4, 0, "C", true], // 2 лад - B (5)
          [3, 3, "F"], // 1 лад - G (♭7)
          [2, 4, "B"], // Открытая E
          [1, 3, "D"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },
    };
  }

  // Показать аппликатуру на грифе
  showFingering(fingeringKey) {
    const fingering = this.fingerings[fingeringKey];
    if (!fingering) {
      console.error(`Аппликатура "${fingeringKey}" не найдена`);
      return;
    }

    // Очищаем гриф
    clearAllHighlights();

    fingering.fingers.forEach(([string, fret, note, isMuted = false]) => {
      if (fret < 0 || fret > 19) return;

      const fretElement = document.querySelector(
        `.fret[data-string="${string}"][data-fret="${fret}"]`,
      );

      if (fretElement) {
        // Очищаем элемент
        fretElement.classList.remove(
          "django-fingering-note",
          "muted-string",
          "highlight",
        );

        // Удаляем старые элементы
        const oldFingerSpan = fretElement.querySelector(".finger-number");
        if (oldFingerSpan) oldFingerSpan.remove();

        if (isMuted) {
          // ЗАГЛУШЕННАЯ СТРУНА
          fretElement.classList.add("muted-string");
          fretElement.textContent = "×";
          fretElement.style.color = "var(--zenburn-red)";
          fretElement.style.fontWeight = "bold";
          fretElement.style.fontSize = "18px";
          fretElement.style.opacity = "0.9";
        } else {
          // ОБЫЧНАЯ НОТА
          fretElement.classList.add("django-fingering-note");

          // Для открытой струны (лад 0) показываем кружок
          if (fret === 0) {
            fretElement.textContent = "○";
            fretElement.style.color = "var(--zenburn-green)";
            fretElement.style.fontWeight = "bold";
            fretElement.style.fontSize = "16px";
          }
          // Для нажатых ладов показываем ноту
          else {
            const originalNote = fretElement.getAttribute("data-note");
            fretElement.textContent = originalNote;
            fretElement.style.color = "white";
            fretElement.style.fontWeight = "bold";
            fretElement.style.backgroundColor = "var(--zenburn-orange)";
          }
        }
      }
    });

    this.showFingeringInfo(fingering);
  }

  // Добавьте метод для получения текущего аккорда
  getActiveChord() {
    return document.getElementById("chordInputManouche")?.value.trim() || "";
  }

  // Информация об аппликатуре
  showFingeringInfo(fingering) {
    const diagramDiv = document.getElementById("fingeringDiagram");
    if (!diagramDiv || !fingering) return;

    // Используем i18n для перевода
    let html = `
      <div style="margin-bottom: 8px;">
        <strong style="color: var(--zenburn-yellow);">${fingering.name || i18n.t("manouche.fingerings", "Django Fingering")}</strong>
      </div>
      <div style="font-size: 10px; margin-bottom: 5px; color: var(--zenburn-fg-dim);">
        ${fingering.description || ""}
      </div>
      <div style="margin: 5px 0; padding: 5px; background: rgba(140, 208, 211, 0.1); border-radius: 3px;">
        <strong style="color: var(--zenburn-cyan);">${i18n.t("general.chord", "Chord")}:</strong> ${fingering.chord || "N/A"}
      </div>
    `;

    if (fingering.tip) {
      html += `
        <div style="margin-top: 8px; padding: 8px; background: rgba(223, 175, 143, 0.1); border-radius: 3px;">
          <span style="color: var(--zenburn-orange);">💡 ${i18n.t("manouche.licks", "Django Tip")}:</span> 
          <em style="font-size: 10px;">${fingering.tip}</em>
        </div>
      `;
    }

    diagramDiv.innerHTML = html;
    diagramDiv.style.display = "block";
  }

  clearFingeringHighlight() {
    document.querySelectorAll(".fret").forEach((fret) => {
      fret.classList.remove(
        "django-fingering-note",
        "fingering-root",
        "muted-string",
      );

      // Удаляем цифры пальцев (если остались)
      const fingerSpan = fret.querySelector(".finger-number");
      if (fingerSpan) fingerSpan.remove();

      // Сбрасываем стили
      fret.style.backgroundColor = "";
      fret.style.fontWeight = "";
      fret.style.color = "";
      fret.style.fontSize = "";
      fret.style.opacity = "";
    });
  }

  // Автоматически выбрать аппликатуру по аккорду
  suggestFingering(chord) {
    const chordUpper = chord.toUpperCase();

    if (chord.includes("dim")) return "position5";
    if (chord.includes("m6")) return "djangoFav";
    if (chord.includes("7#9") || chord.includes("7b9")) return "position7";
    if (chord.includes("m")) return "open";
    if (chord.includes("6")) return "position3";

    return "open"; // по умолчанию
  }

  // В классе DjangoFingerings добавьте:
  clearAllFingerings() {
    this.clearFingeringHighlight();

    // Сбрасываем все кнопки
    document.querySelectorAll(".fingering-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Очищаем диаграмму
    const diagramDiv = document.getElementById("fingeringDiagram");
    if (diagramDiv) {
      diagramDiv.innerHTML = "";
    }
  }
}

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
    if (!chord) return;

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

    // Используем i18n для перевода
    const typeName =
      type === "minor"
        ? i18n.t("scale.harmonicMinor", "Minor") + " arpeggio"
        : i18n.t("scale.gypsyMajor", "Major") + " arpeggio";

    const typeClass =
      type === "minor" ? "arpeggio-type-minor" : "arpeggio-type-major";
    const typeText = type === "minor" ? "min" : "";

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
        ${typeName} from ${root}
        <span class="arpeggio-type-badge ${typeClass}">${typeText}</span>
      </strong>
      <div style="margin: 5px 0;">${i18n.t("general.notes", "Notes")}: <strong>${notes.join(", ")}</strong></div>
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

// -------- конец классов ---------

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

  let html = "";

  for (let string = 0; string < 6; string++) {
    html += `<div class="string"><div class="string-name">${stringNames[string]}</div>`;
    for (let fret = 0; fret <= 19; fret++) {
      // <-- ИЗМЕНИТЬ 12 на 19
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
  const allFrets = document.querySelectorAll(".fret");
  allFrets.forEach((fret) => {
    // Удаляем все классы, кроме 'fret' и 'nut'
    const classesToRemove = Array.from(fret.classList).filter(
      (cls) => !["fret", "nut"].includes(cls),
    );
    fret.classList.remove(...classesToRemove);

    // Сбрасываем все стили
    fret.style.cssText = "";

    // Удаляем динамические элементы
    const dynamicElements = fret.querySelectorAll(
      ".lick-order, .finger-number, .note-name, .note-degree",
    );
    dynamicElements.forEach((el) => el.remove());

    // Восстанавливаем оригинальный текст
    const originalNote = fret.getAttribute("data-note");
    const isNut = fret.getAttribute("data-fret") === "0";
    if (fret.textContent !== (isNut ? "○" : originalNote)) {
      fret.textContent = isNut ? "○" : originalNote;
    }
  });
}

function highlightChordNotes(chord) {
  if (!chord || chord.trim() === "") {
    return;
  }

  console.log("Показываем аккорд:", chord);

  // Полная очистка перед показом аккорда
  clearAllHighlights();

  const neck = new GuitarNeck();
  const chordNotes = neck.getChordNotes(chord);

  if (!chordNotes || chordNotes.length === 0) {
    console.error(i18n.t("error.scaleNotes", "Failed to get scale notes"));

    return;
  }

  console.log("Ноты аккорда:", chordNotes);

  const rootNote = neck.extractTonic(chord);
  console.log("Корневая нота:", rootNote);

  // Подсветка нот на грифе
  let highlighted = 0;
  document.querySelectorAll(".fret").forEach((fret) => {
    const note = fret.getAttribute("data-note");
    if (!note) return;

    const normalizedNote = neck.normalizeToSharps(note);

    if (chordNotes.includes(normalizedNote)) {
      highlighted++;
      fret.classList.add("highlight");

      // Определяем, является ли нота корневой
      if (normalizedNote === rootNote) {
        fret.classList.add("root");
        fret.style.backgroundColor = "var(--zenburn-red)";
        fret.style.color = "white";
        fret.style.fontWeight = "bold";
      } else {
        fret.classList.add("chord-tone");
        fret.style.backgroundColor = "var(--zenburn-green)";
        fret.style.color = "var(--zenburn-bg)";
      }
    }
  });

  console.log("Подсвечено нот:", highlighted);

  // Обновляем информацию об аккорде
  updateChordInfo(chord, chordNotes);
}

// Новая функция для обновления информации
function updateChordInfo(chord, chordNotes) {
  console.log("updateChordInfo called for chord:", chord);

  const chordNameEl = document.getElementById("chordName");
  const chordTypeEl = document.getElementById("chordType");
  const chordNotesEl = document.getElementById("chordNotes");
  const chordFormulaEl = document.getElementById("chordFormula");

  if (!chordNameEl || !chordTypeEl || !chordNotesEl || !chordFormulaEl) {
    console.error("Chord display elements not found");
    return;
  }

  // Устанавливаем название аккорда
  chordNameEl.textContent = chord;

  // Определяем тип аккорда
  let chordType = "";
  let chordFormula = "";

  if (chord.includes("maj7")) {
    chordType = "Maj7";
    chordFormula = "1-3-5-7";
  } else if (chord.includes("m7")) {
    chordType = "m7";
    chordFormula = "1-♭3-5-♭7";
  } else if (chord.includes("7")) {
    chordType = "7";
    chordFormula = "1-3-5-♭7";
    if (chord.includes("m6") || (chord.includes("m") && chord.includes("6"))) {
      chordType = "m6";
      chordFormula = "1-♭3-5-6";
    }
  } else if (chord.includes("6")) {
    chordType = "6";
    chordFormula = "1-3-5-6";
  } else if (chord.includes("dim7")) {
    chordType = "dim7";
    chordFormula = "1-♭3-♭5-6";
  } else if (chord.includes("dim")) {
    chordType = "dim";
    chordFormula = "1-♭3-♭5";
  } else if (chord.includes("aug")) {
    chordType = "aug";
    chordFormula = "1-3-♯5";
  } else if (chord.includes("m")) {
    chordType = "m";
    chordFormula = "1-♭3-5";
  } else {
    chordType = "";
    chordFormula = "1-3-5";
  }

  chordTypeEl.textContent = chordType;
  chordNotesEl.textContent = chordNotes.join(", ");
  chordFormulaEl.textContent = chordFormula;
}

// ============ УПРАВЛЕНИЕ ВКЛАДКАМИ ============

function setActiveTab(tabId) {
  console.log("Переключение на вкладку:", tabId);

  // Полная очистка грифа
  clearAllHighlights();

  // Скрываем все контенты вкладок
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.style.display = "none";
  });

  // Показываем активную вкладку
  const activeTabContent = document.querySelector(
    `.tab-content[data-tab="${tabId}"]`,
  );
  if (activeTabContent) {
    activeTabContent.style.display = "flex";
  }

  // Обновляем кнопки вкладок
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  const activeTabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  if (activeTabBtn) {
    activeTabBtn.classList.add("active");
  }

  // Скрываем все панели управления
  const controlPanels = [".arpeggio-controls", "#manoucheControls"];

  controlPanels.forEach((selector) => {
    const panel = document.querySelector(selector);
    if (panel) {
      panel.style.display = "none";
    }
  });

  // Сбрасываем активные состояния кнопок
  document
    .querySelectorAll(
      ".action-btn.active, .box-btn.active, .scale-type-btn.active, " +
        ".fingering-btn.active, .scale-btn.active, .lick-btn.active",
    )
    .forEach((btn) => btn.classList.remove("active"));

  // Очищаем информационные блоки
  clearAllInfoPanels();

  // Сбрасываем состояние менеджеров
  resetManagers(tabId);
}

// Очистка полей ввода вкладки
function clearTabInput(tabId) {
  const inputIds = {
    general: "chordInput",
    blues: "chordInputBlues",
    manouche: "chordInputManouche",
  };

  const inputId = inputIds[tabId];
  if (inputId && document.getElementById(inputId)) {
    document.getElementById(inputId).value = "";
  }
}

// Очистка информационных панелей
function clearAllInfoPanels() {
  const infoPanels = [
    // Общие
    "chordName",
    "chordType",
    "chordNotes",
    "chordFormula",
    // Блюз
    "bluesChordName",
    "bluesChordType",
    "bluesChordNotes",
    "bluesChordInfo",
    "pentatonicInfo",
    // Мануш
    "manoucheChordName",
    "manoucheChordType",
    "manoucheChordNotes",
    "manoucheChordInfo",
    "manoucheScaleInfo",
    "licksInfoContainer",
    "fingeringDiagram",
    "chordSequence",
  ];

  infoPanels.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.innerHTML = "";
      element.style.display = "none";
    }
  });
}

// Сброс менеджеров (ИСПРАВЛЕННЫЙ)
function resetManagers(tabId) {
  // Сбрасываем пентатонику при выходе из блюза
  if (tabId !== "blues" && window.pentatonicManager) {
    pentatonicManager.isActive = false;
    pentatonicManager.currentConfig = null;
  }

  // Сбрасываем мануш при выходе из мануш
  if (tabId !== "manouche" && window.manoucheScales) {
    manoucheScales.isActive = false;
    manoucheScales.currentScale = null;
  }

  // Сбрасываем арпеджио при выходе из общей вкладки
  if (tabId !== "general" && window.arpeggioManager) {
    arpeggioManager.currentArpeggio = null;
  }
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
}

// ============ ИНИЦИАЛИЗАЦИЯ МОДУЛЕЙ ============

// ============ ИНИЦИАЛИЗАЦИЯ ПЕНТАТОНИКИ ============
function initPentatonic() {
  // Проверяем, существует ли уже менеджер
  if (!pentatonicManager) {
    pentatonicManager = new PentatonicManager();
    window.pentatonicManager = pentatonicManager;
  }

  // Обработчики изменений настроек пентатоники
  const showBluesNoteCheckbox = document.getElementById("showBluesNote");
  if (showBluesNoteCheckbox) {
    showBluesNoteCheckbox.addEventListener("change", function () {
      if (pentatonicManager.isActive) {
        clearAllHighlights();
        pentatonicManager.showPentatonic();
      }
    });
  }

  // Кнопки боксов
  document.querySelectorAll(".box-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Снимаем активность со всех кнопок боксов
      document
        .querySelectorAll(".box-btn")
        .forEach((b) => b.classList.remove("active"));
      // Активируем текущую кнопку
      this.classList.add("active");

      // Если пентатоника активна - обновляем отображение
      if (pentatonicManager.isActive) {
        clearAllHighlights();
        pentatonicManager.showPentatonic();
      }
    });
  });
}

// ============ ИНИЦИАЛИЗАЦИЯ DJANGO FINGERINGS ============
function initDjangoFingerings() {
  djangoFingerings = new DjangoFingerings();
  window.djangoFingerings = djangoFingerings;

  // Обработчики для кнопок аппликатур
  document.querySelectorAll(".fingering-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      // Сбрасываем активность у ВСЕХ кнопок
      document.querySelectorAll(".fingering-btn, .lick-btn").forEach((b) => {
        b.classList.remove("active");
      });

      // Активируем только текущую кнопку
      this.classList.add("active");

      // Получаем выбранную аппликатуру
      const fingeringKey = this.dataset.fingering;

      // Получаем текущий аккорд
      const chord = manoucheScales.getActiveChord();
      const root = manoucheScales.neck.extractTonic(chord || "Am");

      // Показываем аппликатуру
      djangoFingerings.showFingering(fingeringKey, root);
    });
  });
}

function initManouche() {
  manoucheScales = new ManoucheScales();
  window.manoucheScales = manoucheScales;

  djangoLicks = new DjangoLicks();
  window.djangoLicks = djangoLicks;

  djangoFingerings = new DjangoFingerings();
  window.djangoFingerings = djangoFingerings;

  // ОБРАБОТЧИКИ КНОПОК ГАММ
  document.querySelectorAll(".scale-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const chord = manoucheScales.getActiveChord();
      if (!chord) return;

      // Очищаем всё
      clearAllHighlights();
      clearManoucheFretboard();

      // Делаем активной только эту кнопку
      document
        .querySelectorAll(".scale-btn, .lick-btn, .fingering-btn")
        .forEach((b) => {
          b.classList.remove("active");
        });
      this.classList.add("active");

      const scaleName = this.dataset.scale;
      if (scaleName === "auto") {
        manoucheScales.showScale();
      } else {
        manoucheScales.showScale(scaleName);
      }

      // Очищаем информационные панели других типов
      document.getElementById("licksInfoContainer").style.display = "none";
      const fingeringDiagram = document.getElementById("fingeringDiagram");
      if (fingeringDiagram) fingeringDiagram.innerHTML = "";
    });
  });

  // ОБРАБОТЧИКИ КНОПОК ФРАЗ Django
  document.querySelectorAll(".lick-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const chord = manoucheScales.getActiveChord();
      if (!chord) return;

      // Очищаем всё
      clearAllHighlights();
      clearManoucheFretboard();

      // Делаем активной только эту кнопку
      document
        .querySelectorAll(".scale-btn, .lick-btn, .fingering-btn")
        .forEach((b) => {
          b.classList.remove("active");
        });
      this.classList.add("active");

      // Очищаем информационные панели других типов
      const fingeringDiagram = document.getElementById("fingeringDiagram");
      if (fingeringDiagram) fingeringDiagram.innerHTML = "";

      const lickName = this.dataset.lick;
      djangoLicks.showLick(lickName);
    });
  });

  // ОБРАБОТЧИКИ КНОПОК АППЛИКАТУР
  document.querySelectorAll(".fingering-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const chord = manoucheScales.getActiveChord();
      if (!chord) return;

      // Очищаем всё
      clearAllHighlights();
      clearManoucheFretboard();

      // Делаем активной только эту кнопку
      document
        .querySelectorAll(".scale-btn, .lick-btn, .fingering-btn")
        .forEach((b) => {
          b.classList.remove("active");
        });
      this.classList.add("active");

      // Очищаем информационные панели других типов
      document.getElementById("licksInfoContainer").style.display = "none";

      const fingeringKey = this.dataset.fingering;
      djangoFingerings.showFingering(fingeringKey);
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
    "#showManoucheBtn",
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

// ============ ГЛОБАЛЬНЫЕ ФУНКЦИИ ОЧИСТКИ ============
function clearAllHighlights() {
  const allFrets = document.querySelectorAll(".fret");
  allFrets.forEach((fret) => {
    // Удаляем ВСЕ классы подсветки
    fret.classList.remove(
      "highlight",
      "root",
      "chord-tone",
      "scale-tone",

      // Пентатоника
      "pentatonic-note",
      "pentatonic-root",
      "blues-note",

      // Арпеджио
      "arpeggio-root",
      "arpeggio-third",
      "arpeggio-fifth",
      "arpeggio-second",
      "arpeggio-sixth",
      "arpeggio-seventh",

      // Мануш
      "manouche-note",
      "manouche-root",
      "manouche-characteristic",

      // Django
      "django-lick-note",
      "lick-note-0",
      "lick-note-1",
      "lick-note-2",
      "lick-note-3",
      "django-fingering-note",
      "fingering-root",
      "muted-string",
    );

    // Сбрасываем ВСЕ стили
    fret.style.fontWeight = "";
    fret.style.animation = "";
    fret.style.backgroundColor = "";
    fret.style.color = "";
    fret.style.borderColor = "";
    fret.style.fontSize = "";
    fret.style.opacity = "";
    fret.style.transform = "";
    fret.style.boxShadow = "";
    fret.style.borderRadius = "";

    // Удаляем динамические элементы
    const orderSpan = fret.querySelector(".lick-order");
    if (orderSpan) orderSpan.remove();

    const fingerSpan = fret.querySelector(".finger-number");
    if (fingerSpan) fingerSpan.remove();

    const noteNameSpan = fret.querySelector(".note-name");
    if (noteNameSpan) noteNameSpan.remove();

    const degreeSpan = fret.querySelector(".note-degree");
    if (degreeSpan) degreeSpan.remove();

    // Восстанавливаем оригинальный текст
    const originalNote = fret.getAttribute("data-note");
    const isNut = fret.classList.contains("nut");
    if (isNut && fret.textContent !== "○") {
      fret.textContent = "○";
    } else if (originalNote && !isNut && fret.textContent !== originalNote) {
      fret.textContent = originalNote;
    }
  });

  // Удаляем информационные блоки
  const elementsToRemove = [
    ".arpeggio-info",
    ".pentatonic-info",
    ".manouche-info",
    ".licks-info",
    ".fingering-diagram",
  ];

  elementsToRemove.forEach((selector) => {
    const element = document.querySelector(selector);
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
  });
}

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============
function updateBluesChordInfo(chord) {
  const neck = new GuitarNeck();
  const chordNotes = neck.getChordNotes(chord);
  const root = neck.extractTonic(chord);

  document.getElementById("bluesChordName").textContent = chord;
  document.getElementById("bluesChordNotes").textContent =
    chordNotes.join(", ");
}

function updateManoucheChordInfo(chord) {
  const neck = new GuitarNeck();
  const chordNotes = neck.getChordNotes(chord);
  const root = neck.extractTonic(chord);

  // Проверяем, активна ли вкладка manouche
  const manoucheTab = document.getElementById("manouche-tab");
  if (!manoucheTab || manoucheTab.style.display === "none") {
    return; // Если вкладка не активна, не обновляем
  }

  // Теперь безопасно обновляем
  const chordNameEl = document.getElementById("manoucheChordName");
  const chordNotesEl = document.getElementById("manoucheChordNotes");

  if (chordNameEl) {
    chordNameEl.textContent = chord;
  }

  if (chordNotesEl) {
    chordNotesEl.textContent = chordNotes.join(", ");
  }
}

// ============ ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ============
document.addEventListener("DOMContentLoaded", function () {
  // Инициализация перевода
  const savedLang = localStorage.getItem("preferredLanguage") || "en";
  i18n.setLanguage(savedLang);

  // Активируем правильную кнопку языка
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    if (btn.dataset.lang === i18n.getCurrentLanguage()) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Обработчики для переключателя языка
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const lang = this.dataset.lang;
      document
        .querySelectorAll(".lang-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      i18n.setLanguage(lang);

      // Обновляем динамический контент
      if (window.manoucheScales && manoucheScales.currentScale) {
        manoucheScales.updateScaleInfo(
          manoucheScales.currentScale.root,
          manoucheScales.currentScale.scaleName,
          manoucheScales.currentScale.notes,
        );
      }

      if (window.pentatonicManager && pentatonicManager.currentConfig) {
        pentatonicManager.updatePentatonicInfo(
          pentatonicManager.currentConfig.root,
          pentatonicManager.currentConfig.type,
          pentatonicManager.getPentatonicNotes(
            pentatonicManager.currentConfig.root,
            pentatonicManager.currentConfig.type,
          ),
          pentatonicManager.currentConfig.showBlues
            ? pentatonicManager.getBluesNote(
                pentatonicManager.currentConfig.root,
              )
            : null,
          pentatonicManager.currentConfig.box,
        );
      }
    });
  });

  renderFretBoard();

  // Инициализация менеджеров
  pentatonicManager = new PentatonicManager();
  manoucheScales = new ManoucheScales();
  djangoLicks = new DjangoLicks();
  arpeggioManager = new ArpeggioManager();
  djangoFingerings = new DjangoFingerings();

  // Делаем их глобальными
  window.pentatonicManager = pentatonicManager;
  window.manoucheScales = manoucheScales;
  window.djangoLicks = djangoLicks;
  window.arpeggioManager = arpeggioManager;
  window.djangoFingerings = djangoFingerings;

  // Начинаем с общей вкладки
  setActiveTab("general");

  // Обработчики для общей вкладки
  document
    .getElementById("highlightChordBtn")
    ?.addEventListener("click", function () {
      const chord = document.getElementById("chordInput")?.value.trim();
      if (!chord) {
        alert("Введите аккорд");
        return;
      }

      clearAllHighlights();
      highlightChordNotes(chord); // Эта функция должна вызвать updateChordInfo()
    });

  // Enter в общей вкладке
  document
    .getElementById("chordInput")
    ?.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        document.getElementById("highlightChordBtn")?.click();
      }
    });

  // Обработчики для вкладки Блюз
  document
    .getElementById("showPentatonicBtn")
    ?.addEventListener("click", function () {
      const chord = document.getElementById("chordInputBlues")?.value.trim();
      if (!chord) {
        return;
      }

      // Обновляем информацию об аккорде
      updateBluesChordInfo(chord);

      // Показываем пентатонику
      if (pentatonicManager.isActive) {
        pentatonicManager.hidePentatonic();
      } else {
        clearAllHighlights();
        pentatonicManager.showPentatonic();

        // Показываем информационный блок
        const pentatonicInfo = document.getElementById("pentatonicInfo");
        if (pentatonicInfo) {
          pentatonicInfo.style.display = "block";
        }
      }
    });

  // Enter в блюзовой вкладке
  document
    .getElementById("chordInputBlues")
    ?.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        document.getElementById("showPentatonicBtn")?.click();
      }
    });

  // Обработчики для вкладки Мануш
  document
    .getElementById("showManoucheBtn")
    ?.addEventListener("click", function () {
      const chord = document.getElementById("chordInputManouche")?.value.trim();
      if (!chord) {
        return;
      }

      // Обновляем информацию об аккорде
      updateManoucheChordInfo(chord);

      // Показываем панель управления мануш
      const manoucheControls = document.getElementById("manoucheControls");
      if (manoucheControls) {
        manoucheControls.style.display = "block";
      }

      // Показываем гамму по умолчанию
      if (manoucheScales.isActive) {
        manoucheScales.hideManouche();
      } else {
        clearAllHighlights();
        manoucheScales.showScale();
      }
    });

  // Enter в мануш вкладке
  document
    .getElementById("chordInputManouche")
    ?.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        document.getElementById("showManoucheBtn")?.click();
      }
    });

  // Инициализация вкладок
  initTabs();

  // Инициализация кнопок управления
  initManoucheButtons();
  initPentatonicButtons();
});

// Синхронизация полей ввода
function syncChordInputs(event) {
  const value = event.target.value;
  const inputs = ["chordInput", "chordInputBlues", "chordInputManouche"];

  inputs.forEach((id) => {
    const input = document.getElementById(id);
    if (input && input !== event.target) {
      input.value = value;
    }
  });
}

// Инициализация кнопок Мануш
function initManoucheButtons() {
  // Кнопки гамм
  document.querySelectorAll(".scale-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const chord = document.getElementById("chordInputManouche")?.value.trim();
      if (!chord) return;

      clearAllHighlights();

      // Активируем только эту кнопку
      document
        .querySelectorAll(".scale-btn, .lick-btn, .fingering-btn")
        .forEach((b) => {
          b.classList.remove("active");
        });
      this.classList.add("active");

      const scaleName = this.dataset.scale;
      manoucheScales.showScale(scaleName === "auto" ? null : scaleName);
    });
  });

  // Кнопки фраз
  document.querySelectorAll(".lick-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const chord = document.getElementById("chordInputManouche")?.value.trim();
      if (!chord) return;

      clearAllHighlights();

      // Активируем только эту кнопку
      document
        .querySelectorAll(".scale-btn, .lick-btn, .fingering-btn")
        .forEach((b) => {
          b.classList.remove("active");
        });
      this.classList.add("active");

      const lickName = this.dataset.lick;
      djangoLicks.showLick(lickName);
    });
  });

  // Кнопки аппликатур
  document.querySelectorAll(".fingering-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const chord = document.getElementById("chordInputManouche")?.value.trim();
      if (!chord) return;

      clearAllHighlights();

      // Активируем только эту кнопку
      document
        .querySelectorAll(".scale-btn, .lick-btn, .fingering-btn")
        .forEach((b) => {
          b.classList.remove("active");
        });
      this.classList.add("active");

      const fingeringKey = this.dataset.fingering;
      djangoFingerings.showFingering(fingeringKey);
    });
  });
}

// Инициализация кнопок пентатоники
function initPentatonicButtons() {
  // Чекбокс блюзовой ноты
  document
    .getElementById("showBluesNote")
    ?.addEventListener("change", function () {
      if (pentatonicManager.isActive) {
        clearAllHighlights();
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
        clearAllHighlights();
        pentatonicManager.showPentatonic();
      }
    });
  });

  initArpeggio();

  // ============ ИНИЦИАЛИЗАЦИЯ АРПЕДЖИО ============
  function initArpeggio() {
    // Убедимся, что менеджер создан
    if (!arpeggioManager) {
      arpeggioManager = new ArpeggioManager();
      window.arpeggioManager = arpeggioManager;
    }

    // Обработчик кнопки "Арпеджио"
    const arpeggioBtn = document.getElementById("showArpeggioBtn");
    if (arpeggioBtn) {
      arpeggioBtn.addEventListener("click", function () {
        const chord = document.getElementById("chordInput")?.value.trim();
        if (!chord) {
          alert("Введите аккорд сначала!");
          return;
        }

        const arpeggioControls = document.querySelector(".arpeggio-controls");
        const isVisible = arpeggioControls.style.display === "block";

        if (isVisible) {
          // Скрыть арпеджио
          arpeggioControls.style.display = "none";
          this.classList.remove("active");
          arpeggioManager.clear(); // Очищаем арпеджио
          // Восстанавливаем аккорд
          highlightChordNotes(chord);
        } else {
          // Показать арпеджио
          clearAllHighlights();
          arpeggioControls.style.display = "block";
          this.classList.add("active");

          // Показать арпеджио на грифе
          arpeggioManager.showArpeggio();
        }
      });
    }

    // Обработчики чекбоксов
    ["addSecond", "addSixth", "addSeventh"].forEach((id) => {
      const checkbox = document.getElementById(id);
      if (checkbox) {
        checkbox.addEventListener("change", function () {
          if (arpeggioManager && arpeggioManager.currentArpeggio) {
            clearAllHighlights();
            arpeggioManager.showArpeggio();
          }
        });
      }
    });

    // Обработчик изменения аккорда на общей вкладке
    const chordInput = document.getElementById("chordInput");
    if (chordInput) {
      chordInput.addEventListener("input", function () {
        const chord = this.value.trim();
        if (!chord) return;

        // Если арпеджио активно - обновить его
        if (arpeggioManager && arpeggioManager.currentArpeggio) {
          clearAllHighlights();
          arpeggioManager.showArpeggio();
        }
        // Если арпеджио не активно - показать аккорд
        else if (
          document.getElementById("showArpeggioBtn") &&
          !document
            .getElementById("showArpeggioBtn")
            .classList.contains("active")
        ) {
          highlightChordNotes(chord);
        }
      });

      // Enter в общей вкладке
      chordInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          const chord = this.value.trim();
          if (!chord) return;

          // Если арпеджио активно - обновить его
          if (arpeggioManager && arpeggioManager.currentArpeggio) {
            clearAllHighlights();
            arpeggioManager.showArpeggio();
          }
          // Если арпеджио не активно - показать аккорд
          else {
            clearAllHighlights();
            highlightChordNotes(chord);
          }
        }
      });
    }
  }
}
