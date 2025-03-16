
import { Link } from "react-router-dom";
import { Session } from '@supabase/supabase-js';
import { ShoppingBag, Search } from "lucide-react";

interface DesktopNavProps {
  session: Session | null;
}

export const DesktopNav = ({ session }: DesktopNavProps) => {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link to="/" className="hover:text-primary">Products</Link>
      {session ? (
        <>
          <Link to="/profile" className="hover:text-primary">Profile</Link>
          <Link to="/cart" className="hover:text-primary relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" className="hover:text-primary">Customer Login</Link>
          <Link to="/admin/login" className="hover:text-primary">Staff Login</Link>
        </>
      )}
    </nav>
  );
};
