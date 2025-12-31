import React from "react";
import { Box, Container, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

// Styled components for the calculator wrapper
const HeroSection = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #1b321d 0%, #3c6d47 100%)",
  padding: theme.spacing(6, 0),
  paddingTop: "160px !important",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
  [theme.breakpoints.down("sm")]: {
    paddingTop: "140px",
    padding: theme.spacing(4, 0),
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: "50%",
    right: "5%",
    width: "400px",
    height: "400px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "50%",
    transform: "translate(50%, -50%)",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      width: "250px",
      height: "250px",
      right: "0%",
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "-100px",
    left: "10%",
    width: "300px",
    height: "300px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: "50%",
    zIndex: 1,
    [theme.breakpoints.down("sm")]: {
      width: "200px",
      height: "200px",
      bottom: "-50px",
    },
  },
}));

const MainContent = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(10),
  position: "relative",
  [theme.breakpoints.down("sm")]: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(6),
  },
  "&::before": {
    content: '""',
    position: "absolute",
    top: "20%",
    right: "0",
    width: "250px",
    height: "250px",
    backgroundColor: "rgba(149, 184, 162, 0.05)",
    borderRadius: "50%",
    zIndex: 0,
    [theme.breakpoints.down("sm")]: {
      width: "150px",
      height: "150px",
    },
  },
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "5%",
    left: "5%",
    width: "200px",
    height: "200px",
    backgroundColor: "rgba(149, 184, 162, 0.05)",
    borderRadius: "50%",
    zIndex: 0,
    [theme.breakpoints.down("sm")]: {
      width: "120px",
      height: "120px",
    },
  },
}));

const BackgroundDecoration = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: -1,
  background: "radial-gradient(circle at 15% 50%, rgba(149, 184, 162, 0.03) 0%, transparent 50%),radial-gradient(circle at 85% 30%, rgba(27, 50, 29, 0.02) 0%, transparent 50%)",
  pointerEvents: "none",
}));

/**
 * A wrapper component to provide consistent styling for all calculator pages
 */
const CalculatorWrapper = ({ 
  title, 
  description, 
  backgroundIcon,
  children 
}) => {
  return (
    <Box sx={{ pb: 6, minHeight: "100vh" }}>
      <BackgroundDecoration />
      
      <HeroSection>
        <Container maxWidth="lg" sx={{ px: { xs: 6, sm: 6, md: 6 } }}>
          <Box sx={{ position: "relative", zIndex: 5 }}>
            <Typography 
              variant="h3" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                mb: { xs: 1.5, md: 1 },
                fontSize: { xs: "1.75rem", sm: "2.2rem", md: "3rem" },
                color: "#ffffff"
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: "800px", 
                opacity: 0.9, 
                lineHeight: 1.5, 
                color: "#ffffff",
                fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" }
              }}
            >
              {description}
            </Typography>
          </Box>
          <Box 
            sx={{ 
              position: "absolute", 
              right: "5%", 
              top: "50%", 
              transform: "translateY(-50%)", 
              opacity: 0.2,
              display: { xs: "none", md: "block" },
              color: "#ffffff"
            }}
          >
            {backgroundIcon}
          </Box>
        </Container>
      </HeroSection>
      
      <MainContent maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 3 } }}>
        {children}
      </MainContent>
    </Box>
  );
};

export default CalculatorWrapper; 