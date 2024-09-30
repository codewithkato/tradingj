import React, { useState, useEffect } from 'react';
import DatabaseConnectionTest from './components/DatabaseConnectionTest';
import './App.css';
import TradeList from './components/TradeList';
import TradeForm from './components/TradeForm';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/trades`);
      setTrades(response.data);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const handleTradeAdded = (newTrade) => {
    setTrades([...trades, newTrade]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Trading Journal</h1>
      </header>
      <main>
        <TradeForm onTradeAdded={handleTradeAdded} />
        <TradeList trades={trades} />
        <DatabaseConnectionTest />
      </main>
    </div>
  );
}

export default App;