"use client";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";

import { useState } from "react";
import ChannelAPI from "../ChannelAPI";
import ChannelUser from "../ChannelUser";
import ChannelAction from "../ChannelAction";
import ChannelLog from "../ChannelLog";
import ChannelStatics from "../ChannelStatics";


function ManageShowTable({ tab, id, channelId }) {
  const listTitle = ["Action", "User", "API", "Log","Statics"];
  if (tab === 0) {
    return <ChannelAction listTitle={listTitle[tab]} channelId={id} />;
  } else if (tab === 1) {
    return (
      <ChannelUser
        listTitle={listTitle[tab]}
        channelId={id}
        channelIdLine={channelId}
      />
    );
  } else if (tab === 2) {
    return <ChannelAPI listTitle={listTitle[tab]} channelId={id} />;
  } else if (tab === 3) {
    return <ChannelLog listTitle={listTitle[tab]} channelId={id} />;
  }
  return <Box>Empty Component</Box>;
}

export default function ChannelDetail({ id, channelName, channelId }) {
  const [selectTab, setSelectTab] = useState(0);

  const listTab = [
    { id: 0, label: "action" },
    { id: 1, label: "user" },
    { id: 2, label: "api" },
    { id: 3, label: "log" },
    { id: 4, label: "Statics"},
  ];

  return (
    <>
      <Container>
        <Typography variant="h3" sx={{ py: 1, fontWeight: "bolder", mt: 5 }}>
          {channelName}
        </Typography>
        <Tabs
          value={selectTab}
          onChange={(_, value) => {
            setSelectTab(value);
            console.log(value);
          }}
        >
          {listTab?.map((tab) => (
            <Tab
              key={tab.id}
              label={tab.label}
              value={tab.id}
              sx={{
                color: selectTab === tab.id ? "primary.dark" : "#C5C5C5",
                fontSize: "1.2rem",
                fontWeight: "bold",
                borderLeft: tab.id === 0 ? "none" : "1px solid black",
                paddingInline: 6,
              }}
            />
          ))}
        </Tabs>
        <ManageShowTable tab={selectTab} id={id} channelId={channelId} />
      </Container>
    </>
  );
}
