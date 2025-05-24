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
  Avatar,
  Card,
  Fade,
  Grow,
  Container,
  Grid,
} from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  ListAlt as ListIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material"
import { Link } from "react-router-dom"
import type { Donation } from "../../types"

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
    background: "linear-gradient(90deg, #4caf50, #2196f3, #9c27b0, #ff9800)",
  },
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  "& .MuiTabs-indicator": {
    background: "linear-gradient(90deg, #4caf50, #2196f3)",
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
      backgroundColor: "rgba(76, 175, 80, 0.08)",
      transform: "translateY(-2px)",
    },
    "&.Mui-selected": {
      color: "#4caf50",
      fontWeight: 700,
    },
  },
}))

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: theme.spacing(2),
  border: "1px solid rgba(0, 0, 0, 0.08)",
  "& .MuiTableHead-root": {
    background: "linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(33, 150, 243, 0.05) 100%)",
    "& .MuiTableCell-head": {
      fontWeight: 700,
      color: "#333",
      fontSize: "0.95rem",
      borderBottom: "2px solid rgba(76, 175, 80, 0.2)",
    },
  },
  "& .MuiTableRow-root": {
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(76, 175, 80, 0.04)",
      transform: "scale(1.01)",
    },
  },
  "& .MuiTableCell-root": {
    borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
    padding: theme.spacing(2),
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

const MyDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null)
  const [tabValue, setTabValue] = useState(0)

  // Fetch donations
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("/donations/my_donations/")
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

  const handleDeleteClick = (donation: Donation) => {
    setSelectedDonation(donation)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSubmit = async () => {
    if (!selectedDonation) return

    try {
      await axios.delete(`/donations/${selectedDonation.id}/`)
      // Remove the deleted donation from the list
      setDonations(donations.filter((donation) => donation.id !== selectedDonation.id))
      setDeleteDialogOpen(false)
    } catch (err) {
      setError("Failed to delete donation")
      console.error(err)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "success"
      case "claimed":
        return "primary"
      case "received":
        return "info"
      case "expired":
        return "error"
      default:
        return "default"
    }
  }

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

  // Filter donations based on tab
  const getFilteredDonations = () => {
    switch (tabValue) {
      case 0: // All
        return donations
      case 1: // Available
        return donations.filter((d) => d.status === "available")
      case 2: // Claimed
        return donations.filter((d) => d.status === "claimed")
      case 3: // Received
        return donations.filter((d) => d.status === "received")
      case 4: // Expired
        return donations.filter((d) => d.status === "expired")
      default:
        return donations
    }
  }

  const filteredDonations = getFilteredDonations()

  // Calculate statistics
  const stats = {
    total: donations.length,
    available: donations.filter((d) => d.status === "available").length,
    claimed: donations.filter((d) => d.status === "claimed").length,
    received: donations.filter((d) => d.status === "received").length,
    expired: donations.filter((d) => d.status === "expired").length,
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
              <ListIcon sx={{ fontSize: 32, color: "rgba(255, 255, 255, 0.9)" }} />
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
            Loading your donations...
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
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
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
                    mb: 1,
                  }}
                >
                  My Donations
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontWeight: 500,
                    textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                  }}
                >
                  Track and manage your food donation history
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

            {/* Statistics Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: "Total", value: stats.total, icon: TrendingUpIcon, color: "#4caf50" },
                { label: "Available", value: stats.available, icon: InventoryIcon, color: "#4caf50" },
                { label: "Claimed", value: stats.claimed, icon: ScheduleIcon, color: "#2196f3" },
                { label: "Received", value: stats.received, icon: CheckCircleIcon, color: "#9c27b0" },
                { label: "Expired", value: stats.expired, icon: CancelIcon, color: "#f44336" },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={2.4} key={stat.label}>
                  <Grow in timeout={1000 + index * 200}>
                    <GlassCard sx={{ p: 3, textAlign: "center" }}>
                      <Avatar
                        sx={{
                          bgcolor: `${stat.color}20`,
                          color: stat.color,
                          width: 48,
                          height: 48,
                          mx: "auto",
                          mb: 2,
                        }}
                      >
                        <stat.icon />
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 800, color: stat.color, mb: 1 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#666", fontWeight: 600 }}>
                        {stat.label}
                      </Typography>
                    </GlassCard>
                  </Grow>
                </Grid>
              ))}
            </Grid>

            {donations.length === 0 ? (
              <Grow in timeout={1200}>
                <EmptyStateCard>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(76, 175, 80, 0.1)",
                      width: 80,
                      height: 80,
                      mx: "auto",
                      mb: 3,
                    }}
                  >
                    <ListIcon sx={{ fontSize: 40, color: "#4caf50" }} />
                  </Avatar>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 2 }}>
                    No donations yet
                  </Typography>
                  <Typography variant="h6" sx={{ color: "#666", mb: 4, maxWidth: 400, mx: "auto" }}>
                    Start contributing to your community by adding your first donation and help reduce food waste.
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
                      py: 2,
                      fontWeight: 700,
                      textTransform: "none",
                      fontSize: "1.1rem",
                    }}
                  >
                    Add Your First Donation
                  </Button>
                </EmptyStateCard>
              </Grow>
            ) : (
              <Grow in timeout={1400}>
                <GlassCard sx={{ overflow: "hidden" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider", px: 3, pt: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Avatar sx={{ bgcolor: "#4caf50", width: 40, height: 40 }}>
                        <FilterIcon />
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: "#333" }}>
                        Filter Donations
                      </Typography>
                    </Box>
                    <StyledTabs value={tabValue} onChange={handleTabChange} aria-label="donation tabs">
                      <Tab label={`All (${stats.total})`} />
                      <Tab label={`Available (${stats.available})`} />
                      <Tab label={`Claimed (${stats.claimed})`} />
                      <Tab label={`Received (${stats.received})`} />
                      <Tab label={`Expired (${stats.expired})`} />
                    </StyledTabs>
                  </Box>

                  <TabPanel value={tabValue} index={tabValue}>
                    <StyledTableContainer sx={{ maxHeight: 500 }}>
                      <Table stickyHeader aria-label="donations table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Food Name</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Expiry Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Claimed By</TableCell>
                            <TableCell align="center">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredDonations.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                                <Avatar
                                  sx={{
                                    bgcolor: "rgba(158, 158, 158, 0.1)",
                                    width: 64,
                                    height: 64,
                                    mx: "auto",
                                    mb: 2,
                                  }}
                                >
                                  <ListIcon sx={{ fontSize: 32, color: "#ccc" }} />
                                </Avatar>
                                <Typography variant="h6" sx={{ color: "#666", fontWeight: 600 }}>
                                  No donations found in this category
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredDonations
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((donation) => (
                                <TableRow hover key={donation.id}>
                                  <TableCell>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                      {donation.food_name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {donation.quantity}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {new Date(donation.expiry_date).toLocaleDateString()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <StatusChip
                                      status={donation.status}
                                      label={donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                      size="medium"
                                      icon={getStatusIcon(donation.status)}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {donation.charity_details?.organization_name || "Not claimed"}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                                      <IconButton
                                        size="small"
                                        onClick={() => handleViewClick(donation)}
                                        sx={{
                                          color: "#2196f3",
                                          "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.1)" },
                                        }}
                                      >
                                        <ViewIcon fontSize="small" />
                                      </IconButton>
                                      {donation.status === "available" && (
                                        <IconButton
                                          size="small"
                                          onClick={() => handleDeleteClick(donation)}
                                          sx={{
                                            color: "#f44336",
                                            "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.1)" },
                                          }}
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      )}
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              ))
                          )}
                        </TableBody>
                      </Table>
                    </StyledTableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      component="div"
                      count={filteredDonations.length}
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
                  </TabPanel>
                </GlassCard>
              </Grow>
            )}
          </Box>
        </Fade>

        {/* View Donation Dialog */}
        <StyledDialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#2196f3" }}>
                <ViewIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Donation Details
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedDonation && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "#333", mb: 2 }}>
                      {selectedDonation.food_name}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(76, 175, 80, 0.05)" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#4caf50", mb: 1 }}>
                        Food Information
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Description:</strong> {selectedDonation.description}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Quantity:</strong> {selectedDonation.quantity}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Category:</strong> {selectedDonation.category_name}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Expiry Date:</strong> {new Date(selectedDonation.expiry_date).toLocaleDateString()}
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <StatusChip
                          status={selectedDonation.status}
                          label={selectedDonation.status.charAt(0).toUpperCase() + selectedDonation.status.slice(1)}
                          size="medium"
                          icon={getStatusIcon(selectedDonation.status)}
                        />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(33, 150, 243, 0.05)" }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#2196f3", mb: 1 }}>
                        Pickup Information
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Address:</strong> {selectedDonation.pickup_address}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>City:</strong> {selectedDonation.pickup_city}, {selectedDonation.pickup_state}{" "}
                        {selectedDonation.pickup_zip}
                      </Typography>
                      {selectedDonation.pickup_instructions && (
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          <strong>Instructions:</strong> {selectedDonation.pickup_instructions}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {selectedDonation.charity_details && (
                    <Grid item xs={12}>
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: "rgba(156, 39, 176, 0.05)" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#9c27b0", mb: 2 }}>
                          Claimed By
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Organization:</strong> {selectedDonation.charity_details.organization_name}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Contact:</strong> {selectedDonation.charity_details.email}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Phone:</strong> {selectedDonation.charity_details.phone_number || "Not provided"}
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                              <strong>Claimed On:</strong>{" "}
                              {selectedDonation.claimed_at
                                ? new Date(selectedDonation.claimed_at).toLocaleString()
                                : "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
                        {selectedDonation.received_at && (
                          <Typography variant="body1" sx={{ mt: 1 }}>
                            <strong>Received On:</strong> {new Date(selectedDonation.received_at).toLocaleString()}
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

        {/* Delete Donation Dialog */}
        <StyledDialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar sx={{ bgcolor: "#f44336" }}>
                <DeleteIcon />
              </Avatar>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Delete Donation
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ fontSize: "1.1rem", color: "#333" }}>
              Are you sure you want to delete the donation <strong>"{selectedDonation?.food_name}"</strong>? This action
              cannot be undone.
            </DialogContentText>
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
      </Container>
    </GradientBox>
  )
}

export default MyDonations
