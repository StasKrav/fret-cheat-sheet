// js/hintsManager.js
class HintsManager {
  constructor() {
    this.currentLevel = 'intermediate';
    this.isVisible = true;
    this.lastChord = null;
    this.lastMode = null;
  }
  
  init() {
    // Восстановить настройки
    this.currentLevel = localStorage.getItem('hintsLevel') || 'intermediate';
    this.isVisible = localStorage.getItem('hintsVisible') !== 'false';
    
    // Установить уровень
    const levelSelect = document.getElementById('hintsLevel');
    if (levelSelect) {
      levelSelect.value = this.currentLevel;
      levelSelect.addEventListener('change', (e) => {
        this.setLevel(e.target.value);
        this.updateHints();
      });
    }
    
    // Кнопка в панели подсказок (если осталась)
    const toggleBtn = document.getElementById('toggleHints');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggleVisibility());
    }
    
    // Глобальная кнопка в статусной строке
    const globalToggleBtn = document.getElementById('toggleHintsGlobalBtn');
    if (globalToggleBtn) {
      globalToggleBtn.addEventListener('click', () => this.toggleVisibility());
    }
    
    // Обновить состояние кнопки
    this.updateGlobalButton();
    
    // Слушаем изменения в приложении
    this.setupListeners();
    this.setupKeyboardShortcuts();
    
    // Показать начальные подсказки
    if (this.isVisible) {
      this.updateHints();
    }
  }
  
  setLevel(level) {
    this.currentLevel = level;
    localStorage.setItem('hintsLevel', level);
    this.updateHints();
  }
  
  toggleVisibility() {
    this.isVisible = !this.isVisible;
    localStorage.setItem('hintsVisible', this.isVisible);
    
    // Обновить UI
    this.updateVisibility();
    this.updateGlobalButton();
    
    // Показать/обновить подсказки
    if (this.isVisible) {
      this.updateHints();
    }
  }
  
  updateVisibility() {
    const panel = document.querySelector('.hints-panel');
    
    if (panel) {
      panel.classList.toggle('hidden', !this.isVisible);
    }
    
    // Обновить кнопку в панели подсказок (если есть)
    const localToggleBtn = document.getElementById('toggleHints');
    if (localToggleBtn) {
      localToggleBtn.title = this.isVisible ? 'Скрыть подсказки' : 'Показать подсказки';
      localToggleBtn.querySelector('span').textContent = this.isVisible ? '📖' : '📕';
    }
  }
  
  updateGlobalButton() {
    const globalBtn = document.getElementById('toggleHintsGlobalBtn');
    const hintsIcon = document.getElementById('hintsIcon');
    
    if (globalBtn && hintsIcon) {
      if (this.isVisible) {
        globalBtn.classList.add('active');
        globalBtn.classList.remove('inactive');
        globalBtn.title = 'Скрыть подсказки';
        hintsIcon.textContent = '💡'; // Лампочка горит
      } else {
        globalBtn.classList.remove('active');
        globalBtn.classList.add('inactive');
        globalBtn.title = 'Показать подсказки';
        hintsIcon.textContent = '🔦'; // Лампочка выключена
      }
    }
  }
  
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+H или Cmd+H для переключения подсказок
      if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        this.toggleVisibility();
      }
      
      // Ctrl+Shift+H для переключения уровней
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'h') {
        e.preventDefault();
        this.cycleLevel();
      }
    });
  }
  
  cycleLevel() {
    const levels = ['beginner', 'intermediate', 'advanced', 'django'];
    const currentIndex = levels.indexOf(this.currentLevel);
    const nextIndex = (currentIndex + 1) % levels.length;
    this.setLevel(levels[nextIndex]);
    
    // Показать уведомление о смене уровня
    this.showLevelNotification(levels[nextIndex]);
  }
  
  showLevelNotification(level) {
    const levelNames = {
      'beginner': 'Новичок',
      'intermediate': 'Средний',
      'advanced': 'Продвинутый',
      'django': 'Django-эксперт'
    };
    
    // Создаем временное уведомление
    const notification = document.createElement('div');
    notification.className = 'level-notification';
    notification.innerHTML = `
      <span>Уровень подсказок: <strong>${levelNames[level]}</strong></span>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      background: var(--zenburn-bg-light);
      border: 1px solid var(--zenburn-yellow);
      padding: 10px 15px;
      border-radius: 6px;
      z-index: 1000;
      animation: fadeInOut 2s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 2000);
  }
  
  setupListeners() {
    // Отслеживаем изменения аккордов
    const chordInputs = ['chordInput', 'chordInputBlues', 'chordInputManouche'];
    chordInputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        input.addEventListener('input', () => this.onChordChange());
        input.addEventListener('change', () => this.onChordChange());
      }
    });
    
    // Отслеживаем кнопки
    const actionButtons = [
      'highlightChordBtn',
      'showArpeggioBtn',
      'showPentatonicBtn',
      'showManoucheBtn'
    ];
    
    actionButtons.forEach(id => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener('click', () => this.onAction());
      }
    });
    
    // Отслеживаем смену вкладок
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.onTabChange());
    });
  }
  
  onChordChange() {
    setTimeout(() => this.updateHints(), 100);
  }
  
  onAction() {
    setTimeout(() => this.updateHints(), 100);
  }
  
  onTabChange() {
    setTimeout(() => this.updateHints(), 100);
  }
  
  updateHints() {
    if (!this.isVisible) return;
    
    const content = document.getElementById('hintsContent');
    if (!content) return;
    
    content.innerHTML = '';
    content.classList.add('hint-update');
    
    // Получаем текущее состояние приложения
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'general';
    const chord = this.getCurrentChord();
    const mode = this.getCurrentMode();
    
    // Генерируем подсказки в зависимости от состояния
    const hints = this.generateHints(activeTab, chord, mode);
    
    // Добавляем подсказки в контейнер
    hints.forEach(hint => {
      const hintElement = document.createElement('div');
      hintElement.className = `hint-${hint.level} ${hint.type || ''}`;
      hintElement.innerHTML = hint.content;
      content.appendChild(hintElement);
    });
    
    // Убираем анимацию
    setTimeout(() => {
      content.classList.remove('hint-update');
    }, 300);
    
    this.lastChord = chord;
    this.lastMode = mode;
  }
  
  getCurrentChord() {
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'general';
    switch(activeTab) {
      case 'general': return document.getElementById('chordInput')?.value.trim();
      case 'blues': return document.getElementById('chordInputBlues')?.value.trim();
      case 'manouche': return document.getElementById('chordInputManouche')?.value.trim();
      default: return '';
    }
  }
  
  getCurrentMode() {
    const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab || 'general';
    
    if (activeTab === 'general') {
      if (document.querySelector('.arpeggio-controls')?.style.display === 'block') {
        return 'arpeggio';
      }
      return 'chord';
    }
    
    if (activeTab === 'blues') {
      if (window.pentatonicManager?.isActive) {
        return 'pentatonic';
      }
      return 'blues-chord';
    }
    
    if (activeTab === 'manouche') {
      if (document.querySelector('.scale-btn.active')) return 'scale';
      if (document.querySelector('.lick-btn.active')) return 'lick';
      if (document.querySelector('.fingering-btn.active')) return 'fingering';
      return 'manouche-chord';
    }
    
    return 'unknown';
  }
  
  generateHints(tab, chord, mode) {
    const hints = [];
    const level = this.currentLevel;
    
    // Общие подсказки для всех режимов
    hints.push(this.getGeneralHint(level));
    
    // Специфичные подсказки
    if (chord && chord.length > 0) {
      hints.push(this.getChordHint(chord, level));
    }
    
    if (tab === 'general') {
      hints.push(...this.getGeneralTabHints(mode, chord, level));
    } else if (tab === 'blues') {
      hints.push(...this.getBluesTabHints(mode, chord, level));
    } else if (tab === 'manouche') {
      hints.push(...this.getManoucheTabHints(mode, chord, level));
    }
    
    // Легенда цветов (для всех уровней кроме beginner)
    if (level !== 'beginner') {
      hints.push(this.getColorLegend(level));
    }
    
    return hints;
  }
  
  getGeneralHint(level) {
    const hints = {
      beginner: {
        content: `<p>👋 <strong>Совет:</strong> Вводите аккорды в поле слева (например, C, Am, G7)</p>`,
        level: 'beginner'
      },
      intermediate: {
        content: `<p>💡 <strong>Используйте вкладки:</strong> Общее → аккорды, Блюз → пентатоника, Gypsy Jazz → Django-техники</p>`,
        level: 'intermediate'
      },
      advanced: {
        content: `<p>🎯 <strong>Профессиональный совет:</strong> Практикуйтесь медленно, обращая внимание на аппликатуру и звучание каждого интервала</p>`,
        level: 'advanced'
      },
      django: {
        content: `<p>🎻 <strong>Django-style:</strong> Изучайте diminished арпеджио и характерные гаммы для аутентичного звучания</p>`,
        level: 'django'
      }
    };
    
    return hints[level] || hints.intermediate;
  }
  
  getChordHint(chord, level) {
    if (!window.musicTheory) return { content: '', level };
    
    const chordInfo = window.musicTheory.getChordType(chord);
    const notes = window.musicTheory.getChordNotes(chord);
    
    const hints = {
      beginner: {
        content: `<div class="chord-hint">
          <p><strong>Аккорд ${chord}:</strong> ноты ${notes.join(', ')}</p>
          <p>🎸 Красные кружки - корень аккорда</p>
        </div>`,
        level: 'beginner'
      },
      intermediate: {
        content: `<div class="chord-hint">
          <p><strong>${chord}:</strong> ${notes.join(' - ')}</p>
          <p>Тип: ${chordInfo.type || 'аккорд'}</p>
          <p>Используйте для упражнений на грифе</p>
        </div>`,
        level: 'intermediate'
      },
      advanced: {
        content: `<div class="chord-hint">
          <p><strong>Анализ ${chord}:</strong></p>
          <p>Состав: ${notes.join(' (')})</p>
          <p>Функция: ${this.getChordFunction(chord)}</p>
          <p>Обычно разрешается в: ${this.getChordResolution(chord)}</p>
        </div>`,
        level: 'advanced'
      },
      django: {
        content: `<div class="chord-hint">
          <p><strong>Django подход к ${chord}:</strong></p>
          <p>🎻 ${this.getDjangoChordTip(chord)}</p>
          <p>Характерные гаммы: ${this.getDjangoScalesForChord(chord).join(', ')}</p>
        </div>`,
        level: 'django'
      }
    };
    
    return hints[level] || hints.intermediate;
  }
  
  getGeneralTabHints(mode, chord, level) {
    const hints = [];
    
    if (mode === 'arpeggio') {
      const addSecond = document.getElementById('addSecond')?.checked;
      const addSixth = document.getElementById('addSixth')?.checked;
      const addSeventh = document.getElementById('addSeventh')?.checked;
      
      hints.push({
        content: `<div class="arpeggio-hint">
          <p>🎵 <strong>Арпеджио ${chord}:</strong> играйте ноты по отдельности</p>
          ${addSecond ? '<p>+ 2(9): добавляет нону</p>' : ''}
          ${addSixth ? '<p>+ 6(13): добавляет терцдециму</p>' : ''}
          ${addSeventh ? '<p>+ 7: добавляет септиму</p>' : ''}
        </div>`,
        level: level
      });
    }
    
    return hints;
  }
  
  getBluesTabHints(mode, chord, level) {
    const hints = [];
    
    if (mode === 'pentatonic') {
      const showBlues = document.getElementById('showBluesNote')?.checked;
      const activeBox = document.querySelector('.box-btn.active')?.dataset.box || 'all';
      
      hints.push({
        content: `<div class="scale-hint">
          <p>🎸 <strong>Блюзовая пентатоника:</strong></p>
          <p>Бокс ${activeBox === 'all' ? 'все' : activeBox} - паттерн для импровизации</p>
          ${showBlues ? '<p>Синие ноты - блюзовая (♭5)</p>' : ''}
          <p>Используйте для соло в тональности ${chord}</p>
        </div>`,
        level: level
      });
    }
    
    return hints;
  }
  
  getManoucheTabHints(mode, chord, level) {
    const hints = [];
    
    if (mode === 'scale') {
      const activeScale = document.querySelector('.scale-btn.active')?.dataset.scale;
      
      hints.push({
        content: `<div class="scale-hint">
          <p>🎻 <strong>Гамма Django:</strong> ${this.getScaleName(activeScale)}</p>
          <p>${this.getScaleDescription(activeScale)}</p>
          <p>Используйте в соло над ${chord}</p>
        </div>`,
        level: level
      });
    } else if (mode === 'lick') {
      const activeLick = document.querySelector('.lick-btn.active')?.dataset.lick;
      
      hints.push({
        content: `<div class="scale-hint">
          <p>⚡ <strong>Фраза Django:</strong> ${this.getLickName(activeLick)}</p>
          <p>Цифры показывают порядок нот</p>
          <p>Практикуйте медленно, затем ускоряйтесь</p>
        </div>`,
        level: level
      });
    }
    
    return hints;
  }
  
  getColorLegend(level) {
    const isManouche = document.querySelector('.tab-btn.active')?.dataset.tab === 'manouche';
    
    let legend = `
      <div class="color-legend">
        <div class="legend-item"><span class="color-dot color-root"></span> Корень</div>
        <div class="legend-item"><span class="color-dot color-chord"></span> Нота аккорда</div>
    `;
    
    if (isManouche) {
      legend += `
        <div class="legend-item"><span class="color-dot color-scale"></span> Характерная нота</div>
      `;
    } else {
      legend += `
        <div class="legend-item"><span class="color-dot color-scale"></span> Нота гаммы</div>
      `;
    }
    
    legend += `</div>`;
    
    return {
      content: legend,
      level: 'intermediate'
    };
  }
  
  // Вспомогательные методы
  getChordFunction(chord) {
    if (chord.includes('7')) return 'Доминанта';
    if (chord.includes('m')) return 'Минор';
    return 'Мажор';
  }
  
  getChordResolution(chord) {
    if (chord.includes('7')) {
      const root = window.musicTheory?.extractTonic(chord) || 'C';
      const resolutions = {
        'C': 'F', 'G': 'C', 'D': 'G', 'A': 'D', 'E': 'A'
      };
      return resolutions[root] || 'IV';
    }
    return 'различные';
  }
  
  getDjangoChordTip(chord) {
    if (chord.includes('dim')) return 'Играйте diminished арпеджио через каждый лад';
    if (chord.includes('m6')) return 'Используйте характерный звук 6 ступени';
    if (chord.includes('7')) return 'Добавляйте #9 и b13 для альтерированного звучания';
    return 'Используйте быстрые хроматические подходы';
  }
  
  getDjangoScalesForChord(chord) {
    if (chord.includes('dim')) return ['Diminished', 'Half-whole'];
    if (chord.includes('m')) return ['Harmonic Minor', 'Dorian ♯4'];
    if (chord.includes('7')) return ['Diminished', 'Altered', 'Mixolydian ♭6'];
    return ['Gypsy Major', 'Harmonic Major'];
  }
  
  getScaleName(scaleKey) {
    const names = {
      'gypsyMajor': 'Цыганская мажорная',
      'harmonicMajor': 'Гармоническая мажорная',
      'harmonicMinor': 'Гармоническая минорная',
      'dorianSharp4': 'Дорийская с ♯4',
      'diminished': 'Diminished',
      'auto': 'Авто (Django-стиль)'
    };
    return names[scaleKey] || scaleKey;
  }
  
  getScaleDescription(scaleKey) {
    const desc = {
      'gypsyMajor': 'Характерный "цыганский" звук Django',
      'harmonicMajor': 'Мажор с напряженной ♭6',
      'dorianSharp4': 'Для минорных аккордов с 6 ступенью',
      'diminished': 'Симметричное арпеджио для доминант'
    };
    return desc[scaleKey] || '';
  }
  
  getLickName(lickKey) {
    const names = {
      'dimRun': 'Diminished run',
      'gypsySweep': 'Gypsy sweep',
      'chromaticApproach': 'Chromatic approach',
      'tremoloPattern': 'Tremolo pattern'
    };
    return names[lickKey] || lickKey;
  }
}

// Создаем глобальный экземпляр
window.HintsManager = HintsManager;
