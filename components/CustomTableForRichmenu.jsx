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
import LinkIcon from "@mui/icons-material/Link";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Snackbar,
  TablePagination,
  Link,
  Typography,
  Modal,
  TextField,
  Autocomplete,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { useSession } from "next-auth/react";
import { Popper } from "@mui/base";
import PopperItem from "@/components/PopperItem";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

export default function CustomTable({
  headerColumns,
  bodyColumns,
  canSetting,
  statusState,
  callbackGetData,
  callbackLinkData,
  callbackEditData,
  callbackDeleteData,
  isLoading,
  total,
  data,
  headerLink,
  headerCell,
  anchorEl,
  setAnchorEl,
  linkanchorEl,
  setlinkAnchorEl,
  isOpenSnackbar,
  setIsOpenSnackbar,
  session,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  search = null,
  alertMessage = "",
}) {
  const [selectId, setSelectId] = useState();
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectLineUser, setSelectLineUser] = useState(null);
  const [lineUsers, setLineUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoadingSelectedUsers, setIsLoadingSelectedUsers] = useState(false);

  const emptyRows = page > 0 ? Math.max(0, rowsPerPage - data.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (event, channelId) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
    setSelectId(channelId);
  };

  const handleLink = (event, channelId) => {
    setlinkAnchorEl(linkanchorEl ? null : event.currentTarget);
    setSelectId(channelId);
  };

  const handleEdit = (row) => {
    setSelectId(row);
    setName(row.name);
    setDescription(row.description);
    setOpenUpdate(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpenSnackbar(false);
  };

  const openDeletePopper = Boolean(anchorEl);
  const openLinkPopper = Boolean(linkanchorEl);
  const idDelete = openDeletePopper ? "delete-popper" : undefined;
  const idLink = openLinkPopper ? "link-popper" : undefined;

  const handleUpdateAudience = () => {
    const updatedData = { ...selectId, textadd: name };
    callbackEditData(updatedData);
    setOpenUpdate(false);
  };

  useEffect(() => {
    callbackGetData(session, page, rowsPerPage);
  }, [session, page, rowsPerPage, search]);

  if (isLoading) return <Loading />;

  if (data?.length === 0)
    return (
      <Typography variant="h4" textAlign="center" sx={{ color: "grey" }}>
        No Data
      </Typography>
    );

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ bgcolor: "whitesmoke" }}>
              {headerColumns?.map((hc, index) => (
                <TableCell key={index} sx={{ fontWeight: "bolder" }}>
                  {hc}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  "& > *": { borderLeft: 1, borderColor: "rgb(224, 224, 224)" },
                }}
              >
                <TableCell component="th" scope="row">
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {headerLink && (
                      <Link href={headerLink(row)} underline="hover">
                        {row[headerCell]}
                      </Link>
                    )}
                    {!headerLink && row[headerCell]}
                  </Box>
                </TableCell>
                {bodyColumns?.map((bc) => (
                  <TableCell key={row._id}>{row[bc]}</TableCell>
                ))}
                {statusState.length !== 0 && (
                  <TableCell>
                    {row["status"] === "false"
                      ? statusState[0]
                      : statusState[1]}
                  </TableCell>
                )}

                {canSetting && (
                  <TableCell
                    width={120}
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                  >
                    <IconButton
                      onClick={(e) => handleLink(e, row)}
                      aria-describedby={idLink}
                    >
                      <LinkIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleClick(e, row)}
                      aria-describedby={idDelete}
                    >
                      <DeleteOutlineOutlinedIcon />
                    </IconButton>
                  </TableCell>
                )}
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
      {canSetting && (
        <>
          <Popper
            id={idLink}
            open={openLinkPopper}
            anchorEl={linkanchorEl}
            placement="top"
          >
            <PopperItem>
              <Button
                size="small"
                variant="contained"
                color="primary"
                sx={{ fontSize: 10 }}
                onClick={() => callbackLinkData(selectId)}
                autoFocus
              >
                Link to Line User
              </Button>
              <Button
                size="small"
                variant="outlined"
                sx={{ ml: 1, fontSize: 10 }}
                onClick={() => setlinkAnchorEl(null)}
              >
                CANCEL
              </Button>
            </PopperItem>
          </Popper>

          <Popper
            id={idDelete}
            open={openDeletePopper}
            anchorEl={anchorEl}
            placement="top"
          >
            <PopperItem>
              <Button
                size="small"
                variant="contained"
                color="error"
                sx={{ fontSize: 10 }}
                onClick={() => callbackDeleteData(selectId)}
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
        </>
      )}

      <Snackbar
        open={isOpenSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
