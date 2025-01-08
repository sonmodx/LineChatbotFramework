"use client";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";

import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { ListSubheader } from "@mui/material";
import ListUser from "./components/ListUser";
import ListAudience from "./components/ListAudience";

const ManageActionUI = ({ index, listTitle, channelId, channelIdLine }) => {
  switch (index) {
    case 0:
      return <ListUser listTitle={listTitle} channelId={channelId} />;
    case 1:
      return (
        <ListAudience channelId={channelId} channelIdLine={channelIdLine} />
      );
  }
};

export default function ChannelUser({ listTitle, channelId, channelIdLine }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listAction = ["List user", "List audience"];

  return (
    <Container>
      <Stack
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 1, // Replace `spacing` from Stack
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
        >
          <List
            component="nav"
            aria-label="secondary mailbox folder"
            sx={{ mt: 5 }}
          >
            <ListSubheader>Manage Users</ListSubheader>

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
        <ManageActionUI
          index={selectedIndex}
          listTitle={listTitle}
          channelId={channelId}
          channelIdLine={channelIdLine}
        />
      </Stack>
    </Container>
  );
}
