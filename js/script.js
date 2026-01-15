
        class GuitarNeck {
            constructor() {
                this.tuning = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];
                this.notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                this.frets = 12;
            }

            getNote(string, fret) {
                const openNote = this.tuning[string];
                const openNoteName = openNote.replace(/[0-9]/g, '');
                const openNoteIndex = this.notes.indexOf(openNoteName);
                const octave = parseInt(openNote.match(/[0-9]/)[0]);
                
                const noteIndex = (openNoteIndex + fret) % 12;
                const noteOctave = octave + Math.floor((openNoteIndex + fret) / 12);
                
                return this.notes[noteIndex] + noteOctave;
            }

            getBaseNote(string, fret) {
                const fullNote = this.getNote(string, fret);
                return fullNote.replace(/[0-9]/g, '');
            }

            getChordNotes(chord) {
                const root = this.getChordRoot(chord);
                const rootIndex = this.notes.indexOf(root);
                
                if (chord.includes('maj7')) {
                    return [
                        root,
                        this.notes[(rootIndex + 4) % 12],
                        this.notes[(rootIndex + 7) % 12],
                        this.notes[(rootIndex + 11) % 12]
                    ];
                } else if (chord.includes('m7')) {
                    return [
                        root,
                        this.notes[(rootIndex + 3) % 12],
                        this.notes[(rootIndex + 7) % 12],
                        this.notes[(rootIndex + 10) % 12]
                    ];
                } else if (chord.includes('7')) {
                    return [
                        root,
                        this.notes[(rootIndex + 4) % 12],
                        this.notes[(rootIndex + 7) % 12],
                        this.notes[(rootIndex + 10) % 12]
                    ];
                } else if (chord.includes('6')) {
                    return [
                        root,
                        this.notes[(rootIndex + 4) % 12],
                        this.notes[(rootIndex + 7) % 12],
                        this.notes[(rootIndex + 9) % 12]
                    ];
                } else if (chord.includes('9')) {
                    return [
                        root,
                        this.notes[(rootIndex + 4) % 12],
                        this.notes[(rootIndex + 7) % 12],
                        this.notes[(rootIndex + 10) % 12],
                        this.notes[(rootIndex + 14) % 12]
                    ];
                } else if (chord.includes('dim7')) {
                    return [
                        root,
                        this.notes[(rootIndex + 3) % 12],
                        this.notes[(rootIndex + 6) % 12],
                        this.notes[(rootIndex + 9) % 12]
                    ];
                } else if (chord.includes('m')) {
                    return [
                        root,
                        this.notes[(rootIndex + 3) % 12],
                        this.notes[(rootIndex + 7) % 12]
                    ];
                } else {
                    return [
                        root,
                        this.notes[(rootIndex + 4) % 12],
                        this.notes[(rootIndex + 7) % 12]
                    ];
                }
            }

            getChordRoot(chord) {
                const match = chord.match(/^[A-G][#b]?/);
                return match ? match[0] : chord.charAt(0);
            }

            // Специфические аккорды для джаз-мануш
            getJazzManoucheChords(tonic) {
                const rootIndex = this.notes.indexOf(tonic);
                
                return {
                    // Типичная прогрессия джаз-мануш
                    progression: [
                        `${tonic}6`,
                        `${tonic}7`,
                        `${this.notes[(rootIndex + 5) % 12]}7`,
                        `${this.notes[(rootIndex + 7) % 12]}6`,
                        `${this.notes[(rootIndex + 10) % 12]}7`,
                        `${this.notes[(rootIndex + 2) % 12]}7`,
                        `${tonic}6`
                    ],
                    // Характерные аккорды стиля
                    characteristic: [
                        `${tonic}6`,
                        `${tonic}9`,
                        `${this.notes[(rootIndex + 5) % 12]}7#9`,
                        `${this.notes[(rootIndex + 7) % 12]}m6`,
                        `${this.notes[(rootIndex + 10) % 12]}7b9`,
                        `${tonic}dim7`
                    ]
                };
            }

            // Блюзовые аккорды
            getBluesChords(tonic) {
                const rootIndex = this.notes.indexOf(tonic);
                
                return {
                    progression: [
                        `${tonic}7`,
                        `${this.notes[(rootIndex + 5) % 12]}7`,
                        `${this.notes[(rootIndex + 7) % 12]}7`,
                        `${tonic}7`
                    ],
                    characteristic: [
                        `${tonic}7`,
                        `${tonic}9`,
                        `${this.notes[(rootIndex + 5) % 12]}7`,
                        `${this.notes[(rootIndex + 7) % 12]}7`
                    ]
                };
            }

            // Босса-нова аккорды
            getBossaNovaChords(tonic) {
                const rootIndex = this.notes.indexOf(tonic);
                
                return {
                    progression: [
                        `${tonic}maj7`,
                        `${this.notes[(rootIndex + 7) % 12]}7`,
                        `${this.notes[(rootIndex + 5) % 12]}7`,
                        `${this.notes[(rootIndex + 10) % 12]}m7`,
                        `${this.notes[(rootIndex + 3) % 12]}7`,
                        `${tonic}maj7`
                    ],
                    characteristic: [
                        `${tonic}maj7`,
                        `${tonic}6`,
                        `${this.notes[(rootIndex + 7) % 12]}9`,
                        `${this.notes[(rootIndex + 5) % 12]}m7`,
                        `${this.notes[(rootIndex + 10) % 12]}m9`
                    ]
                };
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
            
            // Остальной код без изменений...
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
                if (chordNotes.includes(note)) {
                    fret.classList.add('highlight');
                }
            });
            
            document.getElementById('chordNotes').textContent = 
                `Ноты аккорда ${chord}: ${chordNotes.join(', ')}`;
        }

        function showStyleChords(style, tonic) {
            const neck = new GuitarNeck();
            let chords, description, styleName;
            
            switch(style) {
                case 'jazz-manouche':
                    chords = neck.getJazzManoucheChords(tonic);
                    description = "🎸 Характерные аккорды джаз-мануш (цыганского джаза):";
                    styleName = "Джаз-мануш";
                    break;
                case 'blues':
                    chords = neck.getBluesChords(tonic);
                    description = "🎵 Типичная блюзовая прогрессия:";
                    styleName = "Блюз";
                    break;
                case 'bossa':
                    chords = neck.getBossaNovaChords(tonic);
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
                    this.style.background = 'rgba(76, 175, 80, 0.3)';
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
                const tonic = document.getElementById('chordInput').value.trim().charAt(0);
                if (tonic) {
                    showStyleChords('jazz-manouche', tonic);
                }
            });
            
            // Кнопка блюза
            document.getElementById('bluesBtn').addEventListener('click', function() {
                const tonic = document.getElementById('chordInput').value.trim().charAt(0);
                if (tonic) {
                    showStyleChords('blues', tonic);
                }
            });
            
            // Кнопка босса-новы
            document.getElementById('bossaBtn').addEventListener('click', function() {
                const tonic = document.getElementById('chordInput').value.trim().charAt(0);
                if (tonic) {
                    showStyleChords('bossa', tonic);
                }
            });
            
            // Авто-подсветка при загрузке
            highlightChordNotes('C');
        });

