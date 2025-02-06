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
  const [focusField, setFoucusField] = useState("text");
  return (
    <>
      {messages[index].type === "text" && (
        <>
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your message (${index + 1}/${maximumMessage})`}
            variant="outlined"
            value={messages[index].text}
            onChange={(e) => handleMessageChange(index, e.target.value, "text")}
            onFocus={() => setFoucusField("text")}
          />
          {dynamicContents.length > 0 &&
            renderButtons(dynamicContents, index, focusField)}
        </>
      )}
      {messages[index].type === "image" && (
        <>
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your previewImageUrl (${
              index + 1
            }/${maximumMessage})`}
            variant="outlined"
            value={messages[index].previewImageUrl}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "previewImageUrl")
            }
            onFocus={() => setFoucusField("previewImageUrl")}
          />

          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your originalContentUrl (${
              index + 1
            }/${maximumMessage})`}
            variant="outlined"
            value={messages[index].originalContentUrl}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "originalContentUrl")
            }
            onFocus={() => setFoucusField("originalContentUrl")}
          />
          {dynamicContents.length > 0 &&
            renderButtons(dynamicContents, index, focusField)}
        </>
      )}
      {messages[index].type === "sticker" && (
        <>
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your packageId (${
              index + 1
            }/${maximumMessage})`}
            variant="outlined"
            value={messages[index].packageId}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "packageId")
            }
            onFocus={() => setFoucusField("packageId")}
          />
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your stickerId (${
              index + 1
            }/${maximumMessage})`}
            variant="outlined"
            value={messages[index].stickerId}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "stickerId")
            }
            onFocus={() => setFoucusField("stickerId")}
          />
          {dynamicContents.length > 0 &&
            renderButtons(dynamicContents, index, focusField)}
        </>
      )}
      {messages[index].type === "video" && (
        <>
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your originalContentUrl (${
              index + 1
            }/${maximumMessage})`}
            variant="outlined"
            value={messages[index].originalContentUrl}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "originalContentUrl")
            }
            onFocus={() => setFoucusField("originalContentUrl")}
          />
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your previewImageUrl (${
              index + 1
            }/${maximumMessage})`}
            variant="outlined"
            value={messages[index].previewImageUrl}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "previewImageUrl")
            }
            onFocus={() => setFoucusField("previewImageUrl")}
          />
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your trackingId (${
              index + 1
            }/${maximumMessage})`}
            variant="outlined"
            value={messages[index].trackingId}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "trackingId")
            }
            onFocus={() => setFoucusField("trackingId")}
          />
          {dynamicContents.length > 0 &&
            renderButtons(dynamicContents, index, focusField)}
        </>
      )}
      {messages[index].type === "audio" && (
        <>
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your originalContentUrl (${
              index + 1
            }/${maximumMessage})`}
            variant="outlined"
            value={messages[index].originalContentUrl}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "originalContentUrl")
            }
            onFocus={() => setFoucusField("originalContentUrl")}
          />
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your duration (${index + 1}/${maximumMessage})`}
            variant="outlined"
            value={messages[index].duration}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "duration")
            }
            onFocus={() => setFoucusField("duration")}
          />
          {dynamicContents.length > 0 &&
            renderButtons(dynamicContents, index, focusField)}
        </>
      )}
      {messages[index].type === "location" && (
        <>
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your title (${index + 1}/${maximumMessage})`}
            variant="outlined"
            value={messages[index].title}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "title")
            }
            onFocus={() => setFoucusField("title")}
          />
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your address (${index + 1}/${maximumMessage})`}
            variant="outlined"
            value={messages[index].address}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "address")
            }
            onFocus={() => setFoucusField("address")}
          />
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your latitude (${index + 1}/${maximumMessage})`}
            variant="outlined"
            value={messages[index].latitude}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "latitude")
            }
            onFocus={() => setFoucusField("latitude")}
          />
          <TextField
            fullWidth
            multiline
            rows={1}
            style={{ marginTop: 16 }}
            placeholder={`Enter your longitude (${
              index + 1
            }/${maximumMessage})`}
            variant="outlined"
            value={messages[index].longitude}
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "longitude")
            }
            onFocus={() => setFoucusField("longitude")}
          />
          {dynamicContents.length > 0 &&
            renderButtons(dynamicContents, index, focusField)}
        </>
      )}
      {messages[index].type === "flex" && (
        <>
          <TextField
            fullWidth
            multiline
            rows={6}
            style={{ marginTop: 16 }}
            placeholder={`Enter your JSON (${index + 1}/${maximumMessage})`}
            variant="outlined"
            defaultValue={
              typeof messages[index].flex !== "string"
                ? JSON.stringify(messages[index], null, 2)
                : messages[index]
            }
            onChange={(e) => handleMessageChange(index, e.target.value, "flex")}
            onFocus={() => setFoucusField("flex")}
          />
          {dynamicContents.length > 0 &&
            renderButtons(dynamicContents, index, focusField)}
        </>
      )}
      {messages[index].type === "template" && (
        <>
          <TextField
            fullWidth
            multiline
            rows={6}
            style={{ marginTop: 16 }}
            placeholder={`Enter your JSON (${index + 1}/${maximumMessage})`}
            variant="outlined"
            defaultValue={
              typeof messages[index].template !== "string"
                ? JSON.stringify(messages[index], null, 2)
                : messages[index]
            }
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "template")
            }
            onFocus={() => setFoucusField("template")}
          />
          {dynamicContents.length > 0 &&
            renderButtons(dynamicContents, index, focusField)}
        </>
      )}
      {messages[index].type === "imagemap" && (
        <>
          <TextField
            fullWidth
            multiline
            rows={6}
            style={{ marginTop: 16 }}
            placeholder={`Enter your JSON (${index + 1}/${maximumMessage})`}
            variant="outlined"
            defaultValue={
              typeof messages[index].imagemap !== "string"
                ? JSON.stringify(messages[index], null, 2)
                : messages[index]
            }
            onChange={(e) =>
              handleMessageChange(index, e.target.value, "imagemap")
            }
            onFocus={() => setFoucusField("imagemap")}
          />
          {dynamicContents.length > 0 &&
            renderButtons(dynamicContents, index, focusField)}
        </>
      )}
    </>
  );
}
