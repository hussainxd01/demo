require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Review = require('../models/Review');
const { hashPassword } = require('../utils/helpers');
const { connectDB } = require('../config/database');

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users
    const adminPassword = await hashPassword('admin123');
    const userPassword = await hashPassword('user123');

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      emailVerified: true,
    });

    const user = await User.create({
      name: 'Demo User',
      email: 'user@example.com',
      password: userPassword,
      role: 'user',
      emailVerified: true,
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        country: 'USA',
        postalCode: '10001',
      },
    });

    console.log('Created users');

    // Create demo products
    const products = await Product.create([
      {
        name: 'Anti-Aging Body Cream',
        description: 'This luxurious anti-aging body cream deeply moisturizes and tones the skin for a visibly younger and velvety soft complexion. Infused with pure glacier water and precious extracts from Indian almond and elderberry blossom, it absorbs easily to refresh and revitalize the skin, while tightening and restoring elasticity.',
        price: 10400,
        category: 'BODY CARE',
        brand: 'Dr. Elowen Liz',
        stock: 50,
        sku: 'BODY-CREAM-001',
        rating: 5,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
            publicId: 'product-placeholder-1',
          },
        ],
        specifications: {
          size: '50 ml',
          volume: '50',
          ingredients: ['Glacier Water', 'Almond Extract', 'Elderberry Blossom'],
        },
        instructions: 'Apply to clean skin and massage gently until absorbed.',
        shipping: {
          estimatedDays: '1-2 business days',
          info: 'Ships in our fully recyclable and biodegradable signature boxes. No EU import duties.',
        },
        tags: ['body-care', 'anti-aging', 'luxury'],
        createdBy: admin._id,
      },
      {
        name: 'Glow Drops',
        description: 'Illuminate your skin with our luxurious glow drops. These lightweight drops blend seamlessly with your skincare routine to give you a natural, radiant glow. Perfect for all skin types.',
        price: 13700,
        category: 'SKINCARE',
        brand: 'Tata Harper',
        stock: 35,
        sku: 'GLOW-DROPS-001',
        rating: 4.5,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
            publicId: 'product-placeholder-2',
          },
        ],
        specifications: {
          size: '30 ml',
          volume: '30',
          ingredients: ['Rose Extract', 'Vitamin C', 'Hyaluronic Acid'],
        },
        instructions: 'Mix with your favorite moisturizer or apply directly to face.',
        tags: ['glow', 'luminous', 'skincare'],
        createdBy: admin._id,
      },
      {
        name: 'Sun Drops',
        description: 'Protect and nourish your skin with our SPF sun drops. Lightweight, non-greasy formula that provides broad-spectrum protection while keeping skin hydrated.',
        price: 13700,
        category: 'SKINCARE',
        brand: 'Boutijour',
        stock: 40,
        sku: 'SUN-DROPS-001',
        rating: 4.8,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
            publicId: 'product-placeholder-3',
          },
        ],
        specifications: {
          size: '50 ml',
          volume: '50',
          ingredients: ['SPF 30', 'Zinc Oxide', 'Aloe Vera'],
        },
        instructions: 'Apply liberally to face and body 15 minutes before sun exposure.',
        shipping: {
          estimatedDays: '1-2 business days',
          info: 'Ships within 1-2 business days in recyclable packaging.',
        },
        tags: ['sun-protection', 'spf', 'skincare'],
        createdBy: admin._id,
      },
      {
        name: 'Baby Gentle Wash',
        description: 'Mild and gentle baby wash formulated for sensitive skin. Free from harsh chemicals and sulfates. Safe for daily use.',
        price: 8900,
        category: 'BABY & KIDS',
        brand: 'Shangpree',
        stock: 60,
        sku: 'BABY-WASH-001',
        rating: 4.9,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
            publicId: 'product-placeholder-4',
          },
        ],
        specifications: {
          size: '200 ml',
          volume: '200',
          ingredients: ['Chamomile', 'Oatmeal', 'Natural Oils'],
        },
        instructions: 'Apply to wet skin, lather gently, and rinse thoroughly.',
        tags: ['baby', 'gentle', 'cleanser'],
        createdBy: admin._id,
      },
      {
        name: 'Hair Revival Serum',
        description: 'Revitalize your hair with our nourishing hair serum. Restores shine, reduces frizz, and promotes healthy hair growth.',
        price: 6500,
        category: 'HAIR CARE',
        brand: 'Dr. Barbara Sturm',
        stock: 45,
        sku: 'HAIR-SERUM-001',
        rating: 4.7,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
            publicId: 'product-placeholder-5',
          },
        ],
        specifications: {
          size: '50 ml',
          volume: '50',
          ingredients: ['Argan Oil', 'Biotin', 'Keratin'],
        },
        instructions: 'Apply to damp hair, focusing on ends. Do not rinse.',
        tags: ['hair-care', 'serum', 'shine'],
        createdBy: admin._id,
      },
    ]);

    console.log('Created demo products');

    // Create demo reviews
    await Review.create([
      {
        product: products[0]._id,
        user: user._id,
        rating: 5,
        title: 'Absolutely amazing product!',
        comment: 'This body cream is a game-changer. My skin feels so soft and hydrated after using it. Highly recommend!',
        status: 'approved',
      },
      {
        product: products[1]._id,
        user: user._id,
        rating: 4,
        title: 'Great glow, subtle but effective',
        comment: 'Love how these glow drops blend in. Gives a subtle, natural glow without being obvious.',
        status: 'approved',
      },
    ]);

    console.log('Created demo reviews');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nDemo Credentials:');
    console.log('Admin - Email: admin@example.com, Password: admin123');
    console.log('User - Email: user@example.com, Password: user123');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
