// ====================
// Рабочий стол и обои
// ====================

class Desktop {
    constructor() {
        this.desktop = document.getElementById('desktop');
        this.iconsContainer = document.getElementById('desktop-icons');
        this.currentWallpaper = 'gradient-1';
        this.theme = 'light';
        this.animationsEnabled = true;
        this.init();
    }

    init() {
        this.setupIcons();
        this.setupWallpapers();
        this.setupDesktopClick();
        this.applyTheme(this.theme);
        this.applyAnimations(this.animationsEnabled);
    }

    setupIcons() {
        const icons = this.iconsContainer.querySelectorAll('.icon');
        
        icons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleIconClick(icon);
            });

            icon.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const app = icon.dataset.app;
                this.openApp(app);
            });
        });
    }

    setupWallpapers() {
        const options = document.querySelectorAll('.wallpaper-option');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.changeWallpaper(option.style.background);
            });
        });
    }

    setupDesktopClick() {
        this.desktop.addEventListener('click', () => {
            this.blurIcons();
        });

        this.iconsContainer.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    handleIconClick(icon) {
        this.blurIcons();
        icon.classList.add('focused');

        // Контекстное меню при правом клике
        icon.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showIconMenu(e, icon);
        });
    }

    blurIcons() {
        this.iconsContainer.querySelectorAll('.icon.focused').forEach(i => {
            i.classList.remove('focused');
        });
    }

    showIconMenu(e, icon) {
        const menu = document.createElement('div');
        menu.className = 'icon-menu animate-fade-in';
        menu.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            background: var(--bg-light);
            border-radius: 8px;
            box-shadow: var(--shadow);
            padding: 8px;
            z-index: 10000;
            min-width: 150px;
        `;

        const app = icon.dataset.app;
        const menuItems = [
            { icon: '🚀', label: 'Открыть', action: () => this.openApp(app) },
            { icon: '🗑️', label: 'Удалить', action: () => this.removeIcon(icon) },
            { icon: '🎨', label: 'Свойства', action: () => console.log('Свойства') }
        ];

        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item hover-effect click-effect';
            menuItem.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                color: var(--text-primary);
                font-size: 14px;
            `;
            menuItem.innerHTML = `${item.icon} ${item.label}`;
            menuItem.addEventListener('click', () => {
                menu.remove();
                item.action();
            });
            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);

        // Закрыть при клике вне меню
        const closeMenu = () => {
            menu.remove();
            document.removeEventListener('click', closeMenu);
        };
        document.addEventListener('click', closeMenu);
    }

    changeWallpaper(background) {
        this.currentWallpaper = background;
        this.desktop.style.background = background;
    }

    applyTheme(theme) {
        this.theme = theme;
        const root = document.documentElement;
        const body = document.body;
        const authCard = document.querySelector('.auth-card');
        const windows = document.querySelectorAll('.window');
        const startMenu = document.getElementById('start-menu');

        if (theme === 'dark') {
            body.classList.add('dark-mode');
            root.style.setProperty('--bg-light', '#1a1a2e');
            root.style.setProperty('--bg-light-secondary', '#16213e');
            root.style.setProperty('--text-primary', '#e0e0e0');
            root.style.setProperty('--text-secondary', '#a0a0b0');
            
            if (authCard) authCard.classList.add('dark-mode');
            
            windows.forEach(win => win.classList.add('dark-mode'));
            
            if (startMenu) startMenu.classList.add('dark-mode');
            
            document.querySelectorAll('.taskbar').forEach(t => t.classList.add('dark-mode'));
            document.querySelectorAll('.chat-content').forEach(c => c.classList.add('dark-mode'));
            
            // Обновить обои с затемнением
            this.desktop.style.background = `linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)`;
            
        } else {
            body.classList.remove('dark-mode');
            root.style.setProperty('--bg-light', '#ffffff');
            root.style.setProperty('--bg-light-secondary', '#f8f9fa');
            root.style.setProperty('--text-primary', '#1a1a2e');
            root.style.setProperty('--text-secondary', '#6e6e80');
            
            if (authCard) authCard.classList.remove('dark-mode');
            
            windows.forEach(win => win.classList.remove('dark-mode'));
            
            if (startMenu) startMenu.classList.remove('dark-mode');
            
            document.querySelectorAll('.taskbar').forEach(t => t.classList.remove('dark-mode'));
            document.querySelectorAll('.chat-content').forEach(c => c.classList.remove('dark-mode'));
            
            this.applyWallpaper(this.currentWallpaper);
        }
    }

    applyWallpaper(type) {
        if (type === 'gradient-1') {
            this.desktop.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        } else if (type === 'gradient-2') {
            this.desktop.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
        } else if (type === 'gradient-3') {
            this.desktop.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
        } else if (type === 'gradient-4') {
            this.desktop.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
        } else if (type === 'gradient-5') {
            this.desktop.style.background = 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
        } else {
            this.desktop.style.background = type;
        }
    }

    applyAnimations(enabled) {
        this.animationsEnabled = enabled;
        if (!enabled) {
            document.body.classList.add('no-animations');
            document.documentElement.style.setProperty('--transition-all', 'none');
        } else {
            document.body.classList.remove('no-animations');
            document.documentElement.style.setProperty('--transition-all', '0.3s ease');
        }
    }

    openApp(appId) {
        if (window.openApp) {
            window.openApp(appId);
        }
    }

    removeIcon(icon) {
        icon.remove();
    }
}

function initDesktop() {
    window.desktop = new Desktop();
}
