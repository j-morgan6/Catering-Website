import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useUser } from '../hooks/useUser'
import { useAccessToken } from '../hooks/useAccessToken'
import './Account.css'

export default function Account() {
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [company, setCompany] = useState('')
    const [profileMessage, setProfileMessage] = useState(null)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMessage, setPasswordMessage] = useState(null)
    function clearPassword() {
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    const [deleteError, setDeleteError] = useState('')
    const [popupVisible, setPopupVisible] = useState(false)

    const navigate = useNavigate()

    const { user, logout } = useUser()

    function logoutUser() {
        logout()
        navigate('/auth')
    }

    useEffect(() => {
        if (!user) navigate('/')
        else {
            setEmail(user.Email)
            setPhone(user.Phone)
            setCompany(user.Company)
        }
    })

    function handleProfileUpdate(event) {
        event.preventDefault()
    } 

    async function handlePasswordUpdate(event) {
        event.preventDefault()

        if (newPassword != confirmPassword) {
            setPasswordMessage({
                success: false,
                message: "Passwords do not match."
            })
            return
        }
        
        const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}`
        try {
            const accessToken = await useAccessToken()
        
            await axios.put(`${apiURI}/user/password-reset`, {
                old_password: oldPassword,
                new_password: newPassword
            }, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                },
                withCredentials: true
            })
            setPasswordMessage({
                success: true,
                message: "Success! Your password has been changed."
            })
        } catch (err) {
            if (err.response) {
                if (err.response.status == 401) setPasswordMessage({
                    success: false,
                    message: "Incorrect old password."
                })
            }
        }

        clearPassword()
    }

    async function handleDeleteAccount() {
        const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}`
        try {
            const accessToken = await useAccessToken()

            await axios.delete(`${apiURI}/user`, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })
            logout()
            navigate('/auth')
        } catch (err) {
            setDeleteError('There was an error deleting your account. Please try again later.')
        }
    }

    return (
        <div id='account-page'>
            <div className='account-module'>
                <div className='account-module-header'>
                    <h2>Profile</h2>
                </div>
                <form className='account-module-form' onSubmit={handleProfileUpdate}>
                    <div className='account-module-form-input-container'>
                        <div className='account-module-form-input'>
                            <label htmlFor="email">Email</label>
                            <input className='form-input-field' type="email" name='email' value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className='account-module-form-input'>
                            <label htmlFor="phone">Phone</label>
                            <input className='form-input-field' type="text" name='phone' value={phone} onChange={e => setPhone(e.target.value)} required />
                        </div>
                        <div className='account-module-form-input'>
                            <label htmlFor="company">Company</label>
                            <input className='form-input-field' type="text" name='company' value={company} onChange={e => setCompany(e.target.value)} />
                        </div>
                        
                    </div>
                    <div className='account-module-form-footer'>
                        <div className='action-row'>
                            <div className='account-module-form-footer-primary-btn'>
                                <input type="submit" value='Save' />
                            </div>
                        </div>
                        {profileMessage && (
                            <p className={profileMessage.success ? "success" : "danger"}>{profileMessage.message}</p>
                        )}
                    </div>
                </form>
            </div>
            <div className='account-module'>
                <div className='account-module-header'>
                    <h2>Change Password</h2>
                </div>
                <form className='account-module-form' onSubmit={handlePasswordUpdate}>
                    <div className='account-module-form-input-container'>
                        <div className='account-module-form-input'>
                            <label htmlFor="old_password">Old Password</label>
                            <input className='form-input-field' type="password" name='old_password' value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                        </div>
                        <div className='account-module-form-input'></div>
                        <div className='account-module-form-input'>
                            <label htmlFor="old_password">New Password</label>
                            <input className='form-input-field' type="password" name='new_password' value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                        </div>
                        <div className='account-module-form-input'>
                            <label htmlFor="old_password">Confirm Password</label>
                            <input className='form-input-field' type="password" name='confirm_password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                        </div>
                    </div>
                    <div className='account-module-form-footer'>
                        <div className='action-row'>
                            <div className='account-module-form-footer-primary-btn'>
                                <input type="submit" value='Save' />
                            </div>
                        </div>
                        {passwordMessage && (
                            <p className={passwordMessage.success ? "success" : "danger"}>{passwordMessage.message}</p>
                        )}
                    </div>
                </form>
            </div>
            <div className='profile-btns-row action-row'>
                <div className='profile-btn'>
                    <button className='secondary-btn' onClick={() => setPopupVisible(true)} >Delete Account</button>
                </div>  
                <div className='profile-btn'>
                    <button className='primary-btn' onClick={logout} >Log Out</button>
                </div>
            </div>
            {popupVisible && (
                <div id='delete-confirmation'>
                    <div id='confirmation-content'>
                        <h2>Are You Sure You Want to Delete Your Account?</h2>
                        <p>This action is non-reversible! If you are sure you want to delete your account, select "Confirm".</p>
                        <div className='profile-btns-row action-row'>
                            <div className='profile-btn'>
                                <button className='secondary-btn' onClick={() => {
                                    setPopupVisible(false)
                                    setDeleteError('')
                                }} >Keep My Account</button>
                            </div>  
                            <div className='profile-btn'>
                                <button className='primary-btn' onClick={handleDeleteAccount} >Confirm</button>
                            </div>
                        </div>
                        {deleteError && (
                            <p id='delete-error'>{deleteError}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}