javascript
const API_URL = "https://mini-project2-nevb.onrender.com";

// CREATE AND EDIT NOTE
if (document.getElementById("saveBtn")) {
    const editor = new SimpleMDE({
        element: document.getElementById("content")
    });

    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("id");

    // Load existing note for editing
    if (noteId) {
        document.getElementById("heading").textContent = "Edit Note..";

        fetch(`${API_URL}/note/${noteId}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to load note");
                }
                return res.json();
            })
            .then((note) => {
                document.getElementById("author").value = note.author || "";
                document.getElementById("title").value = note.title || "";
                editor.value(note.content || "");
            })
            .catch((err) => {
                document.getElementById("msg").textContent = err.message;
            });
    }

    // Save new note or update existing note
    document.getElementById("saveBtn").addEventListener("click", async () => {
        const noteData = {
            author: document.getElementById("author").value.trim() || "Anonymous",
            title: document.getElementById("title").value,
            content: editor.value()
        };

        let res;

        try {
            if (noteId) {
                res = await fetch(`${API_URL}/note/${noteId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(noteData)
                });
            } else {
                res = await fetch(`${API_URL}/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(noteData)
                });
            }

            const data = await res.json();

            if (res.ok) {
                window.location.href = "notes.html";
            } else {
                document.getElementById("msg").textContent =
                    data.error || data.message || "Something went wrong";
            }
        } catch (err) {
            document.getElementById("msg").textContent =
                "Unable to connect to the server. Please try again.";
            console.error(err);
        }
    });
}


// DISPLAY ALL NOTES
if (document.getElementById("notes")) {
    async function showNotes() {
        const notesDiv = document.getElementById("notes");

        try {
            const res = await fetch(`${API_URL}/all`);

            if (!res.ok) {
                throw new Error("Failed to load notes");
            }

            const notes = await res.json();

            if (notes.length === 0) {
                notesDiv.innerHTML =
                    "<p>No notes yet. Create your first note! 📝</p>";
                return;
            }

            let html = "";

            notes.forEach((n) => {
                html += `
                    <div class="card">
                        <h3>${n.title}</h3>
                        <small>
                            👤 ${n.author} |
                            🕒 ${new Date(n.updatedAt).toLocaleString()}
                        </small>
                        <div class="note-content">
                            ${marked.parse(n.content || "")}
                        </div>
                        <a href="index.html?id=${n._id}">✏️ Edit</a>
                    </div>
                `;
            });

            notesDiv.innerHTML = html;
        } catch (err) {
            notesDiv.innerHTML =
                "<p>Unable to load notes. Please try again.</p>";
            console.error(err);
        }
    }

    showNotes();

    document.getElementById("refreshBtn").addEventListener("click", showNotes);

    setInterval(showNotes, 5000);
}
