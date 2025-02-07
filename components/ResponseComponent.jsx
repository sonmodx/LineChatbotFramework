"use client"; // Marking this component as client-side

import { Box, Typography } from "@mui/material";

const ResponseComponent = ({ response }) => {
  return (
<Box sx={{ padding: 1, border: '1px solid #ccc', borderRadius: '4px',marginTop:2 }}>
  <Typography variant="h6">
    Response Data
  </Typography>
  <Typography variant="body1">
    {typeof response?.data === "object"
      ? JSON.stringify(response.data, null, 2)
      : response?.data}
  </Typography>
</Box>

  );
};

export default ResponseComponent;