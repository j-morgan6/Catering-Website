import {React, useState} from "react";
import { categories, menuItems } from "../assets/tempMenuData/tempMenuData";
import { CategoryCard, MenuItemCard, ExpandedItemSection } from "../components/MenuComponents";
import './Menu.css'
import { useParams, Link } from "react-router-dom";

export default function Menu(){
    const { categoryParam, itemParam} = useParams();
    const [allItems, setAllItems] = useState(menuItems)

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