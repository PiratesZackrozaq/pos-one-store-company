import { Store, LogOut, User, Settings, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>

            <Link to="/" className="flex items-center">
              <Store className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold hidden sm:inline">AislesAdvantage</span>
            </Link>

            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/pos/inventory"
                className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
              >
                Inventory
              </Link>
              <Link
                to="/pos/terminal"
                className="text-primary inline-flex items-center px-1 pt-1 border-b-2 border-primary text-sm font-medium"
              >
                Terminal
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-primary"
            >
              Dashboard
            </Link>
            <Link
              to="/pos/inventory"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:text-primary"
            >
              Inventory
            </Link>
            <Link
              to="/pos/terminal"
              className="block px-3 py-2 text-base font-medium text-primary hover:text-primary"
            >
              Terminal
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}