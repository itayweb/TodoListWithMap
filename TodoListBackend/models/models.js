import mongoose from "mongoose";

mongoose.connect('mongodb://admin:password@localhost:27017/local?authSource=admin');

export const TaskSchema = new mongoose.Schema({
    name: { type: String, required: true },
    createdAt: { type: Date, required: true },
    priority: { type: Number, required: true },
    location: { type: Object, required: true }
});

export const TodoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tasks: [TaskSchema],
});

export const Todo = mongoose.model('Todo', TodoSchema, 'todos');

export const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

export const User = mongoose.model('User', UserSchema, 'users');