import React, { useState } from "react";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";

const ActionComponent = () => {
  const [action, setAction] = useState("Message Action");
  const [text, setText] = useState("");

  const actions = ["Link", "Coupon", "Text", "Reward cards", "No action"];

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

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
        Action 1
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

      <Box>
        <TextField
          label="Text"
          variant="outlined"
          value={text}
          onChange={handleTextChange}
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default ActionComponent;
