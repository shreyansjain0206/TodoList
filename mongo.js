// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");

// const app = express();
// const PORT = 3000;

// // Connect to MongoDB (Local or Atlas)
// mongoose.connect("mongodb://localhost:27017/", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// });

// const taskSchema = new mongoose.Schema({ name: String });
// const Task = mongoose.model("Task", taskSchema);

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));
// app.set("view engine", "ejs");

// app.get("/", async (req, res) => {
//     const tasks = await Task.find();
//     res.render("index", { tasks });
// });

// app.post("/add", async (req, res) => {
//     const task = new Task({ name: req.body.task });
//     await task.save();
//     res.redirect("/");
// });

// app.post("/delete", async (req, res) => {
//     await Task.findByIdAndDelete(req.body.taskId);
//     res.redirect("/");
// });

// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));


import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3000;

// Convert ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB (Local or Atlas)
mongoose.connect("mongodb://localhost:27017/todoDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Define Schema & Model
const taskSchema = new mongoose.Schema({ name: String });
const Task = mongoose.model("Task", taskSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Routes
app.get("/", async (req, res) => {
    try {
        const tasks = await Task.find();
        res.render("index", { tasks });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/add", async (req, res) => {
    try {
        const task = new Task({ name: req.body.task });
        await task.save();
        res.redirect("/");
    } catch (error) {
        console.error("Error adding task:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/delete", async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.body.taskId);
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting task:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/update", async (req, res) => {
    try {
        const { taskId, newName } = req.body;
        await Task.findByIdAndUpdate(taskId, { name: newName });
        res.redirect("/");
    } catch (error) {
        console.error("Error updating task:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/mark", async (req, res) => {
    try {
        const task = await Task.findById(req.body.taskId);
        await Task.findByIdAndUpdate(req.body.taskId, { completed: !task.completed });
        res.redirect("/");
    } catch (error) {
        console.error("Error marking task:", error);
        res.status(500).send("Internal Server Error");
    }
});


// Start Server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
