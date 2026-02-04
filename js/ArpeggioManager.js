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
    chord = chord.toLowerCase();
    if (chord.includes('maj7') || chord.includes('maj9') || chord.includes('maj13')) {
      return 'majorΔ7'; // мажор с большой септимой
    } else if (chord.includes('m7') || chord.includes('m9') || chord.includes('m11') || chord.includes('m13')) {
      return 'minor7'; // минор с малой септимой
    } else if (chord.includes('m') && (chord.includes('Δ7') || chord.includes('maj7'))) {
      return 'minorΔ7'; // минор с большой септимой
    } else if (chord.includes('dim') || chord.includes('°')) {
      return chord.includes('7') ? 'dim7' : 'dim';
    } else if (chord.includes('aug') || chord.includes('+')) {
      return 'aug';
    } else if (chord.includes('m')) {
      return 'minor';
    } else if (chord.includes('7') || chord.includes('9') || chord.includes('13')) {
      return 'dominant'; // доминантовый
    }
    return 'major';
  }
  
  getArpeggioNotes(root, type = "major") {
    if (!this.theory) return [];
  
    const rootIndex = this.theory.notes.sharps.indexOf(
      this.theory.normalizeToSharps(root),
    );
  
    if (rootIndex === -1) return [];
  
    let notes = [];
  
    switch(type) {
      case 'minor':
        // 1, b3, 5
        notes = [
          this.theory.notes.sharps[rootIndex],
          this.theory.notes.sharps[(rootIndex + 3) % 12],
          this.theory.notes.sharps[(rootIndex + 7) % 12],
        ];
        break;
      case 'minor7':
        // 1, b3, 5, b7
        notes = [
          this.theory.notes.sharps[rootIndex],
          this.theory.notes.sharps[(rootIndex + 3) % 12],
          this.theory.notes.sharps[(rootIndex + 7) % 12],
          this.theory.notes.sharps[(rootIndex + 10) % 12], // b7
        ];
        break;
      case 'minorΔ7':
        // 1, b3, 5, 7
        notes = [
          this.theory.notes.sharps[rootIndex],
          this.theory.notes.sharps[(rootIndex + 3) % 12],
          this.theory.notes.sharps[(rootIndex + 7) % 12],
          this.theory.notes.sharps[(rootIndex + 11) % 12], // 7
        ];
        break;
      case 'majorΔ7':
        // 1, 3, 5, 7
        notes = [
          this.theory.notes.sharps[rootIndex],
          this.theory.notes.sharps[(rootIndex + 4) % 12],
          this.theory.notes.sharps[(rootIndex + 7) % 12],
          this.theory.notes.sharps[(rootIndex + 11) % 12], // 7
        ];
        break;
      case 'dominant':
        // 1, 3, 5, b7
        notes = [
          this.theory.notes.sharps[rootIndex],
          this.theory.notes.sharps[(rootIndex + 4) % 12],
          this.theory.notes.sharps[(rootIndex + 7) % 12],
          this.theory.notes.sharps[(rootIndex + 10) % 12], // b7
        ];
        break;
      case 'dim':
        // 1, b3, b5
        notes = [
          this.theory.notes.sharps[rootIndex],
          this.theory.notes.sharps[(rootIndex + 3) % 12],
          this.theory.notes.sharps[(rootIndex + 6) % 12], // b5
        ];
        break;
      case 'dim7':
        // 1, b3, b5, bb7 (6)
        notes = [
          this.theory.notes.sharps[rootIndex],
          this.theory.notes.sharps[(rootIndex + 3) % 12],
          this.theory.notes.sharps[(rootIndex + 6) % 12],
          this.theory.notes.sharps[(rootIndex + 9) % 12], // bb7
        ];
        break;
      case 'aug':
        // 1, 3, #5
        notes = [
          this.theory.notes.sharps[rootIndex],
          this.theory.notes.sharps[(rootIndex + 4) % 12],
          this.theory.notes.sharps[(rootIndex + 8) % 12], // #5
        ];
        break;
      default: // major
        // 1, 3, 5
        notes = [
          this.theory.notes.sharps[rootIndex],
          this.theory.notes.sharps[(rootIndex + 4) % 12],
          this.theory.notes.sharps[(rootIndex + 7) % 12],
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
  
    // Если 7 уже есть в базовом наборе (например, в minor7), не добавляем повторно
    const hasSeventhAlready = this.currentArpeggio?.type?.includes('7') || 
                             this.currentArpeggio?.type?.includes('Δ7');
  
    if (addSecond) {
      extendedNotes.push(this.theory.notes.sharps[(rootIndex + 2) % 12]); // 2
    }
  
    if (addSixth) {
      extendedNotes.push(this.theory.notes.sharps[(rootIndex + 9) % 12]); // 6
    }
  
    if (addSeventh && !hasSeventhAlready) {
      // Определяем тип септимы по типу аккорда
      let seventhInterval = 11; // по умолчанию большая (7)
      
      const type = this.currentArpeggio?.type;
      if (type === 'minor7' || type === 'dominant') {
        seventhInterval = 10; // малая септима (b7)
      } else if (type === 'dim7') {
        seventhInterval = 9; // дважды уменьшенная (bb7)
      }
      // Для major, minor, minorΔ7, majorΔ7, aug, dim - оставляем по умолчанию
      
      extendedNotes.push(
        this.theory.notes.sharps[(rootIndex + seventhInterval) % 12],
      );
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

window.ArpeggioManager = ArpeggioManager;
