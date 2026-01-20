import { Box, Button, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { todosAtom } from "~/atoms";
import { useAtom } from "jotai";
import TodoCard from "./TodoCard";
import { useState } from "react";
import CreateTodoModal from "./CreateTodoModal";
import UpdateTodoModal from "./UpdateTodoModal";
import type { Todo } from "~/types";

export default function TodosContainer() {
    const [todos, setTodos] = useAtom(todosAtom);
    const [activeModal, setActiveModal] = useState('');
    const [selectedTodo, setSelectedTodo] = useState<Todo>();

    const onSelectModal = (modalToActivate: string, selectTodo: Todo) => {
        setSelectedTodo(selectTodo);
        setActiveModal(modalToActivate);
    }

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'center'
            }}>
                <Typography variant="h2">Todos</Typography>
                <Button variant="contained" onClick={() => setActiveModal('create_todo')}>
                    <AddIcon />
                    Create Todo
                </Button>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    gap: "1.5vw",
                    marginY: '2vh'
                }}
            >
                {todos.map((todo) => (
                    <TodoCard todo={todo} key={todo._id} setActiveModal={onSelectModal} />
                ))}
                <CreateTodoModal open={activeModal === 'create_todo'} onClose={() => setActiveModal('')} />
                <UpdateTodoModal todo={selectedTodo} open={activeModal === 'update_todo'} onClose={() => setActiveModal('')} />
            </Box>
        </Box>
    )
}
