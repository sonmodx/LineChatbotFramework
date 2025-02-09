import React, { act, useEffect, useState } from "react";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { getAllRichMenus } from "@/actions";

const ActionComponent = ({ handleAreaChange, index, imagePreview }) => {
  const [action, setAction] = useState("Text");
  const [text, setText] = useState("");
  const [label, setLabel] = useState("");
  const [uri, setUri] = useState("");
  const [richMenuAliasId, setRichMenuAliasId] = useState(null);
  const [richMenuList, setRichMenuList] = useState([]);
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");
  const actions = ["Text", "Link", "Switch rich menu"];

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleUriChange = (event) => {
    setUri(event.target.value);
  };

  const handleLabelChange = (event) => {
    setLabel(event.target.value);
  };

  const objectValue = (type) => {
    if (type === "Text") {
      return {
        type: "message",
        text: text,
      };
    } else if (type === "Link") {
      return {
        type: "uri",
        label: label,
        uri: uri,
      };
    } else if (type === "Switch rich menu") {
      return richMenuAliasId ? {
        type: "richmenuswitch",
        richMenuAliasId: richMenuAliasId.richmenuAlias,
        data: "Hello",
      } : {};
    }
    return {};
  };

  useEffect(() => {
    handleAreaChange(index, "action", objectValue(action));
  }, [action, text, label, uri, richMenuAliasId]);

  useEffect(() => {
    setAction("Text");
    setText("");
    setUri("");
    setLabel("");
    setRichMenuList([]);
    setRichMenuAliasId(null);
  }, [imagePreview]);

  const handleGetAllRichMenuAlias = async () => {
    const _richmenu = await getAllRichMenus(channelObjectId);

    console.log(_richmenu);
    setRichMenuList(JSON.parse(_richmenu));
  };

  return (
    <Box sx={{ p: "20px" }}>
      <Typography
        gutterBottom
        sx={{
          borderBottomWidth: "1px",
          paddingBottom: "8px",
          marginBottom: "16px",
        }}
      >
        Action {index + 1}
      </Typography>

      <Box sx={{ mb: "15px" }}>
        <Autocomplete
          options={actions}
          value={action}
          onChange={(event, newValue) => {
            setAction(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Message Action" variant="outlined" />
          )}
        />
      </Box>
      {action === "Text" && (
        <Box>
          <TextField
            label="Text"
            variant="outlined"
            value={text}
            onChange={handleTextChange}
            fullWidth
            required
          />
        </Box>
      )}
      {action === "Switch rich menu" && (
        <Box>
          <Autocomplete
            options={richMenuList}
            getOptionLabel={(option) => option.richmenuAlias || ""}
            value={richMenuAliasId}
            onChange={(event, newValue) => setRichMenuAliasId(newValue)}
            onSelect={() => handleGetAllRichMenuAlias()}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Switch rich menu"
                variant="outlined"
                fullWidth
              />
            )}
          />
        </Box>
      )}
      {action === "Link" && (
        <Box>
          <TextField
            label="Enter URL"
            variant="outlined"
            value={uri}
            onChange={handleUriChange}
            fullWidth
            required
          />
          <TextField
            sx={{ mt: 3 }}
            label="Action Label"
            placeholder="Link label (Examples: Open link, Home page, etc.)"
            variant="outlined"
            value={label}
            onChange={handleLabelChange}
            fullWidth
            required
          />
        </Box>
      )}
    </Box>
  );
};

export default ActionComponent;