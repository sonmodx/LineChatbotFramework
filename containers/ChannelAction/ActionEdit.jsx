"use client";
import { Stack } from "@mui/material";
import ListMenu from "./ListMenu";
import Replyaction from "@/components/Replyaction";
import { useEffect, useState } from "react";
import PushMessage from "@/components/Pushaction";
import MulticastMessage from "@/components/Multicastaction";
import BroadcastMessage from "@/components/Boardcastaction";
import Greetingaction from "@/components/Greetingaction";
import FlexMessage from "@/components/Flexaction";
import NarrowMessage from "@/components/Narrowaction";
import RichMenuAction from "@/components/RichMenuAction";
import axios from "axios";
import DefaultAction from "@/components/DefaultAction";

export default function ActionEdit({ setIsEditState, state, id }) {
  console.log("ACTION ID", id);
  const [data, setData] = useState();
  console.log("data", data);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/Action?id=${id}`);
        if (res.status === 200) {
          setData(res.data.Action);
        }
      } catch (error) {
        console.error("Error get action by id failed:", error);
      }
    };
    getData();
  }, []);

  const ManageActionUI = ({ typeAction }) => {
    console.log("actojn type", typeAction);
    switch (typeAction) {
      case "greeting":
        return (
          <Greetingaction data={data} setState={setIsEditState} state={state} />
        );
      case "reply":
        return (
          <Replyaction data={data} setState={setIsEditState} state={state} />
        );
      case "default":
        return (
          <DefaultAction data={data} setState={setIsEditState} state={state} />
        );
    }
  };

  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        width: "100%",
      }}
    >
      <ManageActionUI typeAction={data?.type_action} />
    </Stack>
  );
}
