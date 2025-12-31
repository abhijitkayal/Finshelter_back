import React, { useContext, useState, useEffect } from "react";
import { EmployeeContext } from "./EmployeeContext";

const EmProfile = () => {
	const {
		user,
		formData,
		handleFieldUpdate,
		handleSaveProfile,
		loading,
		employeeInfo,
	} = useContext(EmployeeContext);

	const [editableTab, setEditableTab] = useState("");
	const [activeTab, setActiveTab] = useState("Profile");
	const [localFormData, setLocalFormData] = useState({});

	useEffect(() => {
		if (employeeInfo) {
			// Initialize local form data with employee info
			setLocalFormData({
				...employeeInfo,
				// Convert date fields to proper format
				dob: employeeInfo.dob
					? new Date(employeeInfo.dob).toISOString().split("T")[0]
					: "",
				dateOfJoining: employeeInfo.dateOfJoining
					? new Date(employeeInfo.dateOfJoining).toISOString().split("T")[0]
					: "",
				currentOrgRelieveDate: employeeInfo.currentOrgRelieveDate
					? new Date(employeeInfo.currentOrgRelieveDate)
							.toISOString()
							.split("T")[0]
					: "",
				previousOrgFromDate: employeeInfo.previousOrgFromDate
					? new Date(employeeInfo.previousOrgFromDate)
							.toISOString()
							.split("T")[0]
					: "",
				previousOrgToDate: employeeInfo.previousOrgToDate
					? new Date(employeeInfo.previousOrgToDate).toISOString().split("T")[0]
					: "",
				passingMonthYear: employeeInfo.passingMonthYear
					? new Date(employeeInfo.passingMonthYear).toISOString().split("T")[0]
					: "",
			});
		}
	}, [employeeInfo]);

	const handleTabEdit = (tab) => {
		setEditableTab(tab === editableTab ? "" : tab);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		// Don't allow editing of employee code
		if (name === "_id") {
			return;
		}
		setLocalFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		handleFieldUpdate(name, value);
	};

	const getProfileInitial = () => {
		return localFormData?.name ? localFormData.name.charAt(0) : "?";
	};

	const renderTabContent = (tab) => {
		const fields = {
			Profile: [
				{ label: "Employee Code", name: "_id", value: localFormData._id },
				{ label: "Full Name", name: "fullName", value: localFormData.fullName || localFormData.name },
				{ label: "Email", name: "email", value: localFormData.email },
				{
					label: "Phone Number",
					name: "phoneNumber",
					value: localFormData.phoneNumber,
				},
				{
					label: "Date Of Birth",
					name: "dob",
					value: localFormData.dob,
					type: "date",
				},
				{ label: "Gender", name: "gender", value: localFormData.gender },
				{
					label: "Date Of Joining",
					name: "dateOfJoining",
					value: localFormData.dateOfJoining,
					type: "date",
				},
				{
					label: "Designation",
					name: "designation",
					value: localFormData.designation,
				},
			],
			TaxInfo: [
				{ label: "PAN", name: "pan", value: localFormData.pan },
				{ label: "GSTIN", name: "gst", value: localFormData.gst },
				{ label: "TAN", name: "tan", value: localFormData.tan },
			],
			CommunicationInfo: [
				{
					label: "Full Address",
					name: "fulladdress",
					value: localFormData.fulladdress,
				},
				{ label: "City", name: "city", value: localFormData.city },
				{ label: "State", name: "state", value: localFormData.state },
				{ label: "Country", name: "country", value: localFormData.country },
				{
					label: "Postal Code",
					name: "postalCode",
					value: localFormData.postalCode,
				},
			],
			ProfessionalInfo: [
				{
					label: "Position Code",
					name: "positionCode",
					value: localFormData.positionCode,
				},
				{
					label: "Department Code",
					name: "departmentCode",
					value: localFormData.departmentCode,
				},
				{
					label: "Department Name",
					name: "departmentName",
					value: localFormData.departmentName,
				},
			],
			EmploymentInfo: [
				{
					label: "Previous Organization",
					name: "previousOrganization",
					value: localFormData.previousOrganization,
				},
				{
					label: "From Date",
					name: "previousOrgFromDate",
					value: localFormData.previousOrgFromDate,
					type: "date",
				},
				{
					label: "To Date",
					name: "previousOrgToDate",
					value: localFormData.previousOrgToDate,
					type: "date",
				},
				{
					label: "Total Experience",
					name: "totalExperience",
					value: localFormData.totalExperience,
				},
			],
			EducationInfo: [
				{
					label: "Education Qualification",
					name: "educationQualification",
					value: localFormData.educationQualification,
				},
				{
					label: "University",
					name: "university",
					value: localFormData.university,
				},
				{
					label: "Month & Year of Passing",
					name: "passingMonthYear",
					value: localFormData.passingMonthYear,
					type: "date",
				},
				{
					label: "Certifications",
					name: "certifications",
					value: localFormData.certifications,
				},
				{
					label: "Institute",
					name: "institute",
					value: localFormData.institute,
				},
			],
			BankDetails: [
				{
					label: "Bank Account Number",
					name: "bankAccountNumber",
					value: localFormData.bankAccountNumber,
				},
				{
					label: "Account Holder Name",
					name: "accountHolderName",
					value: localFormData.accountHolderName,
				},
				{
					label: "Bank Name",
					name: "bankName",
					value: localFormData.bankName,
				},
				{
					label: "IFSC Code",
					name: "ifscCode",
					value: localFormData.ifscCode,
				},
				{
					label: "Account Type",
					name: "accountType",
					value: localFormData.accountType,
				},
			],
		};

		return (
			<div className='tab-content'>
				<div className='tab-header'>
					<h3>{tab.replace(/([A-Z])/g, " $1").trim()}</h3>
					<button 
						className={`edit-tab-btn ${editableTab === tab ? 'editing' : ''}`}
						onClick={() => handleTabEdit(tab)}
					>
						<i className='fa-solid fa-pen-to-square'></i>
						{editableTab === tab ? 'Cancel Edit' : 'Edit Section'}
					</button>
				</div>
				{fields[tab].map((field) => (
					<div key={field.name} className='field-row'>
						<label htmlFor={field.name}>{field.label}:</label>
						{field.type === "date" ? (
							<input
								id={field.name}
								name={field.name}
								type='date'
								value={field.value || ""}
								onChange={handleInputChange}
								className={editableTab === tab && field.name !== "_id" ? "editable" : ""}
								disabled={editableTab !== tab || field.name === "_id"}
							/>
						) : (
							<input
								id={field.name}
								name={field.name}
								value={field.value || ""}
								onChange={handleInputChange}
								className={editableTab === tab && field.name !== "_id" ? "editable" : ""}
								disabled={editableTab !== tab || field.name === "_id"}
								style={field.name === "_id" ? {backgroundColor: "#f5f5f5", cursor: "not-allowed"} : {}}
							/>
						)}
					</div>
				))}
				{editableTab === tab && (
					<div className='section-save-container'>
						<button
							className='save-section-button'
							onClick={async () => {
								const success = await handleSaveProfile();
								if (success) {
									setEditableTab("");
									// Update localFormData with the saved data from employeeInfo
									if (employeeInfo) {
										setLocalFormData({
											...employeeInfo,
											// Convert date fields to proper format
											dob: employeeInfo.dob
												? new Date(employeeInfo.dob).toISOString().split("T")[0]
												: "",
											dateOfJoining: employeeInfo.dateOfJoining
												? new Date(employeeInfo.dateOfJoining).toISOString().split("T")[0]
												: "",
											currentOrgRelieveDate: employeeInfo.currentOrgRelieveDate
												? new Date(employeeInfo.currentOrgRelieveDate)
														.toISOString()
														.split("T")[0]
												: "",
											previousOrgFromDate: employeeInfo.previousOrgFromDate
												? new Date(employeeInfo.previousOrgFromDate)
														.toISOString()
														.split("T")[0]
												: "",
											previousOrgToDate: employeeInfo.previousOrgToDate
												? new Date(employeeInfo.previousOrgToDate).toISOString().split("T")[0]
												: "",
											passingMonthYear: employeeInfo.passingMonthYear
												? new Date(employeeInfo.passingMonthYear).toISOString().split("T")[0]
												: "",
										});
									}
								}
							}}
							disabled={loading}
						>
							{loading ? "Saving..." : "Save Changes"}
						</button>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className='profile-container'>
			<div className='psidebar'>
				<ul>
					<li
						onClick={() => setActiveTab("Profile")}
						className={activeTab === "Profile" ? "selected" : ""}>
						Basic Profile
					</li>
					<li
						onClick={() => setActiveTab("TaxInfo")}
						className={activeTab === "TaxInfo" ? "selected" : ""}>
						Tax Info
					</li>
					<li
						onClick={() => setActiveTab("CommunicationInfo")}
						className={activeTab === "CommunicationInfo" ? "selected" : ""}>
						Communication Info
					</li>
					<li
						onClick={() => setActiveTab("ProfessionalInfo")}
						className={activeTab === "ProfessionalInfo" ? "selected" : ""}>
						Professional Information
					</li>
					<li
						onClick={() => setActiveTab("EmploymentInfo")}
						className={activeTab === "EmploymentInfo" ? "selected" : ""}>
						Employment Info
					</li>
					<li
						onClick={() => setActiveTab("EducationInfo")}
						className={activeTab === "EducationInfo" ? "selected" : ""}>
						Education Info
					</li>
					<li
						onClick={() => setActiveTab("BankDetails")}
						className={activeTab === "BankDetails" ? "selected" : ""}>
						Bank Details
					</li>
				</ul>
			</div>
			<div className='content'>
				<div className='profile-header'>
					<div className='profile-icon'>{getProfileInitial()}</div>
					<h2>{localFormData?.name}</h2>
				</div>
				{renderTabContent(activeTab)}
			</div>
		</div>
	);
};

export default EmProfile;
