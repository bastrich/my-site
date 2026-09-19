document.addEventListener('DOMContentLoaded', function () {
    const url = document.querySelector('link[rel="canonical"]').href;
    const title = document.querySelector('.article-title').textContent.trim().replace(/\s+/g, ' ');

    const copyButton = document.querySelector('[data-share-copy]');
    const copyLabel = copyButton.querySelector('.share-btn__label');
    const status = document.querySelector('.share-status');
    let copyTimer;

    copyButton.hidden = false;
    copyButton.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(url);
        } catch (e) {
            const link = document.createElement('span');
            link.className = 'share-status__url';
            link.textContent = url;
            status.replaceChildren('Copy the link manually: ', link);
            status.classList.add('is-visible');
            window.getSelection().selectAllChildren(link);
            return;
        }

        status.classList.remove('is-visible');
        copyButton.classList.add('is-copied');
        copyLabel.textContent = 'Copied';
        status.textContent = 'Link copied to clipboard';

        clearTimeout(copyTimer);
        copyTimer = setTimeout(() => {
            copyButton.classList.remove('is-copied');
            copyLabel.textContent = 'Copy link';
            status.textContent = '';
        }, 2000);
    });


    if (typeof navigator.share !== 'function' || !window.matchMedia('(pointer: coarse)').matches) return;
    const nativeButton = document.querySelector('[data-share-native]');
    nativeButton.hidden = false;
    nativeButton.addEventListener('click', async () => {
        try {
            await navigator.share({title, url});
        } catch (e) {
        }
    });
});
