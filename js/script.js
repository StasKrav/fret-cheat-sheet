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
          [5, 0],  // 6 струна, лад 0 - 1
          [5, 3],  // 6 струна, лад 3 - 4
          [4, 0],  // 5 струна, лад 0 - 1
          [4, 2],  // 5 струна, лад 2 - ♭3
          [3, 0],  // 4 струна, лад 0 - 1
          [3, 2],  // 4 струна, лад 2 - ♭3
          [2, 0],  // 3 струна, лад 0 - 1
          [2, 2],  // 3 струна, лад 2 - ♭3
          [1, 0],  // 2 струна, лад 0 - 1
          [1, 3],  // 2 струна, лад 3 - 4
          [0, 0],  // 1 струна, лад 0 - 1
          [0, 3],  // 1 струна, лад 3 - 4
        ],
        2: [
          // Бокс 2: следующий за боксом 1
          [5, 3],  // 6 струна, лад 3 - 4
          [5, 5],  // 6 струна, лад 5 - 5
          [4, 2],  // 5 струна, лад 2 - ♭3
          [4, 5],  // 5 струна, лад 5 - ♭7
          [3, 2],  // 4 струна, лад 2 - ♭3
          [3, 5],  // 4 струна, лад 5 - ♭7
          [2, 2],  // 3 струна, лад 2 - ♭3
          [2, 4],  // 3 струна, лад 5 - ♭7
          [1, 3],  // 2 струна, лад 3 - 4
          [1, 5],  // 2 струна, лад 5 - 5
          [0, 3],  // 1 струна, лад 3 - 4
          [0, 5],  // 1 струна, лад 5 - 5
        ],
        3: [
          // Бокс 3
          [5, 5],  // 6 струна, лад 5 - 5
          [5, 7],  // 6 струна, лад 7 - ♭7
          [4, 5],  // 5 струна, лад 5 - ♭7
          [4, 7],  // 5 струна, лад 7 - 1 (октава выше)
          [3, 5],  // 4 струна, лад 5 - ♭7
          [3, 7],  // 4 струна, лад 7 - 1
          [2, 4],  // 3 струна, лад 5 - ♭7
          [2, 7],  // 3 струна, лад 7 - 1
          [1, 5],  // 2 струна, лад 5 - 5
          [1, 8],  // 2 струна, лад 7 - ♭7
          [0, 5],  // 1 струна, лад 5 - 5
          [0, 7],  // 1 струна, лад 7 - ♭7
        ],
        4: [
          // Бокс 4
          [5, 7],  // 6 струна, лад 7 - ♭7
          [5, 10],  // 6 струна, лад 8 - 1 (октава выше)
          [4, 7],  // 5 струна, лад 7 - 1
          [4, 10],  // 5 струна, лад 9 - ♭3
          [3, 7],  // 4 струна, лад 7 - 1
          [3, 9],  // 4 струна, лад 9 - ♭3
          [2, 7],  // 3 струна, лад 7 - 1
          [2, 9],  // 3 струна, лад 9 - ♭3
          [1, 8],  // 2 струна, лад 7 - ♭7
          [1, 10],  // 2 струна, лад 8 - 1
          [0, 7],  // 1 струна, лад 7 - ♭7
          [0, 10],  // 1 струна, лад 8 - 1
        ],
        5: [
          // Бокс 5
          [5, 10],  // 6 струна, лад 8 - 1
          [5, 12], // 6 струна, лад 10 - ♭3
          [4, 10],  // 5 струна, лад 9 - ♭3
          [4, 12], // 5 струна, лад 10 - 4
          [3, 9],  // 4 струна, лад 9 - ♭3
          [3, 12], // 4 струна, лад 10 - 4
          [2, 9],  // 3 струна, лад 9 - ♭3
          [2, 12], // 3 струна, лад 10 - 4
          [1, 10],  // 2 струна, лад 8 - 1
          [1, 12], // 2 струна, лад 10 - ♭3
          [0, 10],  // 1 струна, лад 8 - 1
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
    const isVisible =
      document.getElementById("pentatonicControls").style.display !== "none";

    if (!isVisible) {
      this.showPentatonic();
    } else {
      this.hidePentatonic();
    }
  }

  showPentatonic() {
    const chord = document.getElementById('chordInput').value.trim();
    if (!chord) return alert('Введите аккорд');
    
    setActiveMode('pentatonic'); 

    try {
      // 1. СБРАСЫВАЕМ ВСЁ на грифе
      this.clearAllFretboardHighlights();

      // 2. Определяем настройки
      const root = this.neck.extractTonic(chord);

      // 3. Получаем выбранный тип пентатоники
      const typeRadios = document.querySelectorAll(
        'input[name="pentatonicType"]',
      );
      let selectedType = "minor";
      typeRadios.forEach((radio) => {
        if (radio.checked) selectedType = radio.value;
      });

      // 4. Получаем опции
      const showBlues = document.getElementById("showBluesNote").checked;
      const activeBoxBtn = document.querySelector(".box-btn.active");
      const box = activeBoxBtn ? activeBoxBtn.dataset.box : "all";

      // 5. Получаем ноты
      const pentatonicNotes = this.getPentatonicNotes(root, selectedType);
      const bluesNote =
        showBlues && selectedType === "minor" ? this.getBluesNote(root) : null;

      // 6. Показываем панель управления
      document.getElementById("pentatonicControls").style.display = "block";
      document.getElementById("togglePentatonicBtn").classList.add("active");

      // 7. ПОДСВЕЧИВАЕМ ноты на грифе
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

      // 8. Обновляем информацию
      // this.updatePentatonicInfo(root, selectedType, pentatonicNotes, bluesNote, box);

      // 9. Сохраняем конфигурацию
      this.currentConfig = { root, type: selectedType, box, showBlues };
      this.isActive = true;
    } catch (error) {
      console.error("Ошибка при показе пентатоники:", error);
      alert("Не удалось показать пентатонику. Проверьте введенный аккорд.");
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
        fret.classList.add("pentatonic-note");

        // Если это корневая нота
        if (normalizedNote === root) {
          fret.classList.add("pentatonic-root");
          fret.style.fontWeight = "bold";
        }
      }

      // Проверяем, является ли блюзовой нотой
      if (bluesNote && normalizedNote === bluesNote) {
        fret.classList.add("blues-note");
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
    // Бокс 1 всегда начинается с лада, где находится корень на 6 струне
    // Найдем лад, где на 6 струне находится корень
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
  
    // Смещение для бокса 1
    // В паттерне бокс 1 начинается с лада 0 на 6 струне
    // Нужно сместить так, чтобы лад 0 в паттерне соответствовал rootPositionOnString6
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
  
      // Проверяем и подсвечиваем
      if (pentatonicNotes.includes(normalizedNote)) {
        fretElement.classList.add("pentatonic-note");
  
        if (normalizedNote === rootNote) {
          fretElement.classList.add("pentatonic-root");
          fretElement.style.fontWeight = "bold";
        }
      }
  
      if (bluesNote && normalizedNote === bluesNote) {
        fretElement.classList.add("blues-note");
        fretElement.style.animation = "blues-note-pulse 2s infinite";
      }
    });
  }


  highlightAllNotes(root, pentatonicNotes, bluesNote) {
    document.querySelectorAll(".fret").forEach((fret) => {
      const note = fret.getAttribute("data-note");
      const normalizedNote = this.neck.normalizeToSharps(note);

      // Подсвечиваем ВСЕ ноты пентатоники
      if (pentatonicNotes.includes(normalizedNote)) {
        fret.classList.add("pentatonic-note");

        // Дополнительно выделяем корневую ноту
        if (normalizedNote === root) {
          fret.classList.add("pentatonic-root");
          fret.style.fontWeight = "bold";
        }
      }

      // Подсвечиваем блюзовую ноту
      if (bluesNote && bluesNote === normalizedNote) {
        fret.classList.add("blues-note");
        fret.style.animation = "blues-note-pulse 2s infinite";
      }
    });
  }

  highlightBox(rootIndex, boxNum, type, root, pentatonicNotes, bluesNote) {
    const boxPattern = this.boxPatterns[type][boxNum];
    if (!boxPattern) return;

    boxPattern.forEach(([string, baseFret]) => {
      const fret = baseFret + rootIndex;
      if (fret > 12) return;

      const fullNote = this.neck.getNote(string, fret);
      const noteName = fullNote.replace(/[0-9]/g, "");
      const normalizedNote = this.neck.normalizeToSharps(noteName);

      const fretElement = document.querySelector(
        `.fret[data-string="${string}"][data-fret="${fret}"]`,
      );

      if (fretElement) {
        // Подсвечиваем ВСЕ ноты пентатоники в боксе
        if (pentatonicNotes.includes(normalizedNote)) {
          fretElement.classList.add("pentatonic-note");

          // Дополнительно выделяем корневую
          if (normalizedNote === root) {
            fretElement.classList.add("pentatonic-root");
            fretElement.style.fontWeight = "bold";
          }
        }

        // Подсвечиваем блюзовую ноту
        if (bluesNote && bluesNote === normalizedNote) {
          fretElement.classList.add("blues-note");
          fretElement.style.animation = "blues-note-pulse 2s infinite";
        }
      }
    });
  }

  clearPentatonicHighlight() {
    document.querySelectorAll(".fret").forEach((fret) => {
      // Очищаем ВСЕ классы, связанные с пентатоникой
      fret.classList.remove(
        "pentatonic-note",
        "pentatonic-root",
        "blues-note",
        "root",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "blues",
      );
      // Сбрасываем все стили
      fret.style.fontWeight = "";
      fret.style.animation = "";
      fret.style.backgroundColor = ""; // дополнительно
    });
  }

  clearPentatonicHighlight() {
    document.querySelectorAll(".fret").forEach((fret) => {
      fret.classList.remove(
        "pentatonic-note",
        "root",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "blues",
      );
      fret.style.fontWeight = "";
      fret.style.animation = "";
    });
  }

  clearOtherVisualizations() {
    // Очищаем аккорды
    document.querySelectorAll(".fret").forEach((fret) => {
      fret.classList.remove("highlight");
    });

    // Очищаем арпеджио
    if (window.arpeggioManager) {
      window.arpeggioManager.clear();
    }

    // Скрываем другие панели
    document.getElementById("chordSequence").style.display = "none";
    document.getElementById("chordNotes").textContent = "";
    document.getElementById("styleInfo").textContent = "";
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

  hidePentatonic() {
    this.clearPentatonicHighlight();

    document.getElementById("pentatonicControls").style.display = "none";
    document.getElementById("togglePentatonicBtn").classList.remove("active");
    document.getElementById("pentatonicInfo").innerHTML = "";

    this.isActive = false;
    this.currentConfig = null;
  }

  updateFromChordChange() {
    if (this.isActive) {
      this.showPentatonic();
    }
  }

  // Вспомогательные методы
  getDegreeClass(degree) {
    return degree === 1 ? "root" : ""; // Упрощаем
  }
}
// Конец PentatonicManager

