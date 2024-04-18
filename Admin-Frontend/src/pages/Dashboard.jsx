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
    const [isCustomerPopupVisible, setIsCustomerPopupVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState({});
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
                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                    <option value="">Select a Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Ready">Ready</option>
                </select>
                <button onClick={handleStatusUpdate}>Submit</button>
                <button onClick={() => setIsUpdateStatusVisible(false)}>Close</button>
            </div>
        </div>
    );
    
    const handleStatusUpdate = async () => {
        const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}/orders/${currentOrderForUpdate.orderID}/status`;
        try {
            const accessToken = await useAccessToken();
            const response = await axios.put(apiURI, {
                status: newStatus
            }, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            console.log(response)
    
            if (response.data) {
                setOrders(orders.map(order => {
                    if (order.orderID === currentOrderForUpdate.orderID) {
                        return { ...order, status: newStatus };
                    }
                    return order;
                }));
    
                setIsUpdateStatusVisible(false);
                setNewStatus('');
            }
        } catch (error) {
            console.error('Failed to update order status', error);
            // Handle error appropriately
        }
    };

    const handleDelete = async (orderId) => {
        console.log("Deleting order with ID:", orderId);

        const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}/orders/${orderId}`;
        try {
            const accessToken = await useAccessToken();
            await axios.delete(apiURI, {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });

            const newOrders = orders.filter(order => order.orderID !== orderId)
            setOrders(newOrders)
        } catch (error) {
            console.error('Failed to update order status', error);
            console.log(error)
            // Handle error appropriately
        }
    };

    const handleViewOrder = (orderItems) => {
        setSelectedOrderItems(orderItems);
        setIsPopupVisible(true);
    };

    const handleCustomerClick = (customer) => {
        setSelectedCustomer(customer);
        setIsCustomerPopupVisible(true);
    };

    const CustomerDetailsPopup = () => (
        <div className="popup-overlay" onClick={() => setIsCustomerPopupVisible(false)}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h3>Customer Details</h3>
                <p><strong>Name:</strong> {selectedCustomer.name}</p>
                <p><strong>Email:</strong> {selectedCustomer.email}</p>
                <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
                <button onClick={() => setIsCustomerPopupVisible(false)}>Close</button>
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
                        <th>Operations</th>
                    </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.orderID}>
                        <td onClick={() => handleCustomerClick({
                            name: `${order.customer.firstName} ${order.customer.lastName}`,
                            email: order.customer.email,
                            phone: order.customer.phone
                        })} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                            {`${order.customer.firstName} ${order.customer.lastName}`}
                        </td>
                        <td>{order.store.street}</td>
                        <td>{order.status}</td>
                        <td>{order.timestamp}</td>
                        <td>{order.orderType}</td>
                        <td>{order.dueDate}</td>
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
            {isCustomerPopupVisible && <CustomerDetailsPopup />}
        </div>
    );
}

export default Dashboard;