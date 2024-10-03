"use client";
import { Box, Container, Typography } from "@mui/material";
import CustomTable from "../../components/CustomTable";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default function ChannelUser({ listTitle, channelId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const { data: session } = useSession(authOptions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const getAllApis = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/api/User?channel_id=${channelId}&pageNumber=${
          page + 1
        }&pageSize=${rowsPerPage}`
      );
      if (res.status === 200) {
        const data = res.data;
        setUsers(data.user);
        setTotal(data.Total);
        console.log("Line user data:", data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error when get line user:", error);
    }
  };

  return (
    <Container>
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
      </Box>
      <CustomTable
        headerColumns={["User", "Role", "Description", "Group"]}
        bodyColumns={["method_type", "description", "updatedAt"]}
        canSetting={false}
        statusState={[]}
        callbackGetData={getAllApis}
        callbackEditData={null}
        callbackDeleteData={null}
        isLoading={isLoading}
        total={total}
        data={users}
        headerCell={""}
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
    </Container>
  );
}
