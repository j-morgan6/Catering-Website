import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import Logo from '../assets/APD-Logo-Circular.png';
import './Navbar.css';

function Navbar() {
    const { user } = useUser(); // Removed 'login' as it's not used here.
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    const handleLogout = () => {
    };

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
                    {user && currentPath !== '/auth' && (<Link className='navbar-link' to='/dashboard'>Orders</Link>)}
                    {user && (<Link className='navbar-link' to='/profile'>{user.FirstName} {user.LastName}</Link>)}
                    {user && (<button onClick={handleLogout} className='navbar-link'>Logout</button>)}
                </div>
            </div>
        </div>
    );
}

export default Navbar; 