// ====================
// Диспетчер окон
// ====================

class WindowManager {
    constructor() {
        this.zIndex = 100;
        this.windows = new Map();
        this.currentFocusedWindow = null;
        this.init();
    }

    init() {
        this.container = document.getElementById('windows-container');
        this.setupWindowClick();
    }

    createWindow(options) {
        const { id, title, icon, content, width = 600, height = 400, x = 100, y = 100, app } = options;
        
        const windowEl = document.createElement('div');
        windowEl.className = 'window animate-scale-up';
        windowEl.id = id;
        windowEl.style.width = `${width}px`;
        windowEl.style.height = `${height}px`;
        windowEl.style.left = `${x}px`;
        windowEl.style.top = `${y}px`;
        windowEl.style.zIndex = ++this.zIndex;

        // Заголовок окна
        const header = document.createElement('div');
        header.className = 'window-header';
        header.innerHTML = `
            <h3>${icon ? `<span style="margin-right: 8px;">${icon}</span>` : ''}${title}</h3>
            <div class="window-controls">
                <button class="minimize-btn">−</button>
                <button class="maximize-btn">□</button>
                <button class="close-btn">✕</button>
            </div>
        `;

        // Контент
        const contentEl = document.createElement('div');
        contentEl.className = 'window-content';
        if (typeof content === 'string') {
            contentEl.innerHTML = content;
        } else {
            contentEl.appendChild(content);
        }

        windowEl.appendChild(header);
        windowEl.appendChild(contentEl);

        this.container.appendChild(windowEl);

        // Обработчики
        this.setupWindowDrag(windowEl, header);
        this.setupWindowControls(windowEl, header);

        const windowData = { el: windowEl, title, icon, app, minimized: false, maximized: false, originalSize: { width, height } };
        this.windows.set(id, windowData);

        this.focusWindow(windowEl);

        // Анимация появления
        setTimeout(() => {
            windowEl.classList.remove('animate-scale-up');
            windowEl.classList.add('animate-slide-in');
        }, 10);

        return windowEl;
    }

    setupWindowClick() {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.window')) {
                this.blurAllWindows();
            }
        });
    }

    setupWindowDrag(windowEl, header) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (windowEl.classList.contains('maximized')) return;

            this.focusWindow(windowEl);
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = windowEl.offsetLeft;
            initialTop = windowEl.offsetTop;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            windowEl.style.left = `${initialLeft + dx}px`;
            windowEl.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                header.style.cursor = 'grab';
            }
        });
    }

    setupWindowControls(windowEl, header) {
        const minimizeBtn = windowEl.querySelector('.minimize-btn');
        const maximizeBtn = windowEl.querySelector('.maximize-btn');
        const closeBtn = windowEl.querySelector('.close-btn');

        minimizeBtn.addEventListener('click', () => {
            const windowData = this.windows.get(windowEl.id);
            if (windowData) {
                windowData.minimized = true;
                windowEl.style.display = 'none';
                this.updateTaskbarIcon(windowEl.id, false);
            }
        });

        maximizeBtn.addEventListener('click', () => {
            const windowData = this.windows.get(windowEl.id);
            if (windowData) {
                if (windowData.maximized) {
                    // Восстановить
                    windowEl.style.width = `${windowData.originalSize.width}px`;
                    windowEl.style.height = `${windowData.originalSize.height}px`;
                    windowEl.style.left = '100px';
                    windowEl.style.top = '100px';
                    windowData.maximized = false;
                } else {
                    // Максимизировать
                    windowData.originalSize = {
                        width: parseInt(windowEl.style.width),
                        height: parseInt(windowEl.style.height)
                    };
                    windowEl.style.width = `calc(100vw - 20px)`;
                    windowEl.style.height = `calc(100vh - 70px)`;
                    windowEl.style.left = '10px';
                    windowEl.style.top = '10px';
                    windowData.maximized = true;
                }
            }
        });

        closeBtn.addEventListener('click', () => {
            const windowData = this.windows.get(windowEl.id);
            if (windowData && windowData.app) {
                this.closeApp(windowData.app);
            }
            windowEl.remove();
            this.windows.delete(windowEl.id);
            this.updateTaskbarIcon(windowEl.id, false);
        });
    }

    focusWindow(windowEl) {
        windowEl.style.zIndex = ++this.zIndex;
        windowEl.classList.add('focused');
        this.currentFocusedWindow = windowEl;

        // Обновить иконку в taskbar
        const windowData = this.windows.get(windowEl.id);
        if (windowData) {
            this.updateTaskbarIcon(windowEl.id, true);
        }
    }

    blurAllWindows() {
        document.querySelectorAll('.window.focused').forEach(w => {
            w.classList.remove('focused');
        });
        this.currentFocusedWindow = null;
    }

    updateTaskbarIcon(windowId, isActive) {
        const taskbarApp = document.querySelector(`[data-window-id="${windowId}"]`);
        if (taskbarApp) {
            if (isActive) {
                taskbarApp.classList.add('active');
            } else {
                taskbarApp.classList.remove('active');
            }
        }
    }

    closeApp(appId) {
        const taskbarApp = document.querySelector(`[data-app-id="${appId}"]`);
        if (taskbarApp) {
            taskbarApp.remove();
        }
    }

    minimizeAll() {
        this.windows.forEach((data, id) => {
            if (!data.minimized) {
                data.minimized = true;
                data.el.style.display = 'none';
            }
        });
    }

    showAll() {
        this.windows.forEach((data, id) => {
            if (data.minimized) {
                data.minimized = false;
                data.el.style.display = 'flex';
                this.focusWindow(data.el);
            }
        });
    }
}

// Глобальный экземпляр
window.windowManager = new WindowManager();

function initWindowManager() {
    window.windowManager = new WindowManager();
}
