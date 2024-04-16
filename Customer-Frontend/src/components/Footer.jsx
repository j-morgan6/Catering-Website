import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Company Social Media</h3>
                    <ul>
                        <li><Link to="/company/facebook">Facebook</Link></li>
                        <li><Link to="/company/instagram">Instagram</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Store Social Media</h3>
                    <ul>
                        <li><Link to="/store/instagram">Instagram</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2023 Au Pain Doré All rights reserved</p>
            </div>
        </footer>
    );
}

export default Footer;
