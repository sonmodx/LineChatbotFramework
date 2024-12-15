"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Checkbox,
  Typography,
  Autocomplete,
  Grid,
  Button,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import Notification from "./Notification";
import axios from "axios";

const apis = ["API 1", "API 2", "API 3"]; // Example options for API selection

export default function BroadcastMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [openNotification, setOpenNotification] = useState(false);
  const [messages, setMessages] = useState("");
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "Broadcast";

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  const handleMessageChange = (value) => {
    setMessages(value);
  };

  const handleSendMessage = async () => {
    if (messages.trim() === "" || messages === undefined) {
      return;
    }
    const body = {
      type: typeMessage,
      destination: channelId,
      message: [{ type: "text", text: messages }],
    };
    console.log("body", body);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/direct_message`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (res.status === 200) {
        setOpenNotification(true);
      }

      console.log("Response from webhook:", res.data);
    } catch (error) {
      console.error(
        "Error sending request to webhook:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Box p={4} width="100%">
      {/* Title and Description */}
      <Typography variant="h5" gutterBottom>
        Broadcast Message
      </Typography>

      {/* Thin Black Line */}
      <Box
        borderBottom={1}
        borderColor="black"
        mb={3} // Add space below the line
        width="100%"
      />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน : สามารถ broadcast messages ไปหา user
        ได้ทั้งหมดในทีเดียวโดยไม่จำเป็นต้องทำหลาย ๆ ครั้ง
      </Typography>

      {/* Text Message and Result Areas */}
      <Box mt={3} width="100%">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              backgroundColor="primary.main"
              style={{ color: "#fff", padding: "10px" }}
            >
              Text Message
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              placeholder="Enter your message here"
              variant="outlined"
              value={messages}
              onChange={(e) => handleMessageChange(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      {/* API Section */}
      <Box mt={4} width="100%">
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} sm={3}>
            <Checkbox checked={useApi} onChange={handleCheckboxChange} />
            <Typography variant="body1" display="inline">
              Use API
            </Typography>
          </Grid>

          <Grid item xs={12} sm={9}>
            {useApi && (
              <Autocomplete
                options={apis}
                value={selectedApi}
                onChange={handleApiChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select API"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Send Button */}
      <Box mt={4} textAlign="right" width="100%">
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
      <Notification
        openNotification={openNotification}
        setOpenNotification={setOpenNotification}
        message="Successful sent message"
      />
    </Box>
  );
}
