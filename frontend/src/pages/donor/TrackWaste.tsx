"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tabs,
  Tab,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Card,
  Fade,
  Grow,
  Container,
  Chip,
} from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  RestaurantMenu as FoodIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Notes as NotesIcon,
  Analytics as AnalyticsIcon,
  Co2Outlined as EcoIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import type { FoodCategory, WasteCategory, WasteLog } from "../../types"
import type { SelectChangeEvent } from "@mui/material/Select"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

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
    background: "linear-gradient(90deg, #ff9800, #f44336, #e91e63, #9c27b0)",
  },
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    background: "linear-gradient(90deg, #ff9800, #f44336)",
    height: 3,
    borderRadius: "3px 3px 0 0",
  },
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 600,
    fontSize: "1rem",
    minHeight: 60,
    transition: "all 0.3s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 152, 0, 0.08)",
      transform: "translateY(-2px)",
    },
    "&.Mui-selected": {
      color: "#ff9800",
      fontWeight: 700,
    },
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
        borderColor: "#ff9800",
      },
    },
    "&.Mui-focused": {
      background: "rgba(255, 255, 255, 1)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#ff9800",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#ff9800",
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
        borderColor: "#ff9800",
      },
    },
    "&.Mui-focused": {
      background: "rgba(255, 255, 255, 1)",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#ff9800",
        borderWidth: "2px",
      },
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 500,
    "&.Mui-focused": {
      color: "#ff9800",
    },
  },
}))

const SubmitButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
  borderRadius: theme.spacing(3),
  padding: theme.spacing(2, 4),
  fontSize: "1.1rem",
  fontWeight: 700,
  textTransform: "none",
  boxShadow: "0 8px 25px rgba(255, 152, 0, 0.4)",
  border: "2px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #f57c00 0%, #ef6c00 100%)",
    transform: "translateY(-2px)",
    boxShadow: "0 12px 35px rgba(255, 152, 0, 0.6)",
  },
  "&:disabled": {
    background: "rgba(0, 0, 0, 0.12)",
    color: "rgba(0, 0, 0, 0.26)",
  },
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  border: "1px solid rgba(0, 0, 0, 0.08)",
  "& .MuiTableHead-root": {
    background: "linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(244, 67, 54, 0.05) 100%)",
    "& .MuiTableCell-head": {
      fontWeight: 700,
      color: "#333",
      fontSize: "0.95rem",
      borderBottom: "2px solid rgba(255, 152, 0, 0.2)",
    },
  },
  "& .MuiTableRow-root": {
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 152, 0, 0.04)",
      transform: "scale(1.01)",
    },
  },
  "& .MuiTableCell-root": {
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    padding: theme.spacing(2),
  },
}))

const EmptyStateCard = styled(Card)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(0, 0, 0, 0.08)",
  borderRadius: theme.spacing(3),
  textAlign: "center",
  padding: theme.spacing(6),
  margin: theme.spacing(4, 0),
}))

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

const SectionHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  background: "linear-gradient(135deg, rgba(255, 152, 0, 0.05) 0%, rgba(244, 67, 54, 0.05) 100%)",
  borderRadius: theme.spacing(2),
  border: "1px solid rgba(255, 152, 0, 0.1)",
}))

const WasteTypeChip = styled(Chip)<{ wastetype: string }>(({ theme, wastetype }) => {
  const getWasteTypeStyles = () => {
    switch (wastetype) {
      case "spoiled":
        return {
          background: "linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)",
          color: "#c62828",
          border: "1px solid #f44336",
        }
      case "expired":
        return {
          background: "linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%)",
          color: "#e65100",
          border: "1px solid #ff9800",
        }
      case "leftovers":
        return {
          background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)",
          color: "#7b1fa2",
          border: "1px solid #9c27b0",
        }
      default:
        return {
          background: "linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%)",
          color: "#616161",
          border: "1px solid #9e9e9e",
        }
    }
  }

  return {
    ...getWasteTypeStyles(),
    fontWeight: 600,
    borderRadius: theme.spacing(2),
    transition: "all 0.2s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  }
})

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  )
}

const WASTE_TYPES = [
  { value: "spoiled", label: "Spoiled" },
  { value: "expired", label: "Expired" },
  { value: "leftovers", label: "Leftovers" },
  { value: "other", label: "Other" },
]

