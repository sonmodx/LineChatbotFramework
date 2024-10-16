import { Stack } from "@mui/material";
import ListMenu from "./ListMenu";
import Replyaction from "@/components/Replyaction";
import { useState } from "react";
import PushMessage from "@/components/Pushaction";
import MulticastMessage from "@/components/Multicastaction";
import BroadcastMessage from "@/components/Boardcastaction";
import Greetingaction from "@/components/Greetingaction";

export default function ActionCreate({ setIsCreateState }) {
  const manageActionUI = (index) => {
    switch (index) {
      case 0:
        return <Greetingaction />;
      case 1:
        return <Replyaction setIsCreateState={setIsCreateState} />;
      case 2:
        return;
      case 3:
        return <PushMessage />;
      case 4:
        return <MulticastMessage />;
      case 5:
        return <BroadcastMessage />;
      case 6:
        return;
    }
  };
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <Stack 
      direction="row" 
      spacing={1} 
      sx={{ width: '100%' }} 
    >
      <ListMenu
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      {manageActionUI(selectedIndex)}
    </Stack>
  );
}
