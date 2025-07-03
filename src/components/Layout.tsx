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
  ListItemButton
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
import { useRouter } from "next/router";
import { ReactNode } from "react";

const drawerWidth = 240;

const navItems = [
  {
    href: "/",
    icon: <HomeOutlinedIcon />,
    text: "Home",
    children: [
      {
        href: "binderDesign/",
        icon: "",
        text: "Binder design"
      },
      {
        href: "/structurePrediction",
        icon: "",
        text: "Structure Prediction"
      },
      {
        href: "/structureSearch",
        icon: "",
        text: "Structure search"
      }
    ]
  },
  {
    href: "/preconfig",
    icon: <DeviceHubOutlinedIcon />,
    text: "Pre-config Workflow"
    // children: [
    //   {
    //     href: "/runs/bindflow",
    //     icon: "",
    //     text: "Single structure prediction"
    //   },
    //   {
    //     href: "/interactive",
    //     icon: "",
    //     text: "Interaction screening"
    //   }
    // ]
  },
  // {
  //   href: "/tools",
  //   icon: <HandymanOutlinedIcon />,
  //   text: "Tools"
  // },
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

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Dashboard
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
            {navItems.map(({ href, icon, text, children }) => (
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

                {children &&
                  children.map((child) => (
                    <Link
                      component={NextLink}
                      href={child.href}
                      passHref
                      underline="none"
                      key={child.href}
                    >
                      <ListItemButton selected={router.pathname === child.href}>
                        <ListItemIcon>{child.icon}</ListItemIcon>
                        <ListItemText primary={child.text} />
                      </ListItemButton>
                    </Link>
                  ))}
              </>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
