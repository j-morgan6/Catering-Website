import placeholderImage from "../assets/tempMenuData/placeholder.jpg"
import 'material-icons/iconfont/material-icons.css'

function CartItemSection({orderItems, ChangeQuantity, RemoveItem}){
    
    let total = 0
    orderItems.forEach((orderItem) =>
        total += (orderItem.price * orderItem.quantity)
    )

    return(
        <div className="cartItemSection">
            <h2 className="cartTitle">Cart</h2>
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
            <h4>{total}</h4>
        </div>
    );
}

function CartItem({orderItem, ChangeQuantity, RemoveItem}){

    const subtotal = Number(orderItem.quantity) * Number(orderItem.price)

    return(
    <div className='cartItem'>
        <span 
            onClick={() => RemoveItem(orderItem)}
            className="material-icons">
        close
        </span>
        {(orderItem.imageURL) ? (
            <img className="cartItemImg" src={orderItem.imageURL} alt={orderItem.name} />
        ) : (
            <img className="cartItemImg" src={placeholderImage} alt={orderItem.name}/>
        )}
        <h5>{orderItem.name}</h5>
        <CartQuantityBar 
            orderItem={orderItem}
            ChangeQuantity={ChangeQuantity}
        />
        <h5>{subtotal}</h5>
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
        <div className="quantityBar">
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

export {CartItemSection}