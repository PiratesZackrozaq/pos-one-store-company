
import { Link } from "react-router-dom";
import { Session } from '@supabase/supabase-js';
import { ShoppingBag } from "lucide-react";

interface MobileMenuProps {
  session: Session | null;
  handleLogout: () => Promise<void>;
}

export const MobileMenu = ({ session, handleLogout }: MobileMenuProps) => {
  return (
    <div className="md:hidden border-t pt-4 space-y-3">
      <Link to="/" className="block py-2 hover:text-primary">
        Products
      </Link>
      
      {session ? (
        <>
          <Link to="/profile" className="block py-2 hover:text-primary">
            Profile
          </Link>
          <Link to="/cart" className="block py-2 hover:text-primary flex items-center">
            <ShoppingBag className="h-5 w-5 mr-2" />
            Cart
            <span className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left py-2 hover:text-primary"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="block py-2 hover:text-primary">
            Customer Login
          </Link>
          <Link to="/admin/login" className="block py-2 hover:text-primary">
            Staff Login
          </Link>
        </>
      )}
    </div>
  );
};
