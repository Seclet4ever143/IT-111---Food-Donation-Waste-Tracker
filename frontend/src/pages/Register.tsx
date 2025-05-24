"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Collapse,
  Avatar,
  Stack,
  Fade,
  Grow,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Chip,
} from "@mui/material"
import {
  PersonAdd as RegisterIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Visibility,
  VisibilityOff,
  Star as StarIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material"

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register, isAuthenticated, user, error: authError } = useAuth()
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPassword2, setShowPassword2] = useState(false)
  const [formProgress, setFormProgress] = useState(0)

  const error = localError || authError

  // Form fields
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [role, setRole] = useState("donor")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [organizationName, setOrganizationName] = useState("")
  const [organizationDescription, setOrganizationDescription] = useState("")

  // Calculate form progress
  useEffect(() => {
    const requiredFields = [firstName, lastName, email, password, password2]
    const optionalFields = [phoneNumber, address, city, state, zipCode]
    const charityFields = role === "charity" ? [organizationName] : []

    const allFields = [...requiredFields, ...optionalFields, ...charityFields]
    const filledFields = allFields.filter((field) => field.trim() !== "").length
    const progress = (filledFields / allFields.length) * 100
    setFormProgress(progress)
  }, [
    firstName,
    lastName,
    email,
    password,
    password2,
    phoneNumber,
    address,
    city,
    state,
    zipCode,
    organizationName,
    role,
  ])

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard")
      } else if (user.role === "donor") {
        navigate("/donor/dashboard")
      } else if (user.role === "charity") {
        navigate("/charity/dashboard")
      }
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    if (localError) {
      setLocalError(null)
    }
  }, [email, password, password2, firstName, lastName, role, organizationName])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
      setLocalError("Please fill in all required fields")
      return
    }

    if (password !== password2) {
      setLocalError("Passwords do not match")
      return
    }

    if (role === "charity" && !organizationName) {
      setLocalError("Organization name is required for charities")
      return
    }

    setLoading(true)

    try {
      const userData = {
        email,
        password,
        password2,
        first_name: firstName,
        last_name: lastName,
        role,
        phone_number: phoneNumber,
        address,
        city,
        state,
        zip_code: zipCode,
        organization_name: organizationName,
        organization_description: organizationDescription,
      }

      await register(userData)
      setSuccess(true)

      // Reset form
      setEmail("")
      setPassword("")
      setPassword2("")
      setFirstName("")
      setLastName("")
      setRole("donor")
      setPhoneNumber("")
      setAddress("")
      setCity("")
      setState("")
      setZipCode("")
      setOrganizationName("")
      setOrganizationDescription("")

      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Registration successful! Please log in with your credentials.",
          },
        })
      }, 2000)
    } catch (err: any) {
      console.error("Registration failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
          linear-gradient(135deg, #667eea 0%, #764ba2 100%)
        `,
        py: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Enhanced Animated Background Elements */}
      {[...Array(12)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            borderRadius: Math.random() > 0.5 ? "50%" : "20%",
            background: `rgba(255,255,255,${Math.random() * 0.1 + 0.05})`,
            backdropFilter: "blur(10px)",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
            "@keyframes float": {
              "0%, 100%": {
                transform: `translateY(0px) rotate(${Math.random() * 360}deg)`,
                opacity: 0.3,
              },
              "50%": {
                transform: `translateY(-${Math.random() * 30 + 20}px) rotate(${Math.random() * 360 + 180}deg)`,
                opacity: 0.8,
              },
            },
          }}
        />
      ))}

      {/* Geometric Shapes */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "10%",
          width: 200,
          height: 200,
          background: "linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))",
          clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
          animation: "rotate 20s linear infinite",
          "@keyframes rotate": {
            "0%": { transform: "rotate(0deg)" },
            "100%": { transform: "rotate(360deg)" },
          },
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          left: "5%",
          width: 150,
          height: 150,
          background: "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          animation: "morph 15s ease-in-out infinite",
          "@keyframes morph": {
            "0%, 100%": { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" },
            "25%": { borderRadius: "58% 42% 75% 25% / 76% 46% 54% 24%" },
            "50%": { borderRadius: "50% 50% 33% 67% / 55% 27% 73% 45%" },
            "75%": { borderRadius: "33% 67% 58% 42% / 63% 68% 32% 37%" },
          },
        }}
      />

      <Container component="main" maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={1000}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 8,
              background: `
                linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%),
                linear-gradient(45deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)
              `,
              backdropFilter: "blur(40px)",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              boxShadow: `
                0 50px 100px rgba(0, 0, 0, 0.25),
                inset 0 1px 0 rgba(255, 255, 255, 0.6)
              `,
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Progress Bar */}
            <Box sx={{ position: "relative" }}>
              <LinearProgress
                variant="determinate"
                value={formProgress}
                sx={{
                  height: 6,
                  background: "rgba(0,0,0,0.1)",
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(90deg, #667eea, #764ba2, #f093fb)",
                    borderRadius: 3,
                  },
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: -2,
                  right: 20,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  color: "white",
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {Math.round(formProgress)}% Complete
              </Box>
            </Box>

            {/* Header Section */}
            <Box
              sx={{
                background: `
                  linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%),
                  linear-gradient(45deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)
                `,
                p: 10,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Header Background Pattern */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    radial-gradient(circle at 30% 30%, rgba(102,126,234,0.1) 0%, transparent 50%),
                    radial-gradient(circle at 70% 70%, rgba(118,75,162,0.1) 0%, transparent 50%)
                  `,
                }}
              />

              <Grow in timeout={1200}>
                <Avatar
                  sx={{
                    background: `
                      linear-gradient(45deg, #667eea, #764ba2),
                      linear-gradient(135deg, #f093fb, #f5576c)
                    `,
                    width: 120,
                    height: 120,
                    mx: "auto",
                    mb: 4,
                    boxShadow: `
                      0 20px 60px rgba(102, 126, 234, 0.4),
                      0 0 0 4px rgba(255,255,255,0.3),
                      inset 0 2px 0 rgba(255,255,255,0.3)
                    `,
                    position: "relative",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -4,
                      left: -4,
                      right: -4,
                      bottom: -4,
                      background: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
                      borderRadius: "50%",
                      zIndex: -1,
                      animation: "pulse 3s ease-in-out infinite",
                    },
                    "@keyframes pulse": {
                      "0%, 100%": { opacity: 0.5, transform: "scale(1)" },
                      "50%": { opacity: 0.8, transform: "scale(1.05)" },
                    },
                  }}
                >
                  <RegisterIcon sx={{ fontSize: 60 }} />
                </Avatar>
              </Grow>

              <Typography
                component="h1"
                variant="h1"
                sx={{
                  fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
                  fontWeight: 900,
                  background: `
                    linear-gradient(45deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
                  `,
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 3,
                  letterSpacing: "-0.03em",
                  textShadow: "0 4px 20px rgba(102,126,234,0.3)",
                  position: "relative",
                }}
              >
                Join Our Community
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  color: "rgba(0,0,0,0.7)",
                  fontWeight: 500,
                  mb: 4,
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                  textShadow: "0 2px 10px rgba(0,0,0,0.1)",
                }}
              >
                Create your Food Donation & Waste Tracker account
              </Typography>

              {/* Trust Indicators */}
              <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                <Chip
                  icon={<SecurityIcon />}
                  label="Secure & Encrypted"
                  sx={{
                    background: "rgba(76,175,80,0.1)",
                    color: "#4caf50",
                    fontWeight: 600,
                    border: "1px solid rgba(76,175,80,0.3)",
                  }}
                />
                <Chip
                  icon={<VerifiedIcon />}
                  label="Verified Platform"
                  sx={{
                    background: "rgba(33,150,243,0.1)",
                    color: "#2196f3",
                    fontWeight: 600,
                    border: "1px solid rgba(33,150,243,0.3)",
                  }}
                />
                <Chip
                  icon={<StarIcon />}
                  label="5-Star Rated"
                  sx={{
                    background: "rgba(255,193,7,0.1)",
                    color: "#ffc107",
                    fontWeight: 600,
                    border: "1px solid rgba(255,193,7,0.3)",
                  }}
                />
              </Stack>
            </Box>

            <Divider sx={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)" }} />

            {/* Form Section */}
            <Box sx={{ p: 10 }}>
              {error && (
                <Grow in timeout={600}>
                  <Alert
                    severity="error"
                    sx={{
                      mb: 6,
                      borderRadius: 4,
                      border: "1px solid rgba(211, 47, 47, 0.3)",
                      background: `
                        linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(211, 47, 47, 0.05) 100%)
                      `,
                      backdropFilter: "blur(10px)",
                      "& .MuiAlert-icon": { fontSize: 32 },
                      boxShadow: "0 8px 32px rgba(211, 47, 47, 0.2)",
                    }}
                  >
                    {error}
                  </Alert>
                </Grow>
              )}
              {success && (
                <Grow in timeout={600}>
                  <Alert
                    severity="success"
                    sx={{
                      mb: 6,
                      borderRadius: 4,
                      border: "1px solid rgba(46, 125, 50, 0.3)",
                      background: `
                        linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(46, 125, 50, 0.05) 100%)
                      `,
                      backdropFilter: "blur(10px)",
                      "& .MuiAlert-icon": { fontSize: 32 },
                      boxShadow: "0 8px 32px rgba(46, 125, 50, 0.2)",
                    }}
                  >
                    Registration successful! Redirecting to login page...
                  </Alert>
                </Grow>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={8}>
                  {/* Personal Information Section */}
                  <Grid item xs={12}>
                    <Card
                      elevation={0}
                      sx={{
                        border: "2px solid rgba(102,126,234,0.1)",
                        borderRadius: 6,
                        background: `
                          linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%),
                          linear-gradient(45deg, rgba(102,126,234,0.03) 0%, rgba(118,75,162,0.03) 100%)
                        `,
                        backdropFilter: "blur(20px)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 25px 80px rgba(102,126,234,0.25)",
                          border: "2px solid rgba(102,126,234,0.2)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 8 }}>
                        <Typography
                          variant="h3"
                          fontWeight={800}
                          sx={{
                            background: "linear-gradient(45deg, #667eea, #764ba2)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 6,
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            textShadow: "0 2px 10px rgba(102,126,234,0.3)",
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 40, color: "#667eea" }} />
                          Personal Information
                        </Typography>

                        <Grid container spacing={6}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              required
                              fullWidth
                              label="First Name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              error={!!localError && !firstName.trim()}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 4,
                                  background: "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(10px)",
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.95)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(102,126,234,0.15)",
                                  },
                                  "&.Mui-focused": {
                                    background: "rgba(255, 255, 255, 1)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(102,126,234,0.25)",
                                    "& fieldset": {
                                      borderColor: "#667eea",
                                      borderWidth: "2px",
                                    },
                                  },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#667eea",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              required
                              fullWidth
                              label="Last Name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              error={!!localError && !lastName.trim()}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 4,
                                  background: "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(10px)",
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.95)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(102,126,234,0.15)",
                                  },
                                  "&.Mui-focused": {
                                    background: "rgba(255, 255, 255, 1)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(102,126,234,0.25)",
                                    "& fieldset": {
                                      borderColor: "#667eea",
                                      borderWidth: "2px",
                                    },
                                  },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#667eea",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              required
                              fullWidth
                              label="Email Address"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              error={!!localError && !email.trim()}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <EmailIcon sx={{ color: "#667eea" }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 4,
                                  background: "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(10px)",
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.95)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(102,126,234,0.15)",
                                  },
                                  "&.Mui-focused": {
                                    background: "rgba(255, 255, 255, 1)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(102,126,234,0.25)",
                                    "& fieldset": {
                                      borderColor: "#667eea",
                                      borderWidth: "2px",
                                    },
                                  },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#667eea",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              required
                              fullWidth
                              label="Password"
                              type={showPassword ? "text" : "password"}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              error={!!localError && (!password.trim() || password !== password2)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon sx={{ color: "#667eea" }} />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowPassword(!showPassword)}
                                      edge="end"
                                      sx={{
                                        color: "#667eea",
                                        "&:hover": {
                                          background: "rgba(102,126,234,0.1)",
                                        },
                                      }}
                                    >
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 4,
                                  background: "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(10px)",
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.95)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(102,126,234,0.15)",
                                  },
                                  "&.Mui-focused": {
                                    background: "rgba(255, 255, 255, 1)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(102,126,234,0.25)",
                                    "& fieldset": {
                                      borderColor: "#667eea",
                                      borderWidth: "2px",
                                    },
                                  },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#667eea",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              required
                              fullWidth
                              label="Confirm Password"
                              type={showPassword2 ? "text" : "password"}
                              value={password2}
                              onChange={(e) => setPassword2(e.target.value)}
                              error={!!localError && (!password2.trim() || password !== password2)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LockIcon sx={{ color: "#667eea" }} />
                                  </InputAdornment>
                                ),
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={() => setShowPassword2(!showPassword2)}
                                      edge="end"
                                      sx={{
                                        color: "#667eea",
                                        "&:hover": {
                                          background: "rgba(102,126,234,0.1)",
                                        },
                                      }}
                                    >
                                      {showPassword2 ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 4,
                                  background: "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(10px)",
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.95)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(102,126,234,0.15)",
                                  },
                                  "&.Mui-focused": {
                                    background: "rgba(255, 255, 255, 1)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(102,126,234,0.25)",
                                    "& fieldset": {
                                      borderColor: "#667eea",
                                      borderWidth: "2px",
                                    },
                                  },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#667eea",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Account Type Section */}
                  <Grid item xs={12}>
                    <Card
                      elevation={0}
                      sx={{
                        border: "2px solid rgba(118,75,162,0.1)",
                        borderRadius: 6,
                        background: `
                          linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%),
                          linear-gradient(45deg, rgba(118,75,162,0.03) 0%, rgba(240,147,251,0.03) 100%)
                        `,
                        backdropFilter: "blur(20px)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 25px 80px rgba(118,75,162,0.25)",
                          border: "2px solid rgba(118,75,162,0.2)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 8 }}>
                        <Typography
                          variant="h3"
                          fontWeight={800}
                          sx={{
                            background: "linear-gradient(45deg, #764ba2, #f093fb)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 6,
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            textShadow: "0 2px 10px rgba(118,75,162,0.3)",
                          }}
                        >
                          <BusinessIcon sx={{ fontSize: 40, color: "#764ba2" }} />
                          Account Type
                        </Typography>

                        <FormControl fullWidth>
                          <InputLabel sx={{ fontWeight: 600, fontSize: "1.1rem" }}>Role</InputLabel>
                          <Select
                            value={role}
                            label="Role"
                            onChange={(e) => setRole(e.target.value)}
                            sx={{
                              borderRadius: 4,
                              background: "rgba(255, 255, 255, 0.8)",
                              backdropFilter: "blur(10px)",
                              fontSize: "1.1rem",
                              fontWeight: 500,
                              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                              "&:hover": {
                                background: "rgba(255, 255, 255, 0.95)",
                                transform: "translateY(-4px)",
                                boxShadow: "0 15px 40px rgba(118,75,162,0.15)",
                              },
                              "&.Mui-focused": {
                                background: "rgba(255, 255, 255, 1)",
                                transform: "translateY(-4px)",
                                boxShadow: "0 15px 40px rgba(118,75,162,0.25)",
                                "& fieldset": {
                                  borderColor: "#764ba2",
                                  borderWidth: "2px",
                                },
                              },
                            }}
                          >
                            <MenuItem value="donor" sx={{ fontSize: "1.1rem", py: 2 }}>
                              Donor - I want to donate food
                            </MenuItem>
                            <MenuItem value="charity" sx={{ fontSize: "1.1rem", py: 2 }}>
                              Charity - I want to receive donations
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Contact Information Section */}
                  <Grid item xs={12}>
                    <Card
                      elevation={0}
                      sx={{
                        border: "2px solid rgba(240,147,251,0.1)",
                        borderRadius: 6,
                        background: `
                          linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%),
                          linear-gradient(45deg, rgba(240,147,251,0.03) 0%, rgba(245,87,108,0.03) 100%)
                        `,
                        backdropFilter: "blur(20px)",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 25px 80px rgba(240,147,251,0.25)",
                          border: "2px solid rgba(240,147,251,0.2)",
                        },
                      }}
                    >
                      <CardContent sx={{ p: 8 }}>
                        <Typography
                          variant="h3"
                          fontWeight={800}
                          sx={{
                            background: "linear-gradient(45deg, #f093fb, #f5576c)",
                            backgroundClip: "text",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            mb: 6,
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            textShadow: "0 2px 10px rgba(240,147,251,0.3)",
                          }}
                        >
                          <PhoneIcon sx={{ fontSize: 40, color: "#f093fb" }} />
                          Contact Information
                        </Typography>

                        <Grid container spacing={6}>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Phone Number"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <PhoneIcon sx={{ color: "#f093fb" }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 4,
                                  background: "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(10px)",
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.95)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(240,147,251,0.15)",
                                  },
                                  "&.Mui-focused": {
                                    background: "rgba(255, 255, 255, 1)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(240,147,251,0.25)",
                                    "& fieldset": {
                                      borderColor: "#f093fb",
                                      borderWidth: "2px",
                                    },
                                  },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#f093fb",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <LocationIcon sx={{ color: "#f093fb" }} />
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 4,
                                  background: "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(10px)",
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.95)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(240,147,251,0.15)",
                                  },
                                  "&.Mui-focused": {
                                    background: "rgba(255, 255, 255, 1)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(240,147,251,0.25)",
                                    "& fieldset": {
                                      borderColor: "#f093fb",
                                      borderWidth: "2px",
                                    },
                                  },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#f093fb",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="City"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 4,
                                  background: "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(10px)",
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.95)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(240,147,251,0.15)",
                                  },
                                  "&.Mui-focused": {
                                    background: "rgba(255, 255, 255, 1)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(240,147,251,0.25)",
                                    "& fieldset": {
                                      borderColor: "#f093fb",
                                      borderWidth: "2px",
                                    },
                                  },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#f093fb",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="State"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 4,
                                  background: "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(10px)",
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.95)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(240,147,251,0.15)",
                                  },
                                  "&.Mui-focused": {
                                    background: "rgba(255, 255, 255, 1)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(240,147,251,0.25)",
                                    "& fieldset": {
                                      borderColor: "#f093fb",
                                      borderWidth: "2px",
                                    },
                                  },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#f093fb",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Zip Code"
                              value={zipCode}
                              onChange={(e) => setZipCode(e.target.value)}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 4,
                                  background: "rgba(255, 255, 255, 0.8)",
                                  backdropFilter: "blur(10px)",
                                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                  "&:hover": {
                                    background: "rgba(255, 255, 255, 0.95)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(240,147,251,0.15)",
                                  },
                                  "&.Mui-focused": {
                                    background: "rgba(255, 255, 255, 1)",
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 15px 40px rgba(240,147,251,0.25)",
                                    "& fieldset": {
                                      borderColor: "#f093fb",
                                      borderWidth: "2px",
                                    },
                                  },
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                  color: "#f093fb",
                                  fontWeight: 600,
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Charity-specific fields */}
                  <Grid item xs={12}>
                    <Collapse in={role === "charity"}>
                      <Card
                        elevation={0}
                        sx={{
                          border: "2px solid rgba(245,87,108,0.1)",
                          borderRadius: 6,
                          background: `
                            linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%),
                            linear-gradient(45deg, rgba(245,87,108,0.03) 0%, rgba(102,126,234,0.03) 100%)
                          `,
                          backdropFilter: "blur(20px)",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 25px 80px rgba(245,87,108,0.25)",
                            border: "2px solid rgba(245,87,108,0.2)",
                          },
                        }}
                      >
                        <CardContent sx={{ p: 8 }}>
                          <Typography
                            variant="h3"
                            fontWeight={800}
                            sx={{
                              background: "linear-gradient(45deg, #f5576c, #667eea)",
                              backgroundClip: "text",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              mb: 6,
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                              textShadow: "0 2px 10px rgba(245,87,108,0.3)",
                            }}
                          >
                            <BusinessIcon sx={{ fontSize: 40, color: "#f5576c" }} />
                            Organization Details
                          </Typography>
                          <Grid container spacing={6}>
                            <Grid item xs={12}>
                              <TextField
                                required={role === "charity"}
                                fullWidth
                                label="Organization Name"
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                error={!!localError && role === "charity" && !organizationName.trim()}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 4,
                                    background: "rgba(255, 255, 255, 0.8)",
                                    backdropFilter: "blur(10px)",
                                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                      background: "rgba(255, 255, 255, 0.95)",
                                      transform: "translateY(-4px)",
                                      boxShadow: "0 15px 40px rgba(245,87,108,0.15)",
                                    },
                                    "&.Mui-focused": {
                                      background: "rgba(255, 255, 255, 1)",
                                      transform: "translateY(-4px)",
                                      boxShadow: "0 15px 40px rgba(245,87,108,0.25)",
                                      "& fieldset": {
                                        borderColor: "#f5576c",
                                        borderWidth: "2px",
                                      },
                                    },
                                  },
                                  "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#f5576c",
                                    fontWeight: 600,
                                  },
                                }}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Organization Description"
                                multiline
                                rows={4}
                                value={organizationDescription}
                                onChange={(e) => setOrganizationDescription(e.target.value)}
                                placeholder="Tell us about your organization's mission and the communities you serve..."
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 4,
                                    background: "rgba(255, 255, 255, 0.8)",
                                    backdropFilter: "blur(10px)",
                                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                    "&:hover": {
                                      background: "rgba(255, 255, 255, 0.95)",
                                      transform: "translateY(-4px)",
                                      boxShadow: "0 15px 40px rgba(245,87,108,0.15)",
                                    },
                                    "&.Mui-focused": {
                                      background: "rgba(255, 255, 255, 1)",
                                      transform: "translateY(-4px)",
                                      boxShadow: "0 15px 40px rgba(245,87,108,0.25)",
                                      "& fieldset": {
                                        borderColor: "#f5576c",
                                        borderWidth: "2px",
                                      },
                                    },
                                  },
                                  "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#f5576c",
                                    fontWeight: 600,
                                  },
                                }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Collapse>
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 8,
                    py: 4,
                    borderRadius: 6,
                    background: `
                      linear-gradient(45deg, #667eea 0%, #764ba2 50%, #f093fb 100%)
                    `,
                    fontSize: "1.4rem",
                    fontWeight: 800,
                    textTransform: "none",
                    boxShadow: `
                      0 20px 60px rgba(102, 126, 234, 0.4),
                      0 0 0 1px rgba(255,255,255,0.2),
                      inset 0 1px 0 rgba(255,255,255,0.3)
                    `,
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                      transition: "left 0.6s ease",
                    },
                    "&:hover": {
                      background: `
                        linear-gradient(45deg, #5a6fd8 0%, #6a42a0 50%, #e084f0 100%)
                      `,
                      boxShadow: `
                        0 25px 80px rgba(102, 126, 234, 0.5),
                        0 0 0 1px rgba(255,255,255,0.3),
                        inset 0 1px 0 rgba(255,255,255,0.4)
                      `,
                      transform: "translateY(-6px)",
                      "&::before": {
                        left: "100%",
                      },
                    },
                    "&:disabled": {
                      background: "linear-gradient(45deg, #ccc, #999)",
                      transform: "none",
                    },
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {loading ? (
                    <Stack direction="row" alignItems="center" spacing={3}>
                      <CircularProgress size={32} color="inherit" />
                      <Typography fontSize="1.4rem" fontWeight={800}>
                        Creating Account...
                      </Typography>
                    </Stack>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </Box>
            </Box>

            {/* Enhanced Footer */}
            <Divider sx={{ background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.1), transparent)" }} />
            <Box
              sx={{
                p: 8,
                textAlign: "center",
                background: `
                  linear-gradient(135deg, rgba(248,249,250,0.9) 0%, rgba(248,249,250,0.6) 100%),
                  linear-gradient(45deg, rgba(102,126,234,0.05) 0%, rgba(118,75,162,0.05) 100%)
                `,
                backdropFilter: "blur(20px)",
              }}
            >
              <Typography variant="h5" color="text.secondary" fontWeight={600} sx={{ mb: 2 }}>
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textDecoration: "none",
                    fontWeight: 800,
                    fontSize: "1.1em",
                  }}
                >
                  Sign In
                </Link>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ opacity: 0.7 }}>
                By creating an account, you agree to our Terms of Service and Privacy Policy
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}

export default Register
