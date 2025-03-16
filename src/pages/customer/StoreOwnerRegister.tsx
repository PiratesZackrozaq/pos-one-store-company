
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import * as crypto from 'crypto-js';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ShieldCheck } from "lucide-react";

export default function StoreOwnerRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationPassword, setVerificationPassword] = useState("");
  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");
  const [storePhone, setStorePhone] = useState("");
  const [businessLicense, setBusinessLicense] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
    valid: false
  });
  const navigate = useNavigate();

  const checkPasswordStrength = (password: string) => {
    const strength = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
      valid: false
    };
    
    // Password is valid if it meets length requirement and at least 3 character types
    const criteriaCount = [strength.uppercase, strength.lowercase, strength.number, strength.special]
      .filter(Boolean).length;
    strength.valid = strength.length && criteriaCount >= 3;
    
    setPasswordStrength(strength);
    return strength.valid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password strength before submission
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
      // Hash the verification password
      const verificationHash = crypto.SHA256(verificationPassword).toString();

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'store_owner',
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Create store owner record
        const { error: storeError } = await supabase
          .from('store_owners')
          .insert([
            {
              user_id: data.user.id,
              store_name: storeName,
              store_address: storeAddress,
              store_phone: storePhone,
              business_license_number: businessLicense,
              owner_verification_hash: verificationHash,
            }
          ]);

        if (storeError) throw storeError;

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
            Register as Store Owner
          </CardTitle>
          <CardDescription className="text-center">
            Enter your store details to register
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
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
              
              {/* Password strength indicator */}
              <div className="text-xs space-y-1 mt-1">
                <p className={passwordStrength.length ? "text-green-500" : "text-gray-500"}>
                  ✓ At least 8 characters
                </p>
                <p className={
                  (passwordStrength.uppercase && passwordStrength.lowercase && passwordStrength.number) || 
                  (passwordStrength.uppercase && passwordStrength.lowercase && passwordStrength.special) || 
                  (passwordStrength.uppercase && passwordStrength.number && passwordStrength.special) || 
                  (passwordStrength.lowercase && passwordStrength.number && passwordStrength.special) 
                  ? "text-green-500" : "text-gray-500"
                }>
                  ✓ At least 3 of: uppercase, lowercase, numbers, special characters
                </p>
              </div>
            </div>
            
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 text-xs">
              <ShieldCheck className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                Our system checks for leaked passwords to protect your account. Always use a unique password.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Store Name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Store Address"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="tel"
                placeholder="Store Phone"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Business License Number"
                value={businessLicense}
                onChange={(e) => setBusinessLicense(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Store Owner Verification Password"
                value={verificationPassword}
                onChange={(e) => setVerificationPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading || !passwordStrength.valid}>
              {loading ? "Creating account..." : "Register Store"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
            <div className="text-center text-sm">
              Want to register as a customer or shopkeeper?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
