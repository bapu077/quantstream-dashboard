import { LineChart } from 'lucide-react';

export const DashboardHeader = () => {
  return (
    <header className="flex items-center p-4 border-b border-border flex-shrink-0">
      <div className="p-2 bg-primary/20 rounded-lg">
        <LineChart className="h-6 w-6 text-primary" />
      </div>
      <h1 className="ml-4 text-2xl font-bold font-headline tracking-tight">QuantStream Dashboard</h1>
    </header>
  );
};