// Добавить перед закрывающим тегом script:

// Добавить обработчики клика по ладам для быстрого ввода нот
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('fret') && !e.target.classList.contains('nut')) {
        const note = e.target.getAttribute('data-note');
        const currentChord = document.getElementById('chordInput').value.trim();
        const root = currentChord.charAt(0);
        
        // Если аккорд не начинается с этой ноты, предлагаем её как новый аккорд
        if (root !== note) {
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
                         'D', 'Dm', 'D7', 'Dm7', 'Dmaj7', 'E', 'Em', 'E7', 'Em7', 
                         'F', 'Fm', 'F7', 'Fm7', 'G', 'Gm', 'G7', 'Gm7', 'A', 'Am', 
                         'A7', 'Am7', 'B', 'Bm', 'B7', 'Bm7'];

const chordInput = document.getElementById('chordInput');
let suggestionDiv;

chordInput.addEventListener('input', function() {
    const value = this.value.trim();
    
    // Удаляем предыдущие подсказки
    if (suggestionDiv) {
        suggestionDiv.remove();
    }
    
    if (value.length > 0) {
        const suggestions = chordSuggestions.filter(chord => 
            chord.toLowerCase().startsWith(value.toLowerCase())
        ).slice(0, 5);
        
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
                    div.style.background = 'rgba(76, 175, 80, 0.2)';
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

