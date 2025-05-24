"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Avatar,
  Fade,
  Grow,
  Container,
} from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  Lock as LockIcon,
  Verified as VerifiedIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Description as DescriptionIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"

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

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
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

// Enhanced styled components
const GradientBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
  backgroundSize: "400% 400%",
  animation: `${shimmer} 15s ease infinite`,
  minHeight: "100vh",
  padding: theme.spacing(3),
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
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
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "linear-gradient(90deg, #4caf50, #2196f3, #9c27b0, #ff9800)",
  },
}))

const ProfileCard = styled(GlassCard)(({ theme }) => ({
  textAlign: "center",
  padding: theme.spacing(4),
  position: "relative",
  "&::after": {
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
  "&:hover::after": {
    transform: "translateX(100%)",
  },
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(10px)",
    borderRadius: theme.spacing(2),
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.9)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#4caf50",
      },
    },
    "&.Mui-focused": {
      background: "rgba(255, 255, 255, 1)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#4caf50",
        borderWidth: "2px",
      },
    },
    "&.Mui-disabled": {
      background: "rgba(0, 0, 0, 0.04)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(0, 0, 0, 0.12)",
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#4caf50",
    },
  },
}))

const SubmitButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
  borderRadius: theme.spacing(3),
  padding: theme.spacing(2, 4),
  fontSize: "1.1rem",
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "0 8px 25px rgba(76, 175, 80, 0.4)",
  border: "2px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #45a049 0%, #388e3c 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 12px 35px rgba(76, 175, 80, 0.6)",
  },
  "&:disabled": {
    background: "rgba(0, 0, 0, 0.12)",
    color: "rgba(0, 0, 0, 0.26)",
  },
}))

const PasswordButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
  borderRadius: theme.spacing(2),
  padding: theme.spacing(1.5, 3),
  fontWeight: 600,
  textTransform: "none",
  boxShadow: "0 6px 20px rgba(33, 150, 243, 0.3)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(33, 150, 243, 0.4)",
  },
}))

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  background: "linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(33, 150, 243, 0.05) 100%)",
  borderRadius: theme.spacing(2),
  border: "1px solid rgba(76, 175, 80, 0.1)",
}))

const StatusChip = styled(Chip)<{ status: string }>(({ theme, status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "verified":
        return {
          background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c8 100%)",
          color: "#2e7d32",
          border: "1px solid #4caf50",
          "& .MuiChip-icon": { color: "#4caf50" },
        }
      case "unverified":
        return {
          background: "linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)",
          color: "#e65100",
          border: "1px solid #ff9800",
          "& .MuiChip-icon": { color: "#ff9800" },
        }
      case "admin":
        return {
          background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
          color: "#c62828",
          border: "1px solid #f44336",
          "& .MuiChip-icon": { color: "#f44336" },
        }
      case "donor":
        return {
          background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c8 100%)",
          color: "#2e7d32",
          border: "1px solid #4caf50",
          "& .MuiChip-icon": { color: "#4caf50" },
        }
      case "charity":
        return {
          background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
          color: "#1565c0",
          border: "1px solid #2196f3",
          "& .MuiChip-icon": { color: "#2196f3" },
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

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: theme.spacing(3),
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  },
}))

const LoadingBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "60vh",
  gap: theme.spacing(3),
}))

const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
  fontSize: "3rem",
  fontWeight: 700,
  boxShadow: "0 12px 30px rgba(76, 175, 80, 0.3)",
  border: "4px solid rgba(255, 255, 255, 0.3)",
  margin: "0 auto 24px",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 16px 40px rgba(76, 175, 80, 0.4)",
  },
}))

