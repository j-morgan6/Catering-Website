import { useState } from "react";

function CategoryCard({category, clickHandler}){
    return(
        <div className="card catCard" onClick={() => clickHandler(category.title)}>
            {(category.img !== "") ? (
                <img className="menuImg" src={category.img}/>
            ) : (
                <img className="menuImg" src={"src/assets/tempMenuData/placeholder.jpg"}/>
            )}
            <h2 className="cardTitle">{category.title}</h2>
        </div>
    );
}

function MenuItemCard({item, clickHandler}){
    return(
        <div className="card itemCard" onClick={() => clickHandler(item)}>
            {(item.imageURL !== "") ? (
                <img className="menuImg" src={item.imageURL}/>
            ) : (
                <img className="menuImg" src="src/assets/tempMenuData/placeholder.jpg"/>
            )}
            <div className="cardBar">
                {item.vegetarian && <img className="vegLogo" src="src/assets/tempMenuData/veglogo.png"/>}
                <h2 className="cardTitle">{item.name}</h2>
            </div>
        </div>
    );
}

function ExpandedItemSection({expandedItem, options}){
    return(
        <div className="expanded">
            {(expandedItem.imageURL !== "") ? (
                <img className="expImg" src={expandedItem.imageURL}/>
            ) : (
                <img className="expImg" src="src/assets/tempMenuData/placeholder.jpg"/>
            )}
            <div className="infoSec">
                <h2 className="expTitle">{expandedItem.name}</h2>
                {expandedItem.description !== "" && <p>{expandedItem.description}</p>}
                {  
                (options.length === 0) ?(
                    <h3>{expandedItem.price}</h3>
                ) : (
                    <div className="optionContainer">
                        {options.map((option) =>
                            <Option key={option.name} item={option}/>
                        )}
                    </div>
                )
                }
                <h3></h3>
                <button className="addToCart">Add to cart</button>
            </div>
        </div>
    );
}

function Option({item}){
    const [quantity, setQuantity] = useState(0)

    function PlusPressed(){
        if(quantity < 30) 
            setQuantity(quantity + 1)
    }

    function SubPressed(){
        if(quantity > 0)
            setQuantity(quantity - 1)
    }

    function InputChanged(e){
        setQuantity(parseInt(e.target.value))
    }

    return(
        <div className="option">
            <div className="optionLeft">
                <h5>{item.name + " $" + item.price}</h5>
                {item.vegetarian && 
                    <img className="vegLogo" src="src/assets/tempMenuData/veglogo.png"/>}
            </div>
            <div className="quantityBar">
                <button className="quantButton" onClick={SubPressed}>-</button>
                <input 
                    className="quantInput"
                    type="number" 
                    min="0"
                    max="30"
                    value={quantity}
                    onChange={InputChanged}
                />
                <button className="quantButton" onClick={PlusPressed}>+</button>
            </div>
        </div>
    );
}

export {CategoryCard, MenuItemCard, ExpandedItemSection};