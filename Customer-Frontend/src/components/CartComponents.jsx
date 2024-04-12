import { useState } from "react"
import placeholderImage from "../assets/tempMenuData/placeholder.jpg"
import 'material-icons/iconfont/material-icons.css'
import '../pages/Cart.css'

function CartItemSection({orderItems, ChangeQuantity, RemoveItem}){
    
    let total = 0
    orderItems.forEach((orderItem) =>
        total += (orderItem.price * orderItem.quantity)
    )

    return(
        <div className="cartItemSection">
            <h2 className="cartTitle">Cart</h2>
            {orderItems.length == 0 && <p className="noItemsText">No items in cart.</p>}
            {
                orderItems.map((orderItem) => 
                    <CartItem 
                        key={orderItem.name}
                        orderItem={orderItem}
                        ChangeQuantity={ChangeQuantity}
                        RemoveItem={RemoveItem}
                    />
                )
            }
            <h4 className="subTotal">Subtotal: ${total}</h4>
        </div>
    );
}

function CartItem({orderItem, ChangeQuantity, RemoveItem}){

    const subtotal = Number(orderItem.quantity) * Number(orderItem.price)

    return(
    <div className='cartItem'>
        <div className="itemLeftSide">
            <span 
                onClick={() => RemoveItem(orderItem)}
                className="leftSidePart x material-icons">
            close
            </span>
            {(orderItem.imageURL) ? (
                <img className="leftSidePart cartItemImg" src={orderItem.imageURL} alt={orderItem.name} />
            ) : (
                <img className="leftSidePart cartItemImg" src={placeholderImage} alt={orderItem.name}/>
            )}
            <h5 className="leftSidePart">{orderItem.name}</h5>
        </div>
        <div className="itemRightSide">
            <h5 className="rightSidePart">${subtotal}</h5>
            <CartQuantityBar 
                orderItem={orderItem}
                ChangeQuantity={ChangeQuantity}
            />
        </div>
    </div>
    );
}

function CartQuantityBar({orderItem, ChangeQuantity}){

    function OnQuantityClick(newQuantity){
        if(newQuantity >= 1 && newQuantity <= 30){
            let updatedOrderItem = {...orderItem} //deepcopy
            updatedOrderItem.quantity = newQuantity
            ChangeQuantity(updatedOrderItem) //notify Cart
        }
    }

    return(
        <div className="rightSidePart quantityBar">
            <button 
                className="quantButton" 
                onClick={() => OnQuantityClick(orderItem.quantity - 1)}
            >-</button>
            <input 
                className="quantInput"
                type="number" 
                min="1"
                max="30"
                value={orderItem.quantity}
                onChange={(e) => OnQuantityClick(Number(e.target.value))}
            />
            <button 
                className="quantButton" 
                onClick={() => OnQuantityClick(orderItem.quantity + 1)}
            >+</button>
        </div>
    )
}

function OrderForm({}){
    const [formData, setFormData] = useState({
        store: "",
        orderType: "",
        deliveryInfo: {
            address: "",
            aptNumber: "",
            city: "",
            province: "ON",
            country: "Canada"
        },
        deliveryTime: "",
        instructions: ""
    })

    function OnFormChange(propertyName, newVal){
        let newFormData = JSON.parse(JSON.stringify(formData))
        switch(propertyName){
            case "store":
                newFormData.store = newVal
                break
            case "orderType":
                newFormData.orderType = newVal
                break
            case "address":
                newFormData.deliveryInfo.address = newVal
                break
            case "aptNumber":
                newFormData.deliveryInfo.aptNumber = newVal
                break
            case "city":
                newFormData.deliveryInfo.city = newVal
                break
            case "deliveryTime":
                newFormData.deliveryTime = newVal
                break;
            case "instructions":
                newFormData.instructions = newVal
                break
            default:
                console.log("tried to update a non-existant property")
        }
        setFormData(newFormData)
    }

    return(
    <div className="informationSection"> 
        <h2>Order Information</h2>
        <form>
            <label htmlFor="storeDropdown">Select a store</label>
            <select id="storeDropdown" value={formData.store} 
                onChange={(e) => OnFormChange("store",e.target.value)}>
                <option></option>
                <option>879 Bay St., Toronto, ON M5S 3K6, Canada</option>
                <option>81 Front St E, Toronto, ON M5E 1B8, Canada</option>
            </select>
            <label htmlFor="typeDropdown">Order type</label>
            <select id="typeDropdown" value={formData.orderType}
                onChange={(e) => OnFormChange("orderType", e.target.value)}>
                <option></option>
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
            </select>
        </form>
    </div>
    );
}

export {CartItemSection, OrderForm}