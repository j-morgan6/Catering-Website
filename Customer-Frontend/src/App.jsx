import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserContext } from './hooks/useUser'
import axios from 'axios'
import { useAccessToken, clearTokens } from './hooks/useAccessToken'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Auth from './pages/Auth'
import Account from './pages/Account'
import Menu from './pages/Menu'
import Cart from './pages/Cart'

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
    const logout = () => {
        setUser(null)
        clearTokens()
    }

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
                        <Route path='/contact' element={<Contact />} />
                        <Route path='/auth' element={<Auth />} />
                        <Route path='/account' element={<Account />} />
                        <Route path='/menu' element={<Menu />} />
                        <Route path='/menu/:categoryParam' element={<Menu />} />
                        <Route path='/menu/:categoryParam/:itemParam' element={<Menu />} />
                        <Route path='/cart' element={<Cart />} />
                    </Routes>
                    <Footer />
                </Router>
            </UserContext.Provider>
        </>
    )
}

export default App