// ====================
// Чат (Telegram/Discord)
// ====================

class Chat {
    constructor(platform) {
        this.platform = platform;
        this.messages = this.getMockMessages();
        this.currentChat = 'General';
        this.init();
    }

    getMockMessages() {
        return {
            General: [
                { user: 'Admin', text: 'Добро пожаловать в чат!', time: '10:00', type: 'incoming' },
                { user: 'User1', text: 'Привет всем! 👋', time: '10:01', type: 'incoming' },
                { user: 'User2', text: 'Классная ОС получилась!', time: '10:02', type: 'incoming' },
                { user: 'User1', text: 'Да, анимации супер', time: '10:03', type: 'incoming' }
            ],
            'Telegram Official': [
                { user: 'Bot', text: 'Добро пожаловать в Telegram!', time: '09:30', type: 'incoming' },
                { user: 'User', text: 'Как настроить бота?', time: '09:35', type: 'incoming' }
            ],
            Discord: [
                { user: 'Mod', text: 'Правила: не спамить', time: '08:00', type: 'incoming' },
                { user: 'User', text: 'Спасибо!', time: '08:15', type: 'incoming' }
            ]
        };
    }

    init() {
        this.container = document.getElementById('chat-container');
        this.header = document.getElementById('chat-header');
        this.content = document.getElementById('chat-content');
        this.input = document.getElementById('chat-input');
        this.sendMessageBtn = document.getElementById('chat-send-btn');
        
        this.renderChatList();
        this.renderMessages();
        this.setupInput();
    }

    renderChatList() {
        const chats = ['General', 'Telegram Official', 'Discord'];
        let html = '<div class="chat-sidebar">';
        chats.forEach(chat => {
            const activeClass = chat === this.currentChat ? 'active' : '';
            html += `<div class="chat-item ${activeClass}" data-chat="${chat}">${chat}</div>`;
        });
        html += '</div>';
        this.container.querySelector('.chat-sidebar')?.remove();
        const sidebar = document.createElement('div');
        sidebar.className = 'chat-sidebar';
        sidebar.innerHTML = html;
        this.container.insertBefore(sidebar, this.container.firstChild);

        sidebar.querySelectorAll('.chat-item').forEach(item => {
            item.addEventListener('click', () => {
                sidebar.querySelectorAll('.chat-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.currentChat = item.dataset.chat;
                this.renderMessages();
            });
        });
    }

    renderMessages() {
        const messages = this.messages[this.currentChat] || [];
        let html = '';
        messages.forEach(msg => {
            html += `
                <div class="message ${msg.type}">
                    <div class="message-user">${msg.user}</div>
                    <div class="message-text">${msg.text}</div>
                    <span class="message-time">${msg.time}</span>
                </div>
            `;
        });
        this.content.innerHTML = html;
        this.content.scrollTop = this.content.scrollHeight;
    }

    setupInput() {
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.input.value.trim()) {
                this.sendMessage();
            }
        });

        this.sendMessageBtn.addEventListener('click', () => this.sendMessage());
    }

    sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        const user = 'Я';
        const time = new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

        this.messages[this.currentChat].push({
            user,
            text,
            time,
            type: 'outgoing'
        });

        this.input.value = '';
        this.renderMessages();
    }
}

function initChat() {
    window.openChat = (platform) => {
        let title, icon, cssClass;
        
        if (platform === 'telegram') {
            title = 'Telegram';
            icon = '✈️';
            cssClass = 'telegram';
        } else {
            title = 'Discord';
            icon = '💬';
            cssClass = 'discord';
        }

        const content = document.createElement('div');
        content.className = `chat-window ${cssClass}`;
        content.innerHTML = `
            <div class="chat-header ${cssClass}-header">
                <span>${icon}</span>
                <h3>${title}</h3>
                <span>● 12 пользователей онлайн</span>
            </div>
            <div class="chat-content" id="chat-content">
                <!-- Сообщения будут добавлены JS -->
            </div>
            <div class="chat-input-area">
                <button class="chat-btn" style="width: 40px; height: 40px; border: none; background: var(--bg-light-secondary); border-radius: 50%; cursor: pointer; font-size: 18px;">📎</button>
                <input type="text" class="chat-input" id="chat-input" placeholder="Написать сообщение...">
                <button class="chat-send-btn" id="chat-send-btn">➤</button>
            </div>
        `;
        
        window.windowManager.createWindow({
            id: 'chat-' + platform + '-' + Date.now(),
            title,
            icon,
            content,
            width: 600,
            height: 500,
            app: 'chat-' + platform
        });

        setTimeout(() => {
            if (!window.chat) window.chat = new Chat(platform);
        }, 100);
    };
}
