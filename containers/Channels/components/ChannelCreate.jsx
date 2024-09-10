"use client";

import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ChannelCreate() {
  const [channelId, setChannelId] = useState();
  const [channelName, setChannelName] = useState();
  const [channelSecret, setChannelSecret] = useState();
  const [channelAccessToken, setChannelAccessToken] = useState();
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!(channelId && channelName && channelSecret && channelAccessToken)) {
        setIsError(true);
        return;
      }
      const body = {
        name: channelName,
        description: "Create new channel", //No field description
        webhook_url: "https://mywebhook.com/webhook",
        status: true, //No field status
        channel_id: channelId,
        channel_secret: channelSecret,
        channel_access_token: channelAccessToken,
      };
      const res = await axios.post("/api/Channel/", body, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 201) {
        router.push("/channels");
        console.log("Successful created new channel!");
      }
    } catch (error) {
      console.error("Error can not create new channel:", error);
    }
  };
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
                error={isError && !channelId}
              />
              {isError && !channelId && (
                <FormHelperText error>Please enter channel ID</FormHelperText>
              )}
            </FormControl>
            <FormControl fullWidth>
              <TextField
                onChange={(e) => setChannelName(e.target.value)}
                value={channelName}
                label="Channel Name"
                fullWidth
                error={isError && !channelName}
              />
              {isError && !channelName && (
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
                error={isError && !channelSecret}
              />
              {isError && !channelSecret && (
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
                error={isError && !channelAccessToken}
              />
              {isError && !channelAccessToken && (
                <FormHelperText error>
                  Please enter channel access token
                </FormHelperText>
              )}
            </FormControl>
            <TextField
              name="webhook-api"
              label="Webhook API"
              fullWidth
              disabled
              defaultValue="https://mywebhook.com/webhook"
            />
          </Stack>
          <Stack direction="row" sx={{ mt: 4, justifyContent: "flex-end" }}>
            <Button variant="contained" sx={{ width: 125 }} type="submit">
              SAVE
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}
