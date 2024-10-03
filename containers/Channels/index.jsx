import { Box, Button, Container, Typography } from "@mui/material";
import ChannelTable from "./components/ChannelTable";

export default function Channels() {
  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h3" sx={{ py: 1, fontWeight: "bolder" }}>
          List Channel
        </Typography>
        <Button variant="contained" size="large">
          Create
        </Button>
      </Box>
      <ChannelTable />
    </Container>
  );
}
