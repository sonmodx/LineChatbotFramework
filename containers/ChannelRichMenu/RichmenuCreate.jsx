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
  Paper
} from "@mui/material";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

import Notification from "../../components/Notification";
import axios from "axios";
import ActionComponent from "../../components/ActionComponent";
import Image from "next/image";

const HiddenInput = styled("input")({
  display: "none",
});

const largeTemplate = [
  {
    id: 1,
    imageUrl: "/template1L.png",
    size: { width: 2500, height: 1686 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 833, height: 843 },
        action: {},
      },
      {
        bounds: { x: 833, y: 0, width: 833, height: 843 },
        action: {},
      },
      {
        bounds: { x: 1666, y: 0, width: 834, height: 843 },
        action: {},
      },
      {
        bounds: { x: 0, y: 843, width: 833, height: 843 },
        action: {},
      },
      {
        bounds: { x: 833, y: 843, width: 833, height: 843 },
        action: {},
      },
      {
        bounds: { x: 1666, y: 843, width: 834, height: 843 },
        action: {},
      },
    ],
  },
  {
    id: 2,
    imageUrl: "/template2L.png",
    size: { width: 2500, height: 1686 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 1250, height: 843 },
        action: {},
      },
      {
        bounds: { x: 1250, y: 0, width: 1250, height: 843 },
        action: {},
      },
      {
        bounds: { x: 0, y: 843, width: 1250, height: 843 },
        action: {},
      },
      {
        bounds: { x: 1250, y: 843, width: 1250, height: 843 },
        action: {},
      },
    ],
  },
  {
    id: 3,
    imageUrl: "/template3L.png",
    size: { width: 2500, height: 1686 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 2500, height: 843 },
        action: {},
      },
      {
        bounds: { x: 0, y: 843, width: 833, height: 843 },
        action: {},
      },
      {
        bounds: { x: 833, y: 843, width: 834, height: 843 },
        action: {},
      },
      {
        bounds: { x: 1667, y: 843, width: 833, height: 843 },
        action: {},
      },
    ],
  },
  {
    id: 4,
    imageUrl: "/template4L.png",
    size: { width: 2500, height: 1686 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 1666, height: 1686 },
        action: {},
      },
      {
        bounds: { x: 1666, y: 0, width: 834, height: 843 },
        action: {},
      },
      {
        bounds: { x: 1666, y: 843, width: 834, height: 843 },
        action: {},
      },
    ],
  },
  {
    id: 5,
    imageUrl: "/template5L.png",
    size: { width: 2500, height: 1686 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 2500, height: 843 },
        action: {},
      },
      {
        bounds: { x: 0, y: 843, width: 2500, height: 843 },
        action: {},
      },
    ],
  },
  {
    id: 6,
    imageUrl: "/template6L.png",
    size: { width: 2500, height: 1686 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 1250, height: 1686 },
        action: {},
      },
      {
        bounds: { x: 1250, y: 0, width: 1250, height: 1686 },
        action: {},
      },
    ],
  },
  {
    id: 7,
    imageUrl: "/template7L.png",
    size: {
      width: 2500,
      height: 1686,
    },
    areas: [
      {
        bounds: {
          x: 0,
          y: 0,
          width: 2500,
          height: 1686,
        },
        action: {},
      },
    ],
  },
];

const compactTemplate = [
  {
    id: 1,
    imageUrl: "/template1C.png",
    size: { width: 2500, height: 843 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 833, height: 843 },
        action: {},
      },
      {
        bounds: { x: 833, y: 0, width: 834, height: 843 },
        action: {},
      },
      {
        bounds: { x: 1667, y: 0, width: 833, height: 843 },
        action: {},
      },
    ],
  },
  {
    id: 2,
    imageUrl: "/template2C.png",
    size: { width: 2500, height: 843 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 834, height: 843 },
        action: {},
      },
      {
        bounds: { x: 834, y: 0, width: 1666, height: 843 },
        action: {},
      },
    ],
  },
  {
    id: 3,
    imageUrl: "/template3C.png",
    size: { width: 2500, height: 843 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 1666, height: 843 },
        action: {},
      },
      {
        bounds: { x: 1666, y: 0, width: 834, height: 843 },
        action: {},
      },
    ],
  },
  {
    id: 4,
    imageUrl: "/template4C.png",
    size: { width: 2500, height: 843 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 1250, height: 843 },
        action: {},
      },
      {
        bounds: { x: 1250, y: 0, width: 1250, height: 843 },
        action: {},
      },
    ],
  },
  {
    id: 5,
    imageUrl: "/template5C.png",
    size: { width: 2500, height: 843 },
    areas: [
      {
        bounds: { x: 0, y: 0, width: 2500, height: 843 },
        action: {},
      },
    ],
  },
];

