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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import Notification from "./Notification";
import axios from "axios";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { getAllApis } from "@/actions";
import { getCurrentTime, parseDateTime } from "@/lib/utils";
import SwitchInputComponent from "./SwitchInputComponent";

export default function BroadcastMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    statusMessage: "",
  });
  const [messageCount, setMessageCount] = useState(1); // Track number o
  const [messages, setMessages] = useState(
    Array(messageCount).fill({ type: "text", text: "" })
  );
  console.log("my curr messages", messages);
  const [messageType, setMessageType] = useState("text"); // State for message type
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "Broadcast";
  console.log("Msg", messages);
  const [apis, setApis] = useState([]);
  const [dynamicContents, setDynamicContents] = useState([]);
  const [dateTime, setDateTime] = useState(null);
  const maximumMessage = 5;

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
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

  const handleSendMessage = async () => {
    const newMessages = messages.map((msg) => {
      if (msg.type === "template") {
        return JSON.parse(msg.template);
      }
      if (msg.type === "imagemap") {
        return JSON.parse(msg.imagemap);
      }
      if (msg.type === "flex") {
        return JSON.parse(msg.flex);
      }

      return msg;
    });
    // console.log("new message", newMessages);
    // return;
    const body = {
      type: typeMessage,
      destination: channelId,
      direct_config: {
        message: newMessages,
        ...parseDateTime(dateTime),
      },
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

    console.log(_apis);
    setApis(JSON.parse(_apis));
  };

  useEffect(() => {
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
    const keywordsObject = JSON.parse(selectedApi?.response);
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

    console.log("MY KEY", keywordsObject);
    console.log("MY result", result);
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
      <TextField
        id="datetime-local"
        label="Schedule"
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        sx={{ mt: 2 }}
      />

      {/* API Section */}
      <Box mt={4} width="100%">
        <Grid container alignItems="center">
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
                renderOption={({ key, ...props }, option) => (
                  <li key={key} {...props}>
                    <Typography variant="body1">{option.name}</Typography>{" "}
                    <Chip
                      sx={{ ml: "auto" }}
                      label={option.owner}
                      color={option.owner === "user" ? "primary" : "default"}
                    />
                  </li>
                )}
              />
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Type Selection Section */}

      {/* Text Message and Result Areas */}
      <Box mt={4} width="100%">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
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
                    <MenuItem value="flex">Flex</MenuItem>
                    <MenuItem value="template">Template</MenuItem>
                    <MenuItem value="imagemap">Imagemap</MenuItem>
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
        </Grid>
      </Box>

      {/* Note */}
      <Box mt={2} width="100%">
        <Typography variant="caption">*หมายเหตุ</Typography>
      </Box>

      {/* Send Button */}
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
