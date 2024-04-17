import { useState, useEffect } from "react"
import placeholderImage from "../assets/tempMenuData/placeholder.jpg"
import 'material-icons/iconfont/material-icons.css'
import '../pages/Cart.css'
import { useAccessToken } from "../hooks/useAccessToken"
import axios from "axios"

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

function OrderForm({user, orderItems, HandleOrderSuccess}){
    const [formStatus, setFormStatus] = useState("notReady")
    const [triedToSubmit, setTriedToSubmit] = useState(false)
    const[loggedIn, setLoggedIn] = useState("false")
    const [customerInfo, setCustomerInfo] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        email: "",
        company: ""
    })
    const [formData, setFormData] = useState({
        store: 0,
        type: "",
        address: {
            street: "",
            city: "",
            postal: "",
            province: "",
        },
        due_date: ""
    })

    if(formStatus === "notReady" || formStatus === "ready") TryUpdateStatus()

    useEffect(() => {
        async function placeOrder(order) {
            const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}`
            try {
                const accessToken = await useAccessToken()
            
                await axios.post(`${apiURI}/orders/order`, order, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                    withCredentials: true
                })
                
                // Put whatever you want to happen when the order is successfully placed here
                console.log("successfully submitted non-guest order\n")
                setFormStatus("success")
                HandleOrderSuccess() //notify cart about order success

                //reset the form data
                setCustomerInfo({
                    first_name: "",
                    last_name: "",
                    phone: "",
                    email: "",
                    company: ""
                })
                setFormData({
                    store: 0,
                    type: "",
                    address: {
                        street: "",
                        city: "",
                        postal: "",
                        province: "",
                    },
                    due_date: ""
                })
            } catch (err) {
                // handle errors here
                console.log("failed to submit non-guest order\n", err)
                setFormStatus("failure")
            }
        }

        async function placeGuestOrder(order) {
            const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}`
            try {
                const accessToken = await useAccessToken()
            
                await axios.post(`${apiURI}/orders/guest-order`, order, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    },
                    withCredentials: true
                })
                // Put whatever you want to happen when the order is successfully placed here
                console.log("successfully submitted guest order\n")
                setFormStatus("success")
                HandleOrderSuccess()

                //reset the form data
                setCustomerInfo({
                    first_name: "",
                    last_name: "",
                    phone: "",
                    email: "",
                    company: ""
                })
                setFormData({
                    store: 0,
                    type: "",
                    address: {
                        street: "",
                        city: "",
                        postal: "",
                        province: "",
                    },
                    due_date: ""
                })
            } catch (err) {
                // handle errors here
                console.log("failed to submit guest order\n", err)
                setFormStatus("failure")
            }
        }

        if(formStatus === "submitted"){
            let newOrder = {}

            if(!user)
                newOrder.guest = customerInfo

            newOrder.store = formData.store
            newOrder.type = formData.type

            if(newOrder.type === "Delivery")
                newOrder.address = formData.address

            newOrder.due_date = formData.due_date

            //recreate order items with just parts we need
            let items = orderItems.map((item) => {
                let orderItem = {}
                orderItem.item = Number(item.ID)
                orderItem.quantity = Number(item.quantity)
                return orderItem
            })
            newOrder.items = items
            console.log(newOrder)
            if(!user)
                placeGuestOrder(newOrder)
            else
                placeOrder(newOrder)
        }

    }, [formStatus])

    function SubmitOrder(){
        if(formStatus === "ready")
            setFormStatus("submitted")
    }

    function TryUpdateStatus(){
        if(formStatus === "notReady" || formStatus === "ready" || formStatus === "failure"){ //see if can now update to ready to submit form
            let canSetReady = true
            if(!user){ //must have user fields filled out
                if(!customerInfo.first_name || !customerInfo.last_name || !customerInfo.phone 
                    || !customerInfo.email || !customerInfo.company)
                    canSetReady = false
            }
            
            if(!formData.store || !formData.type || !IsDateFullyFilledOut(formData.due_date))
                canSetReady = false

            if(formData.type === "Delivery"){ //make sure delivery fields filled out
                if(!formData.address.street || !formData.address.city || !formData.address.postal 
                    || !formData.address.province)
                    canSetReady = false
            }
            if(orderItems.length <= 0) canSetReady = false

            if(canSetReady && (formStatus === "notReady" || formStatus === "failure")) 
                setFormStatus("ready")
            else if(!canSetReady && formStatus === "ready")
                setFormStatus("notReady")

        }
    }

    function OnFormChange(propertyName, newVal){
        let newFormData = JSON.parse(JSON.stringify(formData))
        switch(propertyName){
            case "store":
                newFormData.store = newVal
                break
            case "type":
                newFormData.type = newVal
                break
            case "street":
                newFormData.address.street = newVal
                break
            case "city":
                newFormData.address.city = newVal
                break
            case "postal":
                newFormData.address.postal = newVal
                break
            case "province":
                newFormData.address.province = newVal
                break
            case "due_date":
                newFormData.due_date = FormatDate(newVal)
                break;
            default:
                console.log("tried to update a non-existant property in onformchange")
        }
        setFormData(newFormData)
        if(formStatus === "failure") TryUpdateStatus()//waits until change to return to ready
    }

    function OnCustomerInfoChange(propetyName, newVal){
        let newCustomerInfo = JSON.parse(JSON.stringify(customerInfo))
        switch (propetyName){
            case "first_name":
                newCustomerInfo.first_name = newVal
                break
            case "last_name":
                newCustomerInfo.last_name = newVal
                break
            case "phone":
                newCustomerInfo.phone = newVal
                break
            case "email":
                newCustomerInfo.email = newVal
                break
            case "company":
                newCustomerInfo.company = newVal
                break
            default:
                console.log("tried to update a non-existant property in cust info change")
        }
        setCustomerInfo(newCustomerInfo)
        if(formStatus === "failure") TryUpdateStatus() //waits until change to return to ready
    }

    function FormatDate(datetimeLocal) {
        const date = new Date(datetimeLocal);

        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero indexed
        const day = ('0' + date.getDate()).slice(-2);

        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);

        const formattedDatetime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        return formattedDatetime;
    }

    function IsDateFullyFilledOut(dateString) {
        const dateParts = dateString.split(/[- :]/);
        return dateParts.length === 6 && !isNaN(Date.parse(dateString));
    }

    return(
    <div className="informationSection"> 
        <form className="orderForm">
            { !user &&
                <div className="formSection customerInfo">
                    <h2 className="formSectionTitle">Customer Information</h2>
                    <label htmlFor="firstNameInput">First Name</label>
                    <input name="first_name" type="text" id="firstNameInput"value={customerInfo.first_name}
                        onChange={(e) => OnCustomerInfoChange("first_name", e.target.value)}/>
                    <label htmlFor="lastNameInput">Last Name</label>
                    <input name="last_name" type="text" id="lastNameInput"value={customerInfo.last_name}
                        onChange={(e) => OnCustomerInfoChange("last_name", e.target.value)}/>
                    <label htmlFor="phoneInput">Phone Number</label>
                    <input name="phone" type="text" id="phoneInput" value={customerInfo.phone}
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
                <select name="store" id="storeDropdown" 
                    value={(formData.store == 1) ? "879 Bay St., Toronto, ON M5S 3K6, Canada"
                        : (formData.store == 2) ? "81 Front St E, Toronto, ON M5E 1B8, Canada"
                        : ""} 
                    onChange={(e) => {
                        let storeID = (e.target.value === "879 Bay St., Toronto, ON M5S 3K6, Canada") ? 1 : 2
                        OnFormChange("store", storeID)
                    }}>
                    <option></option>
                    <option>879 Bay St., Toronto, ON M5S 3K6, Canada</option>
                    <option>81 Front St E, Toronto, ON M5E 1B8, Canada</option>
                </select>
                <label htmlFor="typeDropdown">Order type</label>
                <select name="type" id="typeDropdown" value={formData.type}
                    onChange={(e) => OnFormChange("type", e.target.value)}>
                    <option></option>
                    <option value="Pickup">Pickup</option>
                    <option value="Delivery">Delivery</option>
                </select>
                <label htmlFor="deliveryPickupTimeInput">Delivery/Pickup Time</label>
                <input name="due_date" type="datetime-local" id="deliveryPickupTimeInput" 
                        value={formData.due_date}
                        onChange={(e) => OnFormChange("due_date", e.target.value)}/>
            </div>
            {formData.type === "Delivery" && 
                <div className="formSection deliveryInfo">
                    <h3 className="formSectionTitle">Delivery Details</h3>
                    <label htmlFor="addrInput">Address</label>
                    <input name="street" type="text" id="addrInput"value={formData.address.street}
                        onChange={(e) => OnFormChange("street", e.target.value)}/>
                    <label htmlFor="cityInput">City</label>
                    <input name="city" type="text" id="cityInput" value={formData.address.city}
                        onChange={(e) => OnFormChange("city", e.target.value)}/>
                    <label htmlFor="postalCodeInput">Postal Code</label>
                    <input name="postal" type="text" id="postalCodeInput" value={formData.address.postal}
                        onChange={(e) => OnFormChange("postal", e.target.value)}/>
                    <label htmlFor="provinceInput">Province</label>
                    <input name="province" type="text" id="provinceInput" value={formData.address.province}
                        onChange={(e) => OnFormChange("province", e.target.value)}/>
                </div>
            }
            <div className="bottomFormBar">
                {formStatus === "failure" &&
                    <p className="submitFailText">Please try again.</p>
                }
                <button 
                    type="submit" 
                    className="placeOrder"
                    onClick={() => SubmitOrder()}
                    disabled={formStatus !== "ready"}
                >Place Order</button>
            </div>
        </form>
    </div>
    );
}

export {CartItemSection, OrderForm}