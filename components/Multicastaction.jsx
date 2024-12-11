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
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { getAllLineUsers } from "@/actions";
import axios from "axios";
import Notification from "./์Notification";

const apis = ["API 1", "API 2", "API 3"]; // Example options for API selection

export default function MulticastMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [messages, setMessages] = useState("");
  const [selectLineUser, setSelectLineUser] = useState(null);

  const [lineUsers, setLineUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  console.log(selectedUsers);
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "Multicast";
  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  const handleGetAllLineUsers = async () => {
    const line_users = await getAllLineUsers(channelObjectId);

    console.log(line_users);
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
      user_id: selectedUsers.map((user) => user.line_user_id),
      // message: messages
      //   .filter((msg) => msg !== undefined && msg.trim() !== "")
      //   .map((msg) => ({ type: "text", text: msg })),
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

  useEffect(() => {
    handleGetAllLineUsers();
    console.log("HI");
  }, []);

  return (
    <Box p={4} width="100%">
      {/* Title and Description */}
      <Typography variant="h5" gutterBottom>
        Multicast Message
      </Typography>

      {/* Thin Black Line */}
      <Box borderBottom={1} borderColor="black" mb={3} width="100%" />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน : สามารถ Multicast messages ไปหา user
        ได้ทั้งหมดในทีเดียวโดยไม่จำเป็นต้องทำหลาย ๆ ครั้ง
      </Typography>

      {/* Text Message and User Areas */}
      <Box mt={3} width="100%">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
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
              rows={6}
              placeholder="Enter your message here"
              variant="outlined"
              value={messages}
              onChange={(e) => handleMessageChange(e.target.value)}
            />
          </Grid>

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
              // onSelect={handleSelectLineUser}
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
              <div>
                {selectedUsers.map((user) => (
                  <Chip
                    key={user.line_user_id}
                    label={user.display_name}
                    color="primary"
                    onDelete={() => {
                      // Remove user from selected list
                      setSelectedUsers((prev) =>
                        prev.filter((u) => u.line_user_id !== user.line_user_id)
                      );
                      // Add back to line users list
                      setLineUsers((prev) => [...prev, user]);
                    }}
                    sx={{ marginRight: 1 }}
                  />
                ))}
              </div>
            </Box>
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
