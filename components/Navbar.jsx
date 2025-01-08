"use client";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import Image from "next/image";
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

  // Handle Manual button click
  const handleManualClick = () => {
    router.push("/manual"); // Redirect to the manual page
  };

  const handlefeaturesClick = () => {
    router.push("/features"); // Redirect 
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: "white", 
        color: "darkblue", 
        width: "100%",  // Make the AppBar full-width
        boxShadow: "none", // Remove shadow if needed
      }}
    >
      <Toolbar 
        sx={{ 
          maxWidth: "1200px", 
          margin: "0 auto", 
          width: "100%", 
          alignItems: "center", // Ensure all elements are vertically centered
        }}
      > 
        <IconButton
          edge="start"
          color="inherit"
          aria-label="logo"
          sx={{ mr: 2, padding: 0 }} // Remove excess padding
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
        <Button
          variant="text"
          color="inherit"
          onClick={handlefeaturesClick}
          sx={{
            fontWeight: "bold",
            textTransform: "none", // Ensure button text is not all caps
            color: "darkblue",
            mx: 2, // Add spacing between buttons
            "&:hover": {
              backgroundColor: "lightblue", // Light blue background on hover
            },
          }}
        >
          Features
        </Button>
        <Button
          variant="text"
          color="inherit"
          onClick={handleManualClick}
          sx={{
            fontWeight: "bold",
            textTransform: "none", // Ensure button text is not all caps
            color: "darkblue",
            mx: 2, // Add spacing between buttons
            "&:hover": {
              backgroundColor: "lightblue", // Light blue background on hover
            },
          }}
        >
          Manual
        </Button>
        <>
          {session?.user?.name && (
            <Typography variant="body1" sx={{ mx: 2, fontWeight: "bold" }}>
              Name: {session.user.name}
            </Typography>
          )}
          {/* Only render the Logout button if the user is logged in */}
          {session && (
            <Button
              variant="outlined" // Add outline to the button
              color="inherit"
              onClick={handleLogout}
              sx={{
                fontWeight: "bold", // Bold font
                borderColor: "darkblue", // Set custom border color for the outline
                "&:hover": {
                  backgroundColor: "darkblue", // Dark blue background on hover
                  color: "white", // Change text color to white on hover
                  borderColor: "darkblue", // Keep border color on hover
                },
              }}
            >
              Logout
            </Button>
          )}
        </>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
