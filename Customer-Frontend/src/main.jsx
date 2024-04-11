import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Menu from './pages/Menu'
import Cart from './pages/Cart'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/menu' element={<Menu />} />
                <Route path='/menu/:categoryParam' element={<Menu />} />
                <Route path='/menu/:categoryParam/:itemParam' element={<Menu />} />
                <Route path='/cart' element={<Cart />} />
            </Routes>
        </Router>
    </React.StrictMode>,
)
