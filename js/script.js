// ============ ОСНОВНОЙ КОД (ОСТАВЛЯЕМ БЕЗ ИЗМЕНЕНИЙ) ============
class GuitarNeck {
    constructor() {
        this.tuning = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];
        this.notes = {
            sharps: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
            flats: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
        };
        this.equivalents = {
            'C#': 'Db', 'Db': 'C#',
            'D#': 'Eb', 'Eb': 'D#',
            'F#': 'Gb', 'Gb': 'F#',
            'G#': 'Ab', 'Ab': 'G#',
            'A#': 'Bb', 'Bb': 'A#'
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
        return fullNote.replace(/[0-9]/g, '');
    }

    getChordRoot(chord) {
        const match = chord.match(/^[A-G][#♯b♭]?/);
        if (!match) return chord.charAt(0);
        let root = match[0];
        root = root.replace('♯', '#').replace('♭', 'b');
        return this.normalizeToSharps(root);
    }

    extractTonic(chord) {
        return this.getChordRoot(chord);
    }

    getChordNotes(chord) {
        const root = this.getChordRoot(chord);
        const rootIndex = this.notes.sharps.indexOf(root);
        if (rootIndex === -1) return [root];

        if (chord.includes('maj7')) {
            return [
                root,
                this.notes.sharps[(rootIndex + 4) % 12],
                this.notes.sharps[(rootIndex + 7) % 12],
                this.notes.sharps[(rootIndex + 11) % 12]
            ];
        } else if (chord.includes('m7')) {
            return [
                root,
                this.notes.sharps[(rootIndex + 3) % 12],
                this.notes.sharps[(rootIndex + 7) % 12],
                this.notes.sharps[(rootIndex + 10) % 12]
            ];
        } else if (chord.includes('7')) {
            return [
                root,
                this.notes.sharps[(rootIndex + 4) % 12],
                this.notes.sharps[(rootIndex + 7) % 12],
                this.notes.sharps[(rootIndex + 10) % 12]
            ];
        } else if (chord.includes('6')) {
            return [
                root,
                this.notes.sharps[(rootIndex + 4) % 12],
                this.notes.sharps[(rootIndex + 7) % 12],
                this.notes.sharps[(rootIndex + 9) % 12]
            ];
        } else if (chord.includes('9')) {
            return [
                root,
                this.notes.sharps[(rootIndex + 4) % 12],
                this.notes.sharps[(rootIndex + 7) % 12],
                this.notes.sharps[(rootIndex + 10) % 12],
                this.notes.sharps[(rootIndex + 14) % 12]
            ];
        } else if (chord.includes('dim7')) {
            return [
                root,
                this.notes.sharps[(rootIndex + 3) % 12],
                this.notes.sharps[(rootIndex + 6) % 12],
                this.notes.sharps[(this.rootIndex + 9) % 12]
            ];
        } else if (chord.includes('m')) {
            return [
                root,
                this.notes.sharps[(rootIndex + 3) % 12],
                this.notes.sharps[(rootIndex + 7) % 12]
            ];
        } else {
            return [
                root,
                this.notes.sharps[(rootIndex + 4) % 12],
                this.notes.sharps[(rootIndex + 7) % 12]
            ];
        }
    }

    getJazzManoucheChords(tonic) {
        const normalizedTonic = this.normalizeToSharps(tonic);
        const rootIndex = this.notes.sharps.indexOf(normalizedTonic);
        return {
            progression: [
                `${tonic}6`,
                `${tonic}7`,
                `${this.notes.sharps[(rootIndex + 5) % 12]}7`,
                `${this.notes.sharps[(rootIndex + 7) % 12]}6`,
                `${this.notes.sharps[(rootIndex + 10) % 12]}7`,
                `${this.notes.sharps[(rootIndex + 2) % 12]}7`,
                `${tonic}6`
            ],
            characteristic: [
                `${tonic}6`,
                `${tonic}9`,
                `${this.notes.sharps[(rootIndex + 5) % 12]}7#9`,
                `${this.notes.sharps[(rootIndex + 7) % 12]}m6`,
                `${this.notes.sharps[(rootIndex + 10) % 12]}7b9`,
                `${tonic}dim7`
            ]
        };
    }

    getBluesChords(tonic) {
        const normalizedTonic = this.normalizeToSharps(tonic);
        const rootIndex = this.notes.sharps.indexOf(normalizedTonic);
        return {
            progression: [
                `${tonic}7`,
                `${this.notes.sharps[(rootIndex + 5) % 12]}7`,
                `${this.notes.sharps[(rootIndex + 7) % 12]}7`,
                `${tonic}7`
            ],
            characteristic: [
                `${tonic}7`,
                `${tonic}9`,
                `${this.notes.sharps[(rootIndex + 5) % 12]}7`,
                `${this.notes.sharps[(rootIndex + 7) % 12]}7`
            ]
        };
    }

    getBossaNovaChords(tonic) {
        const normalizedTonic = this.normalizeToSharps(tonic);
        const rootIndex = this.notes.sharps.indexOf(normalizedTonic);
        return {
            progression: [
                `${tonic}maj7`,
                `${this.notes.sharps[(rootIndex + 7) % 12]}7`,
                `${this.notes.sharps[(rootIndex + 5) % 12]}7`,
                `${this.notes.sharps[(rootIndex + 10) % 12]}m7`,
                `${this.notes.sharps[(rootIndex + 3) % 12]}7`,
                `${tonic}maj7`
            ],
            characteristic: [
                `${tonic}maj7`,
                `${tonic}6`,
                `${this.notes.sharps[(rootIndex + 7) % 12]}9`,
                `${this.notes.sharps[(rootIndex + 5) % 12]}m7`,
                `${this.notes.sharps[(rootIndex + 10) % 12]}m9`
            ]
        };
    }
}

// ============ РЕНДЕРИНГ ГРИФА (БЕЗ ИЗМЕНЕНИЙ) ============
function renderFretBoard() {
    const neck = new GuitarNeck();
    const fretBoard = document.getElementById('fretBoard');
    const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
    
    let html = '<div class="fret-numbers"><span></span>';
    for (let fret = 0; fret <= 12; fret++) {
        html += fret === 0 ? '<span></span>' : `<span>${fret}</span>`;
    }
    html += '</div>';
    
    for (let string = 0; string < 6; string++) {
        html += `<div class="string"><div class="string-name">${stringNames[string]}</div>`;
        for (let fret = 0; fret <= 12; fret++) {
            const note = neck.getBaseNote(string, fret);
            const fullNote = neck.getNote(string, fret);
            const isNut = fret === 0;
            html += `<div class="fret ${isNut ? 'nut' : ''}" 
                        data-string="${string}" 
                        data-fret="${fret}"
                        data-note="${note}"
                        data-full="${fullNote}">`;
            html += !isNut ? note : '○';
            html += `</div>`;
        }
        html += `</div>`;
    }
    
    fretBoard.innerHTML = html;
}

// ============ АККОРДЫ (ОСТАВЛЯЕМ КАК БЫЛО) ============
function highlightChordNotes(chord) {
    const neck = new GuitarNeck();
    const chordNotes = neck.getChordNotes(chord);
    
    // Очищаем ТОЛЬКО подсветку аккордов
    document.querySelectorAll('.fret').forEach(fret => {
        fret.classList.remove('highlight');
    });
    
    // Подсвечиваем ноты аккорда
    document.querySelectorAll('.fret').forEach(fret => {
        const note = fret.getAttribute('data-note');
        const normalizedNote = neck.normalizeToSharps(note);
        if (chordNotes.includes(normalizedNote)) {
            fret.classList.add('highlight');
        }
    });
    
    // Показываем информацию об аккорде
    document.getElementById('chordNotes').textContent = 
        `Ноты аккорда ${chord}: ${chordNotes.join(', ')}`;
    
    // Очищаем информацию об арпеджио
    hideArpeggioInfo();
}

function showStyleChords(style, tonic) {
    const neck = new GuitarNeck();
    const normalizedTonic = neck.extractTonic(tonic);
    
    let chords, description, styleName;
    
    switch(style) {
        case 'jazz-manouche':
            chords = neck.getJazzManoucheChords(normalizedTonic);
            description = "Характерные аккорды джаз-мануш (цыганского джаза):";
            styleName = "Джаз-мануш";
            break;
        case 'blues':
            chords = neck.getBluesChords(normalizedTonic);
            description = "Типичная блюзовая прогрессия:";
            styleName = "Блюз";
            break;
        case 'bossa':
            chords = neck.getBossaNovaChords(normalizedTonic);
            description = "Аккорды в стиле босса-нова:";
            styleName = "Босса-нова";
            break;
    }
    
    document.getElementById('styleInfo').textContent = `${styleName} в тональности ${tonic}`;
    
    const sequenceDiv = document.getElementById('chordSequence');
    sequenceDiv.style.display = 'block';
    
    let progressionHTML = chords.progression.map(chord => 
        `<span class="chord-link" data-chord="${chord}">${chord}</span>`
    ).join(' → ');
    
    let characteristicHTML = chords.characteristic.map(chord => 
        `<span class="chord-link" data-chord="${chord}">${chord}</span>`
    ).join(', ');
    
    sequenceDiv.innerHTML = `
        <strong>${description}</strong><br>
        <strong>Прогрессия:</strong> ${progressionHTML}<br>
        <strong>Характерные аккорды:</strong> ${characteristicHTML}
        <br><br>
        <em>Кликните на любой аккорд для просмотра на грифе</em>
    `;
    
    sequenceDiv.querySelectorAll('.chord-link').forEach(link => {
        link.addEventListener('click', function() {
            const chord = this.getAttribute('data-chord');
            document.getElementById('chordInput').value = chord;
            highlightChordNotes(chord);
            
            sequenceDiv.querySelectorAll('.chord-link').forEach(l => {
                l.style.background = '';
            });
            this.style.background = 'rgba(143, 178, 143, 0.3)';
        });
    });
    
    // Очищаем арпеджио
    clearArpeggio();
}

// ============ АРПЕДЖИО (НОВАЯ ПРАВИЛЬНАЯ РЕАЛИЗАЦИЯ) ============
class ArpeggioManager {
    constructor() {
        this.neck = new GuitarNeck();
        this.currentArpeggio = null;
    }
    
    getArpeggioType(chord) {
        // Определяем тип арпеджио по аккорду
        if (chord.includes('m')) {
            return 'minor';
        }
        return 'major'; // по умолчанию мажорное
    }
    
    getArpeggioNotes(root, type = 'major') {
        const rootIndex = this.neck.notes.sharps.indexOf(
            this.neck.normalizeToSharps(root)
        );
        
        let notes = [];
        
        // Базовые ноты арпеджио
        if (type === 'minor') {
            notes = [
                this.neck.notes.sharps[rootIndex],           // 1
                this.neck.notes.sharps[(rootIndex + 3) % 12], // ♭3
                this.neck.notes.sharps[(rootIndex + 7) % 12]  // 5
            ];
        } else {
            notes = [
                this.neck.notes.sharps[rootIndex],           // 1
                this.neck.notes.sharps[(rootIndex + 4) % 12], // 3
                this.neck.notes.sharps[(rootIndex + 7) % 12]  // 5
            ];
        }
        
        return notes;
    }
    
    addExtensions(notes, root, addSecond, addSixth, addSeventh) {
        const rootIndex = this.neck.notes.sharps.indexOf(
            this.neck.normalizeToSharps(root)
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
            if (this.currentArpeggio && this.currentArpeggio.type === 'minor') {
                seventhInterval = 10; // малая для минора
            }
            extendedNotes.push(this.neck.notes.sharps[(rootIndex + seventhInterval) % 12]); // 7
        }
        
        return extendedNotes;
    }
    
    showArpeggio(chord) {
        if (!chord) return;
        
        const root = this.neck.extractTonic(chord);
        const type = this.getArpeggioType(chord);
        
        // Получаем настройки расширений
        const addSecond = document.getElementById('addSecond').checked;
        const addSixth = document.getElementById('addSixth').checked;
        const addSeventh = document.getElementById('addSeventh').checked;
        
        // Получаем ноты
        const baseNotes = this.getArpeggioNotes(root, type);
        const extendedNotes = this.addExtensions(baseNotes, root, addSecond, addSixth, addSeventh);
        
        // Сохраняем текущее арпеджио
        this.currentArpeggio = {
            root: root,
            type: type,
            notes: extendedNotes,
            baseNotes: baseNotes
        };
        
        // Визуализируем
        this.visualizeArpeggio(extendedNotes, root, type);
        
        return this.currentArpeggio;
    }
    
    visualizeArpeggio(notes, root, type) {
        // Очищаем ТОЛЬКО подсветку арпеджио
        document.querySelectorAll('.fret').forEach(fret => {
            fret.classList.remove('arpeggio-root', 'arpeggio-third', 'arpeggio-fifth',
                                 'arpeggio-second', 'arpeggio-sixth', 'arpeggio-seventh');
        });
        
        // Определяем базовые ноты
        const rootNote = notes[0];
        const thirdNote = notes[1];
        const fifthNote = notes[2];
        
        // Подсвечиваем ноты на грифе
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
                // Это расширение - определяем какое
                const rootIndex = this.neck.notes.sharps.indexOf(
                    this.neck.normalizeToSharps(root)
                );
                const noteIndex = this.neck.notes.sharps.indexOf(normalizedNote);
                let interval = (noteIndex - rootIndex + 12) % 12;
                
                if (interval === 2) {
                    fret.classList.add('arpeggio-second');
                } else if (interval === 9) {
                    fret.classList.add('arpeggio-sixth');
                } else if (interval === 10 || interval === 11) {
                    fret.classList.add('arpeggio-seventh');
                }
            }
        });
        
