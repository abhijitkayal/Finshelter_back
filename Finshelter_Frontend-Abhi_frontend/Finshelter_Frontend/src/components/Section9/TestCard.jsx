import React from "react";
import { Box, Typography } from "@mui/material";

const TestCard = ({ heading, img, desc }) => {
	return (
		<Box
			className='tax-section9test-wrap'
			sx={{
				bgcolor: "var(--secondary)",
				borderRadius: 2,
				p: { xs: 2, md: 3 }, // Responsive padding
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 2,
				width: "100%",
				maxWidth: "450px",
				minHeight: "350px",
				mx: "auto",
			}}>
			<Box
				component='img'
				src={img}
				alt='Testimonial'
				sx={{ width: 70, height: 70, borderRadius: "50%" }}
			/>
			<Typography
				sx={{ fontWeight: 700, color: "var(--primary)", textAlign: "center" }}>
				Person1 <br />
				<Typography component='span' sx={{ fontWeight: 400, color: "black" }}>
					Description
				</Typography>
			</Typography>
			<Typography
				sx={{
					textAlign: "center",
					color: "var(--primary)",
					fontSize: { xs: "0.9rem", md: "1rem" },
				}}>
				{desc}
			</Typography>
		</Box>
	);
};

export default TestCard;
