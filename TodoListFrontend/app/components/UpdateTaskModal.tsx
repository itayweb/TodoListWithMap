import { Box, Button, CircularProgress, IconButton, Modal, TextField, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { updateTask } from '~/api/tasks';
import { tasksAtom } from '~/atoms';
import { type FormData, type Task, type UpdateTaskModalProps } from '~/types';
import ClearIcon from '@mui/icons-material/Clear';
import PointPickerMap from './PointPickerMap';

export default function UpdateTaskModal({ task, open, onClose }: UpdateTaskModalProps) {
    const { control, handleSubmit, reset } = useForm<FormData>({
        defaultValues: { name: "", priority: 0, location: null }
    });

    const [tasks, setTasks] = useAtom(tasksAtom);

    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (open && task) {
            reset({
                name: task.name || "",
                priority: task.priority || 0,
                location: task.location || null
            });
        } else if (!open) {
            reset({ name: "", priority: 0, location: null });
            setErrorMessage('');
        }
    }, [task, open, reset]);

    const onSubmit = async (data: FormData) => {
        if (!task) {
            setErrorMessage("No task has been selected");
            return;
        }
        try {
            data.createdAt = new Date();
            data._id = task._id;
            const updatedTask = await updateTask(data);
            setTasks((prevItems) => {
                const items = Array.isArray(prevItems) ? prevItems : [];
                return items.map(item => item._id === task._id ? updatedTask : item);
            });
            reset();
            onClose();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message :
                (err as any)?.response?.data || "Failed to update task";
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
                {task === undefined ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignContent: 'center'
                        }}>
                            <Typography id="modal-modal-title" variant="h6" component="h2">
                                Edit {task.name} Task
                            </Typography>
                            <Box>
                                <IconButton onClick={onClose}>
                                    <ClearIcon />
                                </IconButton>
                            </Box>
                        </Box>
                        <form onSubmit={handleSubmit(onSubmit)}>
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
                    </>
                )
                }
            </Box>
        </Modal>
    );
}
