import '../css/Contact-Us.css';
import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
        setStatus('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // EmailJS service ID, template ID, and Public Key
    const serviceId = 'service_gwzvf3k';
    const templateId = 'template_6h6es9j';
    const publicKey = '-oxTdFwciKwoCcxDb';

    const templateParams = {
      name: name,
      from_email: email,
      to_name: 'CaviCheck',
      message: message,
    };

    // Send the email using EmailJS
    emailjs.send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        console.log('Email sent successfully!', response);
        setName('');
        setEmail('');
        setMessage('');
        setStatus('success');
        setShowPopup(true);
      })
      .catch((error) => {
        console.error('Error sending email:', error);
        setStatus('error');
        setShowPopup(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const closePopup = () => {
    setShowPopup(false);
    setStatus('');
  };

  return (
    <main className="contact-us-page">
      <div className="contact-container">
        
        {/* Left Side - Contact Info */}
        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-icon"> 
              <img src="email.png" alt="Email" />
            </div>
            <div className="contact-details">
              <h3>Email us</h3>
              <p>Our team is ready to help.</p>
              <p className="contact-value">cavicheck@gmail.com</p>
            </div>
          </div>
          
          <div className="contact-item">
            <div className="contact-icon"> 
              <img src="location.png" alt="Location" />
            </div>
            <div className="contact-details">
              <h3>Our Door's Always Open</h3>
              <p>Come see us at our university.</p>
              <p className="contact-value">
                900 San Marcelino St, Ermita, Adamson<br />
                University, Manila, Metro Manila, Philippines
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form-container">
          <h2 className="form-title">Let's Align Our Goals—No Braces Needed.</h2>
          <p className="form-subtitle">Tell us how we can help you better.</p>
          
          <form onSubmit={handleSubmit} className="contact-form">
            <input
              type="text"
              placeholder="your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <textarea
              placeholder="What would you like to discuss?"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : "Let's Get to the Root"}
            </button>
          </form>
        </div>
      </div>

      {/* Popup Notification */}
      {showPopup && (
        <div className="popup-overlay">
          <div className={`popup-notification ${status}`}>
            <div className="popup-content">
              {status === 'success' ? (
                <>
                  <div className="popup-icon">✅</div>
                  <h3>Message Sent Successfully!</h3>
                  <p>We'll get back to you soon.</p>
                </>
              ) : (
                <>
                  <div className="popup-icon">❌</div>
                  <h3>Failed to Send Message</h3>
                  <p>Please try again or email us directly.</p>
                </>
              )}
            </div>
            <button className="popup-close" onClick={closePopup}>×</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ContactUs;