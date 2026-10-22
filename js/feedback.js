// feedback.js

const FEEDBACK_CONFIG = {
  email: "krav.stan@yandex.ru",
  telegram: "@StanKrav108",
  // subject берём из i18n динамически — см. getSubject()
};

class FeedbackManager {
  constructor() {
    this.isInitialized = false;
    this.overlay = null;
  }

  // Инициализация
  init() {
    if (this.isInitialized) return;
    this.addStyles();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  // Хелпер: безопасный перевод с fallback
  t(key, fallback = "") {
    if (window.i18n && typeof window.i18n.t === "function") {
      return window.i18n.t(key, fallback);
    }
    return fallback || key;
  }

  // Тема письма — динамическая, чтобы следовать за языком
  getSubject() {
    return this.t("feedback.subject", "Feedback");
  }

  // ============ СТИЛИ ============
  addStyles() {
    if (document.getElementById("feedback-styles")) return; // не дублируем

    const style = document.createElement("style");
    style.id = "feedback-styles";
    style.textContent = `
      .feedback-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: feedbackFadeIn 0.3s ease;
      }

      @keyframes feedbackFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes feedbackFadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }

      @keyframes feedbackSlideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .feedback-modal {
        background: var(--zenburn-bg-light);
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        border: 1px solid var(--border-color);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        animation: feedbackSlideUp 0.4s ease;
        overflow: hidden;
        color: var(--text-main);
      }

      .feedback-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid var(--border-color);
      }

      .feedback-header h3 {
        margin: 0;
        color: var(--zenburn-yellow);
        font-size: 18px;
      }

      .feedback-close-btn {
        background: none;
        border: none;
        color: var(--text-dim);
        font-size: 1.8rem;
        line-height: 1;
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

      .feedback-close-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: var(--text-main);
      }

      .feedback-body {
        padding: 20px;
      }

      .feedback-body p {
        margin: 0 0 16px 0;
        line-height: 1.5;
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
        border: 2px solid var(--border-color);
        border-radius: 4px;
        color: var(--text-main);
        cursor: pointer;
        transition: all 0.3s ease;
        min-height: 100px;
        font-family: inherit;
        font-size: 13px;
      }

      .contact-option:hover {
        background: rgba(143, 178, 143, 0.1);
        border-color: var(--zenburn-green);
        transform: translateY(-3px);
      }

      .contact-option.selected {
        background: rgba(143, 178, 143, 0.2);
        border-color: var(--zenburn-green);
      }

      .contact-option .contact-icon {
        font-size: 2rem;
        margin-bottom: 8px;
      }

      .contact-info {
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid var(--border-color);
      }

      .email-display {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 4px;
        margin: 10px 0;
        flex-wrap: wrap;
      }

      .email-display code {
        flex-grow: 1;
        font-family: monospace;
        color: var(--zenburn-cyan);
        padding: 5px 10px;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
        word-break: break-all;
      }

      .copy-btn {
        padding: 8px 15px;
        background: var(--zenburn-green);
        color: #000;
        border: none;
        border-radius: 20px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: inherit;
        font-size: 13px;
      }

      .copy-btn:hover {
        background: var(--zenburn-cyan);
      }

      .feedback-link {
        display: block;
        padding: 12px;
        text-align: center;
        border-radius: 4px;
        text-decoration: none;
        font-weight: bold;
        margin-top: 10px;
        transition: all 0.2s ease;
        font-size: 13px;
      }

      .feedback-link.email {
        background: var(--zenburn-green);
        color: #000;
      }

      .feedback-link.email:hover {
        background: var(--zenburn-cyan);
      }

      .feedback-link.telegram {
        background: #0088cc;
        color: white;
      }

      .feedback-link.telegram:hover {
        background: #00a0ee;
      }

      .feedback-hint {
        font-size: 13px;
        color: var(--text-dim);
        margin: 10px 0;
        line-height: 1.4;
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
    `;
    document.head.appendChild(style);
  }

  // ============ ОБРАБОТЧИКИ ============
  setupEventListeners() {
    const feedbackBtn = document.getElementById("feedbackBtn");
    if (feedbackBtn && !feedbackBtn.dataset.feedbackBound) {
      feedbackBtn.addEventListener("click", () => this.showModal());
      feedbackBtn.dataset.feedbackBound = "1";
    }
  }

  // ============ МОДАЛКА ============
  showModal() {
    // Защита от двойного открытия
    if (this.overlay) return;

    const overlay = document.createElement("div");
    overlay.className = "feedback-overlay";

    overlay.innerHTML = `
      <div class="feedback-modal" role="dialog" aria-modal="true">
        <div class="feedback-header">
          <h3>${this.t("feedback.title", "Feedback")}</h3>
          <button class="feedback-close-btn" aria-label="Close">&times;</button>
        </div>

        <div class="feedback-body">
          <p>${this.t("feedback.intro", "Contact me!")}</p>

          <div class="contact-options">
            <button class="contact-option" data-type="email" type="button">
              <span class="contact-icon">📧</span>
              <span>${this.t("feedback.writeEmail", "Write to email")}</span>
            </button>

            <button class="contact-option" data-type="telegram" type="button">
              <span class="contact-icon">✈️</span>
              <span>${this.t("feedback.telegram", "Telegram")}</span>
            </button>
          </div>

          <div class="contact-info" id="feedbackContactInfo">
            <div class="feedback-hint">${this.t("feedback.hint", "Choose contact method")}</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    this.overlay = overlay;

    const closeBtn = overlay.querySelector(".feedback-close-btn");
    const contactOptions = overlay.querySelectorAll(".contact-option");
    const contactInfo = overlay.querySelector("#feedbackContactInfo");

    const closeModal = () => {
      overlay.style.animation = "feedbackFadeOut 0.3s ease";
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (this.overlay === overlay) this.overlay = null;
      }, 300);
      document.removeEventListener("keydown", closeOnEscape);
    };

    const closeOnEscape = (e) => {
      if (e.key === "Escape") closeModal();
    };

    closeBtn.addEventListener("click", closeModal);

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener("keydown", closeOnEscape);

    // Выбор способа связи
    contactOptions.forEach((option) => {
      option.addEventListener("click", (e) => {
        const type = e.currentTarget.dataset.type;

        contactOptions.forEach((opt) => opt.classList.remove("selected"));
        e.currentTarget.classList.add("selected");

        if (type === "email") {
          this.showEmailInfo(contactInfo);
        } else if (type === "telegram") {
          this.showTelegramInfo(contactInfo);
        }
      });
    });
  }

  // ============ EMAIL ============
  showEmailInfo(container) {
    const encodedSubject = encodeURIComponent(this.getSubject());
    const defaultBody = encodeURIComponent(
      this.t("feedback.emailBody", "Sent from: Gypsy Fret"),
    );
    const mailtoLink = `mailto:${FEEDBACK_CONFIG.email}?subject=${encodedSubject}&body=${defaultBody}`;

    container.innerHTML = `
      <div class="feedback-hint">${this.t("feedback.emailHint", "Write me an email:")}</div>

      <div class="email-display">
        <code id="feedbackEmailValue">${FEEDBACK_CONFIG.email}</code>
        <button class="copy-btn" id="feedbackCopyEmailBtn" type="button">
          ${this.t("feedback.copy", "Copy")}
        </button>
      </div>

      <div class="feedback-hint">${this.t("feedback.emailOrOpen", "Or open your email client:")}</div>

      <a href="${mailtoLink}" target="_blank" rel="noopener" class="feedback-link email">
        📧 ${this.t("feedback.openEmail", "Open Email Client")}
      </a>
    `;

    this.setupCopyButton(
      container.querySelector("#feedbackCopyEmailBtn"),
      FEEDBACK_CONFIG.email,
    );
  }

  // ============ TELEGRAM ============
  showTelegramInfo(container) {
    const telegramLink = `https://t.me/${FEEDBACK_CONFIG.telegram.replace("@", "")}`;

    container.innerHTML = `
      <div class="feedback-hint">${this.t("feedback.telegramHint", "Write me on Telegram:")}</div>

      <div class="email-display">
        <code id="feedbackTelegramValue">${FEEDBACK_CONFIG.telegram}</code>
        <button class="copy-btn" id="feedbackCopyTelegramBtn" type="button">
          ${this.t("feedback.copy", "Copy")}
        </button>
      </div>

      <div class="feedback-hint">${this.t("feedback.telegramOrOpen", "Or open Telegram:")}</div>

      <a href="${telegramLink}" target="_blank" rel="noopener" class="feedback-link telegram">
        ✈️ ${this.t("feedback.openTelegram", "Open Telegram")}
      </a>
    `;

    this.setupCopyButton(
      container.querySelector("#feedbackCopyTelegramBtn"),
      FEEDBACK_CONFIG.telegram,
    );
  }

  // ============ ОБЩИЙ КОПИРОВЩИК ============
  setupCopyButton(btn, text) {
    if (!btn) return;

    const originalLabel = btn.textContent;

    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(text);
        btn.textContent = "✓ " + this.t("feedback.copied", "Copied!");
        btn.style.background = "#00cc00";
        btn.style.color = "#000";
      } catch (err) {
        console.error("Clipboard error:", err);
        btn.textContent = this.t("feedback.error", "Error!");
        btn.style.background = "#ff4444";
        btn.style.color = "#fff";
      }

      setTimeout(() => {
        btn.textContent = originalLabel;
        btn.style.background = "";
        btn.style.color = "";
      }, 2000);
    });
  }

  // Закрыть модалку, если открыта (например, при смене языка)
  closeIfOpen() {
    if (this.overlay && this.overlay.parentNode) {
      this.overlay.parentNode.removeChild(this.overlay);
      this.overlay = null;
    }
  }
}

// Глобальный экземпляр
window.FeedbackManager = new FeedbackManager();

// Автоинициализация
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.FeedbackManager.init();
  });
} else {
  window.FeedbackManager.init();
}