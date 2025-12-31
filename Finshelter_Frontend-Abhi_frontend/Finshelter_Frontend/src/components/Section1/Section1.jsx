import React, { useEffect } from "react";
import "./section1.css";
import { TypeAnimation } from "react-type-animation";
import AOS from "aos";
import "aos/dist/aos.css";
import { NavLink } from "react-router-dom";

const Section1 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);

	const boxStyle1 = {
		backgroundImage: `url(${"./images/hz5.png"})`,
		backgroundPosition: "center center",
		backgroundRepeat: "no-repeat",
		backgroundSize: "cover",
	};

	return (
		<div id='tax-section1' style={boxStyle1}>
			<div className='tax-section1-wrap'>
				<div className='tax-section1-right'>
					<p
						className='p-tag2'
						data-aos='fade-right'
						data-aos-duration='1000'></p>
					<div
						className='head-wrap1'
						data-aos='fade-down'
						data-aos-duration='1000'>
						<h1>
							Your one-stop platform
							<br className="desktop-break" /> for simplified financial
							<br className="desktop-break" /> service
						</h1>
					</div>
					<p>
						Robust financial services like taxation, loans, insurance, and mutual funds are the pillars of economic growth — empowering individuals, supporting governments, and securing futures.
					</p>
					<div className='tax-section1-input'>
						<NavLink to='/register' style={{ color: "white" }}>
							<button
								className='tax5-btn'
								data-aos='fade-up'
								data-aos-duration='800'>
								Register Today{" "}
								<i
									className='fa-solid fa-arrow-right'
									style={{ marginLeft: "7px" }}></i>
							</button>
						</NavLink>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section1;
