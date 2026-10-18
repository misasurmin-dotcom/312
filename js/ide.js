// ====================
// Редактор кода (IDE)
// ====================

class IDE {
    constructor() {
        this.currentFile = null;
        this.files = {
            'main.js': '// Главный файл\nconsole.log("Привет, WebOS!");\n\nfunction init() {\n    console.log("Инициализация системы...");\n}\n\ninit();',
            'style.css': '/* Основные стили */\n:root {\n    --primary-color: #667eea;\n    --secondary-color: #764ba2;\n}\n\nbody {\n    font-family: sans-serif;\n    margin: 0;\n    padding: 0;\n}',
            'index.html': '<!DOCTYPE html>\n<html lang="ru">\n<head>\n    <meta charset="UTF-8">\n    <title>WebOS</title>\n</head>\n<body>\n    <h1>Добро пожаловать в WebOS</h1>\n</body>\n</html>'
        };
        this.init();
    }

    init() {
        this.container = document.getElementById('ide-container');
        this.filesTree = document.getElementById('ide-files');
        this.editor = document.getElementById('ide-editor');
        this.statusText = document.getElementById('ide-status-text');
        
        this.renderFiles();
        this.editor.value = this.files['main.js'];
        
        this.editor.addEventListener('input', () => this.updateStatus());
    }

    renderFiles() {
        let html = '';
        Object.keys(this.files).forEach(file => {
            const ext = file.split('.').pop();
            const icons = {
                js: '📜',
                css: '🎨',
                html: '🌐',
                json: '📋',
                md: '📝'
            };
            const icon = icons[ext] || '📄';
            html += `<div class="file-item" data-file="${file}">
                <span class="file-icon">${icon}</span>
                <span class="file-name">${file}</span>
            </div>`;
        });
        this.filesTree.innerHTML = html;

        this.filesTree.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', () => this.openFile(item.dataset.file));
            item.addEventListener('dblclick', () => this.openFile(item.dataset.file));
        });
    }

    openFile(filename) {
        this.currentFile = filename;
        this.editor.value = this.files[filename];
        
        this.filesTree.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.file === filename) {
                item.classList.add('active');
            }
        });
        
        this.updateStatus();
    }

    updateStatus() {
        const lines = this.editor.value.split('\n').length;
        const chars = this.editor.value.length;
        this.statusText.innerHTML = `Строк: ${lines} | Символов: ${chars}`;
    }

    save() {
        if (this.currentFile) {
            this.files[this.currentFile] = this.editor.value;
            alert(`Файл "${this.currentFile}" сохранен!`);
            this.updateStatus();
        }
    }
}

function initIDE() {
    window.openIDE = () => {
        const content = document.createElement('div');
        content.className = 'ide';
        content.innerHTML = `
            <div class="ide-sidebar">
                <div class="sidebar-header">
                    <h3 style="color: var(--text-primary); font-size: 16px; margin: 0;">Файлы</h3>
                </div>
                <div class="sidebar-files" id="ide-files">
                    <!-- Файлы будут добавлены JS -->
                </div>
                <div class="sidebar-footer" style="padding: 10px; border-top: 1px solid var(--bg-light-secondary);">
                    <button id="ide-save" style="width: 100%; padding: 10px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">💾 Сохранить</button>
                </div>
            </div>
            <div class="ide-main">
                <div class="ide-header">
                    <div class="ide-tabs">
                        <div class="ide-tab active" data-file="main.js">main.js</div>
                        <div class="ide-tab" data-file="style.css">style.css</div>
                        <div class="ide-tab" data-file="index.html">index.html</div>
                    </div>
                    <div class="ide-actions">
                        <button class="ide-btn" style="padding: 6px 12px; background: var(--bg-light-secondary); border: none; border-radius: 6px; cursor: pointer; font-size: 12px;">▶ Запустить</button>
                    </div>
                </div>
                <div class="ide-editor">
                    <div class="code-container">
                        <textarea class="code-editor" id="ide-editor" spellcheck="false" placeholder="Начните писать код..."></textarea>
                    </div>
                </div>
                <div class="ide-footer">
                    <div class="ide-status">
                        <div class="status-item">JS</div>
                        <div class="status-item">UTF-8</div>
                        <div class="status-item" id="ide-status-text">Строк: 5 | Символов: 68</div>
                    </div>
                    <div class="ide-commands">
                        <span>Ln 1, Col 1</span>
                    </div>
                </div>
            </div>
        `;
        
        window.windowManager.createWindow({
            id: 'ide-' + Date.now(),
            title: 'Редактор кода',
            icon: '💻',
            content: content,
            width: 900,
            height: 600,
            app: 'ide'
        });

        setTimeout(() => {
            if (!window.ide) window.ide = new IDE();
            
            // Добавить обработчик сохранения
            document.querySelector('#ide-save')?.addEventListener('click', () => {
                if (window.ide) window.ide.save();
            });
            
            // Обработчики вкладок
            content.querySelectorAll('.ide-tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    content.querySelectorAll('.ide-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    if (window.ide) window.ide.openFile(tab.dataset.file);
                });
            });
        }, 100);
    };
}
