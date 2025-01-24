import { CircularProgress, Container, Typography } from "@mui/material";

export default function Loading({ title = null }) {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column", // Stack items vertically
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
      <Typography variant="caption" sx={{ mt: 2 }}>
        Loading{`${title ? " " + title : ""}`}, please wait...
      </Typography>
    </Container>
  );
}
