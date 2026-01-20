import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, TextField, Typography, type SelectChangeEvent } from '@mui/material';
import { useAtom } from 'jotai';
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { fetchTasksById, saveTask } from '~/api/tasks';
import { selectedTodosAtom, tasksAtom, todosAtom } from '~/atoms';
import { type CreateTaskModalProps, type TaskForm } from '~/types';
import PointPickerMap from './PointPickerMap';
import ClearIcon from '@mui/icons-material/Clear';

export default function CreateTaskModal({ open, onClose }: CreateTaskModalProps) {
    const { control, handleSubmit, reset } = useForm<TaskForm>({
        defaultValues: { name: "", priority: 0, location: null }
    });

    const [tasks, setTasks] = useAtom(tasksAtom);
    const [todos, setTodos] = useAtom(todosAtom)
    const [selectedTodo, setSelectedTodo] = useAtom(selectedTodosAtom);

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = async (event: SelectChangeEvent, fieldOnChange: (value: string) => void) => {
        const value = event.target.value;
        setSelectedTodo(value);
        fieldOnChange(value);
        await fetchTasksById(value);
    };

    const onSubmit = async (data: TaskForm) => {
        try {
            data.createdAt = new Date();
            const createdTask = await saveTask(data, data.todo);
            setTasks((prev) => [...prev, createdTask]);
            reset();
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message :
                (err as any)?.response?.data || "Failed to update todo";
            setErrorMessage(errorMessage);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="create-task-modal-title"
            aria-describedby="create-task-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 400,
                bgcolor: 'background.paper',
                border: '2px solid #000',
                boxShadow: 24,
                p: 4,
            }}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center'
                }}>
                    <Typography id="create-task-modal-title" variant="h6" component="h2">
                        Create new Task
                    </Typography>
                    <Box>
                        <IconButton onClick={onClose}>
                            <ClearIcon />
                        </IconButton>
                    </Box>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)} style={{
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Controller
                        control={control}
                        name="todo"
                        rules={{ required: "Please select a todo to update" }}
                        render={({ field }) => (
                            <FormControl fullWidth sx={{
                                marginTop: '1.5vh'
                            }}>
                                <InputLabel id="select-label">Todo</InputLabel>
                                <Select
                                    labelId="select-label"
                                    id="select"
                                    value={field.value || selectedTodo || ""}
                                    label="Todo"
                                    onChange={(e) => handleChange(e, field.onChange)}
                                >
                                    {todos.map((todo) => (
                                        <MenuItem key={todo._id} value={todo._id}>{todo.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                    <Controller
                        control={control}
                        name="name"
                        rules={{ required: "Please enter a task name" }}
                        render={({ field }) => (
                            <TextField id="name" label="Enter a task name" value={field.value} onChange={field.onChange} sx={{
                                marginY: '1vh'
                            }} />
                        )} />
                    <Controller
                        control={control}
                        name="priority"
                        rules={{ required: "Please enter a task priority" }}
                        render={({ field }) => (
                            <TextField id="name" label="Enter a task priority" type="number" value={field.value} onChange={field.onChange} sx={{
                                marginY: '1vh'
                            }} slotProps={{
                                htmlInput: {
                                    min: 0,
                                },
                            }} />
                        )} />
                    <Typography>Select Location:</Typography>
                    <Controller
                        control={control}
                        name="location"
                        rules={{ required: "Please select a point on the map" }}
                        render={({ field, fieldState }) => (
                            <>
                                <PointPickerMap value={field.value} onChange={field.onChange} />
                                {fieldState.error && <span style={{ color: 'red' }}>{fieldState.error.message}</span>}
                            </>
                        )}
                    />
                    <Button type="submit" variant="contained" sx={{
                        marginY: '1vh'
                    }}>
                        Submit
                    </Button>
                    {errorMessage.length > 0 &&
                        <Typography color='red'>
                            {errorMessage}
                        </Typography>
                    }
                </form>
            </Box>
        </Modal>
    );
}
