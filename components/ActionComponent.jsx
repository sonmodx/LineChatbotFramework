import React, { act, useEffect, useState } from "react";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";

const ActionComponent = ({ handleAreaChange, index }) => {
  const [action, setAction] = useState("Message Action");
  const [text, setText] = useState("");
  const [label, setLabel] = useState("");
  const [uri, setUri] = useState("");

  const actions = ["Link", "Text", "Coupon", "Reward cards", "No action"];

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const objectValue = (type) => {
    if (type === "text") {
      return {
        type: "message",
        label: text,
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
    handleAreaChange(index, "action", objectValue("text"));
  }, [text]);

  useEffect(() => {
    handleAreaChange(index, "action", objectValue("uri"));
  }, [label, uri]);

  useEffect(() => {
    setText("");
    setLabel("");
    setUri("");
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
          />
          <TextField
            sx={{ mt: 3 }}
            label="Action Label"
            placeholder="Link label (Examples: Open link, Home page, etc.)"
            variant="outlined"
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            fullWidth
          />
        </Box>
      )}
    </Box>
  );
};

export default ActionComponent;
