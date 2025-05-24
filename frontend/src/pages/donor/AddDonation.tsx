"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Fade,
  Grow,
  Chip,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { useAuth } from "../../contexts/AuthContext"
import type { FoodCategory } from "../../types"
import type { SelectChangeEvent } from "@mui/material/Select"
import {
  RestaurantMenu as FoodIcon,
  LocationOn as LocationIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Home as HomeIcon,
} from "@mui/icons-material"

// Enhanced styled components
const GradientBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)",
  backgroundSize: "400% 400%",
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

const SectionCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  borderRadius: theme.spacing(2),
  boxShadow: "0 8px 25px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  marginBottom: theme.spacing(3),
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 12px 35px rgba(0, 0, 0, 0.12)",
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
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#4caf50",
    },
  },
}))

const StyledFormControl = styled(FormControl)(({ theme }) => ({
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

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  background: "linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.05) 100%)",
  borderRadius: theme.spacing(2),
  border: "1px solid rgba(76, 175, 80, 0.1)",
}))

const WarningCard = styled(Alert)(({ theme }) => ({
  background: "linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 193, 7, 0.1) 100%)",
  border: "2px solid rgba(255, 152, 0, 0.3)",
  borderRadius: theme.spacing(3),
  backdropFilter: "blur(10px)",
  "& .MuiAlert-icon": {
    color: "#ff9800",
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

const steps = ["Food Information", "Pickup Details", "Review & Submit"]

const AddDonation: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<FoodCategory[]>([])
  const [activeStep, setActiveStep] = useState(0)

  // Form state
  const [formData, setFormData] = useState({
    food_name: "",
    description: "",
    quantity: "",
    category: "",
    expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
    pickup_address: "",
    pickup_city: "",
    pickup_state: "",
    pickup_zip: "",
    pickup_instructions: "",
  })

  // Check if user is verified
  const isVerified = user?.is_verified || false

  // Fetch food categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const response = await axios.get("/food-categories/")
        setCategories(response.data)
      } catch (err) {
        setError("Failed to load food categories")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // For TextField
  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // For Select
  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        expiry_date: date,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isVerified) {
      setError("You must be verified to create donations. Please contact an administrator to verify your account.")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      // Format the date for the API
      const formattedData = {
        ...formData,
        expiry_date: formData.expiry_date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      }

      await axios.post("/donations/", formattedData)
      setSuccess(true)

      // Reset form after successful submission
      setFormData({
        food_name: "",
        description: "",
        quantity: "",
        category: "",
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        pickup_address: "",
        pickup_city: "",
        pickup_state: "",
        pickup_zip: "",
        pickup_instructions: "",
      })

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/donor/my-donations")
      }, 2000)
    } catch (err: any) {
      if (err.response && err.response.data) {
        // Format API errors
        const apiErrors = err.response.data
        if (apiErrors.detail) {
          setError(apiErrors.detail)
        } else {
          const errorMessages = []
          for (const key in apiErrors) {
            if (Array.isArray(apiErrors[key])) {
              errorMessages.push(`${key}: ${apiErrors[key].join(", ")}`)
            } else {
              errorMessages.push(`${key}: ${apiErrors[key]}`)
            }
          }
          setError(errorMessages.join("\n"))
        }
      } else {
        setError("Failed to create donation. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
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
              <AddIcon sx={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
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
            Loading donation form...
          </Typography>
        </LoadingBox>
      </GradientBox>
    )
  }

  // Show verification warning if user is not verified
  if (!isVerified) {
    return (
      <GradientBox>
        <Box sx={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                  mb: 4,
                  textAlign: "center",
                }}
              >
                Add New Donation
              </Typography>

              <WarningCard severity="warning" sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: "#ff9800", width: 48, height: 48 }}>
                    <WarningIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#e65100" }}>
                      Account Verification Required
                    </Typography>
                    <Typography variant="body1" sx={{ color: "#f57c00", fontWeight: 500 }}>
                      You must be verified to create donations. Please contact an administrator to verify your account.
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: "#ef6c00", mt: 1 }}>
                  Verification helps ensure the safety and authenticity of food donations on our platform.
                </Typography>
              </WarningCard>

              <GlassCard elevation={0} sx={{ p: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Avatar sx={{ bgcolor: "#4caf50", width: 48, height: 48 }}>
                    <InfoIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                    What you can do while waiting for verification:
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  {[
                    { icon: HomeIcon, text: "Complete your profile information", color: "#2196f3" },
                    { icon: FoodIcon, text: "Browse the platform to familiarize yourself", color: "#9c27b0" },
                    { icon: ScheduleIcon, text: "Track your food waste to prepare for donations", color: "#ff9800" },
                  ].map((item, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 2,
                          borderRadius: 2,
                          background: `${item.color}10`,
                          border: `1px solid ${item.color}30`,
                        }}
                      >
                        <Avatar sx={{ bgcolor: `${item.color}20`, color: item.color, width: 40, height: 40 }}>
                          <item.icon />
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: "#333" }}>
                          {item.text}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                <Box sx={{ mt: 4, display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/donor/dashboard")}
                    sx={{
                      background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                    }}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/donor/track-waste")}
                    sx={{
                      borderColor: "#ff9800",
                      color: "#ff9800",
                      borderRadius: 3,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#f57c00",
                        backgroundColor: "rgba(255, 152, 0, 0.08)",
                      },
                    }}
                  >
                    Track Food Waste
                  </Button>
                </Box>
              </GlassCard>
            </Box>
          </Fade>
        </Box>
      </GradientBox>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <GradientBox>
        <Box sx={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <Fade in timeout={800}>
            <Box>
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
                  textAlign: "center",
                }}
              >
                Add New Donation
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255, 255, 255, 0.9)",
                  textAlign: "center",
                  mb: 4,
                  fontWeight: 500,
                  textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                }}
              >
                Share your surplus food and help reduce waste in your community
              </Typography>

              {/* Progress Stepper */}
              <GlassCard elevation={0} sx={{ p: 3, mb: 4 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                  {steps.map((label, index) => (
                    <Step key={label}>
                      <StepLabel
                        sx={{
                          "& .MuiStepLabel-label": {
                            fontWeight: 600,
                            color: index <= activeStep ? "#4caf50" : "#999",
                          },
                          "& .MuiStepIcon-root": {
                            color: index <= activeStep ? "#4caf50" : "#ccc",
                            fontSize: "1.5rem",
                          },
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </GlassCard>

              {error && (
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
                    {error}
                  </Alert>
                </Grow>
              )}

              <GlassCard elevation={0} sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit}>
                  {/* Food Information Section */}
                  <SectionCard>
                    <CardContent sx={{ p: 4 }}>
                      <SectionHeader>
                        <Avatar sx={{ bgcolor: "#4caf50", width: 48, height: 48 }}>
                          <FoodIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                            Food Information
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                            Tell us about the food you're donating
                          </Typography>
                        </Box>
                        <Chip
                          label="Step 1"
                          sx={{
                            background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
                            color: "white",
                            fontWeight: 600,
                            ml: "auto",
                          }}
                        />
                      </SectionHeader>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            required
                            fullWidth
                            id="food_name"
                            name="food_name"
                            label="Food Name"
                            value={formData.food_name}
                            onChange={handleTextFieldChange}
                            InputProps={{
                              startAdornment: <FoodIcon sx={{ color: "#4caf50", mr: 1, fontSize: "1.2rem" }} />,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <StyledTextField
                            required
                            fullWidth
                            id="quantity"
                            name="quantity"
                            label="Quantity (e.g., 5 lbs, 3 boxes)"
                            value={formData.quantity}
                            onChange={handleTextFieldChange}
                            InputProps={{
                              startAdornment: <CategoryIcon sx={{ color: "#2196f3", mr: 1, fontSize: "1.2rem" }} />,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <StyledFormControl fullWidth required>
                            <InputLabel id="category-label">
                              {categories.length === 0 ? "No Categories Available" : "Food Category"}
                            </InputLabel>
                            <Select
                              labelId="category-label"
                              id="category"
                              name="category"
                              value={formData.category}
                              label={categories.length === 0 ? "No Categories Available" : "Food Category"}
                              onChange={handleSelectChange}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    minWidth: 250, // Ensures dropdown menu is wide enough
                                  },
                                },
                              }}
                              sx={{
                                minWidth: 250, // Ensures the select input itself is wide enough
                              }}
                              disabled={categories.length === 0}
                              displayEmpty
                            >
                              {categories.length === 0 ? (
                                <MenuItem value="" disabled>
                                  No categories found
                                </MenuItem>
                              ) : (
                                categories.map((category) => (
                                  <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                  </MenuItem>
                                ))
                              )}
                            </Select>
                          </StyledFormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            label="Expiry Date"
                            value={formData.expiry_date}
                            onChange={handleDateChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                required: true,
                                sx: {
                                  "& .MuiOutlinedInput-root": {
                                    background: "rgba(255, 255, 255, 0.8)",
                                    backdropFilter: "blur(10px)",
                                    borderRadius: 2,
                                  },
                                },
                              },
                            }}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <StyledTextField
                            required
                            fullWidth
                            id="description"
                            name="description"
                            label="Description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleTextFieldChange}
                            InputProps={{
                              startAdornment: (
                                <DescriptionIcon
                                  sx={{ color: "#9c27b0", mr: 1, fontSize: "1.2rem", alignSelf: "flex-start", mt: 1 }}
                                />
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </SectionCard>

                  {/* Pickup Information Section */}
                  <SectionCard>
                    <CardContent sx={{ p: 4 }}>
                      <SectionHeader>
                        <Avatar sx={{ bgcolor: "#2196f3", width: 48, height: 48 }}>
                          <LocationIcon sx={{ fontSize: 28 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                            Pickup Information
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                            Where can recipients collect the donation?
                          </Typography>
                        </Box>
                        <Chip
                          label="Step 2"
                          sx={{
                            background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
                            color: "white",
                            fontWeight: 600,
                            ml: "auto",
                          }}
                        />
                      </SectionHeader>

                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <StyledTextField
                            required
                            fullWidth
                            id="pickup_address"
                            name="pickup_address"
                            label="Pickup Address"
                            value={formData.pickup_address}
                            onChange={handleTextFieldChange}
                            InputProps={{
                              startAdornment: <HomeIcon sx={{ color: "#2196f3", mr: 1, fontSize: "1.2rem" }} />,
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            required
                            fullWidth
                            id="pickup_city"
                            name="pickup_city"
                            label="City"
                            value={formData.pickup_city}
                            onChange={handleTextFieldChange}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            required
                            fullWidth
                            id="pickup_state"
                            name="pickup_state"
                            label="State"
                            value={formData.pickup_state}
                            onChange={handleTextFieldChange}
                          />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <StyledTextField
                            required
                            fullWidth
                            id="pickup_zip"
                            name="pickup_zip"
                            label="ZIP Code"
                            value={formData.pickup_zip}
                            onChange={handleTextFieldChange}
                          />
                        </Grid>

                        <Grid item xs={12}>
                          <StyledTextField
                            fullWidth
                            id="pickup_instructions"
                            name="pickup_instructions"
                            label="Pickup Instructions (Optional)"
                            multiline
                            rows={2}
                            value={formData.pickup_instructions}
                            onChange={handleTextFieldChange}
                            placeholder="E.g., Ring the doorbell, call when arriving, etc."
                            InputProps={{
                              startAdornment: (
                                <InfoIcon
                                  sx={{ color: "#ff9800", mr: 1, fontSize: "1.2rem", alignSelf: "flex-start", mt: 1 }}
                                />
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </SectionCard>

                  {/* Submit Section */}
                  <Box sx={{ textAlign: "center", mt: 4 }}>
                    <SubmitButton
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={submitting}
                      startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                    >
                      {submitting ? "Creating Donation..." : "Submit Donation"}
                    </SubmitButton>
                    <Typography variant="body2" sx={{ mt: 2, color: "rgba(255, 255, 255, 0.8)" }}>
                      By submitting, you agree to our terms and conditions
                    </Typography>
                  </Box>
                </Box>
              </GlassCard>
            </Box>
          </Fade>
        </Box>

        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={() => setSuccess(false)}
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
            Donation created successfully! Redirecting...
          </Alert>
        </Snackbar>
      </GradientBox>
    </LocalizationProvider>
  )
}

export default AddDonation
