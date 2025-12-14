import React from 'react';
import './TermsAndConditions.css';

import { Link } from 'react-router-dom';
// @ts-ignore
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const TermsAndConditions = () => {
  const lastUpdated = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="terms-conditions-container relative">
      <Link to="/" className="fixed top-4 left-4 z-50 flex items-center gap-2 text-gray-600 hover:text-primary transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-100 group">
        <ArrowRightIcon className="h-4 w-4 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Home</span>
      </Link>
      <header className="terms-conditions-header">
        <h1>Terms & Conditions</h1>
        <p>Last Updated: {lastUpdated}</p>
      </header>

      <nav className="terms-conditions-nav">
        <h2>Table of Contents</h2>
        <ul>
          <li><a href="#acceptance-of-terms">1. Acceptance of Terms</a></li>
          <li><a href="#service-description">2. Service Description</a></li>
          <li><a href="#user-accounts-registration">3. User Accounts & Registration</a></li>
          <li><a href="#device-installation-safety">4. Device Installation & Safety</a></li>
          <li><a href="#data-usage-intellectual-property">5. Data Usage & Intellectual Property</a></li>
          <li><a href="#payment-terms">6. Payment Terms</a></li>
          <li><a href="#limitation-of-liability">7. Limitation of Liability</a></li>
          <li><a href="#termination">8. Termination</a></li>
          <li><a href="#dispute-resolution">9. Dispute Resolution</a></li>
          <li><a href="#iot-related-clauses">10. Specific IoT-Related Clauses</a></li>
          <li><a href="#version-history">11. Version History</a></li>
          <li><a href="#contact-us">12. Contact Us</a></li>
        </ul>
      </nav>

      <section id="acceptance-of-terms" className="terms-conditions-section">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing or using the Smart Home Energy Manager (SHEM) service, you agree to be bound by these Terms & Conditions and all policies referenced herein. If you do not agree to these terms, you may not use our service.</p>
        <h3>Age Requirement:</h3>
        <p>Our services are available only to individuals who are at least 18 years old. By using SHEM, you represent and warrant that you are at least 18 years of age.</p>
        <h3>Jurisdiction and Governing Law:</h3>
        <p>These Terms shall be governed and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.</p>
        <h3>Updates and Modifications:</h3>
        <p>SHEM reserves the right to modify or replace these Terms at any time. We will provide notice of any changes by updating the "Last Updated" date on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.</p>
      </section>

      <section id="service-description" className="terms-conditions-section">
        <h2>2. Service Description</h2>
        <h3>What SHEM Provides:</h3>
        <ul>
          <li><strong>Real-time Electricity Monitoring:</strong> Via ESP32 devices, providing live data on your energy consumption.</li>
          <li><strong>Web Dashboard:</strong> A user-friendly interface for visualizing your energy data.</li>
          <li><strong>Energy Consumption Analytics:</strong> Detailed reports and insights into your energy usage patterns.</li>
          <li><strong>Cost Calculation and Reporting:</strong> Estimates of energy costs based on your consumption.</li>
          <li><strong>AI-powered Recommendations:</strong> Suggestions for optimizing energy usage and reducing costs.</li>
        </ul>
        <h3>Technical Limitations:</h3>
        <ul>
          <li><strong>Stable Internet Connection:</strong> SHEM requires a continuous and stable internet connection to function correctly.</li>
          <li><strong>ESP32 Device Compatibility:</strong> Our service is designed to work with specific ESP32 devices. Compatibility with other devices is not guaranteed.</li>
          <li><strong>Data Accuracy Disclaimers:</strong> Energy sensor data may have a variance of ±5% due to hardware limitations and environmental factors.</li>
          <li><strong>Service Availability:</strong> We aim for 99.5% service uptime, but cannot guarantee uninterrupted service due to unforeseen circumstances.</li>
        </ul>
      </section>

      <section id="user-accounts-registration" className="terms-conditions-section">
        <h2>3. User Accounts & Registration</h2>
        <h3>One Account Per Household:</h3>
        <p>Each registration is intended for a single household. Multiple households or commercial entities require separate agreements.</p>
        <h3>Accurate Information Requirement:</h3>
        <p>You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
        <h3>Account Security Responsibility:</h3>
        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        <h3>Prohibited Activities:</h3>
        <p>Sharing, reselling, or unauthorized distribution of your account access or service data is strictly prohibited.</p>
      </section>

      <section id="device-installation-safety" className="terms-conditions-section">
        <h2>4. Device Installation & Safety</h2>
        <h3>User Responsibilities:</h3>
        <ul>
          <li><strong>Proper Installation:</strong> You are responsible for the correct installation of ESP32 devices and sensors according to provided guidelines.</li>
          <li><strong>Electrical Safety Compliance:</strong> Ensure all installations comply with local electrical codes and safety standards.</li>
          <li><strong>Regular Maintenance Checks:</strong> Periodically inspect devices and wiring for wear or damage.</li>
          <li><strong>Manufacturer Guidelines Adherence:</strong> Follow all manufacturer instructions for device usage and maintenance.</li>
        </ul>
        <h3>Safety Disclaimers:</h3>
        <ul>
          <li><strong>High Voltage Warning:</strong> Installation involves working with high voltage electricity. Exercise extreme caution.</li>
          <li><strong>Professional Electrician Recommendation:</strong> SHEM strongly recommends that installation be performed by a qualified professional electrician.</li>
          <li><strong>No Liability for Improper Installation:</strong> SHEM assumes no liability for damages, injuries, or losses resulting from improper installation or misuse of devices.</li>
          <li><strong>Device Damage Scenarios:</strong> SHEM is not responsible for damage to devices caused by power surges, incorrect wiring, or environmental factors.</li>
        </ul>
      </section>

      <section id="data-usage-intellectual-property" className="terms-conditions-section">
        <h2>5. Data Usage & Intellectual Property</h2>
        <h3>User Data Rights:</h3>
        <ul>
          <li><strong>Ownership of Personal Energy Data:</strong> You retain full ownership of your personal energy consumption data.</li>
          <li><strong>License Grant to SHEM:</strong> You grant SHEM a limited, non-exclusive license to use your data to provide, maintain, and improve the service.</li>
          <li><strong>Anonymous Data Usage:</strong> We may use anonymized and aggregated data for research, analytics, and service improvement without identifying individual users.</li>
        </ul>
        <h3>SHEM Intellectual Property:</h3>
        <ul>
          <li><strong>Software and Platform Copyright:</strong> All software, web platforms, and associated content are copyrighted by SHEM.</li>
          <li><strong>Trademark Protection:</strong> SHEM Pro and its logo are registered trademarks.</li>
          <li><strong>Patent-Pending Algorithms:</strong> Our energy analysis and optimization algorithms are patent-pending.</li>
          <li><strong>Confidentiality of Proprietary Technology:</strong> You agree not to reverse engineer, decompile, or disassemble any aspect of SHEM's proprietary technology.</li>
        </ul>
      </section>

      <section id="payment-terms" className="terms-conditions-section">
        <h2>6. Payment Terms</h2>
        <p>This section applies if you subscribe to any premium features or services offered by SHEM.</p>
        <h3>Subscription Models:</h3>
        <p>SHEM may offer free and premium subscription tiers with varying features and pricing.</p>
        <h3>Billing Cycles and Renewal:</h3>
        <p>Subscriptions are billed on a [e.g., monthly/annual] basis and automatically renew unless canceled prior to the renewal date.</p>
        <h3>Refund Policy:</h3>
        <p>All subscription fees are non-refundable, except as required by law.</p>
        <h3>Tax Responsibilities:</h3>
        <p>You are responsible for any applicable taxes associated with your subscription.</p>
      </section>

      <section id="limitation-of-liability" className="terms-conditions-section">
        <h2>7. Limitation of Liability</h2>
        <h3>Specific Disclaimers:</h3>
        <ul>
          <li><strong>No Guarantee of Energy Savings:</strong> SHEM provides tools and recommendations, but does not guarantee specific energy savings.</li>
          <li><strong>Accuracy of Sensor Data Limitations:</strong> While we strive for accuracy, sensor data is subject to the limitations mentioned in Section 2.</li>
          <li><strong>No Liability for Electrical Damages:</strong> SHEM is not liable for any electrical damages, fires, or other incidents arising from the use or misuse of our service or devices.</li>
          <li><strong>Service Interruption Scenarios:</strong> SHEM is not liable for service interruptions due to internet outages, power failures, or third-party service issues.</li>
          <li><strong>Force Majeure:</strong> SHEM shall not be liable for any failure to perform its obligations where such failure results from any cause beyond SHEM's reasonable control.</li>
        </ul>
        <h3>Maximum Liability:</h3>
        <p>In no event shall SHEM's total liability to you for all damages exceed the amount paid by you for the service in the twelve (12) months preceding the claim.</p>
        <h3>Indirect Damages Exclusion:</h3>
        <p>SHEM shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</p>
        <h3>Time Limitation for Claims:</h3>
        <p>Any claim arising under these Terms must be brought within one (1) year after the cause of action arises.</p>
      </section>

      <section id="termination" className="terms-conditions-section">
        <h2>8. Termination</h2>
        <h3>User-Initiated Account Closure:</h3>
        <p>You may close your account at any time by contacting our support team.</p>
        <h3>SHEM Termination Rights:</h3>
        <p>SHEM may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
        <h3>Data Retention After Termination:</h3>
        <p>Upon termination, your right to use the service will immediately cease. SHEM may retain certain data as required by law or for legitimate business purposes.</p>
        <h3>Outstanding Payment Handling:</h3>
        <p>Any outstanding payments become immediately due upon termination.</p>
      </section>

      <section id="dispute-resolution" className="terms-conditions-section">
        <h2>9. Dispute Resolution</h2>
        <h3>Arbitration Agreement:</h3>
        <p>Any dispute or claim arising out of or relating to these Terms or the service will be settled by binding arbitration in accordance with the rules of [Arbitration Association].</p>
        <h3>Class Action Waiver:</h3>
        <p>You agree that any arbitration or proceeding shall be limited to the dispute between SHEM and you individually. To the full extent permitted by law, (i) no arbitration or proceeding shall be joined with any other; (ii) there is no right or authority for any dispute to be arbitrated or resolved on a class-action basis or to utilize class action procedures; and (iii) there is no right or authority for any dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.</p>
        <h3>Governing Law:</h3>
        <p>The governing law for dispute resolution will be the laws of [Your Jurisdiction].</p>
        <h3>Venue for Legal Proceedings:</h3>
        <p>In the event that the arbitration agreement is found to be unenforceable, any legal proceedings shall be brought in the courts located in [Your City, Your State/Province].</p>
      </section>

      <section id="iot-related-clauses" className="terms-conditions-section">
        <h2>10. Specific IoT-Related Clauses</h2>
        <h3>Device Requirements:</h3>
        <ul>
          <li><strong>Compatible ESP32 Specifications:</strong> Devices must meet specified technical requirements for optimal performance.</li>
          <li><strong>Sensor Calibration Responsibilities:</strong> Users are responsible for ensuring their sensors are properly calibrated.</li>
          <li><strong>Firmware Update Requirements:</strong> Users agree to apply necessary firmware updates to their ESP32 devices as recommended by SHEM.</li>
          <li><strong>Network Connectivity Requirements:</strong> Devices require consistent Wi-Fi connectivity to transmit data to the SHEM platform.</li>
        </ul>
        <h3>Data Processing:</h3>
        <ul>
          <li><strong>Real-time Data Transmission Consent:</strong> By using the service, you consent to the real-time transmission of your energy data to our servers.</li>
          <li><strong>Historical Data Storage Duration:</strong> SHEM stores historical data for [e.g., 12 months] for analytics and reporting purposes.</li>
          <li><strong>Data Export Capabilities:</strong> Users can export their historical data through the web dashboard.</li>
          <li><strong>Third-party Integration Permissions:</strong> Integration with third-party services requires explicit user permission.</li>
        </ul>
      </section>

      <section id="version-history" className="terms-conditions-section">
        <h2>11. Version History</h2>
        <p>This table will track significant updates to the Terms & Conditions.</p>
        <table className="version-history-table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Date</th>
              <th>Changes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1.0</td>
              <td>{lastUpdated}</td>
              <td>Initial Release</td>
            </tr>
            {/* Add more rows for future updates */}
          </tbody>
        </table>
      </section>

      <section id="contact-us" className="terms-conditions-section">
        <h2>12. Contact Us</h2>
        <p>If you have any questions about these Terms & Conditions, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> legal@shem.com</li>
          <li><strong>Address:</strong> Smart Home Energy Manager, [Your Company Address Here], [City, Postal Code, Country]</li>
        </ul>
      </section>
    </div>
  );
};

export default TermsAndConditions;