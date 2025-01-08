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
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import { getAllApis } from "@/actions";

export default function FlexMessage() {
  const [useApi, setUseApi] = useState(false); // Checkbox state for using API
  const [selectedApi, setSelectedApi] = useState(null); // Selected API from dropdown
  const [flexMessageInput, setFlexMessageInput] = useState(""); // User input from the left box
  const [flexMessageJson, setFlexMessageJson] = useState(""); // JSON for the right box
  const [parsedFlexMessage, setParsedFlexMessage] = useState(null); // Parsed JSON for the preview
  const searchParams = useSearchParams();

  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const [apis, setApis] = useState([]);
  // Handle the change in the Flex Message Designer input (left box)
  const handleFlexMessageInputChange = (event) => {
    const inputValue = event.target.value;

    // Remove single-line comments (//) and multi-line comments (/* */)
    const cleanedInput = inputValue
      .replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, "")
      .trim();
    setFlexMessageInput(inputValue);

    try {
      // Parse the cleaned JSON input
      const parsedJson = JSON.parse(cleanedInput);
      setFlexMessageJson(JSON.stringify(parsedJson, null, 2)); // Format JSON with indentation
      setParsedFlexMessage(parsedJson); // Store the parsed JSON for live preview
    } catch (error) {
      // Set empty or invalid JSON if parsing fails
      setFlexMessageJson("Invalid JSON format");
      setParsedFlexMessage(null); // Clear the preview if JSON is invalid
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

  // Render the preview based on the parsed Flex Message JSON
  const renderPreview = () => {
    if (!parsedFlexMessage) {
      return (
        <Typography color="error">Invalid JSON format or no input</Typography>
      );
    }

    const { header, hero, body, footer } = parsedFlexMessage;

    return (
      <Box
        p={2}
        border="1px solid #ccc"
        borderRadius="4px"
        mt={2}
        style={{ backgroundColor: "#f9f9f9", maxWidth: "400px" }}
      >
        {/* Header Preview */}
        {header && (
          <Box
            style={{
              backgroundColor: header.backgroundColor || "#1E88E5",
              padding: "10px",
            }}
          >
            <Typography style={{ color: "#ffffff", textAlign: "center" }}>
              {header.contents[0]?.text || "Header"}
            </Typography>
          </Box>
        )}

        {/* Hero Image Preview */}
        {hero && hero.url && (
          <Box mt={2}>
            <img
              src={hero.url}
              alt="Hero Image"
              style={{
                width: "100%",
                aspectRatio: hero.aspectRatio || "1.51/1",
                objectFit: "cover",
              }}
            />
          </Box>
        )}

        {/* Body Preview */}
        {body && (
          <Box mt={2}>
            {body.contents.map((content, index) => (
              <Typography key={index} style={{ color: "#666" }}>
                {content.text || "Body Text"}
              </Typography>
            ))}
          </Box>
        )}

        {/* Footer Preview */}
        {footer && (
          <Box mt={2}>
            <Button
              variant="contained"
              fullWidth
              style={{
                backgroundColor: footer.contents[0]?.color || "#1E88E5",
              }}
            >
              {footer.contents[0]?.action?.label || "Button"}
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <Box p={4}>
      {/* Title */}
      <Typography variant="h5" gutterBottom>
        Flex Message
      </Typography>

      {/* Thin Black Line */}
      <Box borderBottom={1} borderColor="black" mb={3} />

      <Typography variant="body2" gutterBottom>
        วิธีการใช้งาน : กรอกFlex Message ที่ได้จาก LINE bot Designer และทำการกด
        Format Flex Message JSON ที่ได้จาก LINE Bot Designer
      </Typography>

      <Box mt={3}>
        <Grid container spacing={2}>
          {/* Left side - Flex Message Designer input */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              backgroundColor="primary.main"
              style={{
                color: "#fff",
                padding: "10px",
              }}
            >
              Flex Message LINE BOT Designer
            </Typography>

            {/* TextArea for user input */}
            <TextField
              fullWidth
              multiline
              rows={15}
              placeholder="Enter Flex Message JSON here..."
              variant="outlined"
              value={flexMessageInput}
              onChange={handleFlexMessageInputChange}
              style={{ backgroundColor: "#f5f5f5" }}
            />
          </Grid>

          {/* Right side - JSON Preview with Scroll Bar */}
          <Grid item xs={12} sm={6}>
            <Typography
              variant="h6"
              gutterBottom
              backgroundColor="primary.main"
              style={{
                color: "#fff",
                padding: "10px",
              }}
            >
              JSON #Flex Message
            </Typography>

            {/* JSON Preview Box - Fixed Height and Scroll Bar */}
            <Box
              component="pre"
              p={2}
              style={{
                backgroundColor: "#333",
                color: "#fff",
                height: "340px", // Match height of the input field
                whiteSpace: "pre-wrap",
                overflowY: "auto", // Enable vertical scroll if content is too long
                fontFamily: "monospace",
                borderRadius: "4px",
              }}
            >
              {flexMessageJson || "Enter valid JSON to preview..."}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Flex Message Live Preview */}
      <Box mt={4}>
        <Typography
          variant="h6"
          gutterBottom
          backgroundColor="primary.main"
          style={{ color: "#fff", padding: "10px" }}
        >
          Preview
        </Typography>
        {/* Render live preview */}
        {renderPreview()}
      </Box>

      {/* API Section */}
      <Box mt={4}>
        <Checkbox
          checked={useApi}
          onChange={(e) => setUseApi(e.target.checked)}
        />
        <Typography variant="body1" display="inline">
          Use API
        </Typography>

        {useApi && (
          <Autocomplete
            options={apis}
            getOptionLabel={(option) => option.name || ""}
            value={selectedApi}
            onChange={(event, newValue) => setSelectedApi(newValue)}
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
