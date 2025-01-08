import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { ListSubheader } from "@mui/material";

const listAction = [
  "Greeting message",
  "Reply message",
  "Flex message",
  "Push Message",
  "Multicast Message",
  "Narrow Message",
  "Broadcast Message",
  "Rich menu",
  "Default Message",
];

export default function ListMenu({ selectedIndex, setSelectedIndex }) {
  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <List component="nav" aria-label="secondary mailbox folder">
        <ListSubheader>List Action</ListSubheader>

        {listAction?.map((action, index) => (
          <ListItemButton
            key={index}
            selected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
          >
            <ListItemText primary={action} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
