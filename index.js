const express = require('express');
const app = express();
const path = require("path");
const PORT = 3000;
// import pool for postgres and ejs stuff
const { Pool } = require('pg');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

// immediately call that function to create tables
createTable();





app.use(express.json());


// instead of defining tasks here, make function to insert da stuff instead

async function insertTask(description, status){
    let query = `INSERT INTO Tasks(description, status) VALUES ('${description}', '${status}')`
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
        let result = await pool.query(query)
        console.log("Tasks: ") //temporary way to display, will move to the webpage later
        result.rows.forEach((row) =>{
            console.log(row.id, " " + row.description + " " + row.status);
        })
        return result.rows;
    } catch (error){
        console.error("Error displaying the tasks: ", error)
    }
};


// let tasks = [
//     { id: 1, description: 'Buy groceries', status: 'incomplete' },
//     { id: 2, description: 'Read a book', status: 'complete' },
// ];




app.get('/', (req, res) =>{
    res.render('index');
})

// GET /tasks - Get all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await displayTasks();
    res.render('tasks', {tasks})
    
});

app.get('/updateTasks', async(req,res)=>{
    res.render('updateTasks')
})

app.get('/deleteTasks', async (req, res) =>{
    const tasks = await displayTasks()
    res.render('deleteTasks', {tasks})
})

app.post('/deleteTasks', async(req, res)=>{
    const {taskId} = req.body;
    await deleteTask(taskId)
    res.redirect('/deleteTasks');
});





// POST /tasks - Add a new task
app.post('/tasks', (request, response) => {
    const { description, status } = request.body;
    if (!description || !status) {
        return response.status(400).json({ error: 'All fields (description, status) are required' });
    }

    insertTask(description, status)
    response.redirect('/tasks')
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
