// // js/musicTheory.js
// // Вся музыкальная логика через Tonal.js
//
// Инициализируем Tonal если еще нет
if (typeof window.Tonal === "undefined") {
  console.error("Tonal.js не загружен! Добавьте в index.html:");
  console.error(
    '<script src="https://unpkg.com/@tonaljs/tonal/browser/tonal.min.js"></script>',
  );
}

// Основной класс для всей музыкальной теории
class MusicTheory {
  // Используем глобальный Tonal
  constructor() {
    this.Tonal = window.Tonal;
    this.Note = this.Tonal.Note;
    this.Chord = this.Tonal.Chord;
    this.Scale = this.Tonal.Scale;
    this.Interval = this.Tonal.Interval;
    this.Key = this.Tonal.Key;

    // ВАЖНО: Добавляем массив нот для совместимости с твоим кодом
    this.notes = [
      "C",
      "C#",
      "D",
      "D#",
      "E",
      "F",
      "F#",
      "G",
      "G#",
      "A",
      "A#",
      "B",
    ];

    // Для обратной совместимости с твоим старым кодом
    this.notes.sharps = this.notes;
    this.notes.flats = [
      "C",
      "Db",
      "D",
      "Eb",
      "E",
      "F",
      "Gb",
      "G",
      "Ab",
      "A",
      "Bb",
      "B",
    ];

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

    console.log("MusicTheory создан, notes:", this.notes);

    // Стандартный гитарный строй
    this.STANDARD_TUNING = ["E2", "A2", "D3", "G3", "B3", "E4"];
    this.STRING_NAMES = ["E", "B", "G", "D", "A", "E"];

    // Маппинг ваших названий гамм на Tonal
    this.SCALE_MAPPING = {
      // Ваши названия -> Tonal названия
      gypsyMajor: "harmonic minor",
      harmonicMajor: "harmonic major",
      harmonicMinor: "harmonic minor",
      harmonicMinorNat6: "melodic minor", // близкая замена
      dorianSharp4: "dorian #4",
      diminished: "diminished",
      doubleChromatic: "chromatic",
      mixolydianFlat6: "mixolydian b6",
      altered: "altered",
      bebopDominant: "bebop dominant",
    };

    // Кэши для производительности
    this._chordCache = new Map();
    this._scaleCache = new Map();
    this._noteCache = new Map();
  }

  // ============ ОСНОВНЫЕ МЕТОДЫ ============

  // В MusicTheory классе:
  normalizeToSharps(note) {
    if (!note) return "";

    // Если note уже является классом тона (без октавы), возвращаем как есть
    const cleanNote = note.replace(/[0-9]/g, "").trim();

    if (cleanNote === "") return "";

    // Таблица конвертации бемолей в диезы
    const conversionTable = {
      Db: "C#",
      Eb: "D#",
      Gb: "F#",
      Ab: "G#",
      Bb: "A#",
      // Для двойных бемолей (редко, но на всякий случай)
      Cbb: "Bb",
      Dbb: "C",
      Ebb: "D",
      Fbb: "Eb",
      Gbb: "F",
      Abb: "G",
      Bbb: "A",
    };

    // Проверяем, нужно ли конвертировать
    if (conversionTable[cleanNote]) {
      return conversionTable[cleanNote];
    }

    // Если нота уже в диезах или нет в таблице, возвращаем как есть
    return cleanNote;
  }

  getChordNotes(chordSymbol) {
    if (!chordSymbol || chordSymbol.trim() === "") return [];

    const cacheKey = `chord:${chordSymbol}`;
    if (this._chordCache.has(cacheKey)) {
      return this._chordCache.get(cacheKey);
    }

    try {
      const chord = this.Chord.get(chordSymbol);
      if (chord.empty) {
        console.warn(`Аккорд "${chordSymbol}" не распознан`);
        return [];
      }

      const notes = chord.notes.map((note) => this.Note.pitchClass(note));
      this._chordCache.set(cacheKey, notes);
      return notes;
    } catch (error) {
      console.error(`Ошибка при разборе аккорда "${chordSymbol}":`, error);
      return [];
    }
  }

