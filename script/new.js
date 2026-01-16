let notes = [];
let currentTheme = 'light';

// Initialize
function init() {
    loadNotes();
    loadTheme();
    renderNotes();
    renderSidebar();
}

// Theme Toggle
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode');
    document.querySelector('.theme-toggle').textContent =
        currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
    saveTheme();
}

function loadTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        currentTheme = 'dark';
        document.body.classList.add('dark-mode');
        document.querySelector('.theme-toggle').textContent = 'Light Mode';
    }
}

function saveTheme() {
    localStorage.setItem('theme', currentTheme);
}

// Sidebar Toggle for Mobile
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Modal Functions
function openModal() {
    document.getElementById('noteModal').classList.add('active');
}

function closeModal() {
    document.getElementById('noteModal').classList.remove('active');
    document.getElementById('title').value = '';
    document.getElementById('tags').value = '';
    document.getElementById('content').value = '';
}

// Notes Functions
function loadNotes() {
    const stored = localStorage.getItem('primaNotes');
    notes = stored ? JSON.parse(stored) : [];
}

function saveNotes() {
    localStorage.setItem('primaNotes', JSON.stringify(notes));
}

function addNote(e) {
    e.preventDefault();

    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const tagsInput = document.getElementById('tags').value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

    const note = {
        id: Date.now(),
        title,
        content,
        tags,
        date: new Date().toLocaleDateString()
    };

    notes.unshift(note);
    saveNotes();
    renderNotes();
    renderSidebar();
    closeModal();
}

function deleteNote(id) {
    if (confirm('Are you sure you want to delete this note?')) {
        notes = notes.filter(n => n.id !== id);
        saveNotes();
        renderNotes();
        renderSidebar();
    }
}

function renderNotes(filter = '') {
    const grid = document.getElementById('notesGrid');

    const filtered = notes.filter(n =>
        n.title.toLowerCase().includes(filter.toLowerCase()) ||
        n.content.toLowerCase().includes(filter.toLowerCase()) ||
        n.tags.some(t => t.toLowerCase().includes(filter.toLowerCase()))
    );

    if (filtered.length === 0) {
        grid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">🔍</div>
                        <h3>${filter ? 'No notes found' : 'No notes yet'}</h3>
                        <p>${filter ? 'Try a different search term' : 'Click the + button to create your first note'}</p>
                    </div>
                `;
        return;
    }

    grid.innerHTML = '<div class="grid">' + filtered.map(note => `
                <div class="note-card">
                    <h3>${note.title}</h3>
                    <p>${note.content}</p>
                    ${note.tags.length > 0 ? `
                        <div class="note-tags">
                            ${note.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="note-actions">
                        <button class="btn btn-delete" onclick="deleteNote(${note.id})">Delete</button>
                    </div>
                </div>
            `).join('') + '</div>';
}

function renderSidebar() {
    const list = document.getElementById('notesList');

    if (notes.length === 0) {
        list.innerHTML = '<div style="padding: 16px; text-align: center; color: #999; font-size: 0.85rem;">No notes</div>';
        return;
    }

    list.innerHTML = notes.map(note => `
                <div class="note-item">
                    <div class="note-item-title">${note.title}</div>
                    <div class="note-item-preview">${note.content}</div>
                </div>
            `).join('');
}

// Search
document.getElementById('search').addEventListener('input', (e) => {
    renderNotes(e.target.value);
});

// Close modal on outside click
document.getElementById('noteModal').addEventListener('click', (e) => {
    if (e.target.id === 'noteModal') {
        closeModal();
    }
});

// Initialize app
init();