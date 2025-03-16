import MainLayout from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardSales() {
  const { data: sales } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Sales Overview</h1>
        <div className="border rounded-lg p-4">
          <p>Total Sales: {sales?.length || 0}</p>
        </div>
      </div>
    </MainLayout>
  );
}