import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IndicatorCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  unit?: string;
}

export const IndicatorCard = ({ title, value, subtitle, change, changeType, unit }: IndicatorCardProps) => {
  const changeColor = changeType === 'positive' ? 'text-accent' : changeType === 'negative' ? 'text-destructive' : '';
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${changeColor || ''}`}>
          {unit === '$' && <span>{unit}</span>}
          {value}
          {unit && unit !== '$' && <span className="text-muted-foreground text-xl ml-1">{unit}</span>}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {change && (
          <p className={`text-xs ${changeColor || 'text-muted-foreground'}`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
