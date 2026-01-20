import { Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import { useAtom } from "jotai";
import { useState } from "react";
import { deleteTodo } from "~/api/todos";
import { todosAtom } from "~/atoms";
import type { TodoCardProps } from "~/types";

export default function TodoCard({ todo, setActiveModal }: TodoCardProps) {
    const [todos, setTodos] = useAtom(todosAtom);
    const [errorMessage, setErrorMessage] = useState('');

    const onDeleteTodo = async () => {
        try {
            await deleteTodo(todo._id);
            setTodos(prevItems => prevItems.filter(item => item._id !== todo._id));
            setActiveModal('', todo);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message :
                (err as any)?.response?.data || "Failed to update todo";
            setErrorMessage(errorMessage);
        }
    }

    return (
        <Card variant="outlined" sx={{
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            borderRadius: '7%'
        }}>
            <CardContent>
                <Typography>{todo.name}</Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" onClick={() => setActiveModal('update_todo', todo)}>
                    Edit
                </Button>
                <Button variant="contained" sx={{
                    backgroundColor: 'red'
                }} onClick={onDeleteTodo}>
                    Delete
                </Button>
            </CardActions>
        </Card>
    )
}
