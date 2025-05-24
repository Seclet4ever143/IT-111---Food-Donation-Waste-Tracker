"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Container,
  Stack,
  Avatar,
  Fade,
  Grow,
} from "@mui/material"
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Visibility as ViewIcon,
  CardGiftcard as GiftIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
} from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { useAuth } from "../../contexts/AuthContext"
import type { Donation, FoodCategory } from "../../types"

const AvailableDonations: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [categories, setCategories] = useState<FoodCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [claimDialogOpen, setClaimDialogOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Search filters
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [locationFilter, setLocationFilter] = useState<string>("")
  const [expiryDateFilter, setExpiryDateFilter] = useState<Date | null>(null)

  // Claim form
  const [claimForm, setClaimForm] = useState({
    pickup_time: "",
    notes: "",
  })

  // Check if user is verified
  const isVerified = user?.is_verified || false

  // Parse URL params for direct viewing
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const viewId = params.get("view")

    if (viewId) {
      const fetchDonation = async () => {
        try {
          const response = await axios.get(`/donations/${viewId}/`)
          setSelectedDonation(response.data)
          setViewDialogOpen(true)
        } catch (err) {
          console.error("Failed to fetch donation details", err)
        }
      }

      fetchDonation()
    }
  }, [location])

  // Fetch available donations and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [donationsRes, categoriesRes] = await Promise.all([
          axios.get("/donations/available/"),
          axios.get("/food-categories/"),
        ])

        setDonations(donationsRes.data)
        setCategories(categoriesRes.data)
      } catch (err) {
        setError("Failed to load available donations")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleViewDonation = (donation: Donation) => {
    setSelectedDonation(donation)
    setViewDialogOpen(true)
  }

  const handleClaimClick = () => {
    if (!isVerified) {
      setError("You must be verified to claim donations. Please contact an administrator to verify your account.")
      return
    }
    setViewDialogOpen(false)
    setClaimDialogOpen(true)
  }

  const handleClaimChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target
    setClaimForm({
      ...claimForm,
      [name as string]: value,
    })
  }

  const handleClaimSubmit = async () => {
    if (!selectedDonation) return

    if (!isVerified) {
      setError("You must be verified to claim donations. Please contact an administrator to verify your account.")
      return
    }

    setSubmitting(true)
    try {
      const formattedClaimData = {
        ...claimForm,
        donation: selectedDonation.id,
        pickup_time: claimForm.pickup_time ? new Date(claimForm.pickup_time).toISOString() : null,
      }

      await axios.post(`/donations/${selectedDonation.id}/claim/`, formattedClaimData)

      setDonations(donations.filter((d) => d.id !== selectedDonation.id))
      setSuccess(`Successfully claimed "${selectedDonation.food_name}"`)

      setClaimDialogOpen(false)
      setClaimForm({
        pickup_time: "",
        notes: "",
      })

      setTimeout(() => {
        navigate("/charity/claimed-donations")
      }, 2000)
    } catch (err: any) {
      console.error("Claim error:", err)
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail)
      } else {
        setError("Failed to claim donation. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("")
    setLocationFilter("")
    setExpiryDateFilter(null)
  }

  // Filter donations based on search criteria
  const filteredDonations = donations.filter((donation) => {
    const matchesSearch =
      searchTerm === "" ||
      donation.food_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor_details?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor_details?.last_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === "" || donation.category.toString() === categoryFilter
    const matchesLocation =
      locationFilter === "" ||
      donation.pickup_city.toLowerCase().includes(locationFilter.toLowerCase()) ||
      donation.pickup_state.toLowerCase().includes(locationFilter.toLowerCase()) ||
      donation.pickup_zip.includes(locationFilter)

    const matchesExpiry = !expiryDateFilter || new Date(donation.expiry_date) >= expiryDateFilter

    return matchesSearch && matchesCategory && matchesLocation && matchesExpiry
  })

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
            Loading available donations...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Fade in timeout={600}>
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
                Available Donations
              </Typography>
              <Typography variant="h6" color="text.secondary" fontWeight={400}>
                Find and claim food donations in your area
              </Typography>
            </Box>

            {error && (
              <Grow in timeout={400}>
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
                  {error}
                </Alert>
              </Grow>
            )}

            {success && (
              <Grow in timeout={400}>
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccess(null)}>
                  {success}
                </Alert>
              </Grow>
            )}

            {/* Verification Warning */}
            {!isVerified && (
              <Grow in timeout={600}>
                <Alert
                  severity="warning"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    "& .MuiAlert-icon": { fontSize: 24 },
                  }}
                  icon={<WarningIcon />}
                >
                  <Typography variant="body1" fontWeight={600}>
                    Account Verification Required
                  </Typography>
                  <Typography variant="body2">
                    You must be verified to claim donations. Please contact an administrator to verify your account.
                  </Typography>
                </Alert>
              </Grow>
            )}

            {/* Search and Filters */}
            <Grow in timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 4,
                  border: "1px solid #e0e0e0",
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)",
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                  <Avatar sx={{ bgcolor: "#1976d2" }}>
                    <FilterIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    Search & Filter Donations
                  </Typography>
                </Stack>

                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      placeholder="Search donations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <FormControl fullWidth sx={{ minWidth: 180 }}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={categoryFilter}
                        label="Category"
                        onChange={(e) => setCategoryFilter(e.target.value as string)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="">All Categories</MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      placeholder="City, State, or ZIP"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LocationIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <DatePicker
                      label="Expires After"
                      value={expiryDateFilter}
                      onChange={setExpiryDateFilter}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              borderRadius: 2,
                            },
                          },
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={1}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={clearFilters}
                      startIcon={<ClearIcon />}
                      sx={{
                        borderRadius: 2,
                        py: 1.8,
                        textTransform: "none",
                      }}
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grow>

            {/* Results */}
            {filteredDonations.length === 0 ? (
              <Grow in timeout={1000}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 6,
                    textAlign: "center",
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#f5f5f5",
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    <GiftIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                  </Avatar>
                  <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                    No available donations found
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Try adjusting your search filters or check back later for new donations.
                  </Typography>
                  <Button variant="contained" onClick={clearFilters} sx={{ borderRadius: 2 }}>
                    Clear Filters
                  </Button>
                </Paper>
              </Grow>
            ) : (
              <Grid container spacing={3}>
                {filteredDonations.map((donation, index) => (
                  <Grid item xs={12} sm={6} md={4} key={donation.id}>
                    <Grow in timeout={1000 + index * 100}>
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          border: "1px solid #e0e0e0",
                          borderRadius: 3,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-8px)",
                            boxShadow: "0 12px 35px rgba(0,0,0,0.1)",
                            borderColor: "#1976d2",
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1, mr: 1 }}>
                              {donation.food_name}
                            </Typography>
                            <Chip
                              label={donation.category_name}
                              size="small"
                              sx={{
                                bgcolor: "#e3f2fd",
                                color: "#1976d2",
                                fontWeight: 600,
                              }}
                            />
                          </Stack>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {donation.description}
                          </Typography>

                          <Divider sx={{ my: 2 }} />

                          <Stack spacing={1.5}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <TimeIcon fontSize="small" sx={{ color: "text.secondary" }} />
                              <Typography variant="body2" color="text.secondary">
                                Expires: {new Date(donation.expiry_date).toLocaleDateString()}
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <LocationIcon fontSize="small" sx={{ color: "text.secondary" }} />
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {donation.pickup_city}, {donation.pickup_state}
                              </Typography>
                            </Stack>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <PersonIcon fontSize="small" sx={{ color: "text.secondary" }} />
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {donation.donor_details?.first_name} {donation.donor_details?.last_name}
                              </Typography>
                            </Stack>
                          </Stack>
                        </CardContent>
                        <CardActions sx={{ p: 3, pt: 0 }}>
                          <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => handleViewDonation(donation)}
                            startIcon={<ViewIcon />}
                            sx={{
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            View Details
                          </Button>
                        </CardActions>
                      </Card>
                    </Grow>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* View Donation Dialog */}
            <Dialog
              open={viewDialogOpen}
              onClose={() => setViewDialogOpen(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                sx: { borderRadius: 3 },
              }}
            >
              <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h5" fontWeight={700}>
                  Donation Details
                </Typography>
              </DialogTitle>
              <DialogContent>
                {selectedDonation && (
                  <Box sx={{ mt: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                      <Typography variant="h4" fontWeight={700}>
                        {selectedDonation.food_name}
                      </Typography>
                      <Chip
                        label={selectedDonation.category_name}
                        sx={{
                          bgcolor: "#e3f2fd",
                          color: "#1976d2",
                          fontWeight: 600,
                        }}
                      />
                    </Stack>

                    <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                      {selectedDonation.description}
                    </Typography>

                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            Donation Details
                          </Typography>
                          <Stack spacing={1}>
                            <Typography variant="body1">
                              <strong>Quantity:</strong> {selectedDonation.quantity}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Expiry Date:</strong>{" "}
                              {new Date(selectedDonation.expiry_date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Posted:</strong> {new Date(selectedDonation.created_at).toLocaleDateString()}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                            Donor Information
                          </Typography>
                          <Stack spacing={1}>
                            <Typography variant="body1">
                              <strong>Name:</strong> {selectedDonation.donor_details?.first_name}{" "}
                              {selectedDonation.donor_details?.last_name}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Location:</strong> {selectedDonation.pickup_city}, {selectedDonation.pickup_state}{" "}
                              {selectedDonation.pickup_zip}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Paper elevation={0} sx={{ p: 3, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                        Pickup Information
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Address:</strong> {selectedDonation.pickup_address}, {selectedDonation.pickup_city},{" "}
                        {selectedDonation.pickup_state} {selectedDonation.pickup_zip}
                      </Typography>
                      {selectedDonation.pickup_instructions && (
                        <Typography variant="body1">
                          <strong>Instructions:</strong> {selectedDonation.pickup_instructions}
                        </Typography>
                      )}
                    </Paper>
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setViewDialogOpen(false)} sx={{ borderRadius: 2 }}>
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClaimClick}
                  disabled={!isVerified}
                  startIcon={<GiftIcon />}
                  sx={{
                    bgcolor: "#1976d2",
                    borderRadius: 2,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {isVerified ? "Claim This Donation" : "Verification Required"}
                </Button>
              </DialogActions>
            </Dialog>

            {/* Claim Donation Dialog */}
            <Dialog
              open={claimDialogOpen}
              onClose={() => setClaimDialogOpen(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: { borderRadius: 3 },
              }}
            >
              <DialogTitle>
                <Typography variant="h5" fontWeight={700}>
                  Claim Donation
                </Typography>
              </DialogTitle>
              <DialogContent>
                {selectedDonation && (
                  <Box sx={{ mt: 2 }}>
                    <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
                      <Typography variant="body1">
                        You are about to claim "{selectedDonation.food_name}" from{" "}
                        {selectedDonation.donor_details?.first_name} {selectedDonation.donor_details?.last_name}.
                      </Typography>
                    </Alert>

                    <TextField
                      margin="dense"
                      id="pickup_time"
                      name="pickup_time"
                      label="Planned Pickup Time"
                      type="datetime-local"
                      fullWidth
                      value={claimForm.pickup_time}
                      onChange={handleClaimChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                      required
                    />

                    <TextField
                      margin="dense"
                      id="notes"
                      name="notes"
                      label="Notes for Donor (Optional)"
                      multiline
                      rows={4}
                      fullWidth
                      value={claimForm.notes}
                      onChange={handleClaimChange}
                      placeholder="Any special instructions or information for the donor"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={() => setClaimDialogOpen(false)} sx={{ borderRadius: 2 }}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleClaimSubmit}
                  disabled={submitting || !claimForm.pickup_time || !isVerified}
                  startIcon={submitting ? <CircularProgress size={20} /> : <GiftIcon />}
                  sx={{
                    bgcolor: "#1976d2",
                    borderRadius: 2,
                    px: 3,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {submitting ? "Claiming..." : "Confirm Claim"}
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Fade>
      </Container>
    </LocalizationProvider>
  )
}

export default AvailableDonations
