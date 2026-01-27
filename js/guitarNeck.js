// js/guitarNeck.js
// Отвечает ТОЛЬКО за гриф и ноты на нем

class GuitarNeck {
  constructor() {
    this.Tonal = window.Tonal;

    // Строй как в старой системе: 0 = 1-я струна (E4)
    this.tuning = ["E4", "B3", "G3", "D3", "A2", "E2"];
    this.stringNames = ["e", "B", "G", "D", "A", "E"];
    this.frets = 19;
    this.noteCache = new Map();
  }

  /**
   * Получить ноту на конкретной струне и ладу
   */
  getNote(string, fret) {
    const cacheKey = `${string}-${fret}`;
    if (this.noteCache.has(cacheKey)) {
      return this.noteCache.get(cacheKey);
    }

    const openNote = this.tuning[string];
    const semitones = this.Tonal.Interval.fromSemitones(fret);
    const note = this.Tonal.Note.transpose(openNote, semitones);

    this.noteCache.set(cacheKey, note);
    return note;
  }

  /**
   * Получить только имя ноты (без октавы)
   */
  getBaseNote(string, fret) {
    const fullNote = this.getNote(string, fret);
    return this.Tonal.Note.pitchClass(fullNote);
  }

  /**
   * Получить октаву ноты
   */
  getOctave(string, fret) {
    const fullNote = this.getNote(string, fret);
    return this.Tonal.Note.octave(fullNote);
  }

  /**
   * Изменить строй гитары
   */
  setTuning(tuning) {
    if (Array.isArray(tuning) && tuning.length === 6) {
      this.tuning = tuning;
      this.noteCache.clear(); // Очищаем кэш
      console.log("Строй изменен на:", tuning);
    }
  }

  /**
   * Получить текущий строй
   */
  getTuning() {
    return [...this.tuning];
  }

  /**
   * Получить ноту открытой струны
   */
  getOpenStringNote(string) {
    return this.tuning[string];
  }

  /**
   * Получить имя открытой струны (без октавы)
   */
  getOpenStringName(string) {
    return this.Tonal.Note.pitchClass(this.tuning[string]);
  }

  /**
   * Сгенерировать данные для отрисовки грифа
   */
  generateFretboardData() {
    const fretboard = [];

    for (let string = 0; string < 6; string++) {
      const stringNotes = [];

      for (let fret = 0; fret <= this.frets; fret++) {
        const fullNote = this.getNote(string, fret);
        const baseNote = this.getBaseNote(string, fret);
        const octave = this.getOctave(string, fret);

        stringNotes.push({
          string: string,
          fret: fret,
          fullName: fullNote,
          name: baseNote,
          octave: octave,
          isNut: fret === 0,
        });
      }

      fretboard.push(stringNotes);
    }

    return fretboard;
  }

  /**
   * Найти все позиции ноты на грифе
   */
  findNotePositions(noteName, maxFret = null) {
    const positions = [];
    const maxF = maxFret || this.frets;

    for (let string = 0; string < 6; string++) {
      for (let fret = 0; fret <= maxF; fret++) {
        const note = this.getBaseNote(string, fret);
        if (this.Tonal.Note.enharmonic(note, noteName)) {
          positions.push({
            string: string,
            fret: fret,
            note: note,
            fullName: this.getNote(string, fret),
          });
        }
      }
    }

    return positions;
  }

  /**
   * Найти позиции аккорда на грифе
   */
  findChordPositions(chordNotes, maxFret = 12, minFret = 0) {
    const positions = [];

    // Для каждой ноты аккорда находим позиции
    chordNotes.forEach((chordNote, index) => {
      const notePositions = this.findNotePositions(chordNote).filter(
        (pos) => pos.fret >= minFret && pos.fret <= maxFret,
      );

      positions.push({
        chordNote: chordNote,
        positions: notePositions,
        isRoot: index === 0, // Первая нота - корень
      });
    });

    return positions;
  }

  /**
   * Очистить кэш (полезно при изменении строя)
   */
  clearCache() {
    this.noteCache.clear();
  }
}

// Создаем глобальный экземпляр
window.guitarNeck = new GuitarNeck();
