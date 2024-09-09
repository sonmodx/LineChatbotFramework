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
import { Box, IconButton, TablePagination } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { useSession } from "next-auth/react";

function createData(name, description, webhook_url, status, edit) {
  return { name, description, webhook_url, status, edit };
}

export default function ChannelTable() {
  const { data: session } = useSession(authOptions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [channels, setChannels] = useState([]);

  const rows = channels?.map((channel) =>
    createData(
      channel?.name,
      channel?.description,
      channel?.webhook_url,
      channel?.status
    )
  );

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () => [...rows].slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [page, rowsPerPage, rows]
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getAllChannels = async () => {
    try {
      const res = await axios.get(
        `/api/Channel?user_id=${session?.user?._id}&pageNumber=${page}&pageSize=${rowsPerPage}`
      );
      if (res.status === 200) {
        const data = res.data;
        setChannels(data.Channel);
        console.log("Channel data:", data);
      }
    } catch (error) {
      console.error("Error when get channels:", error);
    }
  };

  useEffect(() => {
    getAllChannels();
  }, [session]);

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
            {visibleRows.map((row) => (
              <TableRow
                key={row.name}
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
                  <IconButton>
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
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}
