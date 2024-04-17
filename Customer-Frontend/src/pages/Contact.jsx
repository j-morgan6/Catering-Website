import React from 'react';
import './Contact.css';
import image1 from '../assets/Young_Dore.jpeg';
import image2 from '../assets/Bay_Dore.jpeg';

function Contact() {
  return (
    <div id='Contact'>
      <div className="contact-info">
        <img src={image1} alt="Contact 1" />
        <div className="info">
          <h2>Front Street</h2>
          <p>Address: 81 Front St E, Toronto</p>
          <p>Phone: +1 416-367-2738</p>
        </div>
      </div>
      <div className="contact-info">
        <img src={image2} alt="Contact 2" />
        <div className="info">
          <h2>Bay Street</h2>
          <p>Address: 222 Bay St., Toronto</p>
          <p>Phone: +1 426-546-3696</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
