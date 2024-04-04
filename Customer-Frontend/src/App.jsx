import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserContext } from './hooks/useUser'
import axios from 'axios'
import { useAccessToken } from './hooks/useAccessToken'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Auth from './pages/Auth'

function App() {
    const [user, setUser] = useState(null)
    const login = async (accessToken) => {
        const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}`
        try {
            const response = await axios.get(`${apiURI}/user`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })

            setUser(response.data)
        } catch (err) {
            console.error(err)
        }
    }
    const logout = () => setUser(null)

    useEffect(() => {
        const getUser = async () => {
            // get the access token
            const accessToken = await useAccessToken()

            // if the token exists, get the user data
            if (accessToken) await login(accessToken)
        }
        getUser()
    }, [])

    return (
        <>
            <UserContext.Provider value={{user, login, logout}}>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path='/' element={<Home />} />
                        <Route path='/auth' element={<Auth />} />
                    </Routes>
                </Router>
            </UserContext.Provider>
        </>
    )
}

export default App