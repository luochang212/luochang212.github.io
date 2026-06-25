'use strict'

var externalViewer = {
    currentUrl: '',
    previousFocus: null,
    previousBodyBackground: '',
    initialized: false,
    dragStartY: 0,
    dragStartOffset: 0,
    dragging: false
};

function isMobileViewer() {
    return window.matchMedia('(max-width: 768px)').matches;
}

function getViewerTitle(website, title) {
    if (title) {
        return title;
    }

    try {
        var url = new URL(website, window.location.href);
        var parts = url.pathname.split('/').filter(Boolean);
        return decodeURIComponent(parts[parts.length - 1] || url.hostname);
    } catch (error) {
        return '外部内容';
    }
}

function getViewerSource(website) {
    try {
        return new URL(website, window.location.href).hostname.replace(/^www\./, '');
    } catch (error) {
        return '外部链接';
    }
}

function getDirectNotebookViewerUrl(website) {
    try {
        var url = new URL(website, window.location.href);
        var isNbviewer = url.hostname === 'nbviewer.org' || url.hostname === 'nbviewer.jupyter.org';
        var parts = url.pathname.split('/').filter(Boolean);

        if (isNbviewer && parts[0] === 'github' && parts[3] === 'blob' && parts.length > 5) {
            return 'https://nbviewer.org/urls/raw.githubusercontent.com%3A443/'
                + parts[1] + '/'
                + parts[2] + '/'
                + parts[4] + '/'
                + parts.slice(5).join('/')
                + url.search
                + url.hash;
        }
    } catch (error) {
        return website;
    }

    return website;
}

function setViewerLoading(isLoading) {
    var frame = document.querySelector('.external-viewer-frame');
    var loading = document.getElementById('viewer-loading');

    if (!frame || !loading) {
        return;
    }

    frame.classList.toggle('is-loading', isLoading);
    loading.hidden = !isLoading;
}

function applyViewerLayout() {
    var panel = document.getElementById('mini-window');
    var closeButton = document.getElementById('btn-close');

    if (!document.body.classList.contains('external-viewer-open')) {
        return;
    }

    if (isMobileViewer()) {
        panel.style.width = '';
        closeButton.style.right = '';
        document.body.style.backgroundColor = externalViewer.previousBodyBackground;
    } else {
        var width = window.innerWidth - 60;
        panel.style.width = width + 'px';
        closeButton.style.right = 'calc(100vw - 80px)';
        document.body.style.backgroundColor = 'rgba(0,0,0,0.5)';
    }
}

function finishViewerDrag(event) {
    if (!externalViewer.dragging) {
        return;
    }

    var panel = document.getElementById('mini-window');
    var delta = event.clientY - externalViewer.dragStartY;
    var wasExpanded = document.body.classList.contains('external-viewer-expanded');

    externalViewer.dragging = false;
    panel.classList.remove('is-dragging');
    panel.style.transform = '';

    if (wasExpanded && delta > 70) {
        document.body.classList.remove('external-viewer-expanded');
    } else if (!wasExpanded && delta < -70) {
        document.body.classList.add('external-viewer-expanded');
    } else if (!wasExpanded && delta > 120) {
        overlay_off();
    }
}

function initViewerDrag(handle) {
    handle.addEventListener('pointerdown', function (event) {
        if (!isMobileViewer() || event.button !== 0) {
            return;
        }

        externalViewer.dragging = true;
        externalViewer.dragStartY = event.clientY;
        externalViewer.dragStartOffset = document.body.classList.contains('external-viewer-expanded')
            ? 0
            : window.innerHeight * 0.14;

        handle.setPointerCapture(event.pointerId);
        document.getElementById('mini-window').classList.add('is-dragging');
    });

    handle.addEventListener('pointermove', function (event) {
        if (!externalViewer.dragging) {
            return;
        }

        var offset = externalViewer.dragStartOffset + event.clientY - externalViewer.dragStartY;
        offset = Math.max(0, Math.min(window.innerHeight, offset));
        document.getElementById('mini-window').style.transform = 'translateY(' + offset + 'px)';
    });

    handle.addEventListener('pointerup', finishViewerDrag);
    handle.addEventListener('pointercancel', finishViewerDrag);
}

