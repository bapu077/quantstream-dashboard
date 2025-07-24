
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Trade } from '@/hooks/use-trading-simulator';
import { Badge } from "@/components/ui/badge";

interface TradeHistoryTableProps {
  trades: Trade[];
}

export const TradeHistoryTable = ({ trades }: TradeHistoryTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
        <CardDescription>A log of all your executed paper trades.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No trades yet.
                  </TableCell>
                </TableRow>
              ) : (
                trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="font-mono text-xs">{trade.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant={trade.type === 'buy' ? 'secondary' : 'destructive'} 
                             className={`${trade.type === 'buy' ? 'bg-accent/20 text-accent-foreground' : 'bg-destructive/20 text-destructive-foreground'}`}>
                        {trade.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{trade.quantity.toFixed(4)}</TableCell>
                    <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right font-medium">${trade.value.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
