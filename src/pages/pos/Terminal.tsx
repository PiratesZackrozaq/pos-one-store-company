
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ProductGrid } from "@/components/pos/ProductGrid";
import { ShoppingCart } from "@/components/pos/ShoppingCart";
import { CheckoutSection } from "@/components/pos/CheckoutSection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useCheckout } from "@/hooks/useCheckout";
import { useProducts } from "@/hooks/useProducts";
import { useQueryClient } from "@tanstack/react-query";

export default function Terminal() {
  const [searchTerm, setSearchTerm] = useState("");
  const { products, error, isLoading } = useProducts(searchTerm);
  const queryClient = useQueryClient();
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    calculateTotal,
    handleCheckout
  } = useCheckout();

  // Add a function to handle restoring stock in Supabase and UI
  const handleRestoreStock = async (productId: string, quantity: number) => {
    try {
      // Update React Query Cache (Triggers UI Update)
      const updatedProducts = products?.map((p) =>
        p.id === productId ? { ...p, stock_quantity: p.stock_quantity + quantity } : p
      );

      // Update products in the UI by updating React Query cache
      if (queryClient) {
        queryClient.setQueryData(["products"], updatedProducts);
      }

      console.log(`Stock restored for product ${productId}: New stock visible in UI`);
    } catch (error) {
      console.error("Error updating UI stock:", error);
    }
  };
  
  // Handle removing items with quantity to restore stock
  const handleRemoveItem = (productId: string, quantity: number) => {
    removeFromCart(productId, quantity);
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Products</h2>
        <p className="text-gray-600 mb-4">There was an error loading the products. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="mb-6 sticky top-0 bg-background z-10 pb-4">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>

          <ProductGrid 
            products={products || []}
            isLoading={isLoading}
            onAddToCart={addToCart}
          />
        </div>

        <div className="w-full lg:w-96 border-t lg:border-l lg:border-t-0 bg-gray-50 flex flex-col max-h-[50vh] lg:max-h-[calc(100vh-4rem)] lg:sticky lg:top-16">
          <div className="p-4 lg:p-6 flex-1 overflow-auto">
            <ShoppingCart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={handleRemoveItem}
              onRestoreStock={handleRestoreStock}
            />
          </div>

          <div className="border-t bg-white p-4 lg:p-6">
            <CheckoutSection
              cart={cart}
              total={calculateTotal()}
              onCheckout={handleCheckout}
              disabled={cart.length === 0}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
