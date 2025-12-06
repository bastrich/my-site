// index.js

(function () {
    // Берём элементы из DOM
    const modal = document.getElementById('contact-modal');
    const openBtn = document.getElementById('cta-talk');              // кнопка "Let’s talk"
    const closeBtn = document.getElementById('contact-modal-close');

    // Если чего-то нет — тихо выходим
    if (!modal || !openBtn || !closeBtn) return;

    const emailLink = document.getElementById('contact-email-link');
    const emailText = document.getElementById('contact-email-text');

    const waLink = document.getElementById('contact-whatsapp-link');
    const waText = document.getElementById('contact-whatsapp-text');

    const tgLink = document.getElementById('contact-telegram-link');
    const tgText = document.getElementById('contact-telegram-text');

    const lnLink = document.getElementById('contact-linkedin-link');
    const lnText = document.getElementById('contact-linkedin-text');

    // ---------- ОБФУСКИРОВАННЫЕ ДАННЫЕ (ЗАМЕНИ НА СВОИ) ----------
    const contactData = {
        email: {
            // получится: name.surname@domain.com
            nameParts: ['dan'],      // <--- поменяй
            domainParts: ['bastrich.tech']       // <--- поменяй
        },
        whatsapp: {
            // получится номер: 1234567890
            numberParts: ['+34', '663', '909951'], // <--- твой номер по частям
            labelParts: ['@', 'daniil.', 'bastrich']     // <--- ник, который видит пользователь
        },
        telegram: {
            // получится username: your_telegram
            usernameParts: ['pla', 'strich'] // <--- твой username
        },
        linkedin: {
            // получится slug: your-linkedin
            pathParts: ['daniil', '-bastrich', '-311508155']     // <--- slug профиля
        }
    };

    function buildEmail(cfg) {
        const local = cfg.nameParts.join('.');
        const domain = cfg.domainParts.join('.');
        return local + '@' + domain;
    }

    function buildWhatsAppNumber(cfg) {
        return cfg.numberParts.join('');
    }

    function buildWhatsAppLabel(cfg) {
        return cfg.labelParts.join('');
    }

    function buildTelegramUser(cfg) {
        return cfg.usernameParts.join('');
    }

    function buildLinkedInPath(cfg) {
        return cfg.pathParts.join('');
    }

    let contactsInitialized = false;

    // Подставляем контакты ТОЛЬКО один раз, при первом открытии
    function initContactsOnce() {
        if (contactsInitialized) return;

        // Email
        if (emailLink && emailText) {
            const email = buildEmail(contactData.email);
            emailLink.href = 'mailto:' + email;
            emailText.textContent = email;
        }

        // WhatsApp
        if (waLink && waText) {
            const waNumber = buildWhatsAppNumber(contactData.whatsapp);
            const waLabel = buildWhatsAppLabel(contactData.whatsapp);
            waLink.href = 'https://' + 'wa.me/' + waNumber;
            waText.textContent = waLabel; // показываем ник, номер остаётся только в href
        }

        // Telegram
        if (tgLink && tgText) {
            const username = buildTelegramUser(contactData.telegram);
            tgLink.href = 'https://' + 't.me/' + username;
            tgText.textContent = '@' + username;
        }

        // LinkedIn
        if (lnLink && lnText) {
            const path = buildLinkedInPath(contactData.linkedin);
            const url = 'https://' + 'www.linkedin.com/' + 'in/' + path + '/';
            lnLink.href = url;
            lnText.textContent = 'linkedin.com/in/' + path;
        }

        contactsInitialized = true;
    }

    // ---------- ЛОГИКА МОДАЛКИ ----------

    function openModal() {
        // ВАЖНО: собираем и вставляем контакты только здесь
        initContactsOnce();

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    // Навешиваем обработчики СРАЗУ (DOM уже есть, скрипт внизу страницы)
    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
})();
