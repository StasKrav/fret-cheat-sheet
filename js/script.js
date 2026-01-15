class GuitarNeck {
    constructor() {
        this.tuning = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];
        // Два массива нот для поддержки диезов и бемолей
        this.notes = {
            sharps: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
            flats: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
        };
        
        // Маппинг эквивалентных нот (диез ↔ бемоль)
        this.equivalents = {
            'C#': 'Db', 'Db': 'C#',
            'D#': 'Eb', 'Eb': 'D#',
            'F#': 'Gb', 'Gb': 'F#',
            'G#': 'Ab', 'Ab': 'G#',
            'A#': 'Bb', 'Bb': 'A#'
        };
        
        this.frets = 12;
    }

    // Нормализует ноту к диезной нотации для внутреннего использования
    normalizeToSharps(note) {
        if (this.equivalents[note]) {
            // Если это бемоль, конвертируем в диез
            const flatIndex = this.notes.flats.indexOf(note);
            if (flatIndex !== -1) {
                return this.notes.sharps[flatIndex];
            }
        }
        return note;
    }

    getNote(string, fret) {
        const openNote = this.tuning[string];
        // Извлекаем название ноты (может быть с диезом/бемолем)
        const openNoteName = openNote.match(/^[A-G][#b]?/)[0];
        const octave = parseInt(openNote.slice(openNoteName.length));
        
        // Нормализуем к диезной нотации
        const normalizedOpenNote = this.normalizeToSharps(openNoteName);
        const openNoteIndex = this.notes.sharps.indexOf(normalizedOpenNote);
        
        const noteIndex = (openNoteIndex + fret) % 12;
        const noteOctave = octave + Math.floor((openNoteIndex + fret) / 12);
        
        return this.notes.sharps[noteIndex] + noteOctave;
    }

    getBaseNote(string, fret) {
        const fullNote = this.getNote(string, fret);
        // Удаляем только цифры (октаву), сохраняем диезы/бемоли
        return fullNote.replace(/[0-9]/g, '');
    }

    getChordRoot(chord) {
        // Улучшенный regex для захвата диезов и бемолей
        const match = chord.match(/^[A-G][#♯b♭]?/);
        if (!match) return chord.charAt(0);
        
        let root = match[0];
        
        // Заменяем Unicode символы на ASCII
        root = root.replace('♯', '#').replace('♭', 'b');
        
        // Нормализуем к диезной нотации для единообразия
        return this.normalizeToSharps(root);
    }

    getChordNotes(chord) {
        const root = this.getChordRoot(chord);
        const rootIndex = this.notes.sharps.indexOf(root);
        
        // Если не нашли ноту в массиве, возвращаем хотя бы корень
        if (rootIndex === -1) {
            console.warn(`Неизвестная нота: ${root} в аккорде ${chord}`);
            return [root];
        }
        
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
                this.notes.sharps[(rootIndex + 9) % 12]
            ];
        } else if (chord.includes('m')) {
            return [
                root,
                this.notes.sharps[(rootIndex + 3) % 12],
                this.notes.sharps[(rootIndex + 7) % 12]
            ];
        } else {
            // Мажорный аккорд по умолчанию
            return [
                root,
                this.notes.sharps[(rootIndex + 4) % 12],
                this.notes.sharps[(rootIndex + 7) % 12]
            ];
        }
    }

    // Специфические аккорды для джаз-мануш
    getJazzManoucheChords(tonic) {
        // Нормализуем тонику
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

    // Блюзовые аккорды
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

    // Босса-нова аккорды
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
    
    // Вспомогательный метод для извлечения тоники из аккорда
    extractTonic(chord) {
        return this.getChordRoot(chord);
    }
}

function renderFretBoard() {
    const neck = new GuitarNeck();
    const fretBoard = document.getElementById('fretBoard');
    const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
    
    let html = '<div class="fret-numbers">';
    
    // Пустой элемент для выравнивания с названиями струн
    html += '<span></span>';
    
    // Номера ладов сверху
    for (let fret = 0; fret <= 12; fret++) {
        if (fret === 0) {
            html += '<span></span>';
        } else {
            html += `<span>${fret}</span>`;
        }
    }
    
    html += '</div>';
    
    // Строки грифа
    for (let string = 0; string < 6; string++) {
        html += `<div class="string">`;
        html += `<div class="string-name">${stringNames[string]}</div>`;
        
        for (let fret = 0; fret <= 12; fret++) {
            const note = neck.getBaseNote(string, fret);
            const fullNote = neck.getNote(string, fret);
            const isNut = fret === 0;
            
            html += `<div class="fret ${isNut ? 'nut' : ''}" 
                        data-string="${string}" 
                        data-fret="${fret}"
                        data-note="${note}"
                        data-full="${fullNote}">`;
            
            // ТОЛЬКО НОТА
            if (!isNut) {
                html += note;
            } else {
                html += '○';
            }
            
            html += `</div>`;
        }
        
        html += `</div>`;
    }
    
    fretBoard.innerHTML = html;
}

function highlightChordNotes(chord) {
    const neck = new GuitarNeck();
    const chordNotes = neck.getChordNotes(chord);
    
    document.querySelectorAll('.fret').forEach(fret => {
        fret.classList.remove('highlight');
    });
    
    document.querySelectorAll('.fret').forEach(fret => {
        const note = fret.getAttribute('data-note');
        // Нормализуем ноту на грифе для сравнения
        const normalizedNote = neck.normalizeToSharps(note);
        if (chordNotes.includes(normalizedNote)) {
            fret.classList.add('highlight');
        }
    });
    
    document.getElementById('chordNotes').textContent = 
        `Ноты аккорда ${chord}: ${chordNotes.join(', ')}`;
}

function showStyleChords(style, tonic) {
    const neck = new GuitarNeck();
    // Используем метод extractTonic для корректного извлечения тоники
    const normalizedTonic = neck.extractTonic(tonic);
    
    let chords, description, styleName;
    
    switch(style) {
        case 'jazz-manouche':
            chords = neck.getJazzManoucheChords(normalizedTonic);
            description = "🎸 Характерные аккорды джаз-мануш (цыганского джаза):";
            styleName = "Джаз-мануш";
            break;
        case 'blues':
            chords = neck.getBluesChords(normalizedTonic);
            description = "🎵 Типичная блюзовая прогрессия:";
            styleName = "Блюз";
            break;
        case 'bossa':
            chords = neck.getBossaNovaChords(normalizedTonic);
            description = "🎶 Аккорды в стиле босса-нова:";
            styleName = "Босса-нова";
            break;
    }
    
    document.getElementById('styleInfo').textContent = 
        `${styleName} в тональности ${tonic}`;
    
    const sequenceDiv = document.getElementById('chordSequence');
    sequenceDiv.style.display = 'block';
    
    // Создаем HTML с кликабельными аккордами
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
    
    // Добавляем обработчики для всех кликабельных аккордов
    sequenceDiv.querySelectorAll('.chord-link').forEach(link => {
        link.addEventListener('click', function() {
            const chord = this.getAttribute('data-chord');
            document.getElementById('chordInput').value = chord;
            highlightChordNotes(chord);
            
            // Подсвечиваем текущий аккорд в последовательности
            sequenceDiv.querySelectorAll('.chord-link').forEach(l => {
                l.style.background = '';
            });
            this.style.background = 'rgba(143, 178, 143, 0.3)';
        });
    });
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    renderFretBoard();
    
    document.getElementById('highlightChordBtn').addEventListener('click', function() {
        const chord = document.getElementById('chordInput').value.trim();
        if (chord) {
            highlightChordNotes(chord);
            document.getElementById('chordSequence').style.display = 'none';
        }
    });
    
    // Кнопка джаз-мануш
    document.getElementById('jazzManoucheBtn').addEventListener('click', function() {
        const chord = document.getElementById('chordInput').value.trim();
        if (chord) {
            const neck = new GuitarNeck();
            const tonic = neck.extractTonic(chord);
            showStyleChords('jazz-manouche', tonic);
        }
    });
    
    // Кнопка блюза
    document.getElementById('bluesBtn').addEventListener('click', function() {
        const chord = document.getElementById('chordInput').value.trim();
        if (chord) {
            const neck = new GuitarNeck();
            const tonic = neck.extractTonic(chord);
            showStyleChords('blues', tonic);
        }
    });
    
    // Кнопка босса-новы
    document.getElementById('bossaBtn').addEventListener('click', function() {
        const chord = document.getElementById('chordInput').value.trim();
        if (chord) {
            const neck = new GuitarNeck();
            const tonic = neck.extractTonic(chord);
            showStyleChords('bossa', tonic);
        }
    });
    
    // Авто-подсветка при загрузке
    highlightChordNotes('C');
});

// Обработчики клика по ладам для быстрого ввода нот
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('fret') && !e.target.classList.contains('nut')) {
        const note = e.target.getAttribute('data-note');
        const currentChord = document.getElementById('chordInput').value.trim();
        
        // Извлекаем корень текущего аккорда для сравнения
        const neck = new GuitarNeck();
        const currentRoot = neck.extractTonic(currentChord);
        const clickedRoot = neck.extractTonic(note);
        
        // Если аккорд не начинается с этой ноты, предлагаем её как новый аккорд
        if (currentRoot !== clickedRoot) {
            document.getElementById('chordInput').value = note;
            highlightChordNotes(note);
            
            // Краткая анимация нажатия
            e.target.style.transform = 'scale(0.95)';
            setTimeout(() => {
                e.target.style.transform = '';
            }, 150);
        }
    }
});

