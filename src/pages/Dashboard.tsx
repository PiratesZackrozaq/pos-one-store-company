
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Database } from "@/integrations/supabase/types";
import { toast } from "@/components/ui/use-toast";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import UsersTable from "@/components/dashboard/UsersTable";
import DashboardPagination from "@/components/dashboard/DashboardPagination";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";
import { ShopkeeperSidebar } from "@/components/dashboard/ShopkeeperSidebar";

type UserRole = Database["public"]["Enums"]["app_role"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/login");
          return;
        }

        const { data: roles, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        if (error) {
          console.error("Error fetching roles:", error);
          toast({
            title: "Error",
            description: "Failed to fetch user roles",
            variant: "destructive",
          });
          return;
        }

        if (roles) {
          const userRoleValues = roles.map(role => role.role);
          setUserRoles(userRoleValues);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        toast({
          title: "Error",
          description: "An error occurred while checking authentication",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const isShopkeeper = userRoles.includes("shopkeeper");

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="flex min-h-screen">
        {isShopkeeper ? (
          <ShopkeeperSidebar />
        ) : (
          <DashboardSidebar />
        )}
        
        <div className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              {isShopkeeper && (
                <Button asChild variant="default" className="gap-2">
                  <Link to="/pos/shifts">
                    <Clock className="h-4 w-4" />
                    Manage Shifts
                  </Link>
                </Button>
              )}
            </div>
            
            <DashboardHeader 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <UsersTable userRoles={userRoles} />
            
            <DashboardPagination />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
