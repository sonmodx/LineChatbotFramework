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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getBotInfo } from "./action";

const WEBHOOK_URL = "http://161.246.127.103:4000/webhook";

export default function ChannelEdit() {
  //   const [channelId, setChannelId] = useState();
  //   const [channelSecret, setChannelSecret] = useState();
  //   const [channelAccessToken, setChannelAccessToken] = useState();
  //   const [description, setDescription] = useState();
  const [isError, setIsError] = useState(false);
  //   const [isActive, setIsActive] = useState(true);
  const router = useRouter();
  const [channel, setChannel] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);

  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [customWebhook, setCustomWebhook] = useState("");

  const channelIdParams = searchParams.get("channelId");
  console.log(channel);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpenSnackbar(false);
  };
  const getChannelByID = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/Channel?id=${channelIdParams}`);
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
      if (
        !(
          channel._id &&
          channel.name &&
          channel.channel_secret &&
          channel.channel_access_token
        )
      ) {
        setIsError(true);
        return;
      }
      const { userId: destination } = await getBotInfo(
        channel.channel_access_token
      );
      if (!destination) {
        setIsOpenSnackbar(true);
        setIsError(true);
        setErrorMessage("Invalid access token");
        return;
      }

      const body = {
        id: channel._id,
        name: channel.name,
        description: channel.description,
        webhook_url: WEBHOOK_URL,
        status: channel.status,
        channel_id: channel.channel_id,
        channel_secret: channel.channel_secret,
        channel_access_token: channel.channel_access_token,
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
                {channel?.channel_id && (
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
                )}
                {isError && !channel?.channel_id && (
                  <FormHelperText error>Please enter channel id</FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                {channel.name && (
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
                )}

                {isError && !channel.name && (
                  <FormHelperText error>
                    Please enter channel name
                  </FormHelperText>
                )}
              </FormControl>
            </Stack>
            <Stack spacing={4} sx={{ mt: 4 }}>
              <FormControl fullWidth>
                {channel.channel_secret && (
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
                )}

                {isError && !channel.channel_secret && (
                  <FormHelperText error>
                    Please enter channel secret
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl fullWidth>
                {channel.channel_access_token && (
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
                )}

                {isError && !channel.channel_access_token && (
                  <FormHelperText error>
                    Please enter channel access token
                  </FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth>
                {channel.description && (
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
                )}
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
                    checked={channel?.status === "true" ? true : false}
                    onChange={(e) => {
                      setChannel((prev) => ({
                        ...prev,
                        status: e.target.checked,
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
