import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDashboardContext } from "../AdminDashboardContext";

import ClipLoader from "react-spinners/ClipLoader";
import { useNotification } from "../../NotificationContext";

const LoginPage = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { login, isAuthenticated } = useContext(AdminDashboardContext);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			navigate("/admin/dashboard");
		}
	}, [isAuthenticated, navigate]);

	const { showNotification } = useNotification();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const success = await login(email, password);

		if (success) {
			showNotification(
				"Login successful! Redirecting to dashboard...",
				"success"
			);
			navigate("/admin/dashboard");
		} else {
			showNotification("Login failed. Please check your credentials.", "error");
		}
	};

	return (
		<div className='tax-admin-login'>
			<div
				style={{
					position: "relative",
					width: "300px",
					margin: "auto",
					padding: "20px",
				}}>
				<h1>Admin Login</h1>
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
					<button type='submit'>
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
