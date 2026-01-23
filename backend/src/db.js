import mongoose from 'mongoose';
import Product from './models/Product.js';
import Order from './models/Order.js';
import PaymentLink from './models/PaymentLink.js';

// MongoDB Connection
export async function connectDB() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/be-creative-sd';
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout for faster failure
    });
    
    console.log('✅ MongoDB Connected successfully');
    
    // Seed initial data if database is empty
    await seedDatabase();
    
    return mongoose.connection;
  } catch (error) {
    console.warn('⚠️  MongoDB Connection Error:', error.message);
    console.warn('⚠️  Will use fallback in-memory storage');
    // Don't exit - let server continue with fallback
    return null;
  }
}

// Seed initial products if database is empty
async function seedDatabase() {
  try {
    const existingProducts = await Product.countDocuments();
    
    if (existingProducts === 0) {
      const initialProducts = [
        {
          name: 'Organic Coffee',
          description: 'Premium organic coffee beans from Ethiopia',
          price: 14.99,
          category: 'BE Natural',
          stock: 50,
          featured: true
        },
        {
          name: 'Natural Honey',
          description: 'Raw honey from local bees',
          price: 12.99,
          category: 'BE Natural',
          stock: 30,
          featured: true
        },
        {
          name: 'Custom T-Shirt',
          description: 'Design your own t-shirt with custom print',
          price: 24.99,
          category: 'BE Custom',
          stock: 100,
          featured: false
        }
      ];
      
      await Product.insertMany(initialProducts);
      console.log('✅ Initial products seeded successfully');
    }
  } catch (error) {
    console.error('⚠️  Database seeding failed:', error.message);
  }
}

// Export models for use in routes
export { Product, Order, PaymentLink };

// Legacy helper functions kept for backwards compatibility
// These now use MongoDB models instead of in-memory storage

export const productDB = {
  getAll: async (category) => {
    const query = category ? { category } : {};
    return await Product.find(query);
  },
  
  getById: async (id) => {
    return await Product.findById(id);
  },
  
  create: async (data) => {
    const newProduct = new Product(data);
    return await newProduct.save();
  },
  
  update: async (id, data) => {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  },
  
  delete: async (id) => {
    return await Product.findByIdAndDelete(id);
  }
};

export const orderDB = {
  getAll: async () => {
    return await Order.find().populate('items.product');
  },
  
  getById: async (id) => {
    return await Order.findById(id).populate('items.product');
  },
  
  create: async (data) => {
    const newOrder = new Order({
      orderNumber: `ORD-${Date.now()}`,
      ...data
    });
    return await newOrder.save();
  },
  
  updateStatus: async (id, status) => {
    return await Order.findByIdAndUpdate(id, { status }, { new: true });
  },
  
  updatePaymentStatus: async (id, paymentStatus, paymentMethod, cardLast4) => {
    const updateData = { status: paymentStatus };
    if (paymentMethod) updateData.paymentMethod = paymentMethod;
    if (cardLast4) updateData.cardLast4 = cardLast4;
    return await Order.findByIdAndUpdate(id, updateData, { new: true });
  }

};

// Payment Link operations
export const paymentLinkDB = {
  getAll: () => database.paymentLinks,
  
  create: (data) => {
    const newLink = {
      _id: String(Date.now()),
      ...data,
      isActive: true,
      stripeLink: `https://buy.stripe.com/test_demo_${Date.now()}`,
      createdAt: new Date()
    };
    database.paymentLinks.push(newLink);
    return newLink;
  },
  
  delete: (id) => {
    const index = database.paymentLinks.findIndex(l => l._id === id);
    if (index === -1) return null;
    
    const deleted = database.paymentLinks[index];
    database.paymentLinks.splice(index, 1);
    return deleted;
  }
};
