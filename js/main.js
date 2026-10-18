// ====================
// Основной файл ОС
// ====================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация часов
    initClock();
    
    // Инициализация taskbar
    initTaskbar();
    
    // Инициализация настроек
    initSettings();
});

// ====================
// Часы
// ====================

function initClock() {
    const clock = document.getElementById('clock');
    
    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        clock.textContent = `${hours}:${minutes}`;
        
        // Каждую секунду
        setTimeout(updateClock, 1000);
    }
    
    updateClock();
}

// ====================
// Taskbar
// ====================

function initTaskbar() {
    const startMenu = document.getElementById('start-menu');
    const startBtn = document.querySelector('.start-btn');
    
    // Открыть/закрыть меню
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('active');
    });
    
    // Закрыть меню при клике вне
    document.addEventListener('click', () => {
        startMenu.classList.remove('active');
    });
    
    // Обработчики пунктов меню
    startMenu.querySelectorAll('.start-item').forEach(item => {
        item.addEventListener('click', (e) => {
            startMenu.classList.remove('active');
            const app = item.dataset.app;
            if (window.openApp) {
                window.openApp(app);
            }
        });
    });
    
    // Кнопка выключения
    document.querySelector('.power-btn')?.addEventListener('click', () => {
        if (window.authService) {
            window.authService.logout();
        }
    });
}

// ====================
// Настройки
// ====================

function initSettings() {
    const settingsBtn = document.querySelector('.icon[data-app="settings"]');
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            openSettings();
        });
    }
}

function openSettings() {
    const content = document.getElementById('settings-modal');
    content.style.display = 'block';
    
    // Применить настройки при изменении
    const themeOptions = document.querySelectorAll('.theme-option');
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            themeOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            const theme = option.dataset.theme;
            
            if (window.desktop) {
                window.desktop.applyTheme(theme);
            }
            
            // Сохранить в localStorage
            if (window.authService && window.authService.currentUser) {
                window.authService.currentUser.settings.theme = theme;
                localStorage.setItem('webos_currentUser', JSON.stringify(window.authService.currentUser));
            }
        });
    });
    
    // Обои
    const wallpaperOptions = document.querySelectorAll('.wallpaper-option');
    wallpaperOptions.forEach(option => {
        option.addEventListener('click', () => {
            wallpaperOptions.forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            
            if (window.desktop) {
                window.desktop.changeWallpaper(option.style.background);
            }
        });
    });
    
    // Анимации
    document.getElementById('animations-toggle')?.addEventListener('change', (e) => {
        if (window.desktop) {
            window.desktop.applyAnimations(e.target.checked);
        }
    });
    
    // Закрыть
    content.querySelector('.close-btn')?.addEventListener('click', () => {
        content.style.display = 'none';
    });
}
