"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import {
  Box,
  Typography,
  Grid,
  Paper,
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
  Container,
  Fade,
  Grow,
  Fab,
} from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import type { Donation, WasteLog } from "../../types"
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Inventory as InventoryIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Co2Outlined as EcoIcon,
  Favorite as FavoriteIcon,
  ArrowForward as ArrowForwardIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  LocalFlorist as LocalFloristIcon,
  Celebration as CelebrationIcon,
} from "@mui/icons-material"

const COLORS = ["#4caf50", "#2196f3", "#9c27b0", "#f44336"]

// Enhanced animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

// Enhanced styled components
const GradientBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
  backgroundSize: "400% 400%",
  animation: `${shimmer} 15s ease infinite`,
  minHeight: "100vh",
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(4),
  },
}))

const GlassCard = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: theme.spacing(3),
  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  animation: `${fadeInUp} 0.6s ease-out`,
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 30px 60px rgba(0, 0, 0, 0.15)",
  },
}))

const WelcomeCard = styled(GlassCard)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)",
  border: "2px solid rgba(76, 175, 80, 0.3)",
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)",
    transform: "translateX(-100%)",
    transition: "transform 0.6s",
  },
  "&:hover::before": {
    transform: "translateX(100%)",
  },
}))

const StatsCard = styled(GlassCard)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: "center",
  position: "relative",
  overflow: "hidden",
  "&::after": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #4caf50, #2196f3, #9c27b0, #ff9800)",
    transform: "scaleX(0)",
    transformOrigin: "left",
    transition: "transform 0.3s ease",
  },
  "&:hover::after": {
    transform: "scaleX(1)",
  },
  "&:hover": {
    "& .stats-icon": {
      animation: `${pulse} 1s ease-in-out`,
    },
  },
}))

const ChartCard = styled(GlassCard)(({ theme }) => ({
  overflow: "hidden",
  "& .MuiCardHeader-root": {
    background: "linear-gradient(135deg, rgba(63, 81, 181, 0.05) 0%, rgba(103, 58, 183, 0.05) 100%)",
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
  },
}))

const ActionCard = styled(Paper)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  textAlign: "center",
  border: "2px solid transparent",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  minHeight: "140px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: theme.spacing(1),
  textDecoration: "none",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
    transform: "translateX(-100%)",
    transition: "transform 0.6s",
  },
  "&:hover": {
    transform: "translateY(-8px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    "&::before": {
      transform: "translateX(100%)",
    },
    "& .action-icon": {
      transform: "scale(1.2) rotate(5deg)",
    },
  },
}))

const ImpactCard = styled(GlassCard)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)",
  border: "2px solid rgba(76, 175, 80, 0.3)",
  padding: theme.spacing(4),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: "linear-gradient(45deg, #4caf50, #8bc34a, #cddc39, #ffeb3b)",
    borderRadius: theme.spacing(3),
    zIndex: -1,
    opacity: 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover::before": {
    opacity: 0.3,
  },
}))

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "available":
        return {
          background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c8 100%)",
          color: "#2e7d32",
          border: "1px solid #4caf50",
          "& .MuiChip-icon": { color: "#4caf50" },
        }
      case "claimed":
        return {
          background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
          color: "#1565c0",
          border: "1px solid #2196f3",
          "& .MuiChip-icon": { color: "#2196f3" },
        }
      case "received":
        return {
          background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
          color: "#7b1fa2",
          border: "1px solid #9c27b0",
          "& .MuiChip-icon": { color: "#9c27b0" },
        }
      case "expired":
        return {
          background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
          color: "#c62828",
          border: "1px solid #f44336",
          "& .MuiChip-icon": { color: "#f44336" },
        }
      default:
        return {
          background: "linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)",
          color: "#616161",
          border: "1px solid #9e9e9e",
          "& .MuiChip-icon": { color: "#9e9e9e" },
        }
    }
  }

  return {
    ...getStatusStyles(),
    fontWeight: 600,
    borderRadius: theme.spacing(2),
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  }
})

const StyledFab = styled(Fab)(({ theme }) => ({
  position: "fixed",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)",
  zIndex: 1000,
  "&:hover": {
    background: "linear-gradient(135deg, #45a049 0%, #388e3c 100%)",
    transform: "scale(1.1)",
    boxShadow: "0 12px 35px rgba(76, 175, 80, 0.6)",
  },
}))

