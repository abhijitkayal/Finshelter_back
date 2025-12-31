// import React, { useState } from "react";
// import { useCustomerAuth } from "./CustomerAuthContext";
// import "./customer.css"; // Import CSS for styling

// const CProfileSection = () => {
// 	const { user, formData, handleSaveProfile, setFormData } = useCustomerAuth();
// 	const [editableField, setEditableField] = useState(""); // Track which field is currently editable

// 	const handleFieldEdit = (field) => {
// 		setEditableField(field); // Set the field as editable
// 	};

// 	const handleInputChange = (e) => {
// 		const { name, value } = e.target;
// 		setFormData((prevData) => ({
// 			...prevData,
// 			[name]: value,
// 		}));
// 	};
// 	const getProfileInitial = () => {
// 		return user.name ? user.name.charAt(0) : "?";
// 	};

// 	const renderTabContent = (tab) => {
// 		const fields = {
// 			profile: [
// 				{ label: "Full Name", name: "name", value: formData.name || user.name },
// 				{ label: "Email", name: "email", value: formData.email || user.email },
// 				{
// 					label: "Phone",
// 					name: "mobile",
// 					value: formData.mobile || user.mobile,
// 				},
// 				{
// 					label: "Date of Birth",
// 					name: "dob",
// 					value: formData.dob || user.dob,
// 					type: "date",
// 				},
// 				{
// 					label: "Gender",
// 					name: "gender",
// 					value: formData.gender || user.gender,
// 					disabled: true,
// 				},
// 			],
// 			taxInfo: [
// 				{ label: "PAN", name: "pan", value: formData.pan || user.pan },
// 				{ label: "GST", name: "gst", value: formData.gst || user.gst },
// 			],
// 			communicationInfo: [
// 				{
// 					label: "Address",
// 					name: "address",
// 					value: formData.address || user.address,
// 				},
// 				{ label: "City", name: "city", value: formData.city || user.city },
// 				{ label: "State", name: "state", value: formData.state || user.state },
// 				{
// 					label: "Country",
// 					name: "country",
// 					value: formData.country || user.country,
// 				},
// 				{
// 					label: "Postal Code",
// 					name: "postalCode",
// 					value: formData.postalcode || user.postalCode,
// 				},
// 			],
// 			employmentInfo: [
// 				{
// 					label: "Nature of Employment",
// 					name: "natureEmployment",
// 					value: formData.natureEmployment || user.natureEmployment,
// 				},
// 				{
// 					label: "Annual Income",
// 					name: "annualIncome",
// 					value: formData.annualIncome || user.annualIncome,
// 				},
// 			],
// 			educationInfo: [
// 				{
// 					label: "Education",
// 					name: "education",
// 					value: formData.education || user.education,
// 				},
// 				{
// 					label: "Institute",
// 					name: "institute",
// 					value: formData.institute || user.institute,
// 				},
// 				{
// 					label: "Certifications",
// 					name: "certifications",
// 					value: formData.certifications || user.certifications,
// 				},
// 				{
// 					label: "Completion Date",
// 					name: "completiondate",
// 					value: formData.completiondate || user.completiondate,
// 					type: "date",
// 				},
// 			],
// 			bankDetails: [
// 				{
// 					label: "Account Number",
// 					name: "accountNumber",
// 					value: user.bankDetails?.accountNumber || "Not provided",
// 					disabled: true,
// 					sensitive: true,
// 				},
// 				{
// 					label: "Account Holder Name",
// 					name: "accountHolderName",
// 					value: user.bankDetails?.accountHolderName || "Not provided",
// 					disabled: true,
// 				},
// 				{
// 					label: "Bank Name",
// 					name: "bankName",
// 					value: user.bankDetails?.bankName || "Not provided",
// 					disabled: true,
// 				},
// 				{
// 					label: "IFSC Code",
// 					name: "ifscCode",
// 					value: user.bankDetails?.ifscCode || "Not provided",
// 					disabled: true,
// 				},
// 				{
// 					label: "Account Type",
// 					name: "accountType",
// 					value: user.bankDetails?.accountType 
// 						? user.bankDetails?.accountType.charAt(0).toUpperCase() + user.bankDetails?.accountType.slice(1)
// 						: "Not provided",
// 					disabled: true,
// 				},
// 			],
// 		};

// 		return (
// 			<div className='tab-content'>
// 				<h3>{tab.replace(/([A-Z])/g, " $1")}</h3>
// 				{tab === 'bankDetails' && (
// 					<div className="bank-info-note">
// 						<p>Bank details are managed in the Wallet section. To update your bank information, please visit the Wallet tab.</p>
// 					</div>
// 				)}
// 				{fields[tab].map((field) => (
// 					<div key={field.name} className='field-row'>
// 						<label htmlFor={field.name}>{field.label}:</label>

