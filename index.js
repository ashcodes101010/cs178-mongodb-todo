const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// Configure env
dotenv.config();

// Models
const TodoTask = require("./models/TodoTask");

// Access css
app.use("/static", express.static("public"));


// Connection to db
mongoose.set('strictQuery', false);
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Connected to db!");
    app.listen(3000, () => console.log("Server Up and running"));
});

// View engine config
app.set("view engine", "ejs");

// Add form data to body of request
app.use(express.urlencoded({ extended: true }));

// GET (READ Todos)
// Concept: routing
app.get("/", (req, res) => {
    // Concept: callback
    TodoTask.find({}, (err, tasks) => {
        // Concept: template
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// POST (CREATE Todo)
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });

    try {
        // Concept: database
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
 });

// GET/POST (UPDATE Todo)
// Concept: routing
app.route("/edit/:id").get((req, res) => {
    const id = req.params.id; // Concept: requestParameters
    TodoTask.find({}, (err, tasks) => {
        // Concept: template
        res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
    });
}).post((req, res) => {
    const id = req.params.id;
    // Concept: database
    TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});

// GET (DELETE Todo)
// Concept: routing
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id; // Concept: requestParameters
    // Concept: database
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});