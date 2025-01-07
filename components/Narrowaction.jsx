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
  IconButton,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Notification from "./Notification";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const apis = ["API 1", "API 2", "API 3"]; // Example options for API selection
const narrowFilterList = [{ type: "audience", audienceGroupId: 9820799089250 }];

export default function NarrowMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [selectedGroups, setSelectedGroups] = useState(null); // State for selected group
  const [messageCount, setMessageCount] = useState(1); // Track number of message boxes
  const maximumMessage = 5;
  const [messages, setMessages] = useState(Array(messageCount).fill(""));
  const [selectAudience, setSelectAudience] = useState(null);
  const [openNotification, setOpenNotification] = useState(false);
  console.log("msg", messages);
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "Narrowcast";

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  const handleGroupChange = (event, newValue) => {
    setSelectedGroups(newValue);
  };

  const addMessageBox = () => {
    if (messageCount < 5) {
      setMessageCount(messageCount + 1);
    }
  };

  const removeMessageBox = () => {
    if (messageCount > 1) {
      setMessageCount(messageCount - 1);
      setMessages(messages.slice(0, messageCount - 1));
    }
  };

  const handleMessageChange = (index, value) => {
    const updatedMessages = [...messages];
    updatedMessages[index] = value;
    setMessages(updatedMessages);
  };

  const handleSendMessage = async () => {
    const body = {
      type: typeMessage,
      destination: channelId,
      narrow_filter: selectAudience,
      message: messages
        .filter((msg) => msg !== undefined && msg.trim() !== "")
        .map((msg) => ({ type: "text", text: msg })),
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
        Narrowcast Message
      </Typography>

      {/* Thin Black Line */}
      <Box borderBottom={1} borderColor="black" mb={3} width="100%" />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน : สามารถส่ง messages ไปหา user ทีละกลุ่มโดยระบุ audience
      </Typography>

      {/* Text Message and User Areas */}
      <Box mt={3} width="100%">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              backgroundColor="primary.main"
              style={{
                color: "#fff",
                padding: "10px",
              }}
            >
              Text Message
            </Typography>

            {/* Dynamically Created Message Fields */}
            {[...Array(messageCount)].map((_, index) => (
              <Box key={index} mt={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder={`Enter your message (${
                    index + 1
                  }/${maximumMessage})`}
                  variant="outlined"
                  value={messages[index]}
                  onChange={(e) => handleMessageChange(index, e.target.value)}
                />
              </Box>
            ))}

            {/* ADD and REMOVE Buttons */}
            <Box mt={2}>
              {messageCount < 5 && (
                <IconButton onClick={addMessageBox}>
                  <AddCircleOutlineIcon />
                </IconButton>
              )}
              {messageCount > 1 && (
                <IconButton onClick={removeMessageBox}>
                  <RemoveCircleOutlineIcon />
                </IconButton>
              )}
              <Typography variant="caption">ADD / REMOVE</Typography>
            </Box>
          </Grid>

          {/* User Input and API Section */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              backgroundColor="primary.main"
              style={{
                color: "#fff",
                padding: "10px",
              }}
            >
              Filter by
            </Typography>

            {/* Group Selection */}
            <Autocomplete
              options={narrowFilterList}
              getOptionLabel={(option) => option.type || ""}
              value={selectAudience}
              onChange={(event, newValue) => setSelectAudience(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Group"
                  variant="outlined"
                  fullWidth
                />
              )}
            />

            {/* API Section */}
            <Box display="flex" alignItems="center" mt={2}>
              <Checkbox checked={useApi} onChange={handleCheckboxChange} />
              <Typography variant="body1" display="inline">
                Use API
              </Typography>
            </Box>

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
