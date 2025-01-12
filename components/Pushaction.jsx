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
import { getCurrentTime, parseDateTime } from "@/lib/utils";

export default function PushMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [messageCount, setMessageCount] = useState(1); // Track number of message boxes
  const maximumMessage = 5;
  const [messages, setMessages] = useState(Array(messageCount).fill("")); // Messages state
  const [messageTypes, setMessageTypes] = useState(Array(messageCount).fill("text"));
  const [selectLineUser, setSelectLineUser] = useState(null);
  const [lineUsers, setLineUsers] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);

  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "Push";
  const [apis, setApis] = useState([]);
  const [dateTime, setDateTime] = useState(null);
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

  const handleMessageChange = (index, placeholderIndex, value) => {
    const updatedMessages = [...messages];
    if (!updatedMessages[index]) updatedMessages[index] = [];
    updatedMessages[index][placeholderIndex] = value;
    setMessages(updatedMessages);
  };

  const handleSendMessage = async () => {
    const body = {
      type: typeMessage,
      destination: channelId,
      direct_config: {
        api_id: selectedApi?._id || null,
        user_id: selectLineUser?.line_user_id || null,
        ...parseDateTime(dateTime),
        message: messages
          .filter((msg) => msg !== undefined && msg.trim() !== "")
          .map((msg, index) => ({
            type: messageTypes[index],
            content: msg,
          })),
      },
    };
    console.log("bodyu", body);
  };

  const handleGetAllApis = async () => {
    const _apis = await getAllApis(channelObjectId);
    setApis(JSON.parse(_apis));
  };

  useEffect(() => {
    handleGetAllLineUsers();
    handleGetAllApis();
    setDateTime(getCurrentTime());
  }, []);

  useEffect(() => {
    if (
      selectedApi === null ||
      typeof selectedApi !== "object" ||
      Array.isArray(selectedApi)
    )
      return;
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

  const getMessagePlaceholders = (messageType) => {
    if (messageType === "location") {
      return ["Title", "Address", "Latitude", "Longitude"];
    } else if (messageType === "image" || messageType === "video") {
      return ["Original Content URL", "Preview Image URL"];
    } else if (messageType === "sticker") {
      return ["PackageId", "StickerId"];
    } else if (messageType === "audio") {
      return ["Original Content URL", "Duration"];
    } else if (messageType === "flex" || messageType === "template") {
      return ["Json"];
    }
    return ["Enter Message"];
  };

  const renderPlaceholders = (messageType, index) => {
    const placeholders = getMessagePlaceholders(messageType);
    
    // Set the rows based on message type
    let rows = 4;  // Default value
    if (["location", "image", "sticker", "video", "audio"].includes(messageType)) {
      rows = 1; // For these types, use only 1 row
    } else if (["flex", "template"].includes(messageType)) {
      rows = 7; // For these types, use 7 rows
    }
  
    return placeholders.map((placeholder, idx) => (
      <TextField
        key={idx}
        fullWidth
        variant="outlined"
        label={placeholder}
        value={messages[index]?.[idx] || ""}
        onChange={(e) => handleMessageChange(index, idx, e.target.value)}
        multiline
        rows={rows}  
        sx={{ mt: 2 }}
      />
    ));
  };

    const renderButtons = (contents) => {
      return contents.map((keyword, index) => {
        if (Array.isArray(keyword)) {
          return renderButtons(keyword);
        }
  
        return (
          <Button
            key={index}
            variant="outlined"
            color="primary"
            style={{ margin: "5px" }}
            onClick={() => {
              let updatedMessages = messages;
              updatedMessages += `$(${keyword})`;
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
      <TextField
        id="datetime-local"
        label="Schedule"
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        sx={{ mt: 2 }}
      />

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

            {[...Array(messageCount)].map((_, index) => (
              <Box key={index} mt={2}>
                <FormControl fullWidth variant="outlined" style={{ marginTop: "10px" }}>
                  <InputLabel>Message Type</InputLabel>
                  <Select
                    value={messageTypes[index]}
                    onChange={(e) => setMessageTypes((prev) => {
                      const newMessageTypes = [...prev];
                      newMessageTypes[index] = e.target.value;
                      return newMessageTypes;
                    })}
                    label="Message Type"
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="sticker">Sticker</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                    <MenuItem value="location">Location</MenuItem>
                    <MenuItem value="flex">Flex</MenuItem>
                    <MenuItem value="template">Template</MenuItem>
                  </Select>
                </FormControl>

                {/* Render individual placeholders based on the message type */}
                {renderPlaceholders(messageTypes[index], index)}

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
              onChange={(event, newValue) => setSelectLineUser(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Line User"
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
      <Notification
        openNotification={openNotification}
        setOpenNotification={setOpenNotification}
        message="Successful sent message"
      />
    </Box>
  );
}
