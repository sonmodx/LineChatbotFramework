"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import CustomTable from "../../components/CustomTable";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ActionCreate from "./ActionCreate";
import ActionEdit from "./ActionEdit";

export default function ChannelAction({ listTitle, channelId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [actions, setActions] = useState([]);
  const [total, setTotal] = useState();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const { data: session } = useSession(authOptions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [state, setState] = useState("actions");
  const [selectedActionId, setSelectedActionId] = useState();
  const [alertMessage, setAlertMessage] = useState("");
  const getAllActions = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/api/Action?channel_id=${channelId}&pageNumber=${
          page + 1
        }&pageSize=${rowsPerPage}&orderBy=createdAt&orderDirection=desc`
      );
      if (res.status === 200) {
        const data = res.data;
        setActions(data.Actions);
        setTotal(data.Total);
        console.log("Action data:", data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error when get action:", error);
    }
  };

  const handleDeleteAction = async (selectId) => {
    try {
      console.log(selectId);
      const res = await axios.delete(`/api/Action?id=${selectId._id}`);
      if (res.status === 200) {
        getAllActions();
        setAnchorEl(null);
        // console.log("Action deleted successfully.");
        setIsOpenSnackbar(true);
        setAlertMessage("Action deleted successfully.");
      }
    } catch (error) {
      console.error("Error delete Action failed:", error);
    }
  };

  const handleEditActions = (item) => {
    setSelectedActionId(item._id);
    setState("edit");
    setAlertMessage("Action edit successfully.");
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
          <CustomTable
            headerColumns={[
              "Action",
              "Action Type",
              "API",
              "Description",
              "Update date",
              "Create date",
              "Active",
              "",
            ]}
            bodyColumns={[
              "type_action",
              "api_name",
              "description",
              "updatedAt",
              "createdAt",
              "activeString",
            ]}
            canSetting={true}
            statusState={[]}
            callbackGetData={getAllActions}
            callbackEditData={handleEditActions}
            callbackDeleteData={handleDeleteAction}
            isLoading={isLoading}
            total={total}
            data={actions}
            headerCell={"name"}
            headerLink={""}
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            isOpenSnackbar={isOpenSnackbar}
            setIsOpenSnackbar={setIsOpenSnackbar}
            session={session}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            alertMessage={alertMessage}
          />
        </>
      )}

      {state === "create" && (
        <ActionCreate setIsCreateState={setState} state={state} />
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
