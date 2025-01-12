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
import SwitchInputComponent from "./SwitchInputComponent";

export default function PushMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [messageCount, setMessageCount] = useState(1); // Track number of message boxes
  const maximumMessage = 5;
  const [messages, setMessages] = useState(
    Array(messageCount).fill({ type: "text", text: "" })
  );

  const [selectLineUser, setSelectLineUser] = useState(null);
  const [lineUsers, setLineUsers] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    statusMessage: "",
  });

  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "Push";
  const [apis, setApis] = useState([]);
  const [dateTime, setDateTime] = useState(null);
  console.log("date", dateTime);

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
      setMessages((prev) => [...prev, { text: "", type: "text" }]);
    }
  };

  const removeMessageBox = () => {
    if (messageCount > 1) {
      setMessageCount(messageCount - 1);
      setMessages(messages.slice(0, messageCount - 1));
    }
  };

  const handleGetAllLineUsers = async () => {
    const line_users = await getAllLineUsers(channelObjectId);
    setLineUsers(JSON.parse(line_users));
  };

  const handleMessageChange = (index, value, key) => {
    const updatedMessages = [...messages];

    if (key === "type") {
      updatedMessages[index] = { type: value };
    } else {
      updatedMessages[index][key] = value;
    }

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
        message: messages,
      },
    };
    console.log("bodyu", body);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/direct_message`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        setNotification({
          open: true,
          message: "Successfully sent message",
          statusMessage: "success",
        });
      } else {
        setNotification({
          open: true,
          message: "Can't sent message",
          statusMessage: "error",
        });
      }
    } catch (error) {
      console.error(
        "Error sending request to webhook:",
        error.response?.data || error.message
      );
      setNotification({
        open: true,
        message: "Can't sent message",
        statusMessage: "error",
      });
    }
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

  const renderButtons = (contents, messageIndex, field) => {
    return contents.map((keyword, index) => {
      if (Array.isArray(keyword)) {
        return renderButtons(keyword, messageIndex, field);
      }

      return (
        <Button
          key={index}
          variant="outlined"
          color="primary"
          style={{ margin: "5px" }}
          onClick={() => {
            let updatedMessages = [...messages];
            if (!updatedMessages[messageIndex][field]) {
              updatedMessages[messageIndex][field] = "";
            }
            updatedMessages[messageIndex][field] += `$(${keyword})`;
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

            {/* Dynamically Created Message Fields */}
            {[...Array(messageCount)].map((_, index) => (
              <Box key={index} mt={2}>
                {/* Message Type Dropdown */}
                <FormControl fullWidth variant="outlined" style={{}}>
                  <InputLabel>Message Type</InputLabel>
                  <Select
                    value={messages[index].type}
                    onChange={(e) =>
                      handleMessageChange(index, e.target.value, "type")
                    }
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
                <SwitchInputComponent
                  index={index}
                  messages={messages}
                  maximumMessage={maximumMessage}
                  handleMessageChange={handleMessageChange}
                  dynamicContents={dynamicContents}
                  renderButtons={renderButtons}
                />
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
        openNotification={notification.open}
        setOpenNotification={setNotification}
        message={notification.message}
        statusMessage={notification.statusMessage}
      />
    </Box>
  );
}
