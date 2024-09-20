const tbody = document.querySelector('tbody')
const addForm = document.querySelector('.add-form')
const inputTask = document.querySelector('.input-task')

const fetchTasks = async () => {
    const response = await fetch('http://localhost:3333/tasks')

    const tasks = await response.json()

    return tasks

}

//funcao para adicionar as tarefas

const addTasks = async (event) => {
    event.preventDefault()

    const task = {title: inputTask.value}
    task.status = 'pendente'
    await fetch('http://localhost:3333/tasks', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(task),
    })

    loadTasks()
    inputTask.value = ''
}

const deleteTask = async (id) => {
    await fetch(`http://localhost:3333/tasks/${id}`,{
        method: 'delete'
    })

    loadTasks()
}

const updateTask = async (task) =>{
    const {id, title, created_at, status} = task;

    await fetch(`http://localhost:3333/tasks/${id}`,{
        method: 'put',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({title, status})
    })

    loadTasks()
}

//formatar a data

const formatDate = (dateUTC) => {
    const options = {dataStyle: 'long'}
    const date = new Date(dateUTC).toLocaleString('pt-pt', options)

    return date
}


//funcao para gerar cada linha da tabela
const createElement = (tag, innerText = '', innerHTML = '') =>{
 const element = document.createElement(tag)
 
 if(innerText){
    element.innerText = innerText
 }

 if(innerHTML){
    element.innerHTML = innerHTML
 }
 



 return element
}
const createSelect = (value) => {
    const options = `
        <option value="Pendente">Pendente</option>
        <option value="em andamento">Em andamento</option>
        <option value="concluida">Concluida</option>
    `

    const select = createElement('select', '', options)
    select.value = value

    return select
}

const createRow = (task) =>{
    const {id, title, created_at, status} = task
    
    
    const tr = createElement('tr')
    const tdTitle = createElement('td', title)
    const tdCreatedAt = createElement('td', formatDate(created_at))
    const tdStatus = createElement('td')
    const tdActions = createElement('td')

    const select = createSelect(status)

    select.addEventListener('change', ({target}) => updateTask({...task,status: target.value}))

    const editButton = createElement('button','' ,'<span class="material-symbols-outlined">edit</span>')
    const deleteButton = createElement('button','' ,'<span class="material-symbols-outlined">delete</span>')

    const editForm = createElement('form')
    const editInput = createElement('input')

    editInput.value = title
    editForm.appendChild(editInput)

    editForm.addEventListener('submit', (event) => {
        event.preventDefault()

        updateTask({id, title: editInput.value, status})
    })

    editButton.addEventListener('click', () => {
        tdTitle.innerText = ''
        tdTitle.appendChild(editForm)
    })

    editButton.classList.add('btn-action')
    deleteButton.classList.add('btn-action')

    deleteButton.addEventListener('click', () => deleteTask(id))

    tdStatus.appendChild(select)

    tdActions.appendChild(editButton)
    tdActions.appendChild(deleteButton)

    tr.appendChild(tdTitle)
    tr.appendChild(tdCreatedAt)
    tr.appendChild(tdStatus)
    tr.appendChild(tdActions)


    return tr
}

const loadTasks = async () => {
    const tasks = await fetchTasks()

    tbody.innerHTML = ''

    tasks.forEach((task) => {
        const tr = createRow(task)

        tbody.appendChild(tr)
    });
}


addForm.addEventListener('submit', addTasks)
loadTasks()