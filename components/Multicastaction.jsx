"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Checkbox,
  Typography,
  Autocomplete,
  Grid,
  Button,
  Chip,
  ButtonGroup,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { getAllApis, getAllLineUsers } from "@/actions";
import axios from "axios";
import Notification from "./Notification";

export default function MulticastMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [messages, setMessages] = useState([]); // Changed to an array for dynamic fields
  const [selectLineUser, setSelectLineUser] = useState(null);
  const [messageType, setMessageType] = useState("text"); // Default to "text"
  const [lineUsers, setLineUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "Multicast";
  const [apis, setApis] = useState([]);
  const [dynamicContents, setDynamicContents] = useState([]);

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  const handleMessageTypeChange = (type) => {
    setMessageType(type);
    setMessages([]); // Reset messages when the type changes
  };

  const handleGetAllLineUsers = async () => {
    const line_users = await getAllLineUsers(channelObjectId);
    setLineUsers(JSON.parse(line_users));
  };

  const handleSelectLineUser = (newValue) => {
    if (newValue) {
      setSelectLineUser(newValue);
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, newValue]);
      setLineUsers((prevLineUsers) =>
        prevLineUsers.filter(
          (user) => user.line_user_id !== newValue.line_user_id
        )
      );
    }
  };

  const handleSendMessage = async () => {
    if (messages.some((msg) => !msg.trim())) {
      return;
    }

    const body = {
      type: typeMessage,
      destination: channelId,
      direct_config: {
        api_id: selectedApi?._id || null,
        user_id: selectedUsers.map((user) => user.line_user_id),
        message: messages.map((msg) => ({ type: messageType, text: msg })),
      },
    };

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
    } catch (error) {
      console.error(
        "Error sending request to webhook:",
        error.response?.data || error.message
      );
    }
  };

  const handleGetAllApis = async () => {
    const _apis = await getAllApis(channelObjectId);
    setApis(JSON.parse(_apis));
  };

  useEffect(() => {
    handleGetAllLineUsers();
    handleGetAllApis();
  }, []);

  return (
    <Box p={4} width="100%">
      {/* Title and Description */}
      <Typography variant="h5" gutterBottom>
        Multicast Message
      </Typography>

      <Box borderBottom={1} borderColor="black" mb={3} width="100%" />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน : สามารถ Multicast messages ไปหา user
        ได้ทั้งหมดในทีเดียวโดยไม่จำเป็นต้องทำหลาย ๆ ครั้ง
      </Typography>

      {/* Message Type Selection Bar */}
      <Box mt={4} width="100%">
        <Typography variant="h6" gutterBottom>
          Message Type
        </Typography>
        <ButtonGroup variant="outlined" color="primary">
          {[
            "text",
            "image",
            "video",
            "audio",
            "sticker",
            "location",
            "flex",
            "template",
          ].map((type) => (
            <Button
              key={type}
              onClick={() => handleMessageTypeChange(type)}
              variant={messageType === type ? "contained" : "outlined"}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      {/* Dynamic Input Fields */}
      <Box mt={4} width="100%">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              backgroundColor="primary.main"
              style={{ color: "#fff", padding: "10px" }}
            >
              {messageType.charAt(0).toUpperCase() + messageType.slice(1)} Message
            </Typography>
            {Array.from({
              length:
                ["sticker", "image", "video", "audio"].includes(messageType)
                  ? 2
                  : messageType === "location"
                  ? 4
                  : 1,
            }).map((_, index) => {
              let placeholder = `Enter ${messageType} #${index + 1} here`;
              let rows = 4;

              if (messageType === "location") {
                const placeholders = [
                  "Title",
                  "Address",
                  "Latitude",
                  "Longitude",
                ];
                placeholder = placeholders[index];
                rows = 1;
              } else if (["image", "video"].includes(messageType)) {
                const placeholders = [
                  "Original Content URL",
                  "Preview Image URL",
                ];
                placeholder = placeholders[index];
                rows = 1;
              } else if (messageType === "sticker") {
                const placeholders = ["PackageId", "StickerId"];
                placeholder = placeholders[index];
                rows = 1;
              } else if (messageType === "audio") {
                const placeholders = ["Original Content URL", "Duration"];
                placeholder = placeholders[index];
                rows = 1;
              } else if (["flex", "template"].includes(messageType)) {
                placeholder = "JSON";
              }

              return (
                <TextField
                  key={index}
                  fullWidth
                  multiline={rows > 1}
                  rows={rows}
                  placeholder={placeholder}
                  variant="outlined"
                  value={messages[index] || ""}
                  onChange={(e) => {
                    const newMessages = [...messages];
                    newMessages[index] = e.target.value;
                    setMessages(newMessages);
                  }}
                  style={{ marginBottom: "10px" }}
                />
              );
            })}
          </Grid>

          {/* User Selection */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              backgroundColor="primary.main"
              style={{ color: "#fff", padding: "10px" }}
            >
              User
            </Typography>
            <Autocomplete
              options={lineUsers}
              getOptionLabel={(option) => option.display_name || ""}
              value={selectLineUser}
              onChange={(event, newValue) => handleSelectLineUser(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Line User"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Box mt={2}>
              {selectedUsers.map((user) => (
                <Chip
                  key={user.line_user_id}
                  label={user.display_name}
                  color="primary"
                  onDelete={() => {
                    setSelectedUsers((prev) =>
                      prev.filter((u) => u.line_user_id !== user.line_user_id)
                    );
                    setLineUsers((prev) => [...prev, user]);
                  }}
                  sx={{ marginRight: 1 }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* API Section */}
      <Box display="flex" alignItems="center" mt={2}>
        <Checkbox checked={useApi} onChange={handleCheckboxChange} />
        <Typography variant="body1">Use API</Typography>
      </Box>
      {useApi && (
        <Autocomplete
          options={apis}
          getOptionLabel={(option) => option.name || ""}
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
