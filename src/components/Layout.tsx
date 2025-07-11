"use client";
import {
  Box,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  ListItemButton,
  IconButton
} from "@mui/material";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DeviceHubOutlinedIcon from "@mui/icons-material/DeviceHubOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
import { useWorkflows } from "@/context/DBContext";
import { GridLoadIcon } from "@mui/x-data-grid";

const drawerWidth = 240;

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Get themes list from context
  const context = useWorkflows();
  const themes = context?.themes;
  const [sidebarOpen, setSidebarOpen] = useState(true); // Toggle menu bar

  if (!themes) {
    return <GridLoadIcon />;
  }

  const navItems = [
    {
      href: "/",
      text: "Home",
      icon: <HomeOutlinedIcon />,
      childs: themes
    },
    {
      href: "/preconfig",
      icon: <DeviceHubOutlinedIcon />,
      text: "Pre-config Workflow"
    },
    { href: "/jobs", icon: <WorkOutlineOutlinedIcon />, text: "Jobs" },
    { href: "/about", icon: <InfoOutlinedIcon />, text: "About" },
    {
      href: "/events",
      icon: <InsertInvitationOutlinedIcon />,
      text: "Workshops & Events"
    },
    {
      href: "/contact",
      icon: <ContactSupportOutlinedIcon />,
      text: "Support/FAQ"
    },
    {
      href: "/login",
      icon: <PersonOutlineOutlinedIcon />,
      text: "Log in"
    }
  ];

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
            <List>
              {navItems.map(({ href, icon, text, childs }) => (
                <>
                  <Link
                    href={href}
                    passHref
                    underline="none"
                    key={href}
                    component={NextLink}
                  >
                    <ListItemButton selected={router.pathname === href}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={text} />
                    </ListItemButton>
                  </Link>
                  {childs &&
                    childs.map((child: string) => {
                      return (
                        // Generate themes list under Home
                        <Link
                          component={NextLink}
                          href={child}
                          passHref
                          underline="none"
                          key={child}
                        >
                          <ListItemButton selected={router.pathname === child}>
                            <ListItemIcon></ListItemIcon>
                            <ListItemText
                              primary={child
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (char) => char.toUpperCase())}
                            />
                          </ListItemButton>
                        </Link>
                      );
                    })}
                </>
              ))}
            </List>
          </Box>
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: "100%",
          maxWidth: "1000px", // adjust as needed
          mx: "auto"
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
