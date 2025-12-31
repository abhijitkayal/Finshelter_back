import React from "react";
import "./section6.css";
import { useInView } from "react-intersection-observer";
import CountUp from "react-countup";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

const Section6 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);
	const { ref, inView } = useInView({
		triggerOnce: true, // Trigger only once
		threshold: 0.1, // Trigger when 50% of the element is in the view
	});
	const boxStyle2 = {
		backgroundImage: `url(${"./images/sec6bg.jpg"})`,
		backgroundPosition: `bottom`,
	};

	return (
		<div className='tax-section6' style={boxStyle2}>
			<div className='tax-section6wrap'>
				<div className='tax-section6-col'>
					<div className='tax-user' ref={ref}>
						<i class='fa-solid fa-user-group fa-2xl'></i>
						{inView && (
							<h1>
								<CountUp start={0} end={1523} duration={7} />+
							</h1>
						)}
					</div>
					<p>Happy Clients</p>
				</div>
				<div className='tax-section6-col'>
					<div className='tax-user' ref={ref}>
						<i class='fa-solid fa-calendar fa-2xl'></i>
						{inView && (
							<h1>
								<CountUp start={0} end={10} duration={30} />+
							</h1>
						)}
					</div>
					<p>Years Experience</p>
				</div>
				<div className='tax-section6-col'>
					<div className='tax-user' ref={ref}>
						<i class='fa-solid fa-lightbulb fa-2xl'></i>
						{inView && (
							<h1>
								<CountUp start={0} end={22} duration={20} />+
							</h1>
						)}
					</div>
					<p>Expert Team</p>
				</div>

				<div className='tax-section6-col'>
					<div className='tax-user' ref={ref}>
						<i class='fa-solid fa-bolt fa-2xl'></i>
						{inView && (
							<h1>
								<CountUp start={0} end={100} duration={9} />%
							</h1>
						)}
					</div>
					<p>On-time Service</p>
				</div>
			</div>
		</div>
	);
};

export default Section6;
