import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./section9.css";
import AOS from "aos";
import "aos/dist/aos.css";
import {
	Box,
	Typography,
	Paper,
	useTheme,
	useMediaQuery,
	Avatar,
	Card,
	CardContent,
	Rating,
	Divider,
	Stack,
} from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import PersonIcon from "@mui/icons-material/Person";

const Section9 = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);

	useEffect(() => {
		// Create a style element
		const styleElement = document.createElement("style");

		// Define our improved orbit animations with different timing and positions
		styleElement.innerHTML = `
			.solar-system {
				position: relative;
			}
			
			.central-image {
				position: absolute;
				width: 80px;
				height: 80px;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		`;

		// Append the style element to the head of the document
		document.head.appendChild(styleElement);

		// Clean up the effect when the component unmounts
		return () => {
			document.head.removeChild(styleElement);
		};
	}, []);

	const settings = {
		dots: true,
		infinite: true,
		autoplay: true,
		autoplaySpeed: 5000,
		speed: 700,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: false,
		dotsClass: "slick-dots custom-dots",
		appendDots: (dots) => (
			<Box
				sx={{
					bottom: "-40px",
					"& .slick-active button::before": {
						color: "var(--accent) !important",
						fontSize: "12px",
						opacity: 1,
					},
					"& button::before": {
						fontSize: "10px",
						color: "var(--primary)",
						opacity: 0.5,
					},
				}}>
				<ul> {dots} </ul>
			</Box>
		),
	};

	const testimonials = [
		// Each testimonial can have an optional 'image' property with the path to the user's image
		// If no image is provided, a default person icon will be displayed instead
		// Place testimonial images in: ./public/images/testimonials/
		{
			id: 1,
			name: "Amit R.",
			position: "Entrepreneur",
			rating: 4.5,
			heading: "A Trustworthy Financial Partner",
			desc: "FinShelter has been a game-changer for my financial planning. Their transparent and professional approach helped me secure the right solutions tailored to my needs. Truly a trustworthy partner!",
			image: "./images/Image1.jpg", // Optional image path
		},
		{
			id: 2,
			name: "Priya K.",
			position: "Freelancer",
			rating: 5.0,
			heading: "Simplified Taxation Experience",
			desc: "Navigating taxation was always a challenge, but FinShelter made it simple and stress-free. Their thorough guidance and on-time submissions have been invaluable to me.",
			image: "./images/Image2.webp",
		},
		{
			id: 3,
			name: "Ravi S.",
			position: "Business Owner",
			rating: 4.8,
			heading: "Effortless Business Loan Process",
			desc: "Securing a loan for my business expansion felt effortless with FinShelter. Their process was smooth, and their team ensured I was informed at every step. Highly recommend their services!",
			image: "./images/Image3.jpg",
		},
		{
			id: 4,
			name: "Meena P.",
			position: "Investor",
			rating: 4.9,
			heading: "Consistent Investment Growth",
			desc: "I've seen consistent growth in my investments thanks to FinShelter's mutual fund services. Their expert advice and personalized strategies make them stand out in the financial world.",
			image: "./images/Image4.jpg",
		},
		{
			id: 5,
			name: "Arjun M.",
			position: "Engineer",
			rating: 4.7,
			heading: "Exceptional Insurance Planning",
			desc: "FinShelter helped me choose the best insurance plan to protect my family's future. Their commitment to explaining every detail with patience and clarity was remarkable. A reliable and caring team!",
			image: "./images/Image5.jpg",
		},
	];

	return (
		<Box
			className='tax-section9-wrap'
			sx={{
				bgcolor: "var(--background)",
				py: { xs: 4, md: 6 },
				px: { xs: 3, md: 5 },
				minHeight: "500px",
			}}>
			<Box
				data-aos='fade-down'
				data-aos-duration='800'
				sx={{ textAlign: "center", mb: 4 }}>
				<Typography
					variant='h1'
					sx={{
						color: "var(--primary)",
						fontWeight: 700,
						fontSize: { xs: "2rem", md: "2.7rem" },
						mb: 1,
					}}>
					Our Testimonials
				</Typography>
				<Typography
					variant='subtitle1'
					sx={{
						color: "text.secondary",
						maxWidth: "700px",
						mx: "auto",
						fontSize: { xs: "0.9rem", md: "1rem" },
					}}>
					See what our clients say about our financial services and solutions
				</Typography>
			</Box>
			<Box
				className='tax9sliderwrap'
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					alignItems: "center",
					width: { xs: "95%", md: "90%" },
					maxWidth: "1300px",
					mx: "auto",
					mt: 4,
					mb: { xs: 6, md: 8 },
					position: "relative",
				}}>
				<Box
					className='slidercont'
					sx={{
						flex: 1,
						maxWidth: { xs: "100%", md: "45%" },
						width: "100%",
						px: { xs: 2, md: 3 },
						position: "relative",
						"&:before": {
							content: '""',
							position: "absolute",
							top: "-20px",
							left: "20px",
							width: "60px",
							height: "60px",
							borderRadius: "50%",
							bgcolor: "var(--accent)",
							opacity: 0.1,
							zIndex: 0,
						},
						"&:after": {
							content: '""',
							position: "absolute",
							bottom: "-30px",
							right: "30px",
							width: "80px",
							height: "80px",
							borderRadius: "50%",
							bgcolor: "var(--primary)",
							opacity: 0.1,
							zIndex: 0,
						},
						"& .slick-dots": {
							paddingBottom: "20px",
						},
					}}>
					<Paper
						elevation={6}
						sx={{
							borderRadius: 4,
							overflow: "hidden",
							py: 3,
							px: { xs: 2, md: 3 },
							bgcolor: "#fff",
							position: "relative",
							zIndex: 1,
							transition: "all 0.3s ease",
							minHeight: { xs: "auto", md: "420px" },
							"&:hover": {
								boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
							},
						}}>
						<Slider {...settings}>
							{testimonials.map((testimonial) => (
								<Box
									key={testimonial.id}
									sx={{ px: { xs: 1, md: 2 }, pt: 1, pb: 2 }}>
									<Card elevation={0} sx={{ bgcolor: "transparent" }}>
										<CardContent
											sx={{ px: { xs: 1, md: 2 }, py: { xs: 1, md: 2 } }}>
											<FormatQuoteIcon
												sx={{
													fontSize: 50,
													color: "var(--accent)",
													opacity: 0.4,
													mb: 2,
												}}
											/>
											<Typography
												variant='h5'
												color='var(--primary)'
												fontWeight='600'
												gutterBottom>
												{testimonial.heading}
											</Typography>
											<Typography
												variant='body1'
												color='text.secondary'
												paragraph
												sx={{
													minHeight: { xs: "auto", md: "150px" },
													fontSize: "1rem",
													lineHeight: 1.7,
													mt: 2,
													mb: 3,
												}}>
												{testimonial.desc}
											</Typography>
											<Divider sx={{ my: 2 }} />
											<Stack
												direction='row'
												spacing={2}
												alignItems='center'
												justifyContent='space-between'
												sx={{ mt: 3 }}>
												<Stack direction='row' spacing={2} alignItems='center'>
													<Avatar
														src={testimonial.image || ""}
														sx={{
															width: 64,
															height: 64,
															bgcolor: "var(--primary)",
															border: "2px solid var(--accent)",
														}}>
														{!testimonial.image && (
															<PersonIcon
																sx={{ fontSize: 40, color: "white" }}
															/>
														)}
													</Avatar>
													<Box>
														<Typography
															variant='subtitle1'
															fontWeight='600'
															color='var(--primary)'
															fontSize='1.1rem'>
															{testimonial.name}
														</Typography>
														<Typography variant='body2' color='text.secondary'>
															{testimonial.position}
														</Typography>
													</Box>
												</Stack>
												<Stack 
													direction="row" 
													spacing={1} 
													alignItems="center"
												>
													<Rating
														value={testimonial.rating}
														readOnly
														precision={0.1}
														size='medium'
														sx={{ 
															color: '#FFD700', // Golden color for stars
															'& .MuiRating-iconEmpty': {
																color: 'rgba(255, 215, 0, 0.3)' // Faded gold for empty stars
															}
														}}
													/>
													<Typography
														variant="body2"
														sx={{
															color: 'var(--primary)',
															fontWeight: 600,
															fontSize: '0.9rem'
														}}
													>
														({testimonial.rating.toFixed(1)})
													</Typography>
												</Stack>
											</Stack>
										</CardContent>
									</Card>
								</Box>
							))}
						</Slider>
					</Paper>
				</Box>
				<Box
					className='tax9-animate'
					sx={{
						flex: 1,
						display: "flex",
						justifyContent: "center",
						mt: { xs: 4, md: 0 },
					}}>
					<Box
						className='solar-system'
						sx={{
							width: { xs: "300px", md: "500px" },
							height: { xs: "300px", md: "500px" },
							position: "relative",
						}}>
						<Box className='central-image'>
							<Box
								sx={{
									width: "100%",
									height: "100%",
									borderRadius: "50%",
									bgcolor: "var(--primary)",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									overflow: "hidden",
									border: "3px solid var(--accent)",
								}}>
								{testimonials[0]?.image ? (
									<Box
										component='img'
										src={testimonials[0].image}
										alt={testimonials[0].name}
										sx={{
											width: "100%",
											height: "100%",
											objectFit: "cover",
										}}
									/>
								) : (
									<PersonIcon sx={{ fontSize: 50, color: "white" }} />
								)}
							</Box>
						</Box>
						<Box className='orbit orbit-1'>
							<Box className='planet'>
								<Box
									sx={{
										width: "100%",
										height: "100%",
										borderRadius: "50%",
										bgcolor: "var(--primary)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										overflow: "hidden",
										border: "2px solid var(--accent)",
									}}>
									{testimonials[1]?.image ? (
										<Box
											component='img'
											src={testimonials[1].image}
											alt={testimonials[1].name}
											sx={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
										/>
									) : (
										<PersonIcon sx={{ fontSize: 24, color: "white" }} />
									)}
								</Box>
							</Box>
						</Box>
						<Box className='orbit orbit-2'>
							<Box className='planet'>
								<Box
									sx={{
										width: "100%",
										height: "100%",
										borderRadius: "50%",
										bgcolor: "var(--primary)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										overflow: "hidden",
										border: "2px solid var(--accent)",
									}}>
									{testimonials[2]?.image ? (
										<Box
											component='img'
											src={testimonials[2].image}
											alt={testimonials[2].name}
											sx={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
										/>
									) : (
										<PersonIcon sx={{ fontSize: 24, color: "white" }} />
									)}
								</Box>
							</Box>
						</Box>
						<Box className='orbit orbit-3'>
							<Box className='planet'>
								<Box
									sx={{
										width: "100%",
										height: "100%",
										borderRadius: "50%",
										bgcolor: "var(--primary)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										overflow: "hidden",
										border: "2px solid var(--accent)",
									}}>
									{testimonials[3]?.image ? (
										<Box
											component='img'
											src={testimonials[3].image}
											alt={testimonials[3].name}
											sx={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
										/>
									) : (
										<PersonIcon sx={{ fontSize: 24, color: "white" }} />
									)}
								</Box>
							</Box>
						</Box>
						<Box className='orbit orbit-4'>
							<Box className='planet'>
								<Box
									sx={{
										width: "100%",
										height: "100%",
										borderRadius: "50%",
										bgcolor: "var(--primary)",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										overflow: "hidden",
										border: "2px solid var(--accent)",
									}}>
									{testimonials[4]?.image ? (
										<Box
											component='img'
											src={testimonials[4].image}
											alt={testimonials[4].name}
											sx={{
												width: "100%",
												height: "100%",
												objectFit: "cover",
											}}
										/>
									) : (
										<PersonIcon sx={{ fontSize: 24, color: "white" }} />
									)}
								</Box>
							</Box>
						</Box>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default Section9;
