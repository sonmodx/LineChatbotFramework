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
import { getCurrentTime, parseDateTime } from "@/lib/utils";

export default function MulticastMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [messages, setMessages] = useState("");
  const [selectLineUser, setSelectLineUser] = useState(null);
  const [messageType, setMessageType] = useState("text"); // Default to "text"
  const [lineUsers, setLineUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openNotification, setOpenNotification] = useState(false);
  console.log(selectedUsers);
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

  const handleMessageTypeChange = (type) => {
    setMessageType(type);
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
      direct_config: {
        api_id: selectedApi?._id || null,
        user_id: selectedUsers.map((user) => user.line_user_id),
        ...parseDateTime(dateTime),
        // message: messages
        //   .filter((msg) => msg !== undefined && msg.trim() !== "")
        //   .map((msg) => ({ type: "text", text: msg })),
        message: [{ type: "text", text: messages }],
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

  const getMessagePlaceholders = () => {
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

      {/* Message Type Selection Bar */}
      <Box mt={4} width="100%">
        <Typography variant="h6" gutterBottom>
          Message Type
        </Typography>
        <ButtonGroup variant="outlined" color="primary">
          {["text", "image", "sticker", "video", "audio", "location", "flex", "template"].map((type) => (
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
              {messageType.charAt(0).toUpperCase() + messageType.slice(1)}{" "}
              Message
            </Typography>
            {getMessagePlaceholders().map((placeholder, index) => {
          let rows = 4;
          if (messageType === "location" || messageType === "image" || messageType === "sticker" || messageType === "video" || messageType === "audio") {
            rows = 1;
          } else if (messageType === "flex" || messageType === "template") {
            rows = 7;
          }

          return (
            <TextField
             key={index}
              fullWidth
              multiline
              rows={rows}
              placeholder={placeholder}
              variant="outlined"
              value={messages[index] || ""}
              onChange={(e) => {
                const updatedMessages = [...messages];
                updatedMessages[index] = e.target.value;
                setMessages(updatedMessages);
              }}
              style={{ marginBottom: "16px" }}
            />
          );
        })}
            {dynamicContents.length > 0 && renderButtons(dynamicContents)}
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
        openNotification={openNotification}
        setOpenNotification={setOpenNotification}
        message="Successful sent message"
      />
    </Box>
  );
}
