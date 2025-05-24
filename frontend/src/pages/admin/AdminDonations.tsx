"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Container,
  Stack,
  Avatar,
  Fade,
  Grow,
  Grid,
} from "@mui/material"
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Fastfood as FoodIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material"
import type { Donation } from "../../types"
import type { SelectChangeEvent } from "@mui/material/Select"

const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [editFormData, setEditFormData] = useState({
    status: "",
    expiry_date: "",
  })

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("/donations/")
        setDonations(response.data)
      } catch (err) {
        setError("Failed to load donations")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleViewClick = (donation: Donation) => {
    setSelectedDonation(donation)
    setViewDialogOpen(true)
  }

  const handleEditClick = (donation: Donation) => {
    setSelectedDonation(donation)
    setEditFormData({
      status: donation.status,
      expiry_date: donation.expiry_date,
    })
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (donation: Donation) => {
    setSelectedDonation(donation)
    setDeleteDialogOpen(true)
  }

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
      [name]: value,
    })
  }

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target
    setEditFormData({
      ...editFormData,
      [name]: value,
    })
  }

  const handleEditSubmit = async () => {
    if (!selectedDonation) return

    try {
      const response = await axios.put(`/donations/${selectedDonation.id}/`, {
        status: editFormData.status,
        expiry_date: editFormData.expiry_date,
      })
      setDonations(donations.map((donation) => (donation.id === selectedDonation.id ? response.data : donation)))
      setEditDialogOpen(false)
    } catch (err) {
      setError("Failed to update donation")
      console.error(err)
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedDonation) return

    try {
      await axios.delete(`/donations/${selectedDonation.id}/`)
      setDonations(donations.filter((donation) => donation.id !== selectedDonation.id))
      setDeleteDialogOpen(false)
    } catch (err) {
      setError("Failed to delete donation")
      console.error(err)
    }
  }

  const filteredDonations =
    statusFilter === "all" ? donations : donations.filter((donation) => donation.status === statusFilter)

  const getStatusChipSx = (status: string) => {
    switch (status) {
      case "available":
        return {
          bgcolor: "#e8f5e8",
          color: "#2e7d32",
          fontWeight: 600,
        }
      case "claimed":
        return {
          bgcolor: "#e3f2fd",
          color: "#1976d2",
          fontWeight: 600,
        }
      case "received":
        return {
          bgcolor: "#e0f2f1",
          color: "#00695c",
          fontWeight: 600,
        }
      case "expired":
        return {
          bgcolor: "#ffebee",
          color: "#c62828",
          fontWeight: 600,
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
  const totalDonations = donations.length
  const availableDonations = donations.filter((d) => d.status === "available").length
  const claimedDonations = donations.filter((d) => d.status === "claimed").length
  const expiredDonations = donations.filter((d) => d.status === "expired").length

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
            Loading donations...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
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
                background: "linear-gradient(45deg, #ed6c02, #ff9800)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Manage Donations
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400}>
              Oversee and manage all donations in the system
            </Typography>
          </Box>

          {error && (
            <Grow in timeout={400}>
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            </Grow>
          )}

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={3}>
              <Grow in timeout={800}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="#ed6c02">
                    {totalDonations}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Total Donations
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Grow in timeout={1000}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="#2e7d32">
                    {availableDonations}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Available
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Grow in timeout={1200}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="#1976d2">
                    {claimedDonations}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Claimed
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Grow in timeout={1400}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Typography variant="h4" fontWeight={700} color="#d32f2f">
                    {expiredDonations}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Expired
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
          </Grid>

          {/* Filter Section */}
          <Grow in timeout={1600}>
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
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "#ed6c02" }}>
                    <FilterIcon />
                  </Avatar>
                  <Typography variant="h6" fontWeight={600}>
                    Filter Donations
                  </Typography>
                </Stack>
                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Filter by Status"
                    onChange={(e) => setStatusFilter(e.target.value as string)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="all">All Donations</MenuItem>
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="claimed">Claimed</MenuItem>
                    <MenuItem value="received">Received</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Paper>
          </Grow>

          {/* Donations Table */}
          <Grow in timeout={1800}>
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                overflow: "hidden",
                border: "1px solid #e0e0e0",
                borderRadius: 3,
              }}
            >
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader aria-label="donations table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Food Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Donor</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Charity</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Expiry Date</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDonations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                          <Stack alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: "#f5f5f5", width: 64, height: 64 }}>
                              <FoodIcon sx={{ fontSize: 32, color: "#bdbdbd" }} />
                            </Avatar>
                            <Typography variant="h6" color="text.secondary">
                              No donations found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {statusFilter === "all" ? "No donations in the system" : `No ${statusFilter} donations`}
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDonations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((donation) => (
                        <TableRow
                          hover
                          key={donation.id}
                          sx={{
                            "&:hover": {
                              bgcolor: "#f8f9fa",
                            },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body1" fontWeight={600}>
                              {donation.food_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {donation.donor_details?.first_name} {donation.donor_details?.last_name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {donation.charity_details?.organization_name || "Not claimed"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(donation.expiry_date).toLocaleDateString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                              sx={getStatusChipSx(donation.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <IconButton
                                size="small"
                                onClick={() => handleViewClick(donation)}
                                sx={{
                                  bgcolor: "#f5f5f5",
                                  "&:hover": { bgcolor: "#e0e0e0" },
                                }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleEditClick(donation)}
                                sx={{
                                  bgcolor: "#e3f2fd",
                                  color: "#1976d2",
                                  "&:hover": { bgcolor: "#bbdefb" },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteClick(donation)}
                                sx={{
                                  bgcolor: "#ffebee",
                                  color: "#d32f2f",
                                  "&:hover": { bgcolor: "#ffcdd2" },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredDonations.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                  borderTop: "1px solid #e0e0e0",
                  bgcolor: "#f8f9fa",
                }}
              />
            </Paper>
          </Grow>

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
            <DialogTitle>
              <Typography variant="h5" fontWeight={700}>
                Donation Details
              </Typography>
            </DialogTitle>
            <DialogContent>
              {selectedDonation && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
                    {selectedDonation.food_name}
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                          Donation Information
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="body1">
                            <strong>Description:</strong> {selectedDonation.description}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Quantity:</strong> {selectedDonation.quantity}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Category:</strong> {selectedDonation.category_name}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Expiry Date:</strong> {new Date(selectedDonation.expiry_date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Status:</strong>{" "}
                            <Chip
                              label={selectedDonation.status.charAt(0).toUpperCase() + selectedDonation.status.slice(1)}
                              sx={getStatusChipSx(selectedDonation.status)}
                              size="small"
                            />
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                          Pickup Information
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="body1">
                            <strong>Address:</strong> {selectedDonation.pickup_address}, {selectedDonation.pickup_city},{" "}
                            {selectedDonation.pickup_state} {selectedDonation.pickup_zip}
                          </Typography>
                          {selectedDonation.pickup_instructions && (
                            <Typography variant="body1">
                              <strong>Instructions:</strong> {selectedDonation.pickup_instructions}
                            </Typography>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                          Participants
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1">
                              <strong>Donor:</strong> {selectedDonation.donor_details?.first_name}{" "}
                              {selectedDonation.donor_details?.last_name} ({selectedDonation.donor_details?.email})
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {selectedDonation.charity_details && (
                              <Typography variant="body1">
                                <strong>Claimed By:</strong> {selectedDonation.charity_details.organization_name} (
                                {selectedDonation.charity_details.email})
                              </Typography>
                            )}
                          </Grid>
                        </Grid>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f9fa", borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                          Timeline
                        </Typography>
                        <Stack spacing={1}>
                          <Typography variant="body1">
                            <strong>Created:</strong> {new Date(selectedDonation.created_at).toLocaleString()}
                          </Typography>
                          {selectedDonation.claimed_at && (
                            <Typography variant="body1">
                              <strong>Claimed:</strong> {new Date(selectedDonation.claimed_at).toLocaleString()}
                            </Typography>
                          )}
                          {selectedDonation.received_at && (
                            <Typography variant="body1">
                              <strong>Received:</strong> {new Date(selectedDonation.received_at).toLocaleString()}
                            </Typography>
                          )}
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setViewDialogOpen(false)} sx={{ borderRadius: 2 }}>
                Close
              </Button>
            </DialogActions>
          </Dialog>

          {/* Edit Donation Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            PaperProps={{
              sx: { borderRadius: 3 },
            }}
          >
            <DialogTitle>
              <Typography variant="h5" fontWeight={700}>
                Edit Donation
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 1 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={editFormData.status}
                    label="Status"
                    onChange={handleSelectChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="claimed">Claimed</MenuItem>
                    <MenuItem value="received">Received</MenuItem>
                    <MenuItem value="expired">Expired</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  margin="normal"
                  fullWidth
                  name="expiry_date"
                  label="Expiry Date"
                  type="date"
                  value={editFormData.expiry_date}
                  onChange={handleTextFieldChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setEditDialogOpen(false)} sx={{ borderRadius: 2 }}>
                Cancel
              </Button>
              <Button
                onClick={handleEditSubmit}
                variant="contained"
                sx={{
                  bgcolor: "#ed6c02",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete Donation Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            PaperProps={{
              sx: { borderRadius: 3 },
            }}
          >
            <DialogTitle>
              <Typography variant="h5" fontWeight={700}>
                Delete Donation
              </Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                Are you sure you want to delete the donation "{selectedDonation?.food_name}"? This action cannot be
                undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDeleteDialogOpen(false)} sx={{ borderRadius: 2 }}>
                Cancel
              </Button>
              <Button
                onClick={handleDeleteSubmit}
                color="error"
                variant="contained"
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Delete Donation
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Container>
  )
}

export default AdminDonations
