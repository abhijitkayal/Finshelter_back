import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";

const CDocumentUpload = () => {
	const { services, user } = useCustomerAuth();
	const [selectedServiceName, setSelectedServiceName] = useState("");
	const [uploadedDocuments, setUploadedDocuments] = useState([]);
	const [popupImage, setPopupImage] = useState(null); // State to manage the popup image

	useEffect(() => {
		if (services && services.length > 0) {
			setSelectedServiceName(services[0].serviceName);
			setUploadedDocuments(services[0].documents || []);
		}
	}, [services]);

	useEffect(() => {
		const selectedService = services.find(
			(service) => service.serviceName === selectedServiceName
		);
		setUploadedDocuments(selectedService?.documents || []);
	}, [selectedServiceName, services]);

	const renderServiceSelection = () => {
		if (services.length > 1) {
			return (
				<select
					value={selectedServiceName}
					onChange={(e) => setSelectedServiceName(e.target.value)}
					className='service-select'>
					{services.map((service) => (
						<option key={service.serviceId} value={service.serviceName}>
							{service.orderId}
						</option>
					))}
				</select>
			);
		}
		return (
			<div className='single-service'>
				Service: {selectedServiceName || "No Service Selected"}
			</div>
		);
	};

	const renderUploadedDocuments = () => {
		if (!user?._id) return null;
		const baseUrl = `http://localhost:8000/uploads/${user._id}/`;

		return (
			<div className='uploaded-documents'>
				{/* <h3 className='upload-title'></h3> */}
				{uploadedDocuments.length > 0 ? (
					<div className='document-grid'>
						{uploadedDocuments.map((doc, index) => {
							const fileUrl = `${baseUrl}${doc.filename}`;
							return (
								<div key={index} className='document-item'>
									{doc.mimetype?.startsWith("image/") ? (
										<div className='image-preview'>
											<img
												src={fileUrl}
												alt={doc.originalName}
												onClick={() => setPopupImage(fileUrl)} // Open popup on click
												className='thumbnail'
											/>
											<span className='document-name'>{doc.originalName}</span>
										</div>
									) : (
										<div className='file-preview'>
											<a
												href={fileUrl}
												target='_blank'
												rel='noopener noreferrer'
												className='file-link'>
												{doc.originalName}
											</a>
											<span className='file-type'>{doc.mimetype}</span>
										</div>
									)}
								</div>
							);
						})}
					</div>
				) : (
					<div className='no-documents'>No documents uploaded yet.</div>
				)}
			</div>
		);
	};

	const renderPopup = () => {
		if (!popupImage) return null;
		return (
			<div className='popup-overlay' onClick={() => setPopupImage(null)}>
				<div className='popup-content'>
					<img src={popupImage} alt='Preview' className='popup-image' />
					<span className='close-popup' onClick={() => setPopupImage(null)}>
						&times;
					</span>
				</div>
			</div>
		);
	};

	return (
		<div className='document-upload-container'>
			{renderServiceSelection()}
			{renderUploadedDocuments()}
			{renderPopup()}
		</div>
	);
};

export default CDocumentUpload;
