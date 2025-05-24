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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  IconButton,
  Chip,
  Container,
  Stack,
  Avatar,
  Fade,
  Grow,
  Grid,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as VerifyIcon,
  Block as BlockIcon,
  People as PeopleIcon,
  AdminPanelSettings as AdminIcon,
  VolunteerActivism as VolunteerIcon,
  Business as BusinessIcon,
} from "@mui/icons-material"
import type { User } from "../../types"
import type { SelectChangeEvent } from "@mui/material/Select"

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    is_verified: false,
    is_active: true,
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/users/")
        setUsers(response.data)
      } catch (err) {
        setError("Failed to load users")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleEditClick = (user: User) => {
    setSelectedUser(user)
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
      is_active: true,
    })
    setEditDialogOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<{ name?: string; value: unknown }> | SelectChangeEvent,
  ) => {
    const name = e.target.name as string
    const value = e.target.value
    setEditFormData({
      ...editFormData,
      [name]: value,
    })
  }

  const handleEditSubmit = async () => {
    if (!selectedUser) return

    try {
      const response = await axios.put(`/users/${selectedUser.id}/`, editFormData)
      setUsers(users.map((user) => (user.id === selectedUser.id ? response.data : user)))
      setEditDialogOpen(false)
    } catch (err) {
      setError("Failed to update user")
      console.error(err)
    }
  }

  const handleDeleteSubmit = async () => {
    if (!selectedUser) return

    try {
      await axios.delete(`/users/${selectedUser.id}/`)
      setUsers(users.filter((user) => user.id !== selectedUser.id))
      setDeleteDialogOpen(false)
    } catch (err) {
      setError("Failed to delete user")
      console.error(err)
    }
  }

  const handleVerifyUser = async (user: User) => {
    try {
      const response = await axios.put(`/users/${user.id}/`, {
        ...user,
        is_verified: !user.is_verified,
      })
      setUsers(users.map((u) => (u.id === user.id ? response.data : u)))
    } catch (err) {
      setError("Failed to update verification status")
      console.error(err)
    }
  }

  const getRoleChipSx = (role: string) => {
    switch (role) {
      case "admin":
        return {
          bgcolor: "#ffebee",
          color: "#d32f2f",
          fontWeight: 600,
        }
      case "donor":
        return {
          bgcolor: "#e8f5e8",
          color: "#2e7d32",
          fontWeight: 600,
        }
      case "charity":
        return {
          bgcolor: "#e3f2fd",
          color: "#1976d2",
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

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return AdminIcon
      case "donor":
        return VolunteerIcon
      case "charity":
        return BusinessIcon
      default:
        return PeopleIcon
    }
  }

  // Calculate statistics
  const totalUsers = users.length
  const totalAdmins = users.filter((u) => u.role === "admin").length
  const totalDonors = users.filter((u) => u.role === "donor").length
  const totalCharities = users.filter((u) => u.role === "charity").length
  const verifiedUsers = users.filter((u) => u.is_verified).length

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
            Loading users...
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
                background: "linear-gradient(45deg, #2e7d32, #4caf50)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Manage Users
            </Typography>
            <Typography variant="h6" color="text.secondary" fontWeight={400}>
              Oversee and manage all system users
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
            <Grid item xs={12} sm={6} md={2.4}>
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
                  <Avatar sx={{ bgcolor: "#2e7d32", mx: "auto", mb: 2, width: 48, height: 48 }}>
                    <PeopleIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight={700} color="#2e7d32">
                    {totalUsers}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Total Users
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
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
                  <Avatar sx={{ bgcolor: "#d32f2f", mx: "auto", mb: 2, width: 48, height: 48 }}>
                    <AdminIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight={700} color="#d32f2f">
                    {totalAdmins}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Admins
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
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
                  <Avatar sx={{ bgcolor: "#ed6c02", mx: "auto", mb: 2, width: 48, height: 48 }}>
                    <VolunteerIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight={700} color="#ed6c02">
                    {totalDonors}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Donors
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
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
                  <Avatar sx={{ bgcolor: "#1976d2", mx: "auto", mb: 2, width: 48, height: 48 }}>
                    <BusinessIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight={700} color="#1976d2">
                    {totalCharities}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Charities
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <Grow in timeout={1600}>
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
                  <Avatar sx={{ bgcolor: "#7b1fa2", mx: "auto", mb: 2, width: 48, height: 48 }}>
                    <VerifyIcon />
                  </Avatar>
                  <Typography variant="h4" fontWeight={700} color="#7b1fa2">
                    {verifiedUsers}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" fontWeight={600}>
                    Verified
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
          </Grid>

          {/* Users Table */}
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
                <Table stickyHeader aria-label="users table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Role</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: "#f8f9fa" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                          <Stack alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: "#f5f5f5", width: 64, height: 64 }}>
                              <PeopleIcon sx={{ fontSize: 32, color: "#bdbdbd" }} />
                            </Avatar>
                            <Typography variant="h6" color="text.secondary">
                              No users found
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => {
                        const RoleIcon = getRoleIcon(user.role)
                        return (
                          <TableRow
                            hover
                            key={user.id}
                            sx={{
                              "&:hover": {
                                bgcolor: "#f8f9fa",
                              },
                            }}
                          >
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar sx={{ bgcolor: getRoleChipSx(user.role).bgcolor, width: 40, height: 40 }}>
                                  <RoleIcon sx={{ fontSize: 20, color: getRoleChipSx(user.role).color }} />
                                </Avatar>
                                <Typography variant="body1" fontWeight={600}>
                                  {user.first_name} {user.last_name}
                                </Typography>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{user.email}</Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                sx={getRoleChipSx(user.role)}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {user.role === "donor" || user.role === "charity" ? (
                                <Chip
                                  label={user.is_verified ? "Verified" : "Unverified"}
                                  sx={{
                                    bgcolor: user.is_verified ? "#e8f5e8" : "#fff3e0",
                                    color: user.is_verified ? "#2e7d32" : "#ed6c02",
                                    fontWeight: 600,
                                  }}
                                  size="small"
                                />
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  -
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditClick(user)}
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
                                  onClick={() => handleDeleteClick(user)}
                                  sx={{
                                    bgcolor: "#ffebee",
                                    color: "#d32f2f",
                                    "&:hover": { bgcolor: "#ffcdd2" },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                                {(user.role === "donor" || user.role === "charity") && (
                                  <IconButton
                                    size="small"
                                    onClick={() => handleVerifyUser(user)}
                                    sx={{
                                      bgcolor: user.is_verified ? "#fff3e0" : "#e8f5e8",
                                      color: user.is_verified ? "#ed6c02" : "#2e7d32",
                                      "&:hover": {
                                        bgcolor: user.is_verified ? "#ffe0b2" : "#c8e6c9",
                                      },
                                    }}
                                  >
                                    {user.is_verified ? (
                                      <BlockIcon fontSize="small" />
                                    ) : (
                                      <VerifyIcon fontSize="small" />
                                    )}
                                  </IconButton>
                                )}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
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

          {/* Edit User Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            PaperProps={{
              sx: { borderRadius: 3 },
            }}
          >
            <DialogTitle>
              <Typography variant="h5" fontWeight={700}>
                Edit User
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box component="form" sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="first_name"
                  label="First Name"
                  value={editFormData.first_name}
                  onChange={handleEditFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="last_name"
                  label="Last Name"
                  value={editFormData.last_name}
                  onChange={handleEditFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="email"
                  label="Email Address"
                  value={editFormData.email}
                  onChange={handleEditFormChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={editFormData.role}
                    label="Role"
                    onChange={handleEditFormChange}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="donor">Donor</MenuItem>
                    <MenuItem value="charity">Charity</MenuItem>
                  </Select>
                </FormControl>
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
                  bgcolor: "#2e7d32",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Save Changes
              </Button>
            </DialogActions>
          </Dialog>

          {/* Delete User Dialog */}
          <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            PaperProps={{
              sx: { borderRadius: 3 },
            }}
          >
            <DialogTitle>
              <Typography variant="h5" fontWeight={700}>
                Delete User
              </Typography>
            </DialogTitle>
            <DialogContent>
              <DialogContentText sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}>
                Are you sure you want to delete {selectedUser?.first_name} {selectedUser?.last_name}? This action cannot
                be undone.
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
                Delete User
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Fade>
    </Container>
  )
}

export default ManageUsers
