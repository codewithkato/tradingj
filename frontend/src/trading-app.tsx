import React, { useState, useEffect } from 'react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

interface Trade {
  _id: string;
  date: string;
  pair: string;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  status: 'open' | 'closed';
  profitLoss?: number;
  notes?: string;
}

export default function Component() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    fetchTrades();
  }, []);

  const fetchTrades = async () => {
    try {
      const response = await axios.get<Trade[]>('http://localhost:5000/api/trades');
      setTrades(response.data);
    } catch (error) {
      console.error('Error fetching trades:', error);
    }
  };

  const addTrade = async (newTrade: Omit<Trade, '_id' | 'status' | 'exitPrice' | 'profitLoss'>) => {
    try {
      const response = await axios.post<Trade>('http://localhost:5000/api/trades', newTrade);
      setTrades(prevTrades => [...prevTrades, response.data]);
    } catch (error) {
      console.error('Error adding trade:', error);
    }
  };

  const closeTrade = async (id: string, exitPrice: number) => {
    try {
      const response = await axios.put<Trade>(`http://localhost:5000/api/trades/${id}/close`, { exitPrice });
      setTrades(prevTrades => prevTrades.map(trade => trade._id === id ? response.data : trade));
    } catch (error) {
      console.error('Error closing trade:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Zijmenu */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Tradejournal</h1>
          <nav className="space-y-2">
            <Button 
              onClick={() => setActiveTab('dashboard')} 
              variant={activeTab === 'dashboard' ? 'default' : 'outline'}
              className="w-full justify-start"
            >
              Dashboard
            </Button>
            <Button 
              onClick={() => setActiveTab('positions')} 
              variant={activeTab === 'positions' ? 'default' : 'outline'}
              className="w-full justify-start"
            >
              Positions
            </Button>
            <Button 
              onClick={() => setActiveTab('tradeLog')} 
              variant={activeTab === 'tradeLog' ? 'default' : 'outline'}
              className="w-full justify-start"
            >
              Trading Log
            </Button>
            <Button 
              onClick={() => setActiveTab('addTrade')} 
              variant={activeTab === 'addTrade' ? 'default' : 'outline'}
              className="w-full justify-start"
            >
              Add Trade
            </Button>
          </nav>
        </div>
      </div>

      {/* Hoofdinhoud */}
      <div className="flex-1 p-8 overflow-auto">
        {activeTab === 'dashboard' && <Dashboard trades={trades} />}
        {activeTab === 'positions' && <Positions openTrades={trades.filter(t => t.status === 'open')} onCloseTrade={closeTrade} />}
        {activeTab === 'tradeLog' && (
          <TradeLog 
            openTrades={trades.filter(t => t.status === 'open')} 
            closedTrades={trades.filter(t => t.status === 'closed')} 
            onCloseTrade={closeTrade} 
          />
        )}
        {activeTab === 'addTrade' && <AddTradeForm onAddTrade={addTrade} />}
      </div>
    </div>
  );
}

function AddTradeForm({ onAddTrade }: { onAddTrade: (trade: Omit<Trade, '_id' | 'status' | 'exitPrice' | 'profitLoss'>) => void }) {
  const [trade, setTrade] = useState({
    date: '',
    pair: '',
    type: 'long' as 'long' | 'short',
    entryPrice: 0,
    quantity: 0,
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTrade(trade);
    setTrade({ date: '', pair: '', type: 'long', entryPrice: 0, quantity: 0, notes: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTrade(prevTrade => ({
      ...prevTrade,
      [name]: name === 'entryPrice' || name === 'quantity' ? parseFloat(value) : value
    }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Trade</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input type="date" id="date" name="date" value={trade.date} onChange={handleChange} required
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="pair" className="block text-sm font-medium text-gray-700">Pair</label>
          <input type="text" id="pair" name="pair" value={trade.pair} onChange={handleChange} placeholder="e.g. BTC/USD" required
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
          <select id="type" name="type" value={trade.type} onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>
        <div>
          <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-700">Entry Price</label>
          <input type="number" id="entryPrice" name="entryPrice" value={trade.entryPrice} onChange={handleChange} step="0.01" required
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
          <input type="number" id="quantity" name="quantity" value={trade.quantity} onChange={handleChange} step="0.01" required
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea id="notes" name="notes" value={trade.notes} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
        </div>
        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Add Trade
        </button>
      </form>
    </div>
  );
}

function TradeLog({ openTrades, closedTrades, onCloseTrade }: { openTrades: Trade[], closedTrades: Trade[], onCloseTrade: (id: string, exitPrice: number) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Open Trades</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {openTrades.map((trade) => (
                <tr key={trade._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(trade.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.pair}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.entryPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => {
                      const exitPrice = parseFloat(prompt("Enter exit price") || "0");
                      if (exitPrice > 0) onCloseTrade(trade._id, exitPrice);
                    }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                      Close Trade
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Closed Trades</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {closedTrades.map((trade) => (
                <tr key={trade._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(trade.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.pair}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.entryPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.exitPrice}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{trade.profitLoss?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ trades }: { trades: Trade[] }) {
  const closedTrades = trades.filter(trade => trade.status === 'closed');
  const totalProfitLoss = closedTrades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
  const winRate = (closedTrades.filter(trade => (trade.profitLoss || 0) > 0).length / closedTrades.length) * 100 || 0;

  // Nieuwe berekeningen
  const totalClosedTrades = closedTrades.length;
  const percentProfitable = (closedTrades.filter(trade => (trade.profitLoss || 0) > 0).length / totalClosedTrades) * 100 || 0;
  const grossProfits = closedTrades.reduce((sum, trade) => sum + ((trade.profitLoss && trade.profitLoss > 0) ? trade.profitLoss : 0), 0);
  const grossLosses = Math.abs(closedTrades.reduce((sum, trade) => sum + ((trade.profitLoss && trade.profitLoss < 0) ? trade.profitLoss : 0), 0));
  const profitFactor = grossLosses !== 0 ? grossProfits / grossLosses : 0;

  const chartData = closedTrades.map(trade => ({
    date: new Date(trade.date).toLocaleDateString(),
    profitLoss: trade.profitLoss || 0
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader className="p-4">
            <CardTitle className="text-xl font-bold">Net Profit</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${totalProfitLoss.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader className="p-4">
            <CardTitle className="text-xl font-bold">Total Closed Trades</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{totalClosedTrades}</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader className="p-4">
            <CardTitle className="text-xl font-bold">Percent Profitable</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{percentProfitable.toFixed(2)}%</p>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-md rounded-lg">
          <CardHeader className="p-4">
            <CardTitle className="text-xl font-bold">Profit Factor</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-2xl font-bold">{profitFactor.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white shadow-md rounded-lg">
        <CardHeader className="p-4">
          <CardTitle className="text-xl font-bold">Profit/Loss Over Time</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="profitLoss" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Positions({ openTrades, onCloseTrade }: { openTrades: Trade[], onCloseTrade: (id: string, exitPrice: number) => void }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pair</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current P/L</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {openTrades.map((trade) => (
              <tr key={trade._id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(trade.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trade.pair}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trade.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trade.entryPrice}</td>
                <td className="px-6 py-4 whitespace-nowrap">{trade.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">Calculation needed</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => {
                    const exitPrice = parseFloat(prompt("Enter exit price") || "0");
                    if (exitPrice > 0) onCloseTrade(trade._id, exitPrice);
                  }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Close Position
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}