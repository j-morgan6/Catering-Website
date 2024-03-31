
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
        <div className="card itemCard" onClick={() => clickHandler(item.name)}>
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

export {CategoryCard, MenuItemCard};