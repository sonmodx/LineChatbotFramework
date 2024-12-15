// pages/rich-menu-designer.js
"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Checkbox,
  Typography,
  Grid,
  Button,
  styled,
  Input,
  Modal,
  Grid2,
  Paper,
} from "@mui/material";
import { useSearchParams } from "next/navigation";
import Notification from "./Notification";
import axios from "axios";
import ActionComponent from "./ActionComponent";
import Image from "next/image";

const HiddenInput = styled("input")({
  display: "none",
});

const largeTemplate = [
  { id: 1, imageUrl: "/template1L.png" },
  { id: 2, imageUrl: "/template2L.png" },
  { id: 3, imageUrl: "/template3L.png" },
  { id: 4, imageUrl: "/template4L.png" },
  { id: 5, imageUrl: "/template5L.png" },
  { id: 6, imageUrl: "/template6L.png" },
  { id: 7, imageUrl: "/template7L.png" },
];

const compactTemplate = [
  { id: 1, imageUrl: "/template1C.png" },
  { id: 2, imageUrl: "/template2C.png" },
  { id: 3, imageUrl: "/template3C.png" },
  { id: 4, imageUrl: "/template4C.png" },
  { id: 5, imageUrl: "/template5C.png" },
];

export default function RichMenuDesigner() {
  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [openNotification, setOpenNotification] = useState(false);
  const [chatBarTitle, setChatBarTitle] = useState("");
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const typeMessage = "RichMenu";
  const [image, setImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      if (file.size > 1024 * 1024) {
        alert("File size must be less than 1MB");
        return;
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Only JPEG and PNG formats are supported");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  //   const handleMessageChange = (value) => {
  //     setMessages(value);
  //   };

  const handleSendMessage = async () => {
    if (messages.trim() === "" || messages === undefined) {
      return;
    }
    const body = {
      type: typeMessage,
      destination: channelId,
      message: [{ type: "text", text: messages }],
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
        setOpenNotification(true);
      }

      console.log("Response from webhook:", res.data);
    } catch (error) {
      console.error(
        "Error sending request to webhook:",
        error.response?.data || error.message
      );
    }
  };

  const handleSelectTemplate = (imageUrl) => {
    setImagePreview(imageUrl);
    setOpenModal(false);
  };

  return (
    <Box p={4} width="100%">
      {/* Title and Description */}
      <Typography variant="h5" gutterBottom>
        Rich Menu
      </Typography>

      {/* Thin Black Line */}
      <Box
        borderBottom={1}
        borderColor="black"
        mb={3} // Add space below the line
        width="100%"
      />

      <Typography variant="body2" gutterBottom>
        วิธีการใช้งาน : เครื่องมือที่ใช้ทำ Rich Menu
      </Typography>

      {/* Text Message and Result Areas */}
      <Box mt={3} width="100%">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h6"
              gutterBottom
              backgroundColor="primary.main"
              style={{ color: "#fff", padding: "10px" }}
            >
              Rich menu Designer
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Image Input Box */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          border: "2px dashed #ccc",
          borderRadius: 2,
          p: 2,
          textAlign: "center",
          backgroundColor: "#fff",
          mb: 2,
        }}
      >
        {image ? (
          <Box>
            <img
              src={image}
              alt="Uploaded preview"
              style={{ width: "100%", borderRadius: 4 }}
            />
            <Button
              variant="contained"
              color="error"
              sx={{ mt: 2 }}
              onClick={() => setImage(null)}
            >
              Remove Image
            </Button>
          </Box>
        ) : (
          <label htmlFor="image-upload">
            <HiddenInput
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button variant="outlined" component="span">
              Upload Image
            </Button>
          </label>
        )}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Supported formats: JPEG, PNG
      </Typography>

      <Box mt={4} width="100%">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenModal(true)}
        >
          Select template
        </Button>
      </Box>
      {imagePreview && (
        <Image
          src={imagePreview}
          alt="Image Preview"
          width={150}
          height={150}
          className="mt-4 object-cover"
        />
      )}

      <Typography mt={4}>Chat Bar Title</Typography>
      <TextField
        fullWidth
        variant="outlined"
        value={chatBarTitle}
        onChange={(e) => setChatBarTitle(e.target.value)}
      />
      <Box>
        <Typography mt={4}>Action Bar</Typography>
      </Box>
      <ActionComponent />

      {/* Send Button */}
      <Box mt={4} textAlign="right" width="100%">
        <Button variant="contained" color="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </Box>

      <Notification
        openNotification={openNotification}
        setOpenNotification={setOpenNotification}
        message="Successful sent message"
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-template-selector"
        aria-describedby="template-selector-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ borderBottomWidth: "1px" }}
            gutterBottom
          >
            Select a template
          </Typography>

          {/* Large templates */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Large
            </Typography>
            <Grid container spacing={2} p={2}>
              {largeTemplate?.map((lt) => (
                <Grid item xs={6} md={3} key={lt.id}>
                  <div
                    className="relative group"
                    onClick={() => handleSelectTemplate(lt.imageUrl)}
                  >
                    <Image
                      src={lt.imageUrl}
                      width={120}
                      height={120}
                      style={{
                        objectFit: "cover",
                        height: "auto",
                        maxWidth: "100%",
                        cursor: "pointer",
                      }}
                      alt="template-option"
                      className="object-cover w-full h-auto cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
          {/* Compact templates */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 4 }}>
              Compact
            </Typography>
            <Grid container spacing={2} p={2}>
              {compactTemplate?.map((ct) => (
                <Grid item xs={6} md={3} key={ct.id}>
                  <div
                    className="relative group"
                    onClick={() => handleSelectTemplate(ct.imageUrl)}
                  >
                    <Image
                      src={ct.imageUrl}
                      width={120}
                      height={120}
                      style={{
                        objectFit: "cover",
                        height: "auto",
                        maxWidth: "100%",
                        cursor: "pointer",
                      }}
                      alt="template-option"
                      className="object-cover w-full h-auto cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-110"
                    />
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Box>
  );
}
