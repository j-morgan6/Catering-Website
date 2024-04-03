import { React, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getAccessToken } from '../functions/tokens'
import BreadmanGIF from '../assets/big_bread.gif'
import './Auth.css'

function Auth() {
    const [method, setMethod] = useState('login')

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [company, setCompany] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')

    const [formError, setFormError] = useState('')

    const navigate = useNavigate()

    function clearFormData(includeEmail) {
        setFirstName('')
        setLastName('')
        setCompany('')
        setPhone('')
        setPassword('')

        if (includeEmail == true) setEmail('')
    }

    // if the user is logged in, redirect to home (change to account later)
    useEffect(() => {
        const checkLogin = async () => {
            // get the access token
            const accessToken = await getAccessToken()

            // if the access token exists, redirect
            if (accessToken) navigate('/')
        }
        checkLogin()
    })

    async function handleLogin(event) {
        event.preventDefault()

        const credentials = {
            email: email,
            password: password
        }

        try {
            await axios.post(`http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}/auth/login`, credentials, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })

            return navigate('/')
        } catch (err) {
            if (err.response && err.response.status == 401) {
                setFormError("Incorrect username or password")
                clearFormData(false)
            } else {
                setFormError("We encountered an error logging you in. Please try again later.")
                clearFormData(false)
            }
        }
    }

    async function handleSignup(event) {
        event.preventDefault()

        const credentials = {
            first_name: firstName,
            last_name: lastName,
            company: company,
            email: email,
            phone: phone,
            password: password
        }

        try {
            await axios.post(`http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}/auth/register`, credentials, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true
            })

            return navigate('/')
        } catch (err) {
            if (err.response && err.response.status == 409) {
                if (err.response.data.error.message.includes('email')) setFormError("Email already in use.")
                else if (err.response.data.error.message.includes('phone')) setFormError("Phone number already in use.")
            } else setFormError("There was an error signing you up. Please try again later")
            clearFormData(true)
        }
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
                    <form onSubmit={handleLogin} className='auth-form'>
                        <input className='input-text' type="email" name='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email*' />
                        <input className='input-text' type="password" name='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password*' />
                        <span>
                            <input type="checkbox" id='remember' name='remember' />
                            <label htmlFor="remember">Remember Me</label>
                        </span>
                        <input type="submit" value="Log In" />
                        <p>Don't have an account? <button onClick={() => setMethod('signup')}>Sign Up</button>.</p>
                    </form>
                )}
                {method === 'signup' && (
                    <form onSubmit={handleSignup} className='auth-form'>
                        <div className='dual-input'>
                            <input className='input-text' type="first-name" name='first-name' value={firstName} onChange={e => setFirstName(e.target.value)} placeholder='First Name*' />
                            <input className='input-text' type="last-name" name='last-name' value={lastName} onChange={e => setLastName(e.target.value)} placeholder='Last Name*' />
                        </div>
                        <input className='input-text' type="company" name='company' value={company} onChange={e => setCompany(e.target.value)} placeholder='Company' />
                        <input className='input-text' type="email" name='email' value={email} onChange={e => setEmail(e.target.value)} placeholder='Email*' />
                        <input className='input-text' type="phone" name='phone' value={phone} onChange={e => setPhone(e.target.value)} placeholder='Phone*' />
                        <input className='input-text' type="password" name='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password*' />
                        <input type="submit" value="Log In" />
                        <p>Already have an account? <button onClick={() => setMethod('login')}>Log In</button>.</p>
                    </form>
                )}
                { formError && (
                    <p id='login-error'>{formError}</p>
                )}
            </div>
        </div>
    )
}

export default Auth