import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../NotificationContext';
import { useCustomerAuth } from './CustomerAuthContext';

const LoginOTPVerification = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  const { fetchCustomerDashboard } = useCustomerAuth();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/customer-login');
      return;
    }

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        'http://localhost:8000/api/customers/verify-login-otp',
        { email, otp }
      );

      if (data.success) {
        // Store token and user data
        localStorage.setItem('customerToken', data.token);
        
        showNotification('Login successful! Redirecting...', 'success');
        
        // Fetch dashboard data first, then navigate
        try {
          await fetchCustomerDashboard();
        } catch (err) {
          console.error('Error fetching dashboard:', err);
        }
        
        // Navigate to dashboard
        navigate(`/customers/dashboard/${email}`, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
      showNotification(err.response?.data?.message || 'Invalid OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');

    try {
      const { data } = await axios.post(
        'http://localhost:8000/api/customers/resend-login-otp',
        { email }
      );

      if (data.success) {
        showNotification('New OTP sent to your email', 'success');
        setTimer(600);
        setCanResend(false);
        setOtp('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
      showNotification('Failed to resend OTP', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              Verify OTP
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the 6-digit code sent to
            </Typography>
            <Typography variant="body1" fontWeight="bold" color="primary">
              {email}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleVerifyOTP}>
            <TextField
              fullWidth
              label="Enter OTP"
              variant="outlined"
              value={otp}
              onChange={handleOTPChange}
              placeholder="123456"
              inputProps={{
                maxLength: 6,
                style: { fontSize: 24, letterSpacing: 8, textAlign: 'center' },
              }}
              sx={{ mb: 3 }}
              autoFocus
            />

            <Box sx={{ textAlign: 'center', mb: 2 }}>
              {timer > 0 ? (
                <Typography variant="body2" color="text.secondary">
                  OTP expires in: <strong>{formatTime(timer)}</strong>
                </Typography>
              ) : (
                <Typography variant="body2" color="error">
                  OTP has expired
                </Typography>
              )}
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !otp || otp.length !== 6}
              sx={{ mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleResendOTP}
              disabled={!canResend || resendLoading}
              sx={{ py: 1.5 }}
            >
              {resendLoading ? (
                <CircularProgress size={24} />
              ) : canResend ? (
                'Resend OTP'
              ) : (
                `Resend available in ${formatTime(timer)}`
              )}
            </Button>

            <Button
              fullWidth
              variant="text"
              onClick={() => navigate('/customer-login')}
              sx={{ mt: 2 }}
            >
              Back to Login
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginOTPVerification;
