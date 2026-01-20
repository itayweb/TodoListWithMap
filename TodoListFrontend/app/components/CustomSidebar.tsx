import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import React from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FolderIcon from '@mui/icons-material/Folder';
import MapIcon from "@mui/icons-material/Map";
import { Link } from "react-router";

export default function CustomSidebar({ children }: { children: React.ReactNode }) {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItemButton component={Link} to="/">
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary="Todos & Tasks" />
            </ListItemButton>
            <ListItemButton component={Link} to="/map">
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary="Map" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
