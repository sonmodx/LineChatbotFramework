"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
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
  background: "linear-gradient(to right, #3758f9, #3031b4, #1B1C96)", // Added # before the color code
  color: "white",
  borderTopRightRadius: theme.breakpoints.up('md') ? ".3rem" : "0",
  borderBottomRightRadius: theme.breakpoints.up('md') ? ".3rem" : "0",
  padding: theme.spacing(4),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
}));

// Full-height container with flexbox for centering
const FullHeightContainer = styled(Container)(({ theme }) => ({
  minHeight: "100vh", // Ensure the container fills the viewport height
  display: "flex",
  alignItems: "center", // Center vertically
  justifyContent: "center", // Center horizontally
  padding: theme.spacing(5), // Optional padding to control spacing
}));

const ContentBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  borderRadius: "0.5rem", // Optional border radius
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Optional shadow for depth
  padding: theme.spacing(4), // Adjust padding as needed
}));

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For managing error messages
  const [alertVisible, setAlertVisible] = useState(false); // For controlling alert visibility

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message before submitting
    setAlertVisible(false); // Hide alert before submitting

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        setAlertVisible(true); // Show alert on error
        return;
      }

      router.replace("dashboard");
    } catch (error) {
      console.log(error);
      setError("An unexpected error occurred");
      setAlertVisible(true); // Show alert on unexpected error
    }
  };

  return (
    <FullHeightContainer maxWidth="lg">
      <Grid container>
        <Grid item xs={12} md={6}>
          <ContentBox>
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <img
                src="https://cdn.discordapp.com/attachments/1268217881657737236/1272507012432920598/copy.png?ex=66e4c141&is=66e36fc1&hm=e9f52b52addefbd74e97b4817bf8eb51df6423e903434c61f059077c507600d7&"
                alt="logo"
                style={{ width: "185px" }}
              />
              <Typography variant="h4" sx={{ mt: 1, mb: 5, pb: 1 }}>
                FRONTEND FRAMEWORK
              </Typography>
            </Box>
            <Typography>Please login to your account</Typography>
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
              sx={{ mb: 4 }}
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
              Sign in
            </Button>
            {alertVisible && error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2 }}
            >
              <Typography>Don't have an account?</Typography>
              <Link href="/register" passHref>
                <Button variant="outlined" color="blue">
                  Register
                </Button>
              </Link>
            </Box>
          </ContentBox>
        </Grid>
        <Grid item xs={12} md={6}>
          <GradientBox>
            <Box>
              <Typography variant="h4" sx={{ mb: 4 }}>
                We are more than just a frontend.
              </Typography>
              <Typography variant="body2">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </Typography>
            </Box>
          </GradientBox>
        </Grid>
      </Grid>
    </FullHeightContainer>
  );
}