export default function ChannelRichMenu({ setIsCreateState, state }) {
  const router = useRouter();

  const [useApi, setUseApi] = useState(false); // State for checkbox (Use API)
  const [selectedApi, setSelectedApi] = useState(null); // State for selected API
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    statusMessage: "",
  });
  const [chatBarTitle, setChatBarTitle] = useState("");
  const [chatBarTitleError, setChatBarTitleError] = useState("");
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const channelId = searchParams.get("channel_id");
  const [image, setImage] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAreaTemplate, setSelectedAreaTemplate] = useState([]);
  const [selectedSizeTemplate, setSelectedSizeTemplate] = useState({
    width: 0,
    height: 0,
  });
  console.log("image", image);
  const [imagePreview, setImagePreview] = useState(null);
  const [richMenuAlias, setRichMenuAlias] = useState(null);
  const [richMenuAliasError, setRichMenuAliasError] = useState("");
  const [richMenuId, setRichMenuId] = useState();

  const [validationStatus, setValidationStatus] = useState({
    fileTypeValid: null,
    fileSizeValid: null,
    widthValid: null,
    heightValid: null,
    aspectRatioValid: null,
    color: "text.secondary",
    icon: null, 
  });
  
  const validateImage = (file) => {
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
  
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      const aspectRatio = width / height;
  
      const fileTypeValid = ["image/jpeg", "image/png"].includes(file.type);
      const fileSizeValid = file.size <= 1024 * 1024;
      const widthValid = width >= 800 && width <= 2500;
      const heightValid = height >= 250;
      const aspectRatioValid = aspectRatio >= 1.45;
  
      setValidationStatus((prevStatus) => ({
        ...prevStatus,
        fileTypeValid,
        fileSizeValid,
        widthValid,
        heightValid,
        aspectRatioValid,
        color: fileTypeValid && fileSizeValid && widthValid && heightValid && aspectRatioValid ? 'green' : 'red',
        icon: fileTypeValid && fileSizeValid && widthValid && heightValid && aspectRatioValid ? <CheckCircleIcon /> : <CancelIcon />,
      }));
    };
  
    img.onerror = () => {
      setValidationStatus((prevStatus) => ({
        ...prevStatus,
        color: 'red',
        icon: <CancelIcon />,
      }));
    };
  };
  
  const richmenuconfig = {
    richmenu: {
      size: selectedSizeTemplate,
      selected: false,
      name: richMenuAlias,
      chatBarText: chatBarTitle,
      areas: selectedAreaTemplate,
    },
    richmenuAlias: richMenuAlias,
    image: image,
  };
  
  console.log("richmenuconfig", richmenuconfig);
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log("file", file);
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
      validateImage(file);
    }
  };

  const handleCheckboxChange = (event) => {
    setUseApi(event.target.checked);
  };

  const handleApiChange = (event, newValue) => {
    setSelectedApi(newValue);
  };

  const handleAreaChange = (index, key, value) => {
    const updatedAreas = [...selectedAreaTemplate];
    updatedAreas[index] = { ...updatedAreas[index], [key]: value };
    setSelectedAreaTemplate(updatedAreas);
  };

  const validateForm = () => {
    return (
      chatBarTitle.trim() !== "" &&
      richMenuAlias.trim() !== "" &&
      image !== null &&
      !richMenuAliasError &&
      !chatBarTitleError &&
      validationStatus.fileTypeValid &&
      validationStatus.fileSizeValid &&
      validationStatus.widthValid &&
      validationStatus.heightValid &&
      validationStatus.aspectRatioValid &&
      selectedAreaTemplate.every((area, index) => {
        const isActionValid = area.action && Object.keys(area.action).length > 0 && Object.values(area.action).every(value => value.trim() !== "");
        return isActionValid;
      })
    );
  };


  const validateRichMenuAlias = () => {
    return richMenuAlias === richMenuAlias.toLowerCase();
  };
  
  
  const handleCreateRichMenu = async () => {
    if (!validateForm() || !validateRichMenuAlias()) {
      setNotification({
        open: true,
        message: !validateRichMenuAlias() ? "Rich menu alias must be in lowercase." : "Please fill in all fields correctly before submitting.",
        statusMessage: "error",
      });
      return;
    }
  
    const body = {
      type: "createrichmenu",
      destination: channelId,
      richmenu_config: richmenuconfig,
    };
    console.log("body", body);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/richmenu`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("result", res);
  
      if (res.status === 200) {
        setRichMenuId(res.data);
        setIsCreateState("actions");
        setNotification({
          open: true,
          message: "Successfully created rich menu.",
          statusMessage: "success",
        });
        console.log("Response from webhook:", res.data);
      }
    } catch (error) {
      console.error(
        "Error sending request to webhook:",
        error.response?.data || error.message
      );
    }
  };

  const handleSelectTemplate = (template) => {
    setImagePreview(template.imageUrl);
    setSelectedSizeTemplate(template.size);
    setOpenModal(false);
    setSelectedAreaTemplate(template.areas);
  };

  const handleInputRichMenuName = (e) => {
    const word = e.target.value;
    if (word[word.length - 1] === " ") {
      window.alert("Can not input space");
    }
    const lowerCaseWord = word.replace(/\s/g, "");
    setRichMenuAlias(lowerCaseWord);
    if (lowerCaseWord !== lowerCaseWord.toLowerCase()) {
      setRichMenuAliasError("Rich menu alias must be in lowercase.");
    } else {
      setRichMenuAliasError("");
    }
  };

  const handleChatBarTitleChange = (e) => {
    const value = e.target.value;
    if (value.length > 14) {
      setChatBarTitleError("Max character limit is 14.");
    } else {
      setChatBarTitleError("");
    }
    setChatBarTitle(value);
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
        วิธีการใช้งาน : เพิ่มรูปภาพและเลือกรูปแบบการใช้งานต่างๆ
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
            onClick={() => {
              setImage(null);
              setValidationStatus({ 
                fileTypeValid: null,
                fileSizeValid: null,
                widthValid: null,
                heightValid: null,
                aspectRatioValid: null,
                color: "text.secondary",
                icon: null,
              });
            }}
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

      <Typography variant="body2" sx={{ mt: 2 }}>
        <div style={{ color: validationStatus.fileTypeValid === false ? "red" : "green" }}>
          Image format: JPEG or PNG
          {validationStatus.fileTypeValid === false ? (
            <CancelIcon style={{ color: "red", marginLeft: 5 }} />
          ) : (
            <CheckCircleIcon style={{ color: "green", marginLeft: 5 }} />
          )}
        </div>

        <div style={{ color: validationStatus.widthValid === false ? "red" : "green" }}>
          Image width: 800 to 2500 pixels
          {validationStatus.widthValid === false ? (
            <CancelIcon style={{ color: "red", marginLeft: 5 }} />
          ) : (
            <CheckCircleIcon style={{ color: "green", marginLeft: 5 }} />
          )}
        </div>

        <div style={{ color: validationStatus.heightValid === false ? "red" : "green" }}>
          Image height: 250 pixels or more
          {validationStatus.heightValid === false ? (
            <CancelIcon style={{ color: "red", marginLeft: 5 }} />
          ) : (
            <CheckCircleIcon style={{ color: "green", marginLeft: 5 }} />
          )}
        </div>

        <div style={{ color: validationStatus.aspectRatioValid === false ? "red" : "green" }}>
          Image aspect ratio (width / height): 1.45 or more
          {validationStatus.aspectRatioValid === false ? (
            <CancelIcon style={{ color: "red", marginLeft: 5 }} />
          ) : (
            <CheckCircleIcon style={{ color: "green", marginLeft: 5 }} />
          )}
        </div>

        <div style={{ color: validationStatus.fileSizeValid === false ? "red" : "green" }}>
          Max file size: 1 MB
          {validationStatus.fileSizeValid === false ? (
            <CancelIcon style={{ color: "red", marginLeft: 5 }} />
          ) : (
            <CheckCircleIcon style={{ color: "green", marginLeft: 5 }} />
          )}
        </div>
      </Typography>
      <Box mt={4} width="100%">
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        disabled={
          !(
            validationStatus.fileTypeValid &&
            validationStatus.fileSizeValid &&
            validationStatus.widthValid &&
            validationStatus.heightValid &&
            validationStatus.aspectRatioValid
          )
        }
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
      {selectedAreaTemplate.length > 0 && (
        <>
          <Box mt={3} width="100%">
            <Typography
              variant="h6"
              gutterBottom
              backgroundColor="primary.main"
              style={{ color: "#fff", padding: "10px" }}
            >
              Preview Richmenu
            </Typography>

            {/* Preview Box */}
            <Box
              sx={{
                position: "relative",
                width: imagePreview
                  ? imagePreview.includes("template1L") ||
                    imagePreview.includes("template2L") ||
                    imagePreview.includes("template3L") ||
                    imagePreview.includes("template4L") ||
                    imagePreview.includes("template5L") ||
                    imagePreview.includes("template6L") ||
                    imagePreview.includes("template7L") // Check if large template
                    ? 2500 * 0.25 // Scale down to 50% for large templates
                    : 2500 * 0.25 // Scale down to 50% for compact templates
                  : 0, // Adjust width based on selected template
                height: imagePreview
                  ? imagePreview.includes("template1L") ||
                    imagePreview.includes("template2L") ||
                    imagePreview.includes("template3L") ||
                    imagePreview.includes("template4L") ||
                    imagePreview.includes("template5L") ||
                    imagePreview.includes("template6L") ||
                    imagePreview.includes("template7L") // Check if large template
                    ? 1686 * 0.25 // Scale down to 50% for large templates
                    : 800 * 0.25 // Scale down to 50% for compact templates
                  : 0, // Adjust height based on selected template
                maxWidth: "100%",
                border: "2px dashed #ccc",
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "#f5f5f5",
              }}
            >
              {/* Display uploaded image */}
              {image && (
                <img
                  src={image}
                  alt="Uploaded Preview"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}

              {/* Display selected template overlay */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Template Preview"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.85, // 60% opacity
                  }}
                />
              )}
            </Box>
          </Box>
          <Typography mt={4}>Rich Menu Name</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={richMenuAlias}
            onChange={handleInputRichMenuName}
            inputProps={{ maxLength: 14 }}
            error={Boolean(richMenuAliasError)}
            helperText={richMenuAliasError}
          />

          <Typography mt={4}>Chat Bar Title</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={chatBarTitle}
            onChange={handleChatBarTitleChange}
            inputProps={{ maxLength: 14 }}
            error={Boolean(chatBarTitleError)}
            helperText={chatBarTitleError}
          />
          <Box>
            <Typography mt={4}>Action Bar</Typography>
          </Box>
          <Box component="form">
            {selectedAreaTemplate?.map((area, index) => (
              <ActionComponent
                handleAreaChange={handleAreaChange}
                key={index}
                index={index}
                imagePreview={imagePreview}
              />
            ))}

            {/* Note */}
            <Box mt={2} width="100%">
              <Typography variant="caption">*หมายเหตุ</Typography>
            </Box>

            {/* Send Button */}
            <Box mt={4} textAlign="right" width="100%">
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateRichMenu}
              disabled={!validateForm()}
            >
              Create
            </Button>
            </Box>
          </Box>
        </>
      )}
      <Notification
        openNotification={notification.open}
        setOpenNotification={setNotification}
        message={notification.message}
        statusMessage={notification.statusMessage}
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
                    onClick={() => handleSelectTemplate(lt)}
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
                    onClick={() => handleSelectTemplate(ct)}
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
