import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TradeList.css'; // Maak dit bestand aan voor styling

const API_BASE_URL = 'http://localhost:5000/api';

function TradeList() {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/trades`);
        setTrades(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching trades. Please try again later.');
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  if (loading) return <div className="loading">Loading trades...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="trade-list">
      <h2>Trades</h2>
      {trades.length === 0 ? (
        <p>No trades found. Add some trades to get started!</p>
      ) : (
        <ul>
          {trades.map((trade) => (
            <li key={trade._id} className="trade-item">
              <h3>{trade.pair}</h3>
              <p>Type: {trade.type}</p>
              <p>Entry: ${trade.entryPrice}</p>
              <p>Exit: ${trade.exitPrice || 'Open'}</p>
              <p>Profit/Loss: ${trade.profitLoss ? trade.profitLoss.toFixed(2) : 'N/A'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TradeList;