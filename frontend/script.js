if(document.getElementById("saveBtn")) {
    const editor = new SimpleMDE({element:document.getElementById("content") });

    const params = new URLSearchParams(window.location.search);
    const noteId = params.get("id");

if(noteId){
    document.getElementById("heading").textContent = "Edit Note..";

    fetch("http://localhost:5000/note/" + noteId)
    .then((res) => res.json())
    .then((note)=>{
        document.getElementById("author").value = note.author;
        document.getElementById("title").value = note.title;
        editor.value(note.content);
    });
}
document.getElementById("saveBtn").addEventListener("click",async()=>{
    const noteData = {
        author:document.getElementById("author").value.trim() || "Anonymous",
        title:document.getElementById("title").value,
        content:editor.value(),
    };
let res;

if(noteId){
    res = await fetch("http://localhost:5000/note/" + noteId,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(noteData),
    });
}else{
    res = await fetch("http://localhost:5000/add",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(noteData),
    });
}
if(res.ok){
    window.location.href = "notes.html";
}else{
    const err = await res.json();
    document.getElementById("msg").textContent = err.error;
}
});
}
if(document.getElementById("notes")){
    async function showNotes() {
        const res = await fetch("http://localhost:5000/all");
        const notes = await res.json();
        const notesDiv = document.getElementById("notes");

    if(notes.length === 0){
        notesDiv.innerHTML = "<p> No notes yet.Create your first note!📝</p>";
        return;
    }
let html = "";
notes.forEach((n)=>{
    html += `
    <div class = "card">
       <h3>${n.title}</h3>
       <small>👤 ${n.author} | 🕒 ${new Date(n.updatedAt).toLocaleString()}</small>
       <div class="note-content">${marked.parse(n.content)}</div>
       <a href="index.html?id=${n._id}">✏️ Edit</a>
       </div>
    `;
});
notesDiv.innerHTML = html;      
 }

showNotes();

document.getElementById("refreshBtn").addEventListener("click",showNotes);
setInterval(showNotes,5000);
}