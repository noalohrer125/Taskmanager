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

function closeform() {
    document.body.removeChild(document.getElementById('overlay'))
    document.getElementById('popupform').style.display = "none"
    location.reload()

    edit_cell_id = null
}

let edit_cell_id
let edit_cell_status

function submit() {
    document.getElementById('popupform').style.display = "none"

    document.body.removeChild(document.getElementById('overlay'))

    Tasks = JSON.parse(localStorage.getItem('Tasks')) || []
    
    // Prüfe, ob es sich um eine Bearbeitung oder um das Hinzufügen eines neuen Tasks handelt
    if (edit_cell_id) {
        // Entferne den alten Task, wenn in Bearbeitungsmodus
        Tasks.splice(edit_cell_id, 1);
    }

    edit_cell_id = null

    let taskname = document.getElementById('input_taskname').value
    let description = document.getElementById('input_description').value
    let deadline = document.getElementById('input_deadline').value

    if (!edit_cell_status) {
        edit_cell_status = "ToDoo's"
    }

    let newtask = {
        Taskname: taskname,
        Description: description,
        Deadline: deadline,
        Status: edit_cell_status
    }

    if (!Tasks) {
        Tasks = []
    }

    Tasks.push(newtask)

    localStorage.setItem('Tasks', JSON.stringify(Tasks))

    edit_cell_status = null

    location.reload(true)
}

function edit(id) {
    overlay()
    document.getElementById('popupform').style.display = "block";

    let parentCell = id.closest('td')
    let parentCell_id = parentCell.id.split('_')[1]

    edit_cell_id = parentCell_id

    Tasks = JSON.parse(localStorage.getItem('Tasks')) || []
    let task = Tasks[parentCell_id];

    edit_cell_status = task.Status

    // Lade die Task-Daten in dein Formular
    document.getElementById('input_taskname').value = task.Taskname;
    document.getElementById('input_description').value = task.Description;
    document.getElementById('input_deadline').value = task.Deadline;

    localStorage.setItem('Tasks', JSON.stringify(Tasks))

    render_tasks()
}

function start(id) {
    let parentCell = id.closest('td')
    let parentCell_id = parentCell.id.split('_')[1]

    Tasks = JSON.parse(localStorage.getItem('Tasks')) || []
    let task = Tasks[parentCell_id];

    task.Status = 'inProgress'

    localStorage.setItem('Tasks', JSON.stringify(Tasks))

    location.reload(true)
}

function todo(id) {
    let parentCell = id.closest('td')
    let parentCell_id = parentCell.id.split('_')[1]

    Tasks = JSON.parse(localStorage.getItem('Tasks')) || []
    let task = Tasks[parentCell_id];

    task.Status = "ToDoo's"

    localStorage.setItem('Tasks', JSON.stringify(Tasks))

    location.reload(true)
}

function done(id) {
    let parentCell = id.closest('td')
    let parentCell_id = parentCell.id.split('_')[1]

    Tasks = JSON.parse(localStorage.getItem('Tasks')) || []
    let task = Tasks[parentCell_id];

    task.Status = 'Done'

    localStorage.setItem('Tasks', JSON.stringify(Tasks))

    location.reload()
}

function remove(i) {
    let stored_tasks = JSON.parse(localStorage.getItem('Tasks'))

    let parentCell = i.closest('td')
    let parentCell_id = parentCell.id.split('_')[1]

    stored_tasks.splice(parentCell_id, 1)

    localStorage.setItem('Tasks', JSON.stringify(stored_tasks))

    location.reload()
}

function countTasksByStatus() {
    let stored_tasks = JSON.parse(localStorage.getItem('Tasks')) || [];
    let count = {
        "ToDoo's": 0,
        "inProgress": 0,
        "Done": 0
    };

    for (let task of stored_tasks) {
        if (task.Status === "ToDoo's") {
            count["ToDoo's"]++;
        } else if (task.Status === "inProgress") {
            count["inProgress"]++;
        } else if (task.Status === "Done") {
            count["Done"]++;
        }
    }

    return count;
}

