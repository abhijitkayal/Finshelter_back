import React from 'react'
import { useEffect } from 'react'

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-container">
      <div className="policy-header">
        <h1>Refund Policy</h1>
        <div className="policy-underline"></div>
      </div>
      
      <div className="policy-content">
        <div className="policy-section">
          <p>
            At FinShelter, we prioritize delivering top-notch services to our valued customers. We are aware that sometimes unexpected situations might necessitate a refund request. To provide you with a transparent understanding of our refund process, we have outlined our refund policy below.
          </p>
          
          <h3>Conditions for Eligibility:</h3>
          
          <p>
            Refunds are only applicable to customers who have engaged with our paid services within the last 30 days. We understand that the need for a refund might arise for a variety of reasons, and we have defined two specific conditions in which we offer refunds:
          </p>
          
          <h3>1. Government Deadline Compliance:</h3>
          
          <p>
            In the case of the FinShelter team not meeting the specified completion date set by the Government of India, you are eligible for a full refund. We understand the importance of adhering to government-regulated timelines, and if we fail in this regard, we are committed to reimbursing your payment.
          </p>
          
          <p>
            At FinShelter, we take customer satisfaction seriously and aim to offer the utmost transparency and convenience regarding our refund policy. If you find yourself in a situation where a refund is warranted and meet the eligibility criteria defined above, please don't hesitate to contact us. We are here to assist you promptly and ensure your financial well-being.
          </p>
          
          <h3>2. Refund Process:</h3>
          
          <p>
            At FinShelter, we understand that there might be situations where a customer needs to request a refund for our services. Initiating a refund is a straightforward process aimed at ensuring your satisfaction with our services. To request a refund, please reach out to our dedicated customer support team within 30 days of your service purchase. Our support team is here to assist you in this process. When contacting us, kindly provide one of the reasons mentioned in Point 2 of our refund policy. Furthermore, any additional relevant information about the issue you've encountered is greatly appreciated.
          </p>
          
          <p>
            Once we receive your request, our customer support team will promptly review it with the utmost care and consideration. Your satisfaction is our priority, and we will determine if a refund is appropriate based on the details you provide.
          </p>
          
          <h3>3. Refund Timeline:</h3>
          
          <p>
            Once we have reviewed your refund request and it has been approved, you can expect a smooth and efficient refund process. We are committed to making your refund experience as hassle-free as possible. The refund will be processed within 14 business days from the approval date. We will issue the refund using the same payment method you used for your initial service purchase. We aim to ensure you receive your refund promptly and securely.
          </p>
          
          <p>
            We value your trust and aim to provide exceptional service at all times. However, please note that we reserve the right to decline a refund request if we have reason to believe it is fraudulent or if the customer is in breach of our terms and conditions.
          </p>
          
          <p>
            Please keep in mind that our refund policy is subject to change, and any updates will be applied without prior notice. If you have any questions or require further clarification about our refund policy, please don't hesitate to contact our friendly customer support team. Your satisfaction is our priority, and we are here to assist you in any way we can.
          </p>
        </div>
      </div>

      <style jsx>{`
        .policy-container {
          max-width: 1200px;
          margin: 120px auto 80px auto; /* Increased top margin to prevent header overlap */
          padding: 0 20px 80px 20px;
          font-family: Arial, sans-serif;
          color: var(--tertiary);
          min-height: 70vh;
        }
        
        .policy-header {
          text-align: center;
          margin-bottom: 50px;
        }
        
        .policy-header h1 {
          font-size: 2.5rem;
          color: var(--primary);
          margin-bottom: 15px;
        }
        
        .policy-underline {
          height: 4px;
          width: 80px;
          background-color: var(--accent);
          margin: 0 auto;
        }
        
        .policy-content {
          background-color: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .policy-section {
          margin-bottom: 30px;
        }
        
        .policy-section h3 {
          color: var(--primary);
          font-size: 1.5rem;
          margin-top: 30px;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--background);
        }
        
        .policy-section p {
          line-height: 1.6;
          color: #555;
          margin-bottom: 20px;
        }
        
        @media (max-width: 768px) {
          .policy-container {
            padding: 0 15px 60px 15px;
            margin: 100px auto 60px auto; /* Adjusted for mobile */
          }
          
          .policy-header h1 {
            font-size: 2rem;
          }
          
          .policy-content {
            padding: 25px;
          }
          
          .policy-section h3 {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </div>
  )
}

export default RefundPolicy