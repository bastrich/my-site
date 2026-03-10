document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalWrapper = document.querySelector('.image-modal-wrapper');
    const closeBtn = document.querySelector('.image-modal-close');

    // Открытие модалки при клике на изображение
    document.querySelectorAll('.article-image').forEach(img => {
        img.addEventListener('click', function() {
            modal.classList.add('is-open');
            modalImg.src = this.src;
            modalImg.alt = this.alt;

            // Проверяем, есть ли подпись (figcaption)
            const figure = this.closest('figure');
            if (figure) {
                const caption = figure.querySelector('figcaption');
                if (caption) {
                    modalCaption.innerHTML = caption.innerHTML;
                    modalCaption.style.display = 'block';
                } else {
                    modalCaption.style.display = 'none';
                }
            } else {
                modalCaption.style.display = 'none';
            }

            document.body.style.overflow = 'hidden'; // Блокируем скролл
        });
    });

    // Закрытие модалки
    function closeModal() {
        modal.classList.remove('is-open');
        document.body.style.overflow = ''; // Возвращаем скролл
    }

    // Клик по кнопке закрытия
    closeBtn.addEventListener('click', closeModal);

    // Клик по backdrop, wrapper или картинке (но не по подписи)
    modal.addEventListener('click', function(e) {
        // Закрываем если клик по:
        // - backdrop (фон)
        // - wrapper (пространство вокруг картинки и подписи)
        // - картинке
        // НЕ закрываем если клик по подписи или её содержимому
        if (e.target === modal ||
            e.target === modalWrapper ||
            e.target === modalImg) {
            closeModal();
        }
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
});