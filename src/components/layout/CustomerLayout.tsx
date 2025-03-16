
import { useState, useEffect } from "react";
import { Session } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { CustomerHeader } from "./CustomerHeader";
import { CustomerFooter } from "./CustomerFooter";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <CustomerHeader 
        session={session}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      <CustomerFooter />
    </div>
  );
}
