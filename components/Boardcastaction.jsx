"use client";
import Autocomplete from "@mui/material/Autocomplete";
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Checkbox,
  Typography,
  Grid,
  Button,
  ButtonGroup,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import Notification from "./Notification";
import axios from "axios";
import { getAllApis } from "@/actions";

export default function BroadcastMessage() {
  const [useApi, setUseApi] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);
  const [openNotification, setOpenNotification] = useState(false);
  const [messages, setMessages] = useState("");
  const [messageType, setMessageType] = useState("text");
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "Broadcast";
  const [apis, setApis] = useState([]);
  const [dynamicContents, setDynamicContents] = useState([]);

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
      direct_config: {
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

  const handleMessageTypeChange = (type) => {
    setMessageType(type);
    setMessages("");
  };

  useEffect(() => {
    handleGetAllApis();
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
        mb={3}
        width="100%"
      />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน : สามารถ broadcast messages ไปหา user
        ได้ทั้งหมดในทีเดียวโดยไม่จำเป็นต้องทำหลาย ๆ ครั้ง
      </Typography>

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
              />
            )}
          </Grid>
        </Grid>
      </Box>

      {/* Name Input */}
      <Box mt={3} width="100%">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter Name"
              variant="outlined"
            />
          </Grid>

          {/* Description Input */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <TextField fullWidth placeholder="Enter Description" variant="outlined" />
          </Grid>
        </Grid>
      </Box>

      {/* Message Type Selection Bar */}
      <Box mt={4} width="100%">
        <Typography variant="h6" gutterBottom>
          Message Type
        </Typography>
        <ButtonGroup variant="outlined" color="primary">
          <Button
            onClick={() => handleMessageTypeChange("text")}
            variant={messageType === "text" ? "contained" : "outlined"}
          >
            Text
          </Button>
          <Button
            onClick={() => handleMessageTypeChange("image")}
            variant={messageType === "image" ? "contained" : "outlined"}
          >
            Image
          </Button>
          <Button
            onClick={() => handleMessageTypeChange("sticker")}
            variant={messageType === "sticker" ? "contained" : "outlined"}
          >
            Sticker
          </Button>
          <Button
            onClick={() => handleMessageTypeChange("video")}
            variant={messageType === "video" ? "contained" : "outlined"}
          >
            Video
          </Button>
          <Button
            onClick={() => handleMessageTypeChange("audio")}
            variant={messageType === "audio" ? "contained" : "outlined"}
          >
            Audio
          </Button>
          <Button
            onClick={() => handleMessageTypeChange("location")}
            variant={messageType === "location" ? "contained" : "outlined"}
          >
            Location
          </Button>
          <Button
            onClick={() => handleMessageTypeChange("flex")}
            variant={messageType === "flex" ? "contained" : "outlined"}
          >
            Flex
          </Button>
          <Button
            onClick={() => handleMessageTypeChange("template")}
            variant={messageType === "template" ? "contained" : "outlined"}
          >
            Template
          </Button>
        </ButtonGroup>
      </Box>

      {/* Text Message Section */}
      <Box mt={4} width="100%" backgroundColor="primary">
        <Typography
          variant="h6"
          backgroundColor="primary.main"
          gutterBottom
          style={{
            color: "#fff",
            padding: "10px",
          }}
        >
          {messageType.charAt(0).toUpperCase() + messageType.slice(1)} Message
        </Typography>
        {Array.from(
          {
            length:
              messageType === "sticker" || 
              messageType === "image" || 
              messageType === "video" || 
              messageType === "audio"
                ? 2
                : messageType === "location"
                ? 4
                : 1, // Default 1 box for other message types
          }
        ).map((_, index) => {
          let placeholder = `Enter ${messageType} #${index + 1} here`;
          let rows = 4;
          if (messageType === "location") {
            const locationPlaceholders = ["Title", "Address", "Latitude", "Longitude"];
            placeholder = locationPlaceholders[index];
            rows = 1;
          } else if (messageType === "image") {
            const imagePlaceholders = ["Original Content URL", "Preview Image URL"];
            placeholder = imagePlaceholders[index];
            rows = 1;
          } else if (messageType === "sticker") {
            const imagePlaceholders = ["PackageId", "StickerId"];
            placeholder = imagePlaceholders[index];
            rows = 1;
          } 
          else if (messageType === "video") {
            const imagePlaceholders = ["Original Content URL", "Preview Image URL"];
            placeholder = imagePlaceholders[index];
            rows = 1;
          }
          else if (messageType === "audio") {
            const imagePlaceholders = ["Original Content URL", "Duration"];
            placeholder = imagePlaceholders[index];
            rows = 1;
          }
          else if (messageType === "flex") {
            const imagePlaceholders = ["Json"];
            placeholder = imagePlaceholders[index];
          }
         else if (messageType === "template") {
            const imagePlaceholders = ["Json"];
            placeholder = imagePlaceholders[index];
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
