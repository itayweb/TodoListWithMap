import { atom } from 'jotai'
import type { Task, Todo } from './types';
import { fetchTodos } from './api/todos';
import { fetchTasks, fetchTasksById } from './api/tasks';

export const todosAtom = atom<Todo[]>([]);

export const fetchTodosAtom = atom((get) => get(todosAtom), async (get, set) => {
    const data = await fetchTodos();
    set(todosAtom, data);
});

export const selectedTodosAtom = atom("");

export const tasksAtom = atom<Task[]>([]);

export const fetchTasksAtom = atom((get) => get(selectedTodosAtom), async (get, set, todoId: string) => {
    set(selectedTodosAtom, todoId);

    if (todoId === '') {
        const data = await fetchTasks();
        console.log("data: ", data);
        set(tasksAtom, data);
    } else {
        const data = await fetchTasksById(todoId);
        console.log("data: ", data);
        set(tasksAtom, data);
    }
});

export const selectedTaskAtom = atom<Task>();

export const modalAtom = atom('');