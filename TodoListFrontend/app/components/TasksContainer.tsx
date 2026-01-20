import { Box, Button, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { fetchTasksAtom, modalAtom, selectedTaskAtom, selectedTodosAtom, todosAtom } from "~/atoms";
import { useAtom, useSetAtom } from "jotai";
import { Suspense } from "react";
import CreateTaskModal from "./CreateTaskModal";
import UpdateTaskModal from "./UpdateTaskModal";
import TasksTable from "./TasksTable";

export default function TasksContainer() {
    const [todos, setTodos] = useAtom(todosAtom);
    const [activeModal, setActiveModal] = useAtom(modalAtom);
    const [filterTodoId, setFilterTodoId] = useAtom(selectedTodosAtom);
    const [selectedTask, setSelectedTask] = useAtom(selectedTaskAtom);
    const fetchTasks = useSetAtom(fetchTasksAtom);

    const handleChange = async (todoId: string) => {
        setFilterTodoId(todoId);
        await fetchTasks(todoId);
    };

    return (
        <Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'center'
            }}>
                <Typography variant="h2">Tasks</Typography>
                <Button variant="contained" onClick={() => setActiveModal('create_task')}>
                    <AddIcon />
                    Create Task
                </Button>
            </Box>
            {
                todos && todos.length > 0 && (
                    <Box sx={{
                        marginY: '1.5vh',
                        display: 'flex',
                        gap: '1vw'
                    }}>
                        <Button
                            variant={filterTodoId === '' ? "contained" : "outlined"}
                            onClick={() => handleChange('')}
                        >
                            All Todos
                        </Button>
                        {todos.map((todo) => (
                            <Button
                                variant={filterTodoId === todo._id ? "contained" : "outlined"}
                                onClick={() => handleChange(todo._id)}
                                key={todo._id}
                            >
                                {todo.name}
                            </Button>
                        ))}
                    </Box>
                )
            }
            <Box
                sx={{
                    display: "flex",
                    gap: "1.5vw",
                }}
            >
                <Suspense fallback={<Typography>Loading todos..</Typography>}>
                    <TasksTable />
                </Suspense>
                <CreateTaskModal open={activeModal === 'create_task'} onClose={() => setActiveModal('')} />
                <UpdateTaskModal task={selectedTask} open={activeModal === 'update_task'} onClose={() => setActiveModal('')} />
            </Box>
        </Box>
    )
}
