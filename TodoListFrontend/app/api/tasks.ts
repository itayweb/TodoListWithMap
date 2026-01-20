import axios from "axios";
import type { Task } from "~/types";

export const saveTask = async (newTask: Task, todoId: string) => {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + `/tasks/create/${todoId}`, newTask);
    if (response.status == 500) throw new Error("Failed to save");
    return response.data;
}

export const fetchTasksById = async (todoId: string): Promise<Task[]> => {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + `/tasks/fetch/${todoId}`);
    if (!response.ok) throw new Error("failed to fetch");
    return response.json();
}

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/tasks/fetch");
    if (!response.ok) throw new Error("failed to fetch");
    return response.json();
}

export const removeTask = async (task: Task) => {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + `/tasks/remove/${task._id}`);
    if (response.status == 500) throw new Error("Failed to remove");
}

export const updateTask = async (task: Task): Promise<Task> => {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + `/tasks/update/${task._id}`, task);
    if (response.status == 500) throw new Error("Failed to update");
    return response.data;
}