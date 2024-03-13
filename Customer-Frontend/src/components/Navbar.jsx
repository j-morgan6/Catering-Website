import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../assets/APD-Logo.png'
import './Navbar.css'

function Navbar() {
  return (
    <div className='navbar'>
        <div id='navbar-top'>

        </div>
        <div id='navbar-bottom'>
            <Link id='navbar-logo' to='/'>
                <img src={Logo} alt="Navbar Logo" />
            </Link>
            <div id='navbar-links'>
                <Link className='navbar-link' to='/menu'>Menu</Link>
                <Link className='navbar-link' to='/cart'>Cart</Link>
                <Link className='navbar-link' to='/contact'>Contact</Link>
                <Link className='navbar-link' to='/auth'>Login|Signup</Link>
            </div>
        </div>
    </div>
  )
}

export default Navbar