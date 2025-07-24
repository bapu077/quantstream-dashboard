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
        {unit && unit !== '$' && <span className="text-muted-foreground text-2xl mr-1">{unit}</span>}
        {unit === '$' && <span>{unit}</span>}
        {value}
      </div>
      {change && (
        <p className={`text-xs ${changeColor || 'text-muted-foreground'}`}>
          {change}
        </p>
      )}
    </CardContent>
  </Card>
);
