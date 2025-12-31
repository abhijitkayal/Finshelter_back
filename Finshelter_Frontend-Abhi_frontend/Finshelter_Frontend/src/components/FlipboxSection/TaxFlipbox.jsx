import React, { useState } from "react";
import "./taxflipbox.css";

const TaxFlipbox = ({ title, content, icon }) => {
	const [isFlipped, setIsFlipped] = useState(false);

	const handleMouseEnter = () => {
		setIsFlipped(true);
	};

	const handleMouseLeave = () => {
		setIsFlipped(false);
	};
	return (
		<div
			className='flip-box'
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}>
			<div className={`flip-box-inner ${isFlipped ? "flipped" : ""}`}>
				<div className='flip-box-front'>
					<div>
						<i class={`icon ${icon}`} aria-hidden='true'></i>
					</div>
					<div>
						<h2>{title}</h2>
						<a href=''>
							Learn More <i class='fa-solid fa-arrow-right'></i>
						</a>
					</div>
				</div>
				<div className='flip-box-back'>
					<div>
						<i class={`icon ${icon}`} aria-hidden='true'></i>
					</div>
					<div>
						<p>{content}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TaxFlipbox;