  /**
   * Получить интервальную формулу аккорда
   * @param {string} chordSymbol
   * @returns {string} например "1 3 5 b7" для "C7"
   */
  getChordFormula(chordSymbol) {
    try {
      const chord = this.Chord.get(chordSymbol);
      if (chord.empty) return "";

      // Конвертируем интервалы в читаемый вид
      const intervalMap = {
        "1P": "1",
        "2m": "b2",
        "2M": "2",
        "2A": "#2",
        "3m": "b3",
        "3M": "3",
        "4P": "4",
        "4A": "#4",
        "5d": "b5",
        "5P": "5",
        "5A": "#5",
        "6m": "b6",
        "6M": "6",
        "7m": "b7",
        "7M": "7",
        "8P": "8",
      };

      return chord.intervals.map((int) => intervalMap[int] || int).join(" ");
    } catch (error) {
      return "";
    }
  }

  /**
   * Извлечь тонику из аккорда
   * @param {string} chordSymbol
   * @returns {string} например "C" для "Cm7#11"
   */
  extractTonic(chordSymbol) {
    try {
      const chord = this.Chord.get(chordSymbol);
      return chord.tonic || "";
    } catch (error) {
      // Fallback: берем первую букву
      const match = chordSymbol.match(/^[A-G][#b]?/);
      return match ? match[0] : "";
    }
  }

  /**
   * Получить тип аккорда
   * @param {string} chordSymbol
   * @returns {object} {quality, type, aliases}
   */
  getChordType(chordSymbol) {
    try {
      const chord = this.Chord.get(chordSymbol);
      return {
        quality: chord.quality,
        type: chord.type,
        aliases: chord.aliases,
        symbol: chord.symbol,
        name: this.getChordName(chordSymbol),
      };
    } catch (error) {
      return { quality: "Unknown", type: "", aliases: [] };
    }
  }

  /**
   * Человеко-читаемое название аккорда
   */
  getChordName(chordSymbol) {
    const chord = this.Chord.get(chordSymbol);
    if (chord.empty) return chordSymbol;

    const tonic = chord.tonic;
    const type = chord.aliases[0] || chord.type;

    const typeNames = {
      major: "",
      minor: "m",
      dominant: "7",
      diminished: "dim",
      augmented: "aug",
      sus4: "sus4",
      sus2: "sus2",
      maj7: "maj7",
      m7: "m7",
      7: "7",
      m7b5: "m7b5",
      dim7: "dim7",
      aug7: "aug7",
    };

    return tonic + (typeNames[type] || type);
  }

  // ============ ГАММЫ ============

  /**
   * Получить ноты гаммы
   * @param {string} tonic - тоника "C"
   * @param {string} scaleName - название гаммы
   * @returns {string[]} массив нот
   */
  getScaleNotes(tonic, scaleName) {
    if (!tonic || !scaleName) return [];

    const cacheKey = `scale:${tonic}:${scaleName}`;
    if (this._scaleCache.has(cacheKey)) {
      return this._scaleCache.get(cacheKey);
    }

    try {
      // Конвертируем наши названия в Tonal
      const tonalScaleName = this.SCALE_MAPPING[scaleName] || scaleName;
      const scale = this.Scale.get(`${tonic} ${tonalScaleName}`);

      if (scale.empty) {
        console.warn(`Гамма "${scaleName}" не найдена для тоники "${tonic}"`);
        return [];
      }

      const notes = scale.notes.map((note) => this.Note.pitchClass(note));
      this._scaleCache.set(cacheKey, notes);
      return notes;
    } catch (error) {
      console.error(`Ошибка при получении гаммы ${tonic} ${scaleName}:`, error);
      return [];
    }
  }

  /**
   * Автоматически определить гамму для аккорда (Django-стиль)
   * @param {string} chordSymbol
   * @returns {string} название гаммы
   */
  detectScaleForChord(chordSymbol) {
    const chord = this.Chord.get(chordSymbol);
    if (chord.empty) return "chromatic";

    const tonic = chord.tonic;
    const quality = chord.quality;
    const intervals = chord.intervals;

    // Django-specific логика
    if (chordSymbol.includes("dim7")) {
      return "diminished";
    }

    if (chordSymbol.includes("m6")) {
      return "dorianSharp4";
    }

    if (chordSymbol.includes("7#9") || chordSymbol.includes("7alt")) {
      return "altered";
    }

    if (chordSymbol.includes("7b9")) {
      return "mixolydianFlat6";
    }

    if (quality === "Major") {
      if (chordSymbol.includes("6") || chordSymbol.includes("maj7")) {
        return "harmonicMajor";
      }
      return "gypsyMajor";
    }

    if (quality === "Minor") {
      if (intervals.includes("7M")) {
        return "harmonicMinorNat6";
      }
      return "harmonicMinor";
    }

    if (quality === "Dominant") {
      return "diminished"; // Django часто использует diminished над V7
    }

    return "chromatic";
  }

  /**
   * Получить все варианты гамм для аккорда
   */
  getPossibleScalesForChord(chordSymbol) {
    const chord = this.Chord.get(chordSymbol);
    const tonic = chord.tonic;

    const scales = [];

    if (chord.quality === "Minor") {
      scales.push(
        { name: "harmonicMinor", display: "Harmonic Minor" },
        { name: "harmonicMinorNat6", display: "Minor ♮6 (Django)" },
        { name: "dorianSharp4", display: "Dorian ♯4" },
        { name: "gypsyMajor", display: "Gypsy Major" },
      );
    } else if (chord.quality === "Major") {
      scales.push(
        { name: "harmonicMajor", display: "Harmonic Major" },
        { name: "gypsyMajor", display: "Gypsy Major" },
        { name: "mixolydianFlat6", display: "Mixolydian ♭6" },
      );
    } else if (chord.quality === "Dominant") {
      scales.push(
        { name: "diminished", display: "Diminished" },
        { name: "altered", display: "Altered" },
        { name: "mixolydianFlat6", display: "Mixolydian ♭6" },
      );
    }

    return scales;
  }

  // ============ ПЕНТАТОНИКА ============

  /**
   * Получить ноты пентатоники через Tonal.js
   */
  getPentatonicNotes(tonic, type = "minor") {
    try {
      // Tonal.js использует разные названия для пентатоник
      const scaleName =
        type === "minor" ? "minor pentatonic" : "major pentatonic";
      const scale = this.Scale.get(`${tonic} ${scaleName}`);

      if (scale.empty) {
        console.warn(
          `Пентатоника "${scaleName}" не найдена для тоники "${tonic}"`,
        );
        return [];
      }

      // Возвращаем ноты без октав
      return scale.notes.map((note) => this.Note.pitchClass(note));
    } catch (error) {
      console.error(
        `Ошибка при получении пентатоники ${tonic} ${type}:`,
        error,
      );
      return [];
    }
  }

  /**
   * Получить блюзовую ноту (♭5) через Tonal.js
   */
  getBluesNote(tonic) {
    try {
      // 5d = diminished 5th = b5 (блюзовая нота)
      const bluesNote = this.Note.transpose(tonic, "5d");
      return this.Note.pitchClass(bluesNote);
    } catch (error) {
      console.error(`Ошибка при получении блюзовой ноты для ${tonic}:`, error);
      return "";
    }
  }

  /**
   * Получить блюзовую гамму (пентатоника + b5)
   */
  getBluesScale(tonic) {
    const pentatonic = this.getPentatonicNotes(tonic, "minor");
    if (pentatonic.length === 0) return [];

    // Добавляем блюзовую ноту (b5)
    const tonicNote = this.Note.get(tonic);
    const bluesNote = this.Note.transpose(tonicNote.name, "5d"); // diminished 5th

    const bluesScale = [...pentatonic];
    // Вставляем b5 между 4 и 5 ступенями
    bluesScale.splice(3, 0, this.Note.pitchClass(bluesNote));

    return bluesScale;
  }

  // ============ ГРИФ ============

  /**
   * Генерация нот на грифе для заданного строя
   */
  generateFretboardNotes(tuning = null, frets = 19) {
    const actualTuning = tuning || this.STANDARD_TUNING;
    const fretboard = [];

    for (let string = 0; string < actualTuning.length; string++) {
      const openNote = actualTuning[string];
      const stringNotes = [];

      for (let fret = 0; fret <= frets; fret++) {
        const note = this.Note.transpose(
          openNote,
          this.Interval.fromSemitones(fret),
        );
        stringNotes.push({
          fullName: note,
          name: this.Note.pitchClass(note),
          octave: this.Note.octave(note),
          string: string,
          fret: fret,
        });
      }

      fretboard.push(stringNotes);
    }

    return fretboard;
  }

  /**
   * Найти все позиции ноты на грифе
   */
  findNoteOnFretboard(noteName, tuning = null, maxFret = 19) {
    const fretboard = this.generateFretboardNotes(tuning, maxFret);
    const positions = [];

    for (let string = 0; string < fretboard.length; string++) {
      for (let fret = 0; fret <= maxFret; fret++) {
        const note = fretboard[string][fret];
        if (
          this.Note.pitchClass(note.fullName) === this.Note.pitchClass(noteName)
        ) {
          positions.push({
            string: string,
            fret: fret,
            note: note.name,
            fullName: note.fullName,
          });
        }
      }
    }

    return positions;
  }

  // ============ DJANGO-SPECIFIC ============

  /**
   * Характерные аккорды джаз-мануш для тоники
   */
  getJazzManoucheChords(tonic) {
    const rootIndex = this.Note.get(tonic).chroma;

    const chords = [
      `${tonic}6`, // Мажорный секстаккорд
      `${tonic}9`, // Мажорный нонаккорд
      `${this.getNoteByInterval(tonic, "5P")}7#9`, // Доминант с #9
      `${this.getNoteByInterval(tonic, "7m")}m6`, // Минорный секстаккорд
      `${this.getNoteByInterval(tonic, "10m")}7b9`, // Доминант с b9
      `${tonic}dim7`, // Уменьшенный
    ];

    return chords.filter((chord) => {
      const c = this.Chord.get(chord);
      return !c.empty;
    });
  }

  /**
   * Получить ноту по интервалу от тоники
   */
  getNoteByInterval(tonic, interval) {
    try {
      const note = this.Note.transpose(tonic, interval);
      return this.Note.pitchClass(note);
    } catch (error) {
      return tonic;
    }
  }

  /**
   * Транспонировать аккорд или гамму
   */
  transpose(item, interval) {
    if (Array.isArray(item)) {
      // Транспонируем массив нот
      return item.map((note) => {
        const transposed = this.Note.transpose(note, interval);
        return this.Note.pitchClass(transposed);
      });
    } else {
      // Транспонируем аккорд
      const chord = this.Chord.get(item);
      if (chord.empty) return item;

      const newTonic = this.Note.transpose(chord.tonic, interval);
      return item.replace(chord.tonic, this.Note.pitchClass(newTonic));
    }
  }

  /**
   * Сравнить два аккорда/ноты (энгармонически)
   */
  areNotesEqual(note1, note2) {
    return this.Note.enharmonic(note1, note2);
  }

  // ============ УТИЛИТЫ ============

  /**
   * Очистить кэш (полезно при смене строя)
   */
  clearCache() {
    this._chordCache.clear();
    this._scaleCache.clear();
    this._noteCache.clear();
  }

  /**
   * Проверить, валиден ли аккорд
   */
  isValidChord(chordSymbol) {
    if (!chordSymbol) return false;
    const chord = this.Chord.get(chordSymbol);
    return !chord.empty;
  }

  /**
   * Получить все возможные аккорды для набора нот
   */
  findChordsFromNotes(notes) {
    return this.Chord.detect(notes);
  }

  /**
   * Романские цифры для прогрессии
   */
  getRomanNumeral(chordSymbol, key = "C") {
    try {
      const chord = this.Chord.get(chordSymbol);
      const keyObj = this.Key.majorKey(key);

      // Простая реализация - для полной нужно использовать Chord.romanNumeral
      return chord.tonic + chord.aliases[0];
    } catch (error) {
      return chordSymbol;
    }
  }
}

// Создаем глобальный экземпляр для использования
window.musicTheory = new MusicTheory();

// Экспорт для модулей (если используем ES6)
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MusicTheory };
}
