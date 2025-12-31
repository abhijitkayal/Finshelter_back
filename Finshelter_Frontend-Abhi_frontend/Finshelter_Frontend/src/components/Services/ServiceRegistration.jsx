import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import ServiceRegistrationForm from "./ServiceRegistrationForm";
import { Box, CircularProgress, Container, Typography, Paper } from "@mui/material";

const ServiceRegistration = () => {
  const location = useLocation();
  
  // If there's no state or it doesn't contain service, redirect to home
  if (!location.state || !location.state.service) {
    return <Navigate to="/" replace />;
  }
  
  const { service, selectedPackage, isLeadService } = location.state;
  
  return (
    <Box 
      className="service-registration-page"
      sx={{
        background: 'linear-gradient(to bottom, #ffffff, #c6dbce)',
        minHeight: '100vh',
        pt: 4,
        pb: 8,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'url(/images/pattern-bg.png) repeat',
          opacity: 0.05,
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            mb: 4, 
            p: 4, 
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(149, 184, 162, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              color: '#1b321d', 
              fontWeight: 700, 
              mb: 1 
            }}
          >
            {isLeadService ? `Express Interest in ${service.name}` : `Register for ${service.name}`}
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#1b321d', 
              opacity: 0.8,
              maxWidth: '700px',
              mx: 'auto'
            }}
          >
            {isLeadService 
              ? "Complete the form below to express your interest. Our team will contact you shortly."
              : "Complete your registration to access this service. Your journey to financial success starts here."}
          </Typography>
        </Paper>
        
        <ServiceRegistrationForm 
          service={service}
          selectedPackage={selectedPackage}
          isLeadService={isLeadService}
        />
      </Container>
    </Box>
  );
};

export default ServiceRegistration; 