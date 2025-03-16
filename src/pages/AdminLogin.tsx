import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Fetch user roles to check if they have admin or shopkeeper role
        const { data: roleData, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);

        if (roleError) throw roleError;

        const roles = roleData.map(r => r.role);
        
        if (roles.includes("admin") || roles.includes("shopkeeper")) {
          toast({
            title: "Logged in successfully",
            icon: <ShieldCheck className="w-4 h-4 text-primary" />
          });
          navigate("/admin");
        } else {
          // If not an admin or shopkeeper, sign out and show error
          await supabase.auth.signOut();
          toast({
            title: "Access denied",
            description: "You don't have sufficient permissions to access the admin area",
            variant: "destructive",
            icon: <AlertTriangle className="w-4 h-4 text-destructive" />
          });
        }
      }
    } catch (error: any) {
      console.error("Error logging in:", error);
      toast({
        title: "Error logging in",
        description: error.message,
        variant: "destructive",
        icon: <AlertTriangle className="w-4 h-4 text-destructive" />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Admin / Shopkeeper Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the POS system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm">
              <Link to="/login" className="text-primary hover:underline">
                Customer Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
