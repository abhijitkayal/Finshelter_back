import React, { useState, useEffect } from "react";
import { useCustomerAuth } from "./CustomerAuthContext";
import QueryModal from "./QueryModal";
import FeedbackModal from "./FeedbackModal";
import ServiceProgress from "./ServiceProgress";
import axios from "axios";

const CServiceStatus = () => {
  const { services, uploadDocuments, loading, user, fetchCustomerDashboard } = useCustomerAuth();
  const [selectedService, setSelectedService] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isDocPreviewModalOpen, setIsDocPreviewModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [files, setFiles] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [orderModelOrders, setOrderModelOrders] = useState([]);
  const [ratings, setRatings] = useState({});

  const [feedbackGiven, setFeedbackGiven] = useState(() => {
    const savedFeedback =
      JSON.parse(localStorage.getItem("feedbackGiven")) || {};
    return savedFeedback;
  });

  // Track submitted feedback for this session
  const [sessionFeedbackSubmitted, setSessionFeedbackSubmitted] = useState({});

  useEffect(() => {
    localStorage.setItem("feedbackGiven", JSON.stringify(feedbackGiven));
  }, [feedbackGiven]);

  // Debug: Log service data to understand structure
  useEffect(() => {
    if (services && services.length > 0) {
      console.log('=== Service Data Debug ===');
      services.forEach((service, index) => {
        console.log(`Service ${index}:`, {
          id: service._id,
          orderId: service.orderId,
          serviceId: service.serviceId, 
          status: service.status,
          feedback: service.feedback,
          serviceName: service.serviceName
        });
      });
    }
    if (orderModelOrders && orderModelOrders.length > 0) {
      console.log('=== Order Data Debug ===');
      orderModelOrders.forEach((order, index) => {
        console.log(`Order ${index}:`, {
          orderId: order.orderId,
          orderStatus: order.orderStatus,
          feedback: order.feedback,
          serviceName: order.serviceName
        });
      });
    }
  }, [services, orderModelOrders]);

  useEffect(() => {
    fetchOrderModelOrders();
  }, []);

  const fetchOrderModelOrders = async () => {
    try {
      const token = localStorage.getItem("customerToken");
      if (!token) return;

      const response = await axios.get(
        "http://localhost:8000/api/payment/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setOrderModelOrders(response.data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders from Order model:", error);
    }
  };

  const getServiceStage = (service) => {
    const stages = [
      "Signup For The Service",
      "Assigned To An Expert",
      "Document Upload",
      "Service Execution",
      "Deliverables Finalized",
    ];

    if (service.status === "completed") {
      return "Deliverables Finalized";
    } else if (service.documents?.length > 0) {
      return "Service Execution";
    } else if (service.employeeId) {
      return "Document Upload";
    } else if (service.activated) {
      return "Assigned To An Expert";
    }
    return "Signup For The Service";
  };

  const openModal = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  const openUploadModal = (service) => {
    const enhancedService = {
      ...service,
      requiredDocuments:
        service.requiredDocuments && service.requiredDocuments.length > 0
          ? service.requiredDocuments
          : [
              {
                name: "Document",
                description: "Upload supporting document",
                required: false,
              },
            ],
    };

    setSelectedService(enhancedService);
    setFiles({});
    setUploadError("");
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setSelectedService(null);
    setFiles({});
    setUploadError("");
    setIsUploadModalOpen(false);
    setUploadProgress(0);
  };

  const openFeedbackModal = (service) => {
    setSelectedService(service);
    setIsFeedbackModalOpen(true);
  };

  const closeFeedbackModal = () => {
    setSelectedService(null);
    setIsFeedbackModalOpen(false);
  };

  const handleFeedbackSubmitted = async (serviceId) => {
    // Mark feedback as submitted for this session
    setSessionFeedbackSubmitted(prev => ({
      ...prev,
      [serviceId]: true
    }));
    
    // Also update the persistent storage
    const updatedFeedbackGiven = {
      ...feedbackGiven,
      [serviceId]: true
    };
    setFeedbackGiven(updatedFeedbackGiven);
    localStorage.setItem("feedbackGiven", JSON.stringify(updatedFeedbackGiven));
    
    // Refresh the services data from context
    try {
      await fetchCustomerDashboard();
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
    }
  };

  const openDocPreviewModal = (documents) => {
    setSelectedDocuments(documents);
    setIsDocPreviewModalOpen(true);
  };

  const closeDocPreviewModal = () => {
    setSelectedDocuments([]);
    setIsDocPreviewModalOpen(false);
  };

  const handleRating = async (serviceId, ratingValue) => {
    try {
      const token = localStorage.getItem("customerToken");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      // Call backend API to save rating
      const response = await axios.post(
        `http://localhost:8000/api/payment/order/${serviceId}/rating`,
        { rating: ratingValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        console.log("Rating saved successfully:", response.data);
        
        // Update local state
        setRatings((prev) => ({
          ...prev,
          [serviceId]: ratingValue,
        }));

        // Refresh orders to show updated rating
        fetchOrderModelOrders();
      }
    } catch (error) {
      console.error("Failed to submit rating", error);
      alert("Failed to save rating. Please try again.");
    }
  };

  const StarRating = ({ serviceId, existingRating }) => {
    const rating = ratings[serviceId] || existingRating;
    const hasRating = rating !== null && rating !== undefined && rating !== 0;

    // ⭐ If rating exists → show static stars (non-clickable)
    if (hasRating) {
      return (
        <div style={{ color: "gold", fontWeight: "bold", userSelect: "none" }}>
          {"★".repeat(rating)}
          {"☆".repeat(5 - rating)}
          <div style={{ fontSize: "10px", color: "#666", marginTop: "2px" }}>
            Already rated
          </div>
        </div>
      );
    }

    // ⭐ Else → show clickable stars
    return (
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRating(serviceId, star)}
            style={{
              cursor: "pointer",
              fontSize: "18px",
              color: "gold",
              marginRight: "3px",
            }}
          >
            ★
          </span>
        ))}
        <div style={{ fontSize: "10px", color: "#999", marginTop: "2px" }}>
          Click to rate
        </div>
      </div>
    );
  };

  const handleFileChange = (docName, e) => {
    const file = e.target.files[0];
    setFiles((prev) => ({
      ...prev,
      [docName]: file,
    }));
  };

  const handleUpload = async () => {
    if (!selectedService) {
      setUploadError("No service selected.");
      return;
    }

    if (!selectedService.requiredDocuments?.length) {
      setUploadError("No required documents specified for this service.");
      return;
    }

    const requiredDocs = selectedService.requiredDocuments.filter(
      (doc) => doc.required
    );
    const missingDocs = requiredDocs.filter((doc) => !files[doc.name]);

    if (missingDocs.length > 0) {
      setUploadError(
        `Please upload required documents: ${missingDocs
          .map((d) => d.name)
          .join(", ")}`
      );
      return;
    }

    try {
      const serviceId = selectedService.serviceId || selectedService._id;
      await uploadDocuments(serviceId, files);
      closeUploadModal();
    } catch (error) {
      setUploadError(
        error.message || "Failed to upload documents. Please try again."
      );
    }
  };

  const formatCurrency = (amount) => {
    console.log("Formatting currency:", amount, typeof amount);

    // If amount is undefined or null, return N/A
    if (amount === undefined || amount === null) return "N/A";

    // Convert to number if it's a string
    let numericAmount;
    if (typeof amount === "string") {
      numericAmount = parseFloat(amount);
    } else {
      numericAmount = amount;
    }

    // Check if it's a valid number after conversion
    if (isNaN(numericAmount)) {
      console.warn("Invalid amount for formatting:", amount);
      return "₹0.00";
    }

    // Format with Indian Rupee symbol and 2 decimal places
    return `₹${numericAmount.toFixed(2)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
  };

  const handleFeedbackSubmit = (serviceId) => {
    setFeedbackGiven((prev) => ({
      ...prev,
      [serviceId]: true,
    }));
  };

  if (loading) return <p>Loading...</p>;

  const stages = [
    "Signup For The Service",
    "Assigned To An Expert",
    "Document Upload",
    "Service Execution",
    "Deliverables Finalized",
  ];

  const [selectedServiceName, setSelectedServiceName] = useState("");
  useEffect(() => {
    if (services && services.length > 0) {
      console.log("Services loaded:", services);
      // Log tax information for debugging
      services.forEach((service) => {
        console.log(
          `Service ${service.serviceName || service._id} tax details:`,
          {
            igst: service.igst,
            cgst: service.cgst,
            sgst: service.sgst,
            discount: service.discount,
            paymentAmount: service.paymentAmount,
            price: service.price,
            totalTax:
              (service.igst || 0) + (service.cgst || 0) + (service.sgst || 0),
            totalValue:
              service.price +
              (service.igst || 0) +
              (service.cgst || 0) +
              (service.sgst || 0),
          }
        );
      });
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

  return (
    <div className="tax-dashboard-section">
      <div className="service-status">
        <div className="tax-services-wrap-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Service Name</th>
                <th>Package</th>
                <th>Discounts</th>
                <th>IGST Amount</th>
                <th>CGST Amount</th>
                <th>SGST Amount</th>
                <th>Total Order Value</th>
                <th>Order Status</th>
                <th>Completion Date</th>
                <th>Managed By</th>
                <th>Due Date</th>
                <th>Feedback</th>
                <th>Rating</th>
                <th>Payment Status</th>
                {/* <th>Actions</th> */}
                <th>Uploaded Documents</th>
              </tr>
            </thead>
            <tbody>
              {/* Display orders from Order model first, but filter out duplicates that exist in services */}
              {orderModelOrders
                .filter((order) => {
                  // Only show orders that don't already exist in services array
                  const existsInServices = services.some(
                    (service) => service.orderId === order.orderId
                  );
                  return !existsInServices;
                })
                .map((order, index) => (
                  <tr key={`order-${order._id || index}`}>
                    <td>{order.orderId || order.razorpayOrderId || "N/A"}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>{order.serviceName || "N/A"}</td>
                    <td>
                      {order.packageName ? (
                        <div>
                          <strong>{order.packageName}</strong>
                          {order.servicePrice && (
                            <div>₹{order.servicePrice}</div>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: "#666", fontStyle: "italic" }}>
                          No package
                        </span>
                      )}
                    </td>
                    <td>{formatCurrency(order.discountAmount || 0)}</td>
                    <td>{formatCurrency(order.igstAmount || 0)}</td>
                    <td>{formatCurrency(order.cgstAmount || 0)}</td>
                    <td>{formatCurrency(order.sgstAmount || 0)}</td>
                    <td>{formatCurrency(order.totalAmount || 0)}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: "bold",
                          color:
                            order.orderStatus === "Completed"
                              ? "green"
                              : order.orderStatus === "In Process"
                              ? "blue"
                              : "orange",
                        }}
                      >
                        {order.orderStatus || "Pending"}
                      </span>
                    </td>
                    <td>
                      {formatDate(
                        order.actualCompletionDate ||
                          order.expectedCompletionDate
                      )}
                    </td>
                    <td>
                      {order.employeeName ? (
                        <span>{order.employeeName}</span>
                      ) : (
                        <span style={{ color: "#666", fontStyle: "italic" }}>
                          Not assigned
                        </span>
                      )}
                    </td>
                    <td>{formatDate(order.dueDate)}</td>
                    <td>
                      {order.feedback ? (
                        <div
                          style={{
                            maxWidth: "150px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {order.feedback}
                        </div>
                      ) : (
                        <span style={{ color: "#666", fontStyle: "italic" }}>
                          No feedback given
                        </span>
                      )}
                    </td>
                    {/* <td>
                    {order.rating ? (
                      <span>⭐ {order.rating}/5</span>
                    ) : (
                      <span style={{ color: "#666", fontStyle: "italic" }}>
                        -
                      </span>
                    )}
                  </td> */}

                    <td>
                      <StarRating
                        serviceId={order.orderId}
                        existingRating={order.rating}
                      />
                    </td>

                    <td>
                      <span
                        style={{
                          fontWeight: "bold",
                          color:
                            order.paymentStatus === "Paid"
                              ? "green"
                              : order.paymentStatus === "Pending"
                              ? "orange"
                              : "red",
                        }}
                      >
                        {order.paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: "#888", fontStyle: "italic" }}>
                        From Payment System
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {/* Feedback button for orders - show prominently */}
                        {!order.feedback &&
                         !sessionFeedbackSubmitted[order.orderId] &&
                         !feedbackGiven[order.orderId] && (
                          <button
                            className="tax-service-btn"
                            onClick={() => {
                              console.log('Opening feedback modal for order:', order);
                              openFeedbackModal(order);
                            }}
                            style={{ 
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              fontWeight: 'bold',
                              borderRadius: '4px',
                              border: 'none',
                              padding: '8px 12px'
                            }}
                          >
                            ⭐ Give Feedback
                          </button>
                        )}

                        {/* Upload documents button */}
                        <button
                          className="tax-service-btn"
                          onClick={() => openUploadModal(order)}
                          style={{ 
                            backgroundColor: '#2196F3',
                            color: 'white'
                          }}
                        >
                          Upload Documents
                        </button>

                        {/* Show feedback given status for orders */}
                        {(order.feedback ||
                          sessionFeedbackSubmitted[order.orderId] ||
                          feedbackGiven[order.orderId]) && (
                          <span 
                            className="tax-service-btn" 
                            style={{ 
                              backgroundColor: "#4CAF50", 
                              color: "white", 
                              cursor: "default",
                              opacity: "0.8",
                              textAlign: 'center'
                            }}
                          >
                            ✓ Feedback Given
                          </span>
                        )}

                        {/* Show document status */}
                        {order.documents && order.documents.length > 0 && (
                          <button
                            className="tax-service-btn"
                            onClick={() => openDocPreviewModal(order.documents)}
                            style={{ padding: "2px 8px", fontSize: "12px" }}
                          >
                            View Docs ({order.documents.length})
                          </button>
                        )}
                        
                        {/* Debug info for orders */}
                        {process.env.NODE_ENV === 'development' && (
                          <div style={{ fontSize: '10px', color: '#666' }}>
                            Order: {order.orderId}<br/>
                            Status: {order.orderStatus}<br/>
                            Feedback: {order.feedback ? 'yes' : 'no'}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

              {/* Display existing services */}
              {services.length > 0 ? (
                services.map((service, index) => (
                  <React.Fragment key={`service-${index}`}>
                    <tr>
                      <td>{service.orderId || service._id || "N/A"}</td>
                      <td>{formatDate(service.purchasedAt)}</td>
                      <td>{service.serviceName || service.name}</td>
                      <td>
                        {service.packageName ? (
                          <div>
                            <strong>{service.packageName}</strong>
                            {service.price && <div>₹{service.price}</div>}
                          </div>
                        ) : (
                          <span style={{ color: "#666", fontStyle: "italic" }}>
                            No package
                          </span>
                        )}
                      </td>
                      <td>{formatCurrency(service.discount || 0)}</td>
                      <td>{formatCurrency(service.igst || 0)}</td>
                      <td>{formatCurrency(service.cgst || 0)}</td>
                      <td>{formatCurrency(service.sgst || 0)}</td>
                      <td>
                        {formatCurrency(
                          service.paymentAmount || service.price || 0
                        )}
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              service.status === "completed"
                                ? "green"
                                : service.status === "In Process"
                                ? "blue"
                                : "orange",
                          }}
                        >
                          {service.status || "Pending"}
                        </span>
                      </td>
                      <td>{formatDate(service.completionDate)}</td>
                      <td>
                        {service.employeeId ? (
                          <span>{service.employeeName || "Assigned"}</span>
                        ) : (
                          <span style={{ color: "#666", fontStyle: "italic" }}>
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td>{formatDate(service.dueDate)}</td>
                      <td>
                        {service.feedback && service.feedback.length > 0 ? (
                          <div
                            style={{
                              maxWidth: "150px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}
                            title={service.feedback[0].feedback} // Show full text on hover
                          >
                            <span style={{ color: "#4CAF50", fontWeight: "bold" }}>✓ </span>
                            {service.feedback[0].feedback}
                          </div>
                        ) : (
                          <span style={{ color: "#666", fontStyle: "italic" }}>
                            No feedback given
                          </span>
                        )}
                      </td>
                      {/* <td>
                        {service.hasRating ? (
                          <div style={{ color: "gold", fontWeight: "bold" }}>
                            {service.rating}{" "}
                            <span style={{ color: "gold" }}>★</span>
                          </div>
                        ) : (
                          <span style={{ color: "#666", fontStyle: "italic" }}>
                            Not rated
                          </span>
                        )}
                      </td> */}
                      <td>
                        <StarRating
                          serviceId={service.orderId || service._id}
                          existingRating={service.rating}
                        />
                      </td>

                      <td>
                        <span
                          style={{
                            fontWeight: "bold",
                            color:
                              service.paymentAmount > 0 ? "green" : "orange",
                          }}
                        >
                          {service.paymentAmount > 0 ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="tax-btn-cont">
                        {/* <button
                          className="tax-service-btn"
                          onClick={() => openModal(service)}
                        >
                          Query
                        </button> */}

                        {/* Feedback button - always show for testing, then make conditional */}
                        {(!service.feedback || service.feedback.length === 0) &&
                         !sessionFeedbackSubmitted[service.serviceId || service.orderId] &&
                         !feedbackGiven[service.serviceId || service.orderId] && (
                          <button
                            className="tax-service-btn"
                            onClick={() => {
                              console.log('Opening feedback modal for service:', service);
                              openFeedbackModal(service);
                            }}
                            style={{ 
                              marginBottom: '8px',
                              backgroundColor: '#4CAF50',
                              color: 'white',
                              fontWeight: 'bold',
                              borderRadius: '4px',
                              border: 'none',
                              padding: '8px 12px'
                            }}
                          >
                            ⭐ Give Feedback
                          </button>
                        )}

                        {/* Upload documents button */}
                        <button
                          className="tax-service-btn"
                          onClick={() => openUploadModal(service)}
                          style={{ 
                            marginBottom: '4px',
                            backgroundColor: '#2196F3',
                            color: 'white'
                          }}
                        >
                          Upload Documents
                        </button>

                        {/* Show feedback given message */}
                        {((service.feedback && service.feedback.length > 0) ||
                        sessionFeedbackSubmitted[service.serviceId || service.orderId] ||
                        feedbackGiven[service.serviceId || service.orderId]) && (
                          <span 
                            className="tax-service-btn" 
                            style={{ 
                              backgroundColor: "#4CAF50", 
                              color: "white", 
                              cursor: "default",
                              opacity: "0.8",
                              marginBottom: '4px',
                              display: 'inline-block'
                            }}
                          >
                            ✓ Feedback Given
                          </span>
                        )}

                        {/* Debug info */}
                        {process.env.NODE_ENV === 'development' && (
                          <div style={{ fontSize: '10px', color: '#666', marginTop: '4px' }}>
                            Status: {service.status} | ID: {service.serviceId || service.orderId}
                          </div>
                        )}
                      </td>
                    </tr>
                    <tr style={{ display: "none" }}>
                      <td>
                        {/* Always show Upload button */}
                        <button
                          className="tax-service-btn"
                          onClick={() => openUploadModal(service)}
                          style={{ marginBottom: "6px" }}
                        >
                          Upload Documents
                        </button>

                        {/* Documents status */}
                        {service.documents && service.documents.length > 0 ? (
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span>{service.documents.length} document(s)</span>
                            <button
                              className="tax-service-btn"
                              onClick={() =>
                                openDocPreviewModal(service.documents)
                              }
                              style={{ padding: "2px 8px", fontSize: "12px" }}
                            >
                              View
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "#999", fontStyle: "italic" }}>
                            No data found
                          </span>
                        )}
                      </td>
                    </tr>
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="18" className="text-center">
                    No services found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Use 'open' prop for MUI Dialog components */}
      {selectedService && (
        <>
          <QueryModal
            service={selectedService}
            onClose={closeModal}
            open={isModalOpen}
          />

          <FeedbackModal
            service={selectedService}
            onClose={closeFeedbackModal}
            open={isFeedbackModalOpen}
            onFeedbackSubmitted={handleFeedbackSubmitted}
          />
        </>
      )}

      {isUploadModalOpen && selectedService && (
        <div className="cquerymodalwrap">
          <div className="cquerymodal">
            <h2>Upload Documents for {selectedService.serviceName}</h2>

            {selectedService.requiredDocuments?.length > 0 ? (
              selectedService.requiredDocuments.map((doc, index) => (
                <div key={index} className="document-upload-item">
                  {/* <label> */}
                  <div>
                    <h5>
                      {doc.name} {doc.required && "*"}
                    </h5>
                    <br />
                    <p>{doc.description}</p>
                  </div>
                  {/* </label> */}
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(doc.name, e)}
                    accept="image/*,application/pdf"
                  />
                </div>
              ))
            ) : (
              <p>No required documents specified for this service.</p>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress">
                <div
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                />
                <span>{uploadProgress}%</span>
              </div>
            )}

            {uploadError && <p className="error">{uploadError}</p>}

            <div className="btnqcont">
              <button
                className="cquerysubmit"
                onClick={handleUpload}
                disabled={!selectedService.requiredDocuments?.length}
              >
                Upload
              </button>
              <button className="cqueryclose" onClick={closeUploadModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {isDocPreviewModalOpen && (
        <div className="cquerymodalwrap">
          <div className="cquerymodal">
            <h2>Uploaded Documents</h2>

            {selectedDocuments.length > 0 ? (
              <div className="document-list">
                {selectedDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="document-item"
                    style={{
                      margin: "10px 0",
                      padding: "10px",
                      border: "1px solid #eee",
                      borderRadius: "4px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>
                        {doc.originalName}
                      </span>
                      <small>
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </small>
                    </div>
                    <div
                      style={{ display: "flex", gap: "10px", marginTop: "8px" }}
                    >
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        Size: {Math.round(doc.size / 1024)} KB
                      </span>
                      <span style={{ fontSize: "12px", color: "#666" }}>
                        Type: {doc.mimetype}
                      </span>
                    </div>
                    {doc.path && (
                      <a
                        href={`https://195-35-45-82.sslip.io:8000${doc.path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-block",
                          marginTop: "8px",
                          padding: "4px 12px",
                          background: "#1b321d",
                          color: "white",
                          borderRadius: "4px",
                          textDecoration: "none",
                          fontSize: "12px",
                        }}
                      >
                        View Document
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No documents available.</p>
            )}

            <div className="btnqcont">
              <button className="cqueryclose" onClick={closeDocPreviewModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CServiceStatus;
