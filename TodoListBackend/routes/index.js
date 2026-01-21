import express from 'express';
import tasksRouter from './task.js';
import todosRouter from './todo.js';
import authRouter from './auth.js';

const router = express.Router();

router.use('/tasks', tasksRouter);
router.use('/todos', todosRouter);
router.use('/auth', authRouter);

export default router;