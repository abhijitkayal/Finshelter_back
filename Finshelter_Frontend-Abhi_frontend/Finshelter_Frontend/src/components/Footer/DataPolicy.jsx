import React from 'react'
import { useEffect } from 'react'

const DataPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-container">
      <div className="policy-header">
        <h1>Privacy Policy</h1>
        <div className="policy-underline"></div>
      </div>
      
      <div className="policy-content">
        <div className="policy-section">
          <p>
            This privacy policy ("Policy") relates to the manner FinShelter ("we", "us", "our") in
            which we use, handle, and process the data that you provide us in connection with using the products or
            services we offer. By using this website or by availing goods or services offered by us, you agree to the
            terms and conditions of this Policy and consent to our use, storage, disclosure, and transfer of your
            information or data in the manner described in this Policy.
          </p>
          
          <p>
            We are committed to ensuring that your privacy is protected by applicable laws and
            regulations. We urge you to acquaint yourself with this Policy to familiarize yourself with the manner in
            which your data is being handled by us.
            FinShelter may change this Policy periodically and we urge you to check this page for the latest version of the Policy to keep yourself updated.
          </p>
          
          <h3>What data is being collected</h3>
          
          <p>
            We may collect the following information from you:
          </p>
          
          <ul className="privacy-list">
            <li>Name</li>
            <li>Contact information including address and email address</li>
            <li>Demographic information or, preferences or interests</li>
            <li>Personal Data or Other information relevant/ required for providing the goods or services to you</li>
            <li>The meaning of Personal Data will be as defined under relevant Indian laws</li>
          </ul>
          
          <p>
            Note: Notwithstanding anything under this Policy as required under applicable Indian laws, we will not
            be storing any credit card, debit card, or any other similar card data of yours. Please also note that all data
            or information collected from you will be strictly in accordance with applicable laws and guidelines.
          </p>
          
          <h3>What we do with the data we gather</h3>
          
          <p>
            We require this data to provide you with the goods or services offered by us including but not limited, to
            the below set-out purposes:
          </p>
          
          <ul className="privacy-list">
            <li>Internal record keeping.</li>
            <li>For improving our products or services.</li>
            <li>For providing updates to you regarding our products or services including any special offers.</li>
            <li>To communicate information to you</li>
            <li>For internal training and quality assurance purposes</li>
          </ul>
          
          <h3>Who do we share your data with</h3>
          
          <p>
            We may share your information or data with:
          </p>
          
          <ul className="privacy-list">
            <li>Third parties including our service providers in order to facilitate the provisions of goods or services to you, carry out your requests, respond to your queries, fulfill your orders, or for other operational and business reasons.</li>
            <li>With our group companies (to the extent relevant)</li>
            <li>Our auditors or advisors to the extent required by them for performing their services to Governmental bodies, regulatory authorities, and law enforcement authorities pursuant to our legal obligations or compliance requirements.</li>
          </ul>
          
          <h3>How we use cookies</h3>
          
          <p>
            We use "cookies" to collect information and to better understand customer behavior. You can instruct
            your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not
            accept cookies, you may not be able to avail our goods or services to the full extent. We do not control
            the use of cookies by third parties. The third-party service providers have their privacy policies
            addressing how they use such information.
          </p>
          
          <h3>Your rights relating to your data</h3>
          
          <p>
            Right to Review – You can review the data provided by you and can request us to correct or amend such
            data (to the extent feasible, as determined by us). That said, we will not be responsible for the
            authenticity of the data or information provided by you.
          </p>
          
          <p>
            Withdrawal of your Consent – You can choose not to provide your data, at any time while availing our
            goods or services or otherwise withdraw your consent provided to us earlier, in writing to our email ID:
            Info@thefinshelter.com In the event you choose to not provide or later withdraw your consent, we
            may not be able to provide you with our services or goods. Please note that these rights are subject to our
            compliance with applicable laws.
          </p>
          
          <h3>How long will we retain your information or data?</h3>
          
          <p>
            We may retain your information or data (i) for as long as we are providing goods and services to you;
            and (ii) as permitted under applicable law, we may also retain your data or information even after you
            terminate the business relationship with us. However, we will process such information or data in
            accordance with applicable laws and this Policy.
          </p>
          
          <h3>Data Security</h3>
          
          <p>
            We will use commercially reasonable and legally required precautions to preserve the integrity and
            security of your information and data.
          </p>
          
          <h3>Queries/ Grievance Officer</h3>
          
          <p>
            For any queries, questions, or grievances about this Policy, please contact us using the contact
            information provided on this website.
          </p>
        </div>
      </div>

      <style jsx>{`
        .policy-container {
          max-width: 1200px;
          margin: 120px auto 80px auto;
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
        
        .privacy-list {
          list-style-type: none;
          padding-left: 0;
          margin-bottom: 20px;
        }
        
        .privacy-list li {
          position: relative;
          padding-left: 25px;
          margin-bottom: 10px;
          line-height: 1.6;
          color: #555;
        }
        
        .privacy-list li:before {
          content: "–";
          position: absolute;
          left: 0;
          color: var(--primary);
        }
        
        @media (max-width: 768px) {
          .policy-container {
            padding: 0 15px 60px 15px;
            margin: 100px auto 60px auto;
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

export default DataPolicy 