const DonorDashboard: React.FC = () => {
  const { user } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [donationsRes, wasteLogsRes] = await Promise.all([
          axios.get("/donations/my_donations/"),
          axios.get("/waste-logs/my_logs/"),
        ])

        setDonations(donationsRes.data)
        setWasteLogs(wasteLogsRes.data)
      } catch (err) {
        setError("Failed to load dashboard data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <InventoryIcon fontSize="small" />
      case "claimed":
        return <ScheduleIcon fontSize="small" />
      case "received":
        return <CheckCircleIcon fontSize="small" />
      case "expired":
        return <CancelIcon fontSize="small" />
      default:
        return <InventoryIcon fontSize="small" />
    }
  }

  // Calculate statistics
  const totalDonations = donations.length
  const availableDonations = donations.filter((d) => d.status === "available").length
  const claimedDonations = donations.filter((d) => d.status === "claimed").length
  const receivedDonations = donations.filter((d) => d.status === "received").length
  const expiredDonations = donations.filter((d) => d.status === "expired").length

  const donationsByStatus = [
    { name: "Available", value: availableDonations },
    { name: "Claimed", value: claimedDonations },
    { name: "Received", value: receivedDonations },
    { name: "Expired", value: expiredDonations },
  ].filter((item) => item.value > 0)

  const totalWasteLogs = wasteLogs.length
  const recentDonations = [...donations]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  if (loading) {
    return (
      <GradientBox>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "80vh",
            }}
          >
            <Box sx={{ position: "relative", mb: 4 }}>
              <CircularProgress
                size={80}
                thickness={4}
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  animationDuration: "550ms",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                <DashboardIcon sx={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
              </Box>
            </Box>
            <Typography
              variant="h5"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontWeight: 600,
                textAlign: "center",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              Loading your dashboard...
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.7)",
                textAlign: "center",
                mt: 1,
              }}
            >
              Preparing your impact data
            </Typography>
          </Box>
        </Container>
      </GradientBox>
    )
  }

  return (
    <GradientBox>
      <Container maxWidth="xl">
        {/* Header */}
        <Fade in timeout={800}>
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                    mb: 1,
                  }}
                >
                  Donor Dashboard
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 500,
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Track your food donations and waste reduction impact
                </Typography>
              </Box>
              <Button
                variant="contained"
                component={Link}
                to="/donor/add-donation"
                startIcon={<AddIcon />}
                sx={{
                  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                  borderRadius: 4,
                  px: 4,
                  py: 2,
                  textTransform: "none",
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)",
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #45a049 0%, #388e3c 100%)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 35px rgba(76, 175, 80, 0.6)",
                  },
                }}
              >
                Add New Donation
              </Button>
            </Box>
          </Box>
        </Fade>

        {error && (
          <Fade in timeout={600}>
            <Alert
              severity="error"
              sx={{
                mb: 4,
                borderRadius: 3,
                background: "rgba(244, 67, 54, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(244, 67, 54, 0.3)",
                "& .MuiAlert-icon": { color: "#f44336" },
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}

        {/* Welcome Card */}
        <Grow in timeout={1000}>
          <WelcomeCard elevation={0}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Avatar
                sx={{
                  bgcolor: "transparent",
                  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                  width: 80,
                  height: 80,
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
                }}
              >
                <FavoriteIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "white", // changed from "transparent" to "white"
                    mb: 2,
                  }}
                >
                  Welcome back, {user?.first_name}! 🌟
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ffffff",
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  Thank you for your incredible contributions to reducing food waste and helping those in need. You have
                  made <strong style={{ color: "#7cf573" }}>{totalDonations} donations</strong> and logged{" "}
                  <strong style={{ color: "#f57c00" }}>{totalWasteLogs} waste entries</strong> so far. Your impact is
                  making a real difference! 🙏
                </Typography>
              </Box>
            </Box>
          </WelcomeCard>
        </Grow>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            {
              title: "Total Donations",
              value: totalDonations,
              subtitle: `${availableDonations} Available`,
              icon: InventoryIcon,
              color: "#4caf50",
              bgColor: "rgba(76, 175, 80, 0.1)",
            },
            {
              title: "Claimed Items",
              value: claimedDonations,
              subtitle: "Awaiting pickup",
              icon: ScheduleIcon,
              color: "#2196f3",
              bgColor: "rgba(33, 150, 243, 0.1)",
            },
            {
              title: "Successfully Donated",
              value: receivedDonations,
              subtitle: "Completed donations",
              icon: CheckCircleIcon,
              color: "#9c27b0",
              bgColor: "rgba(156, 39, 176, 0.1)",
            },
            {
              title: "Waste Tracked",
              value: totalWasteLogs,
              subtitle: "Food waste entries",
              icon: DeleteIcon,
              color: "#ff9800",
              bgColor: "rgba(255, 152, 0, 0.1)",
            },
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} lg={3} key={stat.title}>
              <Grow in timeout={1200 + index * 200}>
                <StatsCard elevation={0}>
                  <Avatar
                    className="stats-icon"
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 72,
                      height: 72,
                      mx: "auto",
                      mb: 3,
                      boxShadow: `0 8px 25px ${stat.color}30`,
                    }}
                  >
                    <stat.icon sx={{ fontSize: 36 }} />
                  </Avatar>
                  <Typography
                    variant="h3"
                    sx={{
                      fontWeight: 800,
                      color: stat.color,
                      mb: 1,
                      textShadow: `0 2px 4px ${stat.color}20`,
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#333" }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {stat.subtitle}
                  </Typography>
                </StatsCard>
              </Grow>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Donations by Status Chart */}
          <Grid item xs={12} lg={6}>
            <Grow in timeout={1600}>
              <ChartCard>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "rgba(63, 81, 181, 0.1)" }}>
                      <AnalyticsIcon sx={{ color: "#3f51b5" }} />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                      Donations Analytics
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body1" sx={{ color: "#666", fontWeight: 500 }}>
                      Distribution of your donation statuses
                    </Typography>
                  }
                />
                <Divider />
                <CardContent>
                  {donationsByStatus.length > 0 ? (
                    <Box sx={{ height: 350 }}>
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
                            strokeWidth={3}
                            stroke="#fff"
                          >
                            {donationsByStatus.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: "rgba(255, 255, 255, 0.95)",
                              backdropFilter: "blur(10px)",
                              border: "1px solid rgba(0, 0, 0, 0.1)",
                              borderRadius: "12px",
                              boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
                            }}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Box sx={{ p: 6, textAlign: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(158, 158, 158, 0.1)",
                          width: 80,
                          height: 80,
                          mx: "auto",
                          mb: 3,
                        }}
                      >
                        <InventoryIcon sx={{ fontSize: 40, color: "#ccc" }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: "#333" }}>
                        No donation data yet
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Start making a difference in your community today
                      </Typography>
                      <Button
                        variant="contained"
                        component={Link}
                        to="/donor/add-donation"
                        startIcon={<AddIcon />}
                        sx={{
                          background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          textTransform: "none",
                        }}
                      >
                        Make Your First Donation
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </ChartCard>
            </Grow>
          </Grid>

          {/* Recent Donations */}
          <Grid item xs={12} lg={6}>
            <Grow in timeout={1800}>
              <ChartCard>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "rgba(76, 175, 80, 0.1)" }}>
                      <ScheduleIcon sx={{ color: "#4caf50" }} />
                    </Avatar>
                  }
                  title={
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                      Recent Activity
                    </Typography>
                  }
                  subheader={
                    <Typography variant="body1" sx={{ color: "#666", fontWeight: 500 }}>
                      Your latest donation activities
                    </Typography>
                  }
                  action={
                    <Button
                      component={Link}
                      to="/donor/my-donations"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 2,
                        color: "#4caf50",
                        "&:hover": { bgcolor: "rgba(76, 175, 80, 0.1)" },
                      }}
                    >
                      View All
                    </Button>
                  }
                />
                <Divider />
                <CardContent sx={{ p: 0, maxHeight: 400, overflow: "auto" }}>
                  {recentDonations.length > 0 ? (
                    <List>
                      {recentDonations.map((donation, index) => (
                        <React.Fragment key={donation.id}>
                          <ListItem sx={{ py: 3, px: 3 }}>
                            <Avatar
                              sx={{
                                mr: 3,
                                bgcolor: "rgba(76, 175, 80, 0.1)",
                                color: "#4caf50",
                                width: 48,
                                height: 48,
                              }}
                            >
                              {getStatusIcon(donation.status)}
                            </Avatar>
                            <ListItemText
                              primary={
                                <Typography variant="h6" sx={{ fontWeight: 600, color: "#333", mb: 0.5 }}>
                                  {donation.food_name}
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                                  {new Date(donation.created_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })}{" "}
                                  • {donation.quantity}
                                </Typography>
                              }
                            />
                            <StatusChip
                              status={donation.status}
                              label={donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                              size="medium"
                              icon={getStatusIcon(donation.status)}
                            />
                          </ListItem>
                          {index < recentDonations.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  ) : (
                    <Box sx={{ p: 6, textAlign: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(158, 158, 158, 0.1)",
                          width: 64,
                          height: 64,
                          mx: "auto",
                          mb: 3,
                        }}
                      >
                        <InventoryIcon sx={{ fontSize: 32, color: "#ccc" }} />
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: "#333" }}>
                        No donations yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Start your journey of giving back
                      </Typography>
                      <Button
                        variant="contained"
                        component={Link}
                        to="/donor/add-donation"
                        startIcon={<AddIcon />}
                        sx={{
                          background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: "none",
                        }}
                      >
                        Add Donation
                      </Button>
                    </Box>
                  )}
                </CardContent>
              </ChartCard>
            </Grow>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Grow in timeout={2000}>
          <ChartCard sx={{ mb: 6 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "rgba(156, 39, 176, 0.1)" }}>
                  <DashboardIcon sx={{ color: "#9c27b0" }} />
                </Avatar>
              }
              title={
                <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                  Quick Actions
                </Typography>
              }
              subheader={
                <Typography variant="body1" sx={{ color: "#666", fontWeight: 500 }}>
                  Common tasks and shortcuts for efficient management
                </Typography>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                {[
                  {
                    to: "/donor/add-donation",
                    icon: AddIcon,
                    title: "Add New Donation",
                    subtitle: "Share surplus food with those in need",
                    color: "#4caf50",
                    bgColor: "rgba(76, 175, 80, 0.1)",
                  },
                  {
                    to: "/donor/my-donations",
                    icon: VisibilityIcon,
                    title: "View My Donations",
                    subtitle: "Track and manage donation status",
                    color: "#2196f3",
                    bgColor: "rgba(33, 150, 243, 0.1)",
                  },
                  {
                    to: "/donor/track-waste",
                    icon: DeleteIcon,
                    title: "Track Food Waste",
                    subtitle: "Log and monitor waste reduction",
                    color: "#ff9800",
                    bgColor: "rgba(255, 152, 0, 0.1)",
                  },
                  {
                    to: "/donor/profile",
                    icon: PersonIcon,
                    title: "Update Profile",
                    subtitle: "Manage account and preferences",
                    color: "#9c27b0",
                    bgColor: "rgba(156, 39, 176, 0.1)",
                  },
                ].map((action, index) => (
                  <Grid item xs={12} sm={6} lg={3} key={action.title}>
                    <Link to={action.to} style={{ textDecoration: "none" }}>
                      <ActionCard
                        sx={{
                          borderColor: action.color,
                          "&:hover": {
                            borderColor: action.color,
                            background: action.bgColor,
                          },
                        }}
                      >
                        <Avatar
                          className="action-icon"
                          sx={{
                            bgcolor: action.bgColor,
                            color: action.color,
                            width: 56,
                            height: 56,
                            mb: 2,
                            transition: "all 0.3s ease",
                          }}
                        >
                          <action.icon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: "#333",
                            mb: 1,
                            textAlign: "center",
                          }}
                        >
                          {action.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#666",
                            textAlign: "center",
                            fontWeight: 500,
                          }}
                        >
                          {action.subtitle}
                        </Typography>
                      </ActionCard>
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </ChartCard>
        </Grow>

        {/* Impact Summary */}
        <Grow in timeout={2200}>
          <ImpactCard elevation={0}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <Avatar
                sx={{
                  bgcolor: "transparent",
                  background: "linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)",
                  width: 80,
                  height: 80,
                  mr: 3,
                  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.3)",
                }}
              >
                <LocalFloristIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "white", // changed from "transparent" to "white"
                    mb: 1,
                  }}
                >
                  Your Impact Summary 🌍
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#8fff87",
                    fontWeight: 600,
                  }}
                >
                  Making a meaningful difference in your community
                </Typography>
              </Box>
            </Box>
            <Grid container spacing={4}>
              {[
                {
                  value: receivedDonations,
                  label: "Families Helped",
                  icon: CelebrationIcon,
                  color: "#8fff87",
                },
                {
                  value: totalDonations,
                  label: "Total Donations",
                  icon: FavoriteIcon,
                  color: "#4bacfa",
                },
                {
                  value: totalWasteLogs,
                  label: "Waste Entries Logged",
                  icon: EcoIcon,
                  color: "#ffc063",
                },
              ].map((impact, index) => (
                <Grid item xs={12} md={4} key={impact.label}>
                  <Box sx={{ textAlign: "center" }}>
                    <Avatar
                      sx={{
                        bgcolor: `${impact.color}20`,
                        color: impact.color,
                        width: 64,
                        height: 64,
                        mx: "auto",
                        mb: 2,
                        boxShadow: `0 8px 25px ${impact.color}30`,
                      }}
                    >
                      <impact.icon sx={{ fontSize: 32 }} />
                    </Avatar>
                    <Typography
                      variant="h2"
                      sx={{
                        fontWeight: 900,
                        color: impact.color,
                        mb: 1,
                        textShadow: `0 2px 4px ${impact.color}20`,
                      }}
                    >
                      {impact.value}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#8fff87",
                        fontWeight: 700,
                      }}
                    >
                      {impact.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </ImpactCard>
        </Grow>

        {/* Floating Action Button */}
        <Link to="/donor/add-donation" style={{ textDecoration: "none" }}>
          <StyledFab aria-label="Add new donation">
            <AddIcon sx={{ fontSize: 32, color: "white" }} />
          </StyledFab>
        </Link>
      </Container>
    </GradientBox>
  )
}

export default DonorDashboard
