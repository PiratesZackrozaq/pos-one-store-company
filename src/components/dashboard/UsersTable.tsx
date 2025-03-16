import { Database } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type UserRole = Database["public"]["Enums"]["app_role"];

interface UsersTableProps {
  userRoles: UserRole[];
}

export default function UsersTable({ userRoles }: UsersTableProps) {
  const { data: roles, isError, error, isLoading } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      try {
        console.log("Starting user roles fetch...");
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!sessionData?.session?.user?.id) {
          console.error("No active session found");
          throw new Error("Authentication required");
        }

        console.log("Session found, fetching user roles...");
        
        // Fetch all roles - the RLS policy using our security definer function will handle permissions
        const { data: userRolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("*, user_id")
          .order("created_at", { ascending: false });

        if (rolesError) {
          console.error("Error fetching user roles:", rolesError);
          throw rolesError;
        }

        console.log("Fetched user roles:", userRolesData);

        // Then fetch profiles for these users
        const userIds = userRolesData.map(role => role.user_id).filter(Boolean);
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name")
          .in("id", userIds);

        if (profilesError) {
          console.error("Error fetching profiles:", profilesError);
          throw profilesError;
        }

        // Combine the data
        const combinedData = userRolesData.map(role => ({
          ...role,
          profile: profilesData?.find(profile => profile.id === role.user_id)
        }));

        console.log("Successfully combined roles and profiles:", combinedData);
        return combinedData;
      } catch (error) {
        console.error("Error in user roles fetch:", error);
        throw error;
      }
    },
    retry: 1,
  });

  if (isLoading) {
    return <div className="p-4">Loading user roles...</div>;
  }

  if (isError) {
    let errorMessage = "Failed to fetch user roles";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      const errorObj = error as { message?: string; details?: string };
      errorMessage = errorObj.message || 
                    errorObj.details || 
                    JSON.stringify(error, null, 2);
    }

    console.error("Error in UsersTable:", {
      error,
      errorMessage,
      type: typeof error
    });
    
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          {errorMessage}
        </AlertDescription>
      </Alert>
    );
  }

  if (!roles || roles.length === 0) {
    return (
      <Alert>
        <AlertDescription>
          No user roles found.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.profile?.full_name || 'Unknown User'}</TableCell>
              <TableCell>{role.role}</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>2 minutes ago</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}