// ============ АРПЕДЖИО ============
class ArpeggioManager {
  constructor() {
    // Используем musicTheory вместо guitarNeck для музыкальной теории
    this.theory = window.musicTheory;
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
    if (!this.theory) return [];

    const rootIndex = this.theory.notes.sharps.indexOf(
      this.theory.normalizeToSharps(root),
    );

    if (rootIndex === -1) return [];

    let notes = [];

    // Базовые ноты арпеджио
    if (type === "minor") {
      notes = [
        this.theory.notes.sharps[rootIndex], // 1
        this.theory.notes.sharps[(rootIndex + 3) % 12], // ♭3
        this.theory.notes.sharps[(rootIndex + 7) % 12], // 5
      ];
    } else {
      notes = [
        this.theory.notes.sharps[rootIndex], // 1
        this.theory.notes.sharps[(rootIndex + 4) % 12], // 3
        this.theory.notes.sharps[(rootIndex + 7) % 12], // 5
      ];
    }

    return notes;
  }

  addExtensions(notes, root, addSecond, addSixth, addSeventh) {
    if (!this.theory || !root) return notes;

    const rootIndex = this.theory.notes.sharps.indexOf(
      this.theory.normalizeToSharps(root),
    );

    if (rootIndex === -1) return notes;

    let extendedNotes = [...notes];

    if (addSecond) {
      extendedNotes.push(this.theory.notes.sharps[(rootIndex + 2) % 12]); // 2
    }

    if (addSixth) {
      extendedNotes.push(this.theory.notes.sharps[(rootIndex + 9) % 12]); // 6
    }

    if (addSeventh) {
      // Определяем тип септимы
      let seventhInterval = 11; // мажорная по умолчанию
      if (this.currentArpeggio && this.currentArpeggio.type === "minor") {
        seventhInterval = 10; // малая для минора
      }
      extendedNotes.push(
        this.theory.notes.sharps[(rootIndex + seventhInterval) % 12],
      ); // 7
    }

    return extendedNotes;
  }

  showArpeggio() {
    const chord = this.getActiveChord();
    if (!chord || !this.theory) return;

    const root = this.theory.extractTonic(chord); // Используем theory вместо neck
    const type = this.getArpeggioType(chord);
    const addSecond = document.getElementById("addSecond")?.checked || false;
    const addSixth = document.getElementById("addSixth")?.checked || false;
    const addSeventh = document.getElementById("addSeventh")?.checked || false;

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
    clearAllHighlights();

    if (!this.theory || !notes || notes.length === 0) return;

    const rootNote = notes[0];
    const thirdNote = notes[1];
    const fifthNote = notes[2];

    document.querySelectorAll(".fret").forEach((fret) => {
      const note = fret.getAttribute("data-note");
      if (!note) return;

      const normalizedNote = this.theory.normalizeToSharps(note);

      // Проверяем энгармоническое равенство
      const checkNote = (targetNote) =>
        this.theory.areNotesEqual(targetNote, normalizedNote);

      if (checkNote(rootNote)) {
        fret.classList.add("arpeggio-root");
      } else if (checkNote(thirdNote)) {
        fret.classList.add("arpeggio-third");
      } else if (checkNote(fifthNote)) {
        fret.classList.add("arpeggio-fifth");
      } else if (notes.some((n) => checkNote(n))) {
        const rootIndex = this.theory.notes.sharps.indexOf(
          this.theory.normalizeToSharps(root),
        );
        const noteIndex = this.theory.notes.sharps.indexOf(normalizedNote);
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
    const typeText = type === "minor" ? "min" : "";

    // Формируем схему
    let pattern = type === "minor" ? "1 - ♭3 - 5" : "1 - 3 - 5";
    const addSecond = document.getElementById("addSecond")?.checked || false;
    const addSixth = document.getElementById("addSixth")?.checked || false;
    const addSeventh = document.getElementById("addSeventh")?.checked || false;

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

    if (chordNotesDiv && chordNotesDiv.parentNode) {
      chordNotesDiv.parentNode.insertBefore(
        arpeggioInfoDiv,
        chordNotesDiv.nextSibling,
      );
    }
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

