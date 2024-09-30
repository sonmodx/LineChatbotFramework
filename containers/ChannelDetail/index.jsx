"use client";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import { useRef, useState } from "react";

export default function ChannelDetail({ id, channelName }) {
  const [selectTab, setSelectTab] = useState("0");

  const listTab = [
    { id: 0, label: "action" },
    { id: 1, label: "user" },
    { id: 2, label: "api" },
    { id: 3, label: "log" },
  ];

  return (
    <Container>
      <Typography variant="h3" sx={{ py: 1, fontWeight: "bolder", mt: 5 }}>
        {channelName}
      </Typography>
      <Tabs
        onChange={(event, value) => {
          setSelectTab(value);
        }}
      >
        {listTab?.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            value={tab.id}
            sx={{
              color: selectTab === tab.id ? "#3758F9" : "#C5C5C5",
              fontSize: "1.2rem",
              fontWeight: "bold",
              borderLeft: tab.id === 0 ? "none" : "1px solid black",
              paddingInline: 6,
            }}
          />
        ))}
      </Tabs>
    </Container>
  );
}
