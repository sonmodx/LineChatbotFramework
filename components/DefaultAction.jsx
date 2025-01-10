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
  ButtonGroup,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { getAllApis } from "@/actions";

export default function DefaultAction({ data, setState, state }) {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [messages, setMessages] = useState(data?.message.join(",") || []);
  const [messageType, setMessageType] = useState("text"); // State for message type
  const searchParams = useSearchParams();
  const id = data?._id || null;
  const channelObjectId = searchParams.get("id");
  const [apis, setApis] = useState([]);
  const [dynamicContents, setDynamicContents] = useState([]);

  const channelId = searchParams.get("id");

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  const handleMessageTypeChange = (type) => {
    setMessageType(type);
    setMessages(""); // Reset messages when type changes
  };

  const handleSave = async () => {
    try {
      const body = {
        name: "Test default message",
        type: messageType,
        type_action: "default",
        channel_id: channelId,
        message: messages.split(","),
      };
      if (state === "create") {
        const res = await axios.post(
          "/api/Action?action_type=default_message",
          body,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (res.status === 201) {
          setState("actions");
          console.log("Successful created new channel!");
        }
      } else if (state === "edit") {
        const res = await axios.put(`/api/Action?id=${id}`, body, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.status === 200) {
          setState("actions");
          console.log("Successful update action!");
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetAllApis = async () => {
    const _apis = await getAllApis(channelObjectId);

    console.log(_apis);
    setApis(JSON.parse(_apis));
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
        Default Message
      </Typography>

      {/* Thin Black Line */}
      <Box borderBottom={1} borderColor="black" mb={3} width="100%" />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน: ข้อความตอบกลับอัตโนมัตินอกเหนือจาก keyword ที่ระบุใน reply
        message
      </Typography>

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
                getOptionLabel={(option) => option.name || ""}
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

      {/* Type Selection Section */}
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
        <TextField
          fullWidth
          multiline
          rows={8}
          placeholder={`Enter your ${messageType} here`}
          variant="outlined"
          value={messages}
          onChange={(e) => setMessages(e.target.value)}
        />
        {dynamicContents.length > 0 && renderButtons(dynamicContents)}
      </Box>

      {/* Note */}
      <Box mt={2} width="100%">
        <Typography variant="caption">*หมายเหตุ</Typography>
      </Box>

      {/* Save Button */}
      <Box mt={4} textAlign="right" width="100%">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
