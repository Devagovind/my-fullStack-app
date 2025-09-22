// FILE: src/pages/BudgetPage.js
import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBudgetsAndCategories = useCallback(async () => {
    setLoading(true);
    try {
      // Now we fetch the real budget data which includes categories and spending
      const response = await api.get('/budgets');
      setBudgets(response.data);
    } catch (error) {
      console.error("Failed to fetch budget data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgetsAndCategories();
  }, [fetchBudgetsAndCategories]);

  const handleSetBudget = async (categoryId, newAmount) => {
    try {
      await api.post('/budgets', { categoryId, amount: newAmount });
      // Refresh data after setting a new budget
      fetchBudgetsAndCategories();
    } catch (error) {
      console.error("Failed to set budget", error);
      alert("Could not update budget. Please try again.");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', { name: newCategoryName });
      setNewCategoryName('');
      fetchBudgetsAndCategories(); // Refresh the list to show the new category with a zero budget
    } catch (error) {
      alert('Failed to add category. It might already exist.');
    }
  };

  if (loading) {
    return <div className="loading-container">Loading your budgets...</div>;
  }

  return (
    <div className="budget-page-container">
      <div className="page-header">
        <h2>Manage Your Budgets</h2>
        <p>Set a monthly spending limit for each category to stay on track.</p>
      </div>

      <div className="budget-list">
        {budgets.map(budget => {
          const percentage = budget.budgetAmount > 0 ? Math.min((budget.spentAmount / budget.budgetAmount) * 100, 100) : 0;
          const progressBarColor = percentage > 90 ? 'var(--danger-color)' : percentage > 70 ? '#ffc107' : 'var(--primary-color)';

          return (
            <div key={budget.categoryId} className="budget-item">
              <div className="budget-info">
                <span className="category-name">{budget.categoryName}</span>
                <span className="budget-amount">
                  ₹{Number(budget.spentAmount).toLocaleString()} / ₹{Number(budget.budgetAmount).toLocaleString()}
                </span>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${percentage}%`, backgroundColor: progressBarColor }}></div>
              </div>
              <div className="budget-setter">
                 <input
                    type="number"
                    defaultValue={budget.budgetAmount}
                    // Use onBlur to save when the user clicks away
                    onBlur={(e) => handleSetBudget(budget.categoryId, e.target.value)}
                    placeholder="Set Budget"
                 />
              </div>
            </div>
          );
        })}
      </div>

      <div className="add-category-form">
          <h3>Add New Category</h3>
          <form onSubmit={handleAddCategory}>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="e.g., Shopping, Health"
                required
              />
              <button type="submit" className="btn-submit">Add Category</button>
          </form>
      </div>
    </div>
  );
}

export default BudgetPage;