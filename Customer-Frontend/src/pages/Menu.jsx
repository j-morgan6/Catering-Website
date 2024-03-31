import {React, useState} from "react";
import { categories, menuItems } from "../assets/tempMenuData/tempMenuData";
import { CategoryCard } from "../components/MenuComponents";

export default function Menu(){
    const [view, setView] = useState("categories")

    return(
    <div>
        <h1>Menu</h1>
        {view == "categories" &&
            categories.map((category) => 
                <CategoryCard category={category}/>
            )
        }
    </div>
    );
}