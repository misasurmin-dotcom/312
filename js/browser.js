// ====================
// Веб-браузер
// ====================

class Browser {
    constructor() {
        this.history = ['https://webos.local/home'];
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.container = document.getElementById('browser-container');
        this.addressBar = document.getElementById('browser-address');
        this.contentArea = document.getElementById('browser-content');
        
        this.addressBar.value = this.history[this.currentIndex];
    }

    navigate(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        this.history[this.currentIndex + 1] = url;
        this.currentIndex++;
        this.addressBar.value = url;
        
        this.renderPage(url);
    }

    renderPage(url) {
        // Показываем заглушку для внешних сайтов
        if (url !== 'https://webos.local/home') {
            this.contentArea.innerHTML = `
                <div class="browser-placeholder">
                    <h3>🌐 ${url}</h3>
                    <p>Браузер загружает страницу...</p>
                    <p style="margin-top: 20px; color: #888;">(Это демонстрационная ОС, внешние сайты показываются в iframe)</p>
                </div>
            `;
        } else {
            // Домашняя страница
            this.contentArea.innerHTML = `
                <div class="browser-content-wrapper" style="padding: 40px;">
                    <div class="browser-hero">
                        <h1 style="color: var(--primary-color); font-size: 48px; margin-bottom: 20px;">Добро пожаловать в WebOS</h1>
                        <p style="color: var(--text-secondary); font-size: 20px; margin-bottom: 30px;">Ваша операционная система в браузере</p>
                        <div style="display: flex; gap: 15px;">
                            <button style="padding: 12px 24px; background: var(--primary-color); color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s;">Начать</button>
                            <button style="padding: 12px 24px; background: var(--bg-light-secondary); color: var(--text-primary); border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s;">Узнать больше</button>
                        </div>
                    </div>
                    <div style="margin-top: 60px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                        <div style="background: var(--bg-light); padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            <div style="font-size: 32px; margin-bottom: 15px;">🎨</div>
                            <h3 style="margin-bottom: 10px; color: var(--text-primary);">Красивый дизайн</h3>
                            <p style="color: var(--text-secondary);">Современный интерфейс с анимациями и эффектами стекла</p>
                        </div>
                        <div style="background: var(--bg-light); padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            <div style="font-size: 32px; margin-bottom: 15px;">🚀</div>
                            <h3 style="margin-bottom: 10px; color: var(--text-primary);">Быстрый старт</h3>
                            <p style="color: var(--text-secondary);">Запускайтесь мгновенно прямо в браузере</p>
                        </div>
                        <div style="background: var(--bg-light); padding: 20px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                            <div style="font-size: 32px; margin-bottom: 15px;">💻</div>
                            <h3 style="margin-bottom: 10px; color: var(--text-primary);">Все в одном</h3>
                            <p style="color: var(--text-secondary);">Проводник, плеер, редактор кода и больше</p>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    goBack() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.addressBar.value = this.history[this.currentIndex];
            this.renderPage(this.history[this.currentIndex]);
        }
    }

    goForward() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            this.addressBar.value = this.history[this.currentIndex];
            this.renderPage(this.history[this.currentIndex]);
        }
    }

    refresh() {
        this.renderPage(this.addressBar.value);
    }
}

function initBrowser() {
    window.openBrowser = () => {
        const content = document.createElement('div');
        content.className = 'browser';
        content.innerHTML = `
            <div class="browser-toolbar">
                <div class="browser-controls">
                    <button class="browser-btn" id="browser-back">←</button>
                    <button class="browser-btn" id="browser-forward">→</button>
                    <button class="browser-btn" id="browser-refresh">↻</button>
                </div>
                <div class="browser-address" id="browser-address">
                    <span>https://</span>
                    <input type="text" placeholder="Введите адрес..." style="flex: 1; border: none; background: transparent; outline: none; color: var(--text-primary);">
                </div>
                <button class="browser-btn">🔗</button>
                <button class="browser-btn">⭐</button>
            </div>
            <div class="browser-content" id="browser-content">
                <div class="browser-placeholder">
                    <h3>🌐 Веб-браузер</h3>
                    <p>Введите адрес сайта для начала</p>
                </div>
            </div>
        `;
        
        const win = window.windowManager.createWindow({
            id: 'browser-' + Date.now(),
            title: 'Браузер',
            icon: '🌐',
            content: content,
            width: 900,
            height: 600,
            app: 'browser'
        });

        setTimeout(() => {
            const addressInput = win.querySelector('.browser-address input');
            addressInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    if (!window.browser) window.browser = new Browser();
                    window.browser.navigate(addressInput.value);
                }
            });
            
            win.querySelector('#browser-back').addEventListener('click', () => {
                if (!window.browser) window.browser = new Browser();
                window.browser.goBack();
            });
            
            win.querySelector('#browser-forward').addEventListener('click', () => {
                if (!window.browser) window.browser = new Browser();
                window.browser.goForward();
            });
            
            win.querySelector('#browser-refresh').addEventListener('click', () => {
                if (!window.browser) window.browser = new Browser();
                window.browser.refresh();
            });
        }, 100);
    };
}
