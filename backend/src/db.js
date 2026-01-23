import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Initialize SQLite database (or use PostgreSQL by changing the URL)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || './database.sqlite',
  logging: false, // Set to console.log to see SQL queries
});

// Define Product Model
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('BE Natural', 'BE Custom'),
    allowNull: false,
    defaultValue: 'BE Natural',
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  stripeProductId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  timestamps: true,
  tableName: 'products',
});

// Define Order Model
const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  orderNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  customerAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stripePaymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  timestamps: true,
  tableName: 'orders',
});

// Define PaymentLink Model
const PaymentLink = sequelize.define('PaymentLink', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD',
  },
  stripeLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  timestamps: true,
  tableName: 'payment_links',
});

// Database Connection
export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ SQLite Database Connected successfully');
    
    // Sync models with database
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synced');
    
    // Seed initial data if database is empty
    await seedDatabase();
    
    return sequelize;
  } catch (error) {
    console.warn('⚠️  Database connection failed:', error.message);
    console.warn('⚠️  Will use fallback in-memory storage');
    return null;
  }
}

// Seed initial products if database is empty
async function seedDatabase() {
  try {
    const count = await Product.count();
    
    if (count === 0) {
      const initialProducts = [
        {
          name: 'Organic Coffee',
          description: 'Premium organic coffee beans from Ethiopia',
          price: 14.99,
          category: 'BE Natural',
          stock: 50,
          featured: true,
        },
        {
          name: 'Natural Honey',
          description: 'Raw honey from local bees',
          price: 12.99,
          category: 'BE Natural',
          stock: 30,
          featured: true,
        },
        {
          name: 'Custom T-Shirt',
          description: 'Design your own t-shirt with custom print',
          price: 24.99,
          category: 'BE Custom',
          stock: 100,
          featured: false,
        }
      ];
      
      await Product.bulkCreate(initialProducts);
      console.log('✅ Initial products seeded successfully');
    }
  } catch (error) {
    console.error('⚠️  Database seeding failed:', error.message);
  }
}

// Legacy helper functions for backwards compatibility
export const productDB = {
  getAll: async (category) => {
    const query = category ? { where: { category } } : {};
    return await Product.findAll(query);
  },
  
  getById: async (id) => {
    return await Product.findByPk(id);
  },
  
  create: async (data) => {
    return await Product.create(data);
  },
  
  update: async (id, data) => {
    await Product.update(data, { where: { id } });
    return await Product.findByPk(id);
  },
  
  delete: async (id) => {
    const product = await Product.findByPk(id);
    if (product) {
      await product.destroy();
    }
    return product;
  }
};

export const orderDB = {
  getAll: async () => {
    return await Order.findAll();
  },
  
  getById: async (id) => {
    return await Order.findByPk(id);
  },
  
  create: async (data) => {
    return await Order.create({
      orderNumber: `ORD-${Date.now()}`,
      customerName: data.customer?.name || 'Guest',
      customerEmail: data.customer?.email || '',
      customerPhone: data.customer?.phone || null,
      customerAddress: data.customer?.address || null,
      items: data.items,
      totalAmount: data.totalAmount,
      status: 'pending',
      paymentMethod: data.paymentMethod || null,
      stripePaymentId: data.stripePaymentId || null,
    });
  },
  
  updateStatus: async (id, status) => {
    await Order.update({ status }, { where: { id } });
    return await Order.findByPk(id);
  },
  
  updatePaymentStatus: async (id, paymentStatus) => {
    await Order.update({ status: paymentStatus }, { where: { id } });
    return await Order.findByPk(id);
  }
};

export const paymentLinkDB = {
  getAll: async () => {
    return await PaymentLink.findAll();
  },
  
  getById: async (id) => {
    return await PaymentLink.findByPk(id);
  },
  
  create: async (data) => {
    return await PaymentLink.create(data);
  },
  
  update: async (id, data) => {
    await PaymentLink.update(data, { where: { id } });
    return await PaymentLink.findByPk(id);
  },
  
  delete: async (id) => {
    const link = await PaymentLink.findByPk(id);
    if (link) {
      await link.destroy();
    }
    return link;
  }
};

export { Product, Order, PaymentLink, sequelize };
