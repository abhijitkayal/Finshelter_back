import axios from "axios";

const axiosConfig = axios.create({
	baseURL: import.meta.env.VITE_API_URL 
		? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
		: "http://localhost:8000/api",
});

export default axiosConfig;
