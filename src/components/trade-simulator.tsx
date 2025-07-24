
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

interface TradeSimulatorProps {
  currentPrice: number | undefined;
  balance: number;
  holdings: number;
  onBuy: (quantity: number) => void;
  onSell: (quantity: number) => void;
}

export const TradeSimulator = ({ currentPrice, balance, holdings, onBuy, onSell }: TradeSimulatorProps) => {
  const [quantity, setQuantity] = useState('1');

  const handleTrade = (type: 'buy' | 'sell') => {
    const numQuantity = parseFloat(quantity);
    if (!isNaN(numQuantity) && numQuantity > 0) {
      if (type === 'buy') {
        onBuy(numQuantity);
      } else {
        onSell(numQuantity);
      }
    }
  };

  const tradeValue = (currentPrice ?? 0) * parseFloat(quantity || '0');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Simulator</CardTitle>
        <CardDescription>Paper trade based on live market data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="quantity">Quantity</Label>
          <Input 
            id="quantity" 
            type="number" 
            value={quantity} 
            onChange={(e) => setQuantity(e.target.value)} 
            placeholder="e.g., 10" 
            min="0"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Est. Trade Value: ${tradeValue.toFixed(2)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="default"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => handleTrade('buy')}
            disabled={!currentPrice || !quantity || parseFloat(quantity) <= 0 || parseFloat(quantity) * currentPrice > balance}
          >
            <ArrowUp className="mr-2" /> Buy
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => handleTrade('sell')}
            disabled={!currentPrice || !quantity || parseFloat(quantity) <= 0 || parseFloat(quantity) > holdings}
          >
            <ArrowDown className="mr-2" /> Sell
          </Button>
        </div>
        <div className="text-sm space-y-1 text-muted-foreground">
            <p><strong>Current Price:</strong> ${currentPrice?.toFixed(2) ?? 'N/A'}</p>
            <p><strong>Cash Balance:</strong> ${balance.toFixed(2)}</p>
            <p><strong>Holdings:</strong> {holdings.toFixed(4)} shares</p>
        </div>
      </CardContent>
    </Card>
  );
};
