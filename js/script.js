
// ============ MANOUCHE SCALES - СПЕЦИФИЧЕСКИЕ ГАММЫ ДЖАЗ-МАНУШ ============

class ManoucheScales {
  constructor() {
    // Используем musicTheory для музыкальной теории
    this.theory = window.musicTheory;
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
      hungarianMinor: [0, 2, 3, 6, 7, 8, 11],
      hungarianMajor: [0, 1, 4, 5, 7, 8, 11],
      harmonicMajor: [0, 2, 4, 5, 7, 8, 11],
      harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
      harmonicMinorNat6: [0, 2, 3, 5, 7, 9, 11],
      dorianSharp4: [0, 2, 3, 6, 7, 9, 10],
      diminished: [0, 3, 6, 9],
      doubleChromatic: [0, 1, 2, 3, 4, 5],
      mixolydianFlat6: [0, 2, 4, 5, 7, 8, 10],
      altered: [0, 1, 3, 4, 6, 8, 10],
    };
    return intervals[scaleName] || intervals.hungarianMajor;
  }

  // Получаем ноты гаммы от тоники
  getScaleNotes(root, scaleName) {
    if (!this.theory) {
      console.error('MusicTheory не загружен');
      return [];
    }
  
    const rootNote = this.theory.normalizeToSharps(root);
    
    // Безопасное получение массива нот
    let notesArray = this.theory.notes;
    if (!notesArray || !Array.isArray(notesArray)) {
      notesArray = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    }
    
    const rootIndex = notesArray.indexOf(rootNote);
    if (rootIndex === -1) {
      console.warn(`Тоника "${root}" не найдена в массиве нот`);
      return [];
    }
  
    const intervals = this.getScaleIntervals(scaleName);
    if (!intervals || intervals.length === 0) {
      console.warn(`Нет интервалов для гаммы "${scaleName}"`);
      return [];
    }
  
    return intervals.map((interval) => {
      const noteIndex = (rootIndex + interval) % 12;
      return notesArray[noteIndex];
    });
  }

  // Определяем тип гаммы по аккорду
  detectScaleForChord(chord) {
    if (!chord) return "gypsyMajor";

    const chordUpper = chord.toUpperCase();

    if (chord.includes("m")) {
      // Минорные аккорды
      if (chord.includes("m6") || chord.includes("m7")) {
        return "dorianSharp4";
      }
      return "harmonicMinorNat6";
    } else if (chord.includes("7")) {
      // Доминанты
      if (chord.includes("7#9") || chord.includes("7alt")) {
        return "altered";
      } else if (chord.includes("7b9")) {
        return "mixolydianFlat6";
      }
      return "diminished";
    } else {
      // Мажорные аккорды
      if (chord.includes("6") || chord.includes("maj7")) {
        return "harmonicMajor";
      }
      return "gypsyMajor";
    }
  }

  // Получаем аккорд из активной вкладки
  getActiveChord() {
    return document.getElementById("chordInputManouche")?.value.trim() || "";
  }

  // Показываем гамму на грифе
  showScale(scaleName = null) {
    const chord = this.getActiveChord();
    if (!chord || !this.theory) return;

    // Определяем гамму, если не указана
    if (!scaleName) {
      scaleName = this.detectScaleForChord(chord);
    }

    const root = this.theory.extractTonic(chord); // Используем theory вместо neck
    const scaleNotes = this.getScaleNotes(root, scaleName);

    if (!scaleNotes.length) {
      console.error("Не удалось получить ноты гаммы");
      return;
    }

    // НЕ очищаем здесь! Очистка делается в обработчиках кнопок

    // Показываем панель управления
    document.getElementById("manoucheControls").style.display = "block";
    document.getElementById("showManoucheBtn").classList.add("active");

    // Подсвечиваем ноты гаммы
    this.highlightScaleNotes(root, scaleNotes, scaleName);

    // Сохраняем текущую конфигурацию
    this.currentScale = { root, scaleName, notes: scaleNotes };
    this.isActive = true;
  }

  // Подсветка нот гаммы на грифе
  highlightScaleNotes(root, scaleNotes, scaleName) {
    const allFrets = document.querySelectorAll(".fret");
    const rootNote = this.theory.normalizeToSharps(root);

    // Определяем характерные ноты для этой гаммы
    const characteristicNotes = this.getCharacteristicNotes(root, scaleName);

    allFrets.forEach((fret) => {
      const note = fret.getAttribute("data-note");
      if (!note) return;

      const normalizedNote = this.theory.normalizeToSharps(note);

      // Проверяем, принадлежит ли нота гамме
      const isInScale = scaleNotes.some((scaleNote) =>
        this.theory.areNotesEqual(scaleNote, normalizedNote),
      );

      if (isInScale) {
        fret.classList.add("manouche-note");

        // Корневая нота
        if (this.theory.areNotesEqual(normalizedNote, rootNote)) {
          fret.classList.add("manouche-root");
          fret.style.backgroundColor = this.noteColors.root;
          fret.style.color = "white";
          fret.style.fontWeight = "bold";
          fret.style.fontSize = "16px";
          fret.style.boxShadow = "0 0 8px rgba(204, 147, 147, 0.7)";
        }
        // Характерные ноты (♭3, ♭6, ♯4)
        else if (
          characteristicNotes.some((charNote) =>
            this.theory.areNotesEqual(charNote, normalizedNote),
          )
        ) {
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
    if (!this.theory || !root) return [];

    const rootNote = this.theory.normalizeToSharps(root);
    const rootIndex = this.theory.notes.sharps.indexOf(rootNote);

    if (rootIndex === -1) return [];

    const characteristicMap = {
      gypsyMajor: [
        this.theory.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.theory.notes.sharps[(rootIndex + 6) % 12], // ♯4
        this.theory.notes.sharps[(rootIndex + 8) % 12], // ♭6
      ],
      harmonicMajor: [
        this.theory.notes.sharps[(rootIndex + 8) % 12], // ♭6
      ],
      harmonicMinorNat6: [
        this.theory.notes.sharps[(rootIndex + 11) % 12], // 7 (мажорная)
      ],
      dorianSharp4: [
        this.theory.notes.sharps[(rootIndex + 6) % 12], // ♯4
      ],
      diminished: [
        this.theory.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.theory.notes.sharps[(rootIndex + 6) % 12], // ♭5
        this.theory.notes.sharps[(rootIndex + 9) % 12], // 6 (♭♭7)
      ],
    };

    return characteristicMap[scaleName] || [];
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

    const tonic = this.theory.extractTonic(chord);
    const chords = this.theory.getJazzManoucheChords(tonic);

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

// ============ EXERCIES - ХАРАКТЕРНЫЕ ФРАЗЫ ============

class DjangoLicks {
  constructor() {
    this.neck = window.guitarNeck;
    this.licks = {
      // 1. Классический diminished run
      dimRun: {
        name: "Diminished Run",
        description: "Классическое diminished арпеджио Django",
        pattern: [
          [5, 3],
          [4, 2],
          [4, 5],
          [3, 3],
          [3, 6],
          [2, 4],
          [2, 7],
          [1, 6],
          [1, 9],
          [0, 7],
          [0, 10],
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
          [4, 10],
          [4, 12],
          [4, 13],
          [3, 11],
          [3, 12],
          [3, 13],
          [2, 11],
          [2, 12],
          [1, 10],
          [1, 11],
          [0, 9],
          [0, 10],
          [0, 11],
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
          [3, 0],
          [3, 1],
          [3, 2],
          [3, 3],
          [3, 4],
          [2, 0],
          [2, 1],
          [2, 2],
          [2, 3],
          [1, 0],
          [1, 1],
          [1, 2],
          [1, 3],
          [1, 4],
          [0, 0],
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4],
          [0, 5],
          [0, 6],
          [0, 7],
          [0, 8],
          [0, 9],
          [0, 10],
        ],
        notes: ["A", "Bb", "B", "C", "C#"],
        tempo: "Средне",
        usage: "Approaching Dm",
      },

      //  Упражнение 1
      exercise1: {
        name: "Ex1",
        description: "Развитие беглости",
        pattern: [
          [4, 7],
          [4, 9],
          [3, 6],
          [3, 8],
          [2, 5],
          [2, 7],
          [1, 5],
          [1, 7],
          [0, 4],
          [0, 6],
        ],
        notes: [],
        tempo: "Медленно с постепенным ускорением в обоих направлениях",
        usage: "Over Am7",
      },

      //  Упражнение 2
      exercise2: {
        name: "Ex2",
        description: "Развитие беглости",
        pattern: [
          [4, 5],
          [4, 6],
          [3, 5],
          [3, 8],
          [2, 6],
          [2, 9],
          [1, 8],
          [0, 6],
          [0, 9],
        ],
        notes: [],
        tempo: "Медленно с постепенным ускорением в обоих направлениях",
        usage: "Over Am7",
      },

      //  Упражнение 3
      exercise3: {
        name: "Ex3",
        description: "Развитие беглости",
        pattern: [
          [5, 5],
          [4, 4],
          [4, 7],
          [3, 5],
          [2, 4],
          [2, 6],
          [1, 5],
          [0, 3],
          [0, 7],
          [0, 6],
          [0, 5],
        ],
        notes: [],
        tempo: "Медленно с постепенным ускорением в обоих направлениях",
        usage: "Over Am7",
      },

      //  Упражнение 4
      exercise4: {
        name: "Ex4",
        description: "Развитие беглости",
        pattern: [
          [4, 0],
          [4, 2],
          [4, 3],
          [4, 4],
          [3, 2],
          [3, 5],
          [2, 4],
          [1, 2],
          [1, 5],
          [0, 3],
          [0, 7],
          [0, 6],
          [0, 5],
        ],
        notes: [],
        tempo: "Медленно с постепенным ускорением в обоих направлениях",
        usage: "Over Am7",
      },

      //  Упражнение 5
      exercise5: {
        name: "Ex5",
        description: "Развитие беглости",
        pattern: [
          [5, 7],
          [5, 10],
          [4, 8],
          [3, 7],
          [3, 9],
          [2, 7],
          [2, 10],
          [1, 9],
          [0, 7],
          [0, 10],
          [0, 13],
        ],
        notes: [],
        tempo: "Медленно с постепенным ускорением в обоих направлениях",
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
  if (!window.guitarNeck) {
    console.error("guitarNeck не загружен!");
    return;
  }

  const neck = window.guitarNeck;
  const theory = window.musicTheory;
  const fretBoard = document.getElementById("fretBoard");
  const stringNames = ["e", "B", "G", "D", "A", "E"];

  let html = "";

  for (let string = 0; string < 6; string++) {
    html += `<div class="string"><div class="string-name">${stringNames[string]}</div>`;
    for (let fret = 0; fret <= neck.frets; fret++) {
      const note = neck.getBaseNote(string, fret);
      const fullNote = neck.getNote(string, fret);
      const isNut = fret === 0;

      // ВАЖНО: Нормализуем все ноты к диезам для единообразия
      const normalizedNote = theory ? theory.normalizeToSharps(note) : note;

      html += `<div class="fret ${isNut ? "nut" : ""}" 
                        data-string="${string}" 
                        data-fret="${fret}"
                        data-note="${normalizedNote}"
                        data-full="${fullNote}">`;
      html += !isNut ? normalizedNote : "○";
      html += `</div>`;
    }
    html += `</div>`;
  }

  fretBoard.innerHTML = html;
}

function highlightChordNotes(chord) {
  if (!chord || chord.trim() === "") {
    return;
  }

  console.log("Показываем аккорд:", chord);

  // Полная очистка перед показом аккорда
  clearAllHighlights();

  // Проверяем, что musicTheory существует
  if (!window.musicTheory) {
    console.error("MusicTheory не загружен!");
    alert(
      "Ошибка: музыкальная теория не загружена. Проверьте загрузку musicTheory.js",
    );
    return;
  }

  const chordNotes = window.musicTheory.getChordNotes(chord);

  if (!chordNotes || chordNotes.length === 0) {
    console.error("Не удалось получить ноты для аккорда:", chord);
    alert(`Не удалось распознать аккорд: ${chord}`);
    return;
  }

  console.log("Ноты аккорда:", chordNotes);

  const rootNote = window.musicTheory.extractTonic(chord);
  console.log("Корневая нота:", rootNote);

  // Нормализуем ноты аккорда для сравнения (все в диезы)
  const normalizedChordNotes = chordNotes.map((note) =>
    window.musicTheory.normalizeToSharps(note),
  );
  const normalizedRootNote = window.musicTheory.normalizeToSharps(rootNote);

  console.log("Нормализованные ноты аккорда:", normalizedChordNotes);
  console.log("Нормализованная корневая нота:", normalizedRootNote);

  // Подсветка нот на грифе
  let highlighted = 0;
  document.querySelectorAll(".fret").forEach((fret) => {
    const note = fret.getAttribute("data-note");
    if (!note) return;

    // Нормализуем ноту на грифе
    const normalizedFretNote = window.musicTheory.normalizeToSharps(note);

    // Проверяем энгармоническое равенство
    const isChordNote = normalizedChordNotes.some((chordNote) =>
      window.musicTheory.areNotesEqual(chordNote, normalizedFretNote),
    );

    if (isChordNote) {
      highlighted++;
      fret.classList.add("highlight");

      // Определяем, является ли нота корневой
      const isRoot = window.musicTheory.areNotesEqual(
        normalizedRootNote,
        normalizedFretNote,
      );

      if (isRoot) {
        fret.classList.add("root");
        fret.style.backgroundColor = "var(--zenburn-red)";
        fret.style.color = "white";
        fret.style.fontWeight = "bold";
        fret.style.fontSize = "16px";
      } else {
        fret.classList.add("chord-tone");
        fret.style.backgroundColor = "var(--zenburn-green)";
        fret.style.color = "var(--zenburn-bg)";
        fret.style.fontWeight = "bold";
      }
    }
  });

  console.log("Подсвечено нот:", highlighted);

  // Обновляем информацию об аккорде
  updateChordInfo(chord, chordNotes);
}

// Новая функция для обновления информации
function updateChordInfo(chord, chordNotes) {
  console.log("updateChordInfo вызвана для аккорда:", chord);

  const chordNameEl = document.getElementById("chordName");
  const chordTypeEl = document.getElementById("chordType");
  const chordNotesEl = document.getElementById("chordNotes");
  const chordFormulaEl = document.getElementById("chordFormula");

  if (!chordNameEl || !chordTypeEl || !chordNotesEl || !chordFormulaEl) {
    console.error("Не найдены элементы для отображения аккорда");
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

  // Устанавливаем ноты аккорда
  chordNotesEl.textContent = chordNotes.join(", ");

  // Устанавливаем формулу
  chordFormulaEl.textContent = chordFormula;

  console.log("Установлено:", {
    chord: chordNameEl.textContent,
    type: chordTypeEl.textContent,
    notes: chordNotesEl.textContent,
    formula: chordFormulaEl.textContent,
  });
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


// ============ ГЛОБАЛЬНЫЕ ФУНКЦИИ ОЧИСТКИ ============
function clearAllHighlights() {
  // 1. Снимаем все классы подсветки и сбрасываем стили
  document.querySelectorAll(".fret").forEach((fret) => {
    // Оставляем только базовые классы
    [...fret.classList].forEach((cls) => {
      if (cls !== "fret" && cls !== "nut") {
        fret.classList.remove(cls);
      }
    });

    // Полный сброс инлайн-стилей (надёжнее поштучного)
    fret.removeAttribute("style");

    // Удаляем динамические вложенные элементы
    fret
      .querySelectorAll(".lick-order, .finger-number, .note-name, .note-degree")
      .forEach((el) => el.remove());

    // Восстанавливаем исходный текст
    const isNut = fret.classList.contains("nut");
    const originalNote = fret.getAttribute("data-note") || "";
    fret.textContent = isNut ? "○" : originalNote;
  });

  // 2. Удаляем все инфо-блоки (querySelectorAll, а не querySelector!)
  [
    ".arpeggio-info",
    ".pentatonic-info",
    ".manouche-info",
    ".licks-info",
    ".fingering-diagram",
  ].forEach((selector) => {
    document.querySelectorAll(selector).forEach((el) => el.remove());
  });
}

// ============ ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ============

function updateBluesChordInfo(chord) {
  const chordNotes = window.musicTheory.getChordNotes(chord);
  const root = window.musicTheory.extractTonic(chord);

  document.getElementById("bluesChordName").textContent = chord;
  document.getElementById("bluesChordNotes").textContent =
    chordNotes.join(", ");
}

function updateManoucheChordInfo(chord) {
  const chordNotes = window.musicTheory.getChordNotes(chord);
  const root = window.musicTheory.extractTonic(chord);

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
  renderFretBoard();

  // Guard-ы: создаём только если ещё нет
  window.pentatonicManager = window.pentatonicManager || new PentatonicManager();
  window.manoucheScales   = window.manoucheScales   || new ManoucheScales();
  window.djangoLicks      = window.djangoLicks      || new DjangoLicks();
  window.arpeggioManager  = window.arpeggioManager  || new ArpeggioManager();
  window.djangoFingerings = window.djangoFingerings || new DjangoFingerings();

  // Локальные переменные — ссылки на те же экземпляры
  pentatonicManager = window.pentatonicManager;
  manoucheScales    = window.manoucheScales;
  djangoLicks       = window.djangoLicks;
  arpeggioManager   = window.arpeggioManager;
  djangoFingerings  = window.djangoFingerings;

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

	  
	  // Функция для обновления подсказок
	  const updateHints = () => {
	    if (window.hintsManager && window.hintsManager.isVisible) {
	      window.hintsManager.updateHints();
	    }
	  };
	  
	  // Слушаем все важные события
	  ['click', 'input', 'change'].forEach(eventType => {
	    document.addEventListener(eventType, (e) => {
	      if (e.target.matches('.tab-btn, .action-btn, .box-btn, .scale-btn, .lick-btn, .fingering-btn, input[type="checkbox"], input[type="text"]')) {
	        setTimeout(updateHints, 50);
	      }
	    });
	  });



  // Инициализация вкладок
  initTabs();

  // Инициализация кнопок управления
  initManoucheButtons();
  initPentatonicButtons();
  if (window.FeedbackManager) {
      window.FeedbackManager.init();
  }
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
        !document.getElementById("showArpeggioBtn").classList.contains("active")
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
}

