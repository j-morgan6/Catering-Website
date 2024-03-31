
function CategoryCard({category}){
    return(
        <div className="card catCard">
            {(category.img !== "") ? (
                <img src={category.img}/>
            ) : (
                <img src={"src/assets/tempMenuData/placeholder.jpg"}/>
            )}
            <h2>{category.title}</h2>
        </div>
    );
}

export {CategoryCard};