require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const { connectDB } = require('../server/config/database');
const Category = require('../server/models/Category');
const Product = require('../server/models/Product');

const INITIAL_CATEGORIES = [
  {
    name: 'SKINCARE',
    description: 'Skincare products for all skin types',
  },
  {
    name: 'BODY CARE',
    description: 'Body care and moisturizing products',
  },
  {
    name: 'BABY & KIDS',
    description: 'Safe and gentle products for babies and children',
  },
  {
    name: 'HAIR CARE',
    description: 'Hair care and treatment products',
  },
];

async function runMigration() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Creating categories...');
    const createdCategories = {};

    for (const categoryData of INITIAL_CATEGORIES) {
      try {
        // Check if category already exists
        let category = await Category.findOne({ name: categoryData.name });

        if (!category) {
          category = await Category.create(categoryData);
          console.log(`✓ Created category: ${category.name}`);
        } else {
          console.log(`✓ Category already exists: ${category.name}`);
        }

        createdCategories[categoryData.name] = category._id;
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error
          const existingCategory = await Category.findOne({
            name: categoryData.name,
          });
          createdCategories[categoryData.name] = existingCategory._id;
          console.log(`✓ Category already exists: ${categoryData.name}`);
        } else {
          console.error(`✗ Error creating category ${categoryData.name}:`, error.message);
        }
      }
    }

    console.log('\nMigrating existing products...');
    let migratedCount = 0;
    let failedCount = 0;

    // Get all products with string categories
    const products = await Product.find({
      category: { $type: 'string' },
    });

    console.log(`Found ${products.length} products with string categories`);

    for (const product of products) {
      try {
        const categoryId = createdCategories[product.category];
        if (categoryId) {
          await Product.findByIdAndUpdate(
            product._id,
            { category: categoryId },
            { new: true }
          );
          migratedCount++;
        } else {
          console.warn(`✗ No category found for: ${product.category}`);
          failedCount++;
        }
      } catch (error) {
        console.error(`✗ Error migrating product ${product._id}:`, error.message);
        failedCount++;
      }
    }

    console.log(`\n✓ Migration completed!`);
    console.log(`  - Categories created: ${Object.keys(createdCategories).length}`);
    console.log(`  - Products migrated: ${migratedCount}`);
    if (failedCount > 0) {
      console.log(`  - Products failed: ${failedCount}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
