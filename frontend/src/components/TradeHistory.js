import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./ui/table";

function TradeHistory({ trades }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Pair</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Entry Price</TableHead>
          <TableHead>Exit Price</TableHead>
          <TableHead>Quantity</TableHead>
          <TableHead>Profit/Loss</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade, index) => (
          <TableRow key={index}>
            <TableCell>{trade.date}</TableCell>
            <TableCell>{trade.pair}</TableCell>
            <TableCell>{trade.type}</TableCell>
            <TableCell>{trade.entryPrice}</TableCell>
            <TableCell>{trade.exitPrice}</TableCell>
            <TableCell>{trade.quantity}</TableCell>
            <TableCell className={trade.profitLoss >= 0 ? 'text-green-500' : 'text-red-500'}>
              ${trade.profitLoss?.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default TradeHistory;