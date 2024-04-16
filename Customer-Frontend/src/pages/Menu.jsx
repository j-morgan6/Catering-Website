import {React, useState, useEffect} from "react";
import { categories, menuItems } from "../assets/tempMenuData/tempMenuData";
import { CategoryCard, MenuItemCard, ExpandedItemSection } from "../components/MenuComponents";
import './Menu.css'
import { useParams, Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useAccessToken } from "../hooks/useAccessToken";
import axios from "axios";

export default function Menu(){
    const { categoryParam, itemParam} = useParams();
    const [allItems, setAllItems] = useState(menuItems);
    const [orderItems, setOrderItems] = useState([]);

    //get cart from cookies on mount
    useEffect(() => {
        let cartItemsStr = Cookies.get('cart')
        if(cartItemsStr){
            const newOrderItems = JSON.parse(cartItemsStr)
            setOrderItems(newOrderItems)
            console.log(`GET cart cookies to:\n`, newOrderItems)
        }

        const getMenuItems = async () => {
            const apiURI = `http://${import.meta.env.VITE_API_DOMAIN}:${import.meta.env.VITE_API_PORT}`
            try {
                const accessToken = await useAccessToken()

                const menuItems = (await axios.get(`${apiURI}/menu/items`)).data
            } catch (err) {

            }
        }
        getMenuItems
    }, [])

    //update cart cookie when orderItems changes
    useEffect(() => {
        if(orderItems.length > 0){
            let cartItemsStr = JSON.stringify(orderItems)
            Cookies.set('cart', cartItemsStr, {sameSite: 'None'})
            console.log(`SET cart cookies to:\n ${cartItemsStr}`)
        }
    }, [orderItems])

    function AddItemsToOrder(quantities){
        let newOrderItems = JSON.parse(JSON.stringify(orderItems)) //create deepcopy

        quantities.forEach((quantity) =>{
            if(quantity.quantity){
                let itemAlreadyInOrder = newOrderItems.find((orderItem) => 
                    quantity.optionName === orderItem.name
                )

                if(!itemAlreadyInOrder){ //create a new order item inside orderItems
                    let newOrderItem = allItems.find((item) =>
                        quantity.optionName === item.name
                    )
                    newOrderItem.quantity = quantity.quantity //add new property for quantity
                    newOrderItems.push(newOrderItem)
                } else {//added item already in order so just update quantity
                    const i = newOrderItems.findIndex((item) =>
                        quantity.optionName === item.name
                    )
                    newOrderItems[i].quantity += quantity.quantity
                }
            }
        });

        setOrderItems(newOrderItems);
    }

    console.log(orderItems)

    //derive correct items based off path visited
    let shownItems = []
    let options = []
    let itemExpanded
    let categoryVisited
    let categoryExists
    let expandedExists
    if(categoryParam){
        categoryVisited = categories.find((category) =>
            category.path === categoryParam
        )
        if(categoryVisited){
            categoryExists = true
            shownItems = allItems.filter((item) => 
                item.category === categoryVisited.title
            )
        } else
            categoryExists = false
    }
    if(itemParam){
        itemExpanded = allItems.find((item) => 
            item.path === itemParam
        )
        if(itemExpanded && (categoryVisited.title === itemExpanded.category)){
             //item with path exists now find options
            expandedExists = true
            options = allItems.filter((item) => 
                itemExpanded.name === item.category
            )
        } else
            expandedExists = false
    }

    return(
    <div className="menu">
        <h1>Catering Menu</h1>
        {!categoryParam && !itemParam &&
            <div className="section categories">
            {
            categories.map((category) => 
                <CategoryCard 
                    key={category.title} 
                    category={category} 
                />
            )
            }
            </div>
        }
        {categoryParam && !itemParam ? (
            (categoryExists) ? (
                <div className="section items">
                {
                shownItems.map((item) =>
                    <MenuItemCard 
                        key={item.name}
                        item={item}
                    />
                )
                }
                </div>
            ) : (
                <div className="error">
                    <h1>Category you tried to visit does not exist, sorry.</h1>
                    <Link to="/menu">Go back to menu</Link>
                </div>
            )
        ) : null
        }
        {categoryParam && itemParam ? (
            (expandedExists) ? (
                <ExpandedItemSection
                    expandedItem={itemExpanded}
                    options={options}
                    AddItemsToOrder={AddItemsToOrder}
                />
            ) : (
                <div className="error">
                    <h1>Item you tried to visit does not exist, sorry.</h1>
                    <Link to="/menu">Go back to menu</Link>
                </div>
            )
        ) : null
        }
    </div>
    );
}