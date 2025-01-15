"use client";
import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Paper } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
import axios from "axios";

// Data configuration
const staticsOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

// Function to generate line colors dynamically
const getLineColor = (index) => {
  const colors = [
    'rgba(75, 192, 192, 1)',   // Teal
    'rgba(255, 99, 132, 1)',   // Red
    'rgba(54, 162, 235, 1)',   // Blue
    'rgba(255, 159, 64, 1)',   // Orange
    'rgba(153, 102, 255, 1)',  // Purple
    'rgba(255, 205, 86, 1)',   // Yellow
  ];
  return colors[index % colors.length];  // Cycle through colors if more than 6 datasets
};

const chartData = (data, color) => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: "count",
      data: data,
      borderColor: color,
      backgroundColor: color.replace('1)', '0.2)'), // Slightly transparent background
      fill: true,
    },
  ],
});

export default function ChannelStatics({ listTitle, channelId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState();
  const [users, setUsers] = useState(0);
  const [sent, setSent] = useState(0);
  const [received, setReceived] = useState(0);
  const [actionTypes, setActionTypes] = useState({});
  const [block, setBlock] = useState(0);  // Added state for Block

  const getAllLogs = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/log?channel_id=${channelId}`);
      if (res.status === 200) {
        const data = res.data;
        setLogs(data.log);
        setTotal(data.Total);

        // Filter logs based on 'direction' or whatever property exists for 'sent' and 'received'
        const sentLogs = data.log.filter(log => log.direction === "send_Reply");
        const receivedLogs = data.log.filter(log => log.direction === "receive");

        setSent(sentLogs.length);
        setReceived(receivedLogs.length);
        setBlock(data.blocked || 0);  // Set Block count if it exists in the response
      }
    } catch (error) {
      console.error("Error when getting logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllLogs();
  }, [channelId]);

  useEffect(() => {
    // You can replace the following static data with real data if available
    setUsers(1234);  // Replace with real API data
    setActionTypes({
      totalMessages: [12, 19, 3, 5, 2, 3],
      broadcast: [2, 3, 2, 5, 1, 4],
      multicast: [1, 2, 4, 3, 2, 1],
      push: [3, 4, 2, 6, 5, 4],
      reply: [4, 3, 6, 2, 1, 3],
      narrow: [5, 6, 3, 2, 4, 5],
      defualt: [1, 2, 3, 4, 5, 6, 7, 8],
      recive: [45, 546, 678, 345, 324],
    });
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {listTitle} Overview
      </Typography>
      <Grid container spacing={3}>
        {/* User, Sent, Received, Block Boxes */}
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Users</Typography>
            <Typography variant="h5">{users}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Sent</Typography>
            <Typography variant="h5">{sent}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Received</Typography>
            <Typography variant="h5">{received}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Blocked</Typography>
            <Typography variant="h5">{block}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Action Types Charts */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {Object.keys(actionTypes).map((key, index) => {
          const color = getLineColor(index);  // Get color for each chart
          return (
            <Grid item xs={12} sm={4} key={index}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">{key.charAt(0).toUpperCase() + key.slice(1)}</Typography>
                <Line data={chartData(actionTypes[key], color)} options={staticsOptions} />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
