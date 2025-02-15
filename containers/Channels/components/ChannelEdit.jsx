"use client";

import Loading from "@/components/Loading";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  Snackbar,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBotInfo } from "./action";
import { useSearchParams } from "next/navigation";

export default function ChannelEdit() {
  const WEBHOOK_URL =
    "https://linefrontendframework.nontouchm.com:4000/webhook";
  //   const [channelId, setChannelId] = useState();
  //   const [channelSecret, setChannelSecret] = useState();
  //   const [channelAccessToken, setChannelAccessToken] = useState();
  //   const [description, setDescription] = useState();
  const [isError, setIsError] = useState(false);
  //   const [isActive, setIsActive] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channelId");

  const [channel, setChannel] = useState({});
  const [errorMessages, setErrorMessages] = useState([]);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [customWebhook, setCustomWebhook] = useState("");

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpenSnackbar(false);
  };
  const getChannelByID = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/Channel?id=${channelId}`);
      if (res.status === 200) {
        const { Channel } = res.data;
        console.log(Channel);
        setChannel(Channel);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Get channel by id failed:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const errors = [];

      if (!channel.channel_id?.trim()) errors.push("Channel ID is required.");
      if (!channel.name?.trim()) errors.push("Channel Name is required.");
      if (!channel.channel_secret?.trim())
        errors.push("Channel Secret is required.");
      if (!channel.channel_access_token?.trim())
        errors.push("Channel Access Token is required.");

      if (errors.length > 0) {
        setIsError(true);
        setErrorMessages(errors); // Store all errors
        return;
      }
      const { userId: destination } = await getBotInfo(
        channel.channel_access_token
      );
      if (!destination) {
        // setIsOpenSnackbar(true);
        setIsError(true);
        setErrorMessages(["Invalid access token"]);
        return;
      }

      const body = {
        id: channel._id,
        name: channel.name?.trim(),
        description: channel.description,
        webhook_url: WEBHOOK_URL,
        status: channel.status,
        channel_id: channel.channel_id?.trim(),
        channel_secret: channel.channel_secret?.trim(),
        channel_access_token: channel.channel_access_token?.trim(),
      };
      console.log(body);
      const res = await axios.put("/api/Channel/", body, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        router.push("/channels");
        console.log("Successful update channel!");
      }
    } catch (error) {
      console.error("Error create new channel failed:", error);
    }
  };

  useEffect(() => {
    getChannelByID();
  }, []);

  useEffect(() => {
    if (errorMessages.length > 0) {
      setIsOpenSnackbar(true);
    }
  }, [errorMessages]);

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
        {isLoading && <Loading />}
        {!isLoading && (
          <form autoComplete="off" onSubmit={handleSubmit}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
              <FormControl fullWidth>
                <InputLabel htmlFor="channel-id">Channel ID</InputLabel>

                <OutlinedInput
                  id="channel-id"
                  defaultValue={channel?.channel_id}
                  value={channel?.channel_id}
                  onChange={(e) =>
                    setChannel((prev) => ({
                      ...prev,
                      channel_id: e.target.value,
                    }))
                  }
                  label="Channel ID"
                  error={isError && !channel?.channel_id}
                />

                {isError && !channel?.channel_id && (
                  <FormHelperText error>Please enter channel id</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  onChange={(e) =>
                    setChannel((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  value={channel.name}
                  defaultValue={channel.name}
                  label="Channel Name"
                  fullWidth
                  error={isError && !channel.name}
                />

                {isError && !channel.name && (
                  <FormHelperText error>
                    Please enter channel name
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
            <Stack spacing={4} sx={{ mt: 4 }}>
              <FormControl fullWidth>
                <TextField
                  onChange={(e) =>
                    setChannel((prev) => ({
                      ...prev,
                      channel_secret: e.target.value,
                    }))
                  }
                  value={channel.channel_secret}
                  defaultValue={channel.channel_secret}
                  name="channel-secret"
                  label="Channel Secret"
                  fullWidth
                  error={isError && !channel.channel_secret}
                />

                {isError && !channel.channel_secret && (
                  <FormHelperText error>
                    Please enter channel secret
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                <TextField
                  onChange={(e) =>
                    setChannel((prev) => ({
                      ...prev,
                      channel_access_token: e.target.value,
                    }))
                  }
                  value={channel.channel_access_token}
                  defaultValue={channel.channel_access_token}
                  name="channel-access-token"
                  label="Channel Access Token"
                  fullWidth
                  error={isError && !channel.channel_access_token}
                />

                {isError && !channel.channel_access_token && (
                  <FormHelperText error>
                    Please enter channel access token
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth>
                <TextField
                  onChange={(e) =>
                    setChannel((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  value={channel.description}
                  defaultValue={channel.description}
                  name="description"
                  label="Description"
                  fullWidth
                />
              </FormControl>

              <TextField
                name="webhook-api"
                label="Webhook API"
                fullWidth
                defaultValue={WEBHOOK_URL}
                disabled
                onChange={(e) => setCustomWebhook(e.target.value)}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={channel?.status === "true"}
                    onChange={(e) => {
                      setChannel((prev) => ({
                        ...prev,
                        status: e.target.checked ? "true" : "false",
                      }));
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
        )}
      </Box>
      {errorMessages.map((error, index) => (
        <Snackbar
          key={index}
          open={isOpenSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity="error"
            sx={{ width: "100%", fontWeight: "bold" }}
          >
            {error}
          </Alert>
        </Snackbar>
      ))}
    </Container>
  );
}
