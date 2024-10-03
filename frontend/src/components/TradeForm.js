import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function TradeForm({ onTradeAdded }) {
  const [trade, setTrade] = useState({
    pair: '',
    type: 'long',
    entryPrice: '',
    exitPrice: '',
    quantity: '',
    date: '',
    notes: '',
    stopLoss: '',
    takeProfit: '',
    fees: ''
  });

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setTrade({ ...trade, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!trade.pair || !trade.type || !trade.entryPrice || !trade.quantity || !trade.date) {
        console.error('Please fill in all required fields');
        return;
      }

      const tradeData = Object.fromEntries(
        Object.entries(trade).filter(([_, v]) => v !== '')
      );

      console.log('Sending trade data:', tradeData);

      const response = await axios.post(`${API_BASE_URL}/trades`, tradeData);
      console.log('Trade added:', response.data);
      onTradeAdded(response.data);
      setTrade({
        pair: '',
        type: 'long',
        entryPrice: '',
        exitPrice: '',
        quantity: '',
        date: '',
        notes: '',
        stopLoss: '',
        takeProfit: '',
        fees: ''
      });
    } catch (error) {
      console.error('Error adding trade:', error);
      // Error handling remains the same
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-4">Add New Trade</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="pair" className="block text-gray-700 text-sm font-bold mb-2">Pair:</label>
          <input
            type="text"
            id="pair"
            name="pair"
            value={trade.pair}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Type:</label>
          <select
            id="type"
            name="type"
            value={trade.type}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>
        <div>
          <label htmlFor="entryPrice" className="block text-gray-700 text-sm font-bold mb-2">Entry Price:</label>
          <input
            type="number"
            id="entryPrice"
            name="entryPrice"
            value={trade.entryPrice}
            onChange={handleChange}
            step="0.01"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="exitPrice" className="block text-gray-700 text-sm font-bold mb-2">Exit Price:</label>
          <input
            type="number"
            id="exitPrice"
            name="exitPrice"
            value={trade.exitPrice}
            onChange={handleChange}
            step="0.01"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={trade.quantity}
            onChange={handleChange}
            step="0.01"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={trade.date}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-gray-700 text-sm font-bold mb-2">Notes:</label>
          <textarea
            id="notes"
            name="notes"
            value={trade.notes}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add Trade
        </button>
      </form>
    </div>
  );
}

export default TradeForm;