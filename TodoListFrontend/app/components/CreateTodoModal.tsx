import { Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { todosAtom } from '~/atoms';
import { type CreateTodoModalProps, type TodoForm } from '~/types';
import ClearIcon from '@mui/icons-material/Clear';
import { saveTodo } from '~/api/todos';

export default function CreateTodoModal({ open, onClose }: CreateTodoModalProps) {
    const { control, handleSubmit, reset } = useForm<TodoForm>({
        defaultValues: { name: "" }
    });

    const [todos, setTodos] = useAtom(todosAtom);

    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (data: TodoForm) => {
        try {
            const todo = await saveTodo(data);
            setTodos((prev) => [...prev, todo]);
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
                        Create new Todo
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
                        name="name"
                        rules={{ required: "Please enter a todo name" }}
                        render={({ field }) => (
                            <TextField id="name" label="Enter a todo name" value={field.value} onChange={field.onChange} sx={{
                                marginY: '1vh'
                            }} />
                        )} />
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
