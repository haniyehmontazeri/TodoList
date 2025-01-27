document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
});

function addTask() {
    const taskName = document.getElementById("taskName").value;
    const taskDescription = document.getElementById("taskDescription").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;
    const category = document.getElementById("category").value; // New line

    if (taskName.trim() !== "") {
        const task = {
            name: taskName,
            description: taskDescription,
            dueDate: dueDate,
            priority: priority,
            category: category, // New line
        };

        saveTask(task);
    } else {
        alert("Task name cannot be empty!");
    }
}

function saveTask(task) {
    const xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                loadTasks(); 
                clearForm();
            } else {
                console.error("Failed to save task");
            }
        }
    };

    xhr.open("POST", "backend.php", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(task));
}

function loadTasks(filter, sort, category) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                displayTasks(JSON.parse(xhr.responseText));
            } else {
                console.error("Failed to load tasks");
            }
        }
    };

    let url = "backend.php";
    let params = [];
    
    if (filter !== undefined) {
        params.push(`filter=${filter}`);
    }

    if (sort !== undefined) {
        params.push(`sort=${sort}`);
    }

    if (category !== undefined) {
        params.push(`category=${category}`);
    }

    if (params.length > 0) {
        url += `?${params.join("&")}`;
    }

    xhr.open("GET", url, true);
    xhr.send();
}
function searchTasks() {
    const searchQuery = document.getElementById("searchInput").value;
    // const filterSelect = document.getElementById("filterSelect");
    const sortSelect = document.getElementById("sortSelect");

    // const filterValue = filterSelect.options[filterSelect.selectedIndex].value;
    const sortValue = sortSelect.options[sortSelect.selectedIndex].value;

    const categorySelect = document.getElementById("filterSelect");
    const categoryValue = categorySelect.options[categorySelect.selectedIndex].value;

    loadTasks(searchQuery, sortValue, categoryValue);
}

function displayTasks(tasks) {
    const taskListDiv = document.getElementById("taskList");
    taskListDiv.innerHTML = "";


    tasks.forEach(function (task) {
        const taskItem = document.createElement("div");
        if(task.status == "completed"){
            taskItem.innerHTML = `
            <div class="task complete">
           
                <strong>${task.name}</strong>
                <p>${task.description || "No description"}</p>
                <p>Due Date: ${task.due_date || "Not set"}</p>
                <p>Priority: ${task.priority.substring(2)}</p>
                <p>Category: ${task.category}</p>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                <button class="mark" onclick="toggleTaskStatus(${task.id}, '${task.status}')">Mark as Todo</button>
                <button onclick="markAsArchive(${task.id})">Mark as Archived</button>

                </div>
                `;
            taskListDiv.appendChild(taskItem);

        }else if(task.status == "archived"){
            taskItem.innerHTML = `
            <div class="task archived">
           
                <strong>${task.name}</strong>
                <p>${task.description || "No description"}</p>
                <p>Due Date: ${task.due_date || "Not set"}</p>
                <p>Priority: ${task.priority.substring(2)}</p>
                <p>Category: ${task.category}</p>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                <button class="mark" onclick="toggleTaskStatus(${task.id}, '${task.status}')">Mark as Todo</button>

                </div>
                `;
            taskListDiv.appendChild(taskItem);

        } else{
            taskItem.innerHTML = `
            <div class="task">

                <strong>${task.name}</strong>
                <p>${task.description || "No description"}</p>
                <p>Due Date: ${task.due_date || "Not set"}</p>
                <p>Priority: ${task.priority.substring(2)}</p>
                <p>Category: ${task.category}</p>
                <button class="delete" onclick="deleteTask(${task.id})">Delete</button>
                <button onclick="openEditModal(${task.id})">Edit</button>
                <button onclick="toggleTaskStatus(${task.id}, '${task.status}')">Done</button>
                </div>

                `;
            taskListDiv.appendChild(taskItem);

        }
    });
}

function toggleTaskStatus(taskId, currentStatus) {
    const newStatus = currentStatus === 'completed' ? 'uncompleted' : 'completed';

    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                loadTasks(); 
            } else {
                console.error(`Failed to toggle status for task ${taskId}`);
            }
        }
    };

    xhr.open("POST", `backend.php?action=toggleStatus`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.send(JSON.stringify({ id: taskId, status: newStatus }));
}

