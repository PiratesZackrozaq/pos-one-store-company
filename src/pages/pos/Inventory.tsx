
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Store, LogOut, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProductList } from "@/components/product/ProductList";
import { ProductForm } from "@/components/product/ProductForm";

export default function Inventory() {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = React.useState(false);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const { data: products, error, isLoading, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      console.log("Current auth session:", session);

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name
          )
        `)
        .order("name");
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      console.log("Successfully fetched products:", data);
      return data;
    },
  });

  const handleDeleteProduct = async () => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", selectedProduct.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      
      refetch();
      setIsDeleteDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
        <p className="text-gray-600 mb-4">There was an error loading the products. Please try again later.</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <Store className="h-8 w-8 text-primary" />
                <span className="ml-2 text-xl font-bold">AislesAdvantage</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/pos/inventory" className="text-primary inline-flex items-center px-1 pt-1 border-b-2 border-primary text-sm font-medium">
                  Inventory
                </Link>
                <Link to="/pos/terminal" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
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
                <DropdownMenuContent align="end">
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
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setSelectedProduct(null);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{selectedProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                <DialogDescription>
                  Fill in the product details below
                </DialogDescription>
              </DialogHeader>
              <ProductForm 
                product={selectedProduct}
                categories={categories}
                onSuccess={() => {
                  refetch();
                  setIsFormDialogOpen(false);
                  setSelectedProduct(null);
                }}
                onCancel={() => setIsFormDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border">
          <ProductList 
            products={products}
            isLoading={isLoading}
            onEdit={(product) => {
              setSelectedProduct(product);
              setIsFormDialogOpen(true);
            }}
            onDelete={(product) => {
              setSelectedProduct(product);
              setIsDeleteDialogOpen(true);
            }}
          />
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Product</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteProduct}>
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex space-x-4 text-sm text-gray-500">
              <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} AislesAdvantage. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
