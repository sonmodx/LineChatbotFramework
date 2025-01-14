import { Stack } from "@mui/material";
import ListMenu from "./ListMenu";
import Replyaction from "@/components/Replyaction";
import { useState } from "react";
import PushMessage from "@/components/Pushaction";
import MulticastMessage from "@/components/Multicastaction";
import BroadcastMessage from "@/components/Boardcastaction";
import Greetingaction from "@/components/Greetingaction";
import FlexMessage from "@/components/Flexaction";
import NarrowMessage from "@/components/Narrowaction";
import RichMenuAction from "@/components/RichMenuAction";
import DefaultAction from "@/components/DefaultAction";

export default function ActionCreate({ setIsCreateState, state }) {
  const manageActionUI = (index) => {
    switch (index) {
      case 0:
        return (
          <Greetingaction
            setState={setIsCreateState}
            state={state}
            data={null}
          />
        );
      case 1:
        return (
          <Replyaction setState={setIsCreateState} state={state} data={null} />
        );
      case 2:
        return <PushMessage />;
      case 3:
        return <MulticastMessage />;
      case 4:
        return <NarrowMessage />;
      case 5:
        return <BroadcastMessage />;
      case 6:
        return <RichMenuAction />;
      case 7:
        return (
          <DefaultAction
            setState={setIsCreateState}
            state={state}
            data={null}
          />
        );
    }
  };
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
      <ListMenu
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
      />
      {manageActionUI(selectedIndex)}
    </Stack>
  );
}