function render_tasks() {
    let stored_tasks = JSON.parse(localStorage.getItem('Tasks')) || []
    let table = document.getElementById('todo_table')

    let todo = countTasksByStatus()
    let max = Math.max(todo["ToDoo's"], todo['inProgress'], todo['Done'])

    let cells = [];

    for (let i = 0; i < max; i++) {
        let row = table.insertRow();
        cells[i] = [];
        cells[i][0] = row.insertCell(0);
        cells[i][1] = row.insertCell(1);
        cells[i][2] = row.insertCell(2);
    }

    let counterrow_todo = 0
    let counterrow_inporgress = 0
    let counterrow_done = 0

    for (i in stored_tasks) {
        
        let Name = stored_tasks[i].Taskname
        let Description = stored_tasks[i].Description.split('\n')
        let Deadline = stored_tasks[i].Deadline
        let Status = stored_tasks[i].Status

        

        switch (Status) {
            case "ToDoo's":
                let zelle1 = cells[counterrow_todo][0]
                zelle1.id  = 'Zelle_' + i
                counterrow_todo = counterrow_todo + 1
            
                zelle1.innerHTML = 
                `
                <div style="padding: 10px 40px 10px 40px; border: solid black 10px; width: 180px;">
                    <h1 style="text-decoration: underline; text-align: center;">
                        ${Name}
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
                    <button onclick="edit(this)">Edit</button>
                    <button onclick="remove(this)">Remove</button>
                </div>
                <br>
                `
                
                break;

            case 'inProgress':
                let zelle2 = cells[counterrow_inporgress][1]
                zelle2.id  = 'Zelle_' + i
                counterrow_inporgress = counterrow_inporgress + 1
            
                zelle2.innerHTML = 
                `
                <div style="padding: 10px 40px 10px 40px; border: solid black 10px; width: 180px;">
                    <h1 style="text-decoration: underline; text-align: center;">
                        ${Name}
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
                    <button onclick="done(this)">Done</button>
                    <button onclick="edit(this)">Edit</button>
                    <button onclick="remove(this)">Remove</button>
                </div>
                <br>
                `

                break;

            case 'Done':
                let zelle3 = cells[counterrow_done][2]
                zelle3.id  = 'Zelle_' + i
                counterrow_done = counterrow_done + 1
            
                zelle3.innerHTML = 
                `
                <div style="padding: 10px 40px 10px 40px; border: solid black 10px; width: 180px;">
                    <h1 style="text-decoration: underline; text-align: center;">
                        ${Name}
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
                    <button onclick="todo(this)">Start</button>
                    <button onclick="edit(this)">Edit</button>
                    <button onclick="remove(this)">Remove</button>
                </div>
                <br>
                `

                break;
        }
    }
}

function sortTasksa() {
    // Lade die gespeicherten Tasks
    let storedTasks = JSON.parse(localStorage.getItem('Tasks')) || [];
    
    // Sortiere die Tasks alphabetisch nach dem Tasknamen
    storedTasks.sort((a, b) => {
        if (a.Taskname.toLowerCase() < b.Taskname.toLowerCase()) return -1;
        if (a.Taskname.toLowerCase() > b.Taskname.toLowerCase()) return 1;
        return 0;
    });
    
    // Speichere die sortierten Tasks zurück im LocalStorage
    localStorage.setItem('Tasks', JSON.stringify(storedTasks));

    location.reload()
}

function sortTasksb() {
    // Lade die gespeicherten Tasks
    let storedTasks = JSON.parse(localStorage.getItem('Tasks')) || [];
    
    // Sortiere die Tasks alphabetisch nach dem Tasknamen
    storedTasks.sort((a, b) => {
        if (a.Taskname.toLowerCase() < b.Taskname.toLowerCase()) return 1;
        if (a.Taskname.toLowerCase() > b.Taskname.toLowerCase()) return -1;
        return 0;
    });
    
    // Speichere die sortierten Tasks zurück im LocalStorage
    localStorage.setItem('Tasks', JSON.stringify(storedTasks));

    location.reload()
}

function sortTasksByDeadline() {
    let storedTasks = JSON.parse(localStorage.getItem('Tasks')) || [];
    
    // Sortiere die Tasks nach der Deadline
    storedTasks.sort((a, b) => {
        // Umwandlung der Deadlines in Date-Objekte für den Vergleich
        let deadlineA = new Date(a.Deadline);
        let deadlineB = new Date(b.Deadline);
        
        return deadlineA - deadlineB;
    });
    
    localStorage.setItem('Tasks', JSON.stringify(storedTasks));
    
    location.reload();
}
