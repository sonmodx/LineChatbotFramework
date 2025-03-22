"use client";
import Image from 'next/image';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Container,
  Box,
  TextField,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";

// Custom gradient styles
const GradientBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(to right, #3758f9, #3031b4, #1B1C96)",
  color: "white",
  borderTopRightRadius: theme.breakpoints.up("md") ? ".3rem" : "0",
  borderBottomRightRadius: theme.breakpoints.up("md") ? ".3rem" : "0",
  padding: theme.spacing(4),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}));

// Full-height container with flexbox centering
const FullHeightContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh", // Ensure the container fills the viewport height
  display: "flex",
  alignItems: "center", // Center vertically
  justifyContent: "center", // Center horizontally
  padding: theme.spacing(5), // Optional padding to control spacing
}));

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#F8F8F8", // Background color for the box
  borderRadius: "0.5rem", // Optional border radius
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Optional shadow for depth
  padding: theme.spacing(4), // Adjust padding as needed
}));

// Email validation function
const isValidEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic regex for email validation
  return emailPattern.test(email);
};

const isValidPassword = (password) => {
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // At least 6 characters, one letter, one number
  return passwordPattern.test(password);
};

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirmed password
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // Reset error message before submitting

    // Validate form fields
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    // Validate email format
    if (!isValidEmail(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!isValidPassword(password)) {
      setError("Password must be at least 6 characters long and include at least one letter and one number.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Check if the user already exists
      const resUserExists = await fetch("/api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      // Check if the user already exists
      const userExistsData = await resUserExists.json();

      if (userExistsData.user) {
        setError("User already exists.");
        return;
      }

      // Register the new user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      // Handle registration response
      if (res.ok) {
        // Registration successful
        router.push("/login"); // Navigate to the login page
      } else {
        // Parse error response from the server
        const errorData = await res.json();
        setError(errorData.message || "User registration failed.");
      }
    } catch (error) {
      setError("Error during registration.");
      console.error("Error during registration: ", error);
    }
  };

  return (
    <FullHeightContainer maxWidth="lg">
      <Grid container>
        <Grid item xs={12} md={6}>
          <ContentBox>
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <div style={{ display: "inline-block" }}>
              <Image src="/logo.png" alt="logo" width={185} height={185} />
              </div>
              <Typography variant="h4" sx={{ mt: 1, mb: 5, pb: 1 }}>
                Join FRONTEND FRAMEWORK
              </Typography>
            </Box>
            <Typography>Register for a new account</Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 4 }} // Adding margin for spacing
            />
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{
                mb: 4,
                background: "linear-gradient(to right, #3758f9, #3031b4, #1B1C96)",
                color: "white",
              }}
            >
              Register
            </Button>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography>Already have an account?</Typography>
              <Link href="/login" passHref>
                <Button variant="outlined" color="blue">
                  Login
                </Button>
              </Link>
            </Box>
          </ContentBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <GradientBox>
            <Box>
              <Typography variant="h4" sx={{ mb: 4 }}>
                Welcome to our community!
              </Typography>
              <Typography variant="body2">
              We specialize in Line middleware solutions, enabling seamless integration and communication. Join us in delivering innovative and efficient services tailored to your needs.
              </Typography>
            </Box>
          </GradientBox>
        </Grid>
      </Grid>
    </FullHeightContainer>
  );
}