// ============ MANOUCHE SCALES - СПЕЦИФИЧЕСКИЕ ГАММЫ ДЖАЗ-МАНУШ ============

class ManoucheScales {
  constructor() {
    this.neck = new GuitarNeck();
    this.isActive = false;
    this.currentScale = null;

    // Цвета для разных типов нот в мануш-гаммах
    this.noteColors = {
      root: 'var(--zenburn-red)',
      characteristic: 'var(--zenburn-orange)', // Характерные ноты (♭3, ♭6, ♯4)
      tension: 'var(--zenburn-blue)',          // Напряженные ноты
      resolution: 'var(--zenburn-green)',      // Разрешающиеся ноты
      passing: 'var(--zenburn-purple)'         // Проходящие хроматические
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
    return intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return this.neck.notes.sharps[noteIndex];
    });
  }

  // Определяем тип гаммы по аккорду
  detectScaleForChord(chord) {
    const chordUpper = chord.toUpperCase();
    
    if (chord.includes('m')) {
      // Минорные аккорды
      if (chord.includes('m6') || chord.includes('m7')) {
        return 'dorianSharp4'; // Для Am6, Am7
      }
      return 'harmonicMinorNat6'; // Для Am, Am(maj7)
    } else if (chord.includes('7')) {
      // Доминанты
      if (chord.includes('7#9') || chord.includes('7alt')) {
        return 'altered';
      } else if (chord.includes('7b9')) {
        return 'mixolydianFlat6';
      }
      return 'diminished'; // Django часто использует diminished над V7
    } else {
      // Мажорные аккорды
      if (chord.includes('6') || chord.includes('maj7')) {
        return 'harmonicMajor';
      }
      return 'gypsyMajor'; // По умолчанию для мажора
    }
  }

  // Показываем гамму на грифе
  showScale(scaleName = null) {
    const chord = document.getElementById('chordInput').value.trim();
    if (!chord) return alert('Введите аккорд');
    
    // Определяем гамму, если не указана
    if (!scaleName) {
      scaleName = this.detectScaleForChord(chord);
    }
    
    const root = this.neck.extractTonic(chord);
    const scaleNotes = this.getScaleNotes(root, scaleName);
    
    if (!scaleNotes.length) {
      console.error('Не удалось получить ноты гаммы');
      return;
    }
    
    // Устанавливаем активный режим
    setActiveMode('manouche');
    
    // Показываем панель управления
    document.getElementById('manoucheControls').style.display = 'block';
    document.getElementById('toggleManoucheBtn').classList.add('active');
    
    // Очищаем гриф
    this.clearAllHighlights();
    
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
    const allFrets = document.querySelectorAll('.fret');
    const rootNote = this.neck.normalizeToSharps(root);
    
    // Определяем характерные ноты для этой гаммы
    const characteristicNotes = this.getCharacteristicNotes(root, scaleName);
    
    allFrets.forEach(fret => {
      const note = fret.getAttribute('data-note');
      if (!note) return;
      
      const normalizedNote = this.neck.normalizeToSharps(note);
      
      // Проверяем, принадлежит ли нота гамме
      if (scaleNotes.includes(normalizedNote)) {
        fret.classList.add('manouche-note');
        
        // Корневая нота
        if (normalizedNote === rootNote) {
          fret.classList.add('manouche-root');
          fret.style.backgroundColor = this.noteColors.root;
          fret.style.fontWeight = 'bold';
        }
        // Характерные ноты (♭3, ♭6, ♯4)
        else if (characteristicNotes.includes(normalizedNote)) {
          fret.classList.add('manouche-characteristic');
          fret.style.backgroundColor = this.noteColors.characteristic;
        }
        // Остальные ноты гаммы
        else {
          fret.style.backgroundColor = this.noteColors.resolution;
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
        this.neck.notes.sharps[(rootIndex + 3) % 12],  // ♭3
        this.neck.notes.sharps[(rootIndex + 6) % 12],  // ♯4
        this.neck.notes.sharps[(rootIndex + 8) % 12],  // ♭6
      ],
      harmonicMajor: [
        this.neck.notes.sharps[(rootIndex + 8) % 12],  // ♭6
      ],
      harmonicMinorNat6: [
        this.neck.notes.sharps[(rootIndex + 11) % 12], // 7 (мажорная)
      ],
      dorianSharp4: [
        this.neck.notes.sharps[(rootIndex + 6) % 12],  // ♯4
      ],
      diminished: [
        this.neck.notes.sharps[(rootIndex + 3) % 12],  // ♭3
        this.neck.notes.sharps[(rootIndex + 6) % 12],  // ♭5
        this.neck.notes.sharps[(rootIndex + 9) % 12],  // 6 (♭♭7)
      ]
    };
    
    return characteristicMap[scaleName] || [];
  }

  // Обновляем информацию о гамме
  updateScaleInfo(root, scaleName, scaleNotes) {
    const infoDiv = document.getElementById('manoucheInfo');
    const scaleNames = {
      gypsyMajor: 'Цыганская мажорная',
      harmonicMajor: 'Мажорная гармоническая',
      harmonicMinorNat6: 'Минорная гармоническая с ♮6',
      dorianSharp4: 'Дорийский с ♯4',
      diminished: 'Diminished арпеджио',
      doubleChromatic: 'Двойная хроматика',
      mixolydianFlat6: 'Миксолидийский ♭6',
      altered: 'Альтерированная'
    };
    
    const formula = this.getScaleFormula(scaleName);
    const characteristic = this.getCharacteristicDescription(scaleName);
    
    let info = `
      <div class="manouche-scale-header">
        <strong>${scaleNames[scaleName] || scaleName} от ${root}</strong>
        <span class="scale-formula">${formula}</span>
      </div>
      <div class="scale-notes">Ноты: <strong>${scaleNotes.join(', ')}</strong></div>
      <div class="scale-characteristic">${characteristic}</div>
      <div class="django-tip">${this.getDjangoTip(scaleName)}</div>
    `;
    
    infoDiv.innerHTML = info;
  }

  // Формулы гамм
  getScaleFormula(scaleName) {
    const formulas = {
      gypsyMajor: '1 - 2 - ♭3 - ♯4 - 5 - ♭6 - 7',
      harmonicMajor: '1 - 2 - 3 - 4 - 5 - ♭6 - 7',
      harmonicMinorNat6: '1 - 2 - ♭3 - 4 - 5 - 6 - 7',
      dorianSharp4: '1 - 2 - ♭3 - ♯4 - 5 - 6 - ♭7',
      diminished: '1 - ♭3 - ♭5 - 6 (♭♭7)',
      doubleChromatic: 'Полутоновые пары',
      mixolydianFlat6: '1 - 2 - 3 - 4 - 5 - ♭6 - ♭7',
      altered: '1 - ♭9 - ♯9 - 3 - ♯11 - ♭13 - ♭7'
    };
    return formulas[scaleName] || '';
  }

  // Описание характерных особенностей
  getCharacteristicDescription(scaleName) {
    const descriptions = {
      gypsyMajor: '🎻 <em>Классический "цыганский" звук Django. Используй ♭3 и ♭6 для аутентичного колорита.</em>',
      harmonicMajor: '🎵 <em>Мажор с напряжённой ♭6. Отлично подходит для аккордов 6 и maj7.</em>',
      harmonicMinorNat6: '🎹 <em>Минор с мажорной септимой. Характерно для "Minor Swing".</em>',
      diminished: '⚡ <em>Симметричное арпеджио - основа техники Django! Используй как проходящие аккорды.</em>',
      dorianSharp4: '✨ <em>Дорийский с повышенной квартой. Придаёт современное звучание.</em>'
    };
    return descriptions[scaleName] || '';
  }

  // Советы Django для каждой гаммы
  getDjangoTip(scaleName) {
    const tips = {
      gypsyMajor: '💡 <strong>Совет Django:</strong> Акцентируй ♭3 и ♭6 в быстрых пассажах.',
      harmonicMajor: '💡 <strong>Совет Django:</strong> Разрешай ♭6 в 5 или ♭7.',
      diminished: '💡 <strong>Совет Django:</strong> Играй diminished арпеджио через каждые полтона.',
      harmonicMinorNat6: '💡 <strong>Совет Django:</strong> Используй мажорную септиму как подход к тонике.'
    };
    return tips[scaleName] || '';
  }

  // Очистка подсветки
  clearAllHighlights() {
    document.querySelectorAll('.fret').forEach(fret => {
      fret.classList.remove(
        'manouche-note',
        'manouche-root',
        'manouche-characteristic',
        'manouche-tension'
      );
      fret.style.backgroundColor = '';
      fret.style.fontWeight = '';
    });
  }

  // Переключение видимости
  toggleManouche() {
    if (this.isActive) {
      this.hideManouche();
    } else {
      this.showScale();
    }
  }

  // Скрыть панель
  hideManouche() {
    this.clearAllHighlights();
    document.getElementById('manoucheControls').style.display = 'none';
    document.getElementById('toggleManoucheBtn').classList.remove('active');
    document.getElementById('manoucheInfo').innerHTML = '';
    this.isActive = false;
    this.currentScale = null;
  }

  // Обновить при изменении аккорда
  updateFromChordChange() {
    if (this.isActive) {
      this.showScale();
    }
  }
}

// ============ DJANGO LICKS - ХАРАКТЕРНЫЕ ФРАЗЫ ============

class DjangoLicks {
  constructor() {
    this.neck = new GuitarNeck();
    this.licks = {
      // 1. Классический diminished run
      dimRun: {
        name: 'Diminished Run',
        description: 'Классическое diminished арпеджио Django',
        pattern: [[5, 0], [5, 3], [4, 1], [4, 4], [3, 2], [3, 5], [2, 3], [2, 6]],
        notes: ['G', 'Bb', 'Db', 'E', 'G'],
        tempo: 'Быстро',
        usage: 'Over G7 → Cmaj'
      },
      
      // 2. Цыганская мажорная гамма
      gypsySweep: {
        name: 'Gypsy Major Sweep',
        description: 'Быстрый пассаж цыганской мажорной гаммы',
        pattern: [[5, 0], [4, 2], [4, 0], [3, 1], [3, 0], [2, 2], [2, 0], [1, 3], [1, 0]],
        notes: ['G', 'A', 'Bb', 'C#', 'D', 'Eb', 'F#', 'G'],
        tempo: 'Очень быстро',
        usage: 'Over G6'
      },
      
      // 3. Хроматический подход
      chromaticApproach: {
        name: 'Chromatic Approach',
        description: 'Хроматический подход к аккордовому тону',
        pattern: [[2, 5], [2, 6], [2, 7], [1, 5], [1, 6]],
        notes: ['A', 'Bb', 'B', 'C', 'C#'],
        tempo: 'Средне',
        usage: 'Approaching Dm'
      },
      
      // 4. Тремоло-паттерн
      tremoloPattern: {
        name: 'Tremolo Pattern',
        description: 'Характерное тремоло Django',
        pattern: [[1, 3], [1, 3], [1, 3], [1, 3], [2, 2], [2, 2], [2, 2], [2, 2]],
        notes: ['C', 'C', 'C', 'C', 'B', 'B', 'B', 'B'],
        tempo: 'Медленно с тремоло',
        usage: 'Over Am7'
      }
    };
  }

  // Показать лик на грифе
  showLick(lickName, position = 0) {
    const lick = this.licks[lickName];
    if (!lick) return;

    this.clearLickHighlight();
    
    // Применяем позицию (сдвиг ладов)
    lick.pattern.forEach(([string, fret], index) => {
      const actualFret = fret + position;
      if (actualFret > 12) return;
      
      const fretElement = document.querySelector(
        `.fret[data-string="${string}"][data-fret="${actualFret}"]`
      );
      
      if (fretElement) {
        fretElement.classList.add('django-lick-note');
        fretElement.classList.add(`lick-note-${index % 4}`); // Для последовательности
        
        // Добавляем цифру порядка нот
        const orderSpan = document.createElement('span');
        orderSpan.className = 'lick-order';
        orderSpan.textContent = (index + 1).toString();
        fretElement.appendChild(orderSpan);
      }
    });
    
    this.showLickInfo(lick);
  }

  // Информация о лике
  showLickInfo(lick) {
    const infoDiv = document.getElementById('djangoLicksInfo') || 
                    document.createElement('div');
    
    infoDiv.id = 'djangoLicksInfo';
    infoDiv.className = 'django-lick-info';
    infoDiv.innerHTML = `
      <div class="lick-header">
        <strong>🎸 ${lick.name}</strong>
        <span class="lick-tempo">${lick.tempo}</span>
      </div>
      <div class="lick-description">${lick.description}</div>
      <div class="lick-notes">Ноты: <strong>${lick.notes.join(' - ')}</strong></div>
      <div class="lick-usage">Использование: ${lick.usage}</div>
      <div class="lick-tip">💡 <em>Практикуй медленно, затем увеличивай темп</em></div>
    `;
    
    const controls = document.querySelector('.controls');
    if (!document.getElementById('djangoLicksInfo')) {
      controls.appendChild(infoDiv);
    }
  }

  clearLickHighlight() {
    document.querySelectorAll('.fret').forEach(fret => {
      fret.classList.remove(
        'django-lick-note',
        'lick-note-0', 'lick-note-1', 'lick-note-2', 'lick-note-3'
      );
      const orderSpan = fret.querySelector('.lick-order');
      if (orderSpan) orderSpan.remove();
    });
  }
}
// -------- конец классов ---------



// В начало script.js после классов, но перед функциями
window.activeMode = null; // Отслеживает активный режим

function setActiveMode(mode) {
  document.querySelector('.arpeggio-controls')?.style.setProperty('display', 'none');
  document.getElementById('pentatonicControls')?.style.setProperty('display', 'none');
  // ✅ УБРАЛИ: document.getElementById('chordSequence')?.style.setProperty('display', 'none');
  
  clearAllHighlights();
  
  document.querySelectorAll('.pentatonic-btn, .arpeggio-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  window.activeMode = mode;
}



// ============ ИНИЦИАЛИЗАЦИЯ ПЕНТАТОНИКИ ============

let pentatonicManager;

function initPentatonic() {
  pentatonicManager = new PentatonicManager();
  window.pentatonicManager = pentatonicManager;

  // Кнопка переключения
  document
    .getElementById("togglePentatonicBtn")
    .addEventListener("click", function () {
      pentatonicManager.togglePentatonic();
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
      if (this.classList.contains("active")) return;

      document
        .querySelectorAll(".box-btn")
        .forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      if (pentatonicManager.isActive) {
        pentatonicManager.showPentatonic();
      }
    });
  });

  // Обработка изменений в поле аккорда
  document.getElementById("chordInput").addEventListener("change", function () {
    if (pentatonicManager && pentatonicManager.isActive) {
      pentatonicManager.updateFromChordChange();
    }
  });
}

