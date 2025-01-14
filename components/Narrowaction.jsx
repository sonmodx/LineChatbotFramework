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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import Notification from "./Notification";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { getAllApis } from "@/actions";
import SwitchInputComponent from "./SwitchInputComponent";
import { getCurrentTime, parseDateTime } from "@/lib/utils";

const narrowFilterList = [{ type: "audience", audienceGroupId: 6618080771019 }];

export default function NarrowMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [selectedGroups, setSelectedGroups] = useState(null); // State for selected group
  const [messageCount, setMessageCount] = useState(1); // Track number of message boxes
  const maximumMessage = 5;
  const [messages, setMessages] = useState(
    Array(messageCount).fill({ type: "text", text: "" })
  );
  console.log("Messages", messages);
  const [selectAudience, setSelectAudience] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    statusMessage: "",
  });
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "Narrowcast";
  const [apis, setApis] = useState([]);
  const [dynamicContents, setDynamicContents] = useState([]);
  const [dateTime, setDateTime] = useState(null);
  /*
  
  */

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  const handleGroupChange = (event, newValue) => {
    setSelectedGroups(newValue);
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
    const body = {
      type: typeMessage,
      destination: channelId,
      direct_config: {
        narrow_filter: selectAudience,
        message: messages,
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
        rows={rows}  // Set dynamic row count based on message type
        sx={{ mt: 2 }}
      />
    ));
  };


  return (
    <Box p={4} width="100%">
      {/* Title and Description */}
      <Typography variant="h5" gutterBottom>
        Narrowcast Message
      </Typography>
      <Box borderBottom={1} borderColor="black" mb={3} width="100%" />
      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน : สามารถส่ง messages ไปหา user ทีละกลุ่มโดยระบุ audience
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

          {/* User Input and API Section */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              backgroundColor="primary.main"
              style={{ color: "#fff", padding: "10px" }}
            >
              Filter by
            </Typography>
            {/* Group Selection */}
            <Autocomplete
              options={narrowFilterList}
              getOptionLabel={(option) => option.type || ""}
              value={selectAudience}
              onChange={(event, newValue) => setSelectAudience(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Group"
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
