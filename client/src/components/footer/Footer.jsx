import { FaXTwitter, FaFacebookF, FaInstagram } from "react-icons/fa6"


import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className='footer-links font-size-16'>
        <div className="footer-section">
          <h3>Get Connected</h3>
          <ul>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Policy</h3>
          <ul>
            <li>Disclaimer</li>
            <li>Privacy Policy</li>
            <li>Refund Policy</li>
            <li>Terms and Conditions</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons-container">
            <FaXTwitter className="social-icons"/>
            <FaFacebookF className="social-icons"/>
            <FaInstagram className="social-icons"/>
          </div>
        </div>
        <div className="footer-brand">
          <img src='/logo-light.png' alt='Company Logo' />
        </div>
      </div>
      <div className='footer-copyright font-size-14'>
        © 2024 BrightR.Club
      </div>
    </footer>
  );
}

