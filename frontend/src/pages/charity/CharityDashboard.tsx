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
  Alert,
  Button,
  Chip,
  Avatar,
  Stack,
  Container,
  IconButton,
  Fade,
  Grow,
} from "@mui/material"
import {
  TrendingUp,
  Schedule,
  CheckCircle,
  Inventory,
  LocationOn,
  CalendarToday,
  ArrowForward,
  Favorite,
  CardGiftcard,
  Assessment,
  Refresh,
} from "@mui/icons-material"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import type { Donation } from "../../types"

const COLORS = ["#1976d2", "#2e7d32", "#ed6c02", "#d32f2f", "#7b1fa2", "#0288d1"]

const CharityDashboard: React.FC = () => {
  const { user } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [claimedRes, availableRes] = await Promise.all([
          axios.get("/donations/claimed/"),
          axios.get("/donations/available/"),
        ])

        setDonations(claimedRes.data)
        setAvailableDonations(availableRes.data)
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "success"
      case "claimed":
        return "primary"
      case "received":
        return "info"
      case "expired":
        return "error"
      default:
        return "default"
    }
  }

  const getStatusChipSx = (status: string) => {
    switch (status) {
      case "available":
        return {
          bgcolor: "#e8f5e8",
          color: "#2e7d32",
          fontWeight: 600,
          "&:hover": { bgcolor: "#c8e6c9" },
        }
      case "claimed":
        return {
          bgcolor: "#e3f2fd",
          color: "#1976d2",
          fontWeight: 600,
          "&:hover": { bgcolor: "#bbdefb" },
        }
      case "received":
        return {
          bgcolor: "#e0f2f1",
          color: "#00695c",
          fontWeight: 600,
          "&:hover": { bgcolor: "#b2dfdb" },
        }
      case "expired":
        return {
          bgcolor: "#ffebee",
          color: "#c62828",
          fontWeight: 600,
          "&:hover": { bgcolor: "#ffcdd2" },
        }
      default:
        return {
          bgcolor: "#f5f5f5",
          color: "#424242",
          fontWeight: 600,
        }
    }
  }

  // Calculate statistics
  const totalClaimed = donations.length
  const pendingPickup = donations.filter((d) => d.status === "claimed").length
  const received = donations.filter((d) => d.status === "received").length
  const totalAvailable = availableDonations.length

  const donationsByStatus = [
    { name: "Claimed", value: pendingPickup, color: COLORS[0] },
    { name: "Received", value: received, color: COLORS[1] },
  ].filter((item) => item.value > 0)

  const recentClaims = [...donations]
    .sort((a, b) => new Date(b.claimed_at || b.created_at).getTime() - new Date(a.claimed_at || a.created_at).getTime())
    .slice(0, 5)

  const nearbyDonations = [...availableDonations].slice(0, 5)

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
            Loading your dashboard...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={800}>
        <Box>
          {/* Header Section */}
          <Box sx={{ mb: 4 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              spacing={3}
            >
              <Box>
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
                  Charity Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary" fontWeight={400}>
                  Manage your food donations and help those in need
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/charity/available-donations"
                startIcon={<CardGiftcard />}
                sx={{
                  bgcolor: "#1976d2",
                  px: 3,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
                  "&:hover": {
                    bgcolor: "#1565c0",
                    boxShadow: "0 12px 35px rgba(25, 118, 210, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Find Available Donations
              </Button>
            </Stack>
          </Box>

          {error && (
            <Grow in timeout={600}>
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                  "& .MuiAlert-icon": { fontSize: 24 },
                }}
                action={
                  <IconButton size="small" onClick={() => window.location.reload()}>
                    <Refresh />
                  </IconButton>
                }
              >
                {error}
              </Alert>
            </Grow>
          )}

          {/* Welcome Card */}
          <Grow in timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                background: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
                border: "1px solid #e1f5fe",
                borderRadius: 3,
              }}
            >
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "#1976d2",
                    width: 64,
                    height: 64,
                    boxShadow: "0 8px 25px rgba(25, 118, 210, 0.3)",
                  }}
                >
                  <Favorite sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={700} sx={{ color: "#1565c0", mb: 1 }}>
                    Welcome back, {user?.organization_name || `${user?.first_name} ${user?.last_name}`}!
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#1976d2", lineHeight: 1.6 }}>
                    Thank you for your work in helping distribute food to those in need. You have claimed{" "}
                    <Box component="span" fontWeight={700} color="#0d47a1">
                      {totalClaimed}
                    </Box>{" "}
                    donations so far.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grow>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              {
                title: "Total Claimed",
                value: totalClaimed,
                subtitle: "All time",
                icon: Inventory,
                color: "#1976d2",
                bgColor: "#e3f2fd",
              },
              {
                title: "Pending Pickup",
                value: pendingPickup,
                subtitle: "Ready for collection",
                icon: Schedule,
                color: "#ed6c02",
                bgColor: "#fff3e0",
              },
              {
                title: "Received",
                value: received,
                subtitle: "Successfully collected",
                icon: CheckCircle,
                color: "#2e7d32",
                bgColor: "#e8f5e8",
              },
              {
                title: "Available",
                value: totalAvailable,
                subtitle: "Donations you can claim",
                icon: TrendingUp,
                color: "#7b1fa2",
                bgColor: "#f3e5f5",
              },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={stat.title}>
                <Grow in timeout={1200 + index * 200}>
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: "1px solid #f0f0f0",
                      borderRadius: 4,
                      minWidth: 0, // Remove minWidth for compactness
                      width: "100%",
                    }}
                  >
                    <CardContent sx={{ p: 2, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: stat.bgColor,
                            color: stat.color,
                            width: 80,
                            height: 80,
                            fontSize: 20,
                          }}
                        >
                          <stat.icon sx={{ fontSize: 20 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ mb: 0.5 }}>
                            {stat.title}
                          </Typography>
                          <Typography variant="h5" fontWeight={700} sx={{ color: stat.color, mb: 0.5 }}>
                            {stat.value}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {stat.subtitle}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grow>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4}>
            {/* Donations by Status Chart */}
            <Grid item xs={12} md={8} lg={8}>
              <Grow in timeout={1600}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid #f0f0f0",
                    borderRadius: 3,
                    minWidth: 500, // adjust as needed
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#1976d2" }}>
                        <Assessment />
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" fontWeight={700}>
                        Your Donations by Status
                      </Typography>
                    }
                    subheader="Distribution of your claimed donations"
                  />
                  <Divider />
                  <CardContent sx={{ p: 3, minWidth: 350 }}>
                    {donationsByStatus.length > 0 ? (
                      <Box sx={{ height: 320 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={donationsByStatus}
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
                              {donationsByStatus.map((entry, index) => (
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
                          <Inventory sx={{ fontSize: 40, color: "#bdbdbd" }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                            No donation data available yet
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Start claiming donations to see your statistics
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          component={Link}
                          to="/charity/available-donations"
                          sx={{ borderRadius: 2 }}
                        >
                          Find Donations to Claim
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            </Grid>

            {/* Recent Claims */}
            <Grid item xs={12} lg={6}>
              <Grow in timeout={1800}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    border: "1px solid #f0f0f0",
                    borderRadius: 3,
                    minWidth: 500, // adjust as needed
                  }}
                >
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: "#ed6c02" }}>
                        <Schedule />
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" fontWeight={700}>
                        Recent Claims
                      </Typography>
                    }
                    subheader="Your latest donation claims"
                    action={
                      <Button
                        component={Link}
                        to="/charity/claimed-donations"
                        size="small"
                        endIcon={<ArrowForward />}
                        sx={{ borderRadius: 2 }}
                      >
                        View All
                      </Button>
                    }
                  />
                  <Divider />
                  <CardContent sx={{ p: 0, height: 320, overflow: "auto" }}>
                    {recentClaims.length > 0 ? (
                      <List sx={{ p: 0 }}>
                        {recentClaims.map((donation, index) => (
                          <React.Fragment key={donation.id}>
                            <ListItem sx={{ px: 3, py: 2 }}>
                              <ListItemText
                                primary={
                                  <Typography variant="subtitle1" fontWeight={600}>
                                    {donation.food_name}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2" color="text.secondary">
                                    {donation.donor_details?.first_name} {donation.donor_details?.last_name} •{" "}
                                    {donation.quantity}
                                  </Typography>
                                }
                              />
                              <Chip
                                label={donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                size="small"
                                sx={getStatusChipSx(donation.status)}
                              />
                            </ListItem>
                            {index < recentClaims.length - 1 && <Divider />}
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
                          height: "100%",
                          textAlign: "center",
                          gap: 2,
                          p: 3,
                        }}
                      >
                        <Avatar sx={{ bgcolor: "#f5f5f5", width: 64, height: 64 }}>
                          <Inventory sx={{ fontSize: 32, color: "#bdbdbd" }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                            No claims yet
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Start claiming donations to see them here
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          component={Link}
                          to="/charity/available-donations"
                          sx={{ borderRadius: 2 }}
                        >
                          Find Donations
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          </Grid>

          {/* Nearby Available Donations */}
          <Grow in timeout={2000}>
            <Card
              elevation={0}
              sx={{
                mt: 4,
                border: "1px solid #f0f0f0",
                borderRadius: 3,
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: "#7b1fa2" }}>
                    <LocationOn />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" fontWeight={700}>
                    Nearby Available Donations
                  </Typography>
                }
                subheader="Fresh donations ready for pickup in your area"
                action={
                  <Button
                    component={Link}
                    to="/charity/available-donations"
                    size="small"
                    endIcon={<ArrowForward />}
                    sx={{ borderRadius: 2 }}
                  >
                    View All
                  </Button>
                }
              />
              <Divider />
              <CardContent sx={{ p: 0 }}>
                {nearbyDonations.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {nearbyDonations.map((donation, index) => (
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
                                  {donation.quantity}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  •
                                </Typography>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                  <CalendarToday sx={{ fontSize: 14 }} />
                                  <Typography variant="body2" color="text.secondary">
                                    Expires: {new Date(donation.expiry_date).toLocaleDateString()}
                                  </Typography>
                                </Stack>
                              </Stack>
                            }
                          />
                          <Button
                            variant="outlined"
                            size="small"
                            component={Link}
                            to={`/charity/available-donations?view=${donation.id}`}
                            sx={{ borderRadius: 2 }}
                          >
                            View Details
                          </Button>
                        </ListItem>
                        {index < nearbyDonations.length - 1 && <Divider />}
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
                      <LocationOn sx={{ fontSize: 40, color: "#bdbdbd" }} />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                        No available donations
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Check back later for new donations in your area
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grow>
        </Box>
      </Fade>
    </Container>
  )
}

export default CharityDashboard
