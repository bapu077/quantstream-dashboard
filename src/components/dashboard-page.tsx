"use client";

import React, { useState, useCallback } from 'react';
import { useMarketData } from '@/hooks/use-market-data';
import { DashboardHeader } from './dashboard-header';
import { IndicatorCard } from './indicator-card';
import { MarketChart } from './market-chart';
import { DashboardControls } from './dashboard-controls';

const DashboardPage = () => {
  const [showMA50, setShowMA50] = useState(true);
  const { marketData, latestData, priceChange, nonTriggeredAlertsCount, handleAddAlert, volatility } = useMarketData();

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
            title="Volatility (14d)"
            value={volatility?.toFixed(2) ?? 'N/A'}
            unit="σ"
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
