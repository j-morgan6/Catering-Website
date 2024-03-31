import {React, useState} from "react";
import { categories, menuItems } from "../assets/tempMenuData/tempMenuData";
import { CategoryCard, MenuItemCard } from "../components/MenuComponents";
import './Menu.css'

export default function Menu(){
    const [view, setView] = useState("categories")
    const [allItems, setAllItems] = useState(menuItems)
    const [shownItems, setShownItems] = useState([])
    const [shownOptions, setShownOptions] = useState([])

    function HandleCategoryClick(categoryTitle){
        //set shownItems to items of category clicked
        const newShownItems = allItems.filter((item) =>
            item.category === categoryTitle
        )
        setShownItems(newShownItems)

        setView("items")
    }

    function HandleItemClicked(itemName){
        const newShownOptions = allItems.filter((item) =>
            item.category === itemName
        )
        setShownOptions(newShownOptions)

        setView("expanded")
    }

    return(
    <div className="menu">
        <h1>Menu</h1>
        {view == "categories" &&
            <div className="section categories">
            {
            categories.map((category) => 
                <CategoryCard 
                    key={category.title} 
                    category={category} 
                    clickHandler={HandleCategoryClick}
                />
            )
            }
            </div>
        }
        {view == "items" &&
            <div className="section items">
            {
            shownItems.map((item) =>
                <MenuItemCard 
                    key={item.name}
                    item={item}
                    clickHandler={HandleItemClicked}
                />
            )
            }
            </div>
        }
    </div>
    );
}