        // Показываем информацию
        this.showArpeggioInfo(root, type, notes);
    }
    
    showArpeggioInfo(root, type, notes) {
        const chordNotesDiv = document.getElementById('chordNotes');
        
        // Удаляем старую информацию об арпеджио
        const oldInfo = document.querySelector('.arpeggio-info');
        if (oldInfo) oldInfo.remove();
        
        // Создаем новую
        const arpeggioInfoDiv = document.createElement('div');
        arpeggioInfoDiv.className = 'arpeggio-info';
        
        const typeName = type === 'minor' ? 'Минорное' : 'Мажорное';
        const typeClass = type === 'minor' ? 'arpeggio-type-minor' : 'arpeggio-type-major';
        const typeText = type === 'minor' ? 'min' : 'maj';
        
        // Формируем схему
        let pattern = type === 'minor' ? '1 - ♭3 - 5' : '1 - 3 - 5';
        const addSecond = document.getElementById('addSecond').checked;
        const addSixth = document.getElementById('addSixth').checked;
        const addSeventh = document.getElementById('addSeventh').checked;
        
        if (addSecond) pattern += ' + 2';
        if (addSixth) pattern += ' + 6';
        if (addSeventh) pattern += type === 'minor' ? ' + ♭7' : ' + 7';
        
        arpeggioInfoDiv.innerHTML = `
            <strong>
                ${typeName} арпеджио от ${root}
                <span class="arpeggio-type-badge ${typeClass}">${typeText}</span>
            </strong>
            <div style="margin: 5px 0;">Ноты: <strong>${notes.join(', ')}</strong></div>
            <div class="arpeggio-pattern">🎵 ${pattern}</div>
        `;
        
        chordNotesDiv.parentNode.insertBefore(arpeggioInfoDiv, chordNotesDiv.nextSibling);
    }
    
    clear() {
        // Очищаем подсветку арпеджио
        document.querySelectorAll('.fret').forEach(fret => {
            fret.classList.remove('arpeggio-root', 'arpeggio-third', 'arpeggio-fifth',
                                 'arpeggio-second', 'arpeggio-sixth', 'arpeggio-seventh');
        });
        
        // Удаляем информацию
        const arpeggioInfoDiv = document.querySelector('.arpeggio-info');
        if (arpeggioInfoDiv) {
            arpeggioInfoDiv.remove();
        }
        
        this.currentArpeggio = null;
    }
    
    updateExtensions() {
        if (this.currentArpeggio) {
            const chordInput = document.getElementById('chordInput');
            this.showArpeggio(chordInput.value.trim());
        }
    }
}

