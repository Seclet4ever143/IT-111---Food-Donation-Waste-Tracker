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
  Tabs,
  Tab,
  Container,
  Stack,
  Avatar,
  Fade,
  Grow,
  Grid,
} from "@mui/material"
import {
  Visibility as ViewIcon,
  CheckCircle as ReceiveIcon,
  Inventory as InventoryIcon,
  Schedule as ScheduleIcon,
  CheckCircleOutline as CompletedIcon,
  Assignment as AllIcon,
} from "@mui/icons-material"
import type { Donation } from "../../types"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

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

const ClaimedDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [tabValue, setTabValue] = useState(0)

  // Fetch claimed donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("/donations/claimed/")
        setDonations(response.data)
      } catch (err) {
        setError("Failed to load claimed donations")
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
    setPage(0)
  }

  const handleViewClick = (donation: Donation) => {
    setSelectedDonation(donation)
    setViewDialogOpen(true)
  }

  const handleReceiveClick = (donation: Donation) => {
    setSelectedDonation(donation)
    setReceiveDialogOpen(true)
  }

  const handleReceiveSubmit = async () => {
    if (!selectedDonation) return

    setSubmitting(true)
    try {
      const response = await axios.post(`/donations/${selectedDonation.id}/mark_received/`)

      setDonations(donations.map((d) => (d.id === selectedDonation.id ? response.data : d)))
      setSuccess(`Successfully marked "${selectedDonation.food_name}" as received`)

      setReceiveDialogOpen(false)
    } catch (err) {
      setError("Failed to mark donation as received. Please try again.")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  // Filter donations based on tab
  const getFilteredDonations = () => {
    switch (tabValue) {
      case 0: // All
        return donations
      case 1: // Pending Pickup
        return donations.filter((d) => d.status === "claimed")
      case 2: // Received
        return donations.filter((d) => d.status === "received")
      default:
        return donations
    }
  }

  const filteredDonations = getFilteredDonations()

  // Calculate stats
  const totalClaimed = donations.length
  const pendingPickup = donations.filter((d) => d.status === "claimed").length
  const received = donations.filter((d) => d.status === "received").length

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
            Loading your claimed donations...
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
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Claimed Donations
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400}>
              Manage your claimed donations and track pickup status
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

          {donations.length === 0 ? (
            <Grow in timeout={800}>
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
                  <InventoryIcon sx={{ fontSize: 40, color: "#bdbdbd" }} />
                </Avatar>
                <Typography variant="h5" fontWeight={600} sx={{ mb: 2 }}>
                  You haven't claimed any donations yet
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Browse available donations to find food items you can claim.
                </Typography>
                <Button
                  variant="contained"
                  href="/charity/available-donations"
                  sx={{
                    bgcolor: "#1976d2",
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Find Available Donations
                </Button>
              </Paper>
            </Grow>
          ) : (
            <>
              {/* Statistics Cards */}
              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
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
                      <Avatar sx={{ bgcolor: "#1976d2", mx: "auto", mb: 2, width: 56, height: 56 }}>
                        <AllIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Typography variant="h4" fontWeight={700} color="#1976d2">
                        {totalClaimed}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" fontWeight={600}>
                        Total Claimed
                      </Typography>
                    </Paper>
                  </Grow>
                </Grid>
                <Grid item xs={12} sm={4}>
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
                      <Avatar sx={{ bgcolor: "#ed6c02", mx: "auto", mb: 2, width: 56, height: 56 }}>
                        <ScheduleIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Typography variant="h4" fontWeight={700} color="#ed6c02">
                        {pendingPickup}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" fontWeight={600}>
                        Pending Pickup
                      </Typography>
                    </Paper>
                  </Grow>
                </Grid>
                <Grid item xs={12} sm={4}>
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
                      <Avatar sx={{ bgcolor: "#2e7d32", mx: "auto", mb: 2, width: 56, height: 56 }}>
                        <CompletedIcon sx={{ fontSize: 28 }} />
                      </Avatar>
                      <Typography variant="h4" fontWeight={700} color="#2e7d32">
                        {received}
                      </Typography>
                      <Typography variant="body1" color="text.secondary" fontWeight={600}>
                        Received
                      </Typography>
                    </Paper>
                  </Grow>
                </Grid>
              </Grid>

              <Grow in timeout={1400}>
                <Paper
                  elevation={0}
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    border: "1px solid #e0e0e0",
                    borderRadius: 3,
                  }}
                >
                  <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3, pt: 2 }}>
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
                      aria-label="donation tabs"
                      sx={{
                        "& .MuiTab-root": {
                          textTransform: "none",
                          fontWeight: 600,
                          fontSize: "1rem",
                        },
                      }}
                    >
                      <Tab label={`All (${totalClaimed})`} icon={<AllIcon />} iconPosition="start" />
                      <Tab label={`Pending Pickup (${pendingPickup})`} icon={<ScheduleIcon />} iconPosition="start" />
                      <Tab label={`Received (${received})`} icon={<CompletedIcon />} iconPosition="start" />
                    </Tabs>
                  </Box>

                  <TabPanel value={tabValue} index={tabValue}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                      <Table stickyHeader aria-label="donations table">
                        <TableHead>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Food Name</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Donor</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Quantity</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Expiry Date</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Claimed Date</TableCell>
                            <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredDonations.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                <Stack alignItems="center" spacing={2}>
                                  <Avatar sx={{ bgcolor: "#f5f5f5", width: 64, height: 64 }}>
                                    <InventoryIcon sx={{ fontSize: 32, color: "#bdbdbd" }} />
                                  </Avatar>
                                  <Typography variant="h6" color="text.secondary">
                                    No donations found in this category
                                  </Typography>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredDonations
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((donation) => (
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
                                    <Typography variant="body2">{donation.quantity}</Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {new Date(donation.expiry_date).toLocaleDateString()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={donation.status === "claimed" ? "Pending Pickup" : "Received"}
                                      sx={{
                                        bgcolor: donation.status === "claimed" ? "#e3f2fd" : "#e8f5e8",
                                        color: donation.status === "claimed" ? "#1976d2" : "#2e7d32",
                                        fontWeight: 600,
                                      }}
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {donation.claimed_at ? new Date(donation.claimed_at).toLocaleDateString() : "N/A"}
                                    </Typography>
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
                                      {donation.status === "claimed" && (
                                        <IconButton
                                          size="small"
                                          onClick={() => handleReceiveClick(donation)}
                                          sx={{
                                            bgcolor: "#e8f5e8",
                                            color: "#2e7d32",
                                            "&:hover": { bgcolor: "#c8e6c9" },
                                          }}
                                        >
                                          <ReceiveIcon fontSize="small" />
                                        </IconButton>
                                      )}
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
                  </TabPanel>
                </Paper>
              </Grow>
            </>
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
                              label={selectedDonation.status === "claimed" ? "Pending Pickup" : "Received"}
                              size="small"
                              sx={{
                                bgcolor: selectedDonation.status === "claimed" ? "#e3f2fd" : "#e8f5e8",
                                color: selectedDonation.status === "claimed" ? "#1976d2" : "#2e7d32",
                                fontWeight: 600,
                              }}
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
                          Donor Information
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1">
                              <strong>Name:</strong> {selectedDonation.donor_details?.first_name}{" "}
                              {selectedDonation.donor_details?.last_name}
                            </Typography>
                            <Typography variant="body1">
                              <strong>Contact:</strong> {selectedDonation.donor_details?.email}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1">
                              <strong>Phone:</strong> {selectedDonation.donor_details?.phone_number || "Not provided"}
                            </Typography>
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
                            <strong>Claimed On:</strong>{" "}
                            {selectedDonation.claimed_at
                              ? new Date(selectedDonation.claimed_at).toLocaleString()
                              : "N/A"}
                          </Typography>
                          {selectedDonation.received_at && (
                            <Typography variant="body1">
                              <strong>Received On:</strong> {new Date(selectedDonation.received_at).toLocaleString()}
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
              {selectedDonation && selectedDonation.status === "claimed" && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setViewDialogOpen(false)
                    handleReceiveClick(selectedDonation)
                  }}
                  startIcon={<ReceiveIcon />}
                  sx={{
                    bgcolor: "#2e7d32",
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Mark as Received
                </Button>
              )}
            </DialogActions>
          </Dialog>

          {/* Receive Donation Dialog */}
          <Dialog
            open={receiveDialogOpen}
            onClose={() => setReceiveDialogOpen(false)}
            PaperProps={{
              sx: { borderRadius: 3 },
            }}
          >
            <DialogTitle>
              <Typography variant="h5" fontWeight={700}>
                Mark Donation as Received
              </Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                Are you confirming that you have received "{selectedDonation?.food_name}" from{" "}
                {selectedDonation?.donor_details?.first_name} {selectedDonation?.donor_details?.last_name}?
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setReceiveDialogOpen(false)} sx={{ borderRadius: 2 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleReceiveSubmit}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={20} /> : <ReceiveIcon />}
                sx={{
                  bgcolor: "#2e7d32",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                {submitting ? "Confirming..." : "Confirm Receipt"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Container>
  )
}

export default ClaimedDonations
