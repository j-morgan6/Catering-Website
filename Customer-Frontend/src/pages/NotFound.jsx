import React from 'react';
import './NotFound.css';
import Logo from '../assets/APD-Logo-Circular.png'

function NotFound() {
    return (
        <div id='not-found'>
            <h1>Error 404</h1>
            <p>The page you are looking for cannot be found.</p>
            <img src={Logo} alt="" />
        </div>
    );
}

export default NotFound;
