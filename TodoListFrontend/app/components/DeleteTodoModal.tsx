import { Box, Button, FormControl, IconButton, InputLabel, MenuItem, Modal, Select, Typography, type SelectChangeEvent } from '@mui/material';
import { useAtom } from 'jotai';
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { fetchTasksById } from '~/api/tasks';
import { selectedTodosAtom, todosAtom } from '~/atoms';
import { type DeleteTodoForm, type DeleteTodoModalProps } from '~/types';
import ClearIcon from '@mui/icons-material/Clear';
import { deleteTodo } from '~/api/todos';

export default function DeleteTodoModal({ open, onClose }: DeleteTodoModalProps) {
    const { control, handleSubmit, reset } = useForm<DeleteTodoForm>({
        defaultValues: { todo: "" }
    });

    const [todos, setTodos] = useAtom(todosAtom);
    const [selectedTodo, setSelectedTodo] = useAtom(selectedTodosAtom);

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = async (event: SelectChangeEvent, fieldOnChange: (value: string) => void) => {
        const value = event.target.value;
        setSelectedTodo(value);
        fieldOnChange(value);
        await fetchTasksById(value);
    };

    const onSubmit = async (data: DeleteTodoForm) => {
        try {
            await deleteTodo(data.todo);
            setTodos(prevItems => prevItems.filter(item => item._id !== data.todo));
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
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
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
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Delete Todo
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
                        rules={{ required: "Please select a todo to delete" }}
                        render={({ field }) => (
                            <FormControl fullWidth sx={{
                                marginTop: '3vh'
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
