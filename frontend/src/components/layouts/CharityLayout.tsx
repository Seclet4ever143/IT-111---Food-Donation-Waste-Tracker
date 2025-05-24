"use client"

import type React from "react"
import { useState } from "react"
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Chip,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Inventory as InventoryIcon,
  Logout,
  Person as PersonIcon,
  Favorite as HeartIcon,
} from "@mui/icons-material"

const drawerWidth = 280

const CharityLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const menuItems = [
    {
      text: "Dashboard",
      icon: DashboardIcon,
      path: "/charity/dashboard",
      color: "#1976d2",
    },
    {
      text: "Available Donations",
      icon: SearchIcon,
      path: "/charity/available-donations",
      color: "#2e7d32",
    },
    {
      text: "Claimed Donations",
      icon: InventoryIcon,
      path: "/charity/claimed-donations",
      color: "#ed6c02",
    },
  ]

  const isActivePath = (path: string) => location.pathname === path

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar
            sx={{
              bgcolor: "#1976d2",
              width: 48,
              height: 48,
              boxShadow: "0 4px 20px rgba(25, 118, 210, 0.3)",
            }}
          >
            <HeartIcon sx={{ fontSize: 24 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} color="#1976d2">
              Charity Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Food Donation System
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {/* User Info Card */}
      <Box sx={{ p: 2 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: "linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%)",
            border: "1px solid #e1f5fe",
            borderRadius: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: "#1976d2",
                width: 40,
                height: 40,
              }}
            >
              {user?.organization_name?.charAt(0) || user?.first_name?.charAt(0) || "C"}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>
                {user?.organization_name || `${user?.first_name} ${user?.last_name}`}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip
                  label={user?.is_verified ? "Verified" : "Pending"}
                  size="small"
                  sx={{
                    bgcolor: user?.is_verified ? "#e8f5e8" : "#fff3e0",
                    color: user?.is_verified ? "#2e7d32" : "#ed6c02",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 20,
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Box>

      <List sx={{ flexGrow: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: 2,
                py: 1.5,
                px: 2,
                transition: "all 0.3s ease",
                bgcolor: isActivePath(item.path) ? `${item.color}15` : "transparent",
                border: isActivePath(item.path) ? `2px solid ${item.color}30` : "2px solid transparent",
                "&:hover": {
                  bgcolor: `${item.color}10`,
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActivePath(item.path) ? item.color : "text.secondary",
                  minWidth: 40,
                }}
              >
                <item.icon />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActivePath(item.path) ? 700 : 500,
                  color: isActivePath(item.path) ? item.color : "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center" }}>
          © 2024 Food Donation System
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#ffffff",
          color: "#1976d2",
          boxShadow: "0 2px 20px rgba(0,0,0,0.1)",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Food Donation & Waste Tracker
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="body1" sx={{ mr: 2, fontWeight: 600, color: "#1976d2" }}>
              {user?.organization_name || `${user?.first_name} ${user?.last_name}`}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              sx={{
                color: "#1976d2",
                "&:hover": {
                  bgcolor: "#e3f2fd",
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "#1976d2",
                  boxShadow: "0 4px 15px rgba(25, 118, 210, 0.3)",
                }}
              >
                {user?.organization_name?.charAt(0) || user?.first_name?.charAt(0) || "C"}
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: 2,
                  mt: 1,
                  boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
                  border: "1px solid #e0e0e0",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  navigate("/charity/profile")
                }}
                sx={{
                  py: 1.5,
                  px: 2,
                  "&:hover": {
                    bgcolor: "#f8f9fa",
                  },
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" sx={{ color: "#1976d2" }} />
                </ListItemIcon>
                <Typography variant="body1" fontWeight={500}>
                  Profile
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  py: 1.5,
                  px: 2,
                  "&:hover": {
                    bgcolor: "#ffebee",
                  },
                }}
              >
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: "#d32f2f" }} />
                </ListItemIcon>
                <Typography variant="body1" fontWeight={500} color="#d32f2f">
                  Logout
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="navigation">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              border: "none",
              borderRight: "1px solid #e0e0e0",
              boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#f8f9fa",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  )
}

export default CharityLayout
