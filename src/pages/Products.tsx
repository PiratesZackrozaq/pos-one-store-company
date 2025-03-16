
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CustomerLayout from "@/components/layout/CustomerLayout";
import { toast } from "@/components/ui/use-toast";
import { ShoppingCart } from "@/components/pos/ShoppingCart";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { useProductOperations } from "@/hooks/useProductOperations";
import { useCartOperations } from "@/hooks/useCartOperations";

const Products = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const queryClient = useQueryClient();

  // Check authentication status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initialize product operations
  const { products, isLoading, handleAddToCart, handleRestoreStock } = useProductOperations(session);
  
  // Initialize cart operations
  const { cart, setCart, handleRemoveFromCart, handleUpdateQuantity: baseHandleUpdateQuantity } = 
    useCartOperations(handleRestoreStock);

  // Handle updating quantity when increasing (requires product data)
  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    const currentItem = cart.find(item => item.id === productId);
    if (!currentItem) return;
    
    const quantityDifference = currentItem.quantity - newQuantity;
    
    // If increasing quantity (negative difference), we need to reduce stock
    if (quantityDifference < 0) {
      const product = products?.find(p => p.id === productId);
      if (product && product.stock_quantity >= Math.abs(quantityDifference)) {
        // Update stock in Supabase
        const newStock = product.stock_quantity + quantityDifference; // Will subtract since quantityDifference is negative
        const { error } = await supabase
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("id", productId);

        if (error) {
          console.error("Failed to update stock:", error);
          return;
        }
        
        // Update products in UI
        const updatedProducts = products?.map((p) =>
          p.id === productId ? { ...p, stock_quantity: newStock } : p
        );
        queryClient.setQueryData(["products"], updatedProducts);
        
        // Update cart
        const updatedCart = cart.map(item => 
          item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
      } else {
        // Not enough stock
        toast({
          title: "Not enough stock",
          description: "Cannot add more of this item to your cart.",
          variant: "destructive",
        });
      }
    } else {
      // For reducing quantity, delegate to the base handler
      baseHandleUpdateQuantity(productId, newQuantity);
    }
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-grow">
            <h1 className="text-2xl font-bold mb-6">Our Products</h1>
            <ProductGrid 
              products={products || []} 
              isLoading={isLoading}
              onAddToCart={(product) => handleAddToCart(product, cart, setCart)}
            />
          </div>
          
          <div className="w-full lg:w-96 border lg:sticky lg:top-4 rounded-lg p-4 bg-gray-50 mt-8 lg:mt-0 self-start">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Your Cart</h2>
              {cart.length > 0 && (
                <Button onClick={handleViewCart} variant="outline" size="sm">
                  View Cart
                </Button>
              )}
            </div>
            <ShoppingCart 
              cart={cart} 
              onUpdateQuantity={handleUpdateQuantity} 
              onRemoveFromCart={handleRemoveFromCart}
              onRestoreStock={handleRestoreStock}
            />
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Products;