function markAsArchive(taskId) {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                loadTasks(); 
            } else {
                console.error(`Failed to mark task ${taskId} as archive`);
            }
        }
    };
    xhr.open("POST", `backend.php?action=markAsArchive`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify({ id: taskId }));
}

function deleteTask(taskId) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                loadTasks(); 
            } else {
                console.error("Failed to delete task");
            }
        }
    };

    xhr.open("POST", `backend.php?action=delete`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    xhr.send(JSON.stringify({ id: taskId }));
}

function completeTask(taskId) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                loadTasks(); 
            } else {
                console.error("Failed to complete task");
            }
        }
    };

    xhr.open("POST", `backend.php?action=complete`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(taskId);
}

function archiveCompletedTasks() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                loadTasks(); 
            } else {
                console.error("Failed to archive completed tasks");
            }
        }
    };

    xhr.open("POST", `backend.php?action=archive`, true);
    xhr.send();
}
function clearForm() {
    document.getElementById("taskForm").reset();
}


document.addEventListener("DOMContentLoaded", function () {
    loadTasks();
    setInterval(checkAndArchiveOverdueTasks, 36000);
});

function checkAndArchiveOverdueTasks() {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("Checking and archiving overdue tasks...");
                const tasks = JSON.parse(xhr.responseText);
                archiveOverdueTasks(tasks);
            } else {
                console.error("Failed to load tasks for checking overdue tasks");
            }
        }
    };

    xhr.open("GET", "backend.php", true);
    xhr.send();
}

function archiveOverdueTasks(tasks) {
    const currentDate = new Date();

    tasks.forEach(function (task) {
        const dueDate = new Date(task.due_date);
        
        if (!isNaN(dueDate) && currentDate > dueDate && task.status !== 'completed') {
          
            archiveTask(task.id);
        }
    });
}

function archiveTask(taskId) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log(`Task ${taskId} archived successfully`);
                loadTasks();
            } else {
                console.error(`Failed to archive task ${taskId}`);
            }
        }
    };

    xhr.open("POST", `backend.php?action=archiveOverDue`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    
    xhr.send(JSON.stringify(taskId));
}
let all_tasks = [];
let selected_task = [];

async function openEditModal(taskId) {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "block";

    var tasklist = [];
    const task = await findTaskById(taskId).then((result) => tasklist = result);
    console.log(tasklist.name)

    document.getElementById("editTaskName").value = tasklist.name;
    document.getElementById("editTaskDescription").value = tasklist.description;
    document.getElementById("editDueDate").value = tasklist.due_date;
    document.getElementById("editPriority").value = tasklist.priority;
    document.getElementById("editCategory").value = tasklist.category;

    document.getElementById("editTaskForm").dataset.taskId = taskId;
}

function closeEditModal() {
    const editModal = document.getElementById("editModal");
    editModal.style.display = "none";
}

function updateTask() {
    const taskId = document.getElementById("editTaskForm").dataset.taskId;
    const taskName = document.getElementById("editTaskName").value;
    const taskDescription = document.getElementById("editTaskDescription").value;
    const dueDate = document.getElementById("editDueDate").value;
    const priority = document.getElementById("editPriority").value;
    const category = document.getElementById("editCategory").value;

    const updatedTask = {
        id: taskId,
        name: taskName,
        description: taskDescription,
        dueDate: dueDate,
        priority: priority,
        category: category,
    };

    updateTaskBackend(updatedTask);
}

function updateTaskBackend(updatedTask) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                loadTasks(); 
                closeEditModal(); 
            } else {
                console.error(`Failed to update task ${updatedTask.id}`);
            }
        }
    };

    xhr.open("POST", `backend.php?action=updateTask`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.send(JSON.stringify(updatedTask));
}



async function findTaskById(taskId) {
    return new  Promise(async (resolve, reject) => {
        var tasks = [];
        const tasks_p = await getTasksArray().then((result) => tasks = result);
        console.log(tasks)
        selected_task = await tasks.find(task => task.id === taskId);
        resolve(selected_task)
    });
 

}

async function getTasksArray() {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    const tasks = JSON.parse(xhr.responseText);
                    all_tasks = tasks;
                    resolve(tasks);
                } else {
                    reject("Failed to retrieve tasks");
                }
            }
        };

        xhr.open("GET", "backend.php", true);
        xhr.send();
    });
}