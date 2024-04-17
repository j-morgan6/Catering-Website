import {React, useState, useEffect, useContext} from "react";
import Cookies from "js-cookie";
import { CartItemSection, OrderForm } from "../components/CartComponents";
import { UserContext } from "../hooks/useUser";

export default function Cart(){
    const {user} = useContext(UserContext)
    const [orderItems, setOrderItems] = useState([])
    const [justEmptiedCart, setJustEmptiedCart] = useState(false)
    const [displaySuccess, setDisplaySuccess] = useState(false)

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
            Cookies.set('cart', cartItemsStr, {sameSite: 'strict'})
            console.log(`SET cart cookies to:\n ${cartItemsStr}`)
        }
    }, [orderItems])

    function ChangeQuantity(updatedOrderItem){
        let newOrderItems = JSON.parse(JSON.stringify(orderItems)) //deepcopy
        const i = newOrderItems.findIndex((orderItem) =>
            orderItem.Name === updatedOrderItem.Name
        )
        if(i !== -1){
            newOrderItems[i].quantity = updatedOrderItem.quantity
            setOrderItems(newOrderItems)
        } else
            console.log("couldn't change quantity of orderItem in ChangeQuantity", updatedOrderItem)
    }

    function RemoveItem(itemToRemove){
        const newOrderItems = orderItems.filter((item) =>
            item.Name !== itemToRemove.Name
        )
        if(newOrderItems.length == 0) setJustEmptiedCart(true)
        setOrderItems(newOrderItems)
    }

    function HandleOrderSuccess(){
        setDisplaySuccess(true) //set to display the success text
        setJustEmptiedCart(true)
        setOrderItems([]) //clear the cart of items
    }

    return(
    <div className="cartPage">
        <div className="cart">
            <CartItemSection
                orderItems={orderItems}
                ChangeQuantity={ChangeQuantity}
                RemoveItem={RemoveItem}
            />
            <OrderForm 
                user={user}
                orderItems={orderItems}
                HandleOrderSuccess={HandleOrderSuccess}
            />
        </div>
        <div className="extraSpace">
            {displaySuccess &&
                <h1 className="successText">Your order has been successfully placed, thank you!</h1>
            }
        </div>
    </div>
    );
}