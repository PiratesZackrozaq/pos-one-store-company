import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Barcode, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

export default function POS() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Logo and Navigation */}
            <div className="flex items-center gap-8">
              <Link to="/" className="text-2xl font-bold flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                POS Terminal
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link to="/pos/inventory" className="flex items-center gap-2 hover:text-primary">
                  <Barcode className="h-4 w-4" />
                  Inventory
                </Link>
                <Link to="/pos/terminal" className="flex items-center gap-2 hover:text-primary">
                  <CreditCard className="h-4 w-4" />
                  Terminal
                </Link>
              </nav>
            </div>
            
            {/* Search Bar */}
            <div className="w-full md:w-auto flex items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-8" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-[1fr_300px] gap-6">
          {/* Main Content Area */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Point of Sale</h1>
            </div>
            
            {/* POS Content */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <p className="text-muted-foreground">POS Terminal content will go here...</p>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="bg-muted p-4 rounded-lg border">
            <h2 className="font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link to="/pos/inventory">
                  <Barcode className="mr-2 h-4 w-4" />
                  View Inventory
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                New Transaction
              </Button>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t bg-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About POS System</h3>
              <p className="text-sm text-muted-foreground">
                A modern point of sale system designed for retail businesses.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/pos/terminal" className="hover:text-primary">Terminal</Link></li>
                <li><Link to="/pos/inventory" className="hover:text-primary">Inventory</Link></li>
                <li><Link to="/pos/shifts" className="hover:text-primary">Shifts</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>Email: support@possystem.com</li>
                <li>Phone: (555) 123-4567</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} POS System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}