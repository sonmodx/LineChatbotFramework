"use client";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Container,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CustomTable from "@/components/CustomTable";
import Notification from "@/components/Notification";
import { getAllLineUsers, getAllLineUsersByUserId } from "@/actions";
import Loading from "@/components/Loading";
export default function ListAudience({ channelId, channelIdLine }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSelectedUsers, setIsLoadingSelectedUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState();
  const [isOpenSnackbar, setIsOpenSnackbar] = useState(false);
  const [anchorEl, setAnchorEl] = useState();
  const { data: session } = useSession(authOptions);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [openNotification, setOpenNotification] = useState(false);
  const [description, setDescription] = useState("");
  const [lineUsers, setLineUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  console.log(selectedUsers);
  const [selectLineUser, setSelectLineUser] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [openNotificationUpdate, setOpenNotificationUpdate] = useState(false);
  const [selectAudienceId, setSelectAudienceId] = useState(null);

  const audienceConfig = {
    audience_id: "",
    description: name,
    isIfaAudience: false,
    user_id: selectedUsers?.map((user) => user.line_user_id),
    uploadDescription: description,
  };
  console.log("audddddd", audienceConfig.user_id);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  };
  const getAllAudiences = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `/api/audience?channel_id=${channelId}&pageNumber=${
          page + 1
        }&pageSize=${rowsPerPage}`
      );

      if (res.status === 200) {
        const data = res.data;
        setUsers(data.audience);
        setTotal(data.Total);
        console.log("Line audience data:", data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error when get line user:", error);
    }
  };

  const handleSelectLineUser = (newValue) => {
    if (newValue) {
      setSelectLineUser(newValue);
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, newValue]);
      setLineUsers((prevLineUsers) =>
        prevLineUsers.filter(
          (user) => user.line_user_id !== newValue.line_user_id
        )
      );
    }
  };

  const handleCreateAudience = async () => {
    try {
      const body = {
        type: "createaudience",
        destination: channelIdLine,
        audience_config: audienceConfig,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/audience`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        setOpenNotification(true);
        setOpen(false);
        setDefaultValue();
        getAllAudiences();
      }
    } catch (error) {
      console.error("Error when create audience:", error);
    }
  };

  const handleDeleteAudience = async (selectId) => {
    try {
      // const audience_id = prompt("Enter audience ID:", "");
      const body = {
        type: "deleteaudience",
        destination: channelIdLine,
        audience_config: { audience_id: selectId.audienceGroupId },
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/audience`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        getAllAudiences();
        console.log("Successful delete audience");
        setOpenNotification(true);
        setDefaultValue();
      }
    } catch (error) {
      console.error("Error when delete audience:", error);
    }
  };

  const handleUpdateAudience = async () => {
    try {
      audienceConfig.audience_id = selectAudienceId.audienceGroupId.toString();
      const body = {
        type: "uploadaudience",
        destination: channelIdLine,
        audience_config: audienceConfig,
      };
      console.log(body);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/audience`,
        body,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.status === 200) {
        setOpenNotificationUpdate(true);
        setOpenUpdate(false);
        setDefaultValue();
        getAllAudiences();
      }
    } catch (error) {
      console.error("Error when update audience:", error);
    }
  };

  const handleGetAllLineUsers = async () => {
    const line_users = await getAllLineUsers(channelId);

    console.log(line_users);
    setLineUsers(JSON.parse(line_users));
  };

  const handleGetAllLineUsersByUserId = async (item) => {
    setIsLoadingSelectedUsers(true);
    const users = await getAllLineUsersByUserId(item.audiences);
    console.log(users);
    setSelectedUsers(JSON.parse(users));
    setIsLoadingSelectedUsers(false);
  };

  const setDefaultValue = async () => {
    setName("");
    setDescription("");
    setSelectedUsers([]);
    setSelectLineUser(null);
    setSelectAudienceId(null);
    setAnchorEl(null);
    setLineUsers([]);
  };
  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          width: "100%",
          mt: 5,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" sx={{ py: 1, fontWeight: "bolder" }}>
          List Audience
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Create
        </Button>
      </Stack>
      <CustomTable
        headerColumns={[
          "Audience Name",
          "Volume",
          "Description",
          "Create date",
          "",
        ]}
        bodyColumns={["volume", "uploadDescription", "createdAt"]}
        canSetting={true}
        statusState={[]}
        callbackGetData={getAllAudiences}
        callbackEditData={async (item) => {
          console.log("aud", item.audiences);
          handleGetAllLineUsersByUserId(item);
          setOpenUpdate(true);
          setSelectAudienceId(item);
          setName(item.description);
          setDescription(item.uploadDescription);
        }}
        callbackDeleteData={handleDeleteAudience}
        isLoading={isLoading}
        total={total}
        data={users}
        headerCell={"description"}
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
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setDefaultValue();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5">
            Create New Audience
          </Typography>

          <Box sx={{ pt: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#585858", fontSize: 20 }}
            >
              Audience Name:
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter new audience here"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>

          <Box sx={{ pt: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#585858", fontSize: 20 }}
            >
              Audience Description:
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter description here"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
          <Box sx={{ pt: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#585858", fontSize: 20 }}
            >
              User
            </Typography>
            <Autocomplete
              options={lineUsers}
              getOptionLabel={(option) => option.display_name || ""}
              value={selectLineUser}
              onChange={(event, newValue) => handleSelectLineUser(newValue)}
              onSelect={handleGetAllLineUsers}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Line User"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Box mt={2}>
              <div>
                {selectedUsers.map((user) => (
                  <Chip
                    key={user.line_user_id}
                    label={user.display_name}
                    color="primary"
                    onDelete={() => {
                      // Remove user from selected list
                      setSelectedUsers((prev) =>
                        prev.filter((u) => u.line_user_id !== user.line_user_id)
                      );
                      // Add back to line users list
                      setLineUsers((prev) => [...prev, user]);
                    }}
                    sx={{ marginRight: 1 }}
                  />
                ))}
              </div>
            </Box>
          </Box>
          {/* Buttons at the Bottom-Right */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              pt: 2,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpen(false)} // Close modal on Cancel
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateAudience} // Replace with your creation logic
            >
              Create
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openUpdate}
        onClose={() => {
          setOpenUpdate(false);
          setDefaultValue();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5">
            Update New Audience
          </Typography>

          <Box sx={{ pt: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#585858", fontSize: 20 }}
            >
              Audience Name:
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter new audience here"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>

          <Box sx={{ pt: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#585858", fontSize: 20 }}
            >
              Audience Description:
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter description here"
              variant="outlined"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Box>
          <Box sx={{ pt: 1 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#585858", fontSize: 20 }}
            >
              User
            </Typography>
            <Autocomplete
              options={lineUsers}
              getOptionLabel={(option) => option.display_name || ""}
              value={selectLineUser}
              onChange={(event, newValue) => handleSelectLineUser(newValue)}
              onSelect={handleGetAllLineUsers}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Line User"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Box mt={2}>
              <div>
                {!isLoadingSelectedUsers &&
                  selectedUsers.map((user) => (
                    <Chip
                      key={user.line_user_id}
                      label={user.display_name}
                      color="primary"
                      onDelete={() => {
                        // Remove user from selected list
                        setSelectedUsers((prev) =>
                          prev.filter(
                            (u) => u.line_user_id !== user.line_user_id
                          )
                        );
                        // Add back to line users list
                        setLineUsers((prev) => [...prev, user]);
                      }}
                      sx={{ marginRight: 1 }}
                    />
                  ))}
                {isLoadingSelectedUsers && <Loading />}
              </div>
            </Box>
          </Box>
          {/* Buttons at the Bottom-Right */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              pt: 2,
            }}
          >
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setOpenUpdate(false)} // Close modal on Cancel
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateAudience} // Replace with your creation logic
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
      <Notification
        openNotification={openNotificationUpdate}
        setOpenNotification={setOpenNotificationUpdate}
        message="Successful update audience"
      />
      <Notification
        openNotification={openNotification}
        setOpenNotification={setOpenNotification}
        message="Successful sent message"
      />
    </Box>
  );
}
