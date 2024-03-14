import { React, useState } from 'react'
import { Link } from 'react-router-dom'
import BreadmanGIF from '../assets/big_bread.gif'
import './Auth.css'

function Auth() {
    const [method, setMethod] = useState('login')

    function loginClicked() {
        setMethod('login')
    }

    function signupClicked() {
        setMethod('signup')
    }

    return (
        <div id='auth-page'>
            <div className='auth-container'>
                <h1>{method == 'login' ? 'Welcome Back!' : 'Join Us!'}</h1>
                <img src={BreadmanGIF} alt="Breadman" />
            </div>
            <div className='auth-container'>
                <h2>Your Information</h2>
                {method === 'login' && (
                    <form action="" className='auth-form'>
                        <input className='input-text' type="email" name='email' placeholder='Email*' />
                        <input className='input-text' type="password" name='password' placeholder='Password*' />
                        <span>
                            <input type="checkbox" id='remember' name='remember' />
                            <label htmlFor="remember">Remember Me</label>
                        </span>
                        <input type="submit" value="Log In" />
                        <p>Don't have an account? <button onClick={() => setMethod('signup')}>Sign Up</button>.</p>
                    </form>
                )}
                {method === 'signup' && (
                    <form action="" className='auth-form'>
                        <div className='dual-input'>
                            <input className='input-text' type="first-name" name='first-name' placeholder='First Name*' />
                            <input className='input-text' type="last-name" name='last-name' placeholder='Last Name*' />
                        </div>
                        <input className='input-text' type="company" name='company' placeholder='Company' />
                        <input className='input-text' type="email" name='email' placeholder='Email*' />
                        <input className='input-text' type="phone" name='phone' placeholder='Phone*' />
                        <input className='input-text' type="password" name='password' placeholder='Password*' />
                        <input type="submit" value="Log In" />
                        <p>Already have an account? <button onClick={() => setMethod('login')}>Log In</button>.</p>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Auth