"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import CustomTable from "../../components/CustomTable";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default function ChannelLog({ listTitle, channelId }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const { data: session } = useSession(authOptions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const getAllLogs = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/api/log?channel_id=${channelId}&pageNumber=${
          page + 1
        }&pageSize=${rowsPerPage}`
      );
      if (res.status === 200) {
        const data = res.data;
        setLogs(data.log);
        setTotal(data.Total);
        console.log("Logs data:", data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error when get logs:", error);
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
        headerColumns={[
          "Direction",
          "Chatbot Name",
          "Line User",
          "Content",
          "Update date",
          "Create date",
        ]}
        bodyColumns={[
          "chatbot_name",
          "line_user_name",
          "content",
          "updatedAt",
          "createdAt",
        ]}
        canSetting={false}
        statusState={[]}
        callbackGetData={getAllLogs}
        callbackEditData={null}
        callbackDeleteData={null}
        isLoading={isLoading}
        total={total}
        data={logs}
        headerCell={"direction"}
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
