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
        name: "Breakfast combo",
        description: "Baked Good or Muffin + Yogurt Parfait or Fruit Salad",
        price: "10.15",
        category: "Breakfast",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Breakfast Platter",
        description: "Assortment of muffins, sweet and savoury baked goods",
        price: "5.75",
        category: "Breakfast",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Mini Baked Good Platter",
        description: "2 per person",
        price: "5.75",
        category: "Breakfast",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Sandwich Platter",
        description: "",
        price: "13.35",
        category: "Lunch",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Side Salads",
        description: "",
        price: "6.25",
        category: "Lunch",
        imageURL: "",
        vegetarian: true
    },
    {
        name: "Coffee Thermos (7 to 10 people)",
        description: "Rich dark or medium roast",
        price: "27.95",
        category: "Beverages",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Spring Water",
        description: "",
        price: "2.75",
        category: "Beverages",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Fruit and Cheese Platters",
        description: "",
        price: "6.55",
        category: "À la Carte",
        imageURL: "",
        vegetarian: true
    },
    {
        name: "Dessert Platter",
        description: "",
        price: "4.95",
        category: "Desserts",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Cookie Platter",
        description: "",
        price: "3.50",
        category: "Desserts",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Mini croissant",
        description: "",
        price: "3.95",
        category: "Mini Baked Good Platter",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Mini chocolate croissant",
        description: "",
        price: "3.95",
        category: "Mini Baked Good Platter",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Bocconcini and tomato",
        description: "",
        price: "13.35",
        category: "Sandwich Platter",
        imageURL: "",
        vegetarian: true
    },
    {
        name: "Roast Beef",
        description: "",
        price: "13.35",
        category: "Sandwich Platter",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Beet and goat cheese",
        description: "",
        price: "6.25",
        category: "Side Salads",
        imageURL: "",
        vegetarian: true
    },
    {
        name: "Greek",
        description: "",
        price: "6.25",
        category: "Side Salads",
        imageURL: "",
        vegetarian: true
    },
    {
        name: "Fresh fruit",
        description: "",
        price: "6.55",
        category: "Fruit and Cheese Platters",
        imageURL: "",
        vegetarian: false
    },
    {
        name: "Fruit and cheese",
        description: "",
        price: "7.15",
        category: "Fruit and Cheese Platters",
        imageURL: "",
        vegetarian: false
    },

]

menuItems.forEach((item) => {
    let newPath = item.name.toLowerCase();
    newPath = newPath.split(' ').join('-')
    newPath = newPath.replace(/[^a-z0-9-]/g, '');
    item.path = newPath;
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
