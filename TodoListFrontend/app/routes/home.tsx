import type { Route } from "./+types/home";
import {
  Box,
  Tab,
  Tabs,
  type SelectChangeEvent,
} from "@mui/material";
import CustomSidebar from "~/components/CustomSidebar";
import { useEffect, useState } from "react";
import { fetchTasksAtom, fetchTodosAtom, selectedTodosAtom, tasksAtom, todosAtom } from "~/atoms";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import TodosContainer from "~/components/TodosContainer";
import TasksContainer from "~/components/TasksContainer";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const [tabValue, setTabValue] = useState(0);

  const fetchTasks = useSetAtom(fetchTasksAtom);
  const fetchTodos = useSetAtom(fetchTodosAtom);

  useEffect(() => {
    const initialFetch = async () => {
      await fetchTodos();
      await fetchTasks('');
    }

    initialFetch();
  }, []);

  return (
    <CustomSidebar>
      <Tabs value={tabValue} onChange={(e, value) => setTabValue(value)} centered>
        <Tab label="Todos" />
        <Tab label="Tasks" />
      </Tabs>
      {
        tabValue === 0 ?
          <TodosContainer />
          : <TasksContainer />
      }
      <Box
        sx={{
          marginY: "5vh",
          marginX: "2.5vw",
        }}
      >
      </Box>
    </CustomSidebar>
  );
}