// ============ РЕНДЕРИНГ ГРИФА (БЕЗ ИЗМЕНЕНИЙ) ============
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

// ============ АККОРДЫ (ОСТАВЛЯЕМ КАК БЫЛО) ============

function clearAllHighlights() {
  document.querySelectorAll('.fret').forEach(fret => {
    fret.classList.remove(
      'highlight',
      'pentatonic-note', 'pentatonic-root', 'blues-note',
      'arpeggio-root', 'arpeggio-third', 'arpeggio-fifth',
      'arpeggio-second', 'arpeggio-sixth', 'arpeggio-seventh'
    );
    fret.style.fontWeight = '';
    fret.style.animation = '';
    fret.style.backgroundColor = '';
    fret.style.color = '';
    fret.style.borderColor = '';
  });
}


function highlightChordNotes(chord) {
  // ✅ НЕ вызываем setActiveMode для аккорда — оставляем Gypsy Jazz
  clearAllHighlights();
  
  const neck = new GuitarNeck();
  const chordNotes = neck.getChordNotes(chord);
  
  document.querySelectorAll('.fret').forEach(fret => {
    const note = fret.getAttribute('data-note');
    const normalizedNote = neck.normalizeToSharps(note);
    if (chordNotes.includes(normalizedNote)) {
      fret.classList.add('highlight');
    }
  });
  
  document.getElementById('chordNotes').textContent = `${chord}: ${chordNotes.join(', ')}`;
}




