Todo Application

This is a simple Todo Application built using PHP, JavaScript, and MySQL. The application allows users to manage their tasks effectively, with a responsive UI and backend support.

Features

Add, edit, and delete tasks

Mark tasks as completed

Persistent storage using a MySQL database

Responsive design with custom styling

Project Structure

index.php: The main entry point of the application, containing the HTML structure.

styles.css: Custom styles for the application UI.

script.js: Handles client-side interactivity and communication with the backend.

backend.php: Server-side logic for handling requests such as adding, updating, and deleting tasks.

tasks (1).sql: SQL file containing the database schema for setting up the tasks table.

Requirements

PHP 7.4 or later

MySQL 5.7 or later

A web server like Apache or Nginx

Setup Instructions

Clone the Repository:

git clone https://github.com/haniyehmontazeri/TodoList
cd todo

Set Up the Database:

Import the tasks (1).sql file into your MySQL database:

mysql -u <username> -p <database_name> < tasks\ (1).sql

Configure the Backend:

Update the database connection details in backend.php if necessary (host, username, password, database name).

Run the Application:

Start your web server and navigate to the application in your browser (e.g., http://localhost/todo).

Usage

Open the application in your browser.

Use the input field to add new tasks.

Mark tasks as completed by checking the checkbox.

Edit or delete tasks using the corresponding buttons.

Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
