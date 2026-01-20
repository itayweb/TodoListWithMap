import express from 'express';
import tasksRouter from './task.js';
import todosRouter from './todo.js';

const router = express.Router();

router.use('/tasks', tasksRouter);
router.use('/todos', todosRouter);

export default router;