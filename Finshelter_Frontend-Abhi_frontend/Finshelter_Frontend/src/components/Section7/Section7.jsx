import React from "react";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import "./section7.css";
import CountUp from "react-countup";
const Section7 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	const [value1, setValue1] = useState(0); // Slider 1 value
	const [value2, setValue2] = useState(0); // Slider 2 value

	const { ref: slider1Ref, inView: slider1InView } = useInView({
		threshold: 0.5,
	});
	const { ref: slider2Ref, inView: slider2InView } = useInView({
		threshold: 0.5,
	});

	useEffect(() => {
		if (slider1InView) {
			let current1 = 0;
			const interval1 = setInterval(() => {
				if (current1 < 95) {
					current1 += 1;
					setValue1(current1);
				} else {
					clearInterval(interval1);
				}
			}, 10); // Updates every 10ms for smooth animation
		} else {
			setValue1(0); // Reset when out of view
		}
	}, [slider1InView]);

	useEffect(() => {
		if (slider2InView) {
			let current2 = 0;
			const interval2 = setInterval(() => {
				if (current2 < 98) {
					current2 += 1;
					setValue2(current2);
				} else {
					clearInterval(interval2);
				}
			}, 10); // Updates every 10ms for smooth animation
		} else {
			setValue2(0); // Reset when out of view
		}
	}, [slider2InView]);
	const { ref, inView } = useInView({
		triggerOnce: true, // Trigger only once
		threshold: 0.1, // Trigger when 50% of the element is in the view
	});
	return (
		<>
			<div id='tax-section7'>
				<div className='tax-section7-wrap'>
					<div className='tax7-left'>
						<img src='./images/sec7banner.jpg' alt='' />
						<div id='tax7-small-count'>
							<div className='tax-section6-col' style={{ width: "50%" }}>
								<div className='tax-user' ref={ref}>
									<i class='fa-solid fa-rocket fa-2xl'></i>
									{inView && (
										<h1>
											<CountUp start={0} end={10} duration={20} />+
										</h1>
									)}
								</div>
								<p>Years Experience</p>
							</div>
							<img src='./images/taxation.jpg' alt='' />
						</div>
					</div>
					<div className='tax7-right'>
						<h1 data-aos='fade-right' data-aos-duration='800'>
							Why FinShelter ?
						</h1>
						<div className='tax7-list'>
							<p>
								FinShelter stands as a dedicated financial partner, designed to
								simplify, safeguard, and strengthen your financial well-being.
								With our diverse range of services and professional expertise,
								we cater to all your financial needs under one umbrella
							</p>
							<div className='tax-7list-con'>
								<ul>
									<li>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<i class='fa-regular fa-circle-check fa-lg'></i>
											<h4>Comprehensive Financial Solutions:</h4>
										</div>
										Whether you're seeking loans to achieve your dreams, mutual
										fund distribution to grow your wealth, or insurance
										solutions to protect your future, FinShelter has you
										covered.
									</li>
									<li>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<i class='fa-regular fa-circle-check fa-lg'></i>
											<h4>Expert Taxation Services:</h4>
										</div>{" "}
										From ITR filing and GST compliance to ROC filings, we ensure
										that complex regulatory requirements are handled with ease
										and efficiency, helping you focus on your priorities.
									</li>
									<li>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<i class='fa-regular fa-circle-check fa-lg'></i>
											<h4>Unmatched Expertise:</h4>
										</div>{" "}
										Our team leverages extensive industry experience and
										insights to provide tailored solutions, ensuring your
										financial goals are met with professionalism and
										reliability.
									</li>
									<li>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<i class='fa-regular fa-circle-check fa-lg'></i>
											<h4>Streamlined Processes:</h4>
										</div>{" "}
										We prioritize clarity, transparency, and ease, making your
										financial journey seamless and stress-free.
									</li>
									<li>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: "5px",
											}}>
											<i class='fa-regular fa-circle-check fa-lg'></i>
											<h4>Customer-Centric Approach:</h4>
										</div>{" "}
										At FinShelter, our focus is on you. We listen to your unique
										needs, offer personalized guidance, and ensure that our
										services align perfectly with your aspirations.
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className='two-sliders-container'>
				<div className='slider-container' ref={slider1Ref}>
					<div className='slider-label'>{value1}%</div>
					<label htmlFor='' style={{ whiteSpace: "nowrap" }}>
						Saving Strategies
					</label>
					<input
						type='range'
						min='0'
						max='100'
						value={value1}
						onChange={(e) => setValue1(Number(e.target.value))}
						className='slider'
						style={{
							background: `linear-gradient(to right, var(--primary) ${value1}%, #ddd ${value1}%)`,
						}}
					/>
				</div>
				
				<div className='slider-container' ref={slider2Ref}>
					<div className='slider-label'>{value2}%</div>
					<label htmlFor='' style={{ whiteSpace: "nowrap" }}>
						Tax Planning
					</label>
					<input
						type='range'
						min='0'
						max='100'
						value={value2}
						onChange={(e) => setValue2(Number(e.target.value))}
						className='slider'
						style={{
							background: `linear-gradient(to right, var(--accent) ${value2}%, #ddd ${value2}%)`,
						}}
					/>
				</div>
				<div className='slider-container' ref={slider1Ref}>
					<div className='slider-label'>{value1}%</div>
					<label htmlFor='' style={{ whiteSpace: "nowrap" }}>
						Financial Planning
					</label>
					<input
						type='range'
						min='0'
						max='100'
						value={value1}
						onChange={(e) => setValue1(Number(e.target.value))}
						className='slider'
						style={{
							background: `linear-gradient(to right, var(--primary) ${value1}%, #ddd ${value1}%)`,
						}}
					/>
				</div>
				<div className='slider-container' ref={slider2Ref}>
					<div className='slider-label'>{value2}%</div>
					<label htmlFor='' style={{ whiteSpace: "nowrap" }}>
						Investment Guidance
					</label>
					<input
						type='range'
						min='0'
						max='100'
						value={value2}
						onChange={(e) => setValue2(Number(e.target.value))}
						className='slider'
						style={{
							background: `linear-gradient(to right, var(--accent) ${value2}%, #ddd ${value2}%)`,
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default Section7;
