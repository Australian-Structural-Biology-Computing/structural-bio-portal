import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import { useRouter } from "next/router";
import { useWorkflows } from "@/context/DBContext";
import { ThemesContext } from "@/models/workflow";
import { useMemo } from "react";

export default function SideBarItems() {
  const router = useRouter();
  const context = useWorkflows();

  const themes = useMemo(() => {
    return context?.themes.flatMap((theme: ThemesContext) =>
      Object.keys(theme)
    );
  }, [context?.themes]);
  const navItems = [
    {
      href: "/",
      text: "Home",
      icon: <HomeOutlinedIcon />,
      childs: themes
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
    <List>
      {navItems.map(({ href, icon, text, childs }) => (
        <>
          <ListItemButton selected={router.pathname === href}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItemButton>
          {childs &&
            childs.map((child: string) => {
              return (
                <ListItemButton
                  key={child}
                  onClick={() => {
                    router.push({
                      pathname: "/workflowThemes/workflowThemes",
                      query: { id: child }
                    });
                  }}
                >
                  <ListItemIcon></ListItemIcon>
                  <ListItemText
                    primary={child
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  />
                </ListItemButton>
              );
            })}
        </>
      ))}
    </List>
  );
}
