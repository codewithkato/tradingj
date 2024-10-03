import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

function Dashboard({ trades }) {
  const totalProfitLoss = trades.reduce((sum, trade) => sum + (trade.profitLoss || 0), 0);
  const winRate = (trades.filter(trade => trade.profitLoss > 0).length / trades.length) * 100 || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Profit/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${totalProfitLoss.toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{winRate.toFixed(2)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{trades.length}</p>
          </CardContent>
        </Card>
      </div>
      {/* Hier kun je meer statistieken of grafieken toevoegen */}
    </div>
  );
}

export default Dashboard;