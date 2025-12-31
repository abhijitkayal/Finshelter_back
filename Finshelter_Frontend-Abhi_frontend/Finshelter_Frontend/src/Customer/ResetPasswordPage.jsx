import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useCustomerAuth } from "./CustomerAuthContext";
import { useNotification } from "../NotificationContext";
import {
    Box,
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    useMediaQuery,
    CircularProgress,
    Alert
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "./customer-login.css";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tokenValid, setTokenValid] = useState(null);
    const [resetComplete, setResetComplete] = useState(false);
    
    const { resetPassword } = useCustomerAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const { token: urlToken } = useParams(); // Get token from URL parameter
    
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    
    // Extract token from query params or URL params
    const queryParams = new URLSearchParams(location.search);
    const queryToken = queryParams.get('token');
    const token = urlToken || queryToken;
    
    useEffect(() => {
        // Validate token exists
        if (!token) {
            setTokenValid(false);
            showNotification("Invalid or missing reset token. Please request a new password reset.", "error");
        } else {
            setTokenValid(true);
        }
    }, [token, showNotification]);
    
    const validatePassword = (password) => {
        // At least 8 characters, contains number and letter
        return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
    };
    
    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        // Validate passwords
        if (!validatePassword(password)) {
            showNotification("Password must be at least 8 characters and include at least one letter and one number", "error");
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification("Passwords do not match", "error");
            return;
        }
        
        setLoading(true);
        
        try {
            // Use password as the parameter name instead of newPassword to match backend expectation
            const response = await resetPassword(token, password);
            
            if (response.success) {
                setResetComplete(true);
                showNotification(response.message, "success");
            } else {
                showNotification(response.message, "error");
            }
        } catch (error) {
            showNotification("An error occurred while resetting your password. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };
    
    const handleBackToLogin = () => {
        navigate('/login');
    };
    
    if (tokenValid === false) {
        return (
            <Box sx={{ mt: "128px", mb: 4 }}>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Invalid Reset Link
                        </Typography>
                        <Alert severity="error" sx={{ my: 2 }}>
                            The password reset link is invalid or has expired. Please request a new password reset.
                        </Alert>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                            <Button 
                                variant="contained" 
                                onClick={handleBackToLogin}
                                sx={{
                                    bgcolor: "#95b8a2",
                                    "&:hover": {
                                        bgcolor: "#7a9985",
                                    },
                                }}
                            >
                                Back to Login
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        );
    }
    
    if (resetComplete) {
        return (
            <Box sx={{ mt: "128px", mb: 4 }}>
                <Container maxWidth="sm">
                    <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Password Reset Complete
                        </Typography>
                        <Alert severity="success" sx={{ my: 2 }}>
                            Your password has been successfully reset.
                        </Alert>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                            <Button 
                                variant="contained" 
                                onClick={handleBackToLogin}
                                sx={{
                                    bgcolor: "#95b8a2",
                                    "&:hover": {
                                        bgcolor: "#7a9985",
                                    },
                                }}
                            >
                                Go to Login
                            </Button>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        );
    }
    
    return (
        <Box sx={{ mt: "128px", mb: 4 }}>
            <Container maxWidth="sm">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Reset Your Password
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ mb: 4 }}>
                        Please enter your new password
                    </Typography>
                    
                    <form onSubmit={handleResetPassword}>
                        <Box sx={{ mb: 3 }}>
                            <TextField
                                fullWidth
                                label="New Password"
                                variant="outlined"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <i className="fas fa-lock"></i>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                helperText="Password must be at least 8 characters and include at least one letter and one number"
                            />
                        </Box>
                        
                        <Box sx={{ mb: 4 }}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                variant="outlined"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <i className="fas fa-lock"></i>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                edge="end"
                                            >
                                                <i className={`fas ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                bgcolor: "#95b8a2",
                                "&:hover": {
                                    bgcolor: "#7a9985",
                                },
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{ color: "white" }} />
                            ) : (
                                "Reset Password"
                            )}
                        </Button>
                        
                        <Box sx={{ textAlign: "center", mt: 3 }}>
                            <Button
                                onClick={handleBackToLogin}
                                sx={{
                                    textTransform: "none",
                                    color: "#3a5a40",
                                    p: 0,
                                    "&:hover": {
                                        bgcolor: "transparent",
                                        textDecoration: "underline",
                                    },
                                }}
                            >
                                Back to Login
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default ResetPasswordPage; 