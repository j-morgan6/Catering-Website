import {React, useState, useEffect} from "react";
import Cookies from "js-cookie";
import { CartItemSection, OrderForm } from "../components/CartComponents";

export default function Cart(){
    const [orderItems, setOrderItems] = useState([])
    const [justEmptiedCart, setJustEmptiedCart] = useState(false)

    console.log(orderItems)

    //get cart from cookies on mount
    useEffect(() => {
        let cartItemsStr = Cookies.get('cart')
        if(cartItemsStr){
            const newOrderItems = JSON.parse(cartItemsStr)
            setOrderItems(newOrderItems)
            console.log(`GET cart cookies to:\n`, newOrderItems)
        }
    }, [])

    //update cart cookie when orderItems changes
    useEffect(() => {
        if(orderItems.length > 0 || justEmptiedCart){
            let cartItemsStr = JSON.stringify(orderItems)
            Cookies.set('cart', cartItemsStr, {sameSite: 'None'})
            console.log(`SET cart cookies to:\n ${cartItemsStr}`)
        }
    }, [orderItems])

    function ChangeQuantity(updatedOrderItem){
        let newOrderItems = JSON.parse(JSON.stringify(orderItems)) //deepcopy
        const i = newOrderItems.findIndex((orderItem) =>
            orderItem.name === updatedOrderItem.name
        )
        if(i !== -1){
            newOrderItems[i].quantity = updatedOrderItem.quantity
            setOrderItems(newOrderItems)
        } else
            console.log("couldn't change quantity of orderItem in ChangeQuantity", updatedOrderItem)
    }

    function RemoveItem(itemToRemove){
        const newOrderItems = orderItems.filter((item) =>
            item.name !== itemToRemove.name
        )
        if(newOrderItems.length == 0) setJustEmptiedCart(true)
        setOrderItems(newOrderItems)
    }

    return(
    <div className="cartPage">
        <div className="cart">
            <CartItemSection
                orderItems={orderItems}
                ChangeQuantity={ChangeQuantity}
                RemoveItem={RemoveItem}
            />
            <OrderForm />
        </div>
        <div className="extraSpace"></div>
    </div>
    );
}