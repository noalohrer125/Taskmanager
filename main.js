let Tasks = []

render_tasks()

function add_task() {
    document.getElementById('popupform').style.display = "block"

    let overlay = document.createElement('div');
    overlay.id = 'overlay'

    // Definieren Sie die CSS-Stile für das div
    overlay.style.position = 'fixed';  // Position fest auf dem Bildschirm
    overlay.style.top = '0';           // Oben ausrichten
    overlay.style.left = '0';          // Links ausrichten
    overlay.style.width = '100vw';     // Breite auf volle Ansichtsbreite setzen
    overlay.style.height = '100vh';    // Höhe auf volle Ansichtshöhe setzen
    overlay.style.backgroundColor = 'gray';  // Hintergrundfarbe auf Schwarz setzen
    overlay.style.opacity = '0.8'; // Transparents auf 0.8 setzen
    overlay.style.zIndex = '800';     // Über allen anderen Elementen anzeigen

    // Fügen Sie das div dem Body der Webseite hinzu
    document.body.appendChild(overlay);

    document.getElementById('popupform').style.display = "block"
}

function start() {

}

function done() {

}

function edit(id) {
    let parentCell = id.closest('td')
    let content = document.getElementById(id)

    parentCell.contentEditable = true
}

function remove() {

}

function submit() {
    document.getElementById('popupform').style.display = "none"

    document.body.removeChild(document.getElementById('overlay'))

    let taskname = document.getElementById('input_taskname').value
    let description = document.getElementById('input_description').value
    let deadline = document.getElementById('input_deadline').value

    let task = {
        Taskname: taskname,
        Description: description,
        Deadline: deadline,
        Status: "ToDoo's"
    }

    Tasks.push(task)

    localStorage.setItem('Tasks', JSON.stringify(Tasks))

    render_tasks()
}

function render_tasks() {
    let stored_tasks = JSON.parse(localStorage.getItem('Tasks'))
    let table = document.getElementById('todo_table')

    for (i in stored_tasks) {
        let row = table.insertRow(-1)
        let zelle1 = row.insertCell(0)

        zelle1.id = 'Zelle' + i
        
        zelle1.innerHTML = 
        `
        <h1 style="text-decoration: underline; text-align: center;">
        ${stored_tasks[i].Taskname}
        </h1>
        <h2>
            Description:
        </h2>
        ${stored_tasks[i].Description}
        <br>
        <h3 class="inline-block">
            Deadline:
        </h3>
        <p class="inline-block">
        ${stored_tasks[i].Deadline}
        </p>
        <br>
        <button onclick="start()">Start</button>
        <button onclick="edit(this)" >Edit</button>
        `
    };
}
