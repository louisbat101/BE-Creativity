// In-memory database storage
export const database = {
  products: [
    {
      _id: '1',
      name: 'Organic Coffee',
      description: 'Premium organic coffee beans from Ethiopia',
      price: 14.99,
      category: 'BE Natural',
      stock: 50,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '2',
      name: 'Natural Honey',
      description: 'Raw honey from local bees',
      price: 12.99,
      category: 'BE Natural',
      stock: 30,
      featured: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      _id: '3',
      name: 'Custom T-Shirt',
      description: 'Design your own t-shirt with custom print',
      price: 24.99,
      category: 'BE Custom',
      stock: 100,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  orders: [],
  paymentLinks: [],
  nextProductId: 4,
  nextOrderId: 1
};

// Product operations
export const productDB = {
  getAll: (category) => {
    if (category) {
      return database.products.filter(p => p.category === category);
    }
    return database.products;
  },
  
  getById: (id) => {
    return database.products.find(p => p._id === id);
  },
  
  create: (data) => {
    const newProduct = {
      _id: String(database.nextProductId++),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    database.products.push(newProduct);
    return newProduct;
  },
  
  update: (id, data) => {
    const index = database.products.findIndex(p => p._id === id);
    if (index === -1) return null;
    
    database.products[index] = {
      ...database.products[index],
      ...data,
      updatedAt: new Date()
    };
    return database.products[index];
  },
  
  delete: (id) => {
    const index = database.products.findIndex(p => p._id === id);
    if (index === -1) return null;
    
    const deleted = database.products[index];
    database.products.splice(index, 1);
    return deleted;
  }
};

// Order operations
export const orderDB = {
  getAll: () => database.orders,
  
  getById: (id) => {
    return database.orders.find(o => o._id === id);
  },
  
  create: (data) => {
    const newOrder = {
      _id: String(database.nextOrderId++),
      orderNumber: `ORD-${Date.now()}`,
      ...data,
      paymentStatus: data.paymentStatus || 'pending',
      paymentMethod: data.paymentMethod || null,
      cardLast4: data.cardLast4 || null,
      createdAt: new Date()
    };
    database.orders.push(newOrder);
    return newOrder;
  },
  
  updateStatus: (id, status) => {
    const order = database.orders.find(o => o._id === id);
    if (!order) return null;
    
    order.status = status;
    return order;
  },
  
  updatePaymentStatus: (id, paymentStatus, paymentMethod, cardLast4) => {
    const order = database.orders.find(o => o._id === id);
    if (!order) return null;
    
    order.paymentStatus = paymentStatus;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (cardLast4) order.cardLast4 = cardLast4;
    return order;
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
