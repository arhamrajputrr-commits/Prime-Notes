let modeBtn = document.querySelector("#mode");
let currMode = "light";

// Notes variables
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Change modes "Dark" && "Light"
modeBtn.addEventListener("click", () => {
    if(currMode === "light"){
        currMode = "dark";
        document.querySelector("body").style.backgroundColor = "black";
    }
    else{
        currMode = "light";
        document.querySelector("body").style.backgroundColor = "white";

    }
});

// Saving notes in LocalStorage
function saveToLocal() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function addNote() {
    
    let title = document.getElementById("title").value;
    let content = document.getElementById("content").value;
    let tags = document.getElementById("tags").value.split(",");

    if (!title || !content) {
        alert("Fill all fields");
        return;
    }

    notes.push({
        id: Date.now(),
        title,
        content,
        tags
    });

    saveToLocal();
    renderNotes();

}

function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    saveToLocal();
    renderNotes();
}

function renderNotes(filter = "") {

    let div = document.getElementById("notesContainer");
    div.innerHTML = "";

    notes.filter(n =>
        n.title.toLowerCase().includes(filter.toLowerCase()) ||
        n.content.toLowerCase().includes(filter.toLowerCase())
    )
    .forEach(note => {

        div.innerHTML += `
            <div class="note">
                <h3>${note.title}</h3>
                <p>${note.content}</p>

                <div>
                    ${note.tags.map(t => `<span class='tag'>${t}</span>`).join("")}
                </div>

                <button onclick="deleteNote(${note.id})">
                    Delete
                </button>

            </div>
        `;

    });

};

// Search logic
document.getElementById("search").addEventListener("input", e => {
    renderNotes(e.target.value);
});

renderNotes();

// Dark/Light Mode Toggle Function
// Apni script.js file mein yeh code add karein

// Check if user has previously selected a mode
document.addEventListener('DOMContentLoaded', function() {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
        document.body.classList.add('dark-mode');
        updateButtonText();
    }
});

// Mode change button ko target karein
const modeButton = document.getElementById('mode');

// Click event listener
modeButton.addEventListener('click', function() {
    toggleMode();
});

// Toggle function
function toggleMode() {
    document.body.classList.toggle('dark-mode');
    
    // Save preference to localStorage
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    
    updateButtonText();
}

// Update button text based on current mode
function updateButtonText() {
    const modeButton = document.getElementById('mode');
    if (document.body.classList.contains('dark-mode')) {
        modeButton.textContent = 'Light Mode';
    } else {
        modeButton.textContent = 'Dark Mode';
    }
}
