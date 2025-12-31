import React, { createContext, useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
	const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
	const [currentPage, setCurrentPage] = useState(null); // Track current page

	const showNotification = (
		message,
		type = "success",
		intendedContext = null
	) => {
		if (
			!isNotificationsEnabled ||
			(intendedContext && currentPage !== intendedContext)
		)
			return;

		switch (type) {
			case "success":
				toast.success(message);
				break;
			case "error":
				toast.error(message);
				break;
			case "warning":
				toast.warning(message);
				break;
			case "info":
				toast.info(message);
				break;
			default:
				toast(message);
		}
	};

	return (
		<NotificationContext.Provider
			value={{
				showNotification,
				isNotificationsEnabled,
				setIsNotificationsEnabled,
				currentPage,
				setCurrentPage,
			}}>
			{isNotificationsEnabled && (
				<ToastContainer
					position='top-right'
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			)}
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error(
			"useNotification must be used within a NotificationProvider"
		);
	}
	return context;
};

// Keep the HOC to disable notifications for specific components
export const withNotificationsDisabled = (WrappedComponent) => {
	return function WithNotificationsDisabledComponent(props) {
		const { setIsNotificationsEnabled } = useNotification();

		useEffect(() => {
			setIsNotificationsEnabled(false);
			return () => setIsNotificationsEnabled(true);
		}, [setIsNotificationsEnabled]);

		return <WrappedComponent {...props} />;
	};
};
