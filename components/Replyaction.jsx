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
import {
  checkExistKeywordReplyAction,
  getAllApis,
  getApiById,
} from "@/actions";
import SwitchInputComponent from "./SwitchInputComponent";
import Loading from "./Loading";

export default function Replyaction({ data, setState, state }) {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [selectedApiParam, setSelectedApiParam] = useState(null);
  const [apiParamOptions, setApiParamOptions] = useState([]);
  const [apiParams, setApiParams] = useState([]);
  const [messageCount, setMessageCount] = useState(data?.message.length || 1); // Track number o
  const [keywords, setKeywords] = useState(data?.keyword.join(",") || []);
  const [messages, setMessages] = useState(
    data?.message || Array(messageCount).fill({ type: "text", text: "" })
  );
  const [errorKeyword, setErrorKeyword] = useState({
    error: false,
    message: "",
  });
  const [isActive, setIsActive] = useState(data?.isActivated ?? true);

  const searchParams = useSearchParams();

  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const id = data?._id || null;
  const maximumMessage = 5;
  const [apis, setApis] = useState([]);
  const [dynamicContents, setDynamicContents] = useState([]);
  const [name, setName] = useState(data?.name || "");
  const [description, setDescription] = useState(data?.description || "");
  const [loading, setLoading] = useState(true);

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
    setSelectedApi(null);
    setSelectedApiParam(null);
    setApiParams([]);
    setApiParamOptions([]);
  };

  const handleApiChange = (event, newValue) => {
    if (!newValue) return;
    console.log("API", newValue);
    setSelectedApi(newValue);
    setApiParamOptions(
      newValue?.api_params.map((param, index) => ({
        ...param,
        index,
      }))
    );
  };

  const handleApiParamChange = (event, newValue) => {
    if (!newValue) return;
    setApiParams((prev) => [...prev, newValue]);
    setSelectedApiParam(newValue);
    setApiParamOptions((prevParam) =>
      prevParam.filter((param) => param.key !== newValue.key)
    );

    console.log("param", newValue);
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
      if (keywords.length === 0) {
        setErrorKeyword({ error: true, message: "This field is required" });
        return;
      }
      const existKeyword = await checkExistKeywordReplyAction(
        channelObjectId,
        keywords.split(","),
        id
      );

      if (existKeyword) {
        setErrorKeyword({
          error: true,
          message: "Keyword have already be used",
        });
        return;
      }

      setErrorKeyword({ error: false, message: "" });
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
        type_action: "reply",
        description: description,
        api_id: selectedApi?._id || "",
        channel_id: channelObjectId,
        message: newMessages,
        keyword: keywords.split(","),
        param: apiParams.map((param) => param.index.toString()),
        isActivated: isActive,
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

  const handleGetApiById = async () => {
    const _api = await getApiById(data?.api_id || null);
    if (_api) {
      setUseApi(true);
      console.log("_api", _api);
      const apiJSON = JSON.parse(_api);
      setSelectedApi(apiJSON);
      if (state === "edit") {
        console.log("p1", data?.param, apiJSON);
        const apiParamObjects = data?.param.map((pIndex) => ({
          ...apiJSON.api_params[parseInt(pIndex)],
          index: pIndex,
        }));
        console.log("PARAM OBG", apiParamObjects);
        setApiParams(apiParamObjects);
      }
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
        Reply Message
        <Switch
          checked={isActive}
          onChange={() => setIsActive((prev) => !prev)}
          inputProps={{ "aria-label": "controlled-switch" }}
        />
      </Typography>

      {/* Thin Black Line */}
      <Box borderBottom={1} borderColor="black" mb={3} width="100%" />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน: ข้อความตอบกลับเมื่อพบ keyword ใน Line Chatbot
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

      {/* Keyword Input */}
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
              error={errorKeyword.error}
              helperText={errorKeyword.message}
            />
          </Grid>

          {/* Param Label and Input */}
          <Grid item xs={12} sm={6}>
            {selectedApi?.api_params && selectedApi?.api_params.length > 0 && (
              <>
                <Typography variant="h6" gutterBottom>
                  Params
                </Typography>
                <Autocomplete
                  options={apiParamOptions}
                  getOptionLabel={(option) => option.key || ""}
                  value={selectedApiParam}
                  onChange={handleApiParamChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select API Params"
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
              </>
            )}
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
          <Grid item xs={12} sm={6}>
            <div>
              {apiParams.map((param, index) => (
                <Chip
                  key={index}
                  label={`(index_${index}) ${param?.key}`}
                  color="primary"
                  onDelete={() => {
                    // Remove user from selected list
                    setApiParams((prev) =>
                      prev.filter((u) => u.key !== param?.key)
                    );
                    // Add back to line users list
                    setApiParamOptions((prev) => [...prev, param]);
                    setSelectedApiParam(null);
                  }}
                  sx={{ marginRight: 1 }}
                />
              ))}
            </div>
          </Grid>
        </Grid>
      </Box>

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

      {/* Note */}
      <Box mt={2} width="100%">
        <Typography variant="caption">
          *หมายเหตุ การเรียกใช้ keyword จะอยู่ก่อน Params เช่น call {"{num}"}{" "}
          และแสดงผลใน text message ใช้ {"{result}"}{" "}
        </Typography>
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
