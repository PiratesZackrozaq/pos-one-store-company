
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { MobileMenu } from "./MobileMenu";
import { DesktopNav } from "./DesktopNav";
import { UserMenu } from "./UserMenu";

interface CustomerHeaderProps {
  session: Session | null;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (value: boolean) => void;
}

export const CustomerHeader = ({ session, isMobileMenuOpen, setIsMobileMenuOpen }: CustomerHeaderProps) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
            
            <Link to="/" className="text-xl md:text-2xl font-bold">
              OneStoreCompanyPOS
            </Link>
          </div>
          
          <DesktopNav session={session} />
          <UserMenu session={session} handleLogout={handleLogout} />
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <MobileMenu session={session} handleLogout={handleLogout} />
        )}
      </div>
    </header>
  );
};