// Автозаполнение при вводе аккордов
const chordSuggestions = ['C', 'Cm', 'C7', 'Cm7', 'Cmaj7', 'C6', 'C9', 'Cdim7', 
                         'C#', 'C#m', 'C#7', 'C#m7', 'C#maj7',
                         'Db', 'Dbm', 'Db7', 'Dbm7', 'Dbmaj7',
                         'D', 'Dm', 'D7', 'Dm7', 'Dmaj7',
                         'D#', 'D#m', 'D#7', 'D#m7', 
                         'Eb', 'Ebm', 'Eb7', 'Ebm7', 'Ebmaj7',
                         'E', 'Em', 'E7', 'Em7', 'Emaj7',
                         'F', 'Fm', 'F7', 'Fm7', 'Fmaj7',
                         'F#', 'F#m', 'F#7', 'F#m7', 'F#maj7',
                         'Gb', 'Gbm', 'Gb7', 'Gbm7', 'Gbmaj7',
                         'G', 'Gm', 'G7', 'Gm7', 'Gmaj7',
                         'G#', 'G#m', 'G#7', 'G#m7',
                         'Ab', 'Abm', 'Ab7', 'Abm7', 'Abmaj7',
                         'A', 'Am', 'A7', 'Am7', 'Amaj7',
                         'A#', 'A#m', 'A#7', 'A#m7',
                         'Bb', 'Bbm', 'Bb7', 'Bbm7', 'Bbmaj7',
                         'B', 'Bm', 'B7', 'Bm7', 'Bmaj7'];

