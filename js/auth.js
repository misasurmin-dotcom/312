// ====================
// Система авторизации
// ====================

class AuthService {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('webos_users') || '[]');
        this.currentUser = JSON.parse(localStorage.getItem('webos_currentUser') || 'null');
        this.init();
    }

    init() {
        this.setupAuthTabs();
        this.setupLoginForm();
        this.setupRegisterForm();
        this.setupSocialAuth();
    }

    setupAuthTabs() {
        const tabs = document.querySelectorAll('.auth-tab');
        const forms = document.querySelectorAll('.auth-form');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const tabName = tab.dataset.tab;
                forms.forEach(form => {
                    form.classList.remove('active');
                    if (form.id === `${tabName}-form`) {
                        form.classList.add('active');
                    }
                });
            });
        });
    }

    setupLoginForm() {
        const loginForm = document.getElementById('login-form');
        const rememberMe = document.getElementById('remember-me');
        const loginUsername = document.getElementById('login-username');

        if (this.currentUser) {
            loginUsername.value = this.currentUser.username;
            rememberMe.checked = true;
        }

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin(rememberMe.checked);
        });
    }

    setupRegisterForm() {
        const registerForm = document.getElementById('register-form');

        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });
    }

    setupSocialAuth() {
        const telegramBtn = document.querySelector('.btn-telegram');
        const discordBtn = document.querySelector('.btn-discord');

        telegramBtn.addEventListener('click', () => this.handleSocialLogin('Telegram'));
        discordBtn.addEventListener('click', () => this.handleSocialLogin('Discord'));
    }

    handleLogin(rememberMe) {
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            this.showAuthError('Пожалуйста, заполните все поля');
            return;
        }

        const user = this.users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            if (rememberMe) {
                localStorage.setItem('webos_currentUser', JSON.stringify(user));
            }
            this.switchToOS();
        } else {
            this.showAuthError('Неверное имя пользователя или пароль');
        }
    }

    handleRegister() {
        const username = document.getElementById('reg-username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm').value;

        if (!username || !email || !password || !confirmPassword) {
            this.showAuthError('Пожалуйста, заполните все поля');
            return;
        }

        if (password !== confirmPassword) {
            this.showAuthError('Пароли не совпадают');
            return;
        }

        if (this.users.find(u => u.username === username)) {
            this.showAuthError('Пользователь с таким именем уже существует');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            this.showAuthError('Пользователь с таким email уже существует');
            return;
        }

        const newUser = {
            username,
            email,
            password,
            settings: {
                wallpaper: 'gradient-1',
                theme: 'light',
                animations: true,
                desktopIcons: true
            }
        };

        this.users.push(newUser);
        localStorage.setItem('webos_users', JSON.stringify(this.users));
        this.currentUser = newUser;
        this.switchToOS();
    }

    handleSocialLogin(provider) {
        const username = `user_${provider}_${Date.now().toString(36)}`;
        const newUser = {
            username,
            email: `${username}@webos.local`,
            password: 'social_login',
            provider,
            settings: {
                wallpaper: 'gradient-1',
                theme: 'light',
                animations: true,
                desktopIcons: true
            }
        };

        this.users.push(newUser);
        localStorage.setItem('webos_users', JSON.stringify(this.users));
        this.currentUser = newUser;
        this.switchToOS();
    }

    showAuthError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #f5576c;
            background: rgba(245, 87, 108, 0.1);
            padding: 10px;
            border-radius: 8px;
            margin-top: 15px;
            animation: shake 0.5s ease;
        `;
        
        const form = document.querySelector('.auth-form.active');
        const existingError = form.querySelector('.auth-error');
        if (existingError) {
            existingError.remove();
        }
        form.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
    }

    switchToOS() {
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('os-interface').style.display = 'block';
        
        const authCard = document.querySelector('.auth-card');
        if (authCard) {
            authCard.classList.remove('dark-mode');
        }

        setTimeout(() => {
            initDesktop();
            initWindowManager();
            initFilemanager();
            initPlayer();
            initBrowser();
            initIDE();
            initChat();
            initSettings();
            initTaskbar();
            initClock();
        }, 500);
    }

    logout() {
        localStorage.removeItem('webos_currentUser');
        this.currentUser = null;
        location.reload();
    }
}

// Инициализация сервиса при загрузке
document.addEventListener('DOMContentLoaded', () => {
    window.authService = new AuthService();
});
