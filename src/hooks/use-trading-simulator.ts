
"use client";

import { useState, useMemo, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export interface Trade {
  id: number;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
  value: number;
}

const INITIAL_BALANCE = 10000;

export const useTradingSimulator = (currentPrice: number | undefined) => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [holdings, setHoldings] = useState(0); // Quantity of asset held
  const [trades, setTrades] = useState<Trade[]>([]);
  const [realizedPnl, setRealizedPnl] = useState(0);
  const { toast } = useToast();

  const portfolioValue = useMemo(() => {
    return holdings * (currentPrice ?? 0);
  }, [holdings, currentPrice]);

  const totalValue = useMemo(() => {
    return balance + portfolioValue;
  }, [balance, portfolioValue]);

  const buy = useCallback((quantity: number) => {
    if (!currentPrice || quantity <= 0) return;

    const cost = quantity * currentPrice;
    if (cost > balance) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You need $${cost.toFixed(2)} but only have $${balance.toFixed(2)}.`,
      });
      return;
    }

    setBalance(prev => prev - cost);
    setHoldings(prev => prev + quantity);

    const newTrade: Trade = {
      id: Date.now(),
      type: 'buy',
      quantity,
      price: currentPrice,
      timestamp: new Date().toLocaleTimeString(),
      value: cost,
    };
    setTrades(prev => [newTrade, ...prev]);
    toast({
      title: "Trade Executed",
      description: `Bought ${quantity.toFixed(4)} shares at $${currentPrice.toFixed(2)}.`,
    });
  }, [currentPrice, balance, toast]);

  const sell = useCallback((quantity: number) => {
    if (!currentPrice || quantity <= 0) return;

    if (quantity > holdings) {
      toast({
        variant: "destructive",
        title: "Insufficient Holdings",
        description: `You can't sell more than you own.`,
      });
      return;
    }

    const revenue = quantity * currentPrice;
    const averageCostPerShare = trades
      .filter(t => t.type === 'buy')
      .reduce((acc, trade) => acc + trade.value, 0) / holdings;

    const costOfGoodsSold = averageCostPerShare * quantity;
    const pnl = revenue - costOfGoodsSold;

    setRealizedPnl(prev => prev + pnl);
    setBalance(prev => prev + revenue);
    setHoldings(prev => prev - quantity);

    const newTrade: Trade = {
      id: Date.now(),
      type: 'sell',
      quantity,
      price: currentPrice,
      timestamp: new Date().toLocaleTimeString(),
      value: revenue,
    };
    setTrades(prev => [newTrade, ...prev]);
    toast({
        title: "Trade Executed",
        description: `Sold ${quantity.toFixed(4)} shares at $${currentPrice.toFixed(2)}.`,
    });
  }, [currentPrice, holdings, toast, trades]);

  return {
    balance,
    holdings,
    portfolioValue,
    totalValue,
    realizedPnl,
    trades,
    buy,
    sell,
  };
};
