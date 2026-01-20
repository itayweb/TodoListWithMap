// const mongoose = require('../db/dbConnection');
import mongoose from "mongoose";

mongoose.connect('mongodb://admin:password@localhost:27017/local?authSource=admin');

// Define a Schema
export const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, required: true },
    priority: { type: Number, required: true },
    location: { type: Object, required: true }
});

// Create a Model
export const Task = mongoose.model('Task', TaskSchema, 'tasks');

export const TodoSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

// Create a Model
export const Todo = mongoose.model('Todo', TodoSchema, 'todos');