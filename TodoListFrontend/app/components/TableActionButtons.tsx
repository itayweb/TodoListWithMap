import { Box, IconButton } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Task } from '~/types';
import { useAtom } from 'jotai';
import { modalAtom, selectedTaskAtom, todosAtom } from '~/atoms';
import { removeTask } from '~/api/tasks';
import type { Row } from '@tanstack/react-table';

export default function TableActionButtons({ row }: { row: Row<Task> }) {
    const [todo, setTodo] = useAtom(todosAtom);
    const [activeModal, setActiveModal] = useAtom(modalAtom);
    const [selectedTask, setSelectedTask] = useAtom(selectedTaskAtom);

    const handleRemovingTask = async (original: Task): Promise<void> => {
        await removeTask(original);
        setTodo(prevItems => prevItems.filter(item => item._id !== original._id));
    }

    const handleEditRow = () => {
        console.log("task: ", row.original);
        setSelectedTask(row.original);
        setActiveModal('update_task');
    }

    return (
        <Box>
            <IconButton onClick={handleEditRow}>
                <EditIcon color="primary" />
            </IconButton>
            <IconButton onClick={() => handleRemovingTask(row.original)}>
                <DeleteIcon color="primary" />
            </IconButton>
        </Box>
    )
}
