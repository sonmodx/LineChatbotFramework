"use client";

import React, { useState } from 'react';
import { Box, TextField, Checkbox, Typography, Autocomplete, Grid, Button } from '@mui/material';

const apis = ['API 1', 'API 2', 'API 3']; // Example options for API selection

export default function replyaction() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  return (
    <Box p={4}>
      {/* Title and Description */}
      <Typography variant="h5" gutterBottom>
        Reply Message
      </Typography>

      {/* Thin Black Line */}
      <Box
        borderBottom={1}
        borderColor="black"
        mb={3} // Add some space below the line
      />

      <Typography variant="body2" gutterBottom>
        วิธีใช้งาน: ข้อความตอบกลับเมื่อพบ keyword ใน Line Chatbot
      </Typography>

      {/* Keyword Input */}
      <Box mt={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Keyword
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter keyword"
              variant="outlined"
            />
          </Grid>

          {/* Param Label and Input */}
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

      {/* API Section */}
      <Box mt={4}>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={3}>
            <Checkbox checked={useApi} onChange={handleCheckboxChange} />
            <Typography variant="body1" display="inline">Use API</Typography>
          </Grid>

          <Grid item xs={12} sm={9}>
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

      {/* Text Message Section */}
      <Box mt={4}>
        <Typography
          variant="h6"
          gutterBottom
          style={{ backgroundColor: '#1E88E5', color: '#fff', padding: '10px' }}
        >
          Text Message
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={8}
          placeholder="Enter your message here"
          variant="outlined"
        />
      </Box>

      {/* Note */}
      <Box mt={2}>
        <Typography variant="caption">*หมายเหตุ การเรียกใช้ keyword จะอยู่ก่อน Params เช่น call {'{num}'} และแสดงผลใน text message ใช้ {'{result}'} </Typography>
      </Box>

      {/* Save Button */}
      <Box mt={4} textAlign="right">
        <Button variant="contained" color="primary">
          Save
        </Button>
      </Box>
    </Box>
  );
}
