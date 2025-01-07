import React from "react";
import { Container, Grid, Typography, Card, CardContent, List, ListItem, ListItemText } from "@mui/material";

const features = [
  {
    title: "Basic Line Messaging",
    description:
      "Enhance your chatbot with powerful messaging features, including rich menus, flex messages, and automated replies.",
    details: [
      "Rich Menu: Create interactive menus for easy navigation.",
      "Flex Messages: Design custom messages with flexible layouts.",
      "Reply Messages: Set up automated responses triggered by keywords or events.",
      "Message Sending Options: Direct Messages, Broadcast Messages, and Narrowcast Messages for personalized or targeted communication.",
    ],
  },
  {
    title: "Audience Management",
    description:
      "Effectively manage your audience for targeted and personalized messaging.",
    details: [
      "Define and manage user groups for specific messaging needs.",
      "Segment users based on interaction history or predefined criteria.",
      "Customize content delivery for specific audience needs.",
    ],
  },
  {
    title: "Log History",
    description:
      "Keep track of all chatbot-user interactions with robust logging tools.",
    details: [
      "Conversation Logging: Track all interactions for analysis.",
      "Log Viewing: Access detailed conversation logs in the dashboard.",
      "Export Logs: Download logs in CSV format for external reporting.",
    ],
  },
  {
    title: "Third-Party API Integration",
    description:
      "Expand your chatbot's capabilities with seamless integration of external APIs.",
    details: [
      "Configure API connections to integrate external services.",
      "Validate API credentials and endpoints.",
      "Enable advanced chatbot actions powered by external APIs, such as fetching live data or automating workflows.",
    ],
  },
];

const FeatureCard = ({ title, description, details }) => (
  <Card variant="outlined" sx={{ height: "100%" }}>
    <CardContent>
      <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      <List dense>
        {details.map((detail, index) => (
          <ListItem key={index} disablePadding>
            <ListItemText primary={detail} />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);

const FeaturesPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: "bold", my: 3 }}>
        Middleware Features
      </Typography>
      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <FeatureCard {...feature} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FeaturesPage;
