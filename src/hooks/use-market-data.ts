
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { historicalData } from '@/data/historical-aapl';

const MAX_DATA_POINTS = 50;
const INITIAL_PRICE = 150;
const VOLATILITY_WINDOW = 14;

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

interface MacdData {
    macd?: number;
    signal?: number;
    histogram?: number;
}

export interface ReplayState {
    isPlaying: boolean;
    speed: number;
    currentIndex: number;
    total: number;
}

const calculateMA = (data: number[], windowSize: number): number | undefined => {
  if (data.length < windowSize) return undefined;
  const slice = data.slice(-windowSize);
  const sum = slice.reduce((a, b) => a + b, 0);
  return sum / windowSize;
};

const calculateVolatility = (data: number[], windowSize: number): number | undefined => {
    if (data.length < windowSize) return undefined;
    const slice = data.slice(-windowSize);
    const mean = slice.reduce((a, b) => a + b, 0) / windowSize;
    const squaredDiffs = slice.map(price => Math.pow(price - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / windowSize;
    return Math.sqrt(variance);
};

const calculateEMA = (data: number[], period: number): number[] => {
    const k = 2 / (period + 1);
    const emaArray: number[] = [];
    if (data.length > 0) {
        emaArray.push(data[0]);
        for (let i = 1; i < data.length; i++) {
            const ema = data[i] * k + emaArray[i - 1] * (1 - k);
            emaArray.push(ema);
        }
    }
    return emaArray;
}

const generateInitialLiveDate = () => {
    return Array.from({ length: MAX_DATA_POINTS }, (_, i) => {
      const price = INITIAL_PRICE + (Math.random() - 0.5) * 5 + i * 0.2;
      return {
        time: new Date(Date.now() - (MAX_DATA_POINTS - i) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: parseFloat(price.toFixed(2)),
      };
    });
}

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<MarketDataPoint[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [mode, setMode] = useState<'live' | 'historical'>('live');
  const [replayState, setReplayState] = useState<ReplayState>({
      isPlaying: false,
      speed: 1,
      currentIndex: 0,
      total: historicalData.length
  });

  const { toast } = useToast();
  const liveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const replayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const processNewDataPoint = (newDataPoint: MarketDataPoint) => {
    setMarketData(prevData => {
      const updatedData = [...prevData, newDataPoint].slice(-MAX_DATA_POINTS);
      const prices = updatedData.map(p => p.price);
      const ma50 = calculateMA(prices, 50);
      if (ma50 && updatedData.length > 0) {
          updatedData[updatedData.length - 1].ma50 = parseFloat(ma50.toFixed(2));
      }
      return updatedData;
    });
  };

  const startLiveMode = useCallback(() => {
    if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    
    setMarketData(generateInitialLiveDate());

    liveIntervalRef.current = setInterval(() => {
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
  }, []);

  const startHistoricalMode = useCallback(() => {
    if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
    if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    
    const initialHistData = historicalData.slice(0, MAX_DATA_POINTS).map(d => ({
        time: new Date(d.Date).toLocaleTimeString(),
        price: d.Close
    }));
    setMarketData(initialHistData);
    setReplayState(prev => ({ ...prev, isPlaying: true, currentIndex: MAX_DATA_POINTS }));

  }, []);

  useEffect(() => {
    if (mode === 'live') {
      startLiveMode();
    } else {
      startHistoricalMode();
    }
    return () => {
      if (liveIntervalRef.current) clearInterval(liveIntervalRef.current);
      if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    };
  }, [mode, startLiveMode, startHistoricalMode]);

  useEffect(() => {
    if (mode === 'historical' && replayState.isPlaying) {
      if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
      replayIntervalRef.current = setInterval(() => {
        setReplayState(prev => {
          if (prev.currentIndex >= historicalData.length -1) {
            if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
            return { ...prev, isPlaying: false };
          }
          const nextIndex = prev.currentIndex + 1;
          const point = historicalData[nextIndex];
          const newDataPoint: MarketDataPoint = {
            time: new Date(point.Date).toLocaleTimeString(),
            price: point.Close
          };
          processNewDataPoint(newDataPoint);
          return { ...prev, currentIndex: nextIndex };
        });
      }, 1000 / replayState.speed);
    } else if (replayIntervalRef.current) {
        clearInterval(replayIntervalRef.current);
    }
    return () => {
        if (replayIntervalRef.current) clearInterval(replayIntervalRef.current);
    }
  }, [mode, replayState.isPlaying, replayState.speed]);


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

  const { latestData, priceChange, nonTriggeredAlertsCount, volatility, macd } = useMemo(() => {
    if (marketData.length === 0) {
        return {
            latestData: { price: 0, time: '' },
            priceChange: { value: 0, percentage: '0.00' },
            nonTriggeredAlertsCount: 0,
            volatility: undefined,
            macd: {}
        };
    }
    const latest = marketData[marketData.length - 1];
    const previous = marketData.length > 1 ? marketData[marketData.length - 2] : latest;
    
    let change = { value: 0, percentage: '0.00' };
    if (latest && previous) {
      const value = latest.price - previous.price;
      const percentage = previous.price !== 0 ? ((value / previous.price) * 100).toFixed(2) : '0.00';
      change = { value: parseFloat(value.toFixed(2)), percentage };
    }
    
    const alertsCount = alerts.filter(a => !a.triggered).length;
    const prices = marketData.map(p => p.price);
    const currentVolatility = calculateVolatility(prices, VOLATILITY_WINDOW);

    let macdData: MacdData = {};
    if (prices.length >= 26) {
        const ema12 = calculateEMA(prices, 12);
        const ema26 = calculateEMA(prices, 26);
        const macdLine = ema12.map((val, index) => val - ema26[index]);
        const signalLine = calculateEMA(macdLine, 9);
        const histogram = macdLine.map((val, index) => val - signalLine[index]);

        macdData = {
            macd: macdLine[macdLine.length -1],
            signal: signalLine[signalLine.length - 1],
            histogram: histogram[histogram.length -1],
        }
    }

    return { 
        latestData: latest, 
        priceChange: change, 
        nonTriggeredAlertsCount: alertsCount, 
        volatility: currentVolatility,
        macd: macdData
    };
  }, [marketData, alerts]);

  const handleAddAlert = useCallback((alert: { type: 'above' | 'below', value: number }) => {
    const newAlert: Alert = {
        id: Date.now(),
        ...alert,
        triggered: false
    };
    setAlerts(prev => [...prev, newAlert]);
  }, []);
  
  const togglePlayback = useCallback(() => {
    setReplayState(prev => ({...prev, isPlaying: !prev.isPlaying}))
  }, []);

  const setReplaySpeed = useCallback((speed: number) => {
    setReplayState(prev => ({...prev, speed}));
  }, []);

  const resetReplay = useCallback(() => {
      startHistoricalMode();
  }, [startHistoricalMode]);


  return { 
      marketData, 
      latestData, 
      priceChange, 
      nonTriggeredAlertsCount, 
      handleAddAlert, 
      volatility, 
      macd,
      mode,
      setMode,
      replayState,
      togglePlayback,
      setReplaySpeed,
      resetReplay
    };
};
