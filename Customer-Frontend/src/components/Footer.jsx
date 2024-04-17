import React from 'react';
import './Footer.css';
import Logo from '../assets/APD-Logo.png';
import FacebookIcon from '../assets/Circled_Facebook_svg-256.webp';
import InstagramIcon from '../assets/Circled_Instagram_svg-256.webp';

function Footer() {
    return (
        <footer className="footer">
            <section className="footer-content">
                <section className="footer-info-left">
                    <p>Au Pain Doré is dedicated to giving our valued customers the best experience possible. We guarantee timely deliveries, ensuring that you can savor our delicious bakery goods when you desire them.
                    </p>
                </section>
                <section className="footer-info-center">
                    <img src={Logo} alt="Company Logo" />
                </section>
                <section className="footer-info-right">
                    <p>Check out our socials</p>
                    <a href="https://www.facebook.com/aupaindorecom/" target="_blank" rel="noopener noreferrer">
                        <img src={FacebookIcon} alt="Facebook" />
                    </a>
                    <a href="https://www.instagram.com/aupaindore_com/" target="_blank" rel="noopener noreferrer">
                        <img src={InstagramIcon} alt="Instagram" />
                    </a>
                </section>
            </section>
            <section className="black-bar"></section> {}
            <div className="copy-right-text">© 2023 Au Pain Doré All rights reserved</div>
        </footer>
    );
}

export default Footer;
