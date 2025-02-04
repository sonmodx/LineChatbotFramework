"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import CustomTableForRichmenu from "../../components/CustomTableForRichmenu";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import RichmenuCreate from "./RichmenuCreate";
import { useSearchParams } from "next/navigation";

export default function ChannelAction({ listTitle, channelId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [actions, setActions] = useState([]);
  const [total, setTotal] = useState();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const [linkanchorEl, setlinkAnchorEl] = useState()
  const { data: session } = useSession(authOptions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [state, setState] = useState("actions");
  const [selectedActionId, setSelectedActionId] = useState();
  const searchParams = useSearchParams();
  const channel_Id = searchParams.get("channel_id");
  const getAllActions = async () => {
    try {
      setIsLoading(true);

      const res = await axios.get(
        `/api/richmenu?channel_id=${channelId}&pageNumber=${
          page + 1
        }&pageSize=${rowsPerPage}`
      );
      if (res.status === 200) {
        const data = res.data;
        setActions(data.Richmenu);
        setTotal(data.Total);
        console.log("Action data:", data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error when get action:", error);
    }
  };

  const handleLinkRichMenu = async (selectId) => {
    try {

      console.log("selectId",selectId)
      const body = {
        type: "setrichmenuforalluser",
        destination: channel_Id,
        richmenu_config: selectId,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/richmenu`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        getAllActions();
        setlinkAnchorEl(null);
        console.log("Richmenu Linked successfully.");
        setIsOpenSnackbar(true);
      }
    } catch (error) {
      console.error(
        "Error sending request to webhook:",
        error.response?.data || error.message
      );
    }
  };
  const handleEditRichMenu = async (selectId) => {
    try {
      const body = {
        type: "updaterichmenualias",
        destination: channel_Id,
        richmenu_config: selectId,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/richmenu`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        getAllActions();
        console.log("Richmenu Update successfully.");
        setIsOpenSnackbar(true);
      }
    } catch (error) {
      console.error(
        "Error sending request to webhook:",
        error.response?.data || error.message
      );
    }
  };

  const handleDeleteRichMenu = async (selectId) => {
    try {

      console.log("selectId",selectId)
      const body = {
        type: "deleterichmenu",
        destination: channel_Id,
        richmenu_config: selectId,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/richmenu`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        getAllActions();
        setAnchorEl(null);
        console.log("Richmenu deleted successfully.");
        setIsOpenSnackbar(true);
      }
    } catch (error) {
      console.error(
        "Error sending request to webhook:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <Container>
      {state === "actions" && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <Typography variant="h4" sx={{ py: 1, fontWeight: "bolder" }}>
              List {listTitle}
            </Typography>
            <Button
              variant="contained"
              size="medium"
              onClick={() => setState("create")}
            >
              Create
            </Button>
          </Box>
          <CustomTableForRichmenu
            headerColumns={[
              "Name",
              "Id",
              "Update date",
              "Create date",
              "Status",
              "",
            ]}
            bodyColumns={[
              "richmenuId",
              "updatedAt",
              "createdAt",
              "status"
            ]}
            canSetting={true}
            statusState={[]}
            callbackGetData={getAllActions}
            callbackLinkData={handleLinkRichMenu}
            callbackEditData={handleEditRichMenu}
            callbackDeleteData={handleDeleteRichMenu}
            isLoading={isLoading}
            total={total}
            data={actions}
            headerCell={"richmenuAlias"}
            headerLink={""}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}  
            linkanchorEl={linkanchorEl}
            setlinkAnchorEl={setlinkAnchorEl}
            isOpenSnackbar={isOpenSnackbar}
            setIsOpenSnackbar={setIsOpenSnackbar}
            session={session}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
          />
        </>
      )}

      {state === "create" && (
        <RichmenuCreate setIsCreateState={setState} state={state} />
      )}
      {state === "edit" && (
        <ActionEdit
          setIsEditState={setState}
          state={state}
          id={selectedActionId}
        />
      )}
    </Container>
  );
}
