import React from 'react'
import './MenuUpdate.css'
import { useState } from 'react'
import axios from 'axios'
import { useAccessToken } from '../hooks/useAccessToken'

function MenuUpdate() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [image, setImage] = useState('')
    const [isVegetarian, setIsVegetarian] = useState(false)

    const [updateMessage, setUpdateMessage] = useState(null)

    async function updateMenu(event) {
        event.preventDefault()

        const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}/menu/add-item`
        try {
            const itemInfo = {
                name: name,
                price: price,
                category: category,
                isVegetarian: isVegetarian ? 1 : 0
            }

            if (description) itemInfo.description = description
            if (image) itemInfo.image = image

            const accessToken = await useAccessToken()

            await axios.post(apiURI, itemInfo, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            })

            setUpdateMessage({
                success: true,
                message: `Success! ${name} has been added.`
            })
        } catch (err) {
            setUpdateMessage({
                success: false,
                message: "There was an error. Please try again."
            })
        }
    }

    return (
        <div id='menu-update-page'>
            <form onSubmit={updateMenu} id='update-form'>
                <div className='dual-input'>
                    <input className='form-input-field' type="text" name='name' value={name} onChange={e => setName(e.target.value)} placeholder='Name*' required />
                    <input className='form-input-field' type="text" name='category' value={category} onChange={e => setCategory(e.target.value)} placeholder='Category*' required />
                </div>
                <div className='dual-input'>
                    <input className='form-input-field' type="number" name='price' value={price} onChange={e => setPrice(e.target.value)} placeholder='Price*' required />
                    <input className='form-input-field' type="text" name='image' value={image} onChange={e => setImage(e.target.value)} placeholder='Image' />
                </div>
                <span>
                    <input type="checkbox" id='is_vegetarian' name='is_vegetarian' onChange={e => setIsVegetarian(e.target.value)} required />
                    <label htmlFor="is_vegetarian">Vegetarian</label>
                </span>
                <input className='form-input-field' type="text" name='description' value={description} onChange={e => setDescription(e.target.value)} placeholder='Description' />
                <input className='primary-btn' type="submit" value="Add Item" />
            </form>
            {updateMessage && (
                <p className={updateMessage.success ? "success" : "danger"}>{updateMessage.message}</p>
            )}
        </div>
    )
}

export default MenuUpdate