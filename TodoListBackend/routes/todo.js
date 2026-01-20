import express from 'express';
import { Todo, Task } from '../models/models.js';

const router = express.Router();

// POST Route
router.post('/create', async (req, res) => {
    try {
        console.log("creating new todo");
        const newTask = new Todo(req.body);
        const task = await newTask.save();
        res.status(201).send(task);
    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.get('/fetch', async (req, res) => {
    try {
        console.log("retrieving all todos");
        const tasks = await Todo.find({});
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        console.log(`removing specific todo: ${req.params.id}`);
        const id = req.params.id;
        // 1. Find the todo to get the list of task IDs
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // 2. Delete all tasks whose IDs are in the todo's tasks array
        await Task.deleteMany({ _id: { $in: todo.tasks } });

        // 3. Delete the todo itself
        await Todo.findByIdAndDelete(id);

        res.send("Todo removed successfully!")
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.patch('/update/:id', async (req, res) => {
    try {
        console.log(`updating specific todo: ${req.params.id}`);
        const id = req.params.id;
        const updatedTodo = await Todo.findByIdAndUpdate(id, { name: req.body.name }, { new: true });

        if (!updatedTodo) {
            return res.status(404).send("Todo not found");
        }

        res.status(201).send(updatedTodo);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

export default router;