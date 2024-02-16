let Tasks = []

render_tasks()

function overlay() {
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
}

function add_task() {
    overlay()

    document.getElementById('popupform').style.display = "block"
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

    Tasks = JSON.parse(localStorage.getItem('Tasks'))

    if (!Tasks) {
        Tasks = []
    }

    Tasks.push(task)

    localStorage.setItem('Tasks', JSON.stringify(Tasks))

    location.reload(true)
}

function start(id) {

}

function done(id) {

}

let editIndex = -1;

function edit(id) {
    overlay()

    editIndex = id; // Speichere den Index des zu bearbeitenden Tasks

    let parentCell = id.closest('td')
    let parentCell_id = parentCell.id.split('_')[1]

    Tasks = JSON.parse(localStorage.getItem('Tasks')) || []
    let task = Tasks[parentCell_id];
    // Lade die Task-Daten in dein Formular
    document.getElementById('input_taskname').value = task.Taskname;
    document.getElementById('input_description').value = task.Description;
    document.getElementById('input_deadline').value = task.Deadline;
    // Zeige das Bearbeitungsformular an
    document.getElementById('popupform').style.display = "block";
    Tasks.splice(parentCell_id)

    localStorage.setItem('Tasks', JSON.stringify(Tasks))

    render_tasks()
}

function remove(i) {
    let stored_tasks = JSON.parse(localStorage.getItem('Tasks'))

    let parentCell = i.closest('td')
    let parentCell_id = parentCell.id.split('_')[1]

    stored_tasks.splice(parentCell_id, 1)

    localStorage.setItem('Tasks', JSON.stringify(stored_tasks))

    location.reload()
}

function render_tasks() {
    let stored_tasks = JSON.parse(localStorage.getItem('Tasks')) || []
    let table = document.getElementById('todo_table')

    for (i in stored_tasks) {
        let row = table.insertRow(-1)
        let zelle1 = row.insertCell(0)

        let name = stored_tasks[i].Taskname
        let Description = stored_tasks[i].Description.split('\n')
        let Deadline = stored_tasks[i].Deadline

        zelle1.id = 'Zelle_' + i
        
        zelle1.innerHTML = 
        `
        <h1 style="text-decoration: underline; text-align: center;">
            ${name}
        </h1>
        <h2>
            Description:
        </h2>
        <ul>
        ${Description.map(x => `<li style="border-bottom: solid gray 1px;">${x}</li>`).join('')}
        </ul>
        <br>
        <h3 class="inline-block">
            Deadline:
        </h3>
        <p class="inline-block">
            ${Deadline}
        </p>
        <br>
        <button onclick="start(this)">Start</button>
        <button onclick="edit(this)" >Edit</button>
        <button onclick="remove(this)" >Remove</button>
        `
    };
}
