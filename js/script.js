
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
      hungarianMajor: [0, 2, 4, 6, 7, 8, 11],
      harmonicMajor: [0, 2, 4, 5, 7, 8, 11],
      harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
      harmonicMinorNat6: [0, 2, 3, 5, 7, 9, 11],
      dorianSharp4: [0, 2, 3, 6, 7, 9, 10],
      diminished: [0, 3, 6, 9],
      doubleChromatic: [0, 1, 2, 3, 4, 5],
      mixolydianFlat6: [0, 2, 4, 5, 7, 8, 10],
      altered: [0, 1, 3, 4, 6, 8, 10],
    };
    return intervals[scaleName] || intervals.gypsyMajor;
  }

  // Получаем ноты гаммы от тоники
  getScaleNotes(root, scaleName) {
    if (!this.theory || !root) return [];

    const rootNote = this.theory.normalizeToSharps(root);
    const rootIndex = this.theory.notes.sharps.indexOf(rootNote);

    if (rootIndex === -1) return [];

    const intervals = this.getScaleIntervals(scaleName);
    return intervals.map((interval) => {
      const noteIndex = (rootIndex + interval) % 12;
      return this.theory.notes.sharps[noteIndex];
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

// ============ Signature chords ============

class DjangoFingerings {
  constructor() {
    this.neck = window.guitarNeck; // Используем глобальный экземпляр
    this.theory = window.musicTheory;

    // Типичные аппликатуры Django для разных гамм
    this.fingerings = {
      // 1. АМ6 (Minor Swing) - самая известная
      Am6: {
        name: "Am6 (Minor Swing)",
        description: 'Классический аккорд из "Minor Swing"',
        chord: "Am6",
        rootNote: "A",
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
        rootNote: "D",
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
        rootNote: "G",
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
        rootNote: "E",
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
        rootNote: "B",
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
        rootNote: "D",
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
        rootNote: "A",
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
        rootNote: "D",
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
        rootNote: "C#",
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
        rootNote: "C",
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
        rootNote: "C",
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
        rootNote: "G#",
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


      // PATTERNS
      "G7_v1": {
        name: "G7(v1)",
        description: "G7(v1)",
        chord: "G7(v1)",
        rootNote: "G",
        fingers: [
          [5, 3, "G"], // Открытая E
          [4, 5, "G"], // 2 лад - B (5)
          [3, 3, "F"], // 1 лад - G (♭7)
          [2, 4, "B"], // Открытая E
          [1, 3, "D"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      "G7_v2": {
        name: "G7(v2)",
        description: "G7(v2)",
        chord: "G7(v2)",
        rootNote: "G",
        fingers: [
          [5, 3, "G"], // Открытая E
          [4, 5, "D"], // 2 лад - B (5)
          [3, 5, "G"], // 1 лад - G (♭7)
          [2, 4, "B"], // Открытая E
          [1, 6, "F"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      "G7_v3": {
        name: "G7(v3)",
        description: "G7(v3)",
        chord: "G7(v3)",
        rootNote: "G",
        fingers: [
          [5, 3, "G"], // Открытая E
          [4, 0, "D", true], // 2 лад - B (5)
          [3, 3, "G"], // 1 лад - G (♭7)
          [2, 4, "B"], // Открытая E
          [1, 3, "F"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      "G7_v4": {
        name: "G7(v4)",
        description: "G7(v4)",
        chord: "G7(v4)",
        rootNote: "G",
        fingers: [
          [5, 0, "G", true], // Открытая E
          [4, 10, "D"], // 2 лад - B (5)
          [3, 9, "G"], // 1 лад - G (♭7)
          [2, 10, "B"], // Открытая E
          [1, 8, "F"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      "Gm_v1": {
        name: "Gm(v1)",
        description: "Gm(v1)",
        chord: "Gm(v1)",
        rootNote: "G",
        fingers: [
          [5, 3, "G"], // Открытая E
          [4, 5, "D"], // 2 лад - B (5)
          [3, 5, "G"], // 1 лад - G (♭7)
          [2, 3, "B"], // Открытая E
          [1, 3, "D"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      "Gm_v2": {
        name: "Gm(v2)",
        description: "Gm(v2)",
        chord: "Gm(v2)",
        rootNote: "G",
        fingers: [
          [5, 0, "G", true], // Открытая E
          [4, 10, "G"], // 2 лад - B (5)
          [3, 12, "D"], // 1 лад - G (♭7)
          [2, 12, "G"], // Открытая E
          [1, 11, "A#"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      "Gm7_v1": {
        name: "Gm7(v1)",
        description: "Gm7(v1)",
        chord: "Gm7(v1)",
        rootNote: "G",
        fingers: [
          [5, 3, "G"], // Открытая E
          [4, 0, "D", true], // 2 лад - B (5)
          [3, 3, "F"], // 1 лад - G (♭7)
          [2, 3, "A#"], // Открытая E
          [1, 3, "D"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      "Gm7_v2": {
        name: "Gm7(v2)",
        description: "Gm7(v2)",
        chord: "Gm7(v2)",
        rootNote: "G",
        fingers: [
          [5, 0, "G", true], // Открытая E
          [4, 10, "G"], // 2 лад - B (5)
          [3, 8, "A#"], // 1 лад - G (♭7)
          [2, 10, "F"], // Открытая E
          [1, 11, "A#"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      "Gm7b5_v1": {
        name: "Gm7b5(v1)",
        description: "Gm7b5(v1)",
        chord: "Gm7b5(v1)",
        rootNote: "G",
        fingers: [
          [5, 3, "G"], // Открытая E
          [4, 0, "G", true], // 2 лад - B (5)
          [3, 3, "F"], // 1 лад - G (♭7)
          [2, 3, "A#"], // Открытая E
          [1, 2, "C#"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      "Gm7b5_v2": {
        name: "Gm7b5(v2)",
        description: "Gm7b5(v2)",
        chord: "Gm7b5(v2)",
        rootNote: "G",
        fingers: [
          [5, 0, "G", true], // Открытая E
          [4, 10, "G"], // 2 лад - B (5)
          [3, 11, "C#"], // 1 лад - G (♭7)
          [2, 10, "F"], // Открытая E
          [1, 11, "A#"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      "Gdim7_v1": {
        name: "Gdim7(v1)",
        description: "Gdim7(v1)",
        chord: "Gdim7(v1)",
        rootNote: "G",
        fingers: [
          [5, 3, "G"], // Открытая E
          [4, 0, "G", true], // 2 лад - B (5)
          [3, 2, "A#"], // 1 лад - G (♭7)
          [2, 3, "F"], // Открытая E
          [1, 2, "A#"], // Открытая B
          [0, 0, "E", true], // Открытая E
        ],
        tip: "Простая форма - Django часто использовал в быстрых сменах",
      },

      "Gdim7_v2": {
        name: "Gdim7(v2)",
        description: "Gdim7(v2)",
        chord: "Gdim7(v2)",
        rootNote: "G",
        fingers: [
          [5, 3, "G"], // Открытая E
          [4, 4, "G"], // 2 лад - B (5)
          [3, 5, "A#"], // 1 лад - G (♭7)
          [2, 3, "F"], // Открытая E
          [1, 5, "A#"], // Открытая B
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
  
    // Получаем корневую ноту
    const rootNote = fingering.rootNote;
    
    // Очищаем гриф
    clearAllHighlights();
  
    fingering.fingers.forEach(([string, fret, note, isMuted = false]) => {
      if (fret < 0 || fret > 19) return;
  
      const fretElement = document.querySelector(
        `.fret[data-string="${string}"][data-fret="${fret}"]`
      );
  
      if (fretElement) {
        // Очищаем элемент
        fretElement.classList.remove(
          "django-fingering-note",
          "muted-string",
          "highlight",
          "fingering-root" // ДОБАВЬТЕ ЭТОТ КЛАСС
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
  
          // ПРОВЕРЯЕМ, ЯВЛЯЕТСЯ ЛИ НОТА КОРНЕВОЙ
          const originalNote = fretElement.getAttribute("data-note");
          const normalizedFretNote = this.theory ? 
            this.theory.normalizeToSharps(originalNote) : originalNote;
          
          // Проверяем, совпадает ли нота с корневой
          const isRoot = rootNote && normalizedFretNote && 
            this.theory.areNotesEqual(rootNote, normalizedFretNote);
          
          if (isRoot) {
            fretElement.classList.add("fingering-root"); // ДОБАВЛЯЕМ КЛАСС
          }
  
          // Для открытой струны (лад 0) показываем кружок
          if (fret === 0) {
            fretElement.textContent = "○";
            fretElement.style.color = "var(--zenburn-green)";
            fretElement.style.fontWeight = "bold";
            fretElement.style.fontSize = "16px";
          }
          // Для нажатых ладов показываем ноту
          else {
            fretElement.textContent = originalNote;
            fretElement.style.color = "white";
            fretElement.style.fontWeight = "bold";
            fretElement.style.backgroundColor = isRoot ? 
              "var(--zenburn-red)" : "var(--zenburn-orange)";
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

    let html = `
          <div style="margin-bottom: 8px;">
              <strong style="color: var(--zenburn-yellow);">${fingering.name || "Аппликатура Django"}</strong>
          </div>
          <div style="font-size: 10px; margin-bottom: 5px; color: var(--zenburn-fg-dim);">
              ${fingering.description || ""}
          </div>
          <div style="margin: 5px 0; padding: 5px; background: rgba(140, 208, 211, 0.1); border-radius: 3px;">
              <strong style="color: var(--zenburn-cyan);">Аккорд:</strong> ${fingering.chord || "Не указан"}
          </div>
          <div style="margin-top: 8px; padding: 8px; background: rgba(223, 175, 143, 0.1); border-radius: 3px;">
              <span style="color: var(--zenburn-orange);">💡 Характерно для Django:</span> 
              <em style="font-size: 10px;">${fingering.tip || "Используй большой палец для баса!"}</em>
          </div>
          <!-- УБИРАЕМ ЛЕГЕНДУ ПАЛЬЦЕВ - ОНА БОЛЬШЕ НЕ НУЖНА -->
      `;

    diagramDiv.innerHTML = html;
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


	// Инициализация менеджера подсказок
	  window.hintsManager = new window.HintsManager();
	  window.hintsManager.init();
	  
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

