import express from 'express';
import { Todo, User } from '../models/models.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// POST Route
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        console.log("creating new todo");
        req.body.user = req.user._id;
        const newTodo = new Todo(req.body);
        const todo = await newTodo.save();
        res.status(201).send(todo);
    } catch (err) {
        res.status(400).send(err.message)
    }
});

router.get('/fetch', isAuthenticated, async (req, res) => {
    try {
        console.log("retrieving all todos");
        const todos = await Todo.find({ user: req.user._id });
        res.json(todos);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/delete/:id', isAuthenticated, async (req, res) => {
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

router.patch('/update/:id', isAuthenticated, async (req, res) => {
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