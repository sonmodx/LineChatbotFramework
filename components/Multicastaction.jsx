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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { getAllApis, getAllLineUsers } from "@/actions";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import Notification from "./Notification";
import { getCurrentTime, parseDateTime } from "@/lib/utils";
import SwitchInputComponent from "./SwitchInputComponent";

export default function MulticastMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [selectLineUser, setSelectLineUser] = useState(null);
  const [messageCount, setMessageCount] = useState(1); // Track number of message boxes
  const [messages, setMessages] = useState(
    Array(messageCount).fill({ type: "text", text: "" })
  );
  const [messageType, setMessageType] = useState("text"); // Default to "text"
  const [lineUsers, setLineUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    statusMessage: "",
  });
  const maximumMessage = 5;
  // console.log(selectedUsers);
  console.log("msg", messages);
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "Multicast";
  const [apis, setApis] = useState([]);
  const [dynamicContents, setDynamicContents] = useState([]);
  const [dateTime, setDateTime] = useState(null);
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
    // if (messages.trim() === "" || messages === undefined) {
    //   return;
    // }
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
    const body = {
      type: typeMessage,
      destination: channelId,
      direct_config: {
        api_id: selectedApi?._id || null,
        user_id: selectedUsers.map((user) => user.line_user_id),
        ...parseDateTime(dateTime),
        // message: messages
        //   .filter((msg) => msg !== undefined && msg.trim() !== "")
        //   .map((msg) => ({ type: "text", text: msg })),
        message: newMessages,
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
    handleGetAllLineUsers();
    handleGetAllApis();
    setDateTime(getCurrentTime());
    console.log("HI");
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
        Multicast Message
      </Typography>

      {/* Thin Black Line */}
      <Box borderBottom={1} borderColor="black" mb={3} width="100%" />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน : สามารถ Multicast messages ไปหา user
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

      {/* Text Message and User Areas */}
      <Box mt={4} width="100%">
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
