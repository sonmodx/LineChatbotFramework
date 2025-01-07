"use client";

import { Box, Typography, Container, List, ListItem, ListItemText, Divider, Paper } from "@mui/material";

const Manual = () => {
  const sections = [
    {
      title: "Overview",
      content:
        "This user manual provides step-by-step instructions for configuring and managing a chatbot on the Line platform using middleware. It covers functionalities available to both Admin and Customers and explains how to set up various chatbot types and message configurations.",
    },
    {
      title: "Login",
      steps: [
        "Open the login page.",
        "Enter your credentials (email and password).",
        "Click Login.",
        "If the credentials are valid, you will be redirected to the dashboard.",
        "If invalid, the system will display an error message. Re-enter your credentials and try again.",
      ],
      tips: [
        "Ensure your email and password are correct.",
        'Use the "Forgot Password" option if you can\'t log in.',
      ],
    },
    {
      title: "Register",
      steps: [
        "Open the registration page.",
        "Fill in the required details: Full Name, Email, Password, Organization (optional).",
        "Click Register.",
        "If successful, the system will confirm registration and redirect you to the login page.",
      ],
      tips: [
        "Use a strong password for better security.",
        "Verify your email if required.",
      ],
    },
    {
      title: "Creating a Channel Chatbot",
      steps: [
        "Navigate to the Chatbot Management section.",
        "Click Create Chatbot.",
        "Enter the channel details: Channel Name, Channel Secret, Channel Access Token.",
        "Click Create.",
      ],
      tips: [
        "Double-check your access token and secret before saving.",
        "Use a descriptive channel name for easy identification.",
      ],
    },
    {
      title: "Configuring Chatbot",
      steps: [
        "Select the chatbot you want to configure.",
        "Set the chatbot type: Text Chatbot, Action Chatbot, API Chatbot.",
        "Define the bot’s behavior: Response logic, Message templates.",
        "Click Save.",
      ],
      tips: [
        "Test the configuration with sample messages before deploying.",
      ],
    },
    {
      title: "Setting up Rich Menu",
      steps: [
        "Go to the Rich Menu tab under the selected chatbot.",
        "Upload a menu image (recommended size: 1200x810 px).",
        "Define menu actions (e.g., URL links, postbacks).",
        "Click Save Menu.",
      ],
      tips: [
        "Ensure menu items are clearly labeled for users.",
        "Use interactive buttons for better engagement.",
      ],
    },
    {
      title: "Sending Messages",
      steps: [
        "Send a Direct Message to Line:",
        "Navigate to the Messaging section.",
        "Select Send Message.",
        "Choose the recipient and type the message.",
        "Click Send.",
      ],
    },
    {
      title: "Broadcast a Message",
      steps: [
        "Go to the Broadcast tab.",
        "Compose your message.",
        "Click Send Broadcast.",
      ],
    },
    {
      title: "Narrowcast a Message",
      steps: [
        "Select Narrowcast from the menu.",
        "Define the target audience (e.g., age, gender, location).",
        "Compose and send your message.",
      ],
    },
    {
      title: "Using Flex Messages",
      steps: [
        "Go to the Flex Message Builder.",
        "Use the drag-and-drop editor to design your message.",
        "Preview the message and save it.",
      ],
      tips: [
        "Use the official Flex Message Simulator for advanced designs.",
      ],
    },
    {
      title: "Reply Messages",
      steps: [
        "Define reply messages in the Response Settings.",
        "Add conditions for triggering the replies (e.g., keywords).",
        "Save the settings.",
      ],
    },
    {
      title: "Logging Conversations",
      steps: [
        "Enable logging in the Settings tab.",
        "View logs in the Conversation Logs section.",
        "Export logs as CSV for analysis.",
      ],
    },
    {
      title: "Testing the Chatbot",
      steps: [
        "Use the Test Mode in the dashboard to simulate user interactions.",
        "Check responses for various scenarios.",
      ],
    },
    {
      title: "Troubleshooting",
      steps: [
        "Common Issues: Login Issues: Reset your password if unable to log in.",
        "Message Errors: Ensure configurations are correctly saved.",
        "API Errors: Verify API tokens and endpoints.",
      ],
    },
    {
      title: "FAQ",
      steps: [
        "Q1: How do I configure my chatbot settings?",
        "A1: Click the edit pen in the table.",
        "Q2: Can I create multiple chatbots?",
        "A2: Yes, you can manage multiple chatbots under your account.",
        "Q3: How do I delete a chatbot?",
        "A3: Go to Chatbot Settings and click Delete.",
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", my: 3, textAlign: "center" }}>
        User Manual for Line Chatbot Middleware
      </Typography>
      {sections.map((section, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Paper sx={{ p: 3, boxShadow: "none" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
              {section.title}
            </Typography>
            {section.content && (
              <Typography variant="body1" sx={{ mb: 2 }}>
                {section.content}
              </Typography>
            )}
            {section.steps && (
              <>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Steps:
                </Typography>
                <List>
                  {section.steps.map((step, idx) => (
                    <ListItem key={idx} sx={{ pl: 0 }}>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            {section.tips && (
              <>
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  Tips:
                </Typography>
                <List>
                  {section.tips.map((tip, idx) => (
                    <ListItem key={idx} sx={{ pl: 0 }}>
                      <ListItemText primary={`• ${tip}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
            {index < sections.length - 1 && <Divider sx={{ mt: 3 }} />}
          </Paper>
        </Box>
      ))}
    </Container>
  );
};

export default Manual;
