import React from "react";

const TestCard = (props) => {
	const { heading, img, desc } = props;
	return (
		<div className='tax-section8-wrap'>
			<div className='tax-section8-left'>
				<img src={img} alt='' />
			</div>
			<div className='tax-section8-right'>
				<h4>{heading}</h4>
				<p>{desc}</p>
				<a href=''>
					Learn More <i class='fa-solid fa-arrow-right'></i>
				</a>
			</div>
		</div>
	);
};

export default TestCard;
