import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FolderIcon from '@mui/icons-material/Folder';
import MapIcon from "@mui/icons-material/Map";
import { Link } from "react-router";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAtomValue, useSetAtom } from "jotai";
import { logoutAction, userAtom } from "~/atoms";

export default function CustomSidebar({ children }: { children: React.ReactNode }) {
  const user = useAtomValue(userAtom);
  const logout = useSetAtom(logoutAction);
  const drawerWidth = 240;

  const onLogout = async () => {
    if (!user) {
      console.log("cannot find user");
      return;
    }
    await logout(user);
  }

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
        <Toolbar>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Todos Map</Typography>
        </Toolbar>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px)',
          overflow: "auto",
        }}>
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
          <Box sx={{ flexGrow: 1 }} />
          <Divider />
          <List>
            <ListItem
              secondaryAction={
                <IconButton edge="end" aria-label="logout" color="error" onClick={onLogout}>
                  <LogoutIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src="/user-avatar.jpg" />
              </ListItemAvatar>
              <ListItemText
                primary={user?.username}
                primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
              />
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}
