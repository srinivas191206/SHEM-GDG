import React from 'react';
import './PrivacyPolicy.css';
import { Link } from 'react-router-dom';
// @ts-ignore
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const PrivacyPolicy = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="privacy-policy-container relative">
      <Link to="/" className="fixed top-4 left-4 z-50 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-100 group">
        <ArrowRightIcon className="h-4 w-4 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Home</span>
      </Link>
      <header className="privacy-policy-header">
        <h1>Privacy Policy</h1>
        <p>Last Updated: {lastUpdated}</p>
      </header>

      <nav className="privacy-policy-nav">
        <h2>Table of Contents</h2>
        <ul>
          <li><a href="#introduction">1. Introduction</a></li>
          <li><a href="#information-collection">2. Information We Collect</a></li>
          <li><a href="#data-usage">3. How We Use Your Data</a></li>
          <li><a href="#data-sharing">4. Data Sharing & Disclosure</a></li>
          <li><a href="#data-security">5. Data Security</a></li>
          <li><a href="#user-rights">6. Your Rights</a></li>
          <li><a href="#international-transfers">7. International Data Transfers</a></li>
          <li><a href="#cookie-policy">8. Cookie Policy</a></li>
          <li><a href="#children-privacy">9. Children's Privacy (COPPA)</a></li>
          <li><a href="#legal-compliance">10. Legal Compliance</a></li>
          <li><a href="#policy-updates">11. Policy Updates</a></li>
          <li><a href="#contact-us">12. Contact Us</a></li>
        </ul>
      </nav>

      <section id="introduction" className="privacy-policy-section">
        <h2>1. Introduction</h2>
        <p>
          Welcome to Smart Home Energy Manager (SHEM). We are committed to protecting your privacy and handling your data in an open and transparent manner. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our IoT energy monitoring platform, which collects electricity consumption data from your home using ESP32 devices and presents it through a web dashboard.
        </p>
        <p>
          By using the SHEM platform, you agree to the collection and use of information in accordance with this policy.
        </p>
      </section>

      <section id="information-collection" className="privacy-policy-section">
        <h2>2. Information We Collect</h2>
        <h3>Personal Information:</h3>
        <ul>
          <li><strong>Registration Data:</strong> Name, email address, phone number, and household details (e.g., household size, type of residence).</li>
          <li><strong>Account Credentials:</strong> Encrypted passwords and other security information used for authentication and access.</li>
          <li><strong>Payment Information:</strong> If you subscribe to premium features, we collect necessary payment details (e.g., credit card information, billing address). This data is processed securely by third-party payment processors and not stored directly on our servers.</li>
        </ul>

        <h3>Energy Data:</h3>
        <p>Collected from your ESP32 devices installed in your home:</p>
        <ul>
          <li><strong>Real-time Voltage Readings:</strong> (220-240V AC)</li>
          <li><strong>Current Consumption:</strong> (0-30A range)</li>
          <li><strong>Power Calculations:</strong> (Wattage)</li>
          <li><strong>Energy Consumption:</strong> (kWh)</li>
          <li><strong>Timestamp Data:</strong> Records of when energy data was collected.</li>
          <li><strong>Device Operational Data:</strong> Information about the performance and status of your ESP32 devices.</li>
        </ul>

        <h3>Technical Information:</h3>
        <ul>
          <li><strong>IP Addresses and Device Information:</strong> Including unique device identifiers.</li>
          <li><strong>ESP32 Device IDs and Configurations:</strong> Specific identifiers and settings of your monitoring devices.</li>
          <li><strong>Browser Type and Version:</strong> Information about the browser you use to access our web dashboard.</li>
          <li><strong>Usage Patterns and Analytics:</strong> Data on how you interact with our platform, such as pages visited, features used, and time spent on the platform. This helps us improve user experience.</li>
        </ul>
      </section>

      <section id="data-usage" className="privacy-policy-section">
        <h2>3. How We Use Your Data</h2>
        <p>We use the collected information for various purposes, including:</p>
        <ul>
          <li><strong>Provide Real-time Energy Monitoring:</strong> To display your electricity consumption data on your dashboard.</li>
          <li><strong>Generate Consumption Reports and Insights:</strong> To help you understand your energy usage patterns.</li>
          <li><strong>Offer Personalized Energy-Saving Recommendations:</strong> Based on your energy data and usage patterns.</li>
          <li><strong>Improve Service Functionality:</strong> To enhance and optimize the performance and features of the SHEM platform.</li>
          <li><strong>Customer Support and Troubleshooting:</strong> To assist you with any issues or queries you may have.</li>
          <li><strong>Compliance with Legal Obligations:</strong> To meet regulatory and legal requirements.</li>
        </ul>
      </section>

      <section id="data-sharing" className="privacy-policy-section">
        <h2>4. Data Sharing & Disclosure</h2>
        <p>We value your privacy. We do NOT sell your personal energy data to third parties.</p>
        <ul>
          <li><strong>Anonymous Aggregate Data for Analytics:</strong> We may share aggregated and anonymized data that cannot be used to identify you personally, for research, marketing, or analytical purposes.</li>
          <li><strong>Service Providers:</strong> We may share your information with trusted third-party service providers who assist us in operating our platform, conducting our business, or serving our users (e.g., hosting providers, analytics services, payment processors). These third parties are obligated to protect your information and use it only for the purposes for which it was disclosed.</li>
          <li><strong>Legal Requirements Compliance:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency).</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale, your personal data may be transferred as part of the business assets. We will notify you before your personal data becomes subject to a different Privacy Policy.</li>
        </ul>
      </section>

      <section id="data-security" className="privacy-policy-section">
        <h2>5. Data Security</h2>
        <p>We implement a variety of security measures to maintain the safety of your personal data:</p>
        <ul>
          <li><strong>ESP32 Communication Encryption:</strong> Data transmitted from your ESP32 devices to our servers is encrypted using HTTPS/WSS protocols.</li>
          <li><strong>Secure Data Storage with Encryption:</strong> Your data is stored on secure servers with appropriate encryption measures in place.</li>
          <li><strong>Regular Security Audits:</strong> We conduct periodic security audits and vulnerability assessments to identify and address potential weaknesses.</li>
          <li><strong>Access Controls and Authentication:</strong> Access to your data is restricted to authorized personnel only, and strong authentication mechanisms are in place.</li>
        </ul>
      </section>

      <section id="user-rights" className="privacy-policy-section">
        <h2>6. Your Rights</h2>
        <p>You have certain rights regarding your personal data:</p>
        <ul>
          <li><strong>Access to Personal Data:</strong> You have the right to request access to the personal data we hold about you.</li>
          <li><strong>Data Correction and Updates:</strong> You can request that we correct or update any inaccurate or incomplete personal data.</li>
          <li><strong>Account Deletion Requests:</strong> You can request the deletion of your account and associated personal data, subject to legal and contractual obligations.</li>
          <li><strong>Data Export Capability:</strong> You may request a copy of your personal data in a structured, commonly used, and machine-readable format.</li>
          <li><strong>Consent Withdrawal:</strong> Where we rely on your consent to process your personal data, you have the right to withdraw that consent at any time.</li>
        </ul>
        <p>To exercise any of these rights, please contact us using the details provided in the "Contact Us" section below.</p>
      </section>

      <section id="international-transfers" className="privacy-policy-section">
        <h2>7. International Data Transfers</h2>
        <p>
          Your information, including personal data, may be transferred to — and maintained on — computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ from those of your jurisdiction.
        </p>
        <ul>
          <li><strong>GDPR Compliance:</strong> For users in the European Economic Area (EEA), we ensure that any international transfers of personal data comply with the General Data Protection Regulation (GDPR) by implementing appropriate safeguards, such as Standard Contractual Clauses.</li>
          <li><strong>Data Processing Agreements:</strong> We enter into data processing agreements with our service providers to ensure they uphold the same data protection standards.</li>
          <li><strong>Privacy Shield Framework:</strong> While the EU-US Privacy Shield Framework has been invalidated, we continue to monitor and adapt to new frameworks and legal requirements for data transfers between the EU and the US.</li>
        </ul>
      </section>

      <section id="cookie-policy" className="privacy-policy-section">
        <h2>8. Cookie Policy</h2>
        <p>
          We use cookies and similar tracking technologies to track the activity on our service and hold certain information. Cookies are files with a small amount of data that may include an anonymous unique identifier.
        </p>
        <ul>
          <li><strong>Authentication Cookies:</strong> Essential for logging in and maintaining your session.</li>
          <li><strong>Preference Storage:</strong> To remember your settings and preferences (e.g., language, theme).</li>
          <li><strong>Analytics Cookies (e.g., Google Analytics):</strong> To collect information about how you use our platform, helping us to improve its functionality and user experience.</li>
        </ul>
        <p>
          <strong>How to Manage Cookie Preferences:</strong> You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
        </p>
      </section>

      <section id="children-privacy" className="privacy-policy-section">
        <h2>9. Children's Privacy (COPPA)</h2>
        <p>
          Our service is not intended for use by children under the age of 13. We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us. If we become aware that we have collected personal data from children without verification of parental consent, we take steps to remove that information from our servers. This policy is in compliance with the Children's Online Privacy Protection Act (COPPA).
        </p>
      </section>

      <section id="legal-compliance" className="privacy-policy-section">
        <h2>10. Legal Compliance</h2>
        <ul>
          <li><strong>GDPR (General Data Protection Regulation):</strong> We adhere to the principles and requirements of the GDPR, ensuring lawful, fair, and transparent processing of personal data for individuals within the European Economic Area.</li>
          <li><strong>CCPA/CPRA (California Consumer Privacy Act/California Privacy Rights Act):</strong> We comply with the CCPA/CPRA, providing California consumers with specific rights regarding their personal information, including the right to know, delete, and opt-out of the sale of personal information.</li>
          <li><strong>Indian IT Act 2000:</strong> We comply with the Information Technology Act, 2000, and its associated rules, particularly regarding the collection, storage, and processing of sensitive personal data or information in India.</li>
        </ul>
      </section>

      <section id="policy-updates" className="privacy-policy-section">
        <h2>11. Policy Updates</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
        </p>
        <p>
          <strong>Version Control:</strong> This policy is version controlled internally, and significant changes will be communicated to users.
        </p>
        <p>
          <strong>User Consent Records:</strong> We maintain records of user consent to this Privacy Policy and any subsequent updates.
        </p>
      </section>

      <section id="contact-us" className="privacy-policy-section">
        <h2>12. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul>
          <li><strong>Email:</strong> privacy@shem.com</li>
          <li><strong>Data Protection Officer (DPO):</strong> dpo@shem.com</li>
          <li><strong>Address:</strong> Smart Home Energy Manager, [Your Company Address Here], [City, Postal Code, Country]</li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;