"use client";
import { Box, Container, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CustomTable from "@/components/CustomTable";
export default function ListUser({ listTitle, channelId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const { data: session } = useSession(authOptions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const getAllUsers = async () => {
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
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 5,
          //   px: 2,
        }}
      >
        <Typography variant="h4" sx={{ py: 1, fontWeight: "bolder" }}>
          List {listTitle}
        </Typography>
      </Box>
      <CustomTable
        headerColumns={["User", "Audiences"]}
        bodyColumns={["audience"]}
        canSetting={false}
        statusState={[]}
        callbackGetData={getAllUsers}
        callbackEditData={null}
        callbackDeleteData={null}
        isLoading={isLoading}
        total={total}
        data={users}
        headerCell={"display_name"}
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
    </Box>
  );
}
