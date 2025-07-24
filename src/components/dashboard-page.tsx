
"use client";

import React, { useState } from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { useTradingSimulator } from '@/hooks/use-trading-simulator';
import { DashboardHeader } from './dashboard-header';
import { IndicatorCard } from './indicator-card';
import { MarketChart } from './market-chart';
import { DashboardControls } from './dashboard-controls';
import { TradeSimulator } from './trade-simulator';
import { TradeHistoryTable } from './trade-history-table';
import { HistoricalReplayControls } from './historical-replay-controls';

const DashboardPage = () => {
  const [showMA50, setShowMA50] = useState(true);
  const { 
    marketData, 
    latestData, 
    priceChange, 
    nonTriggeredAlertsCount, 
    handleAddAlert,
    mode,
    setMode,
    replayState,
    togglePlayback,
    setReplaySpeed,
    resetReplay
  } = useMarketData();
  
  const {
    balance,
    holdings,
    portfolioValue,
    totalValue,
    realizedPnl,
    trades,
    buy,
    sell,
  } = useTradingSimulator(latestData?.price);


  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 overflow-y-auto">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          <IndicatorCard
            title="Current Price"
            value={latestData?.price.toFixed(2) ?? '0.00'}
            unit="$"
            change={`${priceChange.value >= 0 ? '+' : ''}${priceChange.value} (${priceChange.percentage}%)`}
            changeType={priceChange.value >= 0 ? 'positive' : 'negative'}
          />
          <IndicatorCard
            title="Total Equity"
            value={totalValue.toFixed(2)}
            unit="$"
            subtitle="Portfolio + Cash"
          />
           <IndicatorCard
            title="Realized P/L"
            value={realizedPnl.toFixed(2)}
            unit="$"
            changeType={realizedPnl >= 0 ? 'positive' : 'negative'}
          />
           <IndicatorCard
            title="Holdings"
            value={holdings.toFixed(4)}
            unit="shares"
            subtitle={`Value: $${portfolioValue.toFixed(2)}`}
          />
           <IndicatorCard
            title="Active Alerts"
            value={nonTriggeredAlertsCount}
          />
        </div>
        <div className="grid gap-4 md:gap-6 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2 space-y-6">
            <MarketChart data={marketData} showMA50={showMA50} />
            <TradeHistoryTable trades={trades} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <DashboardControls
              showMA50={showMA50}
              onShowMA50Change={setShowMA50}
              onAddAlert={handleAddAlert}
            />
            <HistoricalReplayControls
              mode={mode}
              onModeChange={setMode}
              replayState={replayState}
              onTogglePlayback={togglePlayback}
              onSpeedChange={setReplaySpeed}
              onReset={resetReplay}
            />
             <TradeSimulator
                currentPrice={latestData?.price}
                onBuy={buy}
                onSell={sell}
                balance={balance}
                holdings={holdings}
              />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
