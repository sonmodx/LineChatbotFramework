import { TextField } from "@mui/material";
import { useState } from "react";

export default function SwitchInputComponent({
  index,
  messages,
  maximumMessage,
  handleMessageChange,
  dynamicContents,
  renderButtons,
}) {
  const [focusField, setFocusField] = useState("text");

  const messageFields = {
    text: ["text"],
    image: ["previewImageUrl", "originalContentUrl"],
    sticker: ["packageId", "stickerId"],
    video: ["originalContentUrl", "previewImageUrl", "trackingId"],
    audio: ["originalContentUrl", "duration"],
    location: ["title", "address", "latitude", "longitude"],
    flex: ["flex"],
    template: ["template"],
    imagemap: ["imagemap"],
  };

  const currentType = messages[index].type;
  const fields = messageFields[currentType] || [];

  return (
    <>
      {fields.map((field) => (
        <TextField
          key={field}
          fullWidth
          multiline
          rows={
            field === "flex" || field === "template" || field === "imagemap"
              ? 6
              : 1
          }
          style={{ marginTop: 16 }}
          placeholder={`Enter your ${field} (${index + 1}/${maximumMessage})`}
          variant="outlined"
          value={messages[index][field] || ""}
          onChange={(e) => handleMessageChange(index, e.target.value, field)}
          onFocus={() => setFocusField(field)}
          error={!messages[index][field]?.trim()} // Show error if field is empty
          helperText={
            !messages[index][field]?.trim() ? "This field is required" : ""
          }
        />
      ))}
      {dynamicContents.length > 0 &&
        renderButtons(dynamicContents, index, focusField)}
    </>
  );
}
