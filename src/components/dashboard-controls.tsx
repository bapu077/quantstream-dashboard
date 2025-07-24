"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BellRing, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface DashboardControlsProps {
  showMA50: boolean;
  onShowMA50Change: (value: boolean) => void;
  onAddAlert: (alert: { type: 'above' | 'below', value: number }) => void;
}

export const DashboardControls = ({ showMA50, onShowMA50Change, onAddAlert }: DashboardControlsProps) => {
  const [alertValue, setAlertValue] = React.useState('');
  const [alertType, setAlertType] = React.useState<'above' | 'below'>('above');
  const [isAlertSet, setIsAlertSet] = React.useState(false);

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(alertValue);
    if (!isNaN(value) && value > 0) {
      onAddAlert({ type: alertType, value });
      setIsAlertSet(true);
      setTimeout(() => setIsAlertSet(false), 2000);
      setAlertValue('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controls & Alerts</CardTitle>
        <CardDescription>Toggle indicators and set price alerts.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-md font-medium">Indicators</h3>
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <Label htmlFor="ma50-toggle" className="font-normal">Show 50-Period MA</Label>
            <Switch id="ma50-toggle" checked={showMA50} onCheckedChange={onShowMA50Change} />
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <h3 className="text-md font-medium">Price Alerts</h3>
          <form onSubmit={handleAddAlert} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="alert-type" className="text-xs">Condition</Label>
                 <Select value={alertType} onValueChange={(v) => setAlertType(v as 'above' | 'below')}>
                    <SelectTrigger id="alert-type">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Price Above</SelectItem>
                      <SelectItem value="below">Price Below</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
              <div>
                <Label htmlFor="alert-value" className="text-xs">Value</Label>
                <Input id="alert-value" type="number" placeholder="e.g., 150.50" value={alertValue} onChange={(e) => setAlertValue(e.target.value)} step="0.01" />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isAlertSet || !alertValue}>
              {isAlertSet ? <Check className="mr-2 h-4 w-4" /> : <BellRing className="mr-2 h-4 w-4" />}
              {isAlertSet ? 'Alert Set!' : 'Set Alert'}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
