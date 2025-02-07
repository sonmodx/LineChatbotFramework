"use client";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import CustomTable from "../../components/CustomTable";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default function Channels() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [channels, setChannels] = useState([]);
  const [total, setTotal] = useState();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const { data: session } = useSession(authOptions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const getAllChannels = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/api/Channel?user_id=${session?.user?._id}&pageNumber=${
          page + 1
        }&pageSize=${rowsPerPage}`
      );
      if (res.status === 200) {
        const data = res.data;
        setChannels(data.Channel);
        setTotal(data.Total);
        console.log("Channel data:", data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error when get channels:", error);
    }
  };

  const handleDeleteChannel = async (selectId) => {
    try {
      console.log(selectId);
      const res = await axios.delete(`/api/Channel?id=${selectId._id}`);
      if (res.status === 200) {
        getAllChannels();
        setAnchorEl(null);
        console.log("Channel deleted successfully.");
        setIsOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error delete channel failed:", error);
    }
  };

  const handleEditChannel = (item) => {
    console.log("CHANNEL EDIT", item);
    router.push(`/channels/edit?channelId=${item._id}`);
  };

  const handleHeaderLink = (row) => {
    return `/channels/detail?id=${row._id}&channelName=${row.name}&channel_id=${row.channel_id}`;
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
        <Typography variant="h3" sx={{ py: 1, fontWeight: "bolder" }}>
          List Channel
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => router.push("/channels/create")}
        >
          Create
        </Button>
      </Box>
      <CustomTable
        headerColumns={["Channel", "Description", "webhook", "status", ""]}
        bodyColumns={["description", "webhook_url"]}
        canSetting={true}
        statusState={["inactive", "active"]}
        callbackGetData={getAllChannels}
        callbackEditData={handleEditChannel}
        callbackDeleteData={handleDeleteChannel}
        isLoading={isLoading}
        total={total}
        data={channels}
        headerCell={"name"}
        headerLink={handleHeaderLink}
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
