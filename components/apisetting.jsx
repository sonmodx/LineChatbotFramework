"use client"; // Marking this component as client-side

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AppBar,
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
} from "@mui/material";
import Loading from "./Loading";
import Notification from "./Notification";

function ApiSetting({ mode = "create", id = null, channelId = null }) {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [urlParams, setUrlParams] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("");
  const [errorBody, setErrorBody] = useState();
  // [
  //  { key: "", content_type: "", content: "" },
  // ]
  const [auth, setAuth] = useState("None");
  const [scripts, setScripts] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const [openNotificationRequest, setOpenNotificationRequest] = useState(false);

  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState([]);

  // Fetch existing data for editing
  useEffect(() => {
    if (mode === "edit" && id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/uAPI?id=${id}`);
          console.log("res API ID", response);
          if (response.status !== 200) return;

          const data = response.data.API;
          setMethod(data.method_type || "GET");
          setUrl(data.api_endpoint || "");
          setHeaders(data.api_headers || [{ key: "", value: "" }]);
          setUrlParams(data.api_params || [{ key: "", value: "" }]);
          setBody(revertToObjectString(data.api_body) || "");
          setAuth(data.api_auth || "None");
          setScripts(data.scripts || "");
          setName(data.name || "");
          setKeywords(data.keywords || []);
        } catch (error) {
          console.error("Error fetching data:", error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
    }
  }, [mode, id]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleHeaderChange = (index, key, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][key] = value;
    setHeaders(updatedHeaders);
  };

  const handleUrlParamChange = (index, key, value) => {
    const updatedParams = [...urlParams];
    updatedParams[index][key] = value;
    setUrlParams(updatedParams);
  };

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index) => {
    const updatedHeaders = headers.filter((_, i) => i !== index);
    setHeaders(updatedHeaders);
  };

  const addUrlParam = () => {
    setUrlParams([...urlParams, { key: "", value: "" }]);
  };

  const removeUrlParam = (index) => {
    const updatedParams = urlParams.filter((_, i) => i !== index);
    setUrlParams(updatedParams);
  };

  const revertToObjectString = (array) => {
    // Convert the array back to an object
    const obj = array.reduce((acc, { key, content }) => {
      acc[key] = content;
      return acc;
    }, {});

    // Convert the object to a JSON string
    return JSON.stringify(obj, null, 2); // Optional: `null, 2` for pretty formatting
  };

  const handleSubmit = async () => {
    const transformApiBody = (body) => {
      try {
        // Attempt to parse the input string
        const parsedBody = JSON.parse(body);

        // Ensure the parsed result is an object and not another data type
        if (
          typeof parsedBody !== "object" ||
          Array.isArray(parsedBody) ||
          parsedBody === null
        ) {
          setErrorBody("Input is not a valid object.");
          throw new Error("Input is not a valid object.");
        }
        setErrorBody(null);

        // Transform the object into the desired array format
        return Object.entries(parsedBody).map(([key, value]) => ({
          key: key,
          content_type: typeof value, // Determine the content type
          content: value,
        }));
      } catch (error) {
        setErrorBody(`Invalid input format: ${error.message}`);
        // Return an error message or handle it as required
        console.error("Invalid input format:", error.message);
        return;
      }
    };
    const apiBody = transformApiBody(body);
    if (!apiBody) return;
    const requestData = {
      name: name,
      description: "",
      method_type: method,
      api_endpoint: url,
      api_headers: headers,
      api_params: urlParams,
      api_body: apiBody,
      api_auth: "",
    };
    if (mode === "edit") {
      requestData.id = id;
    }
    if (mode === "create") {
      requestData.channel_id = channelId;
    }

    try {
      setLoading(true);
      const responseUserAPI = await getResponseAPI();
      if (!responseUserAPI) {
        return;
      }
      const responseUserApiData = responseUserAPI.data;
      let keywordApi = responseUserApiData;
      if (Array.isArray(responseUserApiData)) {
        keywordApi = responseUserApiData[0];
      }

      requestData.keywords = JSON.stringify(keywordApi);
      console.log("request data", requestData);

      const response = await axios({
        method: mode === "edit" ? "put" : "post",
        url: mode === "edit" && id ? `/api/uAPI?id=${id}` : "/api/uAPI",
        headers: { "Content-Type": "application/json" },
        data: requestData,
      });

      console.log("API Request Successful:", response.data);

      if (response.status === 200 || response.status === 201) {
        setOpenNotification(true);
      }
    } catch (error) {
      console.error(
        "Error sending request:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async () => {
    try {
      const response = await getResponseAPI();
      if (response) {
        setOpenNotificationRequest(true);
      } else {
        window.alert("Request Failed!!!");
      }
    } catch (error) {
      console.error(
        "Error send req to API:",
        error.response?.data?.message || error.message
      );
    }
  };

  const getResponseAPI = async () => {
    try {
      const response = await axios(url, {
        headers: { "Content-Type": "application/json" },
        method: method,
      });
      console.log("RESPINSE FROM API,", response);

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
      ) {
        console.log("OK");
        return response;
      } else {
        return false;
      }
    } catch (error) {
      console.error(
        "Error get response from API:",
        error.response?.data?.message || error.message
      );
    }
    return;
  };

  if (loading) return <Loading />;

  return (
    <Container>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Main Content */}
        <Box sx={{ padding: 2 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Configure API Request
              </Typography>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* HTTP Method & URL */}
              <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel>Method</InputLabel>
                    <Select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      label="Method"
                    >
                      <MenuItem value="GET">GET</MenuItem>
                      <MenuItem value="POST">POST</MenuItem>
                      <MenuItem value="PUT">PUT</MenuItem>
                      <MenuItem value="DELETE">DELETE</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={9}>
                  <TextField
                    label="URL"
                    variant="outlined"
                    fullWidth
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </Grid>
              </Grid>

              {/* Tabs for different sections */}
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                centered
                sx={{ marginTop: 2 }}
              >
                <Tab label="Headers" />
                <Tab label="Body" />
                <Tab label="Auth" />
                <Tab label="Scripts" />
                <Tab label="URL Params" />
              </Tabs>

              {/* Tab Content */}
              {activeTab === 0 && (
                <Box sx={{ marginTop: 2 }}>
                  {/* Headers Section */}
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Headers
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Key</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {headers.map((header, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                value={header.key}
                                onChange={(e) =>
                                  handleHeaderChange(
                                    index,
                                    "key",
                                    e.target.value
                                  )
                                }
                                fullWidth
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={header.value}
                                onChange={(e) =>
                                  handleHeaderChange(
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                                fullWidth
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => removeHeader(index)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    variant="outlined"
                    sx={{ marginTop: 2 }}
                    onClick={addHeader}
                  >
                    Add Header
                  </Button>
                </Box>
              )}

              {activeTab === 4 && (
                <Box sx={{ marginTop: 2 }}>
                  {/* URL Params Section */}
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    URL Params
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Key</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {urlParams.map((param, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <TextField
                                value={param.key}
                                onChange={(e) =>
                                  handleUrlParamChange(
                                    index,
                                    "key",
                                    e.target.value
                                  )
                                }
                                fullWidth
                              />
                            </TableCell>
                            <TableCell>
                              <TextField
                                value={param.value}
                                onChange={(e) =>
                                  handleUrlParamChange(
                                    index,
                                    "value",
                                    e.target.value
                                  )
                                }
                                fullWidth
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                color="error"
                                onClick={() => removeUrlParam(index)}
                              >
                                Remove
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    variant="outlined"
                    sx={{ marginTop: 2 }}
                    onClick={addUrlParam}
                  >
                    Add URL Param
                  </Button>
                </Box>
              )}

              {activeTab === 1 && (
                <Box sx={{ marginTop: 2 }}>
                  {/* Body Section */}
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Body
                  </Typography>
                  <TextField
                    label="Body"
                    variant="outlined"
                    fullWidth
                    error={errorBody}
                    multiline
                    rows={6}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                  {errorBody && (
                    <Typography
                      variant="h6"
                      sx={{
                        marginTop: 1,
                        color: "secondary.main",
                        fontSize: 16,
                      }}
                    >
                      {errorBody}
                    </Typography>
                  )}
                </Box>
              )}

              {activeTab === 2 && (
                <Box sx={{ marginTop: 2 }}>
                  {/* Auth Section */}
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Authentication
                  </Typography>
                  <FormControl fullWidth>
                    <Select
                      value={auth}
                      onChange={(e) => setAuth(e.target.value)}
                      label="Auth Type"
                    >
                      <MenuItem value="None">None</MenuItem>
                      <MenuItem value="Basic">Basic Auth</MenuItem>
                      <MenuItem value="Bearer">Bearer Token</MenuItem>
                    </Select>
                  </FormControl>
                  {auth === "Basic" && (
                    <Grid container spacing={2} sx={{ marginTop: 2 }}>
                      <Grid item xs={6}>
                        <TextField label="Username" fullWidth />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField label="Password" fullWidth type="password" />
                      </Grid>
                    </Grid>
                  )}
                  {auth === "Bearer" && (
                    <TextField
                      label="Token"
                      variant="outlined"
                      fullWidth
                      sx={{ marginTop: 2 }}
                    />
                  )}
                </Box>
              )}

              {activeTab === 3 && (
                <Box sx={{ marginTop: 2 }}>
                  {/* Scripts Section */}
                  <Typography variant="h6" sx={{ marginBottom: 2 }}>
                    Pre-request Script
                  </Typography>
                  <TextField
                    label="Script"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={6}
                    value={scripts}
                    onChange={(e) => setScripts(e.target.value)}
                  />
                </Box>
              )}

              {/* Submit Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSendRequest}
                sx={{ marginTop: 3 }}
              >
                Send Request
              </Button>
            </CardContent>
          </Card>
          <Stack>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ marginTop: 3, marginLeft: "auto" }}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Box>
      <Notification
        openNotification={openNotification}
        setOpenNotification={setOpenNotification}
        message={`Successful ${mode === "edit" ? "update API" : "create API"}`}
      />
      <Notification
        openNotification={openNotificationRequest}
        setOpenNotification={setOpenNotificationRequest}
        message={`Successful request API`}
      />
    </Container>
  );
}

export default ApiSetting;
