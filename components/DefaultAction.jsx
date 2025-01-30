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
  Switch,
  Chip,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import axios from "axios";
import { getAllApis, getApiById } from "@/actions";
import SwitchInputComponent from "./SwitchInputComponent";
import Loading from "./Loading";

export default function DefaultAction({ data, setState, state }) {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [messageCount, setMessageCount] = useState(data?.message.length || 1); // Track number o
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [messages, setMessages] = useState(
    data?.message || Array(messageCount).fill({ type: "text", text: "" })
  );

  const searchParams = useSearchParams();
  console.log("selectyed api", selectedApi);
  const id = data?._id || null;
  const maximumMessage = 5;
  const channelObjectId = searchParams.get("id");
  const [apis, setApis] = useState([]);
  const [dynamicContents, setDynamicContents] = useState([]);
  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [isActive, setIsActive] = useState(data?.isActivated ?? true);
  const [loading, setLoading] = useState(true);
  const [useAI, setUseAI] = useState(data?.useAI || false);

  const channelId = searchParams.get("id");

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
    setSelectedApi(null);
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

  const isValidJSON = (str) => {
    try {
      JSON.parse(str);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSave = async () => {
    try {
      const newMessages = messages.map((msg) => {
        if (msg.type === "template" && isValidJSON(msg.template)) {
          return JSON.parse(msg.template);
        }
        if (msg.type === "imagemap" && isValidJSON(msg.imagemap)) {
          return JSON.parse(msg.imagemap);
        }
        if (msg.type === "flex" && isValidJSON(msg.flex)) {
          return JSON.parse(msg.flex);
        }

        return msg;
      });
      const body = {
        name: name,
        type: messages[0]?.type,
        type_action: "default",
        description: description,
        api_id: selectedApi?._id || "",
        channel_id: channelId,
        message: newMessages,
        isActivated: isActive,
        useAI: useAI,
      };
      console.log("BODY", body);
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

    setApis(JSON.parse(_apis));
  };
  const handleGetApiById = async () => {
    const _api = await getApiById(data?.api_id || null);
    if (_api) {
      setUseApi(true);

      setSelectedApi(JSON.parse(_api));
    }
  };

  const getBaseAPI = async () => {
    setLoading(true);
    await handleGetAllApis();
    await handleGetApiById();
    setLoading(false);
  };

  useEffect(() => {
    getBaseAPI();
  }, []);

  useEffect(() => {
    if (
      selectedApi === null ||
      typeof selectedApi !== "object" ||
      Array.isArray(selectedApi) ||
      typeof selectedApi?.response === "undefined"
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

  if (loading) return <Loading />;

  return (
    <Box p={4} width="100%">
      {/* Title and Description */}
      <Typography variant="h5" gutterBottom>
        Default Message
        <Switch
          checked={isActive}
          onChange={() => setIsActive((prev) => !prev)}
          inputProps={{ "aria-label": "controlled-switch" }}
        />
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
            <Checkbox
              checked={useApi}
              onChange={handleCheckboxChange}
              disabled={useAI}
            />
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
      <Box mt={3} width="100%">
        <Checkbox
          checked={useAI}
          disabled={useApi}
          onChange={(event) => setUseAI(event.target.checked)}
        />
        <Typography variant="body1" display="inline">
          Use AI to respond to user messages that are not predefined in the
          Reply Action.
        </Typography>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          {/* Description Input */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter Description"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      {!useAI && (
        <Grid item xs={12} sm={12}>
          <Typography
            variant="h6"
            gutterBottom
            backgroundColor="primary.main"
            style={{ color: "#fff", padding: "10px", marginTop: 16 }}
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
      )}

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
