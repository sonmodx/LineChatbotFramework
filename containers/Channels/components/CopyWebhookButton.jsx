import React, { useState } from "react";
import { CheckOutlined, ContentCopyOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const CopyWebhookButton = ({ webhook }) => {
  const [copyWebhook, setCopyWebhook] = useState(false);
  return (
    <IconButton
      onClick={async () => {
        await navigator.clipboard.writeText(webhook);
        // const read = await navigator.clipboard.readText();
        console.log(navigator.clipboard);
        setCopyWebhook(true);
        setTimeout(() => {
          setCopyWebhook(false);
        }, 2000);
      }}
    >
      {!copyWebhook ? (
        <ContentCopyOutlined sx={{ height: "20px", color: "primary.main" }} />
      ) : (
        <CheckOutlined sx={{ height: "20px", color: "primary.main" }} />
      )}
    </IconButton>
  );
};

export default CopyWebhookButton;
