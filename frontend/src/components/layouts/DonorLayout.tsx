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
  Badge,
  Chip,
  Fade,
  Tooltip,
} from "@mui/material"
import { styled, alpha } from "@mui/material/styles"
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AddCircleOutline as AddIcon,
  ListAlt as ListIcon,
  DeleteOutline as WasteIcon,
  Logout,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Brightness4 as DarkModeIcon,
  Close as CloseIcon,
  Co2Outlined as EcoIcon,
} from "@mui/icons-material"

const drawerWidth = 280

// Enhanced styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
  backdropFilter: "blur(20px)",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  [theme.breakpoints.up("sm")]: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
  },
}))

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  "& .MuiDrawer-paper": {
    background: "linear-gradient(180deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)",
    backdropFilter: "blur(20px)",
    borderRight: "1px solid rgba(0, 0, 0, 0.08)",
    boxShadow: "4px 0 24px rgba(0, 0, 0, 0.08)",
    width: drawerWidth,
    boxSizing: "border-box",
  },
}))

const StyledListItemButton = styled(ListItemButton)<{ active?: boolean }>(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(2),
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: active ? "linear-gradient(135deg, #4caf50 0%, #45a049 100%)" : "transparent",
    opacity: active ? 0.1 : 0,
    transition: "opacity 0.3s ease",
  },
  "&:hover": {
    backgroundColor: alpha("#4caf50", 0.08),
    transform: "translateX(8px)",
    "&::before": {
      opacity: 0.05,
    },
  },
  ...(active && {
    backgroundColor: alpha("#4caf50", 0.12),
    color: "#2e7d32",
    fontWeight: 600,
    "& .MuiListItemIcon-root": {
      color: "#4caf50",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      right: 0,
      top: "50%",
      transform: "translateY(-50%)",
      width: "4px",
      height: "60%",
      background: "linear-gradient(180deg, #4caf50 0%, #45a049 100%)",
      borderRadius: "2px 0 0 2px",
    },
  }),
}))

const StyledListItemIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 48,
  color: "#666",
  transition: "all 0.3s ease",
  "& .MuiSvgIcon-root": {
    fontSize: "1.4rem",
  },
}))

const UserAvatar = styled(Avatar)(({ theme }) => ({
  background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
  boxShadow: "0 4px 14px rgba(76, 175, 80, 0.3)",
  border: "2px solid rgba(255, 255, 255, 0.2)",
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.1)",
    boxShadow: "0 6px 20px rgba(76, 175, 80, 0.4)",
  },
}))

const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(0, 0, 0, 0.08)",
    borderRadius: theme.spacing(2),
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    minWidth: 200,
    marginTop: theme.spacing(1),
  },
  "& .MuiMenuItem-root": {
    borderRadius: theme.spacing(1),
    margin: theme.spacing(0.5),
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: alpha("#4caf50", 0.08),
      transform: "translateX(4px)",
    },
  },
}))

const BrandSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  background: "linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(139, 195, 74, 0.05) 100%)",
  borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}))

const StatusChip = styled(Chip)(({ theme }) => ({
  background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c8 100%)",
  color: "#2e7d32",
  border: "1px solid #4caf50",
  fontWeight: 600,
  fontSize: "0.75rem",
  height: 24,
  "& .MuiChip-label": {
    padding: "0 8px",
  },
}))

