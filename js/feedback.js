// feedback.js

const FEEDBACK_CONFIG = {
    email: "krav.stan@yandex.ru",
    telegram: "@StanKrav108",
    subject: "Обратная связь"
};

class FeedbackManager {
    constructor() {
        this.isInitialized = false;
    }

    // Инициализация
    init() {
        if (this.isInitialized) return;
        
        this.addStyles();
        this.setupEventListeners();
        this.isInitialized = true;
        console.log("FeedbackManager инициализирован");
    }

    // Добавление стилей
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .feedback-btn {
                position: relative;
                bottom: auto;
                right: auto;
                padding: 8px 16px !important;
                background: var(--accent-primary) !important;
                color: #000 !important;
                border: none !important;
                border-radius: 20px !important;
                font-weight: bold !important;
                cursor: pointer;
                box-shadow: var(--shadow-md);
                transition: all 0.3s ease;
                z-index: 1000;
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 12px !important;
                height: 32px;
                margin: 0;
            }
            
            .feedback-btn:hover {
                background: var(--accent-secondary) !important;
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            
            .feedback-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .feedback-modal {
                background: var(--card-bg);
                border-radius: var(--border-radius);
                width: 90%;
                max-width: 500px;
                border: 1px solid var(--card-border);
                box-shadow: var(--shadow-lg);
                animation: slideUp 0.4s ease;
                overflow: hidden;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .feedback-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid var(--card-border);
            }
            
            .feedback-header h3 {
                margin: 0;
                color: var(--accent-primary);
            }
            
            .close-btn {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.8rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.2s ease;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                color: var(--text-color);
            }
            
            .feedback-body {
                padding: 20px;
            }
            
            .contact-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                gap: 10px;
                margin: 20px 0;
            }
            
