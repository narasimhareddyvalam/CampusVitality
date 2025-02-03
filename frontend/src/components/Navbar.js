import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { logout, selectUser } from "../redux/slices/authSlice";
import logo from "../logo.png";

const Navbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const renderProfileLinks = () => {
    if (!user) return null;

    return (
      <>
        {user.role === "admin" && (
          <>
            <MenuItem onClick={() => navigate("/admin")}>
              Admin Dashboard
            </MenuItem>
            <MenuItem onClick={() => navigate("/admin/create-sales")}>
              Create Sales User
            </MenuItem>
            <MenuItem onClick={() => navigate("/admin/my-team")}>
              My Team
            </MenuItem>
            <MenuItem onClick={() => navigate("/bookings")}>Bookings</MenuItem>
            <MenuItem onClick={() => navigate("/admin/plans")}>Plans</MenuItem>
          </>
        )}
        {user.role === "sales" && (
          <>
            <MenuItem onClick={() => navigate("/bookings")}>Bookings</MenuItem>
            <MenuItem onClick={() => navigate("/sales")}>
              Sales Dashboard
            </MenuItem>
          </>
        )}
        {user.role === "student" && (
          <>
            <MenuItem onClick={() => navigate("/browse-plans")}>
              Browse Plans
            </MenuItem>
            <MenuItem onClick={() => navigate("/my-plans")}>My Plans</MenuItem>
            <MenuItem onClick={() => navigate("/my-profile")}>
              My Profile
            </MenuItem>
          </>
        )}
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </>
    );
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1100,
        width: "100%",
        pt: scrolled ? 0 : 1,
        transition: "all 0.3s ease-in-out",
        transform: scrolled ? "translateY(0)" : "translateY(10px)",
        opacity: scrolled ? 1 : 0.9,
      }}
    >
      <Box
        sx={{
          width: "100%",
          border: "2px solid #5AA9E6",
          backgroundColor: "white",
          boxShadow: scrolled
            ? "0 4px 6px rgba(0, 0, 0, 0.2)"
            : "0 2px 4px rgba(0, 0, 0, 0.1)",
          borderRadius: 3,
          overflow: "hidden",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <AppBar
          position="static"
          sx={{
            backgroundColor: "white",
            color: "black",
            boxShadow: "none",
            transition: "all 0.3s ease-in-out",
            fontFamily: "'Maven Pro', sans-serif",
          }}
        >
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "all 0.3s ease-in-out",
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{
                height: 40,
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
              onClick={() => navigate("/")}
            />
            <Typography
              variant="h6"
              sx={{
                flexGrow: 1,
                textAlign: { xs: "center", md: "left" },
                marginLeft: { xs: 0, md: 2 },
                color: "black",
                transition: "all 0.3s ease-in-out",
                fontFamily: "Sour Gummy, sans-serif",
              }}
            >
              CAMPUS VITALITY
            </Typography>
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
                color: "black",
              }}
            >
              <Button
                color="inherit"
                onClick={() => navigate("/")}
                sx={{
                  color: "black",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#E6F2FF",
                    color: "#5AA9E6",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/about-us")}
                sx={{
                  color: "black",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#E6F2FF",
                    color: "#5AA9E6",
                    transform: "scale(1.05)",
                  },
                }}
              >
                About Us
              </Button>
              <Button
                color="inherit"
                onClick={() => navigate("/contact-us")}
                sx={{
                  color: "black",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#E6F2FF",
                    color: "#5AA9E6",
                    transform: "scale(1.05)",
                  },
                }}
              >
                Contact Us
              </Button>
              {!user && (
                <>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "black",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#E6F2FF",
                        color: "#5AA9E6",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    color="inherit"
                    onClick={() => navigate("/register")}
                    sx={{
                      color: "black",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#E6F2FF",
                        color: "#5AA9E6",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
              {user && (
                <>
                  <IconButton
                    color="inherit"
                    onClick={handleProfileMenuOpen}
                    sx={{
                      color: "black",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <AccountCircle />
                  </IconButton>
                  <Menu
                    anchorEl={profileMenuAnchor}
                    open={Boolean(profileMenuAnchor)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      sx: {
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid #5AA9E6",
                        transition: "all 0.3s ease",
                        fontFamily: "'Maven Pro', sans-serif",
                      },
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    {renderProfileLinks()}
                  </Menu>
                </>
              )}
            </Box>
            <IconButton
              color="inherit"
              sx={{
                display: { xs: "flex", md: "none" },
                color: "black",
              }}
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{
              width: 250,
              padding: 2,
              backgroundColor: "white",
              fontFamily: "'Maven Pro', sans-serif",
            }}
          >
            <List>
              <ListItem
                button
                onClick={() => navigate("/")}
                sx={{ color: "black" }}
              >
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem
                button
                onClick={() => navigate("/about-us")}
                sx={{ color: "black" }}
              >
                <ListItemText primary="About Us" />
              </ListItem>
              <ListItem
                button
                onClick={() => navigate("/contact-us")}
                sx={{ color: "black" }}
              >
                <ListItemText primary="Contact Us" />
              </ListItem>
              {!user && (
                <>
                  <ListItem
                    button
                    onClick={() => navigate("/login")}
                    sx={{ color: "black" }}
                  >
                    <ListItemText primary="Login" />
                  </ListItem>
                  <ListItem
                    button
                    onClick={() => navigate("/register")}
                    sx={{ color: "black" }}
                  >
                    <ListItemText primary="Register" />
                  </ListItem>
                </>
              )}
              {user && renderProfileLinks()}
            </List>
          </Box>
        </Drawer>
      </Box>
    </Box>
  );
};

export default Navbar;