const chordInput = document.getElementById('chordInput');
let suggestionDiv;

chordInput.addEventListener('input', function() {
    const value = this.value.trim();
    
    // Удаляем предыдущие подсказки
    if (suggestionDiv) {
        suggestionDiv.remove();
    }
    
    if (value.length > 0) {
        const neck = new GuitarNeck();
        const normalizedValue = neck.normalizeToSharps(value);
        
        const suggestions = chordSuggestions.filter(chord => {
            const normalizedChord = neck.normalizeToSharps(chord);
            return normalizedChord.toLowerCase().startsWith(normalizedValue.toLowerCase());
        }).slice(0, 5);
        
        if (suggestions.length > 0) {
            suggestionDiv = document.createElement('div');
            suggestionDiv.className = 'chord-suggestions';
            suggestionDiv.style.cssText = `
                position: absolute;
                background: rgba(40, 40, 60, 0.95);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                margin-top: 5px;
                z-index: 1000;
                min-width: 200px;
                backdrop-filter: blur(10px);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            `;
            
            suggestions.forEach(suggestion => {
                const div = document.createElement('div');
                div.textContent = suggestion;
                div.style.cssText = `
                    padding: 12px 15px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
                `;
                div.addEventListener('mouseenter', () => {
                    div.style.background = 'rgba(143, 178, 143, 0.2)';
                });
                div.addEventListener('mouseleave', () => {
                    div.style.background = '';
                });
                div.addEventListener('click', () => {
                    chordInput.value = suggestion;
                    highlightChordNotes(suggestion);
                    suggestionDiv.remove();
                });
                suggestionDiv.appendChild(div);
            });
            
            this.parentNode.appendChild(suggestionDiv);
        }
    }
});

// Закрываем подсказки при клике вне поля
document.addEventListener('click', function(e) {
    if (suggestionDiv && !chordInput.contains(e.target) && !suggestionDiv.contains(e.target)) {
        suggestionDiv.remove();
    }
});

// Обработка нажатия Enter в поле ввода
chordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const chord = this.value.trim();
        if (chord) {
            highlightChordNotes(chord);
            document.getElementById('chordSequence').style.display = 'none';
            
            // Закрываем подсказки если они открыты
            if (suggestionDiv) {
                suggestionDiv.remove();
            }
        }
    }
});
