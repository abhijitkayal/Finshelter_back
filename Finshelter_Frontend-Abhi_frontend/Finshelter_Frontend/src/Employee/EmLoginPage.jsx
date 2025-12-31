// EmLoginPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EmployeeContext } from "./EmployeeContext";
import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../NotificationContext";
import "./employee.css";

const EmLoginPage = () => {
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const { login } = useContext(EmployeeContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate(); // Hook for navigation
	const { showNotification } = useNotification();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const success = await login(email, password);

		if (success) {
			showNotification(
				"Login successful for Employee! Redirecting to dashboard...",
				"success"
			);
			setTimeout(() => {
				setLoading(false); // Stop loading after redirect
				console.log("Redirecting to employee dashboard...");
				navigate(`/employees/dashboard/${email}`);
			}, 2000);
		} else {
			showNotification("Login failed. Please try again.", "error");
			setLoading(false);
			console.log("Login failed. Check error message displayed.");
		}
	};

	return (
		<div className='tax-employee-login'>
			<div>
				<h1>Employee Login</h1>
				<form onSubmit={handleSubmit}>
					<div>
						<label>Email:</label>
						<input
							type='email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div style={{ position: "relative" }}>
						<label>Password:</label>
						<input
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						<i
							className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
							style={{
								position: "absolute",
								right: "-10px",
								top: "60px",
								cursor: "pointer",
							}}
							onClick={() => setShowPassword((prev) => !prev)}></i>
					</div>
					{/* {error && <p style={{ color: "red" }}>{error}</p>} */}
					<button type='submit' disabled={loading}>
						{loading ? "Logging In..." : "Login"}
					</button>
				</form>
				{loading && (
					<div
						style={{
							position: "fixed",
							top: 0,
							left: 0,
							width: "100%",
							height: "100%",
							background: "rgba(0,0,0,0.5)",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
						}}>
						<ClipLoader size={50} color='#ffffff' />
					</div>
				)}
			</div>
		</div>
	);
};

export default EmLoginPage;
