import React, { useState, useEffect } from 'react';
import api from '../services/api';

function TransactionModal({ mode, onClose, onSave }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]); // State for categories

  // Fetch categories when the modal opens for an expense
  useEffect(() => {
    if (mode === 'EXPENSE') {
      const fetchCategories = async () => {
        try {
          const response = await api.get('/categories');
          setCategories(response.data);
        } catch (error) {
          console.error("Failed to fetch categories", error);
        }
      };
      fetchCategories();
    }
  }, [mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const transactionData = { name, amount, type: mode };
    // Create a simplified category object to send to backend
    if (mode === 'EXPENSE') {
      if (!categoryId) {
        alert("Please select a category for the expense.");
        return;
      }
      transactionData.category = { id: categoryId };
    }
    onSave(transactionData);
    onClose();
  };

  const title = mode === 'INCOME' ? 'Add New Income' : 'Add New Expense';

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{title}</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0" />

          {mode === 'EXPENSE' && (
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
              <option value="" disabled>Select a Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;