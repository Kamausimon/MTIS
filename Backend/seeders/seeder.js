const mongoose = require('mongoose');
const seedCategories = require("./categorySeeder");
const dotenv = require('dotenv');

dotenv.config({ path: '../config.env' });


const DB = `mongodb+srv://kamausimon217:${process.env.DATABASE_PASSWORD}@cluster0.qip8z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



const seedDatabase = async () => {
  try {
    await mongoose.connect(DB);
    console.log('Database connected');

    // Run seeders
    await seedCategories();

    console.log('Seeding completed!');
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
