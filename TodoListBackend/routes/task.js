import express from 'express';
import { Task, Todo } from '../models/models.js';

const router = express.Router();

// POST Route
router.post('/create/:id', async (req, res) => {
    try {
        console.log(`creating new task for this todo: ${req.params.id}`);
        const todoId = req.params.id;
        const newTask = new Task(req.body);
        const task = await newTask.save();
        await Todo.findByIdAndUpdate(todoId, {
            $push: { tasks: task._id }
        });
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.get('/fetch/:id', async (req, res) => {
    try {
        console.log(`retrieving all tasks for this todo: ${req.params.id}`);
        // const tasks = await Task.find({});
        const todo = await Todo.findById(req.params.id).populate('tasks');
        res.json(todo.tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/fetch', async (req, res) => {
    try {
        console.log(`retrieving all tasks`);
        // const tasks = await Task.find({});
        const tasks = await Task.find({});
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/remove/:id', async (req, res) => {
    try {
        console.log(`removing specific task: ${req.params.id}`);
        const id = req.params.id;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).send("Task not found");
        }

        res.send("Task removed successfully!")
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/update/:id', async (req, res) => {
    try {
        console.log(`updating specific task: ${req.params.id}`);
        const id = req.params.id;
        const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedTask) {
            return res.status(404).send("Task not found");
        }

        res.status(201).send(updatedTask);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;