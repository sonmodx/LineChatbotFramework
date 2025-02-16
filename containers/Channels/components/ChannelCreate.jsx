"use client";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { getBotInfo, isDestinationExists, setWebhookURL } from "./action";
import { CheckOutlined, ContentCopyOutlined } from "@mui/icons-material";

const WEBHOOK_URL = "https://linefrontendframework.nontouchm.com:4000/webhook";

export default function ChannelCreate() {
  const [channelId, setChannelId] = useState();
  const [channelName, setChannelName] = useState();
  const [channelSecret, setChannelSecret] = useState();
  const [channelAccessToken, setChannelAccessToken] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [description, setDescription] = useState();
  const [isError, setIsError] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [customWebhook, setCustomWebhook] = useState("");
  const [copyWebhook, setCopyWebhook] = useState(false);
  const router = useRouter();
  const webhookRef = useRef();

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpenSnackbar(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !(
          channelId?.trim() &&
          channelName?.trim() &&
          channelSecret?.trim() &&
          channelAccessToken?.trim()
        )
      ) {
        setIsError(true);
        return;
      }

      //validate channel and get bot's userId
      const { userId: destination } = await getBotInfo(channelAccessToken);

      if (!destination) {
        setIsOpenSnackbar(true);
        setIsError(true);
        setErrorMessage("Invalid access token");
        return;
      }
      //validate channel never be created
      const existDest = await isDestinationExists(destination);
      if (existDest) {
        setIsOpenSnackbar(true);
        setIsError(true);
        setErrorMessage("This bot already be created");
        return;
      }

      //webhook url must be valid, currently for example
      const resultWebhook = await setWebhookURL(
        channelAccessToken,
        WEBHOOK_URL
      );
      // if return {message: ""}
      if (Object.keys(resultWebhook).length !== 0) {
        setIsOpenSnackbar(true);
        setIsError(true);
        setErrorMessage("Failed, Please verify your webhook url is correctly");
        return;
      }

      const body = {
        name: channelName?.trim(),
        description: description, //No field description
        webhook_url: WEBHOOK_URL,
        status: isActive, //No field status
        channel_id: channelId?.trim(),
        channel_secret: channelSecret?.trim(),
        channel_access_token: channelAccessToken?.trim(),
        destination: destination,
      };
      console.log(body);
      const res = await axios.post("/api/Channel/", body, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 201) {
        router.push("/channels");
        console.log("Successful created new channel!");
      }
    } catch (error) {
      console.error("Error create new channel failed:", error);
    }
  };

  // const getBotInfo = async (token) => {
  //   try {
  //     const res = await fetch(`${LINE_API}/info`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,

  //         "Content-Type": "application/json",
  //       },
  //     });
  //     console.log("GET BOT INFO", res);
  //     return res;
  //   } catch (err) {
  //     throw new Error(err);
  //   }
  // };
  return (
    <Container
      sx={{
        display: "flex",
        minHeight: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{ p: 12, bgcolor: "#f8f8f8", borderRadius: "1rem", width: "100%" }}
      >
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
            <FormControl fullWidth>
              <TextField
                onChange={(e) => setChannelId(e.target.value)}
                value={channelId}
                label="Channel ID"
                error={isError && !channelId.trim()}
              />
              {isError && !channelId.trim() && (
                <FormHelperText error>Please enter channel ID</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <TextField
                onChange={(e) => setChannelName(e.target.value)}
                value={channelName}
                label="Channel Name"
                fullWidth
                error={isError && !channelName.trim()}
              />
              {isError && !channelName.trim() && (
                <FormHelperText error>Please enter channel name</FormHelperText>
              )}
            </FormControl>
          </Stack>
          <Stack spacing={4} sx={{ mt: 4 }}>
            <FormControl fullWidth>
              <TextField
                onChange={(e) => setChannelSecret(e.target.value)}
                value={channelSecret}
                name="channel-secret"
                label="Channel Secret"
                fullWidth
                error={isError && !channelSecret.trim()}
              />
              {isError && !channelSecret.trim() && (
                <FormHelperText error>
                  Please enter channel secret
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <TextField
                onChange={(e) => setChannelAccessToken(e.target.value)}
                value={channelAccessToken}
                name="channel-access-token"
                label="Channel Access Token"
                fullWidth
                error={isError && !channelAccessToken.trim()}
              />
              {isError && !channelAccessToken.trim() && (
                <FormHelperText error>
                  Please enter channel access token
                </FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <TextField
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                name="description"
                label="Description"
                fullWidth
              />
            </FormControl>
            <Box display="flex" alignItems="center">
              <TextField
                name="webhook-api"
                label="Webhook API"
                fullWidth
                defaultValue={WEBHOOK_URL}
                disabled
                onChange={(e) => {
                  setCustomWebhook(e.target.value);
                }}
                inputRef={webhookRef}
                sx={{
                  flexGrow: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderRight: "none", // Remove the right border
                      borderTopRightRadius: "0",
                      borderBottomRightRadius: "0",
                    },
                  },
                }}
              />
              <Paper
                sx={{
                  p: 1.125,
                  border: "1px solid #ccc",
                  borderTopLeftRadius: "0",
                  borderBottomLeftRadius: "0",
                  backgroundColor: "transparent",
                  borderLeft: "none",
                  boxShadow: "none",
                }}
              >
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    onClick={async () => {
                      if (
                        typeof window !== "undefined" &&
                        navigator.clipboard
                      ) {
                        await navigator.clipboard.writeText(WEBHOOK_URL);
                      } else {
                        console.error("Clipboard API is not available.");
                      }

                      webhookRef.current.select();
                      setCopyWebhook(true);
                      setTimeout(() => {
                        setCopyWebhook(false);
                      }, 2000);
                    }}
                  >
                    {!copyWebhook ? (
                      <ContentCopyOutlined
                        sx={{ height: "20px", color: "primary.main" }}
                      />
                    ) : (
                      <CheckOutlined
                        sx={{ height: "20px", color: "primary.main" }}
                      />
                    )}
                  </IconButton>
                </Tooltip>
              </Paper>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked
                  value
                  checked={isActive}
                  onChange={(e) => {
                    setIsActive(e.target.checked);
                  }}
                />
              }
              label="Status"
            />
          </Stack>
          <Stack direction="row" sx={{ mt: 4, justifyContent: "flex-end" }}>
            <Button variant="contained" sx={{ width: 125 }} type="submit">
              SAVE
            </Button>
          </Stack>
        </form>
      </Box>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%", fontWeight: "bold" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
