import React from 'react'
import { Link } from 'react-router-dom'
import BreadmanGIF from '../assets/big_bread.gif'
import './Auth.css'

function Auth() {
  return (
    <div id='auth-page'>
        <div>
            <h1>Welcome Back!</h1>
            <img src={BreadmanGIF} alt="Breadman" />
        </div>
        <div>
            <h2>Your Information</h2>
            <form action="">
                <input className='input-text' type="email" name='email' placeholder='Email*' />
                <input className='input-text' type="password" name='password' placeholder='Password*' />
                <span>
                    <input type="checkbox" id='remember' name='remember' />
                    <label htmlFor="remember">Remember Me</label>
                </span>
                <input type="submit" value="Log In" />
            </form>
            <p>Don't have an account? <Link id='signup-link' to='/auth'>Sign Up</Link>.</p>
        </div>
    </div>
  )
}

export default Auth