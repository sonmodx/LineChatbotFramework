import { Box, Button, Container, Grid2, Stack, TextField } from "@mui/material";
import { red } from "@mui/material/colors";

export default function ChannelCreate() {
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
        <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
          <TextField name="channel-id" label="Channel ID" fullWidth />
          <TextField name="channel-name" label="Channel Name" fullWidth />
        </Stack>
        <Stack spacing={4} sx={{ mt: 4 }}>
          <TextField name="channel-secret" label="Channel Secret" fullWidth />
          <TextField
            name="channel-access-token"
            label="Channel Access Token"
            fullWidth
          />
          <TextField
            name="webhook-api"
            label="Webhook API"
            fullWidth
            disabled
            defaultValue="https://mywebhook.com/webhook"
          />
        </Stack>
        <Stack direction="row" sx={{ mt: 4, justifyContent: "flex-end" }}>
          <Button variant="contained" sx={{ width: 125 }}>
            SAVE
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
