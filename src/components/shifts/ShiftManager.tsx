import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export default function ShiftManager() {
  const [isStartingShift, setIsStartingShift] = useState(false);
  const queryClient = useQueryClient();

  // Fetch current user's active shift
  const { data: activeShift, isLoading: isLoadingShift } = useQuery({
    queryKey: ["active-shift"],
    queryFn: async () => {
      console.log("Fetching active shift...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user?.id) {
        console.log("No active session found");
        return null;
      }

      const { data, error } = await supabase
        .from("shifts")
        .select("*")
        .eq("cashier_id", session.user.id)
        .eq("status", "open")
        .maybeSingle();

      if (error) {
        console.error("Error fetching active shift:", error);
        throw error;
      }

      console.log("Active shift data:", data);
      return data;
    },
  });

  // Start shift mutation
  const startShift = useMutation({
    mutationFn: async () => {
      console.log("Starting new shift...");
      setIsStartingShift(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error("No active session");
      }

      const { data, error } = await supabase
        .from("shifts")
        .insert({
          cashier_id: session.user.id,
          starting_cash: 0, // You might want to make this configurable
          status: "open",
        })
        .select()
        .single();

      if (error) {
        console.error("Error starting shift:", error);
        throw error;
      }

      console.log("New shift created:", data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Shift Started",
        description: "Your shift has been started successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["active-shift"] });
    },
    onError: (error) => {
      console.error("Error in startShift mutation:", error);
      toast({
        title: "Error",
        description: "Failed to start shift. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsStartingShift(false);
    },
  });

  // End shift mutation
  const endShift = useMutation({
    mutationFn: async () => {
      console.log("Ending shift...");
      if (!activeShift?.id) {
        throw new Error("No active shift to end");
      }

      const { data, error } = await supabase
        .from("shifts")
        .update({
          end_time: new Date().toISOString(),
          status: "closed",
          ending_cash: 0, // You might want to make this configurable
        })
        .eq("id", activeShift.id)
        .select()
        .single();

      if (error) {
        console.error("Error ending shift:", error);
        throw error;
      }

      console.log("Shift ended:", data);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Shift Ended",
        description: "Your shift has been ended successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["active-shift"] });
    },
    onError: (error) => {
      console.error("Error in endShift mutation:", error);
      toast({
        title: "Error",
        description: "Failed to end shift. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoadingShift) {
    return <div>Loading shift status...</div>;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Shift Management</CardTitle>
      </CardHeader>
      <CardContent>
        {activeShift ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Current Shift Started:</p>
              <p className="font-medium">
                {format(new Date(activeShift.start_time), "PPpp")}
              </p>
            </div>
            <Button 
              className="w-full" 
              onClick={() => endShift.mutate()}
              disabled={endShift.isPending}
            >
              End Shift
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full" 
            onClick={() => startShift.mutate()}
            disabled={isStartingShift}
          >
            Start Shift
          </Button>
        )}
      </CardContent>
    </Card>
  );
}