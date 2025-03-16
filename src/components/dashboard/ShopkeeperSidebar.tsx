
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Clipboard, Clock, Settings } from "lucide-react";
import { Link } from "react-router-dom";

export function ShopkeeperSidebar() {
  return (
    <aside className="w-64 border-r bg-sidebar p-4 hidden md:block">
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-2">POS Operations</h2>
        <p className="text-sm text-gray-500">Manage your store operations</p>
      </div>

      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/pos/terminal">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Terminal
          </Link>
        </Button>
        
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/pos/inventory">
            <Package className="mr-2 h-4 w-4" />
            Inventory
          </Link>
        </Button>
        
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/pos/shifts">
            <Clock className="mr-2 h-4 w-4" />
            Shifts
          </Link>
        </Button>
        
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/dashboard/sales">
            <Clipboard className="mr-2 h-4 w-4" />
            Sales Reports
          </Link>
        </Button>
        
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/profile">
            <Settings className="mr-2 h-4 w-4" />
            Profile Settings
          </Link>
        </Button>
      </nav>
      
      <div className="mt-8 pt-4 border-t">
        <div className="text-sm text-gray-500">
          <p className="font-medium">Store Hours</p>
          <p className="mt-1">Mon-Fri: 9AM - 6PM</p>
          <p>Sat-Sun: 10AM - 4PM</p>
        </div>
      </div>
    </aside>
  );
}
