"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Container,
  Avatar,
  Stack,
  Fade,
  Grow,
  Alert,
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
} from "recharts"
import {
  People as PeopleIcon,
  Fastfood as FoodIcon,
  Assignment as AssignmentIcon,
  DeleteOutline as WasteIcon,
  TrendingUp as TrendingIcon,
  Assessment as ChartIcon,
} from "@mui/icons-material"

interface DashboardStats {
  totalUsers: number
  totalDonors: number
  totalCharities: number
  totalDonations: number
  availableDonations: number
  claimedDonations: number
  receivedDonations: number
  expiredDonations: number
  totalWasteLogs: number
  recentDonations: any[]
  donationsByStatus: any[]
  wasteByType: any[]
}

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#d32f2f", "#7b1fa2", "#0288d1"]

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, donationsRes, wasteRes] = await Promise.all([
          axios.get("/users/"),
          axios.get("/donations/"),
          axios.get("/waste-logs/"),
        ])

        const users = usersRes.data
        const donations = donationsRes.data
        const wasteLogs = wasteRes.data

        const totalUsers = users.length
        const totalDonors = users.filter((user: any) => user.role === "donor").length
        const totalCharities = users.filter((user: any) => user.role === "charity").length

        const totalDonations = donations.length
        const availableDonations = donations.filter((d: any) => d.status === "available").length
        const claimedDonations = donations.filter((d: any) => d.status === "claimed").length
        const receivedDonations = donations.filter((d: any) => d.status === "received").length
        const expiredDonations = donations.filter((d: any) => d.status === "expired").length

        const totalWasteLogs = wasteLogs.length

        const recentDonations = donations
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)

        const donationsByStatus = [
          { name: "Available", value: availableDonations, color: COLORS[0] },
          { name: "Claimed", value: claimedDonations, color: COLORS[1] },
          { name: "Received", value: receivedDonations, color: COLORS[2] },
          { name: "Expired", value: expiredDonations, color: COLORS[3] },
        ].filter((item) => item.value > 0)

        const wasteByType = [
          { name: "Spoiled", value: wasteLogs.filter((w: any) => w.waste_type === "spoiled").length, color: COLORS[0] },
          { name: "Expired", value: wasteLogs.filter((w: any) => w.waste_type === "expired").length, color: COLORS[1] },
          { name: "Leftovers", value: wasteLogs.filter((w: any) => w.waste_type === "leftovers").length, color: COLORS[2] },
          { name: "Other", value: wasteLogs.filter((w: any) => w.waste_type === "other").length, color: COLORS[3] },
        ].filter((item) => item.value > 0)

        setStats({
          totalUsers,
          totalDonors,
          totalCharities,
          totalDonations,
          availableDonations,
          claimedDonations,
          receivedDonations,
          expiredDonations,
          totalWasteLogs,
          recentDonations,
          donationsByStatus,
          wasteByType,
        })
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

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
            Loading admin dashboard...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight={700}
              sx={{
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400}>
              System overview and analytics
            </Typography>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              {
                title: "Total Users",
                value: stats?.totalUsers || 0,
                subtitle: `${stats?.totalDonors || 0} Donors, ${stats?.totalCharities || 0} Charities`,
                icon: PeopleIcon,
                color: "#1976d2",
                bgColor: "#e3f2fd",
              },
              {
                title: "Total Donations",
                value: stats?.totalDonations || 0,
                subtitle: `${stats?.availableDonations || 0} Available`,
                icon: FoodIcon,
                color: "#2e7d32",
                bgColor: "#e8f5e8",
              },
              {
                title: "Claimed Donations",
                value: stats?.claimedDonations || 0,
                subtitle: `${stats?.receivedDonations || 0} Received`,
                icon: AssignmentIcon,
                color: "#ed6c02",
                bgColor: "#fff3e0",
              },
              {
                title: "Waste Logs",
                value: stats?.totalWasteLogs || 0,
                subtitle: "Tracking food waste",
                icon: WasteIcon,
                color: "#d32f2f",
                bgColor: "#ffebee",
              },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.title}>
                <Grow in timeout={1000 + index * 200}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: "1px solid #f0f0f0",
                      borderRadius: 3,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 35px rgba(0,0,0,0.1)",
                        borderColor: stat.color,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: stat.bgColor,
                          color: stat.color,
                          width: 64,
                          height: 64,
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <stat.icon sx={{ fontSize: 32 }} />
                      </Avatar>
                      <Typography variant="h3" fontWeight={700} sx={{ color: stat.color, mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                        {stat.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {stat.subtitle}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>

          {/* Charts and Lists */}
          <Grid container spacing={4}>
            {/* Donation Status Chart */}
            <Grid item xs={12} lg={6}>
              <Grow in timeout={1600}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid #f0f0f0",
                    borderRadius: 3,
                    minWidth: 600, // <-- Added minWidth
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#1976d2" }}>
                        <ChartIcon />
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" fontWeight={700}>
                        Donations by Status
                      </Typography>
                    }
                    subheader="Current distribution of donation statuses"
                  />
                  <Divider />
                  <CardContent sx={{ p: 3 }}>
                    {stats?.donationsByStatus && stats.donationsByStatus.length > 0 ? (
                      <Box sx={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={stats.donationsByStatus}
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
                              {stats.donationsByStatus.map((entry, index) => (
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
                          <ChartIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
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

            {/* Waste by Type Chart */}
            <Grid item xs={12} lg={6}>
              <Grow in timeout={1800}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid #f0f0f0",
                    borderRadius: 3,
                    minWidth: 500, // <-- Added minWidth
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
                    {stats?.wasteByType && stats.wasteByType.length > 0 ? (
                      <Box sx={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={stats.wasteByType}
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
                            <Bar dataKey="value" fill="#d32f2f" radius={[4, 4, 0, 0]} />
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

            {/* Recent Donations */}
            <Grid item xs={12}>
              <Grow in timeout={2000}>
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid #f0f0f0",
                    borderRadius: 3,
                    minWidth: 400, // <-- Added minWidth
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
                        Recent Donations
                      </Typography>
                    }
                    subheader="Latest donation activity in the system"
                  />
                  <Divider />
                  <CardContent sx={{ p: 0 }}>
                    {stats?.recentDonations && stats.recentDonations.length > 0 ? (
                      <List sx={{ p: 0 }}>
                        {stats.recentDonations.map((donation, index) => (
                          <React.Fragment key={donation.id}>
                            <ListItem sx={{ px: 3, py: 2.5 }}>
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle1" fontWeight={600}>
                                    {donation.food_name}
                                  </Typography>
                                }
                                secondary={
                                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">
                                      {donation.donor_details?.first_name} {donation.donor_details?.last_name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      •
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {new Date(donation.created_at).toLocaleDateString()}
                                    </Typography>
                                  </Stack>
                                }
                              />
                              <Box sx={{ textAlign: "right" }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color:
                                      donation.status === "available"
                                        ? "#2e7d32"
                                        : donation.status === "claimed"
                                        ? "#1976d2"
                                        : donation.status === "received"
                                        ? "#0288d1"
                                        : "#d32f2f",
                                    fontWeight: 600,
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {donation.status}
                                </Typography>
                              </Box>
                            </ListItem>
                            {index < stats.recentDonations.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          py: 8,
                          textAlign: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#f5f5f5", width: 80, height: 80 }}>
                          <FoodIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                        </Avatar>
                        <Typography variant="h6" fontWeight={600}>
                          No recent donations
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Recent donation activity will appear here
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

export default AdminDashboard
