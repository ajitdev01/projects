// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Theme switcher
    const themeSwitch = document.querySelector('.theme-switch');
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            themeSwitch.innerHTML = `<i class="fas fa-${newTheme === 'light' ? 'moon' : 'sun'}"></i>`;
            localStorage.setItem('theme', newTheme);
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeSwitch.innerHTML = `<i class="fas fa-${savedTheme === 'light' ? 'moon' : 'sun'}"></i>`;
    }

    // Sidebar navigation
    document.querySelectorAll('.app-sidebar .nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.main-content').forEach(section => section.classList.add('d-none'));
            const target = link.getAttribute('href');
            const targetElement = document.querySelector(target);
            if (targetElement) {
                targetElement.classList.remove('d-none');
            }
            document.querySelectorAll('.app-sidebar .nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // FAB menu toggle
    const fab = document.querySelector('.fab');
    const fabMenu = document.querySelector('.fab-menu');
    if (fab && fabMenu) {
        fab.addEventListener('click', () => {
            fabMenu.classList.toggle('show');
        });
    }

    // FAB menu navigation
    document.querySelectorAll('.fab-item').forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            if (section) {
                document.querySelectorAll('.main-content').forEach(s => s.classList.add('d-none'));
                const targetSection = document.querySelector(`#${section}`);
                if (targetSection) {
                    targetSection.classList.remove('d-none');
                }
                document.querySelectorAll('.app-sidebar .nav-link').forEach(l => l.classList.remove('active'));
                const targetLink = document.querySelector(`.app-sidebar .nav-link[href="#${section}"]`);
                if (targetLink) {
                    targetLink.classList.add('active');
                }
                if (fabMenu) {
                    fabMenu.classList.remove('show');
                }
            }
        });
    });

    // Password Generator
    function generatePassword() {
        const lengthSlider = document.getElementById('length-slider');
        if (!lengthSlider) return;

        const length = parseInt(lengthSlider.value);
        const includeUppercase = document.getElementById('uppercase')?.checked || false;
        const includeLowercase = document.getElementById('lowercase')?.checked || false;
        const includeNumbers = document.getElementById('numbers')?.checked || false;
        const includeSymbols = document.getElementById('symbols')?.checked || false;

        const error = document.getElementById('password-error');
        const passwordInput = document.getElementById('password');
        const progressBar = document.querySelector('.password-strength .progress-bar');
        const strengthText = document.getElementById('strength-text');

        if (!passwordInput || !progressBar || !strengthText) return;

        if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
            if (error) error.style.display = 'block';
            passwordInput.value = '';
            progressBar.style.width = '0%';
            strengthText.textContent = 'Generate a password';
            return;
        }
        if (error) error.style.display = 'none';

        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let chars = '';
        if (includeUppercase) chars += uppercase;
        if (includeLowercase) chars += lowercase;
        if (includeNumbers) chars += numbers;
        if (includeSymbols) chars += symbols;

        let password = '';
        for (let i = 0; i < length; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        passwordInput.value = password;

        // Calculate password strength
        let strength = 0;
        if (includeUppercase) strength += 25;
        if (includeLowercase) strength += 25;
        if (includeNumbers) strength += 25;
        if (includeSymbols) strength += 25;
        if (length >= 12) strength += 25;
        strength = Math.min(strength, 100);

        progressBar.style.width = `${strength}%`;
        progressBar.className = 'progress-bar';
        progressBar.classList.add(strength <= 33 ? 'bg-danger' : strength <= 66 ? 'bg-warning' : 'bg-success');
        strengthText.textContent = strength <= 33 ? 'Weak' : strength <= 66 ? 'Moderate' : 'Strong';
    }

    // Copy Password
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const passwordInput = document.getElementById('password');
            if (!passwordInput || !passwordInput.value) return;

            passwordInput.select();
            try {
                document.execCommand('copy');
                copyBtn.classList.add('copied');
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                setTimeout(() => {
                    copyBtn.classList.remove('copied');
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                }, 2000);
            } catch (err) {
                console.error('Copy failed:', err);
            }
        });
    }

    // Update length display
    const lengthSlider = document.getElementById('length-slider');
    if (lengthSlider) {
        lengthSlider.addEventListener('input', (e) => {
            const lengthValue = document.getElementById('length-value');
            if (lengthValue) {
                lengthValue.textContent = e.target.value;
            }
        });
    }

    // Generate button click
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', generatePassword);
    }

    // Todo List Functions
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function renderTodos() {
        const todoList = document.getElementById('todo-list');
        if (!todoList) return;

        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            li.setAttribute('role', 'listitem');
            li.innerHTML = `
                <div class="d-flex flex-column">
                    <span class="todo-text">${escapeHTML(todo.work)}</span>
                    <div class="text-muted small">By: ${escapeHTML(todo.user)} (${escapeHTML(todo.email)})</div>
                </div>
                <div class="todo-actions">
                    <button class="complete-btn" data-index="${index}" aria-label="Toggle task completion">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="edit-btn" data-index="${index}" aria-label="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" data-index="${index}" aria-label="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            todoList.appendChild(li);
        });

        const todoCount = document.getElementById('todo-count');
        if (todoCount) {
            todoCount.textContent = todos.length;
        }
    }

    // Helper function to escape HTML
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // Todo form submission
    const todoForm = document.getElementById('todo-form');
    if (todoForm) {
        todoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('todo-user')?.value.trim() || '';
            const email = document.getElementById('todo-email')?.value.trim() || '';
            const work = document.getElementById('todo-work')?.value.trim() || '';
            const error = document.getElementById('todo-error');

            if (!user || !email || !work) {
                if (error) error.style.display = 'block';
                return;
            }
            if (error) error.style.display = 'none';

            todos.push({ user, email, work, completed: false });
            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
            e.target.reset();
        });
    }

    // Todo item actions
    const todoList = document.getElementById('todo-list');
    if (todoList) {
        todoList.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const index = parseInt(button.dataset.index);
            if (isNaN(index) || index < 0 || index >= todos.length) return;

            if (button.classList.contains('complete-btn')) {
                todos[index].completed = !todos[index].completed;
            } else if (button.classList.contains('edit-btn')) {
                const newWork = prompt('Edit task:', todos[index].work);
                if (newWork?.trim()) todos[index].work = newWork.trim();
            } else if (button.classList.contains('delete-btn')) {
                todos.splice(index, 1);
            }

            localStorage.setItem('todos', JSON.stringify(todos));
            renderTodos();
        });
    }

    // Delete all todos
    const deleteAllTodos = document.querySelector('#Todo-List .delete-all');
    if (deleteAllTodos) {
        deleteAllTodos.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all tasks?')) {
                todos = [];
                localStorage.setItem('todos', JSON.stringify(todos));
                renderTodos();
            }
        });
    }

    // Notes Functions
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    function renderNotes() {
        const noteList = document.getElementById('note-list');
        if (!noteList) return;

        noteList.innerHTML = '';
        notes.forEach((note, index) => {
            const div = document.createElement('div');
            div.className = 'col';
            div.setAttribute('role', 'listitem');
            div.innerHTML = `
                <div class="note-card">
                    <h5>${escapeHTML(note.title)}</h5>
                    <p>${escapeHTML(note.content)}</p>
                    <div class="note-date">${note.date}</div>
                    <div class="note-actions">
                        <button class="edit-note" data-index="${index}" aria-label="Edit note">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-note" data-index="${index}" aria-label="Delete note">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            noteList.appendChild(div);
        });
    }

    // Note form submission
    const noteForm = document.getElementById('note-form');
    if (noteForm) {
        noteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('note-title')?.value.trim() || '';
            const content = document.getElementById('note-content')?.value.trim() || '';
            const error = document.getElementById('note-error');

            if (!title || !content) {
                if (error) error.style.display = 'block';
                return;
            }
            if (error) error.style.display = 'none';

            const date = new Date().toLocaleString();
            notes.push({ title, content, date });
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
            e.target.reset();
        });
    }

    // Note actions
    const noteList = document.getElementById('note-list');
    if (noteList) {
        noteList.addEventListener('click', (e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const index = parseInt(button.dataset.index);
            if (isNaN(index) || index < 0 || index >= notes.length) return;

            if (button.classList.contains('edit-note')) {
                const newTitle = prompt('Edit title:', notes[index].title);
                const newContent = prompt('Edit content:', notes[index].content);
                if (newTitle?.trim() && newContent?.trim()) {
                    notes[index].title = newTitle.trim();
                    notes[index].content = newContent.trim();
                    notes[index].date = new Date().toLocaleString();
                }
            } else if (button.classList.contains('delete-note')) {
                notes.splice(index, 1);
            }

            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
        });
    }

    // Delete all notes
    const deleteAllNotes = document.querySelector('#Note-App .delete-all');
    if (deleteAllNotes) {
        deleteAllNotes.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete all notes?')) {
                notes = [];
                localStorage.setItem('notes', JSON.stringify(notes));
                renderNotes();
            }
        });
    }

    // Initialize app
    generatePassword();
    renderTodos();
    renderNotes();
});