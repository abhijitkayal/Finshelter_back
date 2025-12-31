import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TestCard from "./TestCard";
import "./section4.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Section4 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	const CustomPrevArrow = (props) => {
		const { onClick } = props;
		return (
			<div className='customprevarrow' onClick={onClick}>
				<i class='fa-solid fa-circle-arrow-left fa-xl'></i>
			</div>
		);
	};

	const CustomNextArrow = (props) => {
		const { onClick } = props;
		return (
			<div className='customnextarrow' onClick={onClick}>
				<i class='fa-solid fa-circle-arrow-right fa-xl'></i>
			</div>
		);
	};
	const settings = {
		dots: true,
		infinite: true,
		autoplay: true,
		// fade: true,
		speed: 750,
		slidesToShow: 2,
		slidesToScroll: 1,

		// prevArrow: <CustomPrevArrow />,
		// nextArrow: <CustomNextArrow />,
	};
	const testimonials = [
		{
			id: 1,
			img: "./images/t1.png",
			heading: "Data collection and analysis",
			desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. ",
		},
		{
			id: 2,
			img: "./images/t2.png",
			heading: "Proactive strategy for financial growth",
			desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
		},
		{
			id: 3,
			img: "./images/t3.png",
			heading: "Proactive strategy for financial growth",
			desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit.",
		},
		{
			id: 4,
			img: "./images/t4.png",
			heading: "Cash flow planning and tax planning",
			desc: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. ",
		},
	];
	return (
		
			<div className='tax-section4-wrap'>
				<div data-aos='fade-down' data-aos-duration='800'>
					<p className='p-tag2'>WHY US</p>
					<h1>
						Why Should You Choose <br /> FinShelter
					</h1>
				</div>

				<Slider {...settings}>
					{testimonials.map((testimonial) => (
						<TestCard
							img={testimonial.img}
							heading={testimonial.heading}
							desc={testimonial.desc}
						/>
					))}
				</Slider>
			</div>
		
	);
};

export default Section4;
