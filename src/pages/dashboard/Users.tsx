import MainLayout from "@/components/layout/MainLayout";
import UsersTable from "@/components/dashboard/UsersTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

export default function DashboardUsers() {
  const navigate = useNavigate();

  // First check if user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  const { data: userRoles, isError, error } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      console.log("Fetching user roles...");
      const { data, error } = await supabase
        .from("user_roles")
        .select("role");

      if (error) {
        console.error("Error fetching roles:", error);
        throw error;
      }

      console.log("Fetched roles:", data);
      return data?.map(d => d.role) || [];
    },
  });

  if (isError) {
    console.error("Query error:", error);
    toast({
      title: "Error",
      description: "Failed to fetch user roles",
      variant: "destructive",
    });
  }

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Users Management</h1>
        <UsersTable userRoles={userRoles || []} />
      </div>
    </MainLayout>
  );
}