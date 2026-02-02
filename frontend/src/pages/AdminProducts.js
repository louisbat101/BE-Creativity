import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, subcategoryAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'BE Natural',
    subcategory: '',
    stock: '',
    images: []
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
    fetchSubcategories();
  }, [token]);

  useEffect(() => {
    // Update available subcategories when category changes
    fetchSubcategoriesForCategory(formData.category);
  }, [formData.category]);

  const fetchSubcategoriesForCategory = async (category) => {
    try {
      const response = await subcategoryAPI.getByCategory(category);
      setSubcategories(response.data);
    } catch (err) {
      console.error('Failed to fetch subcategories:', err);
    }
  };

  const handleImageChange = (e) => {
    setUploadError('');
    const files = Array.from(e.target.files || []);
    
    if (files.length + imagePreview.length > 5) {
      setUploadError('Maximum 5 images allowed');
      return;
    }

    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError(`${file.name} is not an image`);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(`${file.name} is larger than 5MB`);
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        setImagePreview(prev => [...prev, base64]);
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreview(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Please enter a product name');
      return;
    }
    if (!formData.price) {
      alert('Please enter a price');
      return;
    }
    if (!formData.stock) {
      alert('Please enter stock quantity');
      return;
    }

    try {
      console.log('Submitting product:', formData);
      
      if (editingId) {
        // Update existing product
        const response = await productAPI.update(editingId, formData, token);
        console.log('Update response:', response);
        setEditingId(null);
      } else {
        // Create new product
        const response = await productAPI.create(formData, token);
        console.log('Create response:', response);
        alert('✅ Product created successfully!');
      }
      setFormData({ name: '', description: '', price: '', category: 'BE Natural', stock: '' });
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('❌ Error: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images || []
    });
    setImagePreview(product.images || []);
    setShowForm(true);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', price: '', category: 'BE Natural', subcategory: '', stock: '', images: [] });
    setImagePreview([]);
    setUploadError('');
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id, token);
        fetchProducts();
      } catch (err) {
        console.error('Failed to delete product:', err);
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white">
        <div className="p-6">
          <h1 className="text-2xl font-bold">BE Creative SD</h1>
        </div>
        <nav className="mt-8">
          <Link to="/admin/dashboard" className="block px-6 py-3 hover:bg-slate-800 transition">
            Dashboard
          </Link>
          <Link to="/admin/products" className="block px-6 py-3 bg-slate-800">
            Products
          </Link>
          <Link to="/admin/orders" className="block px-6 py-3 hover:bg-slate-800 transition">
            Orders
          </Link>
          <Link to="/admin/payments" className="block px-6 py-3 hover:bg-slate-800 transition">
            Payment Links
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Products</h1>
          <button
            onClick={() => {
              if (showForm) {
                handleCancel();
              } else {
                setShowForm(true);
              }
            }}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border border-gray-300 rounded px-4 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="border border-gray-300 rounded px-4 py-2"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="border border-gray-300 rounded px-4 py-2"
                  required
                />
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="border border-gray-300 rounded px-4 py-2"
                >
                  <option value="BE Natural">BE Natural</option>
                  <option value="BE Custom">BE Custom</option>
                </select>
                <select
                  value={formData.subcategory}
                  onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                  className="border border-gray-300 rounded px-4 py-2"
                >
                  <option value="">No Subcategory</option>
                  {subcategories.map(sub => (
                    <option key={sub._id} value={sub.name}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded px-4 py-2 mb-6"
                rows="4"
              />

              {/* Image Upload Section */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-700">
                  📸 Product Images (Max 5 images, 5MB each)
                </label>
                
                {uploadError && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {uploadError}
                  </div>
                )}

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-input"
                  />
                  <label htmlFor="image-input" className="cursor-pointer">
                    <div className="text-gray-600">
                      <div className="text-3xl mb-2">🖼️</div>
                      <p className="font-semibold">Click or drag images here</p>
                      <p className="text-sm text-gray-500">PNG, JPG, GIF • Max 5MB each</p>
                    </div>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreview.length > 0 && (
                  <div className="mt-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      Selected Images ({imagePreview.length}/5)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {imagePreview.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg transition"
              >
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">Images</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Subcategory</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {product.images && product.images[0] ? (
                      <img src={product.images[0]} alt="product" className="w-12 h-12 object-cover rounded" />
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">{product.subcategory || '-'}</td>
                  <td className="px-6 py-4">${product.price}</td>
                  <td className="px-6 py-4">{product.stock}</td>
                  <td className="px-6 py-4 space-x-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
