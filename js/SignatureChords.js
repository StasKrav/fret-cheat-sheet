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

window.SignatureChords = SignatureChords;
