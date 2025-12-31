import React, { useState, useEffect } from "react";
import "./section11.css";
import AOS from "aos";
import "aos/dist/aos.css";

const Section11 = () => {
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
		AOS.init();
	}, []);

	const faqData = [
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit?",
			answer:
				"This is dummy content. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat!",
		},
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit?",
			answer:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat!",
		},
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit?",
			answer:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat!",
		},
		{
			question: "Lorem ipsum dolor, sit amet consectetur adipisicing elit?",
			answer:
				"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Vitae quae ea placeat necessitatibus tempore animi est, magni id cumque dicta fugiat similique sunt aut distinctio, a perspiciatis quod quaerat!",
		},
	];

	// Separate states for left and right FAQ lists
	const [activeIndexLeft, setActiveIndexLeft] = useState(0); // Default open on left
	const [activeIndexRight, setActiveIndexRight] = useState(null); // None open on right

	const toggleFAQLeft = (index) => {
		setActiveIndexLeft(index === activeIndexLeft ? null : index);
	};

	const toggleFAQRight = (index) => {
		setActiveIndexRight(index === activeIndexRight ? null : index);
	};

	return (
		<div className='tax-section11'>
			<div className='tax-section11-wrap'>
				{/* Left FAQ Section */}
				<div className='faq-section-left'>
					<div className='faq-list'>
						<h1 data-aos='fade-down' data-aos-duration='800'>
							FAQ's
						</h1>
						{faqData.map((item, index) => (
							<div key={index} className='faq-item'>
								<div
									className='faq-question'
									onClick={() => toggleFAQLeft(index)}>
									<span>{item.question}</span>
									<i
										className={`fas ${
											activeIndexLeft === index
												? "fa-chevron-up"
												: "fa-chevron-down"
										}`}></i>
								</div>
								<div
									className={`faq-answer ${
										activeIndexLeft === index ? "open" : ""
									}`}>
									<p>{item.answer}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Right FAQ Section */}
				<div className='tax-section11-right'>
					<button
						className='tax5-btn'
						data-aos='fade-down'
						data-aos-duration='800'>
						Ask A Question <i className='fa-solid fa-arrow-right'></i>
					</button>
					<div className='faq-list'>
						{faqData.map((item, index) => (
							<div key={index} className='faq-item'>
								<div
									className='faq-question'
									onClick={() => toggleFAQRight(index)}>
									<span>{item.question}</span>
									<i
										className={`fas ${
											activeIndexRight === index
												? "fa-chevron-up"
												: "fa-chevron-down"
										}`}></i>
								</div>
								<div
									className={`faq-answer ${
										activeIndexRight === index ? "open" : ""
									}`}>
									<p>{item.answer}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Section11;