const TrackWaste: React.FC = () => {
  const [tabValue, setTabValue] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [foodCategories, setFoodCategories] = useState<FoodCategory[]>([])
  const [wasteCategories, setWasteCategories] = useState<WasteCategory[]>([])
  const [wasteLogs, setWasteLogs] = useState<WasteLog[]>([])
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedWasteLog, setSelectedWasteLog] = useState<WasteLog | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    food_name: "",
    description: "",
    quantity: "",
    waste_type: "",
    waste_category: "",
    food_category: "",
    date: new Date(),
    notes: "",
  })

  // Fetch categories and waste logs
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [foodCategoriesRes, wasteCategoriesRes, wasteLogsRes] = await Promise.all([
          axios.get("/food-categories/"),
          axios.get("/waste-categories/"),
          axios.get("/waste-logs/my_logs/"),
        ])

        setFoodCategories(foodCategoriesRes.data)
        setWasteCategories(wasteCategoriesRes.data)
        setWasteLogs(wasteLogsRes.data)
      } catch (err) {
        setError("Failed to load data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name as string]: value,
    })
  }

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

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
        date,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      // Format the date for the API
      const formattedData = {
        ...formData,
        date: formData.date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      }

      const response = await axios.post("/waste-logs/", formattedData)

      // Add the new waste log to the list
      setWasteLogs([response.data, ...wasteLogs])
      setSuccess(true)

      // Reset form after successful submission
      setFormData({
        food_name: "",
        description: "",
        quantity: "",
        waste_type: "",
        waste_category: "",
        food_category: "",
        date: new Date(),
        notes: "",
      })

      // Switch to the logs tab
      setTabValue(1)
    } catch (err: any) {
      if (err.response && err.response.data) {
        // Format API errors
        const apiErrors = err.response.data
        const errorMessages = []
        for (const key in apiErrors) {
          if (Array.isArray(apiErrors[key])) {
            errorMessages.push(`${key}: ${apiErrors[key].join(", ")}`)
          } else {
            errorMessages.push(`${key}: ${apiErrors[key]}`)
          }
        }
        setError(errorMessages.join("\n"))
      } else {
        setError("Failed to create waste log. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleViewClick = (wasteLog: WasteLog) => {
    setSelectedWasteLog(wasteLog)
    setViewDialogOpen(true)
  }

  const handleDeleteClick = (wasteLog: WasteLog) => {
    setSelectedWasteLog(wasteLog)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSubmit = async () => {
    if (!selectedWasteLog) return

    try {
      await axios.delete(`/waste-logs/${selectedWasteLog.id}/`)
      // Remove the deleted waste log from the list
      setWasteLogs(wasteLogs.filter((log) => log.id !== selectedWasteLog.id))
      setDeleteDialogOpen(false)
    } catch (err) {
      setError("Failed to delete waste log")
      console.error(err)
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
              <EcoIcon sx={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
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
            Loading waste tracking...
          </Typography>
        </LoadingBox>
      </GradientBox>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                  Track Food Waste
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 500,
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Monitor and reduce food waste to help the environment
                </Typography>
              </Box>

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

              <GlassCard sx={{ mb: 4 }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3, pt: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar sx={{ bgcolor: "#ff9800", width: 40, height: 40 }}>
                      <EcoIcon />
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                      Waste Management
                    </Typography>
                  </Box>
                  <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="waste tracking tabs">
                    <Tab label="Log New Waste" icon={<AddIcon />} iconPosition="start" />
                    <Tab
                      label={`View Waste Logs (${wasteLogs.length})`}
                      icon={<AnalyticsIcon />}
                      iconPosition="start"
                    />
                  </StyledTabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ p: 4 }}>
                    <SectionHeader>
                      <Avatar sx={{ bgcolor: "#ff9800", width: 48, height: 48 }}>
                        <WarningIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                          Log Food Waste
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#666", fontWeight: 500 }}>
                          Track wasted food to identify patterns and reduce waste
                        </Typography>
                      </Box>
                    </SectionHeader>

                    <Box component="form" onSubmit={handleSubmit}>
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
                              startAdornment: <FoodIcon sx={{ color: "#ff9800", mr: 1, fontSize: "1.2rem" }} />,
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
                              startAdornment: <CategoryIcon sx={{ color: "#f44336", mr: 1, fontSize: "1.2rem" }} />,
                            }}
                          />
                        </Grid>

                        {/* Waste Type Dropdown */}
                        <Grid item xs={12} sm={6}>
                          <StyledFormControl fullWidth required sx={{ minWidth: 250 }}>
                            <InputLabel id="waste-type-label">Waste Type</InputLabel>
                            <Select
                              labelId="waste-type-label"
                              id="waste_type"
                              name="waste_type"
                              value={formData.waste_type}
                              label="Waste Type"
                              onChange={handleSelectChange}
                              sx={{ minWidth: 250 }}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>
                                
                              </MenuItem>
                              {WASTE_TYPES.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                  {type.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </StyledFormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <DatePicker
                            label="Date"
                            value={formData.date}
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

                        {/* Food Category Dropdown */}
                        <StyledFormControl fullWidth sx={{ minWidth: 250 }}>
                          <InputLabel id="food-category-label">
                            {foodCategories.length === 0 ? "No Food Categories" : "Food Category"}
                          </InputLabel>
                          <Select
                            labelId="food-category-label"
                            id="food_category"
                            name="food_category"
                            value={formData.food_category}
                            label={foodCategories.length === 0 ? "No Food Categories" : "Food Category"}
                            onChange={handleSelectChange}
                            sx={{ minWidth: 250 }}
                            displayEmpty
                            disabled={foodCategories.length === 0}
                          >
                            {foodCategories.length === 0 ? (
                              <MenuItem value="" disabled>
                                No categories found
                              </MenuItem>
                            ) : (
                              foodCategories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                  {category.name}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </StyledFormControl>

                        {/* Waste Category Dropdown */}
                        <StyledFormControl fullWidth sx={{ minWidth: 250 }}>
                          <InputLabel id="waste-category-label">
                            {wasteCategories.length === 0 ? "No Waste Categories" : "Waste Category"}
                          </InputLabel>
                          <Select
                            labelId="waste-category-label"
                            id="waste_category"
                            name="waste_category"
                            value={formData.waste_category}
                            label={wasteCategories.length === 0 ? "No Waste Categories" : "Waste Category"}
                            onChange={handleSelectChange}
                            sx={{ minWidth: 250 }}
                            displayEmpty
                            disabled={wasteCategories.length === 0}
                          >
                            {wasteCategories.length === 0 ? (
                              <MenuItem value="" disabled>
                                No categories found
                              </MenuItem>
                            ) : (
                              wasteCategories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                  {category.name}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </StyledFormControl>

                        <Grid item xs={12}>
                          <StyledTextField
                            fullWidth
                            id="description"
                            name="description"
                            label="Description (Optional)"
                            multiline
                            rows={2}
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

                        <Grid item xs={12}>
                          <StyledTextField
                            fullWidth
                            id="notes"
                            name="notes"
                            label="Notes (Optional)"
                            multiline
                            rows={2}
                            value={formData.notes}
                            onChange={handleTextFieldChange}
                            placeholder="Any additional information about this waste"
                            InputProps={{
                              startAdornment: (
                                <NotesIcon
                                  sx={{ color: "#2196f3", mr: 1, fontSize: "1.2rem", alignSelf: "flex-start", mt: 1 }}
                                />
                              ),
                            }}
                          />
                        </Grid>

                        <Grid item xs={12} sx={{ mt: 2, textAlign: "center" }}>
                          <SubmitButton
                            type="submit"
                            variant="contained"
                            size="large"
                            disabled={submitting}
                            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                          >
                            {submitting ? "Logging Waste..." : "Log Food Waste"}
                          </SubmitButton>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  {wasteLogs.length === 0 ? (
                    <EmptyStateCard>
                      <Avatar
                        sx={{
                          bgcolor: "rgba(255, 152, 0, 0.1)",
                          width: 80,
                          height: 80,
                          mx: "auto",
                          mb: 3,
                        }}
                      >
                        <EcoIcon sx={{ fontSize: 40, color: "#ff9800" }} />
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 2 }}>
                        No waste logs yet
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#666", mb: 4, maxWidth: 400, mx: "auto" }}>
                        Start tracking your food waste to help reduce waste and improve sustainability in your kitchen.
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => setTabValue(0)}
                        startIcon={<AddIcon />}
                        sx={{
                          background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                          borderRadius: 3,
                          px: 4,
                          py: 2,
                          fontWeight: 700,
                          textTransform: "none",
                          fontSize: "1.1rem",
                        }}
                      >
                        Log Your First Waste
                      </Button>
                    </EmptyStateCard>
                  ) : (
                    <>
                      <StyledTableContainer sx={{ maxHeight: 500 }}>
                        <Table stickyHeader aria-label="waste logs table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Food Name</TableCell>
                              <TableCell>Quantity</TableCell>
                              <TableCell>Waste Type</TableCell>
                              <TableCell>Date</TableCell>
                              <TableCell>Category</TableCell>
                              <TableCell align="center">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {wasteLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                              <TableRow hover key={log.id}>
                                <TableCell>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {log.food_name}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {log.quantity}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <WasteTypeChip
                                    wastetype={log.waste_type}
                                    label={log.waste_type.charAt(0).toUpperCase() + log.waste_type.slice(1)}
                                    size="medium"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">{new Date(log.date).toLocaleDateString()}</Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {log.food_category_name || log.waste_category_name || "Not categorized"}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleViewClick(log)}
                                      sx={{
                                        color: "#2196f3",
                                        "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.1)" },
                                      }}
                                    >
                                      <ViewIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteClick(log)}
                                      sx={{
                                        color: "#f44336",
                                        "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.1)" },
                                      }}
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </StyledTableContainer>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={wasteLogs.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        sx={{
                          borderTop: "1px solid rgba(0, 0, 0, 0.06)",
                          "& .MuiTablePagination-toolbar": {
                            padding: "16px 24px",
                          },
                        }}
                      />
                    </>
                  )}
                </TabPanel>
              </GlassCard>
            </Box>
          </Fade>

          {/* View Waste Log Dialog */}
          <StyledDialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md">
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#2196f3" }}>
                  <ViewIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Waste Log Details
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              {selectedWasteLog && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 2 }}>
                        {selectedWasteLog.food_name}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(255, 152, 0, 0.05)" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#ff9800", mb: 1 }}>
                          Waste Information
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Quantity:</strong> {selectedWasteLog.quantity}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Date:</strong> {new Date(selectedWasteLog.date).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <WasteTypeChip
                            wastetype={selectedWasteLog.waste_type}
                            label={
                              selectedWasteLog.waste_type.charAt(0).toUpperCase() + selectedWasteLog.waste_type.slice(1)
                            }
                            size="medium"
                          />
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(156, 39, 176, 0.05)" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#9c27b0", mb: 1 }}>
                          Categories
                        </Typography>
                        {selectedWasteLog.food_category_name && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Food Category:</strong> {selectedWasteLog.food_category_name}
                          </Typography>
                        )}
                        {selectedWasteLog.waste_category_name && (
                          <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Waste Category:</strong> {selectedWasteLog.waste_category_name}
                          </Typography>
                        )}
                        <Typography variant="body1">
                          <strong>Created:</strong> {new Date(selectedWasteLog.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>

                    {(selectedWasteLog.description || selectedWasteLog.notes) && (
                      <Grid item xs={12}>
                        <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(33, 150, 243, 0.05)" }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#2196f3", mb: 1 }}>
                            Additional Information
                          </Typography>
                          {selectedWasteLog.description && (
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Description:</strong> {selectedWasteLog.description}
                            </Typography>
                          )}
                          {selectedWasteLog.notes && (
                            <Typography variant="body1">
                              <strong>Notes:</strong> {selectedWasteLog.notes}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => setViewDialogOpen(false)}
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)",
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Close
              </Button>
            </DialogActions>
          </StyledDialog>

          {/* Delete Waste Log Dialog */}
          <StyledDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "#f44336" }}>
                  <DeleteIcon />
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Delete Waste Log
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography sx={{ fontSize: "1.1rem", color: "#333" }}>
                Are you sure you want to delete the waste log for <strong>"{selectedWasteLog?.food_name}"</strong>? This
                action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 2 }}>
              <Button
                onClick={() => setDeleteDialogOpen(false)}
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
                onClick={handleDeleteSubmit}
                variant="contained"
                sx={{
                  background: "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  textTransform: "none",
                }}
              >
                Delete
              </Button>
            </DialogActions>
          </StyledDialog>

          <Snackbar
            open={success}
            autoHideDuration={6000}
            onClose={() => setSuccess(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity="success"
              sx={{
                background: "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                color: "white",
                borderRadius: 3,
                fontWeight: 600,
                "& .MuiAlert-icon": { color: "white" },
              }}
            >
              Waste log created successfully!
            </Alert>
          </Snackbar>
        </Container>
      </GradientBox>
    </LocalizationProvider>
  )
}

export default TrackWaste
