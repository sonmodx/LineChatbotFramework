'use client'; // Marking this component as client-side

import React, { useState } from 'react';
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
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function PostmanClonePage() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [urlParams, setUrlParams] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [auth, setAuth] = useState('None');
  const [scripts, setScripts] = useState('');
  const [activeTab, setActiveTab] = useState(0);

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
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index) => {
    const updatedHeaders = headers.filter((_, i) => i !== index);
    setHeaders(updatedHeaders);
  };

  const addUrlParam = () => {
    setUrlParams([...urlParams, { key: '', value: '' }]);
  };

  const removeUrlParam = (index) => {
    const updatedParams = urlParams.filter((_, i) => i !== index);
    setUrlParams(updatedParams);
  };

  const handleSubmit = () => {
    const requestData = {
      method,
      url,
      headers,
      urlParams,
      body,
      auth,
      scripts,
    };
    console.log('API Request Data:', requestData);
    // Here, you can implement saving functionality, e.g., saving to localStorage or a database
  };

  const handleSave = () => {
    const requestData = {
      method,
      url,
      headers,
      urlParams,
      body,
      auth,
      scripts,
    };
    // Assuming `saveToLocal` is a function that persists data locally
    saveToLocal(requestData);
  };

  const saveToLocal = (data) => {
    localStorage.setItem('apiRequest', JSON.stringify(data));
    alert('Request configuration saved successfully!');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* AppBar */}
      <AppBar position="static">
        <Container>
          <Typography variant="h6" sx={{ color: 'white' }}>
            Postman API Params
          </Typography>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ padding: 2 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Configure API Request
            </Typography>

            {/* HTTP Method & URL */}
            <Grid container spacing={2}>
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
              <Tab label="URL Params" />
              <Tab label="Headers" />
              <Tab label="Body" />
              <Tab label="Auth" />
              <Tab label="Scripts" />

            </Tabs>

            {/* Tab Content */}
            {activeTab === 1 && (
              <Box sx={{ marginTop: 2 }}>
                {/* Headers Section */}
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Headers</Typography>
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
                              onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={header.value}
                              onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
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
                <Button variant="outlined" sx={{ marginTop: 2 }} onClick={addHeader}>
                  Add Header
                </Button>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ marginTop: 2 }}>
                {/* Body Section */}
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Body</Typography>
                <TextField
                  label="Body"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={6}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </Box>
            )}

            {activeTab === 3 && (
              <Box sx={{ marginTop: 2 }}>
                {/* Auth Section */}
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Authentication</Typography>
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
                {auth === 'Basic' && (
                  <Grid container spacing={2} sx={{ marginTop: 2 }}>
                    <Grid item xs={6}>
                      <TextField label="Username" fullWidth />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField label="Password" fullWidth type="password" />
                    </Grid>
                  </Grid>
                )}
                {auth === 'Bearer' && (
                  <TextField
                    label="Token"
                    variant="outlined"
                    fullWidth
                    sx={{ marginTop: 2 }}
                  />
                )}
              </Box>
            )}

            {activeTab === 4 && (
              <Box sx={{ marginTop: 2 }}>
                {/* Scripts Section */}
                <Typography variant="h6" sx={{ marginBottom: 2 }}>Pre-request Script</Typography>
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

            {activeTab === 0 && (
              <Box sx={{ marginTop: 2 }}>
                {/* URL Params Section */}
                <Typography variant="h6" sx={{ marginBottom: 2 }}>URL Params</Typography>
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
                              onChange={(e) => handleUrlParamChange(index, 'key', e.target.value)}
                              fullWidth
                            />
                          </TableCell>
                          <TableCell>
                            <TextField
                              value={param.value}
                              onChange={(e) => handleUrlParamChange(index, 'value', e.target.value)}
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
                <Button variant="outlined" sx={{ marginTop: 2 }} onClick={addUrlParam}>
                  Add URL Param
                </Button>
              </Box>
            )}

            {/* Buttons Section */}
            <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Send Request
              </Button>
              <Button variant="outlined" onClick={handleSave}>
                Save
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default PostmanClonePage;
