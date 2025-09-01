import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TransactionModal from '../components/TransactionModal';
import api from '../services/api';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00c49f', '#ffbb28'];

function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState(null); // 'INCOME', 'EXPENSE', or null

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/transactions');
      // Sort transactions by date, newest first
      const sortedTransactions = response.data.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
      setTransactions(sortedTransactions);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // useMemo will recalculate chart data only when transactions change
  const { totalIncome, totalExpenses, expenseData, summaryData } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expData = transactions
      .filter(t => t.type === 'EXPENSE')
      .map(t => ({ name: t.name, value: t.amount }));

    const sumData = [
      { name: 'Income', value: income, fill: '#82ca9d' }, // Color for Income bar
      { name: 'Expenses', value: expenses, fill: '#ff8042' }, // Color for Expense bar
    ];
    
    return { totalIncome: income, totalExpenses: expenses, expenseData: expData, summaryData: sumData };
  }, [transactions]);

  const handleSaveTransaction = async (transaction) => {
    try {
      await api.post('/transactions', transaction);
      fetchTransactions(); // Refetch data to update the dashboard
    } catch (error) {
      console.error("Failed to save transaction", error);
      alert("Error: Could not save the transaction. Please try again.");
    }
  };
  
  if (loading) {
    return <div className="loading-container">Loading your financial dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Your Financial Overview</h2>
        <div className="dashboard-actions">
          <button className="btn-secondary" onClick={() => setModalMode('INCOME')}>+ Add Income</button>
          <button className="btn-submit" onClick={() => setModalMode('EXPENSE')}>+ Add Expense</button>
        </div>
      </div>

      {/* --- Charts Section --- */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Income vs. Expenses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summaryData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="name" stroke="var(--text-color-darker)" />
              <YAxis stroke="var(--text-color-darker)" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }} />
              <Legend />
              {/* Bars will now use the fill color defined in their data */}
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h3>Expense Breakdown</h3>
          {/* Pie chart remains the same */}
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data-message">No expense data to display.</div>
          )}
        </div>
      </div>
      
      {/* --- NEW: All Transactions Table --- */}
      <div className="transactions-table-container">
        <h3>All Transactions</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.name}</td>
                  <td>
                    <span className={`pill ${tx.type.toLowerCase()}`}>{tx.type}</span>
                  </td>
                  <td className={`transaction-amount ${tx.type.toLowerCase()}`}>
                    ₹{Number(tx.amount).toLocaleString()}
                  </td>
                  <td>{new Date(tx.transactionDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Modal Section --- */}
      {modalMode && (
        <TransactionModal
          mode={modalMode}
          onClose={() => setModalMode(null)}
          onSave={handleSaveTransaction}
        />
      )}
    </div>
  );
}

export default DashboardPage;

