"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Container,
  Avatar,
  Fade,
  Grow,
} from "@mui/material"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import {
  Assessment as ReportIcon,
  TrendingUp as TrendingIcon,
  People as PeopleIcon,
  Fastfood as FoodIcon,
  DeleteOutline as WasteIcon,
} from "@mui/icons-material"

interface ReportData {
  donationsByStatus: { name: string; value: number; color: string }[]
  donationsByMonth: { name: string; value: number }[]
  wasteByType: { name: string; value: number; color: string }[]
  wasteByMonth: { name: string; value: number }[]
  topDonors: { name: string; value: number }[]
  topCharities: { name: string; value: number }[]
}

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#d32f2f", "#7b1fa2", "#0288d1"]
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const AdminReports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("all")

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [donationsRes, wasteLogsRes, usersRes] = await Promise.all([
          axios.get("/donations/"),
          axios.get("/waste-logs/"),
          axios.get("/users/"),
        ])

        const donations = donationsRes.data
        const wasteLogs = wasteLogsRes.data
        const users = usersRes.data

        const now = new Date()
        const filteredDonations =
          timeRange === "all"
            ? donations
            : donations.filter((d: any) => {
                const date = new Date(d.created_at)
                if (timeRange === "month") {
                  return date >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
                } else if (timeRange === "quarter") {
                  return date >= new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
                } else if (timeRange === "year") {
                  return date >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
                }
                return true
              })

        const filteredWasteLogs =
          timeRange === "all"
            ? wasteLogs
            : wasteLogs.filter((w: any) => {
                const date = new Date(w.created_at)
                if (timeRange === "month") {
                  return date >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
                } else if (timeRange === "quarter") {
                  return date >= new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
                } else if (timeRange === "year") {
                  return date >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
                }
                return true
              })

        const donationsByStatus = [
          {
            name: "Available",
            value: filteredDonations.filter((d: any) => d.status === "available").length,
            color: COLORS[0],
          },
          {
            name: "Claimed",
            value: filteredDonations.filter((d: any) => d.status === "claimed").length,
            color: COLORS[1],
          },
          {
            name: "Received",
            value: filteredDonations.filter((d: any) => d.status === "received").length,
            color: COLORS[2],
          },
          {
            name: "Expired",
            value: filteredDonations.filter((d: any) => d.status === "expired").length,
            color: COLORS[3],
          },
        ].filter((item) => item.value > 0)

        const donationsByMonth = MONTHS.map((month) => ({
          name: month,
          value: filteredDonations.filter((d: any) => {
            const date = new Date(d.created_at)
            return MONTHS[date.getMonth()] === month
          }).length,
        }))

        const wasteByType = [
          {
            name: "Spoiled",
            value: filteredWasteLogs.filter((w: any) => w.waste_type === "spoiled").length,
            color: COLORS[0],
          },
          {
            name: "Expired",
            value: filteredWasteLogs.filter((w: any) => w.waste_type === "expired").length,
            color: COLORS[1],
          },
          {
            name: "Leftovers",
            value: filteredWasteLogs.filter((w: any) => w.waste_type === "leftovers").length,
            color: COLORS[2],
          },
          {
            name: "Other",
            value: filteredWasteLogs.filter((w: any) => w.waste_type === "other").length,
            color: COLORS[3],
          },
        ].filter((item) => item.value > 0)

        const wasteByMonth = MONTHS.map((month) => ({
          name: month,
          value: filteredWasteLogs.filter((w: any) => {
            const date = new Date(w.created_at)
            return MONTHS[date.getMonth()] === month
          }).length,
        }))

        const donorCounts: Record<string, number> = {}
        filteredDonations.forEach((donation: any) => {
          if (donation.donor_details) {
            const donorName = `${donation.donor_details.first_name} ${donation.donor_details.last_name}`
            donorCounts[donorName] = (donorCounts[donorName] || 0) + 1
          }
        })

        const topDonors = Object.entries(donorCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)

        const charityCounts: Record<string, number> = {}
        filteredDonations
          .filter((d: any) => d.status === "claimed" || d.status === "received")
          .forEach((donation: any) => {
            if (donation.charity_details) {
              const charityName =
                donation.charity_details.organization_name ||
                `${donation.charity_details.first_name} ${donation.charity_details.last_name}`
              charityCounts[charityName] = (charityCounts[charityName] || 0) + 1
            }
          })

        const topCharities = Object.entries(charityCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 5)

        setReportData({
          donationsByStatus,
          donationsByMonth,
          wasteByType,
          wasteByMonth,
          topDonors,
          topCharities,
        })
      } catch (err) {
        setError("Failed to load report data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReportData()
  }, [timeRange])

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 3,
          }}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading reports...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      <Fade in timeout={600}>
        <Box>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
            <Box>
              <Typography
                variant="h3"
                component="h1"
                fontWeight={700}
                sx={{
                  background: "linear-gradient(45deg, #7b1fa2, #9c27b0)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                }}
              >
                Reports & Analytics
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={400}>
                Comprehensive system analytics and insights
              </Typography>
            </Box>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value as string)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="all">All Time</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="quarter">Last Quarter</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {error && (
            <Grow in timeout={400}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            </Grow>
          )}

          <Grid container spacing={4}>
            {/* Donations by Status */}
            <Grid item xs={12} md={6}>
              <Grow in timeout={800}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid #f0f0f0",
                    borderRadius: 3,
                    minWidth: 600,
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#1976d2" }}>
                        <FoodIcon />
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" fontWeight={700}>
                        Donations by Status
                      </Typography>
                    }
                    subheader="Distribution of donation statuses"
                  />
                  <Divider />
                  <CardContent sx={{ p: 3 }}>
                    {reportData?.donationsByStatus && reportData.donationsByStatus.length > 0 ? (
                      <Box sx={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={reportData.donationsByStatus}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              stroke="#fff"
                              strokeWidth={3}
                            >
                              {reportData.donationsByStatus.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 320,
                          textAlign: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#f5f5f5", width: 80, height: 80 }}>
                          <FoodIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          No donation data available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Data will appear when donations are created
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            {/* Waste by Type */}
            <Grid item xs={12} md={6}>
              <Grow in timeout={1000}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid #f0f0f0",
                    borderRadius: 3,
                    minWidth: 500,
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#d32f2f" }}>
                        <WasteIcon />
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" fontWeight={700}>
                        Waste by Type
                      </Typography>
                    }
                    subheader="Food waste categorization"
                  />
                  <Divider />
                  <CardContent sx={{ p: 3 }}>
                    {reportData?.wasteByType && reportData.wasteByType.length > 0 ? (
                      <Box sx={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={reportData.wasteByType}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                              stroke="#fff"
                              strokeWidth={3}
                            >
                              {reportData.wasteByType.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 320,
                          textAlign: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#f5f5f5", width: 80, height: 80 }}>
                          <WasteIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          No waste data available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Waste logs will appear when data is recorded
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            {/* Donations & Waste Trends */}
            <Grid item xs={12}>
              <Grow in timeout={1200}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid #f0f0f0",
                    borderRadius: 3,
                    minWidth: 500,
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#2e7d32" }}>
                        <TrendingIcon />
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" fontWeight={700}>
                        Donations & Waste Trends
                      </Typography>
                    }
                    subheader="Monthly trends comparison"
                  />
                  <Divider />
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={MONTHS.map((month) => ({
                            name: month,
                            donations: reportData?.donationsByMonth.find((d) => d.name === month)?.value || 0,
                            waste: reportData?.wasteByMonth.find((w) => w.name === month)?.value || 0,
                          }))}
                          margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="donations"
                            stroke="#1976d2"
                            activeDot={{ r: 8 }}
                            name="Donations"
                            strokeWidth={3}
                          />
                          <Line type="monotone" dataKey="waste" stroke="#d32f2f" name="Waste Logs" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            {/* Top Donors */}
            <Grid item xs={12} md={6}>
              <Grow in timeout={1400}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid #f0f0f0",
                    borderRadius: 3,
                    minWidth: 500,
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#ed6c02" }}>
                        <PeopleIcon />
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" fontWeight={700}>
                        Top Donors
                      </Typography>
                    }
                    subheader="Most active donors by donation count"
                  />
                  <Divider />
                  <CardContent sx={{ p: 3 }}>
                    {reportData?.topDonors && reportData.topDonors.length > 0 ? (
                      <Box sx={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={reportData.topDonors}
                            layout="vertical"
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                              }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#ed6c02" name="Donations" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 320,
                          textAlign: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#f5f5f5", width: 80, height: 80 }}>
                          <PeopleIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          No donor data available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Top donors will appear when donations are made
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            {/* Top Charities */}
            <Grid item xs={12} md={6}>
              <Grow in timeout={1600}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid #f0f0f0",
                    borderRadius: 3,
                    minWidth: 500,
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#7b1fa2" }}>
                        <ReportIcon />
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" fontWeight={700}>
                        Top Charities
                      </Typography>
                    }
                    subheader="Most active charities by claims"
                  />
                  <Divider />
                  <CardContent sx={{ p: 3 }}>
                    {reportData?.topCharities && reportData.topCharities.length > 0 ? (
                      <Box sx={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={reportData.topCharities}
                            layout="vertical"
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 5,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis type="number" tick={{ fontSize: 12 }} />
                            <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e0e0e0",
                                borderRadius: "8px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                              }}
                            />
                            <Legend />
                            <Bar dataKey="value" fill="#7b1fa2" name="Claims" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 320,
                          textAlign: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#f5f5f5", width: 80, height: 80 }}>
                          <ReportIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          No charity data available
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Top charities will appear when donations are claimed
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Container>
  )
}

export default AdminReports