const Profile: React.FC = () => {
  const { user, updateProfile, changePassword, error: authError } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)

  // Profile form state
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    organization_name: "",
    organization_description: "",
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  })

  // Load user data into form
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zip_code: user.zip_code || "",
        organization_name: user.organization_name || "",
        organization_description: user.organization_description || "",
      })
    }
  }, [user])

  // Clear errors when form data changes
  useEffect(() => {
    if (error || authError) {
      setError(null)
    }
  }, [profileData, passwordData])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setProfileData({
      ...profileData,
      [name as string]: value,
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await updateProfile(profileData)
      setSuccess("Profile updated successfully!")
    } catch (err: any) {
      console.error("Profile update failed:", err)
      // Error is handled in AuthContext
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError("New passwords do not match")
      return
    }

    // Validate password length
    if (passwordData.new_password.length < 8) {
      setError("New password must be at least 8 characters long")
      return
    }

    setPasswordLoading(true)

    try {
      await changePassword(passwordData.old_password, passwordData.new_password)
      setSuccess("Password changed successfully!")
      setPasswordDialogOpen(false)
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: "",
      })
    } catch (err: any) {
      console.error("Password change failed:", err)
      // Error is handled in AuthContext
    } finally {
      setPasswordLoading(false)
    }
  }

  if (!user) {
    return (
      <GradientBox>
        <LoadingBox>
          <Box sx={{ position: "relative" }}>
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
              <PersonIcon sx={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
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
            Loading profile...
          </Typography>
        </LoadingBox>
      </GradientBox>
    )
  }

  return (
    <GradientBox>
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Fade in timeout={800}>
          <Box>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  mb: 2,
                }}
              >
                My Profile
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontWeight: 500,
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                }}
              >
                Manage your account information and preferences
              </Typography>
            </Box>

            {(error || authError) && (
              <Grow in timeout={600}>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    background: "rgba(244, 67, 54, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(244, 67, 54, 0.3)",
                    "& .MuiAlert-icon": { color: "#f44336" },
                  }}
                >
                  {error || authError}
                </Alert>
              </Grow>
            )}

            {success && (
              <Grow in timeout={600}>
                <Alert
                  severity="success"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    background: "rgba(76, 175, 80, 0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(76, 175, 80, 0.3)",
                    "& .MuiAlert-icon": { color: "#4caf50" },
                  }}
                >
                  {success}
                </Alert>
              </Grow>
            )}

            <Grid container spacing={4}>
              {/* Profile Overview Card */}
              <Grid item xs={12} lg={4}>
                <Grow in timeout={1000}>
                  <ProfileCard>
                    <UserAvatar>{user.first_name?.charAt(0) || user.email?.charAt(0) || "U"}</UserAvatar>

                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 1 }}>
                      {user.first_name} {user.last_name}
                    </Typography>

                    <Typography variant="h6" sx={{ color: "#666", mb: 3 }}>
                      {user.email}
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ color: "#666", fontWeight: 600 }}>
                          Role:
                        </Typography>
                        <StatusChip
                          status={user.role}
                          label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          size="medium"
                        />
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ color: "#666", fontWeight: 600 }}>
                          Status:
                        </Typography>
                        <StatusChip
                          status={user.is_verified ? "verified" : "unverified"}
                          label={user.is_verified ? "Verified" : "Unverified"}
                          size="medium"
                          icon={
                            user.is_verified ? <VerifiedIcon fontSize="small" /> : <ScheduleIcon fontSize="small" />
                          }
                        />
                      </Box>

                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" sx={{ color: "#666", fontWeight: 600 }}>
                          Member Since:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "#333" }}>
                          {new Date(user.date_joined).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>

                    <PasswordButton
                      variant="contained"
                      fullWidth
                      onClick={() => setPasswordDialogOpen(true)}
                      startIcon={<SecurityIcon />}
                    >
                      Change Password
                    </PasswordButton>
                  </ProfileCard>
                </Grow>
              </Grid>

              {/* Profile Form */}
              <Grid item xs={12} lg={8}>
                <Grow in timeout={1200}>
                  <GlassCard sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                      <Avatar sx={{ bgcolor: "#4caf50", width: 48, height: 48 }}>
                        <EditIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                        Profile Information
                      </Typography>
                    </Box>

                    <Box component="form" onSubmit={handleProfileSubmit}>
                      {/* Basic Information Section */}
                      <SectionHeader>
                        <Avatar sx={{ bgcolor: "#2196f3", width: 40, height: 40 }}>
                          <PersonIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                          Basic Information
                        </Typography>
                      </SectionHeader>

                      <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            required
                            fullWidth
                            id="first_name"
                            name="first_name"
                            label="First Name"
                            value={profileData.first_name}
                            onChange={handleProfileChange}
                            InputProps={{
                              startAdornment: <PersonIcon sx={{ color: "#4caf50", mr: 1, fontSize: "1.2rem" }} />,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            required
                            fullWidth
                            id="last_name"
                            name="last_name"
                            label="Last Name"
                            value={profileData.last_name}
                            onChange={handleProfileChange}
                            InputProps={{
                              startAdornment: <PersonIcon sx={{ color: "#4caf50", mr: 1, fontSize: "1.2rem" }} />,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <StyledTextField
                            required
                            fullWidth
                            id="email"
                            name="email"
                            label="Email Address"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            disabled
                            helperText="Contact an administrator to change your email address"
                            InputProps={{
                              startAdornment: <EmailIcon sx={{ color: "#666", mr: 1, fontSize: "1.2rem" }} />,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <StyledTextField
                            fullWidth
                            id="phone_number"
                            name="phone_number"
                            label="Phone Number"
                            value={profileData.phone_number}
                            onChange={handleProfileChange}
                            InputProps={{
                              startAdornment: <PhoneIcon sx={{ color: "#2196f3", mr: 1, fontSize: "1.2rem" }} />,
                            }}
                          />
                        </Grid>
                      </Grid>

                      {/* Address Information Section */}
                      <SectionHeader>
                        <Avatar sx={{ bgcolor: "#9c27b0", width: 40, height: 40 }}>
                          <LocationIcon />
                        </Avatar>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                          Address Information
                        </Typography>
                      </SectionHeader>

                      <Grid container spacing={3} sx={{ mb: 4 }}>
                        <Grid item xs={12}>
                          <StyledTextField
                            fullWidth
                            id="address"
                            name="address"
                            label="Street Address"
                            value={profileData.address}
                            onChange={handleProfileChange}
                            InputProps={{
                              startAdornment: <HomeIcon sx={{ color: "#9c27b0", mr: 1, fontSize: "1.2rem" }} />,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            fullWidth
                            id="city"
                            name="city"
                            label="City"
                            value={profileData.city}
                            onChange={handleProfileChange}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            fullWidth
                            id="state"
                            name="state"
                            label="State"
                            value={profileData.state}
                            onChange={handleProfileChange}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            fullWidth
                            id="zip_code"
                            name="zip_code"
                            label="ZIP Code"
                            value={profileData.zip_code}
                            onChange={handleProfileChange}
                          />
                        </Grid>
                      </Grid>

                      {/* Organization Information (for charities) */}
                      {user.role === "charity" && (
                        <>
                          <SectionHeader>
                            <Avatar sx={{ bgcolor: "#ff9800", width: 40, height: 40 }}>
                              <BusinessIcon />
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                              Organization Information
                            </Typography>
                          </SectionHeader>

                          <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12}>
                              <StyledTextField
                                required
                                fullWidth
                                id="organization_name"
                                name="organization_name"
                                label="Organization Name"
                                value={profileData.organization_name}
                                onChange={handleProfileChange}
                                InputProps={{
                                  startAdornment: <BusinessIcon sx={{ color: "#ff9800", mr: 1, fontSize: "1.2rem" }} />,
                                }}
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <StyledTextField
                                fullWidth
                                id="organization_description"
                                name="organization_description"
                                label="Organization Description"
                                multiline
                                rows={4}
                                value={profileData.organization_description}
                                onChange={handleProfileChange}
                                placeholder="Describe your organization's mission and activities"
                                InputProps={{
                                  startAdornment: (
                                    <DescriptionIcon
                                      sx={{
                                        color: "#ff9800",
                                        mr: 1,
                                        fontSize: "1.2rem",
                                        alignSelf: "flex-start",
                                        mt: 1,
                                      }}
                                    />
                                  ),
                                }}
                              />
                            </Grid>
                          </Grid>
                        </>
                      )}

                      {/* Submit Button */}
                      <Box sx={{ textAlign: "center", mt: 4 }}>
                        <SubmitButton
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={loading}
                          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        >
                          {loading ? "Updating Profile..." : "Update Profile"}
                        </SubmitButton>
                      </Box>
                    </Box>
                  </GlassCard>
                </Grow>
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Change Password Dialog */}
        <StyledDialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#2196f3" }}>
                <LockIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Change Password
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 2 }}>
              <StyledTextField
                required
                fullWidth
                id="old_password"
                name="old_password"
                label="Current Password"
                type="password"
                value={passwordData.old_password}
                onChange={handlePasswordChange}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: <LockIcon sx={{ color: "#666", mr: 1, fontSize: "1.2rem" }} />,
                }}
              />
              <StyledTextField
                required
                fullWidth
                id="new_password"
                name="new_password"
                label="New Password"
                type="password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                sx={{ mb: 3 }}
                helperText="Password must be at least 8 characters long"
                InputProps={{
                  startAdornment: <SecurityIcon sx={{ color: "#4caf50", mr: 1, fontSize: "1.2rem" }} />,
                }}
              />
              <StyledTextField
                required
                fullWidth
                id="confirm_password"
                name="confirm_password"
                label="Confirm New Password"
                type="password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                InputProps={{
                  startAdornment: <SecurityIcon sx={{ color: "#4caf50", mr: 1, fontSize: "1.2rem" }} />,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, gap: 2 }}>
            <Button
              onClick={() => setPasswordDialogOpen(false)}
              variant="outlined"
              sx={{
                borderColor: "#666",
                color: "#666",
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                textTransform: "none",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordSubmit}
              variant="contained"
              disabled={passwordLoading}
              sx={{
                background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
                borderRadius: 2,
                px: 3,
                fontWeight: 600,
                textTransform: "none",
              }}
              startIcon={passwordLoading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </Button>
          </DialogActions>
        </StyledDialog>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess(null)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity="success"
            sx={{
              background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
              color: "white",
              borderRadius: 3,
              fontWeight: 600,
              "& .MuiAlert-icon": { color: "white" },
            }}
          >
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </GradientBox>
  )
}

export default Profile
