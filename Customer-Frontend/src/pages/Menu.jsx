import {React, useState} from "react";
import { categories, menuItems } from "../assets/tempMenuData/tempMenuData";
import { CategoryCard, MenuItemCard, ExpandedItemSection } from "../components/MenuComponents";
import './Menu.css'
import { useParams } from "react-router-dom";

export default function Menu(){
    const { categoryParam, itemParam} = useParams();
    const [allItems, setAllItems] = useState(menuItems)
    const [shownItems, setShownItems] = useState([])
    const [itemExpanded, setItemExpanded] = useState({})
    const [shownOptions, setShownOptions] = useState([])

    function HandleCategoryClick(categoryTitle){
        //set shownItems to items of category clicked
        const newShownItems = allItems.filter((item) =>
            item.category === categoryTitle
        )
        setShownItems(newShownItems)
    }

    function HandleItemClicked(itemClicked){
        const newShownOptions = allItems.filter((item) =>
            item.category === itemClicked.name
        )
        setShownOptions(newShownOptions)
        setItemExpanded(itemClicked)
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
                    clickHandler={HandleCategoryClick}
                />
            )
            }
            </div>
        }
        {categoryParam && !itemParam &&
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
        {categoryParam && itemParam &&
            <ExpandedItemSection
                expandedItem={itemExpanded}
                options={shownOptions}
            />
        }
    </div>
    );
}