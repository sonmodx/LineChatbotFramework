"use client";

import React from "react";
import {
  Box,
  Grid,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

// Mock Data
const uptimeData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Uptime Hours",
      data: [10, 12, 8, 11, 9, 7, 10],
      borderColor: "rgba(33, 150, 243, 1)",
      backgroundColor: "rgba(33, 150, 243, 0.2)",
    },
  ],
};

const performanceData = {
  labels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25"],
  datasets: [
    {
      label: "CPU Usage (%)",
      data: [45, 50, 55, 60, 58, 53],
      borderColor: "rgba(255, 87, 34, 1)",
      backgroundColor: "rgba(255, 87, 34, 0.2)",
    },
  ],
};

const memberData = {
  labels: ["Students", "Teachers", "Staff"],
  datasets: [
    {
      label: "Member Count",
      data: [150, 25, 40],
      backgroundColor: [
        "rgba(76, 175, 80, 0.7)",
        "rgba(33, 150, 243, 0.7)",
        "rgba(255, 193, 7, 0.7)",
      ],
      borderColor: [
        "rgba(76, 175, 80, 1)",
        "rgba(33, 150, 243, 1)",
        "rgba(255, 193, 7, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const messageData = {
  labels: ["Day", "Week", "Month"],
  datasets: [
    {
      label: "Messages Sent",
      data: [50, 300, 1200], // Mock message counts
      backgroundColor: [
        "rgba(103, 58, 183, 0.7)",
        "rgba(33, 150, 243, 0.7)",
        "rgba(76, 175, 80, 0.7)",
      ],
      borderColor: [
        "rgba(103, 58, 183, 1)",
        "rgba(33, 150, 243, 1)",
        "rgba(76, 175, 80, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const logData = [
  { timestamp: "2024-12-01 10:00", command: "ls -la" },
  { timestamp: "2024-12-01 10:05", command: "cd /home/user" },
  { timestamp: "2024-12-01 10:10", command: "npm start" },
];

export default function Dashboard() {
  const actionCount = 0;
  const apiCount = 0;

  return (
    <Box p={4} width="100%">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Counts Section */}
      <Grid container spacing={4}>
        <Grid item xs={6} sm={3}>
          <Paper elevation={3} style={{ padding: 16, textAlign: "center" }}>
            <Typography variant="h6">Action Count</Typography>
            <Typography variant="h4" color="primary">
              {actionCount}/10
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper elevation={3} style={{ padding: 16, textAlign: "center" }}>
            <Typography variant="h6">API Count</Typography>
            <Typography variant="h4" color="error">
              {apiCount}/20
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Paper elevation={3} style={{ padding: 16, textAlign: "center" }}>
            <Typography variant="h6">Member Count</Typography>
            <Typography variant="h4" color="error">
              {apiCount}/100
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Uptime, Member Count, and Performance Graphs */}
      <Grid container spacing={4} mt={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Uptime Hours
            </Typography>
            <Line data={uptimeData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Member Count
            </Typography>
            <Bar data={memberData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Performance Data
            </Typography>
            <Line data={performanceData} />
          </Paper>
        </Grid>
      </Grid>

      {/* Messages Sent Chart */}
      <Grid container spacing={4} mt={2}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: 16 }}>
            <Typography variant="h6" gutterBottom>
              Messages Sent (Daily, Weekly, Monthly)
            </Typography>
            <Bar data={messageData} />
          </Paper>
        </Grid>
      </Grid>

      {/* Logs Section */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Latest Command Logs
        </Typography>
        <Paper elevation={3} style={{ padding: 16 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Timestamp</b>
                </TableCell>
                <TableCell>
                  <b>Command</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logData.map((log, index) => (
                <TableRow key={index}>
                  <TableCell>{log.timestamp}</TableCell>
                  <TableCell>{log.command}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </Box>
  );
}