function initExternalViewer() {
    if (externalViewer.initialized) {
        return;
    }

    var panel = document.getElementById('mini-window');
    var iframe = document.getElementById('mini-iframe');
    var closeButton = document.getElementById('btn-close');

    if (!panel || !iframe || !closeButton) {
        return;
    }

    externalViewer.initialized = true;

    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', '外部代码阅读器');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;

    closeButton.type = 'button';
    closeButton.setAttribute('aria-label', '关闭外部代码阅读器');
    closeButton.setAttribute('title', '返回原页面');
    panel.appendChild(closeButton);

    var mobileHeader = document.createElement('div');
    mobileHeader.id = 'mobile-viewer-header';

    var handle = document.createElement('div');
    handle.className = 'mobile-viewer-handle';
    handle.setAttribute('aria-hidden', 'true');

    var meta = document.createElement('div');
    meta.className = 'mobile-viewer-meta';

    var viewerTitle = document.createElement('strong');
    viewerTitle.id = 'viewer-title';

    var viewerSource = document.createElement('span');
    viewerSource.id = 'viewer-source';

    var externalLink = document.createElement('a');
    externalLink.id = 'viewer-external-link';
    externalLink.target = '_blank';
    externalLink.rel = 'noopener noreferrer';
    externalLink.textContent = '新标签页';

    meta.appendChild(viewerTitle);
    meta.appendChild(viewerSource);
    mobileHeader.appendChild(handle);
    mobileHeader.appendChild(meta);
    mobileHeader.appendChild(externalLink);

    var frame = document.createElement('div');
    frame.className = 'external-viewer-frame';

    var loading = document.createElement('div');
    loading.id = 'viewer-loading';
    loading.setAttribute('role', 'status');
    loading.setAttribute('aria-live', 'polite');
    loading.innerHTML = '<span class="viewer-loading-bar" aria-hidden="true"></span><span>正在加载笔记…</span>';

    iframe.title = '外部内容';
    iframe.addEventListener('load', function () {
        setViewerLoading(false);
    });

    panel.insertBefore(mobileHeader, iframe);
    panel.insertBefore(frame, iframe);
    frame.appendChild(loading);
    frame.appendChild(iframe);

    initViewerDrag(mobileHeader);
    window.addEventListener('resize', applyViewerLayout);
}

function window_on(website, title) {
    initExternalViewer();

    var panel = document.getElementById('mini-window');
    var iframe = document.getElementById('mini-iframe');
    var resolvedTitle = getViewerTitle(website, title);
    var viewerUrl = getDirectNotebookViewerUrl(website);

    externalViewer.currentUrl = viewerUrl;
    externalViewer.previousFocus = document.activeElement;
    externalViewer.previousBodyBackground = document.body.style.backgroundColor;

    document.getElementById('viewer-title').textContent = resolvedTitle;
    document.getElementById('viewer-source').textContent = getViewerSource(website);
    document.getElementById('viewer-external-link').href = website;
    iframe.title = resolvedTitle;

    document.body.classList.remove('external-viewer-expanded');
    document.body.classList.add('external-viewer-open');
    document.getElementById('mini-overlay').style.display = 'block';
    panel.inert = false;
    panel.setAttribute('aria-hidden', 'false');

    applyViewerLayout();
    setViewerLoading(true);
    iframe.src = viewerUrl;

    window.requestAnimationFrame(function () {
        document.getElementById('btn-close').focus();
    });
}

function window_off() {
    var panel = document.getElementById('mini-window');
    var iframe = document.getElementById('mini-iframe');

    document.body.classList.remove('external-viewer-open', 'external-viewer-expanded');
    document.body.style.backgroundColor = externalViewer.previousBodyBackground;
    document.getElementById('mini-overlay').style.display = 'none';
    document.getElementById('btn-close').style.right = '-50px';
    panel.style.width = '0';
    panel.style.transform = '';
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;

    window.setTimeout(function () {
        if (!document.body.classList.contains('external-viewer-open')) {
            iframe.src = 'about:blank';
            externalViewer.currentUrl = '';
        }
    }, 500);

    if (externalViewer.previousFocus && document.contains(externalViewer.previousFocus)) {
        externalViewer.previousFocus.focus();
    }
}

function overlay_on() {
    document.getElementById('mini-overlay').style.display = 'block';
}

function overlay_off() {
    window_off();
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && document.body.classList.contains('external-viewer-open')) {
        event.preventDefault();
        window_off();
    }
});

initExternalViewer();
