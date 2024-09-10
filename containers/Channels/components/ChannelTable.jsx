"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Snackbar,
  TablePagination,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { useSession } from "next-auth/react";
import { Popper } from "@mui/base";
import PopperItem from "@/components/PopperItem";
import Loading from "@/components/Loading";

function createData(name, description, webhook_url, status, channel_id) {
  return { name, description, webhook_url, status, channel_id };
}

export default function ChannelTable() {
  const { data: session } = useSession(authOptions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [channels, setChannels] = useState([]);
  const [anchorEl, setAnchorEl] = useState();
  const [selectChannelId, setSelectChannelId] = useState();
  const [total, setTotal] = useState();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // const rows = channels?.map((channel) =>
  //   createData(
  //     channel?.name,
  //     channel?.description,
  //     channel?.webhook_url,
  //     channel?.status,
  //     channel?._id
  //   )
  // );

  const emptyRows = page > 0 ? Math.max(0, rowsPerPage - channels.length) : 0;

  // const visibleRows = useMemo(
  //   () => [...rows].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
  //   [page, rowsPerPage, rows]
  // );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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

  const handleClick = (event, channelId) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setSelectChannelId(channelId);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpenSnackbar(false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleDeleteChannel = async () => {
    try {
      console.log(selectChannelId);
      const res = await axios.delete(`/api/Channel?id=${selectChannelId}`);
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

  useEffect(() => {
    getAllChannels();
  }, [session, page, rowsPerPage]);

  if (isLoading) return <Loading />;

  if (channels.length === 0)
    return (
      <Typography variant="h4" textAlign="center" sx={{ color: "grey" }}>
        No channel
      </Typography>
    );

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ bgcolor: "whitesmoke" }}>
              <TableCell sx={{ fontWeight: "bolder" }}>Channel</TableCell>
              <TableCell sx={{ fontWeight: "bolder" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bolder" }}>Webhook</TableCell>
              <TableCell sx={{ fontWeight: "bolder" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bolder" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {channels.map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  "& > *": { borderLeft: 1, borderColor: "rgb(224, 224, 224)" },
                }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Person2OutlinedIcon sx={{ mr: 2 }} />
                    {row.name}
                  </Box>
                </TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.webhook_url}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell width={120}>
                  <IconButton>
                    <EditOutlinedIcon />
                  </IconButton>
                  <IconButton
                    onClick={(e) => handleClick(e, row._id)}
                    aria-describedby={id}
                  >
                    <DeleteOutlineOutlinedIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow
                sx={{
                  height: 73 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Popper id={id} open={open} anchorEl={anchorEl} placement="top">
        <PopperItem>
          <Button
            size="small"
            variant="contained"
            color="error"
            sx={{ fontSize: 10 }}
            onClick={handleDeleteChannel}
            autoFocus
            onBlur={() => setAnchorEl(null)}
          >
            DELETE
          </Button>
          <Button
            size="small"
            variant="outlined"
            sx={{ ml: 1, fontSize: 10 }}
            onClick={() => setAnchorEl(null)}
          >
            CANCEL
          </Button>
        </PopperItem>
      </Popper>
      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Success delete channel
        </Alert>
      </Snackbar>
    </>
  );
}
