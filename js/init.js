// Главный файл инициализации
// Файл: js/init.js

// Импортируем менеджеры
import { PentatonicManager } from './managers/PentatonicManager.js';
import { ArpeggioManager } from './managers/ArpeggioManager.js';

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  console.log('Инициализация приложения...');
  
  // Проверяем зависимости
  if (!window.musicTheory) {
    console.error('MusicTheory не загружен!');
    return;
  }
  
  if (!window.guitarNeck) {
    console.error('GuitarNeck не загружен!');
    return;
  }

  // Инициализация менеджеров
  window.pentatonicManager = new PentatonicManager();
  window.arpeggioManager = new ArpeggioManager();
  
  // Для обратной совместимости
  window.PentatonicManager = PentatonicManager;
  window.ArpeggioManager = ArpeggioManager;
  
  console.log('Менеджеры инициализированы:', {
    pentatonicManager: !!window.pentatonicManager,
    arpeggioManager: !!window.arpeggioManager
  });
});
