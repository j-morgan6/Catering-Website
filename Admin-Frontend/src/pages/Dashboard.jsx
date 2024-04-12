import React, { useState, useEffect } from 'react';
import './Dashboard.css'; 

function Dashboard() {
    const [orders, setOrders] = useState([]);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [selectedOrderItems, setSelectedOrderItems] = useState([]);

    useEffect(() => {
        const mockData = [
            {
                orderID: 1,
                timestamp: '2022-07-21 14:00',
                status: 'Processing',
                orderType: 'Pickup',
                deliveryPickupTime: '2022-07-22 12:00',
                instructions: 'Leave at front door',
                total: 120.00,
                customer: {
                    firstName: 'John',
                    lastName: 'Doe',
                },
                store: {
                    streetName: '123 Main St'
                },
                items: [
                    { name: 'Pizza', quantity: 2 },
                    { name: 'Soda', quantity: 3 }
                ]
            },
            {
                orderID: 2,
                timestamp: '2022-07-22 16:45',
                status: 'Delivered',
                orderType: 'Delivery',
                deliveryPickupTime: '2022-07-22 17:30',
                instructions: 'Call upon arrival',
                total: 85.50,
                customer: {
                    firstName: 'Alice',
                    lastName: 'Johnson',
                },
                store: {
                    streetName: '456 Elm St'
                },
                items: [
                    { name: 'Coffee', quantity: 1 },
                    { name: 'Bagel', quantity: 4 }
                ]
            }
        ];
        setOrders(mockData);
    }, []);

    const handleRowClick = (orderItems) => {
        setSelectedOrderItems(orderItems);
        setIsPopupVisible(true);
    };

    const OrderItemsPopup = () => (
        <div className="popup-overlay" onClick={() => setIsPopupVisible(false)}>
            <div className="popup-content" onClick={e => e.stopPropagation()}>
                <table>
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th className="quantity-header">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedOrderItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td className="quantity-cell">{item.quantity}</td>
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
                        <th>ID</th>
                        <th>Customer Name</th>
                        <th>Store Street Name</th>
                        <th>Status</th>
                        <th>Timestamp</th>
                        <th>Order Type</th>
                        <th>Delivery/Pickup Time</th>
                        <th>Instructions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.orderID} onClick={() => handleRowClick(order.items)}>
                            <td>{order.orderID}</td>
                            <td>{`${order.customer.firstName} ${order.customer.lastName}`}</td>
                            <td>{order.store.streetName}</td>
                            <td>{order.status}</td>
                            <td>{order.timestamp}</td>
                            <td>{order.orderType}</td>
                            <td>{order.deliveryPickupTime}</td>
                            <td>{order.instructions}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {isPopupVisible && <OrderItemsPopup />}
        </div>
    );
}

export default Dashboard;