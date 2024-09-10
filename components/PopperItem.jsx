import { Box, Paper } from "@mui/material";

export default function PopperItem({ children }) {
  return (
    <Box
      component={Paper}
      sx={{
        bgcolor: "white",
        borderRadius: "8px",

        p: 1,
        mb: 1,
      }}
    >
      {children}
    </Box>
  );
}
