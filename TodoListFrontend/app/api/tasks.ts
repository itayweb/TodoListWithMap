import axios from "axios";
import type { Task } from "~/types";
import api from "./api";

export const saveTask = async (newTask: Task, todoId: string) => {
    const response = await api.post(`/tasks/create/${todoId}`, newTask);
    if (response.status == 500) throw new Error("Failed to save");
    return response.data;
}

export const fetchTasksById = async (todoId: string): Promise<Task[]> => {
    const response = await api.get(`/tasks/fetch/${todoId}`);
    if (response.status == 500) throw new Error("failed to fetch");
    return response.data;
}

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await api.get("/tasks/fetch");
    if (response.status == 500) throw new Error("failed to fetch");
    return response.data;
}

export const removeTask = async (task: Task) => {
    const response = await api.delete(`/tasks/remove/${task._id}`);
    if (response.status == 500) throw new Error("Failed to remove");
}

export const updateTask = async (task: Task): Promise<Task> => {
    const response = await api.patch(`/tasks/update/${task._id}`, task);
    if (response.status == 500) throw new Error("Failed to update");
    return response.data;
}