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
  Avatar,
  Stack,
  Fade,
  Grow,
  InputAdornment,
  IconButton,
} from "@mui/material"
import {
  Login as LoginIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const { login, isAuthenticated, user, error: authError } = useAuth()
  const navigate = useNavigate()

  const error = localError || authError

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
  }, [email, password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setLocalError("Email is required")
      return
    }

    if (!password.trim()) {
      setLocalError("Password is required")
      return
    }

    setLocalError(null)
    setLoading(true)

    try {
      await login(email, password)
    } catch (err: any) {
      console.error("Login failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Fade in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 4,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Grow in timeout={1000}>
                <Avatar
                  sx={{
                    bgcolor: "#667eea",
                    width: 80,
                    height: 80,
                    mb: 3,
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                  }}
                >
                  <LoginIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Grow>

              <Typography
                component="h1"
                variant="h3"
                fontWeight={700}
                sx={{
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 1,
                  textAlign: "center",
                }}
              >
                Welcome Back
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={400} sx={{ mb: 4, textAlign: "center" }}>
                Sign in to Food Donation & Waste Tracker
              </Typography>

              {error && (
                <Grow in timeout={600}>
                  <Alert
                    severity="error"
                    sx={{
                      width: "100%",
                      mb: 3,
                      borderRadius: 2,
                      "& .MuiAlert-icon": { fontSize: 24 },
                    }}
                  >
                    {error}
                  </Alert>
                </Grow>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                <Stack spacing={3}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!localError && !email.trim()}
                    helperText={!email.trim() && localError ? "Email is required" : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                      },
                    }}
                  />
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!localError && !password.trim()}
                    helperText={!password.trim() && localError ? "Password is required" : ""}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 3,
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        },
                        "&.Mui-focused": {
                          backgroundColor: "rgba(255, 255, 255, 1)",
                        },
                      },
                    }}
                  />
                </Stack>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 4,
                    mb: 3,
                    py: 2,
                    borderRadius: 3,
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                    "&:hover": {
                      background: "linear-gradient(45deg, #5a6fd8, #6a42a0)",
                      boxShadow: "0 12px 35px rgba(102, 126, 234, 0.4)",
                      transform: "translateY(-2px)",
                    },
                    "&:disabled": {
                      background: "linear-gradient(45deg, #ccc, #999)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  {loading ? (
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <CircularProgress size={24} color="inherit" />
                      <Typography>Signing In...</Typography>
                    </Stack>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <Box sx={{ textAlign: "center" }}>
                  <Typography variant="body1" color="text.secondary">
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      style={{
                        color: "#667eea",
                        textDecoration: "none",
                        fontWeight: 600,
                      }}
                    >
                      Sign Up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  )
}

export default Login
