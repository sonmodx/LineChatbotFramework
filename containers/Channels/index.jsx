"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import ChannelTable from "./components/ChannelTable";
import { useRouter } from "next/navigation";

export default function Channels() {
  const router = useRouter();

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <Typography variant="h3" sx={{ py: 1, fontWeight: "bolder" }}>
          List Channel
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/channels/create")}
        >
          Create
        </Button>
      </Box>
      <ChannelTable />
    </Container>
  );
}
