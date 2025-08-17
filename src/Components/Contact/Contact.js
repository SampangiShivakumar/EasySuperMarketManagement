import './Contact.css';
import React from 'react';
import Navbar from '../../NavBar/Navbar1';

const Contact = () => (
  <div className="contact-container">
    <Navbar />
    <div className="contact-content">
      <h2>Contact Us</h2>
      <p>Have questions or need support? Reach out to us!</p>
      <ul className="contact-list">
        <li>Email: <a href="mailto:support@easymanager.com">support@QuickMartManagement.com</a></li>
        <li>Phone: <a href="tel:+919999999999">+91 7680886439</a></li>
        <li>Address: 123, Main Street, Hyderabad, India</li>
      </ul>
    </div>
  </div>
);

export default Contact;
