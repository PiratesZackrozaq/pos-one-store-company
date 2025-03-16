
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CustomerLayout from "@/components/layout/CustomerLayout";

export default function CustomerProfile() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch user profile
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      // Fetch user role - using select instead of maybeSingle
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);
        
      if (roleError) throw roleError;
      
      // Get role from the first row if available
      const userRole = roleData && roleData.length > 0 ? roleData[0].role : "Not assigned";
      
      if (data && data.length > 0) {
        // Use the first profile if multiple exist
        const profileData = data[0];
        setProfile({
          full_name: profileData.full_name || "",
          phone_number: profileData.phone_number || "",
          address: profileData.address || "",
          email: profileData.email || user.email || "",
          role: userRole,
        });
      } else {
        // If no profile exists yet, initialize with user's email
        setProfile(prev => ({
          ...prev,
          email: user.email || "",
          role: userRole,
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('customer_profiles')
        .upsert({
          user_id: user.id,
          email: profile.email, // Include email in the upsert
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          address: profile.address,
          is_profile_completed: true,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-1">
                  Role
                </label>
                <Input
                  id="role"
                  value={profile.role}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <Input
                  id="full_name"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Input
                  id="phone_number"
                  value={profile.phone_number || ""}
                  onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">
                  Address
                </label>
                <Input
                  id="address"
                  value={profile.address || ""}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Enter your address"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </CustomerLayout>
  );
}
