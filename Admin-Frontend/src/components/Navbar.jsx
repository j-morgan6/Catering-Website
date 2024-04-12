import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import Logo from '../assets/APD-Logo-Circular.png';
import './Navbar.css';

function Navbar() {
    const { user } = useUser(); // Removed 'login' as it's not used here.

    return (
        <div className='navbar'>
            <div id='navbar-top'>
                {/* Top navbar content */}
            </div>
            <div id='navbar-bottom'>
                <Link id='navbar-logo' to='/'>
                    <img src={Logo} alt="Navbar Logo" />
                </Link>
                <div id='navbar-links'>
                    {/* Uncomment or add other navigation links as needed */}
                    {/* <Link className='navbar-link' to='/menu'>Menu</Link> */}
                    {/* <Link className='navbar-link' to='/cart'>Cart</Link> */}
                    {/* <Link className='navbar-link' to='/contact'>Contact</Link> */}
                    {user && (
                        <Link className='navbar-link' to='/profile'>{user.FirstName} {user.LastName}</Link>
                    )}
                    {/* Removed the Login link for unauthenticated users */}
                </div>
            </div>
        </div>
    );
}

export default Navbar; 