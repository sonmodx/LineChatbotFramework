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
import Image from 'next/image';
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Import useRouter

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter(); // Initialize useRouter

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login"); // Redirect to the login page after logout
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

  // Handle Home icon click
  const handleHomeClick = () => {
    if (session) {
      router.push("/channels"); // Redirect to channels if logged in
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "white", color: "darkblue" }}>
      <Container>
        <Toolbar>
        <IconButton
  edge="start"
  color="inherit"
  aria-label="logo"
  sx={{ mr: 2 }}
  onClick={handleHomeClick} // Add click handler
  disabled={!session} // Disable button if not logged in
>
  <Image 
    src="/logo.png" // Replace with the path to your logo
    alt="Logo"
    width={50} // Adjust width as needed
    height={50} // Adjust height as needed
  />
</IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
            FRONTEND FRAMEWORK
          </Typography>
          <>
            {session?.user?.name && (
              <Typography variant="body1" sx={{ mx: 2, fontWeight: "bold" }}>
                Name: {session.user.name}
              </Typography>
            )}
            {/* Only render the Logout button if the user is logged in */}
            {session && (
              <Button
                color="inherit"
                onClick={handleLogout}
                sx={{
                  fontWeight: "bold", // Bold font
                  "&:hover": {
                    backgroundColor: "darkblue", // Dark blue background on hover
                    color: "white", // Change text color to white on hover
                  },
                }}
              >
                Logout
              </Button>
            )}
          </>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;