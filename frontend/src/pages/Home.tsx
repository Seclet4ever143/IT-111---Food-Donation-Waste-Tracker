"use client"

import React, { useState } from "react"
import type { ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  Box,
  Button,
  Container,
  Typography,
  Grid as Grid,
  Card,
  CardContent,
  TextField,
  Chip,
  Paper,
  Avatar,
  Rating,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import {
  Favorite as HeartIcon,
  TrendingDown,
  People as UsersIcon,
  BarChart as BarChart3Icon,
  LocationOn as MapPinIcon,
  Schedule as ClockIcon,
  Co2Outlined as LeafIcon,
  TrackChanges as TargetIcon,
  CheckCircle,
  ArrowForward as ArrowRightIcon,
} from "@mui/icons-material"

const dashboardImages = [
  {
    src: "/DonorDashboard.png",
    alt: "Food donation tracking dashboard",
  },
  {
    src: "/CharityDashboard.png",
    alt: "Charity dashboard",
  },
  {
    src: "/AdminDashboard.png",
    alt: "Admin dashboard",
  },
]

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const handleGetStarted = () => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin/dashboard")
      } else if (user.role === "donor") {
        navigate("/donor/dashboard")
      } else if (user.role === "charity") {
        navigate("/charity/dashboard")
      }
    } else {
      navigate("/register")
    }
  }

  const handleSignIn = () => {
    if (isAuthenticated && user) {
      handleGetStarted()
    } else {
      navigate("/login")
    }
  }

  // Pagination state
  const [page, setPage] = useState(0)
  const imagesPerPage = 1 // Show 1 image at a time, change to 2 or 3 if you want more per page

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0))
  const handleNext = () => setPage((prev) => Math.min(prev + 1, dashboardImages.length - imagesPerPage))

  // Slice images for current page
  const pagedImages = dashboardImages.slice(page, page + imagesPerPage)

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <AppBar
        position="sticky"
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          color: "text.primary",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          zIndex: 1100,
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#4caf50",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 1,
                }}
              >
                <HeartIcon sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1a1a1a" }}>
                Food Donation & Waste Tracker
              </Typography>
            </Box>
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 3, mr: 3 }}>
              <Typography
                component="a"
                href="#features"
                sx={{
                  textDecoration: "none",
                  color: "text.primary",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  "&:hover": { color: "#4caf50" },
                  cursor: "pointer",
                }}
              >
                Features
              </Typography>
              <Typography
                component="a"
                href="#impact"
                sx={{
                  textDecoration: "none",
                  color: "text.primary",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  "&:hover": { color: "#4caf50" },
                  cursor: "pointer",
                }}
              >
                Impact
              </Typography>
              <Typography
                component="a"
                href="#about"
                sx={{
                  textDecoration: "none",
                  color: "text.primary",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  "&:hover": { color: "#4caf50" },
                  cursor: "pointer",
                }}
              >
                About
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="text" size="small" onClick={handleSignIn}>
              {isAuthenticated ? "Dashboard" : "Sign In"}
            </Button>
            <Button
              variant="contained"
              size="small"
              onClick={handleGetStarted}
              sx={{ bgcolor: "#4caf50", "&:hover": { bgcolor: "#45a049" } }}
            >
              Get Started
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, width: "100%" }}>
        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 4, sm: 6, md: 8, lg: 12 },
            px: { xs: 2, sm: 3 },
            background: "linear-gradient(135deg, #f1f8e9 0%, #e3f2fd 100%)",
            minHeight: { xs: "auto", md: "80vh" },
            display: "flex",
            alignItems: "center",
          }}
        >
          <Container maxWidth="xl" sx={{ width: "100%" }}>
            <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "center" }}>
              <Grid size={{ xs: 12, lg: 7 }}>
                <Box sx={{ maxWidth: { xs: "100%", lg: "90%" } }}>
                  <Chip
                    label="🌱 Reducing Food Waste Together"
                    sx={{
                      bgcolor: "#e8f5e8",
                      color: "#2e7d32",
                      mb: { xs: 2, sm: 3 },
                      fontWeight: 500,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  />
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem", lg: "3.5rem", xl: "4rem" },
                      fontWeight: "bold",
                      lineHeight: { xs: 1.2, md: 1.1 },
                      mb: { xs: 2, sm: 3 },
                      color: "#1a1a1a",
                    }}
                  >
                    Track Food Donations &{" "}
                    <Box component="span" sx={{ color: "#4caf50" }}>
                      Reduce Waste
                    </Box>
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.125rem", md: "1.25rem" },
                      color: "text.secondary",
                      mb: { xs: 3, sm: 4 },
                      lineHeight: 1.6,
                      fontWeight: 400,
                    }}
                  >
                    Connect donors, recipients, and volunteers in one platform. Track your impact, reduce food waste,
                    and help feed communities in need.
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: { xs: 3, sm: 4 } }}
                  >
                    <Button
                      variant="contained"
                      size="large"
                      onClick={handleGetStarted}
                      endIcon={<ArrowRightIcon />}
                      sx={{
                        bgcolor: "#4caf50",
                        "&:hover": { bgcolor: "#45a049" },
                        py: { xs: 1.5, sm: 2 },
                        px: { xs: 3, sm: 4 },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        fontWeight: 600,
                      }}
                    >
                      Start Tracking Impact
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      sx={{
                        py: { xs: 1.5, sm: 2 },
                        px: { xs: 3, sm: 4 },
                        borderColor: "#4caf50",
                        color: "#4caf50",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        fontWeight: 600,
                        "&:hover": { borderColor: "#45a049", bgcolor: "rgba(76, 175, 80, 0.04)" },
                      }}
                    >
                      Watch Demo
                    </Button>
                  </Box>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 3 }, color: "text.secondary" }}>
                    {["Free to use", "Real-time tracking", "Community driven"].map((text) => (
                      <Box key={text} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CheckCircle sx={{ color: "#4caf50", fontSize: { xs: 16, sm: 18 } }} />
                        <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                          {text}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, lg: 5 }}>
                <Box sx={{ position: "relative", textAlign: "center", mt: { xs: 4, lg: 0 } }}>
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                    {pagedImages.map((img, idx) => (
                      <Box
                        key={img.src}
                        component="img"
                        src={img.src}
                        alt={img.alt}
                        sx={{
                          width: "100%",
                          maxWidth: { xs: 400, sm: 500, md: 600 },
                          height: "auto",
                          borderRadius: 3,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                          transition: "all 0.3s",
                        }}
                      />
                    ))}
                  </Box>
                  {/* Pagination controls */}
                  <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handlePrev}
                      disabled={page === 0}
                    >
                      Prev
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleNext}
                      disabled={page >= dashboardImages.length - imagesPerPage}
                    >
                      Next
                    </Button>
                  </Box>
                  <Paper
                    sx={{
                      position: "absolute",
                      bottom: { xs: -8, sm: -16 },
                      left: { xs: -8, sm: -16 },
                      p: { xs: 1.5, sm: 2 },
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      boxShadow: 3,
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        bgcolor: "#4caf50",
                        borderRadius: "50%",
                        animation: "pulse 2s infinite",
                        "@keyframes pulse": {
                          "0%": { opacity: 1 },
                          "50%": { opacity: 0.5 },
                          "100%": { opacity: 1 },
                        },
                      }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                      Live tracking active
                    </Typography>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Impact Stats */}
        <Box id="impact" sx={{ py: { xs: 4, sm: 6, md: 8 }, bgcolor: "white" }}>
          <Container maxWidth="lg">
            <Grid container spacing={{ xs: 2, sm: 4 }}>
              {[
                { value: "2.5M+", label: "Meals Donated", color: "#4caf50" },
                { value: "850K", label: "Pounds Saved", color: "#2196f3" },
                { value: "12K+", label: "Active Users", color: "#9c27b0" },
                { value: "500+", label: "Partner Organizations", color: "#ff9800" },
              ].map((stat, index) => (
                <Grid size={{ xs: 6, md: 3 }} key={index}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: "bold",
                        color: stat.color,
                        mb: 1,
                        fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    >
                      {stat.label}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Features Section */}
        <Box id="features" sx={{ py: { xs: 4, sm: 6, md: 8 }, bgcolor: "#fafafa" }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 6, md: 8 } }}>
              <Chip
                label="Features"
                sx={{
                  bgcolor: "#e3f2fd",
                  color: "#1976d2",
                  mb: 2,
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                }}
              >
                Everything you need to make an impact
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  maxWidth: "900px",
                  mx: "auto",
                  lineHeight: 1.6,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  fontWeight: 400,
                }}
              >
                Our comprehensive platform provides all the tools needed to track, manage, and optimize food donations
                while reducing waste.
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {[
                {
                  icon: <HeartIcon sx={{ fontSize: 24, color: "#4caf50" }} />,
                  title: "Donation Tracking",
                  description:
                    "Log and track food donations in real-time with detailed categorization and impact metrics.",
                  color: "#e8f5e8",
                },
                {
                  icon: <TrendingDown sx={{ fontSize: 24, color: "#2196f3" }} />,
                  title: "Waste Reduction",
                  description:
                    "Monitor and analyze food waste patterns to identify opportunities for improvement and cost savings.",
                  color: "#e3f2fd",
                },
                {
                  icon: <UsersIcon sx={{ fontSize: 24, color: "#9c27b0" }} />,
                  title: "Community Network",
                  description:
                    "Connect with local food banks, shelters, and volunteers to maximize distribution efficiency.",
                  color: "#f3e5f5",
                },
                {
                  icon: <BarChart3Icon sx={{ fontSize: 24, color: "#ff9800" }} />,
                  title: "Analytics Dashboard",
                  description:
                    "Comprehensive reporting and analytics to measure impact and optimize donation strategies.",
                  color: "#fff3e0",
                },
                {
                  icon: <MapPinIcon sx={{ fontSize: 24, color: "#f44336" }} />,
                  title: "Location Mapping",
                  description: "GPS-enabled tracking for pickup and delivery locations with route optimization.",
                  color: "#ffebee",
                },
                {
                  icon: <ClockIcon sx={{ fontSize: 24, color: "#ffeb3b" }} />,
                  title: "Smart Scheduling",
                  description: "Automated scheduling and notifications for pickups, deliveries, and expiration alerts.",
                  color: "#fffde7",
                },
              ].map((feature, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Card sx={{ height: "100%", border: 0, boxShadow: 3 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: feature.color,
                          borderRadius: 1.5,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mb: 2,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          mb: 1,
                          fontSize: { xs: "1rem", sm: "1.125rem" },
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.875rem", sm: "0.875rem" } }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* How It Works */}
        <Box sx={{ py: { xs: 4, sm: 6, md: 8 }, bgcolor: "white" }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 6, md: 8 } }}>
              <Chip
                label="How It Works"
                sx={{
                  bgcolor: "#e8f5e8",
                  color: "#2e7d32",
                  mb: 2,
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                }}
              >
                Simple steps to make a difference
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 4, md: 6 }}>
              {[
                {
                  step: "1",
                  title: "Register & Connect",
                  description: "Sign up as a donor, recipient, or volunteer and connect with your local food network.",
                  color: "#4caf50",
                },
                {
                  step: "2",
                  title: "Track & Log",
                  description:
                    "Log food donations, track waste reduction, and monitor your environmental impact in real-time.",
                  color: "#2196f3",
                },
                {
                  step: "3",
                  title: "Measure Impact",
                  description:
                    "View detailed analytics and reports showing your contribution to reducing hunger and waste.",
                  color: "#9c27b0",
                },
              ].map((item, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        width: { xs: 56, sm: 64 },
                        height: { xs: 56, sm: 64 },
                        bgcolor: item.color,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: { xs: "1.25rem", sm: "1.5rem" },
                        }}
                      >
                        {item.step}
                      </Typography>
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        mb: 1,
                        fontSize: { xs: "1rem", sm: "1.125rem" },
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Testimonials */}
        <Box sx={{ py: { xs: 4, sm: 6, md: 8 }, bgcolor: "#fafafa" }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: { xs: 4, sm: 6, md: 8 } }}>
              <Chip
                label="Testimonials"
                sx={{
                  bgcolor: "#fff8e1",
                  color: "#f57c00",
                  mb: 2,
                  fontWeight: 500,
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                }}
              >
                Trusted by communities worldwide
              </Typography>
            </Box>

            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
              {[
                {
                  rating: 5,
                  text: "FoodSpot has revolutionized how we track our donations. We've reduced waste by 40% and helped feed 2,000 more families this year.",
                  name: "Sarah Johnson",
                  role: "Community Food Bank Director",
                },
                {
                  rating: 5,
                  text: "The analytics dashboard gives us incredible insights into our impact. It's amazing to see the real difference we're making.",
                  name: "Michael Chen",
                  role: "Restaurant Owner",
                },
                {
                  rating: 5,
                  text: "As a volunteer coordinator, this platform makes it so easy to organize pickups and track our volunteer hours and impact.",
                  name: "Emily Rodriguez",
                  role: "Volunteer Coordinator",
                },
              ].map((testimonial, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Card sx={{ height: "100%", border: 0, boxShadow: 3 }}>
                    <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                      <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 3,
                          fontStyle: "italic",
                          fontSize: { xs: "0.875rem", sm: "1rem" },
                        }}
                      >
                        "{testimonial.text}"
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, bgcolor: "#e0e0e0" }} />
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 500,
                              fontSize: { xs: "0.75rem", sm: "0.875rem" },
                            }}
                          >
                            {testimonial.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: { xs: "0.625rem", sm: "0.75rem" } }}
                          >
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box
          sx={{
            py: { xs: 4, sm: 6, md: 8 },
            background: "linear-gradient(135deg, #4caf50 0%, #2196f3 100%)",
            color: "white",
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ textAlign: "center" }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.75rem" },
                }}
              >
                Ready to make a difference?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: "600px",
                  mx: "auto",
                  lineHeight: 1.6,
                  fontSize: { xs: "1rem", sm: "1.125rem" },
                  fontWeight: 400,
                }}
              >
                Join thousands of organizations and individuals working together to reduce food waste and fight hunger.
              </Typography>

              <Box sx={{ maxWidth: 400, mx: "auto", mb: 4 }}>
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    type="email"
                    placeholder="Enter your email"
                    variant="outlined"
                    size="small"
                    sx={{
                      flexGrow: 1,
                      "& .MuiOutlinedInput-root": {
                        bgcolor: "rgba(255,255,255,0.1)",
                        color: "white",
                        "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                        "&.Mui-focused fieldset": { borderColor: "white" },
                      },
                      "& .MuiInputBase-input::placeholder": { color: "rgba(255,255,255,0.7)" },
                    }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "white",
                      color: "#4caf50",
                      "&:hover": { bgcolor: "#f5f5f5" },
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: { xs: "0.625rem", sm: "0.75rem" } }}>
                  Free to join. Start tracking your impact today.
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<TargetIcon />}
                  onClick={handleGetStarted}
                  sx={{
                    bgcolor: "white",
                    color: "#4caf50",
                    "&:hover": { bgcolor: "#f5f5f5" },
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 3, sm: 4 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 600,
                  }}
                >
                  Start as Donor
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<LeafIcon />}
                  onClick={handleGetStarted}
                  sx={{
                    borderColor: "white",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.1)", borderColor: "white" },
                    py: { xs: 1.5, sm: 2 },
                    px: { xs: 3, sm: 4 },
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                    fontWeight: 600,
                  }}
                >
                  Join as Volunteer
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          bgcolor: "#fafafa",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  bgcolor: "#4caf50",
                  borderRadius: 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HeartIcon sx={{ color: "white", fontSize: 16 }} />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                FoodSpot
              </Typography>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                flexGrow: 1,
                textAlign: { xs: "center", sm: "left" },
                fontSize: { xs: "0.625rem", sm: "0.75rem" },
              }}
            >
              © 2024 FoodSpot. All rights reserved. Making a difference, one meal at a time.
            </Typography>

            <Box sx={{ display: "flex", gap: 2 }}>
              {["Terms of Service", "Privacy Policy", "Contact"].map((link) => (
                <Typography
                  key={link}
                  component="a"
                  href="#"
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                    fontSize: { xs: "0.625rem", sm: "0.75rem" },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
