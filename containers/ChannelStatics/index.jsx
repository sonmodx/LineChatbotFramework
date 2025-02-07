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
  Container,
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
import Loading from "@/components/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

const processLogs = (logs) => {
  const groupedData = {};

  logs.forEach((log) => {
    const [datePart] = log.createdAt.split(" "); // Extracts "DD/MM/YYYY"
    const [day, month, year] = datePart.split("/");

    const dayKey = `${day}/${month}/${year}`; // Full date
    const monthKey = `${month}-${year}`; // Month-Year

    if (!groupedData[log.direction]) {
      groupedData[log.direction] = { monthly: {}, daily: {} };
    }

    if (!groupedData[log.direction].monthly[monthKey]) {
      groupedData[log.direction].monthly[monthKey] = 0;
    }
    if (!groupedData[log.direction].daily[dayKey]) {
      groupedData[log.direction].daily[dayKey] = 0;
    }

    groupedData[log.direction].monthly[monthKey]++;
    groupedData[log.direction].daily[dayKey]++;
  });

  return groupedData;
};


const getLast7DaysLabels = () => {
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(
      `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${date.getFullYear()}`
    );
  }
  return labels;
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
  const [viewDaily, setViewDaily] = useState(true);

  const getLogs = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/log?channel_id=${channelId}`);
      if (res.status === 200) {
        const { log } = res.data;

        console.log("log",log)
        setLogs(log);

        const processedData = processLogs(log);
        setActionTypes(processedData);
        

        // Set individual counts
        const sentLogs = log.filter((l) => l.direction === "send_Reply");
        const boardcastLogs = log.filter(
          (l) => l.direction === "send_Broadcast"
        );
        const multicastLogs = log.filter(
          (l) => l.direction === "send_Multicast"
        );
        const narrowcastLogs = log.filter(
          (l) => l.direction === "send_Narrowcast"
        );
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
    getLogs();
    getAllUsers();
  }, [channelId]);

  return (
    <Container>
      <Box sx={{ marginTop: 5 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ py: 1, fontWeight: "bolder" }}
        >
          {listTitle} Overview
        </Typography>

        {isLoading ? (
          <Loading />
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
                    {sent +
                      received +
                      boardcast +
                      push +
                      multicast +
                      narrowcast}
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
                  <Typography variant="h6">Broadcast</Typography>
                  <Typography variant="h5">{boardcast}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h6">Narrowcast</Typography>
                  <Typography variant="h5">{narrowcast}</Typography>
                </Paper>
              </Grid>
            </Grid>
            <Typography
              variant="h4"
              marginTop={3}
              marginBottom={3}
              gutterBottom
            >
              {listTitle} Chart
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={viewDaily}
                  onChange={() => setViewDaily(!viewDaily)}
                  color="primary"
                />
              }
              label={`View ${viewDaily ? "Daily(Last 7 days)" : "Monthly"}`}
            />

            <Grid container spacing={3} sx={{ mt: 3 }}>
              {Object.keys(actionTypes).map((key, index) => {
                const color = getLineColor(index);
                const labels = viewDaily
                  ? getLast7DaysLabels()
                  : Object.keys(actionTypes[key].monthly);
                const data = viewDaily
                  ? labels.map(
                      (label) =>
                        actionTypes[key].daily[
                          label.split("-").reverse().join("-")
                        ] || 0
                    )
                  : Object.values(actionTypes[key].monthly);

                return (
                  <Grid item xs={12} sm={4} key={index}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="h6">
                        {key.replace(/_/g, " ")}
                      </Typography>
                      <Line
                        data={chartData(labels, data, color)}
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
    </Container>
  );
}