// 						{field.type === "date" ? (
// 							<input
// 								id={field.name}
// 								name={field.name}
// 								type='date'
// 								value={field.value ? field.value.split("T")[0] : ""}
// 								onChange={handleInputChange}
// 								className={editableField === field.name ? "editable" : ""}
// 								disabled={field.disabled || editableField !== field.name}
// 							/>
// 						) : (
// 							<input
// 								id={field.name}
// 								name={field.name}
// 								value={field.sensitive ? (field.value?.length > 0 ? field.value.replace(/\d(?=\d{4})/g, "*") : field.value) : field.value}
// 								onChange={handleInputChange}
// 								className={editableField === field.name ? "editable" : ""}
// 								disabled={field.disabled || editableField !== field.name}
// 							/>
// 						)}
// 						{!field.disabled && (
// 							<i
// 								className='fa-solid fa-pen-to-square edit-icon'
// 								onClick={() => handleFieldEdit(field.name)}
// 							/>
// 						)}
// 					</div>
// 				))}
// 			</div>
// 		);
// 	};

// 	const [activeTab, setActiveTab] = useState("profile"); // Track active tab

// 	return (
// 		<div className='profile-container'>
// 			<div className='psidebar'>
// 				<ul>
// 					<li
// 						onClick={() => setActiveTab("profile")}
// 						className={activeTab === "profile" ? "selected" : ""}>
// 						Customer Profile
// 					</li>
// 					<li
// 						onClick={() => setActiveTab("taxInfo")}
// 						className={activeTab === "taxInfo" ? "selected" : ""}>
// 						Tax Info
// 					</li>
// 					<li
// 						onClick={() => setActiveTab("communicationInfo")}
// 						className={activeTab === "communicationInfo" ? "selected" : ""}>
// 						Communication Info
// 					</li>
// 					<li
// 						onClick={() => setActiveTab("employmentInfo")}
// 						className={activeTab === "employmentInfo" ? "selected" : ""}>
// 						Employment Info
// 					</li>
// 					<li
// 						onClick={() => setActiveTab("educationInfo")}
// 						className={activeTab === "educationInfo" ? "selected" : ""}>
// 						Education Info
// 					</li>
// 					<li
// 						onClick={() => setActiveTab("bankDetails")}
// 						className={activeTab === "bankDetails" ? "selected" : ""}>
// 						Bank Details
// 					</li>
// 				</ul>
// 			</div>
// 			<div className='content'>
// 				<div className='profile-header'>
// 					<div className='profile-icon'>{getProfileInitial()}</div>
// 					<h2>{user.name}</h2>
// 				</div>
// 				{renderTabContent(activeTab)}
// 				{activeTab !== "bankDetails" && (
// 					<div className='save-button-container'>
// 						<button className='save-button' onClick={handleSaveProfile}>
// 							Save Profile
// 						</button>
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// };

// export default CProfileSection;



import React, { useState } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import "./customer.css";

