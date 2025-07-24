import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IndicatorCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeColor?: 'text-accent' | 'text-destructive';
  unit?: string;
}

export const IndicatorCard = ({ title, value, change, changeColor, unit }: IndicatorCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">
        {unit}{value}
      </div>
      {change && (
        <p className={`text-xs ${changeColor || 'text-muted-foreground'}`}>
          {change}
        </p>
      )}
    </CardContent>
  </Card>
);
