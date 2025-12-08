(function () {
    const modal = document.getElementById('contact-modal');
    const openBtn = document.getElementById('cta-talk');
    const closeBtn = document.getElementById('contact-modal-close');

    if (!modal || !openBtn || !closeBtn) return;

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
            numberParts: ['+34', '663', '909951'],
            labelParts: ['@', 'daniil.', 'bastrich']
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
        return cfg.labelParts.join('');
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
        }

        if (waLink && waText) {
            const waNumber = buildWhatsAppNumber(contactData.whatsapp);
            const waLabel = buildWhatsAppLabel(contactData.whatsapp);
            waLink.href = 'https://' + 'wa.me/' + waNumber;
            waText.textContent = waLabel;
        }

        if (tgLink && tgText) {
            const username = buildTelegramUser(contactData.telegram);
            tgLink.href = 'https://' + 't.me/' + username;
            tgText.textContent = '@' + username;
        }

        if (lnLink && lnText) {
            const path = buildLinkedInPath(contactData.linkedin);
            const url = 'https://' + 'www.linkedin.com/' + 'in/' + path + '/';
            lnLink.href = url;
            lnText.textContent = 'linkedin.com/in/' + path;
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
