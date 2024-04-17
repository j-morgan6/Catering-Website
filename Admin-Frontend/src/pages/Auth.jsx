import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useUser } from '../hooks/useUser';
import BreadmanGIF from '../assets/big_bread.gif';
import './Auth.css';

function Auth() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState('');

    const { user, login } = useUser();
    const navigate = useNavigate();

    // If the user is logged in, redirect to home
    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    async function handleLogin(event) {
        event.preventDefault();
        const credentials = { username, password };
        const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}`;

        try {
            console.log('querying')
            const response = await axios.post(`${apiURI}/admin/auth/login`, credentials, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })
            console.log(response)

            await login(response.data.accessToken);
            navigate('/Dashboard');
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setFormError("Incorrect username or password");
            } else {
                setFormError("We encountered an error logging you in. Please try again later.");
            }
        }
    }

    return (
        <div id='auth-page'>
            <div className='auth-container'>
                <h1>Welcome Back!</h1>
                <img src={BreadmanGIF} alt="Breadman" />
            </div>
            <div className='auth-container'>
                <form onSubmit={handleLogin} className='auth-form'>
                    <input className='input-text' type="text" name='username' value={username} onChange={e => setUsername(e.target.value)} placeholder='Username*' required />
                    <input className='input-text' type="password" name='password' value={password} onChange={e => setPassword(e.target.value)} placeholder='Password*' required />
                    <input type="submit" value="Log In" />
                </form>
                {formError && <p id='login-error'>{formError}</p>}
            </div>
        </div>
    );
}

export default Auth;