function showJazzManoucheChords(tonic) {
  const neck = new GuitarNeck();
  const chords = neck.getJazzManoucheChords(tonic);

  if (!chords || chords.length === 0) {
    console.error("Не удалось получить аккорды для тоники:", tonic);
    return;
  }

  // Показываем блок с аккордами
  const sequenceDiv = document.getElementById("chordSequence");
  if (!sequenceDiv) {
    console.error("Элемент chordSequence не найден");
    return;
  }

  // Создаем HTML для аккордов
  let chordsHTML = chords
    .map(
      (chord) =>
        `<span class="chord-link" data-chord="${chord}">${chord}</span>`,
    )
    .join(", ");

  // Обновляем содержимое
  sequenceDiv.innerHTML = `
        <strong>Характерные аккорды джаз-мануш от ${tonic}:</strong><br>
        ${chordsHTML}
        <br><br>
        <em>Кликните на любой аккорд для просмотра на грифе</em>
    `;

  sequenceDiv.style.display = "block";

  // Добавляем обработчики кликов
  document.querySelectorAll(".chord-link").forEach((link) => {
    link.addEventListener("click", function () {
      const chord = this.getAttribute("data-chord");
      document.getElementById("chordInput").value = chord;
      highlightChordNotes(chord);

      // Подсвечиваем выбранный аккорд
      document.querySelectorAll(".chord-link").forEach((l) => {
        l.style.background = "";
      });
      this.style.background = "rgba(143, 178, 143, 0.3)";
    });
  });

  // Очищаем другие визуализации
  if (window.arpeggioManager) {
    window.arpeggioManager.clear();
  }

  if (window.pentatonicManager && window.pentatonicManager.isActive) {
    window.pentatonicManager.hidePentatonic();
  }
}

