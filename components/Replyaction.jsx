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

export default function Replyaction({ data, setState, state }) {
  const [useApi, setUseApi] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);
  const [keywords, setKeywords] = useState(data?.keyword.join(",") || []);
  const [messages, setMessages] = useState(data?.message.join(",") || []);
  const [errorKeyword, setErrorKeyword] = useState(false);
  const [messageType, setMessageType] = useState("text");
  const searchParams = useSearchParams();

  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const id = data?._id || null;
  const [apis, setApis] = useState([]);
  const [dynamicContents, setDynamicContents] = useState([]);
  console.log("GETDATA", data);

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
    setSelectedApi(null);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  const handleSave = async () => {
    try {
      if (keywords.length === 0) {
        setErrorKeyword(true);
        return;
      }
      setErrorKeyword(false);

      const body = {
        name: "Reply message",
        type: "text",
        type_action: "reply",
        api_id: selectedApi?._id || "",
        channel_id: channelObjectId,
        message: messages.split(","),
        keyword: keywords.split(","),
      };

      if (state === "create") {
        const res = await axios.post(
          "/api/Action?action_type=reply_message",
          body,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (res.status === 201) {
          setState("actions");
          console.log("Successful created action!");
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
    setApis(JSON.parse(_apis));
  };

  const handleMessageTypeChange = (type) => {
    setMessageType(type);
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
      <Typography variant="h5" gutterBottom>
        Reply Message
      </Typography>

      <Box borderBottom={1} borderColor="black" mb={3} width="100%" />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน: ข้อความตอบกลับเมื่อพบ keyword ใน Line Chatbot
      </Typography>

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

      <Box mt={3} width="100%">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Name
            </Typography>
            <TextField fullWidth placeholder="Enter Name" variant="outlined" />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter Description"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>

      <Box mt={3} width="100%">
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Keyword
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter keyword"
              variant="outlined"
              onChange={(e) => setKeywords(e.target.value)}
              value={keywords}
              error={errorKeyword}
              helperText={errorKeyword ? "This field is required" : ""}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Params
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter parameters"
              variant="outlined"
            />
          </Grid>
        </Grid>
      </Box>

      <Box mt={4} width="100%">
        <Typography variant="h6" gutterBottom>
          Message Type
        </Typography>
        <ButtonGroup variant="outlined" color="primary">
          {[
            "text",
            "image",
            "sticker",
            "video",
            "audio",
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

      <Box mt={4} width="100%" backgroundColor="primary">
        <Typography
          variant="h6"
          backgroundColor="primary.main"
          gutterBottom
          style={{ color: "#fff", padding: "10px" }}
        >
          {messageType.charAt(0).toUpperCase() + messageType.slice(1)} Message
        </Typography>
        {Array.from(
          {
            length:
              ["sticker", "image", "video", "audio"].includes(messageType)
                ? 2
                : messageType === "location"
                ? 4
                : 1,
          }
        ).map((_, index) => {
          let placeholder = `Enter ${messageType} #${index + 1} here`;
          let rows = 4;
          if (messageType === "location") {
            const placeholders = ["Title", "Address", "Latitude", "Longitude"];
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

      <Box mt={2} width="100%">
        <Typography variant="caption">
          *หมายเหตุ การเรียกใช้ keyword จะอยู่ก่อน Params เช่น call {"{num}"} และแสดงผลใน
          text message ใช้ {"{result}"}
        </Typography>
      </Box>

      <Box mt={4} textAlign="right" width="100%">
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </Box>
  );
}
