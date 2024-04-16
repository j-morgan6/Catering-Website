const categories = [
    {
        title: "Lunch",
        img: "src/assets/tempMenuData/artisansandwiches.jpg",
        path: "lunch"
    },
    {
        title: "Beverages",
        img: "src/assets/tempMenuData/beverages.jpg",
        path: "beverages"
    },
    {
        title: "Breakfast",
        img: "src/assets/tempMenuData/breakfastsandwiches.jpg",
        path: "breakfast"
    },
    {
        title: "À la Carte",
        img: "src/assets/tempMenuData/lunchbox.jpg",
        path: "a-la-carte"
    },
    {
        title: "Desserts",
        img: "src/assets/tempMenuData/minipastries.jpg",
        path: "desserts"
    }
]

const menuItems = [
    {
        ID: 1,
        Name: "Breakfast combo",
        Description: "Baked Good or Muffin + Yogurt Parfait or Fruit Salad",
        Price: "10.15",
        Category: "Breakfast",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 2,
        Name: "Breakfast Platter",
        Description: "Assortment of muffins, sweet and savoury baked goods",
        Price: "5.75",
        Category: "Breakfast",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 3,
        Name: "Mini Baked Good Platter",
        Description: "2 per person",
        Price: "5.75",
        Category: "Breakfast",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 4,
        Name: "Sandwich Platter",
        Description: "",
        Price: "13.35",
        Category: "Lunch",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 5,
        Name: "Side Salads",
        Description: "",
        Price: "6.25",
        Category: "Lunch",
        ImageURL: "",
        IsVegetarian: true
    },
    {
        ID: 6,
        Name: "Coffee Thermos (7 to 10 people)",
        Description: "Rich dark or medium roast",
        Price: "27.95",
        Category: "Beverages",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 7,
        Name: "Spring Water",
        Description: "",
        Price: "2.75",
        Category: "Beverages",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 8,
        Name: "Fruit and Cheese Platters",
        Description: "",
        Price: "6.55",
        Category: "À la Carte",
        ImageURL: "",
        IsVegetarian: true
    },
    {
        ID: 9,
        Name: "Dessert Platter",
        Description: "",
        Price: "4.95",
        Category: "Desserts",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 10,
        Name: "Cookie Platter",
        Description: "",
        Price: "3.50",
        Category: "Desserts",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 11,
        Name: "Mini croissant",
        Description: "",
        Price: "3.95",
        Category: "Mini Baked Good Platter",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 12,
        Name: "Mini chocolate croissant",
        Description: "",
        Price: "3.95",
        Category: "Mini Baked Good Platter",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 13,
        Name: "Bocconcini and tomato",
        Description: "",
        Price: "13.35",
        Category: "Sandwich Platter",
        ImageURL: "",
        IsVegetarian: true
    },
    {
        ID: 14,
        Name: "Roast Beef",
        Description: "",
        Price: "13.35",
        Category: "Sandwich Platter",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 15,
        Name: "Beet and goat cheese",
        Description: "",
        Price: "6.25",
        Category: "Side Salads",
        ImageURL: "",
        IsVegetarian: true
    },
    {
        ID: 16,
        Name: "Greek",
        Description: "",
        Price: "6.25",
        Category: "Side Salads",
        ImageURL: "",
        IsVegetarian: true
    },
    {
        ID: 17,
        Name: "Fresh fruit",
        Description: "",
        Price: "6.55",
        Category: "Fruit and Cheese Platters",
        ImageURL: "",
        IsVegetarian: false
    },
    {
        ID: 18,
        Name: "Fruit and cheese",
        Description: "",
        Price: "7.15",
        Category: "Fruit and Cheese Platters",
        ImageURL: "",
        IsVegetarian: false
    },

]

menuItems.forEach((item) => {
    let newPath = item.Name.toLowerCase();
    newPath = newPath.split(' ').join('-')
    newPath = newPath.replace(/[^a-z0-9-]/g, '');
    item.Path = newPath;
});

/*
const options = [
    {
        menuItem: "Mini Baked Good Platter",
        name: "Mini croissant",
        dietary: ""
        vegetarian: false
    },
    {
        menuItem: "Mini Baked Good Platter",
        name: "Mini chocolate croissant",
        vegetarian: false
    },
    {
        menuItem: "Sandwich Platter",
        name: "Bocconcini and tomato",
        vegetarian: true
    },
    {
        menuItem: "Sandwich Platter",
        name: "Roast Beef",
        vegetarian: false
    },
    {
        menuItem: "Side Salads",
        name: "Beet and goat cheese",
        vegetarian: true
    },
    {
        menuItem: "Side Salads",
        name: "Beet and goat cheese",
        vegetarian: true
    },
]
*/

export {categories, menuItems};
