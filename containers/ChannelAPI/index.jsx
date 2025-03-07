"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import CustomTable from "../../components/CustomTable";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default function ChannelAPI({ listTitle, channelId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [apis, setApis] = useState([]);
  const [total, setTotal] = useState();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const { data: session } = useSession(authOptions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [alertMessage, setAlertMessage] = useState("");

  const getAllApis = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/api/uAPI?channel_id=${channelId}&pageNumber=${
          page + 1
        }&pageSize=${rowsPerPage}&orderBy=createdAt&orderDirection=desc`
      );
      console.log("GET ALL API", res);
      if (res.status === 200) {
        const data = res.data;
        setApis(data.API);
        setTotal(data.Total);
        console.log("APIs data:", data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error when get apis:", error);
    }
  };

  const handleDeleteApi = async (selectId) => {
    try {
      console.log(selectId);
      const res = await axios.delete(`/api/uAPI?id=${selectId._id}`);
      if (res.status === 200) {
        getAllApis();
        setAnchorEl(null);
        console.log("API deleted successfully.");
        setIsOpenSnackbar(true);
        setAlertMessage("API deleted successfully.");
      }
    } catch (error) {
      console.error("Error delete API failed:", error);
    }
  };

  const handleEditApi = (item) => {
    router.push(`/apiPage/edit?id=${item._id}`);
  };

  return (
    <Container>
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
          onClick={() => router.push(`/apiPage/create?channel_id=${channelId}`)}
        >
          Create
        </Button>
      </Box>
      <CustomTable
        headerColumns={["Reply", "Type", "Update date", "Create date", ""]}
        bodyColumns={["method_type", "updatedAt", "createdAt"]}
        canSetting={true}
        statusState={[]}
        callbackGetData={getAllApis}
        callbackEditData={handleEditApi}
        callbackDeleteData={handleDeleteApi}
        isLoading={isLoading}
        total={total}
        data={apis}
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
    </Container>
  );
}
