import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, DollarSign, Package, Users } from "lucide-react";

export default function POSDashboard() {
  const { data: salesData } = useQuery({
    queryKey: ["sales-summary"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("total_amount")
        .eq("status", "completed");
      if (error) throw error;
      return data;
    },
  });

  const totalSales = salesData?.reduce((acc, sale) => acc + Number(sale.total_amount), 0) || 0;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
          </CardContent>
        </Card>
        {/* Add more summary cards as needed */}
      </div>
    </div>
  );
}