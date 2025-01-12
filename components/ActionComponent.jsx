import React, { act, useEffect, useState } from "react";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";

const ActionComponent = ({ handleAreaChange, index, imagePreview }) => {
  const [action, setAction] = useState("No action");
  const [text, setText] = useState("");
  const [label, setLabel] = useState("");
  const [uri, setUri] = useState("");

  const actions = ["Link", "Text", "No action"];

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const objectValue = (type) => {
    if (type === "text") {
      return {
        type: "message",
        // label: text,
        text: text,
      };
    } else if (type === "uri") {
      return {
        type: "uri",
        label: label,
        uri: uri,
      };
    }
  };
  useEffect(() => {
    setAction("No action");
    setText("");
    setUri("");
    setLabel("");
  }, [imagePreview]);

  useEffect(() => {
    handleAreaChange(index, "action", objectValue("text"));
  }, [text]);

  useEffect(() => {
    handleAreaChange(index, "action", objectValue("uri"));
  }, [label, uri]);

  useEffect(() => {
    if (action === "Text") {
      setText("");
    } else if (action === "Link") {
      setLabel("");
      setUri("");
    } else {
      handleAreaChange(index, "action", {});
    }
  }, [action]);

  return (
    <Box sx={{ p: "20px" }}>
      <Typography
        gutterBottom
        sx={{
          borderBottomWidth: "1px",
          paddingBottom: "8px",
          marginBottom: "16px",
        }}
      >
        Action {index + 1}
      </Typography>

      <Box sx={{ mb: "15px" }}>
        <Autocomplete
          options={actions}
          value={action}
          onChange={(event, newValue) => {
            setAction(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Message Action" variant="outlined" />
          )}
        />
      </Box>
      {action === "Text" && (
        <Box>
          <TextField
            label="Text"
            variant="outlined"
            value={text}
            onChange={handleTextChange}
            fullWidth
            required
          />
        </Box>
      )}
      {action === "Link" && (
        <Box>
          <TextField
            label="Enter URL"
            variant="outlined"
            value={uri}
            onChange={(event) => setUri(event.target.value)}
            fullWidth
            required
          />
          <TextField
            sx={{ mt: 3 }}
            label="Action Label"
            placeholder="Link label (Examples: Open link, Home page, etc.)"
            variant="outlined"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            fullWidth
            required
          />
        </Box>
      )}
    </Box>
  );
};

export default ActionComponent;
