
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // ✅ Fixing the unsubscribe issue
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    fetchUser();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription?.subscription?.unsubscribe?.(); // ✅ FIXED: Prevents TypeScript error
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
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
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <Link to="/" className="text-xl md:text-2xl font-bold">OneStoreCompanyPOS</Link>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <Link to="/admin" className="hover:text-primary">Home</Link>
              {!user && (
                <>
                  <Link to="/admin/login" className="hover:text-primary">Staff Login</Link>
                  <Link to="/login" className="hover:text-primary">Customer Login</Link>
                </>
              )}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8 w-[200px] lg:w-[300px]" />
              </div>
              <Button>Search</Button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 py-4 border-t">
              <div className="flex flex-col gap-4">
                <Link to="/admin" className="hover:text-primary px-2 py-2">Home</Link>
                {!user && (
                  <>
                    <Link to="/admin/login" className="hover:text-primary px-2 py-2">Staff Login</Link>
                    <Link to="/login" className="hover:text-primary px-2 py-2">Customer Login</Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6">{children}</main>

      <footer className="border-t bg-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About Us</h3>
              <p className="text-sm text-muted-foreground">
                OneStoreCompanyPOS provides modern POS solutions for retail businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-primary">Home</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
                <li><Link to="/pos" className="hover:text-primary">POS System</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm">
                <li>Email: support@onestorecompanypos.com</li>
                <li>Phone: (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} OneStoreCompanyPOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