            .contact-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid var(--card-border);
                border-radius: var(--border-radius-sm);
                color: var(--text-color);
                cursor: pointer;
                transition: all 0.3s ease;
                min-height: 100px;
            }
            
            .contact-option:hover {
                background: var(--hover-bg);
                border-color: var(--accent-primary);
                transform: translateY(-3px);
            }
            
            .contact-option span:first-child {
                font-size: 2rem;
                margin-bottom: 8px;
            }
            
            .contact-info {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid var(--card-border);
            }
            
            .email-display {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--border-radius-sm);
                margin: 10px 0;
                flex-wrap: wrap;
            }
            
            .email-display code {
                flex-grow: 1;
                font-family: monospace;
                color: var(--accent-primary);
                padding: 5px 10px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 4px;
            }
            
            .copy-btn {
                padding: 8px 15px;
                background: var(--accent-primary);
                color: #000;
                border: none;
                border-radius: 20px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .copy-btn:hover {
                background: var(--accent-secondary);
            }
            
            .hint {
                font-size: 0.9rem;
                color: var(--text-secondary);
                margin: 10px 0;
            }
            
            @media (max-width: 768px) {
                .contact-options {
                    grid-template-columns: 1fr;
                }
                
                .feedback-modal {
                    width: 95%;
                    margin: 10px;
                }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        const feedbackBtn = document.getElementById('feedbackBtn');
        if (feedbackBtn) {
            feedbackBtn.addEventListener('click', () => this.showModal());
        }
    }

    // Показать модальное окно
    showModal() {
        // Создаем оверлей
        const overlay = document.createElement('div');
        overlay.className = 'feedback-overlay';
        
        overlay.innerHTML = `
            <div class="feedback-modal">
                <div class="feedback-header">
                    <h3>Обратная связь</h3>
                    <button class="close-btn">&times;</button>
                </div>
                
                <div class="feedback-body">
                    <p>Нашли ошибку? Есть предложения по улучшению? Свяжитесь со мной!</p>
                    
                    <div class="contact-options">
                        <button class="contact-option" data-type="email">
                            <span>📧</span>
                            <span>Написать на email</span>
                        </button>
                        
                        <button class="contact-option" data-type="telegram">
                            <span>✈️</span>
                            <span>Telegram</span>
                        </button>
                    </div>
                    
                    <div class="contact-info" id="contactInfo">
                        <div class="hint">Выберите способ связи</div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Обработчики событий
        const closeBtn = overlay.querySelector('.close-btn');
        const contactOptions = overlay.querySelectorAll('.contact-option');
        const contactInfo = overlay.querySelector('#contactInfo');
        
        // Закрытие модалки
        const closeModal = () => {
            overlay.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeModal();
        });
        
        // Обработка выбора способа связи
        contactOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                
                // Сбрасываем выделение
                contactOptions.forEach(opt => {
                    opt.style.background = '';
                    opt.style.borderColor = '';
                });
                
                // Выделяем выбранный
                e.currentTarget.style.background = 'rgba(124, 184, 187, 0.2)';
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                
                // Показываем информацию о выбранном способе
                if (type === 'email') {
                    this.showEmailInfo(contactInfo);
                } else if (type === 'telegram') {
                    this.showTelegramInfo(contactInfo);
                }
            });
        });
        
        // Закрытие по Escape
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
    }

    // Показать информацию для email
    showEmailInfo(container) {
        const encodedSubject = encodeURIComponent(FEEDBACK_CONFIG.subject);
        const defaultBody = encodeURIComponent(
            'Привет!\n\n' +
            'Пишу по поводу твоего проекта "Квинтовый круг".\n\n' +
            '---\n' +
            'Отправлено из приложения: Квинтовый круг'
        );
        
        const mailtoLink = `mailto:${FEEDBACK_CONFIG.email}?subject=${encodedSubject}&body=${defaultBody}`;
        
        container.innerHTML = `
            <div class="hint">Напишите мне на email:</div>
            
            <div class="email-display">
                <code id="emailValue">${FEEDBACK_CONFIG.email}</code>
                <button class="copy-btn" id="copyEmailBtn">Копировать</button>
            </div>
            
            <div class="hint">Или откройте почтовый клиент:</div>
            
            <a href="${mailtoLink}" target="_blank" class="email-link">
                📧 Открыть почтовый клиент
            </a>
        `;
        
        // Стиль для ссылки
        const link = container.querySelector('.email-link');
        if (link) {
            link.style.cssText = `
                display: block;
                padding: 12px;
                background: var(--accent-primary);
                color: #000;
                text-align: center;
                border-radius: var(--border-radius-sm);
                text-decoration: none;
                font-weight: bold;
                margin-top: 10px;
                transition: all 0.2s ease;
            `;
        }
        
        // Копирование email
        const copyBtn = container.querySelector('#copyEmailBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                navigator.clipboard.writeText(FEEDBACK_CONFIG.email).then(() => {
                    const btn = e.currentTarget;
                    const originalText = btn.textContent;
                    btn.textContent = '✓ Скопировано!';
                    btn.style.background = '#00cc00';
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Не удалось скопировать:', err);
                    e.currentTarget.textContent = 'Ошибка!';
                    e.currentTarget.style.background = '#ff4444';
                    
                    setTimeout(() => {
                        e.currentTarget.textContent = 'Копировать';
                        e.currentTarget.style.background = '';
                    }, 2000);
                });
            });
        }
    }

    // Показать информацию для Telegram
    showTelegramInfo(container) {
        const telegramLink = `https://t.me/${FEEDBACK_CONFIG.telegram.replace('@', '')}`;
        
        container.innerHTML = `
            <div class="hint">Напишите мне в Telegram:</div>
            
            <div class="email-display">
                <code id="telegramValue">${FEEDBACK_CONFIG.telegram}</code>
                <button class="copy-btn" id="copyTelegramBtn">Копировать</button>
            </div>
            
            <div class="hint">Или откройте Telegram:</div>
            
            <a href="${telegramLink}" target="_blank" class="telegram-link">
                ✈️ Открыть Telegram
            </a>
        `;
        
        // Стиль для ссылки
        const link = container.querySelector('.telegram-link');
        if (link) {
            link.style.cssText = `
                display: block;
                padding: 12px;
                background: #0088cc;
                color: white;
                text-align: center;
                border-radius: var(--border-radius-sm);
                text-decoration: none;
                font-weight: bold;
                margin-top: 10px;
                transition: all 0.2s ease;
            `;
        }
        
        // Копирование Telegram username
        const copyBtn = container.querySelector('#copyTelegramBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                navigator.clipboard.writeText(FEEDBACK_CONFIG.telegram).then(() => {
                    const btn = e.currentTarget;
                    const originalText = btn.textContent;
                    btn.textContent = '✓ Скопировано!';
                    btn.style.background = '#00cc00';
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.background = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Не удалось скопировать:', err);
                    e.currentTarget.textContent = 'Ошибка!';
                    e.currentTarget.style.background = '#ff4444';
                    
                    setTimeout(() => {
                        e.currentTarget.textContent = 'Копировать';
                        e.currentTarget.style.background = '';
                    }, 2000);
                });
            });
        }
    }
}

// Создаем глобальный экземпляр
window.FeedbackManager = new FeedbackManager();

// Автоматическая инициализация при загрузке DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.FeedbackManager.init();
    });
} else {
    window.FeedbackManager.init();
}
