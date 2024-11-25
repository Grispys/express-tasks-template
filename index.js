const express = require('express');
const app = express();
const PORT = 3000;
// import pool for postgres
const { Pool } = require('pg');

// set up hook for postgres database
const pool = new Pool({
    user:'postgres',
    host: 'localhost',
    database: 'DBQAP3',
    password: 'persona',
    port: 5432,
});


// created function for creating the table for tasks

async function createTable(){
    let query = `CREATE TABLE IF NOT EXISTS Tasks (id SERIAL PRIMARY KEY, description TEXT NOT NULL, status TEXT NOT NULL)`

    try {
        await pool.query(query);
        console.log("Table created successfully.");
    } catch(error) {
        console.log("Error creating table: ", error)
    }

}






app.use(express.json());


// instead of defining tasks here, make function to insert da stuff instead

async function insertTask(description, status){
    let query = `INSERT INTO Tasks(description, status) VALUES ('${description}', ${status})`
    try {
        await pool.query(query)
        console.log("Successfully added task to the table")
    } catch (error){
        console.error("Error adding task: ", error);
    }
};


// function to update the tasks
async function updateTask(taskID, status) {
    let query = `UPDATE tasks SET status = '${status}' WHERE id = ${taskID}`

    try {
        await pool.query(query)
        console.log("Task has been updated: " + taskID + "," + status)
    }   catch(error){
        console.log("Error updating task: ", error);
    }
};


// function to delete tasks
async function deleteTask(taskID){
    let query = `DELETE FROM Tasks WHERE id = ${taskID}`
    try {
        await pool.query(query)
        console.log("Successfully deleted task: " + taskID)
    } catch (error){
        console.error("Error deleting task: ", error)
    }
};


// function to display the table for stuff like the app.get(tasks)
async function displayTasks(){
    let query = `SELECT * FROM Tasks`;

    try{
        let tasks = await pool.query(query)
        console.log("Tasks: ") //temporary way to display, will move to the webpage later
        tasks.rows.forEach((row) =>{
            console.log(row.id, " " + row.description + " " + row.status);
        })
    } catch (error){
        console.error("Error displaying the tasks: ", error)
    }
};


// let tasks = [
//     { id: 1, description: 'Buy groceries', status: 'incomplete' },
//     { id: 2, description: 'Read a book', status: 'complete' },
// ];




// GET /tasks - Get all tasks
app.get('/tasks', (req, res) => {
    displayTasks()
});





// POST /tasks - Add a new task
app.post('/tasks', (request, response) => {
    const { id, description, status } = request.body;
    if (!id || !description || !status) {
        return response.status(400).json({ error: 'All fields (id, description, status) are required' });
    }

    insertTask(id, description, status)
});




// PUT /tasks/:id - Update a task's status
app.put('/tasks/:id', (request, response) => {
    const taskID = parseInt(request.params.id, 10);
    const { status } = request.body;

    updateTask(taskID, status);
});





// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (request, response) => {
    const taskId = parseInt(request.params.id, 10);
    deleteTask(taskId);
});





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
