import React, { useState, useEffect, useCallback } from 'react';
import { subcategoryAPI } from '../services/api';

export default function SubcategoryManager({ token }) {
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState({ name: '', category: 'BE Natural' });
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchSubcategories = useCallback(async () => {
    try {
      const response = await subcategoryAPI.getAll();
      setSubcategories(response.data);
    } catch (err) {
      console.error('Failed to fetch subcategories:', err);
      showMessage('Failed to load subcategories', 'error');
    }
  }, []);

  useEffect(() => {
    fetchSubcategories();
  }, [fetchSubcategories]);

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    
    if (!newSubcategory.name.trim()) {
      showMessage('Please enter a subcategory name', 'error');
      return;
    }

    setLoading(true);
    try {
      await subcategoryAPI.create(newSubcategory, token);
      showMessage('✓ Subcategory added successfully!', 'success');
      setNewSubcategory({ name: '', category: 'BE Natural' });
      fetchSubcategories();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to add subcategory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubcategory = async (id) => {
    if (!editingName.trim()) {
      showMessage('Please enter a subcategory name', 'error');
      return;
    }

    setLoading(true);
    try {
      await subcategoryAPI.update(id, { name: editingName }, token);
      showMessage('✓ Subcategory updated successfully!', 'success');
      setEditingId(null);
      fetchSubcategories();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to update subcategory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;

    setLoading(true);
    try {
      await subcategoryAPI.delete(id, token);
      showMessage('✓ Subcategory deleted successfully!', 'success');
      fetchSubcategories();
    } catch (err) {
      showMessage(err.response?.data?.error || 'Failed to delete subcategory', 'error');
    } finally {
      setLoading(false);
    }
  };

  const naturalSubcategories = subcategories.filter(sub => sub.category === 'BE Natural');
  const customSubcategories = subcategories.filter(sub => sub.category === 'BE Custom');

  return (
    <div className="space-y-6">
      {/* Message */}
      {message && (
        <div className={`p-4 rounded ${messageType === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}

      {/* Add New Subcategory */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-bold mb-4">Add New Subcategory</h3>
        <form onSubmit={handleAddSubcategory} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={newSubcategory.category}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, category: e.target.value })}
                className="w-full px-3 py-2 border rounded"
              >
                <option value="BE Natural">BE Natural</option>
                <option value="BE Custom">BE Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subcategory Name</label>
              <input
                type="text"
                value={newSubcategory.name}
                onChange={(e) => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                placeholder="e.g., Skincare, Supplements"
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Subcategory'}
          </button>
        </form>
      </div>

      {/* BE Natural Subcategories */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-bold mb-4 text-green-600">BE Natural Subcategories</h3>
        {naturalSubcategories.length > 0 ? (
          <div className="space-y-2">
            {naturalSubcategories.map(sub => (
              <div key={sub._id} className="flex items-center justify-between bg-gray-50 p-4 rounded">
                {editingId === sub._id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-3 py-1 border rounded"
                    autoFocus
                  />
                ) : (
                  <span className="flex-1">{sub.name}</span>
                )}
                <div className="space-x-2">
                  {editingId === sub._id ? (
                    <>
                      <button
                        onClick={() => handleUpdateSubcategory(sub._id)}
                        disabled={loading}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(sub._id);
                          setEditingName(sub.name);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubcategory(sub._id)}
                        disabled={loading}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No subcategories yet</p>
        )}
      </div>

      {/* BE Custom Subcategories */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-bold mb-4 text-blue-600">BE Custom Subcategories</h3>
        {customSubcategories.length > 0 ? (
          <div className="space-y-2">
            {customSubcategories.map(sub => (
              <div key={sub._id} className="flex items-center justify-between bg-gray-50 p-4 rounded">
                {editingId === sub._id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 px-3 py-1 border rounded"
                    autoFocus
                  />
                ) : (
                  <span className="flex-1">{sub.name}</span>
                )}
                <div className="space-x-2">
                  {editingId === sub._id ? (
                    <>
                      <button
                        onClick={() => handleUpdateSubcategory(sub._id)}
                        disabled={loading}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(sub._id);
                          setEditingName(sub.name);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubcategory(sub._id)}
                        disabled={loading}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No subcategories yet</p>
        )}
      </div>
    </div>
  );
}
