"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { DashboardHeader } from './dashboard-header';
import { IndicatorCard } from './indicator-card';
import { MarketChart } from './market-chart';
import { DashboardControls } from './dashboard-controls';

const MAX_DATA_POINTS = 50;
const INITIAL_PRICE = 150;

interface MarketDataPoint {
  time: string;
  price: number;
  ma50?: number;
}

interface Alert {
  id: number;
  type: 'above' | 'below';
  value: number;
  triggered: boolean;
}

const calculateMA = (data: number[], windowSize: number): number | undefined => {
  if (data.length < windowSize) return undefined;
  const slice = data.slice(-windowSize);
  const sum = slice.reduce((a, b) => a + b, 0);
  return sum / windowSize;
};

const DashboardPage = () => {
  const [marketData, setMarketData] = useState<MarketDataPoint[]>([]);
  const [showMA50, setShowMA50] = useState(true);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const initialData: MarketDataPoint[] = Array.from({ length: MAX_DATA_POINTS }, (_, i) => {
      const price = INITIAL_PRICE + (Math.random() - 0.5) * 5 + i * 0.2;
      return {
        time: new Date(Date.now() - (MAX_DATA_POINTS - i) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: parseFloat(price.toFixed(2)),
      };
    });
    setMarketData(initialData);

    const interval = setInterval(() => {
      setMarketData(prevData => {
        const lastPrice = prevData.length > 0 ? prevData[prevData.length - 1].price : INITIAL_PRICE;
        const newPrice = lastPrice + (Math.random() - 0.49) * 2;
        const newDataPoint: MarketDataPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          price: parseFloat(newPrice.toFixed(2)),
        };

        const updatedData = [...prevData, newDataPoint].slice(-MAX_DATA_POINTS);
        
        const prices = updatedData.map(p => p.price);
        const ma50 = calculateMA(prices, 50);
        
        if (ma50 && updatedData.length > 0) {
            updatedData[updatedData.length - 1].ma50 = parseFloat(ma50.toFixed(2));
        }

        return updatedData;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (marketData.length < 2) return;

    const latestPrice = marketData[marketData.length - 1].price;
    alerts.forEach(alert => {
      if (!alert.triggered) {
        const conditionMet = (alert.type === 'above' && latestPrice > alert.value) || (alert.type === 'below' && latestPrice < alert.value);
        if (conditionMet) {
          toast({
            title: "Price Alert Triggered!",
            description: `Price crossed ${alert.type} $${alert.value}. Current price: $${latestPrice.toFixed(2)}`,
          });
          setAlerts(prevAlerts => prevAlerts.map(a => a.id === alert.id ? { ...a, triggered: true } : a));
        }
      }
    });
  }, [marketData, alerts, toast]);

  const { latestData, priceChange, latestRSI, nonTriggeredAlertsCount } = useMemo(() => {
    const latest = marketData[marketData.length - 1];
    const previous = marketData[marketData.length - 2];
    
    let change = { value: 0, percentage: '0.00' };
    if (latest && previous) {
      const value = latest.price - previous.price;
      const percentage = previous.price !== 0 ? ((value / previous.price) * 100).toFixed(2) : '0.00';
      change = { value: parseFloat(value.toFixed(2)), percentage };
    }

    const rsi = latest ? 50 + (latest.price - INITIAL_PRICE) / 2 : 50;
    
    const alertsCount = alerts.filter(a => !a.triggered).length;

    return { latestData: latest, priceChange: change, latestRSI: rsi, nonTriggeredAlertsCount: alertsCount };
  }, [marketData, alerts]);

  const handleAddAlert = useCallback((alert: { type: 'above' | 'below', value: number }) => {
    const newAlert: Alert = {
        id: Date.now(),
        ...alert,
        triggered: false
    };
    setAlerts(prev => [...prev, newAlert]);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <IndicatorCard
            title="Current Price"
            value={latestData?.price.toFixed(2) ?? '0.00'}
            unit="$"
            change={`${priceChange.value >= 0 ? '+' : ''}${priceChange.value} (${priceChange.percentage}%)`}
            changeColor={priceChange.value >= 0 ? 'text-accent' : 'text-destructive'}
          />
          <IndicatorCard
            title="50-Period MA"
            value={latestData?.ma50?.toFixed(2) ?? 'N/A'}
            unit="$"
          />
          <IndicatorCard
            title="RSI (14)"
            value={latestRSI.toFixed(2)}
          />
           <IndicatorCard
            title="Active Alerts"
            value={nonTriggeredAlertsCount}
          />
        </div>
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <MarketChart data={marketData} showMA50={showMA50} />
          </div>
          <div className="lg:col-span-1">
            <DashboardControls
              showMA50={showMA50}
              onShowMA50Change={setShowMA50}
              onAddAlert={handleAddAlert}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
