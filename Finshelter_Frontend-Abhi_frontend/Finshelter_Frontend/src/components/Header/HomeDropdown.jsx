import React from "react";
import { NavLink } from "react-router-dom";

const HomeDropdown = ({ changeTheme }) => {
	const handleThemeChange = (themeName) => {
		changeTheme(themeName); // Call the changeTheme function passed from parent
	};

	return (
		<div className='dropdown-menu'>
			<nav>
				<NavLink to='#' onClick={() => handleThemeChange("theme1")}>
					Theme 1
				</NavLink>
				<NavLink to='#' onClick={() => handleThemeChange("theme2")}>
					Theme 2
				</NavLink>
				<NavLink to='#' onClick={() => handleThemeChange("theme3")}>
					Theme 3
				</NavLink>
				<NavLink to='#' onClick={() => handleThemeChange("theme4")}>
					Theme 4
				</NavLink>
				<NavLink to='#' onClick={() => handleThemeChange("theme5")}>
					Theme 5
				</NavLink>
			</nav>
		</div>
	);
};

export default HomeDropdown;
