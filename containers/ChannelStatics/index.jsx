"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const staticsOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const getLineColor = (index) => {
  const colors = [
    "rgba(75, 192, 192, 1)", // Teal
    "rgba(255, 99, 132, 1)", // Red
    "rgba(54, 162, 235, 1)", // Blue
    "rgba(255, 159, 64, 1)", // Orange
    "rgba(153, 102, 255, 1)", // Purple
    "rgba(255, 205, 86, 1)", // Yellow
  ];
  return colors[index % colors.length];
};

const processLogsByDate = (logs, isDaily) => {
  const groupedData = {};

  logs.forEach((log) => {
    const date = new Date(log.createdAt);
    const key = isDaily
      ? date.toLocaleDateString("default", { day: "2-digit", month: "short", year: "numeric" })
      : `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;

    if (!groupedData[log.direction]) {
      groupedData[log.direction] = {};
    }

    if (!groupedData[log.direction][key]) {
      groupedData[log.direction][key] = 0;
    }

    groupedData[log.direction][key]++;
  });

  return groupedData;
};

const chartData = (labels, data, color) => ({
  labels: labels,
  datasets: [
    {
      label: "Count",
      data: data,
      borderColor: color,
      backgroundColor: color.replace("1)", "0.2)"),
      fill: true,
    },
  ],
});

export default function ChannelStatics({ listTitle, channelId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState(0);
  const [sent, setSent] = useState(0);
  const [boardcast, setBoardcast] = useState(0);
  const [multicast, setMulticast] = useState(0);
  const [narrowcast, setNarrowcast] = useState(0);
  const [push, setPush] = useState(0);
  const [received, setReceived] = useState(0);
  const [actionTypes, setActionTypes] = useState({});
  const [block, setBlock] = useState(0);
  const [isDaily, setIsDaily] = useState(false); // Toggle between daily and monthly views

  const getAllLogs = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/log?channel_id=${channelId}`);
      if (res.status === 200) {
        const { log } = res.data;
        setLogs(log);

        const processedData = processLogsByDate(log, isDaily);

        const actionData = {};
        const labels = Object.keys(
          processedData[Object.keys(processedData)[0]] || {}
        ).sort();

        Object.keys(processedData).forEach((direction) => {
          actionData[direction] = labels.map((label) => processedData[direction][label] || 0);
        });

        setActionTypes(actionData);

        // Set individual counts
        const sentLogs = log.filter((l) => l.direction === "send_Reply");
        const boardcastLogs = log.filter((l) => l.direction === "send_Broadcast");
        const multicastLogs = log.filter((l) => l.direction === "send_Multicast");
        const narrowcastLogs = log.filter((l) => l.direction === "send_Narrowcast");
        const pushLogs = log.filter((l) => l.direction === "send_Push");
        const receivedLogs = log.filter((l) => l.direction === "receive");

        setSent(sentLogs.length);
        setReceived(receivedLogs.length);
        setBoardcast(boardcastLogs.length);
        setPush(pushLogs.length);
        setNarrowcast(narrowcastLogs.length);
        setMulticast(multicastLogs.length);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`/api/User?channel_id=${channelId}`);
      if (res.status === 200) {
        const data = res.data;

        if (Array.isArray(data.user)) {
          const followUser = data.user.filter((l) => l.status === "follow");
          const unfollowUser = data.user.filter((l) => l.status === "unfollow");
          setUsers(followUser.length);
          setBlock(unfollowUser.length);
        } else if (typeof data.user === "number") {
          setUsers(data.user);
          setBlock(0);
        } else {
          console.warn("Unexpected user data structure:", data.user);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    getAllLogs();
    getAllUsers();
  }, [channelId, isDaily]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {listTitle} Overview
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={isDaily}
            onChange={(e) => setIsDaily(e.target.checked)}
            color="primary"
          />
        }
        label={isDaily ? "Daily View" : "Monthly View"}
      />

      {isLoading ? (
        <Box
          sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Users</Typography>
                <Typography variant="h5">{users}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Total Messages</Typography>
                <Typography variant="h5">
                  {sent + received + boardcast + push + multicast + narrowcast}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Blocked</Typography>
                <Typography variant="h5">{block}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Received</Typography>
                <Typography variant="h5">{received}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Reply</Typography>
                <Typography variant="h5">{sent}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Push</Typography>
                <Typography variant="h5">{push}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Multicast</Typography>
                <Typography variant="h5">{multicast}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Narrowcast</Typography>
                <Typography variant="h5">{narrowcast}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Paper sx={{ p: 2, textAlign: "center" }}>
                <Typography variant="h6">Broadcast</Typography>
                <Typography variant="h5">{boardcast}</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            {Object.keys(actionTypes).map((key, index) => {
              const color = getLineColor(index);
              const labels = Object.keys(
                processLogsByDate(logs, isDaily)[key] || {}
              ).sort();
              return (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6">{key.replace(/_/g, " ")}</Typography>
                    <Line
                      data={chartData(labels, actionTypes[key], color)}
                      options={staticsOptions}
                    />
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
    </Box>
  );
}