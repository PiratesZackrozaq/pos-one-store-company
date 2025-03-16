import MainLayout from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardShifts() {
  const { data: shifts } = useQuery({
    queryKey: ["shifts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("shifts")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Shifts Overview</h1>
        <div className="border rounded-lg p-4">
          <p>Total Shifts: {shifts?.length || 0}</p>
        </div>
      </div>
    </MainLayout>
  );
}