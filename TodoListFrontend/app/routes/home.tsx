import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import Sidebar from "~/components/sidebar";
import MyTable from "~/components/mytable";
// import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const drawerWidth = 240;

  return (
    <Sidebar>
      <Box
        sx={{
          display: "flex",
          gap: "1.5vw",
        }}
      >
        <Button variant="contained">Create Task</Button>
        <Button variant="contained">Update Task</Button>
        <Button variant="contained">Delete Task</Button>
      </Box>
      <Box
        sx={{
          marginY: "5vh",
          marginX: "2.5vw",
        }}
      >
        <MyTable />
      </Box>
    </Sidebar>
  );
}
