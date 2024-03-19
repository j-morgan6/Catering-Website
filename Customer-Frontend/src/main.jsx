import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import Contact from './pages/Contact'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Router>
            <Navbar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/contact' element={<Contact />} />
            </Routes>
        </Router>
    </React.StrictMode>,
)
