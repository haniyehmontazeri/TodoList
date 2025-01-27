<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <title>To-Do List</title>
</head>

<body>
    <div class="container">
        <h1>To-Do List</h1>

        <form id="taskForm">
            <input type="text" id="taskName" placeholder="Task name" required>
            <textarea id="taskDescription" placeholder="Task description"></textarea>
            <input type="date" id="dueDate">
            <select id="priority">
                <option value="3 high">High</option>
                <option value="2 medium">Medium</option>
                <option value="1 low">Low</option>
            </select>
            <select id="category">
                <option value="personal">Personal</option>
                <option value="work">Work</option>
                <option value="study">Study</option>
            </select>
            <input type="hidden" id="editTaskId">

            <button type="button" style="border-radius:5px;" onclick="addTask()">Add Task</button>
        </form>
        <div style="background:#eee; width:100%; height:1px; margin-top:10px; margin-bottom:10px;"></div>

        <div id="searchContainer">
            <label for="searchInput">Search:</label>
            <input type="text" id="searchInput" oninput="searchTasks()">
        </div>

        <div id="filterSortContainer">
            <label for="filterSelect">Filter by:</label>
            <select id="filterSelect" onchange="searchTasks()">
                <option value="">All</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
            </select>

            <label for="sortSelect">Sort by:</label>
            <select id="sortSelect" onchange="searchTasks()">
                <option value="due_date ASC">Due Date (Ascending)</option>
                <option value="due_date DESC">Due Date (Descending)</option>
                <option value="priority ASC">Priority (Low to High)</option>
                <option value="priority DESC">Priority (High to Low)</option>
            </select>
        </div>

        <div style="background:#eee; width:100%; height:1px; margin-top:10px; margin-bottom:10px;"></div>

        <h4>Tasks</h4>
        <div id="taskList" class="card"></div>

    </div>
    <div id="editModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeEditModal()">&times;</span>
            <h2>Edit Task</h2>
            <form id="editTaskForm">
                <label for="editTaskName">Task Name:</label>
                <input type="text" id="editTaskName" required>

                <label for="editTaskDescription">Description:</label>
                <textarea id="editTaskDescription"></textarea>

                <label for="editDueDate">Due Date:</label>
                <input type="date" id="editDueDate">

                <label for="editPriority">Priority:</label>
                <select id="editPriority">
                    <option value="1 low">Low</option>
                    <option value="2 medium">Medium</option>
                    <option value="3 high">High</option>
                </select>

                <label for="editCategory">Category:</label>
                <input type="text" id="editCategory">

                <button type="button" onclick="updateTask()">Update Task</button>
            </form>
        </div>
    </div>
    <script src="script.js"></script>
</body>

</html>