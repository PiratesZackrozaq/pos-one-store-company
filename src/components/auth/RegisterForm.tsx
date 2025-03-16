
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import PasswordStrengthIndicator from "./PasswordStrengthIndicator";
import { usePasswordValidator } from "@/hooks/auth/usePasswordValidator";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"customer" | "shopkeeper">("customer");
  const [loading, setLoading] = useState(false);
  const { passwordStrength, checkPasswordStrength } = usePasswordValidator();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkPasswordStrength(password)) {
      toast({
        title: "Password too weak",
        description: "Please ensure your password meets the strength requirements",
        variant: "destructive",
        icon: <AlertTriangle className="w-4 h-4 text-destructive" />
      });
      return;
    }
    
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
          icon: <ShieldCheck className="w-4 h-4 text-primary" />
        });
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Error registering:", error);
      toast({
        title: "Error registering",
        description: error.message,
        variant: "destructive",
        icon: <AlertTriangle className="w-4 h-4 text-destructive" />
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
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
          onChange={(e) => {
            setPassword(e.target.value);
            checkPasswordStrength(e.target.value);
          }}
          required
        />
        
        <PasswordStrengthIndicator passwordStrength={passwordStrength} />
      </div>
      
      <Alert className="bg-blue-50 border-blue-200 text-blue-800 text-xs">
        <ShieldCheck className="h-4 w-4 text-blue-500" />
        <AlertDescription>
          Our system checks for leaked passwords to protect your account. Always use a unique password.
        </AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <Select
          value={role}
          onValueChange={(value: "customer" | "shopkeeper") => setRole(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="customer">Customer</SelectItem>
            <SelectItem value="shopkeeper">Shopkeeper</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={loading || !passwordStrength.valid}>
        {loading ? "Creating account..." : "Register"}
      </Button>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Login
        </Link>
      </div>
      <div className="text-center text-sm">
        Want to register as a store owner?{" "}
        <Link to="/store-owner-register" className="text-primary hover:underline">
          Register here
        </Link>
      </div>
    </form>
  );
}
