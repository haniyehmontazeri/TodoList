<?php
function connectToDatabase()
{
    $host = "localhost";
    $dbname = "todo_list";
    $username = "root";
    $password = "";

    try {
        $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $conn;
    } catch (PDOException $e) {
        die("Connection failed: " . $e->getMessage());
    }
}
function addTask($task)
{
    $conn = connectToDatabase();

    $sql = "INSERT INTO tasks (name, description, due_date, priority, category) 
            VALUES (:name, :description, :due_date, :priority, :category)";

    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':name', $task['name']);
    $stmt->bindParam(':description', $task['description']);
    $stmt->bindParam(':due_date', $task['dueDate']);
    $stmt->bindParam(':priority', $task['priority']);
    $stmt->bindParam(':category', $task['category']);

    $stmt->execute();

    $conn = null; 
}
function getTasks()
{
    $conn = connectToDatabase();

    $sql = "SELECT * FROM tasks ORDER BY due_date ASC";
    $stmt = $conn->query($sql);

    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $conn = null; 

    return $tasks;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_GET['action'])) {
    $postData = file_get_contents('php://input');
    $task = json_decode($postData, true);

    addTask($task);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && !isset($_GET['filter'])) {
    $tasks = getTasks();
    echo json_encode($tasks);
}

function completeTask($taskId)
{
    $conn = connectToDatabase();

    $sql = "UPDATE tasks SET status = 'completed' WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $taskId);
    $stmt->execute();

    $conn = null; 
}

function archiveCompletedTasks()
{
    $conn = connectToDatabase();

    $sql = "DELETE FROM tasks WHERE status = 'completed'";
    $conn->exec($sql);

    $conn = null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'complete') {
    $taskId = file_get_contents('php://input');
    completeTask($taskId);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'archive') {
    archiveCompletedTasks();
}

function archiveOverdueTasks()
{
    $conn = connectToDatabase();

    $currentDate = date("Y-m-d H:i:s");
    $sql = "UPDATE tasks SET status = 'archived' WHERE due_date < :currentDate AND status != 'completed'";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':currentDate', $currentDate);
    $stmt->execute();

    $conn = null; 
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'archiveOverDue') {
    archiveOverdueTasks();
}

function getFilteredTasks($filter = null, $sortBy = null, $category = null)
{
    $conn = connectToDatabase();

    $sql = "SELECT * FROM tasks";

    if ($filter !== null) {
        $sql .= " WHERE name LIKE :filter and category LIKE :category";
    }

    if ($sortBy !== null) {
        $sql .= " ORDER BY $sortBy";
    }

    $stmt = $conn->prepare($sql);

    // if ($filter !== null) {
        $stmt->bindValue(':filter', "%$filter%", PDO::PARAM_STR);
    // }

    // if ($category !== null) {
 
        $stmt->bindValue(':category', "%$category%", PDO::PARAM_STR);
    // }

    $stmt->execute();

    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $conn = null; 

    return $tasks;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['filter']) && isset($_GET['sort'])) {
    $filter = $_GET['filter'];
    $sortBy = $_GET['sort'];
    $category = $_GET['category'];
    $tasks = getFilteredTasks($filter, $sortBy, $category);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($tasks, JSON_UNESCAPED_UNICODE);
}


function deleteTask($taskId)
{
    $conn = connectToDatabase();

    $sql = "DELETE FROM tasks WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $taskId);
    $stmt->execute();

    $conn = null; 
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'delete') {
    $postData = file_get_contents('php://input');
    $taskData = json_decode($postData, true);

    $taskId = $taskData['id'];
    deleteTask($taskId);
}
function toggleTaskStatus($taskId, $newStatus)
{
    $conn = connectToDatabase();

    $sql = "UPDATE tasks SET status = :status WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $taskId);
    $stmt->bindParam(':status', $newStatus);
    $stmt->execute();

    $conn = null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'toggleStatus') {
    $postData = file_get_contents('php://input');
    $taskData = json_decode($postData, true);

    $taskId = $taskData['id'];
    $newStatus = $taskData['status'];
    toggleTaskStatus($taskId, $newStatus);
}

function markAsArchive($taskId)
{
    $conn = connectToDatabase();

    $sql = "UPDATE tasks SET status = 'archived' WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $taskId);
    $stmt->execute();

    $conn = null; 
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'markAsArchive') {
    $postData = file_get_contents('php://input');
    $taskData = json_decode($postData, true);

    $taskId = $taskData['id'];
    markAsArchive($taskId);
}
function updateTask($updatedTask)
{
    $conn = connectToDatabase();

    $sql = "UPDATE tasks 
            SET name = :name, 
                description = :description, 
                due_date = :due_date, 
                priority = :priority, 
                category = :category 
            WHERE id = :id";
    
    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':id', $updatedTask['id']);
    $stmt->bindParam(':name', $updatedTask['name']);
    $stmt->bindParam(':description', $updatedTask['description']);
    $stmt->bindParam(':due_date', $updatedTask['dueDate']);
    $stmt->bindParam(':priority', $updatedTask['priority']);
    $stmt->bindParam(':category', $updatedTask['category']);

    $stmt->execute();

    $conn = null; 
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'updateTask') {
    $postData = file_get_contents('php://input');
    $updatedTask = json_decode($postData, true);
    updateTask($updatedTask);
}