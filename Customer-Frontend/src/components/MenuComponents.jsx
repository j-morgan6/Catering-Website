import { useState } from "react";
import { Link, useLocation } from "react-router-dom"
import placeholderImage from "../assets/tempMenuData/placeholder.jpg"
import vegLogo from "../assets/tempMenuData/veglogo.png"

function CategoryCard({category}){
    return(
        <Link className="card catCard" to={"/menu/" + category.path}>
            {(category.img !== "") ? (
                <img className="menuImg" src={category.img}/>
            ) : (
                <img className="menuImg" src={placeholderImage}/>
            )}
            <h2 className="cardTitle">{category.title}</h2>
        </Link>
    );
}

function MenuItemCard({item}){
    const currentPath = useLocation().pathname

    return(
        <Link className="card itemCard" to={currentPath + "/" + item.Path}>
            {(item.ImageURL) ? (
                <img className="menuImg" src={item.ImageURL}/>
            ) : (
                <img className="menuImg" src={placeholderImage}/>
            )}
            <div className="cardBar">
                {item.IsVegetarian == 1 && <img className="vegLogo" src={vegLogo}/>}
                <h2 className="cardTitle">{item.Name}</h2>
            </div>
        </Link>
    );
}

function ExpandedItemSection({expandedItem, options, AddItemsToOrder}){
    const [justAdded, setJustAdded] = useState(false);
    const [quantities, setQuantities] = useState((options.length !== 0) ? options.map((option) => {
        return({
            optionName: option.Name,
            quantity: 0
        });
    }) : (
        [{
            optionName: expandedItem.Name,
            quantity: 0
        }]
    ))

    let total = 0 
    quantities.forEach((quantity) => {
        if(quantity.quantity > 0)
            total += quantity.quantity * GetPrice(quantity.optionName)
    })
    const totalStr = total.toFixed(2)

    function PlusPressed(item){
        if(justAdded) setJustAdded(false)
        const itemIndex = quantities.findIndex((quantity) =>
            quantity.optionName === item.Name
        )
        if(itemIndex !== -1){
            const newQuantities = quantities.map((quantity) => {
                return {...quantity}
            })
            if(newQuantities[itemIndex].quantity < 30)
                ++newQuantities[itemIndex].quantity
            setQuantities(newQuantities)
        }else
            console.log("Tried to update quantity of nonexistant item")
    }

    function SubPressed(item){
        if(justAdded) setJustAdded(false)
        const itemIndex = quantities.findIndex((quantity) =>
            quantity.optionName === item.Name
        )
        if(itemIndex !== -1){
            const newQuantities = quantities.map((quantity) => {
                return {...quantity}
            })
            if(newQuantities[itemIndex].quantity > 0)
                --newQuantities[itemIndex].quantity
            setQuantities(newQuantities)
        }else
            console.log("Tried to update quantity of nonexistant item")
    }

    function InputChanged(e, item){
        if(justAdded) setJustAdded(false)
        const itemIndex = quantities.findIndex((quantity) =>
            quantity.optionName === item.Name
        )
        if(itemIndex !== -1){
            const newQuantities = quantities.map((quantity) => {
                return {...quantity}
            })
            newQuantities[itemIndex].quantity = parseInt(e.target.value)
            setQuantities(newQuantities)
        }else
            console.log("Tried to update quantity of nonexistant item")
    }

    function GetQuantity(item){
        const itemQuant = quantities.find((quantity) => 
            quantity.optionName === item.Name
        )
        return itemQuant.quantity
    }

    function GetPrice(itemName){
        if(expandedItem.Name == itemName)
            return expandedItem.Price
        else{
            const matchingItem = options.find((option) =>
                option.Name === itemName
            )
            if(matchingItem !== undefined)
                return matchingItem.Price
            else
                console.log("couldnt find price of item")
        }
    }

    function OnAddToCart(){
        let zeroQuantity = true
        quantities.forEach((quantity) => {
            if(quantity.quantity != 0)
                zeroQuantity = false
        });
        
        if(!zeroQuantity){ //added items to cart
            setJustAdded(true)
            AddItemsToOrder(quantities) //send to menu component for processing
        }
    }

    return(
        <div className="outerExp">
            <div className="expanded">
                {(expandedItem.ImageURL) ? (
                    <img className="expImg" src={expandedItem.ImageURL}/>
                ) : (
                    <img className="expImg" src={placeholderImage}/>
                )}
                <div className="infoSec">
                    <h2 className="expTitle">
                        {(options.length !== 0) ? expandedItem.Name 
                            : expandedItem.Name + " $" + expandedItem.Price}
                    </h2>
                    {expandedItem.Description !== "" && <p className="itemDesc">{expandedItem.Description}</p>}
                    {  
                    (options.length === 0) ? (
                        <div className="quantContainer">
                            <QuantityBar
                                item={expandedItem}
                                GetQuantity={GetQuantity}
                                PlusPressed={PlusPressed}
                                SubPressed={SubPressed}
                                InputChanged={InputChanged}
                            />
                        </div>
                    ) : (
                        <div className="optionContainer">
                            {options.map((option) =>
                                <Option 
                                    key={option.ID} 
                                    item={option}
                                    GetQuantity={GetQuantity}
                                    PlusPressed={PlusPressed}
                                    SubPressed={SubPressed}
                                    InputChanged={InputChanged}
                                />
                            )}
                        </div>
                    )
                    }
                    <div className="infoBottomBar">
                        <h3>Total: ${totalStr}</h3>
                        <button 
                            onClick={() => OnAddToCart()}
                            className="addToCart">
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
            {justAdded && 
                <h2 className="added">Added items to cart! <Link to="/cart">Go to cart</Link></h2>
            }
        </div>
    );
}

function Option({item, GetQuantity, PlusPressed, SubPressed, InputChanged}){
    return(
        <div className="option">
            <div className="optionLeft">
                <h5>{item.Name + " $" + item.Price}</h5>
                {item.IsVegetarian === 1 && 
                    <img className="vegLogo" src={vegLogo}/>}
            </div>
            <QuantityBar 
                item={item}
                GetQuantity={GetQuantity}
                SubPressed={SubPressed}
                PlusPressed={PlusPressed}
                InputChanged={InputChanged}
            />
        </div>
    );
}

function QuantityBar({item, GetQuantity, SubPressed, PlusPressed, InputChanged}){
    return(
        <div className="quantityBar">
            <button className="quantButton" onClick={() => SubPressed(item)}>-</button>
            <input 
                className="quantInput"
                type="number" 
                min="0"
                max="30"
                value={GetQuantity(item)}
                onChange={(e) => InputChanged(e, item)}
            />
            <button className="quantButton" onClick={() => PlusPressed(item)}>+</button>
        </div>
    )
}

export {CategoryCard, MenuItemCard, ExpandedItemSection};