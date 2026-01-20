import axios from "axios";
import type { Todo } from "~/types";

export const saveTodo = async (newTodo: Todo): Promise<Todo> => {
    const response = await axios.post(import.meta.env.VITE_BACKEND_URL + "/todos/create", newTodo);
    if (response.status == 500) throw new Error("Failed to save");
    return response.data;
};

export const fetchTodos = async (): Promise<Todo[]> => {
    const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/todos/fetch");
    if (!response.ok) throw new Error("failed to fetch");
    return response.json();
}

export const deleteTodo = async (todo: string) => {
    const response = await axios.delete(import.meta.env.VITE_BACKEND_URL + `/todos/delete/${todo}`);
    if (response.status == 500) throw new Error("Failed to delete");
}

export const updateTodo = async (todo: string, newTodo: string): Promise<Todo> => {
    const response = await axios.patch(import.meta.env.VITE_BACKEND_URL + `/todos/update/${todo}`, { name: newTodo });
    if (response.status == 500) throw new Error("Failed to update");
    return response.data;
}