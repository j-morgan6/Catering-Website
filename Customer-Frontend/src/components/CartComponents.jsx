import { useState } from "react"
import placeholderImage from "../assets/tempMenuData/placeholder.jpg"
import 'material-icons/iconfont/material-icons.css'
import '../pages/Cart.css'

function CartItemSection({orderItems, ChangeQuantity, RemoveItem}){
    
    let total = 0
    orderItems.forEach((orderItem) =>
        total += (orderItem.Price * orderItem.quantity)
    )

    return(
        <div className="cartItemSection">
            <h2 className="cartTitle">Cart</h2>
            {orderItems.length == 0 && <p className="noItemsText">No items in cart.</p>}
            {
                orderItems.map((orderItem) => 
                    <CartItem 
                        key={orderItem.ID}
                        orderItem={orderItem}
                        ChangeQuantity={ChangeQuantity}
                        RemoveItem={RemoveItem}
                    />
                )
            }
            <h4 className="subTotal">Subtotal: ${total.toFixed(2)}</h4>
        </div>
    );
}

function CartItem({orderItem, ChangeQuantity, RemoveItem}){

    const subtotal = Number(orderItem.quantity) * Number(orderItem.Price)
    const subtotalStr = subtotal.toFixed(2)

    return(
    <div className='cartItem'>
        <div className="itemLeftSide">
            <span 
                onClick={() => RemoveItem(orderItem)}
                className="leftSidePart x material-icons">
            close
            </span>
            {(orderItem.ImageURL) ? (
                <img className="leftSidePart cartItemImg" src={orderItem.ImageURL} alt={orderItem.Name} />
            ) : (
                <img className="leftSidePart cartItemImg" src={placeholderImage} alt={orderItem.Name}/>
            )}
            <h5 className="leftSidePart">{orderItem.Name}</h5>
        </div>
        <div className="itemRightSide">
            <h5 className="rightSidePart">${subtotalStr}</h5>
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

function OrderForm({user}){
    const[loggedIn, setLoggedIn] = useState("false")
    const [customerInfo, setCustomerInfo] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        company: ""
    })
    const [formData, setFormData] = useState({
        store: "",
        orderType: "",
        deliveryInfo: {
            address: "",
            aptNumber: "",
            city: "",
            postalCode: "",
            province: "ON",
            country: "Canada"
        },
        deliveryPickupTime: "",
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
            case "postalCode":
                newFormData.deliveryInfo.postalCode = newVal
                break
            case "deliveryPickupTime":
                newFormData.deliveryPickupTime = newVal
                break;
            case "instructions":
                newFormData.instructions = newVal
                break
            default:
                console.log("tried to update a non-existant property in onformchange")
        }
        setFormData(newFormData)
    }

    function OnCustomerInfoChange(propetyName, newVal){
        let newCustomerInfo = JSON.parse(JSON.stringify(customerInfo))
        switch (propetyName){
            case "firstName":
                newCustomerInfo.firstName = newVal
                break
            case "lastName":
                newCustomerInfo.lastName = newVal
                break
            case "phone":
                newCustomerInfo.phone = newVal
                break
            case "email":
                newCustomerInfo.email = newVal
                break
            case "company":
                newCustomerInfo.phone = newVal
                break
            default:
                console.log("tried to update a non-existant property in cust info change")
        }
    }

    return(
    <div className="informationSection"> 
        <form className="orderForm">
            { !user &&
                <div className="formSection customerInfo">
                    <h2 className="formSectionTitle">Customer Information</h2>
                    <label htmlFor="firstNameInput">First Name</label>
                    <input name="firstName" type="text" id="firstNameInput"value={customerInfo.firstName}
                        onChange={(e) => OnCustomerInfoChange("firstName", e.target.value)}/>
                    <label htmlFor="lastNameInput">Last Name</label>
                    <input name="lastName" type="text" id="lastNameInput"value={customerInfo.lastName}
                        onChange={(e) => OnCustomerInfoChange("lastName", e.target.value)}/>
                    <label htmlFor="phoneInput">Phone Number</label>
                    <input name="phone" type="number" id="phoneInput" value={customerInfo.phone}
                        onChange={(e) => OnCustomerInfoChange("phone", e.target.value)}/>
                    <label htmlFor="emailInput">Email</label>
                    <input name="email" type="text" id="emailInput" value={customerInfo.email}
                        onChange={(e) => OnCustomerInfoChange("email", e.target.value)}/>
                    <label htmlFor="companyInput">Company</label>
                    <input name="company" type="text" id="companyInput" value={customerInfo.company}
                        onChange={(e) => OnCustomerInfoChange("company", e.target.value)}/>
                    <hr />
                </div>
            }
            <div className="formSection orderInfo">
                <h2 className="formSectionTitle">Order Information</h2>
                <label htmlFor="storeDropdown">Select a store</label>
                <select name="store" id="storeDropdown" value={formData.store} 
                    onChange={(e) => OnFormChange("store",e.target.value)}>
                    <option></option>
                    <option>879 Bay St., Toronto, ON M5S 3K6, Canada</option>
                    <option>81 Front St E, Toronto, ON M5E 1B8, Canada</option>
                </select>
                <label htmlFor="typeDropdown">Order type</label>
                <select name="orderType" id="typeDropdown" value={formData.orderType}
                    onChange={(e) => OnFormChange("orderType", e.target.value)}>
                    <option></option>
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                </select>
                <label htmlFor="deliveryPickupTimeInput">Delivery/Pickup Time</label>
                <input name="deliveryPickupTime" type="datetime-local" id="deliveryPickupTimeInput" 
                        value={formData.deliveryPickupTime}
                        onChange={(e) => OnFormChange("deliveryPickupTime", e.target.value)}/>
            </div>
            {formData.orderType === "delivery" && 
                <div className="formSection deliveryInfo">
                    <h3 className="formSectionTitle">Delivery Details</h3>
                    <label htmlFor="addrInput">Address</label>
                    <input name="address" type="text" id="addrInput"value={formData.deliveryInfo.address}
                        onChange={(e) => OnFormChange("address", e.target.value)}/>
                    <label htmlFor="aptNumInput">Apartment/Suite</label>
                    <input name="aptNumber" type="text" id="aptNumInput" value={formData.deliveryInfo.aptNumber}
                        onChange={(e) => OnFormChange("aptNumber", e.target.value)}/>
                    <label htmlFor="cityInput">City</label>
                    <input name="city" type="text" id="cityInput" value={formData.deliveryInfo.city}
                        onChange={(e) => OnFormChange("city", e.target.value)}/>
                    <label htmlFor="postalCodeInput">Postal Code</label>
                    <input name="postalCode" type="text" id="postalCodeInput" value={formData.deliveryInfo.postalCode}
                        onChange={(e) => OnFormChange("postalCode", e.target.value)}/>
                </div>
            }
            <div className="formSection orderInfo">
                <label htmlFor="instructionsInput">Special Instructions</label>
                <textarea 
                    value={formData.instructions}
                    name="instructions"    
                    id="instructionsInput" 
                    cols="30"  
                    rows="4"
                    onChange={(e) => OnFormChange("instructions", e.target.value)}
                ></textarea>
            </div>
        </form>
    </div>
    );
}

export {CartItemSection, OrderForm}