(function () {
    const modal = document.getElementById('contact-modal');
    const openBtns = document.querySelectorAll('.hero-cta');
    const closeBtn = document.getElementById('contact-modal-close');
    if (!modal || !openBtns.length || !closeBtn) return;
    const emailLink = document.getElementById('contact-email-link');
    const emailText = document.getElementById('contact-email-text');
    const waLink = document.getElementById('contact-whatsapp-link');
    const waText = document.getElementById('contact-whatsapp-text');
    const tgLink = document.getElementById('contact-telegram-link');
    const tgText = document.getElementById('contact-telegram-text');
    const lnLink = document.getElementById('contact-linkedin-link');
    const lnText = document.getElementById('contact-linkedin-text');
    const contactData = {
        email: {
            nameParts: ['dan'],
            domainParts: ['bastrich.tech']
        },
        whatsapp: {
            numberParts: ['+34', '663', '909', '951'],
        },
        telegram: {
            usernameParts: ['pla', 'strich']
        },
        linkedin: {
            pathParts: ['daniil', '-bastrich', '-311508155']
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
        return cfg.numberParts[0] + ' ' + cfg.numberParts[1] + '-' + cfg.numberParts[2] + '-' + cfg.numberParts[3];
    }
    function buildTelegramUser(cfg) {
        return cfg.usernameParts.join('');
    }
    function buildLinkedInPath(cfg) {
        return cfg.pathParts.join('');
    }
    let contactsInitialized = false;
    function initContactsOnce() {
        if (contactsInitialized) return;
        if (emailLink && emailText) {
            const email = buildEmail(contactData.email);
            emailLink.href = 'mailto:' + email;
            emailText.textContent = email;
            const copyBtn = emailLink.querySelector('.contact-copy-btn');
            if (copyBtn) copyBtn.setAttribute('data-copy', email);
        }
        if (waLink && waText) {
            const waNumber = buildWhatsAppNumber(contactData.whatsapp);
            const waLabel = buildWhatsAppLabel(contactData.whatsapp);
            waLink.href = 'https://' + 'wa.me/' + waNumber;
            waText.textContent = waLabel;
            const copyBtn = waLink.querySelector('.contact-copy-btn');
            if (copyBtn) copyBtn.setAttribute('data-copy', waNumber);
        }
        if (tgLink && tgText) {
            const username = buildTelegramUser(contactData.telegram);
            tgLink.href = 'https://' + 't.me/' + username;
            tgText.textContent = '@' + username;
            const copyBtn = tgLink.querySelector('.contact-copy-btn');
            if (copyBtn) copyBtn.setAttribute('data-copy', '@' + username);
        }
        if (lnLink && lnText) {
            const path = buildLinkedInPath(contactData.linkedin);
            const url = 'https://' + 'www.linkedin.com/' + 'in/' + path + '/';
            lnLink.href = url;
            lnText.textContent = 'linkedin.com/in/' + path;
            const copyBtn = lnLink.querySelector('.contact-copy-btn');
            if (copyBtn) copyBtn.setAttribute('data-copy', url);
        }
        contactsInitialized = true;
    }
    function openModal() {
        initContactsOnce();
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }
    openBtns.forEach(function (btn) {
        btn.addEventListener('click', openModal);
    });
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


    const copyButtons = document.querySelectorAll('.contact-copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            // Останавливаем клик, чтобы не сработал переход по ссылке .contact-item
            e.preventDefault();
            e.stopPropagation();

            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            try {
                // Копируем текст в буфер
                await navigator.clipboard.writeText(textToCopy);

                // Добавляем класс для красивой анимации (замена на зеленую галочку)
                btn.classList.add('copied');

                // Возвращаем исходную иконку через 2 секунды
                setTimeout(() => {
                    btn.classList.remove('copied');
                }, 2000);

            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    });
})();