import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  if (loading) return <div className="text-center py-4">Loading trades...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Trades</h2>
      {trades.length === 0 ? (
        <p className="text-gray-700">No trades found. Add some trades to get started!</p>
      ) : (
        <ul className="space-y-4">
          {trades.map((trade) => (
            <li key={trade._id} className="border-b pb-4">
              <h3 className="text-xl font-semibold">{trade.pair}</h3>
              <p className="text-gray-700">Type: {trade.type}</p>
              <p className="text-gray-700">Entry: ${trade.entryPrice}</p>
              <p className="text-gray-700">Exit: ${trade.exitPrice || 'Open'}</p>
              <p className={`font-bold ${trade.profitLoss > 0 ? 'text-green-500' : 'text-red-500'}`}>
                Profit/Loss: ${trade.profitLoss ? trade.profitLoss.toFixed(2) : 'N/A'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TradeList;