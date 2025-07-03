"use client";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography
} from "@mui/material";
import Link from "next/link";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import BarChartIcon from "@mui/icons-material/BarChart";
import DescriptionIcon from "@mui/icons-material/Description";
import { useRouter } from "next/router";
import { ReactNode } from "react";

const drawerWidth = 240;

const navItems = [
  { href: "/dashboard", icon: <DashboardIcon />, text: "My Project" },
  { href: "/data", icon: <FolderIcon />, text: "My Data" },
  { href: "/results/report", icon: <BarChartIcon />, text: "Reports" },
  {
    href: "/results/protein",
    icon: <DescriptionIcon />,
    text: "Protein Structure"
  }
];

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Bindflow Portal
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
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
          <List>
            {navItems.map(({ href, icon, text }) => (
              <Link href={href} key={href} passHref legacyBehavior>
                <ListItem
                  component="a"
                  selected={router.pathname === href}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
            ))}
          </List>
          {/* <WorkflowLauncher /> */}
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
