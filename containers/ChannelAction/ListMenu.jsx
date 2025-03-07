import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { ListSubheader } from "@mui/material";
import { checkExistDefaultAction } from "@/actions";
import { useSearchParams } from "next/navigation";
import Loading from "@/components/Loading";

const listAction = [
  "Greeting message",
  "Reply message",
  "Push Message",
  "Multicast Message",
  "Narrow Message",
  "Broadcast Message",
  "Default Message",
];

export default function ListMenu({ selectedIndex, setSelectedIndex }) {
  const searchParams = useSearchParams();
  const channelObjectId = searchParams.get("id");

  const [disabledDefaultMessage, setDisabledDefaultMessage] =
    React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkDefaultAction = async () => {
      setLoading(true);
      try {
        const result = await checkExistDefaultAction(channelObjectId);
        setDisabledDefaultMessage(result);
      } catch (error) {
        console.error("Error checking default action:", error);
      }
      setLoading(false);
    };

    checkDefaultAction();
  }, []);

  if (loading) return <Loading title="list menu" />;
  return (
    <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <List component="nav" aria-label="secondary mailbox folder">
        <ListSubheader>List Action</ListSubheader>

        {listAction?.map((action, index) => (
          <ListItemButton
            key={index}
            selected={selectedIndex === index}
            onClick={() => setSelectedIndex(index)}
            disabled={disabledDefaultMessage && index === listAction.length - 1}
          >
            <ListItemText primary={action} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