const CProfileSection = () => {
	const { user, formData, handleSaveProfile, setFormData } =
		useCustomerAuth();

	const [editableField, setEditableField] = useState("");
	const [activeTab, setActiveTab] = useState("profile");

	// ✅ Certification states
	const [hasCertification, setHasCertification] = useState(
		formData.certifications ? "yes" : "no"
	);
	const [certificateFile, setCertificateFile] = useState(null);

	const handleFieldEdit = (field) => {
		setEditableField(field);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCertificationChange = (value) => {
		setHasCertification(value);

		if (value === "no") {
			setFormData((prev) => ({
				...prev,
				certifications: "",
			}));
			setCertificateFile(null);
		}
	};

	const handleCertificateUpload = (e) => {
		const file = e.target.files[0];
		setCertificateFile(file);

		setFormData((prev) => ({
			...prev,
			certifications: file?.name || "",
		}));
	};

	const getProfileInitial = () => {
		return user?.name ? user.name.charAt(0) : "?";
	};

	const renderTabContent = (tab) => {
		const fields = {
			profile: [
				{ label: "Full Name", name: "name", value: formData.name || user.name },
				{ label: "Email", name: "email", value: formData.email || user.email },
				{ label: "Phone", name: "mobile", value: formData.mobile || user.mobile },
				{
					label: "Date of Birth",
					name: "dob",
					value: formData.dob || user.dob,
					type: "date",
				},
				{
					label: "Gender",
					name: "gender",
					value: formData.gender || user.gender,
					disabled: true,
				},
			],
			taxInfo: [
				{ label: "PAN", name: "pan", value: formData.pan || user.pan },
				{ label: "GST", name: "gst", value: formData.gst || user.gst },
			],
			communicationInfo: [
				{ label: "Address", name: "address", value: formData.address || user.address },
				{ label: "City", name: "city", value: formData.city || user.city },
				{ label: "State", name: "state", value: formData.state || user.state },
				{ label: "Country", name: "country", value: formData.country || user.country },
				{
					label: "Postal Code",
					name: "postalCode",
					value: formData.postalCode || user.postalCode,
				},
			],
			employmentInfo: [
				{
					label: "Nature of Employment",
					name: "natureEmployment",
					value: formData.natureEmployment || user.natureEmployment,
				},
				{
					label: "Annual Income",
					name: "annualIncome",
					value: formData.annualIncome || user.annualIncome,
				},
			],
			educationInfo: [
				{ label: "Education", name: "education", value: formData.education || user.education },
				{ label: "Institute", name: "institute", value: formData.institute || user.institute },
				{
					label: "Completion Date",
					name: "completiondate",
					value: formData.completiondate || user.completiondate,
					type: "date",
				},
			],
			bankDetails: [
				{
					label: "Account Number",
					value: user.bankDetails?.accountNumber || "Not provided",
					disabled: true,
					sensitive: true,
				},
				{
					label: "Account Holder Name",
					value: user.bankDetails?.accountHolderName || "Not provided",
					disabled: true,
				},
				{
					label: "Bank Name",
					value: user.bankDetails?.bankName || "Not provided",
					disabled: true,
				},
				{
					label: "IFSC Code",
					value: user.bankDetails?.ifscCode || "Not provided",
					disabled: true,
				},
			],
		};

		return (
			<div className="tab-content">
				<h3>{tab.replace(/([A-Z])/g, " $1")}</h3>

				{/* ✅ Certification Section */}
				{tab === "educationInfo" && (
					<>
						<div className="field-row">
							<label style={{ fontWeight: '400', fontSize: '15px', color: '#333', marginTop: '10px' ,paddingRight:"10px" }}>
								Do you have certificates?
							</label>
							<div style={{ 
								display: 'flex', 
								gap: '15px',
								marginTop: '12px'
							}}>
								<button
									type="button"
									onClick={() => handleCertificationChange("yes")}
									style={{
										flex: 1,
										padding: '0px 24px',
										border: 'none',
										borderRadius: '10px',
										fontSize: '15px',
										fontWeight: '600',
										cursor: 'pointer',
										transition: 'all 0.3s ease',
										boxShadow: hasCertification === 'yes' 
											? '0 4px 12px rgba(76, 175, 80, 0.3)' 
											: '0 2px 6px rgba(0,0,0,0.1)',
										backgroundColor: hasCertification === 'yes' ? '#4CAF50' : '#f5f5f5',
										color: hasCertification === 'yes' ? '#fff' : '#666',
										transform: hasCertification === 'yes' ? 'scale(1.02)' : 'scale(1)',
									}}
								>
									✓ Yes
								</button>
								<button
									type="button"
									onClick={() => handleCertificationChange("no")}
									style={{
										flex: 1,
										padding: '0px 24px',
										border: 'none',
										borderRadius: '10px',
										fontSize: '15px',
										fontWeight: '600',
										cursor: 'pointer',
										transition: 'all 0.3s ease',
										boxShadow: hasCertification === 'no' 
											? '0 4px 12px rgba(244, 67, 54, 0.3)' 
											: '0 2px 6px rgba(0,0,0,0.1)',
										backgroundColor: hasCertification === 'no' ? '#f44336' : '#f5f5f5',
										color: hasCertification === 'no' ? '#fff' : '#666',
										transform: hasCertification === 'no' ? 'scale(1.02)' : 'scale(1)',
									}}
								>
									✗ No
								</button>
							</div>
						</div>

						{hasCertification === "yes" && (
							<div className="field-row">
								<label>Upload Certificate</label>
								<input
									type="file"
									accept=".pdf,.jpg,.jpeg,.png"
									onChange={handleCertificateUpload}
								/>
								{certificateFile && (
									<small className="file-name">{certificateFile.name}</small>
								)}
							</div>
						)}
					</>
				)}

				{/* ✅ Other Fields */}
				{fields[tab]?.map((field) => (
					<div key={field.name || field.label} className="field-row">
						<label>{field.label}</label>
						<input
							type={field.type || "text"}
							name={field.name}
							value={
								field.sensitive
									? field.value?.replace(/\d(?=\d{4})/g, "*")
									: field.value || ""
							}
							disabled={field.disabled || editableField !== field.name}
							onChange={handleInputChange}
							style={{
								pointerEvents: field.disabled || editableField !== field.name ? "none" : "auto",
								cursor: field.disabled || editableField !== field.name ? "not-allowed" : "text",
							}}
						/>
						{!field.disabled && (
							<i
								className="fa-solid fa-pen-to-square edit-icon"
								onClick={() => handleFieldEdit(field.name)}
							/>
						)}
					</div>
				))}
			</div>
		);
	};

	return (
		<div className="profile-container">
			<div className="psidebar">
				<ul>
					{[
						"profile",
						"taxInfo",
						"communicationInfo",
						"employmentInfo",
						"educationInfo",
						"bankDetails",
					].map((tab) => (
						<li
							key={tab}
							onClick={() => setActiveTab(tab)}
							className={activeTab === tab ? "selected" : ""}
						>
							{tab.replace(/([A-Z])/g, " $1")}
						</li>
					))}
				</ul>
			</div>

			<div className="content2">
				<div className="profile-header">
					<div className="profile-icon">{getProfileInitial()}</div>
					<h2>{user?.name}</h2>
				</div>

				{renderTabContent(activeTab)}

				{activeTab !== "bankDetails" && (
					<div className="save-button-container">
						<button className="save-button" onClick={handleSaveProfile}>
							Save Profile
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default CProfileSection;
