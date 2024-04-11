import {React, useState, useEffect} from "react";
import Cookies from "js-cookie";

export default function Cart(){
    const [orderItems, setOrderItems] = useState([])

    //get cart from cookies on mount
    useEffect(() => {
        let cartItemsStr = Cookies.get('cart')
        if(cartItemsStr){
            const newOrderItems = JSON.parse(cartItemsStr)
            setOrderItems(newOrderItems)
            console.log(`GET cart cookies to:\n`, newOrderItems)
        }
    }, [])

    return(
    <div className="cart">
        <div className="items">

        </div>
        <div className="form">

        </div>
    </div>
    );
}