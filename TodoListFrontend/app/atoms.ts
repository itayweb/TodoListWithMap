import { atom } from 'jotai'
import { type User, type Task, type Todo } from './types';
import { fetchTodos } from './api/todos';
import { fetchTasks, fetchTasksById } from './api/tasks';
import { getUser } from './api/auth';
import api from './api/api';

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
        set(tasksAtom, data);
    } else {
        const data = await fetchTasksById(todoId);
        set(tasksAtom, data);
    }
});

export const selectedTaskAtom = atom<Task>();

export const modalAtom = atom('');

export const userAtom = atom<User | null>(null);

export const authLoadingAtom = atom(false);

export const registerAction = atom(null, async (get, set, newUser: User) => {
    await api.post('/auth/register', newUser);
    const res = await api.post('/auth/login', newUser);
    set(userAtom, res.data);
});

export const loginAction = atom(null, async (get, set, user: User) => {
    const res = await api.post('/auth/login', user);
    set(userAtom, res.data);
});

export const logoutAction = atom(null, async (get, set, user: User) => {
    await api.post("/auth/logout", user);
    set(userAtom, null);
});

export const checkAuthAction = atom(null, async (get, set) => {
    set(authLoadingAtom, true);
    try {
        const res = await api.get('/auth/user');
        set(userAtom, res.data);
    } catch {
        set(userAtom, null);
    } finally {
        set(authLoadingAtom, false);
    }
});