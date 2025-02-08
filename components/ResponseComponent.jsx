"use client"; // Marking this component as client-side

import { Box, TextField, Typography } from "@mui/material";

const ResponseComponent = ({ response }) => {
  console.log(JSON.stringify(response.data, null, 2));
  return (
    <Box
      sx={{
        padding: 1,
        border: "1px solid #ccc",
        borderRadius: "4px",
        marginTop: 2,
        height: 400,
        overflow: "auto scroll",
      }}
    >
      <Typography variant="h6">Response Data</Typography>
      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
        {JSON.stringify(response.data, null, 2)}
      </Typography>
    </Box>
  );
};

export default ResponseComponent;
