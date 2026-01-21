import axios from "axios";
import type { Todo } from "~/types";
import api from "./api";

export const saveTodo = async (newTodo: Todo): Promise<Todo> => {
    const response = await api.post("/todos/create", newTodo);
    if (response.status == 500) throw new Error("Failed to save");
    return response.data;
};

export const fetchTodos = async (): Promise<Todo[]> => {
    const response = await api.get("/todos/fetch");
    if (response.status == 500) throw new Error("failed to fetch");
    return response.data;
}

export const deleteTodo = async (todo: string) => {
    const response = await api.delete(`/todos/delete/${todo}`);
    if (response.status == 500) throw new Error("Failed to delete");
}

export const updateTodo = async (todo: string, newTodo: string): Promise<Todo> => {
    const response = await api.patch(`/todos/update/${todo}`, { name: newTodo });
    if (response.status == 500) throw new Error("Failed to update");
    return response.data;
}