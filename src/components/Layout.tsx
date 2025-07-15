"use client";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { ReactNode, useState } from "react";
import { useWorkflows } from "@/context/DBContext";
import { GridLoadIcon } from "@mui/x-data-grid";
import SideBarItems from "./SideBarItems";

const drawerWidth = 240;

export default function Layout({ children }: { children: ReactNode }) {
  // Get themes list from context
  const context = useWorkflows();
  const themes = context?.themes;
  const [sidebarOpen, setSidebarOpen] = useState(true); // Toggle menu bar

  if (!themes) {
    return <GridLoadIcon />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
          <IconButton
            color="inherit"
            edge="end"
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            {sidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      {sidebarOpen && (
        <Drawer
          anchor="right"
          variant="temporary"
          open={sidebarOpen}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box"
            }
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <SideBarItems />
          </Box>
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          maxWidth: "1000px",
          mx: "auto"
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
