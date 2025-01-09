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
  IconButton,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { getAllApis, getAllLineUsers } from "@/actions";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import Notification from "./Notification";

export default function PushMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [messageCount, setMessageCount] = useState(1); // Track number of message boxes
  const maximumMessage = 5;
  const [messages, setMessages] = useState(Array(messageCount).fill(""));
  const [messageTypes, setMessageTypes] = useState(Array(messageCount).fill("text"));
  const [selectLineUser, setSelectLineUser] = useState(null);
  const [lineUsers, setLineUsers] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "Push";
  const [apis, setApis] = useState([]);

  const [dynamicContents, setDynamicContents] = useState([]);

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
    setSelectedApi(null);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  const addMessageBox = () => {
    if (messageCount < 5) {
      setMessageCount(messageCount + 1);
      setMessages((prev) => [...prev, ""]);
      setMessageTypes((prev) => [...prev, "text"]);
    }
  };

  const removeMessageBox = () => {
    if (messageCount > 1) {
      setMessageCount(messageCount - 1);
      setMessages(messages.slice(0, messageCount - 1));
      setMessageTypes(messageTypes.slice(0, messageCount - 1));
    }
  };

  const handleGetAllLineUsers = async () => {
    const line_users = await getAllLineUsers(channelObjectId);
    setLineUsers(JSON.parse(line_users));
  };

  const handleMessageChange = (index, value) => {
    const updatedMessages = [...messages];
    updatedMessages[index] = value;
    setMessages(updatedMessages);
  };

  const handleMessageTypeChange = (index, value) => {
    const updatedMessageTypes = [...messageTypes];
    updatedMessageTypes[index] = value;
    setMessageTypes(updatedMessageTypes);
  };

  const handleSendMessage = async () => {
    const body = {
      type: typeMessage,
      destination: channelId,
      direct_config: {
        api_id: selectedApi?._id || null,
        user_id: selectLineUser.line_user_id,
        message: messages
          .filter((msg) => msg !== undefined && msg.trim() !== "")
          .map((msg, index) => ({
            type: messageTypes[index],
            content: msg,
          })),
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
      console.error("Error sending request to webhook:", error.response?.data || error.message);
    }
  };

  const handleGetAllApis = async () => {
    const _apis = await getAllApis(channelObjectId);
    setApis(JSON.parse(_apis));
  };

  useEffect(() => {
    handleGetAllApis();
  }, []);

  useEffect(() => {
    if (selectedApi === null || typeof selectedApi !== "object" || Array.isArray(selectedApi)) return;
    const keywordsObject = JSON.parse(selectedApi?.keywords);
    const getAllKeyObjects = (obj, prefix = "") => {
      return Object.keys(obj).map((key) => {
        const value = obj[key];
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === "object" && !Array.isArray(value)) {
          return getAllKeyObjects(value, fullKey);
        } else {
          return fullKey;
        }
      });
    };
    const result = getAllKeyObjects(keywordsObject);
    setDynamicContents(result);
  }, [selectedApi]);

  const renderButtons = (contents, messageIndex) => {
    return contents.map((keyword, index) => {
      if (Array.isArray(keyword)) {
        return renderButtons(keyword, messageIndex);
      }

      return (
        <Button
          key={index}
          variant="outlined"
          color="primary"
          style={{ margin: "5px" }}
          onClick={() => {
            const updatedMessages = [...messages];
            updatedMessages[messageIndex] += `\${${keyword}}`;
            setMessages(updatedMessages);
          }}
        >
          {keyword}
        </Button>
      );
    });
  };

  return (
    <Box p={4} width="100%">
      <Typography variant="h5" gutterBottom>
        Push Message
      </Typography>

      <Box borderBottom={1} borderColor="black" mb={3} width="100%" />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน : สามารถส่ง messages ไปหา user ทีละคนโดยระบุ User
      </Typography>

      <Box mt={3} width="100%">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom backgroundColor="primary.main" style={{ color: "#fff", padding: "10px" }}>
              Text Message
            </Typography>

            {[...Array(messageCount)].map((_, index) => (
              <Box key={index} mt={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder={`Enter your message (${index + 1}/${maximumMessage})`}
                  variant="outlined"
                  value={messages[index]}
                  onChange={(e) => handleMessageChange(index, e.target.value)}
                />
                <FormControl fullWidth variant="outlined" style={{ marginTop: "10px" }}>
                  <InputLabel>Message Type</InputLabel>
                  <Select
                    value={messageTypes[index]}
                    onChange={(e) => handleMessageTypeChange(index, e.target.value)}
                    label="Message Type"
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="sticker">Sticker</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                    <MenuItem value="location">Location</MenuItem>
                  </Select>
                </FormControl>
                {dynamicContents.length > 0 && renderButtons(dynamicContents, index)}
              </Box>
            ))}

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

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom backgroundColor="primary.main" style={{ color: "#fff", padding: "10px" }}>
              User
            </Typography>
            <Autocomplete
              options={lineUsers}
              getOptionLabel={(option) => option.display_name || ""}
              value={selectLineUser}
              onChange={(event, newValue) => setSelectLineUser(newValue)}
              renderInput={(params) => <TextField {...params} label="Select Line User" variant="outlined" fullWidth />}
            />
            {/* API Section */}
            <Box display="flex" alignItems="center" mt={2}>
              <Checkbox checked={useApi} onChange={handleCheckboxChange} />
              <Typography variant="body1" display="inline">Use API</Typography>
            </Box>

            {useApi && (
              <Autocomplete
                options={apis}
                getOptionLabel={(option) => option.name || ""}
                value={selectedApi}
                onChange={handleApiChange}
                renderInput={(params) => <TextField {...params} label="Select API" variant="outlined" fullWidth />}
              />
            )}
          </Grid>
        </Grid>
      </Box>

            {/* Note */}
            <Box mt={2} width="100%">
              <Typography variant="caption">*หมายเหตุ</Typography>
            </Box>

      <Box mt={4} textAlign="right" width="100%">
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>
      <Notification openNotification={openNotification} setOpenNotification={setOpenNotification} message="Successful sent message" />
    </Box>
  );
}
