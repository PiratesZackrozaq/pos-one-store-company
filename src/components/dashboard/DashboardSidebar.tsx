import { Button } from "@/components/ui/button";
import { Users, ShoppingCart, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardSidebar() {
  return (
    <aside className="w-64 border-r bg-sidebar p-4 hidden md:block">
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/dashboard/users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/dashboard/sales">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Sales
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/dashboard/shifts">
            <Clock className="mr-2 h-4 w-4" />
            Shifts
          </Link>
        </Button>
      </nav>
    </aside>
  );
}