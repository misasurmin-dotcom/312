// ====================
// Проводник (файловый менеджер)
// ====================

class Filemanager {
    constructor() {
        this.currentPath = 'home';
        this.files = this.getMockFiles();
        this.init();
    }

    getMockFiles() {
        return {
            home: [
                { name: 'Документы', type: 'folder', icon: '📁' },
                { name: 'Изображения', type: 'folder', icon: '🖼️' },
                { name: 'Музыка', type: 'folder', icon: '🎵' },
                { name: 'Видео', type: 'folder', icon: '🎬' },
                { name: 'Программы', type: 'folder', icon: '💻' },
                { name: 'файл1.txt', type: 'file', icon: '📄' },
                { name: 'файл2.docx', type: 'file', icon: '📝' },
                { name: 'файл3.pdf', type: 'file', icon: '📕' }
            ],
            documents: [
                { name: ' projet.docx', type: 'file', icon: '📝' },
                { name: 'отчет.pdf', type: 'file', icon: '📕' },
                { name: 'заметки.txt', type: 'file', icon: '📄' }
            ],
            images: [
                { name: 'картинка1.jpg', type: 'file', icon: '🖼️' },
                { name: 'картинка2.png', type: 'file', icon: '🖼️' },
                { name: 'картинка3.gif', type: 'file', icon: '🖼️' }
            ],
            music: [
                { name: 'песня1.mp3', type: 'file', icon: '🎵' },
                { name: 'песня2.mp3', type: 'file', icon: '🎵' }
            ],
            videos: [
                { name: 'видео1.mp4', type: 'file', icon: '🎬' },
                { name: 'видео2.mkv', type: 'file', icon: '🎬' }
            ]
        };
    }

    init() {
        this.container = document.getElementById('filemanager-container');
        this.pathInput = document.getElementById('filemanager-path');
        this.contentArea = document.getElementById('filemanager-content');
        this.sidebar = document.getElementById('filemanager-sidebar');
        
        this.renderSidebar();
        this.renderFiles();
    }

    renderSidebar() {
        const folders = [
            { icon: '🏠', label: 'Домой', path: 'home' },
            { icon: '📁', label: 'Документы', path: 'documents' },
            { icon: '🖼️', label: 'Изображения', path: 'images' },
            { icon: '🎵', label: 'Музыка', path: 'music' },
            { icon: '🎬', label: 'Видео', path: 'videos' }
        ];

        let html = '<div class="sidebar-section"><h4>Быстрый доступ</h4>';
        folders.forEach(folder => {
            html += `<div class="sidebar-item" data-path="${folder.path}">${folder.icon} ${folder.label}</div>`;
        });
        html += '</div>';
        
        this.sidebar.innerHTML = html;

        this.sidebar.querySelectorAll('.sidebar-item').forEach(item => {
            item.addEventListener('click', () => {
                this.currentPath = item.dataset.path;
                this.renderFiles();
            });
        });
    }

    renderFiles() {
        const files = this.files[this.currentPath] || [];
        
        let html = '<div class="files-grid">';
        files.forEach(file => {
            html += `
                <div class="file-item" data-name="${file.name}" data-type="${file.type}">
                    <div class="file-item-icon">${file.icon}</div>
                    <div class="file-item-name">${file.name}</div>
                </div>
            `;
        });
        html += '</div>';
        
        this.contentArea.innerHTML = html;

        this.updatePathDisplay();

        // Обработчики кликов по файлам
        this.contentArea.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleFileClick(item);
            });

            item.addEventListener('dblclick', () => {
                this.handleFileDblClick(item);
            });
        });
    }

    updatePathDisplay() {
        const pathMap = {
            home: 'Домой',
            documents: 'Домой > Документы',
            images: 'Домой > Изображения',
            music: 'Домой > Музыка',
            videos: 'Домой > Видео'
        };
        this.pathInput.textContent = pathMap[this.currentPath] || 'Домой';
    }

    handleFileClick(item) {
        item.classList.add('focused');
        setTimeout(() => item.classList.remove('focused'), 300);
    }

    handleFileDblClick(item) {
        const type = item.dataset.type;
        if (type === 'folder') {
            // В реальной ОС перейти в папку
            console.log('Открыть папку:', item.dataset.name);
        } else {
            // Открыть файл (запустить приложение)
            const fileName = item.dataset.name;
            console.log('Открыть файл:', fileName);
            
            if (fileName.endsWith('.mp3') || fileName.endsWith('.wav')) {
                if (window.openPlayer) window.openPlayer();
            } else if (fileName.endsWith('.jpg') || fileName.endsWith('.png') || fileName.endsWith('.gif')) {
                console.log('Показать изображение:', fileName);
            } else {
                console.log('Открыть файл:', fileName);
            }
        }
    }
}

function initFilemanager() {
    window.openFilemanager = () => {
        const content = document.createElement('div');
        content.className = 'filemanager';
        content.innerHTML = `
            <div class="filemanager-header">
                <div class="filemanager-path" id="filemanager-path">Домой</div>
                <div class="filemanager-actions">
                    <button class="filemanager-btn">←</button>
                    <button class="filemanager-btn">→</button>
                    <button class="filemanager-btn">↻</button>
                    <button class="filemanager-btn">➕</button>
                    <button class="filemanager-btn">🗑️</button>
                </div>
            </div>
            <div class="filemanager-content">
                <div class="filemanager-sidebar" id="filemanager-sidebar"></div>
                <div class="filemanager-main" id="filemanager-content"></div>
            </div>
        `;
        
        window.windowManager.createWindow({
            id: 'filemanager-' + Date.now(),
            title: 'Проводник',
            icon: '📁',
            content: content,
            width: 800,
            height: 500,
            app: 'filemanager'
        });

        setTimeout(() => {
            if (!window.filemanager) {
                window.filemanager = new Filemanager();
            }
        }, 100);
    };

    window.openApp = (appId) => {
        switch(appId) {
            case 'filemanager': window.openFilemanager(); break;
            case 'player': window.openPlayer(); break;
            case 'browser': window.openBrowser(); break;
            case 'ide': window.openIDE(); break;
            case 'chat-telegram': window.openChat('telegram'); break;
            case 'chat-discord': window.openChat('discord'); break;
            case 'settings': window.openSettings(); break;
        }
    };
}
