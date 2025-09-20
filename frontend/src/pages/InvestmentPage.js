// FILE: src/pages/InvestmentPage.js
import React, { useState, useEffect } from 'react';
import api from '../services/api'; // Use our central API service

function InvestmentPage() {
  const [investmentOptions, setInvestmentOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await api.get('/investments'); // Fetch from our new endpoint
        setInvestmentOptions(response.data);
      } catch (error) {
        console.error("Failed to fetch investment opportunities", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  if (loading) {
    return <div className="loading-container">Loading investment opportunities...</div>;
  }

  return (
    <div className="investment-page-container">
      <div className="investment-header">
        <h2>Explore Investment Opportunities</h2>
        <p>Learn about common ways to grow your savings. This is for educational purposes only and is not financial advice.</p>
      </div>
      <div className="investment-grid">
        {investmentOptions.map(option => (
          <div key={option.id} className="investment-card">
            <div className={`risk-level ${option.risk.toLowerCase().replace(/ /g, '-')}`}>
              {option.risk} Risk
            </div>
            <h3>{option.title}</h3>
            <p>{option.description}</p>
            <a href={option.learnMoreUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Learn More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InvestmentPage;