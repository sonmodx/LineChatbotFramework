"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
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
  backgroundColor: "#F8F8F8",
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

      router.replace("channels");
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
              <Image
                src="/logo.png"
                alt="logo"
                width={185}
                height={185}
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
              <Typography>Don&apos;t have an account?</Typography>
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
              Our expertise goes beyond traditional design; we specialize in line middleware solutions that empower seamless integration and communication. If you would like to join us, we are committed to delivering innovative services that enhance efficiency and streamline processes. Our team is dedicated to understanding your needs and providing robust solutions that drive success.
              </Typography>
            </Box>
          </GradientBox>
        </Grid>
      </Grid>
    </FullHeightContainer>
  );
}