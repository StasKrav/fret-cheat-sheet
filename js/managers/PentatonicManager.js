// ============ ПЕНТАТОНИКА - ПОЛНАЯ РЕАЛИЗАЦИЯ ============

class PentatonicManager {
  constructor() {
    this.theory = window.musicTheory;
    this.isActive = false;
    this.currentConfig = null;

    // Паттерны боксов для минорной пентатоники (0 лад = открытая струна)
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

    const baseChord = chord.replace(/[0-9#♯b♭]/g, "").replace(/7$/, "");
    return baseChord.includes("m") ? "minor" : "major";
  }

  getPentatonicNotes(root, type) {
    if (!this.theory || !root) return [];

    const rootNote = this.theory.normalizeToSharps(root);
    const rootIndex = this.theory.notes.sharps.indexOf(rootNote);

    if (rootIndex === -1) return [];

    if (type === "minor") {
      // Минорная пентатоника: 1, ♭3, 4, 5, ♭7
      return [
        this.theory.notes.sharps[rootIndex], // 1
        this.theory.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.theory.notes.sharps[(rootIndex + 5) % 12], // 4
        this.theory.notes.sharps[(rootIndex + 7) % 12], // 5
        this.theory.notes.sharps[(rootIndex + 10) % 12], // ♭7
      ];
    } else {
      // Мажорная пентатоника: 1, 2, 3, 5, 6
      return [
        this.theory.notes.sharps[rootIndex], // 1
        this.theory.notes.sharps[(rootIndex + 2) % 12], // 2
        this.theory.notes.sharps[(rootIndex + 4) % 12], // 3
        this.theory.notes.sharps[(rootIndex + 7) % 12], // 5
        this.theory.notes.sharps[(rootIndex + 9) % 12], // 6
      ];
    }
  }

  getBluesNote(root) {
    if (!this.theory || !root) return null;

    const rootNote = this.theory.normalizeToSharps(root);
    const rootIndex = this.theory.notes.sharps.indexOf(rootNote);

    if (rootIndex === -1) return null;

    return this.theory.notes.sharps[(rootIndex + 6) % 12]; // ♭5
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
    if (!chord || !this.theory) return;

    // Очищаем гриф перед отрисовкой
    clearAllHighlights();

    // Определяем настройки
    const root = this.theory.extractTonic(chord); // Используем theory вместо neck

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
    const rootNote = this.theory.normalizeToSharps(root);

    allFrets.forEach((fret) => {
      const note = fret.getAttribute("data-note");
      if (!note) return;

      const normalizedNote = this.theory.normalizeToSharps(note);

      // Проверяем, является ли нота пентатоники
      const isPentatonicNote = pentatonicNotes.some((pentNote) =>
        this.theory.areNotesEqual(pentNote, normalizedNote),
      );

      if (isPentatonicNote) {
        // Если это корневая нота
        const isRoot = this.theory.areNotesEqual(rootNote, normalizedNote);

        if (isRoot) {
          fret.classList.add("pentatonic-root");
          fret.classList.remove("pentatonic-note");
          fret.style.fontWeight = "bold";
        } else {
          fret.classList.add("pentatonic-note");
          fret.classList.remove("pentatonic-root");
          fret.style.fontWeight = "";
        }
      }

      // Проверяем, является ли блюзовой нотой
      if (bluesNote && this.theory.areNotesEqual(bluesNote, normalizedNote)) {
        fret.classList.add("blues-note");
        fret.classList.remove("pentatonic-note", "pentatonic-root");
        fret.style.animation = "blues-note-pulse 2s infinite";
      }
    });
  }

  // НОВЫЙ МЕТОД: Подсветка конкретного бокса
  highlightPentatonicBox(root, boxNum, type, pentatonicNotes, bluesNote) {
    if (!window.guitarNeck) {
      console.error("guitarNeck не загружен!");
      return;
    }

    const rootNote = this.theory.normalizeToSharps(root);
    const rootIndex = this.theory.notes.sharps.indexOf(rootNote);

    if (rootIndex === -1) {
      console.error(`Не найдена тоника ${root} в массиве нот`);
      return;
    }

    // Получаем паттерн бокса
    const boxPattern = this.boxPatterns.minor[boxNum];
    if (!boxPattern) {
      console.error(`Паттерн для бокса ${boxNum} не найден`);
      return;
    }

    // Определяем позицию первого бокса для данной тоники
    let rootPositionOnString6 = null;
    for (let fret = 0; fret <= 12; fret++) {
      const note = window.guitarNeck.getBaseNote(5, fret);
      const normalizedNote = this.theory.normalizeToSharps(note);
      if (this.theory.areNotesEqual(rootNote, normalizedNote)) {
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
      if (fretNumber < 0 || fretNumber > 19) return;

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

      const normalizedNote = this.theory.normalizeToSharps(note);

      // Очищаем предыдущие классы пентатоники
      fretElement.classList.remove(
        "pentatonic-note",
        "pentatonic-root",
        "blues-note",
      );
      fretElement.style.fontWeight = "";
      fretElement.style.animation = "";

      // Проверяем и подсвечиваем
      const isPentatonicNote = pentatonicNotes.some((pentNote) =>
        this.theory.areNotesEqual(pentNote, normalizedNote),
      );

      // ВАЖНОЕ ИЗМЕНЕНИЕ: Добавляем проверку на блюзовую ноту
      const showBlues =
        document.getElementById("showBluesNote")?.checked || false;
      const isBluesNote =
        showBlues &&
        bluesNote &&
        this.theory.areNotesEqual(bluesNote, normalizedNote);

      if (isBluesNote) {
        // Блюзовая нота - подсвечиваем синим
        fretElement.classList.add("blues-note");
        fretElement.style.animation = "blues-note-pulse 2s infinite";
      } else if (isPentatonicNote) {
        const isRoot = this.theory.areNotesEqual(rootNote, normalizedNote);

        if (isRoot) {
          // Корневая нота - красный
          fretElement.classList.add("pentatonic-root");
        } else {
          // Обычные ноты пентатоники - зеленый
          fretElement.classList.add("pentatonic-note");
        }
      }
    });

    // ВАЖНОЕ ДОПОЛНЕНИЕ: Ищем и добавляем блюзовые ноты в пределах бокса
    if (bluesNote) {
      this.addBluesNotesToBox(root, boxNum, shift, bluesNote);
    }
  }

  // ДОБАВЛЯЕМ НОВЫЙ МЕТОД:
  addBluesNotesToBox(root, boxNum, shift, bluesNote) {
    if (!window.guitarNeck) return;

    const showBlues =
      document.getElementById("showBluesNote")?.checked || false;
    if (!showBlues) return;

    // Определяем диапазон ладов для бокса
    let minFret, maxFret;
    switch (boxNum) {
      case 1:
        minFret = 0;
        maxFret = 4;
        break;
      case 2:
        minFret = 3;
        maxFret = 7;
        break;
      case 3:
        minFret = 5;
        maxFret = 9;
        break;
      case 4:
        minFret = 7;
        maxFret = 11;
        break;
      case 5:
        minFret = 10;
        maxFret = 14;
        break;
      default:
        return;
    }

    // Ищем блюзовую ноту во всех струнах в пределах бокса
    for (let string = 0; string < 6; string++) {
      for (let fret = minFret + shift; fret <= maxFret + shift; fret++) {
        if (fret < 0 || fret > 19) continue;

        const fretElement = document.querySelector(
          `.fret[data-string="${string}"][data-fret="${fret}"]`,
        );

        if (!fretElement) continue;

        const note = fretElement.getAttribute("data-note");
        if (!note) continue;

        const normalizedNote = this.theory.normalizeToSharps(note);

        if (this.theory.areNotesEqual(bluesNote, normalizedNote)) {
          // Нашли блюзовую ноту - подсвечиваем
          fretElement.classList.remove("pentatonic-note", "pentatonic-root");
          fretElement.classList.add("blues-note");
          fretElement.style.animation = "blues-note-pulse 2s infinite";
        }
      }
    }
  }

  hidePentatonic() {
    // Сбрасываем состояние
    const pentatonicControls = document.querySelector(".pentatonic-controls");
    if (pentatonicControls) {
      pentatonicControls.style.display = "none";
    }

    document.getElementById("togglePentatonicBtn")?.classList.remove("active");

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

    const typeName = type === "minor" ? "Минорная" : "Мажорная";
    const boxText = box === "all" ? "Все позиции" : `Бокс ${box}`;

    let info = `<div><strong>${typeName} пентатоника от ${root}</strong> | ${boxText}</div>`;
    info += `<div>Ноты: ${pentatonicNotes.join(", ")}</div>`;

    if (bluesNote) {
      info += `<div style="color: var(--zenburn-blue);">+ блюзовая нота: ${bluesNote} (♭5)</div>`;
    }

    infoDiv.innerHTML = info;
    infoDiv.style.display = "block";
  }
}
