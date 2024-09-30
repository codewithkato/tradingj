import React, { useState } from 'react';
import axios from 'axios';
import './TradeForm.css';

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
      // Voeg client-side validatie toe
      if (!trade.pair || !trade.type || !trade.entryPrice || !trade.quantity || !trade.date) {
        console.error('Please fill in all required fields');
        return;
      }

      // Verwijder lege velden voordat we de data versturen
      const tradeData = Object.fromEntries(
        Object.entries(trade).filter(([_, v]) => v !== '')
      );

      console.log('Sending trade data:', tradeData);

      const response = await axios.post(`${API_BASE_URL}/trades`, tradeData);
      console.log('Trade added:', response.data);
      onTradeAdded(response.data);
      // Reset form
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
      if (error.response) {
        // De request is gemaakt en de server heeft geantwoord met een status code
        // die buiten het bereik van 2xx valt
        console.error('Server responded with:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        // De request is gemaakt maar er is geen antwoord ontvangen
        console.error('No response received:', error.request);
      } else {
        // Er is iets misgegaan bij het opzetten van de request
        console.error('Error setting up the request:', error.message);
      }
    }
  };

  return (
    <div className="trade-form">
      <h2>Add New Trade</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pair">Pair:</label>
          <input
            type="text"
            id="pair"
            name="pair"
            value={trade.pair}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            name="type"
            value={trade.type}
            onChange={handleChange}
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="entryPrice">Entry Price:</label>
          <input
            type="number"
            id="entryPrice"
            name="entryPrice"
            value={trade.entryPrice}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="exitPrice">Exit Price:</label>
          <input
            type="number"
            id="exitPrice"
            name="exitPrice"
            value={trade.exitPrice}
            onChange={handleChange}
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label htmlFor="quantity">Quantity:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={trade.quantity}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={trade.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            name="notes"
            value={trade.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Add Trade</button>
      </form>
    </div>
  );
}

export default TradeForm;