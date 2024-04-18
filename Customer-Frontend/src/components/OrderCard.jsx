import React from 'react'
import './OrderCard.css'

function OrderCard(order) {
    function formatDate(date) {
        const dateObj = new Date(date);
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return dateObj.toLocaleDateString('en-US', options);
    }

    return (
        <div className='order-card'>
            <button className='order-card-btn'>{order.order.store.street}, {order.order.store.city}</button>
            <div className='order-card-content'>
                <div>
                    <p>{formatDate(order.order.dueDate)}</p>
                    <p>{order.order.orderType}</p>
                </div>
                <div>
                    <p>${order.order.total.toFixed(2)}</p>
                    <p>{order.order.status}</p>
                </div>
            </div>
        </div>
    )
}

export default OrderCard