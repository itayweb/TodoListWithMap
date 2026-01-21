import express from 'express';
import { Todo, User } from '../models/models.js';
import { isAuthenticated } from '../middleware/auth.js';
import mongoose from "mongoose";


const router = express.Router();

router.post('/create/:id', isAuthenticated, async (req, res) => {
    try {
        console.log(`creating new task for this todo: ${req.params.id}`);
        const todoId = req.params.id;
        const todo = await Todo.findById(todoId);

        if (!todo) {
            return res.status(404).send("Todo not found");
        }

        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(403).send("Unauthorized: You don't own this todo");
        }

        todo.tasks.push(req.body);
        await todo.save();

        const newTask = todo.tasks[todo.tasks.length - 1];
        res.status(201).send(newTask);
    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.get('/fetch/:id', isAuthenticated, async (req, res) => {
    try {
        console.log(`retrieving all tasks for this todo: ${req.params.id}`);
        const todo = await Todo.findById(req.params.id);

        if (!todo) {
            return res.status(404).send("Todo not found");
        }

        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(403).send("Unauthorized: You don't own this todo");
        }

        res.json(todo.tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/fetch', isAuthenticated, async (req, res) => {
    try {
        console.log(`retrieving all tasks`);
        const tasks = await Todo.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
            { $unwind: "$tasks" },
            { $replaceRoot: { newRoot: "$tasks" } }
        ]);
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/remove/:id', isAuthenticated, async (req, res) => {
    try {
        console.log(`removing specific task: ${req.params.id}`);
        const id = req.params.id;
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).send("Todo not found");
        }

        if (todo.user.toString() !== req.user._id.toString()) {
            return res.status(403).send("Unauthorized: You don't own this todo");
        }

        const task = todo.tasks.id(req.body._id);
        if (!task) {
            return res.status(404).send("Task not found");
        }

        task.remove();
        await todo.save();
        res.send("Task removed successfully!")
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.patch('/update/:id', isAuthenticated, async (req, res) => {
    try {
        console.log(`updating specific task: ${req.params.id}`);
        const id = req.params.id;
        const todo = await Todo.findOne({
            "tasks._id": id,
            user: req.user._id
        });

        if (!todo) {
            return res.status(404).send("Todo or Task not found");
        }

        const task = todo.tasks.id(id);

        task.set(req.body);
        await todo.save();

        res.status(200).send(task);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;