const DonorLayout: React.FC = () => {
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
    handleMenuClose()
  }

  const menuItems = [
    {
      text: "Dashboard",
      icon: DashboardIcon,
      path: "/donor/dashboard",
      badge: null,
    },
    {
      text: "Add Donation",
      icon: AddIcon,
      path: "/donor/add-donation",
      badge: null,
    },
    {
      text: "My Donations",
      icon: ListIcon,
      path: "/donor/my-donations",
      badge: "3", // Example badge
    },
    {
      text: "Track Waste",
      icon: WasteIcon,
      path: "/donor/track-waste",
      badge: null,
    },
  ]

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Brand Section */}
      <BrandSection>
        <Avatar
          sx={{
            background: "linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)",
            width: 48,
            height: 48,
            boxShadow: "0 4px 14px rgba(76, 175, 80, 0.3)",
          }}
        >
          <EcoIcon sx={{ fontSize: 28 }} />
        </Avatar>
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #2e7d32 0%, #388e3c 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            Food Donation
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "#666",
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            Waste Tracker
          </Typography>
        </Box>
      </BrandSection>

      {/* User Info Section */}
      <Box sx={{ p: 2, borderBottom: "1px solid rgba(0, 0, 0, 0.06)" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <UserAvatar sx={{ width: 40, height: 40 }}>{user?.first_name?.charAt(0) || "D"}</UserAvatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#333", lineHeight: 1.2 }}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="caption" sx={{ color: "#666" }}>
              Donor Account
            </Typography>
          </Box>
        </Box>
        <StatusChip label="Active Donor" size="small" />
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, py: 1 }}>
        <Typography
          variant="overline"
          sx={{
            px: 2,
            py: 1,
            color: "#999",
            fontWeight: 600,
            fontSize: "0.7rem",
            letterSpacing: "0.5px",
          }}
        >
          MAIN MENU
        </Typography>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItem key={item.text} disablePadding>
                <Link
                  to={item.path}
                  style={{ textDecoration: "none", color: "inherit", width: "100%" }}
                  onClick={() => setMobileOpen(false)}
                >
                  <StyledListItemButton active={isActive}>
                    <StyledListItemIcon>
                      {item.badge ? (
                        <Badge
                          badgeContent={item.badge}
                          color="error"
                          sx={{
                            "& .MuiBadge-badge": {
                              background: "linear-gradient(135deg, #ff5722 0%, #f44336 100%)",
                              color: "white",
                              fontSize: "0.7rem",
                              fontWeight: 600,
                              minWidth: 18,
                              height: 18,
                            },
                          }}
                        >
                          <item.icon />
                        </Badge>
                      ) : (
                        <item.icon />
                      )}
                    </StyledListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: "0.95rem",
                      }}
                    />
                  </StyledListItemButton>
                </Link>
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* Footer Section */}
      <Box sx={{ p: 2, borderTop: "1px solid rgba(0, 0, 0, 0.06)" }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Tooltip title="Settings">
            <IconButton
              size="small"
              sx={{
                color: "#666",
                "&:hover": { color: "#4caf50", backgroundColor: alpha("#4caf50", 0.08) },
              }}
            >
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Help & Support">
            <IconButton
              size="small"
              sx={{
                color: "#666",
                "&:hover": { color: "#4caf50", backgroundColor: alpha("#4caf50", 0.08) },
              }}
            >
              <HelpIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Dark Mode">
            <IconButton
              size="small"
              sx={{
                color: "#666",
                "&:hover": { color: "#4caf50", backgroundColor: alpha("#4caf50", 0.08) },
              }}
            >
              <DarkModeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography variant="caption" sx={{ color: "#999", mt: 1, display: "block" }}>
          Version 2.0.1
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Enhanced App Bar */}
      <StyledAppBar position="fixed">
        <Toolbar sx={{ minHeight: 70 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: "none" },
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                transform: "scale(1.1)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              background: "linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            Food Donation & Waste Tracker
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton
                color="inherit"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <Badge
                  badgeContent={2}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      background: "linear-gradient(135deg, #ff5722 0%, #f44336 100%)",
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Info */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    color: "rgba(255, 255, 255, 0.95)",
                    lineHeight: 1.2,
                  }}
                >
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(255, 255, 255, 0.7)",
                    lineHeight: 1,
                  }}
                >
                  Donor Account
                </Typography>
              </Box>
            </Box>

            {/* User Avatar Menu */}
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <UserAvatar sx={{ width: 40, height: 40 }}>{user?.first_name?.charAt(0) || "D"}</UserAvatar>
              </IconButton>
            </Tooltip>

            <StyledMenu
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
            >
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  navigate("/donor/profile")
                }}
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" sx={{ color: "#4caf50" }} />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Profile Settings
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose()
                  navigate("/donor/settings")
                }}
              >
                <ListItemIcon>
                  <SettingsIcon fontSize="small" sx={{ color: "#666" }} />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  Preferences
                </Typography>
              </MenuItem>
              <Divider sx={{ my: 1 }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: "#f44336" }} />
                </ListItemIcon>
                <Typography variant="body2" sx={{ fontWeight: 500, color: "#f44336" }}>
                  Logout
                </Typography>
              </MenuItem>
            </StyledMenu>
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* Enhanced Navigation Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="navigation menu">
        {/* Mobile Drawer */}
        <StyledDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
            <IconButton onClick={handleDrawerToggle} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
          {drawer}
        </StyledDrawer>

        {/* Desktop Drawer */}
        <StyledDrawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
          }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        <Toolbar sx={{ minHeight: 70 }} />
        <Fade in timeout={300}>
          <Box>
            <Outlet />
          </Box>
        </Fade>
      </Box>
    </Box>
  )
}

export default DonorLayout