// ============ АРПЕДЖИО (НОВАЯ ПРАВИЛЬНАЯ РЕАЛИЗАЦИЯ) ============
class ArpeggioManager {
  constructor() {
    this.neck = new GuitarNeck();
    this.currentArpeggio = null;
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

  showArpeggio(chord) {
    if (!chord) return;
    
    setActiveMode('arpeggio');  // Скрывает другие панели
    
    // ✅ ВАЖНО: ПОКАЗЫВАЕМ ПАНЕЛЬ АРПЕДЖИО ПОСЛЕ
    const arpeggioControls = document.querySelector('.arpeggio-controls');
    arpeggioControls.style.display = 'block';
    
    const root = this.neck.extractTonic(chord);
    const type = this.getArpeggioType(chord);
    const addSecond = document.getElementById('addSecond').checked;
    const addSixth = document.getElementById('addSixth').checked;
    const addSeventh = document.getElementById('addSeventh').checked;
    
    const baseNotes = this.getArpeggioNotes(root, type);
    const extendedNotes = this.addExtensions(baseNotes, root, addSecond, addSixth, addSeventh);
    
    this.currentArpeggio = {
      root, type, notes: extendedNotes, baseNotes
    };
    
    this.visualizeArpeggio(extendedNotes, root, type);
    return this.currentArpeggio;
  }
  

  visualizeArpeggio(notes, root, type) {
    clearAllHighlights();  // Полная очистка перед арпеджио
    const rootNote = notes[0];
    const thirdNote = notes[1];
    const fifthNote = notes[2];
    document.querySelectorAll('.fret').forEach(fret => {
      const note = fret.getAttribute('data-note');
      const normalizedNote = this.neck.normalizeToSharps(note);
      if (normalizedNote === rootNote) {
        fret.classList.add('arpeggio-root');
      } else if (normalizedNote === thirdNote) {
        fret.classList.add('arpeggio-third');
      } else if (normalizedNote === fifthNote) {
        fret.classList.add('arpeggio-fifth');
      } else if (notes.includes(normalizedNote)) {
        const rootIndex = this.neck.notes.sharps.indexOf(this.neck.normalizeToSharps(root));
        const noteIndex = this.neck.notes.sharps.indexOf(normalizedNote);
        let interval = (noteIndex - rootIndex + 12) % 12;
        if (interval === 2) fret.classList.add('arpeggio-second');
        else if (interval === 9) fret.classList.add('arpeggio-sixth');
        else if (interval === 10 || interval === 11) fret.classList.add('arpeggio-seventh');
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
    document.querySelectorAll('.fret').forEach(fret => {
      fret.classList.remove(
        'arpeggio-root', 'arpeggio-third', 'arpeggio-fifth',
        'arpeggio-second', 'arpeggio-sixth', 'arpeggio-seventh',
        'highlight'  // Добавлено
      );
    });
    const arpeggioInfoDiv = document.querySelector('.arpeggio-info');
    if (arpeggioInfoDiv) arpeggioInfoDiv.remove();
    this.currentArpeggio = null;
  }
  

  updateExtensions() {
    if (this.currentArpeggio) {
      const chordInput = document.getElementById("chordInput");
      this.showArpeggio(chordInput.value.trim());
    }
  }
}

// ============ ИНИЦИАЛИЗАЦИЯ И УПРАВЛЕНИЕ ============
let arpeggioManager;

function initArpeggio() {
  arpeggioManager = new ArpeggioManager();

  // Кнопка показа арпеджио
  document
    .getElementById("showArpeggioBtn")
    .addEventListener("click", function () {
      const chord = document.getElementById("chordInput").value.trim();
      if (chord) {
        arpeggioManager.showArpeggio(chord);
      }
    });

  // Чекбоксы расширений
  ["addSecond", "addSixth", "addSeventh"].forEach((id) => {
    document.getElementById(id).addEventListener("change", function () {
      if (arpeggioManager) {
        arpeggioManager.updateExtensions();
      }
    });
  });
}

function clearArpeggio() {
  if (arpeggioManager) {
    arpeggioManager.clear();
  }
}

function hideArpeggioInfo() {
  const arpeggioInfoDiv = document.querySelector(".arpeggio-info");
  if (arpeggioInfoDiv) {
    arpeggioInfoDiv.remove();
  }
}


// ============ ИНИЦИАЛИЗАЦИЯ MANOUCHE ============

let manoucheScales;
let djangoLicks;

function initManouche() {
  // Инициализация гамм
  manoucheScales = new ManoucheScales();
  window.manoucheScales = manoucheScales;
  
  // Инициализация ликов
  djangoLicks = new DjangoLicks();
  window.djangoLicks = djangoLicks;

  // Кнопка переключения
  document.getElementById('toggleManoucheBtn').addEventListener('click', function() {
    manoucheScales.toggleManouche();
  });

  // Кнопки выбора гаммы
  document.querySelectorAll('.scale-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.scale-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const scaleName = this.dataset.scale;
      if (scaleName === 'auto') {
        manoucheScales.showScale();
      } else {
        manoucheScales.showScale(scaleName);
      }
    });
  });

  // Кнопки фраз Django
  document.querySelectorAll('.lick-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const lickName = this.dataset.lick;
      djangoLicks.showLick(lickName);
    });
  });

  // Обновление при изменении аккорда
  document.getElementById('chordInput').addEventListener('change', function() {
    if (manoucheScales && manoucheScales.isActive) {
      manoucheScales.updateFromChordChange();
    }
  });
}

