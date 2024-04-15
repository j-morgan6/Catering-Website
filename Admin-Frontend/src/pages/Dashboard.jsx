import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { useAccessToken } from '../hooks/useAccessToken';
import axios from 'axios'
import './Dashboard.css'; 

function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {
        const requestOrders = async () => {
            const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}`
            try {
                const accessToken = await useAccessToken()
                        

                const response = await axios.get(`${apiURI}/orders`, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                })
                console.log(response.data)

                setOrders(response.data)
            } catch (err) {
                console.log(err)
            }
        }
        requestOrders()
    }, []);

    const handleRowClick = (orderItems) => {
        setSelectedOrderItems(orderItems);
        setIsPopupVisible(true);
    };

    const OrderItemsPopup = () => (
        <div className="popup-overlay" onClick={() => setIsPopupVisible(false)}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Vegetarian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedOrderItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.Name}</td> 
                                <td>{item.Price}</td>
                                <td>{item.Quantity}</td>
                                <td>{item.IsVegan ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button onClick={() => setIsPopupVisible(false)}>Close</button>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            <table className="centered-table">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Store Street Name</th>
                        <th>Status</th>
                        <th>Timestamp</th>
                        <th>Order Type</th>
                        <th>Delivery/Pickup Time</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.orderID} onClick={() => handleRowClick(order.items)}>
 <                          td>{`${order.customer.firstName} ${order.customer.lastName}`}</td>
                            <td>{order.store.street}</td>
                            <td>{order.status}</td>
                            <td>{order.timestamp}</td>
                            <td>{order.orderType}</td>
                            <td>{order.deliveryPickupTime}</td>
                            <td>{order.total !== null ? order.total : 'N/A'}</td> {/* Display Total or 'N/A' if null */}
                        </tr>
                    ))}
                </tbody>
            </table>
            {isPopupVisible && <OrderItemsPopup />}
        </div>
    );
}

export default Dashboard;