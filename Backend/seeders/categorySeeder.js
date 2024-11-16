const mongoose = require("mongoose");
const Category = require("../models/categoryModel");

const parentCategories = [
  {
    name: "Electronics",
    description: "Electronic gadgets and accessories",
    level: 0,
  },
  {
    name: "clothings",
    description: "Apparel and fashion accessories",
    level: 0,
  },

  {
    name: "Books",
    description: "Books and literature",
    level: 0,
  },
  {
    name: "Furniture",
    description: "Furniture and home appliances",
    level: 0,
  },
  {
    name: "Groceries",
    description: "Groceries and food items",
    level: 0,
  },
  {
    name: "Automobiles",
    description: "Automobiles and accessories",
    level: 0,
  },
  {
    name: "Health and Beauty",
    description: "Health and beauty products",
    level: 0,
  },
  {
    name: "Sports and Fitness",
    description: "Sports and fitness products",
    level: 0,
  },
  {
    name: "Toys and Games",
    description: "Toys and games for kids",
    level: 0,
  },
];

const childCategories = [
  {
    name: "Mobile Phones",
    description: "Smartphones and accessories",
    level: 1,
    parent: "Electronics",
  },
  {
    name: "Laptops",
    description: "Laptops and accessories",
    level: 1,
    parent: "Electronics",
  },
  {
    name: "Headphones",
    description: "Headphones and earphones",
    level: 1,
    parent: "Electronics",
  },
  {
    name: "T-shirts",
    description: "Casual and formal t-shirts",
    level: 1,
    parent: "clothings",
  },

  {
    name: "Jeans",
    description: "Denim and casual jeans",
    level: 1,
    parent: "clothings",
  },
  {
    name: "Shirts",
    description: "Casual and formal shirts",
    level: 1,
    parent: "clothings",
  },
  {
    name: "Novels",
    description: "Fiction and non-fiction novels",
    level: 1,
    parent: "Books",
  },
  {
    name: "Textbooks",
    description: "Educational textbooks",
    level: 1,
    parent: "Books",
  },
  {
    name: "Study Tables",
    description: "Study tables and chairs",
    level: 1,
    parent: "Furniture",
  },
  {
    name: "Sofas",
    description: "Sofas and couches",
    level: 1,
    parent: "Furniture",
  },
  {
    name: "Dining Tables",
    description: "Dining tables and chairs",
    level: 1,
    parent: "Furniture",
  },
  {
    name: "Rice",
    description: "Basmati and non-basmati rice",
    level: 1,
    parent: "Groceries",
  },
  {
    name: "Wheat",
    description: "Whole wheat and wheat flour",
    level: 1,
    parent: "Groceries",
  },
  {
    name: "Pulses",
    description: "Lentils and pulses",
    level: 1,
    parent: "Groceries",
  },
  {
    name: "Car Accessories",
    description: "Car accessories and parts",
    level: 1,
    parent: "Automobiles",
  },
  {
    name: "Bike Accessories",
    description: "Bike accessories and parts",
    level: 1,
    parent: "Automobiles",
  },
  {
    name: "Health Supplements",
    description: "Health supplements and vitamins",
    level: 1,
    parent: "Health and Beauty",
  },
  {
    name: "Beauty Products",
    description: "Beauty products and cosmetics",
    level: 1,
    parent: "Health and Beauty",
  },
  {
    name: "Sports Equipment",
    description: "Sports equipment and accessories",
  },
  {
    name: "Fitness Equipment",
    description: "Fitness equipment and accessories",
    level: 1,
    parent: "Sports and Fitness",
  },
  {
    name: "Toys",
    description: "Toys and games for kids",
    level: 1,
    parent: "Toys and Games",
  },
];

const connectedData = parentCategories.map((parentCategory) => {
  return {
    ...parentCategory,
    children: childCategories.filter(
      (childCategory) => childCategory.parent === parentCategory.name
    ),
  };
});

const seedCategories = async () => {
  try {
    await Category.deleteMany();
    await Category.insertMany(connectedData);
    console.log("Categories seeded successfully");
  } catch (err) {
    console.log("error seeding categories", err.message);
    process.exit(1);
  }
};

module.exports = seedCategories;
