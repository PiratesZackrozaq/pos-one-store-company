import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShiftManager from "@/components/shifts/ShiftManager";
import { format } from "date-fns";

export default function Shifts() {
  const { data: shiftHistory, isLoading } = useQuery({
    queryKey: ["shift-history"],
    queryFn: async () => {
      console.log("Fetching shift history...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.log("No active session found");
        return [];
      }

      const { data, error } = await supabase
        .from("shifts")
        .select("*")
        .eq("cashier_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Error fetching shift history:", error);
        throw error;
      }

      console.log("Shift history:", data);
      return data;
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Shift Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ShiftManager />
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading shift history...</p>
            ) : shiftHistory && shiftHistory.length > 0 ? (
              <div className="space-y-4">
                {shiftHistory.map((shift) => (
                  <div
                    key={shift.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {format(new Date(shift.start_time), "PPP")}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        shift.status === "open" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {shift.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>Started: {format(new Date(shift.start_time), "pp")}</p>
                      {shift.end_time && (
                        <p>Ended: {format(new Date(shift.end_time), "pp")}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No shift history found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}