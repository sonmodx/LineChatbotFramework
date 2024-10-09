"use client";

import React, { useState } from 'react';
import { Box, TextField, Checkbox, Typography, Autocomplete, Grid, Button, IconButton } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

const apis = ['API 1', 'API 2', 'API 3']; // Example options for API selection

export default function PushMessage() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [messageCount, setMessageCount] = useState(1); // Track number of message boxes

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  const addMessageBox = () => {
    if (messageCount < 5) {
      setMessageCount(messageCount + 1);
    }
  };

  const removeMessageBox = () => {
    if (messageCount > 1) {
      setMessageCount(messageCount - 1);
    }
  };

  return (
    <Box p={4}>
      {/* Title and Description */}
      <Typography variant="h5" gutterBottom>
        Push Message
      </Typography>

      {/* Thin Black Line */}
      <Box
        borderBottom={1}
        borderColor="black"
        mb={3} // Add some space below the line
      />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน : สามารถส่ง messages ไปหา user ทีละคนโดยระบุ User
      </Typography>

      {/* Text Message and User Areas */}
      <Box mt={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              style={{ backgroundColor: '#1E88E5', color: '#fff', padding: '10px' }}
            >
              Text Message
            </Typography>
            
            {/* Dynamically created text fields for message */}
            {[...Array(messageCount)].map((_, index) => (
              <Box key={index} mt={2}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder={`Enter your message (${index + 1}/5)`}
                  variant="outlined"
                />
              </Box>
            ))}

            {/* ADD and REMOVE buttons */}
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
              style={{ backgroundColor: '#1E88E5', color: '#fff', padding: '10px' }}
            >
              User
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter user info"
              variant="outlined"
              mb={2}
            />

            {/* API Section */}
            <Checkbox checked={useApi} onChange={handleCheckboxChange} />
            <Typography variant="body1" display="inline">Use API</Typography>

            {useApi && (
              <Autocomplete
                options={apis}
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

      {/* Result Section */}
      <Box mt={3}>
        <Typography
          variant="h6"
          gutterBottom
          style={{ backgroundColor: '#1E88E5', color: '#fff', padding: '10px' }}
        >
          Result
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Result will be shown here"
          variant="outlined"
        />
      </Box>

      {/* Send Button */}
      <Box mt={4} textAlign="right">
        <Button variant="contained" color="primary">
          Send
        </Button>
      </Box>
    </Box>
  );
}