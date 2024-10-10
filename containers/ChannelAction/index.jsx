"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import CustomTable from "../../components/CustomTable";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ActionCreate from "./ActionCreate";

export default function ChannelAction({ listTitle, channelId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [actions, setActions] = useState([]);
  const [total, setTotal] = useState();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const { data: session } = useSession(authOptions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isCreateState, setIsCreateState] = useState(false);
  const getAllActions = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/api/Action?channel_id=${channelId}&pageNumber=${
          page + 1
        }&pageSize=${rowsPerPage}`
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

  const handleDeleteApi = async (selectId) => {
    try {
      console.log(selectId);
      const res = await axios.delete(`/api/Action?id=${selectId}`);
      if (res.status === 200) {
        getAllActions();
        setAnchorEl(null);
        console.log("Action deleted successfully.");
        setIsOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error delete Action failed:", error);
    }
  };

  const handleEditApi = (id) => {
    router.push(``);
  };

  return (
    <Container>
      {!isCreateState && (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 5,
              px: 2,
            }}
          >
            <Typography variant="h4" sx={{ py: 1, fontWeight: "bolder" }}>
              List {listTitle}
            </Typography>
            <Button
              variant="contained"
              size="medium"
              onClick={() => setIsCreateState(true)}
            >
              Create
            </Button>
          </Box>
          <CustomTable
            headerColumns={[
              "Action",
              "API",
              "Description",
              "Update date",
              "Create date",
              "",
            ]}
            bodyColumns={["api_id", "description", "updatedAt", "createdAt"]}
            canSetting={true}
            statusState={[]}
            callbackGetData={getAllActions}
            // callbackEditData={handleEditApi}
            callbackDeleteData={handleDeleteApi}
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
          />
        </>
      )}

      {isCreateState && <ActionCreate setIsCreateState={setIsCreateState} />}
    </Container>
  );
}