// ============ ОБРАБОТЧИКИ СОБЫТИЙ ============
document.addEventListener("DOMContentLoaded", function () {
  renderFretBoard();

  // Кнопка показа аккорда
  document
    .getElementById("highlightChordBtn")
    .addEventListener("click", function () {
      const chord = document.getElementById("chordInput").value.trim();
      if (chord) {
        // Скрываем все дополнительные панели
        document.getElementById("chordSequence").style.display = "none";

        // Очищаем другие режимы
        if (window.arpeggioManager) {
          window.arpeggioManager.clear();
        }

        if (window.pentatonicManager && window.pentatonicManager.isActive) {
          window.pentatonicManager.hidePentatonic();
        }

        // Показываем аккорд
        highlightChordNotes(chord);
      }
    });

  // Кнопка джаз-мануш аккордов
  document
    .getElementById("jazzManoucheBtn")
    .addEventListener("click", function () {
      const chord = document.getElementById("chordInput").value.trim();
      if (chord) {
        const neck = new GuitarNeck();
        const tonic = neck.extractTonic(chord);

        // Показываем аккорды
        showJazzManoucheChords(tonic);

        // Очищаем другие режимы
        if (window.arpeggioManager) window.arpeggioManager.clear();
        if (window.pentatonicManager) window.pentatonicManager.hidePentatonic();
      }
    });

  // Кнопка показа арпеджио
  document
    .getElementById("showArpeggioBtn")
    .addEventListener("click", function () {
      const chord = document.getElementById("chordInput").value.trim();
      const arpeggioControls = document.querySelector(".arpeggio-controls");

      if (chord) {
        // Переключаем видимость панели
        if (arpeggioControls) {
          const isVisible = arpeggioControls.style.display !== "none";
          arpeggioControls.style.display = isVisible ? "none" : "block";
        }

        // Показываем арпеджио
        if (arpeggioManager) {
          arpeggioManager.showArpeggio(chord);
        }
      }
    });

  // Инициализация арпеджио
  initArpeggio();

  // Инициализация пентатоники
  initPentatonic();

  // Инициализация Manouche
  initManouche();
  
  // Обновляем setActiveMode для поддержки Manouche
  window.setActiveMode = function(mode) {
    document.querySelector('.arpeggio-controls')?.style.setProperty('display', 'none');
    document.getElementById('pentatonicControls')?.style.setProperty('display', 'none');
    document.getElementById('manoucheControls')?.style.setProperty('display', 'none');
    clearAllHighlights();
    
    document.querySelectorAll('.pentatonic-btn, .arpeggio-btn, .manouche-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    window.activeMode = mode;
  };
}); 
