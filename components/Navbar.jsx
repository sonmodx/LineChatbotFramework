// components/Navbar.js

"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Container,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false }); // Use redirect: false to prevent automatic redirection
      router.push("/"); // Redirect to login or any other page
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            sx={{ mr: 2 }}
          >
            <HomeIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            MyApp
          </Typography>
          <Button color="inherit" onClick={() => router.push("/channels")}>
            Home
          </Button>
          <Button color="inherit" onClick={() => router.push("/feature")}>
            Feature
          </Button>
          <Button color="inherit" onClick={() => router.push("/about")}>
            About
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
