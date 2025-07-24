
"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Play, Pause, RefreshCw } from "lucide-react";
import { ReplayState } from "@/hooks/use-market-data";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HistoricalReplayControlsProps {
  mode: 'live' | 'historical';
  onModeChange: (mode: 'live' | 'historical') => void;
  replayState: ReplayState;
  onTogglePlayback: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export const HistoricalReplayControls = ({
  mode,
  onModeChange,
  replayState,
  onTogglePlayback,
  onSpeedChange,
  onReset
}: HistoricalReplayControlsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Source</CardTitle>
        <CardDescription>Switch between live simulation and historical replay.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={mode} onValueChange={(value) => onModeChange(value as 'live' | 'historical')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="live">Live Simulation</TabsTrigger>
            <TabsTrigger value="historical">Historical Replay</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {mode === 'historical' && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="grid grid-cols-3 gap-2 items-center">
              <Button onClick={onTogglePlayback} variant="outline" className="col-span-1">
                {replayState.isPlaying ? <Pause className="mr-2" /> : <Play className="mr-2" />}
                {replayState.isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={onReset} variant="outline" className="col-span-1">
                <RefreshCw className="mr-2" /> Reset
              </Button>
               <div className="col-span-1">
                <Select
                  value={String(replayState.speed)}
                  onValueChange={(value) => onSpeedChange(Number(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1x Speed</SelectItem>
                    <SelectItem value="5">5x Speed</SelectItem>
                    <SelectItem value="10">10x Speed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div className="text-xs text-muted-foreground text-center">
                Progress: {replayState.currentIndex} / {replayState.total}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