// ============ ИНИЦИАЛИЗАЦИЯ И УПРАВЛЕНИЕ ============
let arpeggioManager;

function initArpeggio() {
    arpeggioManager = new ArpeggioManager();
    
    // Кнопка показа арпеджио
    document.getElementById('showArpeggioBtn').addEventListener('click', function() {
        const chord = document.getElementById('chordInput').value.trim();
        if (chord) {
            arpeggioManager.showArpeggio(chord);
        }
    });
    
    // Чекбоксы расширений
    ['addSecond', 'addSixth', 'addSeventh'].forEach(id => {
        document.getElementById(id).addEventListener('change', function() {
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
    const arpeggioInfoDiv = document.querySelector('.arpeggio-info');
    if (arpeggioInfoDiv) {
        arpeggioInfoDiv.remove();
    }
}

// ============ ОБРАБОТЧИКИ СОБЫТИЙ ============
document.addEventListener('DOMContentLoaded', function() {
    renderFretBoard();
    
    // Кнопка показа аккорда
    document.getElementById('highlightChordBtn').addEventListener('click', function() {
        const chord = document.getElementById('chordInput').value.trim();
        if (chord) {
            highlightChordNotes(chord);
            document.getElementById('chordSequence').style.display = 'none';
            clearArpeggio();
        }
    });
    
    // Кнопки стилей
    document.getElementById('jazzManoucheBtn').addEventListener('click', function() {
        const chord = document.getElementById('chordInput').value.trim();
        if (chord) {
            const neck = new GuitarNeck();
            const tonic = neck.extractTonic(chord);
            showStyleChords('jazz-manouche', tonic);
            clearArpeggio();
        }
    });
    
    document.getElementById('bluesBtn').addEventListener('click', function() {
        const chord = document.getElementById('chordInput').value.trim();
        if (chord) {
            const neck = new GuitarNeck();
            const tonic = neck.extractTonic(chord);
            showStyleChords('blues', tonic);
            clearArpeggio();
        }
    });
    
    document.getElementById('bossaBtn').addEventListener('click', function() {
        const chord = document.getElementById('chordInput').value.trim();
        if (chord) {
            const neck = new GuitarNeck();
            const tonic = neck.extractTonic(chord);
            showStyleChords('bossa', tonic);
            clearArpeggio();
        }
    });
    
    // Инициализация арпеджио
    initArpeggio();
    
    // Автоподсветка при загрузке
    highlightChordNotes('C');
});
