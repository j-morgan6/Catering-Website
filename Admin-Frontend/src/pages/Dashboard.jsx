import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccessToken } from '../hooks/useAccessToken';
import axios from 'axios';
import './Dashboard.css'; 

function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);
    const [isUpdateStatusVisible, setIsUpdateStatusVisible] = useState(false);
    const [currentOrderForUpdate, setCurrentOrderForUpdate] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const navigate = useNavigate();

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

    const handleUpdateStatusClick = (order, event) => {
        event.stopPropagation();  
        setCurrentOrderForUpdate(order);
        setIsUpdateStatusVisible(true);
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

    const UpdateStatusPopup = () => (
        <div className="popup-overlay" onClick={() => setIsUpdateStatusVisible(false)}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <input 
                    type="text"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    placeholder="Enter new status"
                />
                <button onClick={handleStatusUpdate}>Submit</button>
                <button onClick={() => setIsUpdateStatusVisible(false)}>Close</button>
            </div>
        </div>
    );

    const handleStatusUpdate = async () => {
        const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}/orders/${currentOrderForUpdate.orderID}`;
        try {
            const accessToken = await useAccessToken();
            const response = await axios.patch(apiURI, {
                status: newStatus,
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            setOrders(orders.map(order => {
                if (order.orderID === currentOrderForUpdate.orderID) {
                    return { ...order, status: newStatus };
                }
                return order;
            }));

            setIsUpdateStatusVisible(false);
            setNewStatus('');
        } catch (error) {
            console.error('Failed to update order status', error);
            // Handle error appropriately
        }
    };

    const handleDelete = (orderId) => {
        console.log("Deleting order with ID:", orderId);
    };

    const handleViewOrder = (orderItems) => {
        setSelectedOrderItems(orderItems);
        setIsPopupVisible(true);
    };

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
                        <th>Operations</th>
                    </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.orderID}>
                        <td>{`${order.customer.firstName} ${order.customer.lastName}`}</td>
                        <td>{order.store.street}</td>
                        <td>{order.status}</td>
                        <td>{order.timestamp}</td>
                        <td>{order.orderType}</td>
                        <td>{order.deliveryPickupTime}</td>
                        <td>{order.total !== null ? order.total : 'N/A'}</td>
                        <td><button className="update-status-btn" onClick={(e) => handleUpdateStatusClick(order,e)}>Update Status</button>
                            <button onClick={() => handleViewOrder(order.items)} className="view-order-btn">View Order</button>
                            <button onClick={() => handleDelete(order.orderID)} className="delete-button">Delete Order</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            {isPopupVisible && <OrderItemsPopup />}
            {isUpdateStatusVisible && <UpdateStatusPopup />}     
        </div>
    );
}

export default Dashboard;