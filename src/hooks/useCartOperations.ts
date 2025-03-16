
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import type { CartItem } from "@/types/pos";

export const useCartOperations = (handleRestoreStock: (productId: string, quantity: number) => void) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Handle removing item from cart
  const handleRemoveFromCart = async (productId: string, quantity: number) => {
    // First restore the stock in Supabase
    try {
      // Fetch current stock
      const { data: product, error } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Failed to fetch product stock:", error);
        return;
      }

      // Update stock in Supabase
      const newStock = product.stock_quantity + quantity;
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", productId);

      if (updateError) {
        console.error("Failed to restore stock:", updateError);
        return;
      }

      // Remove from cart
      const updatedCart = cart.filter(item => item.id !== productId);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      
      // Update UI
      handleRestoreStock(productId, quantity);
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Could not remove item. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle updating quantity
  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      return;
    }
    
    // Find the current item to get the quantity difference
    const currentItem = cart.find(item => item.id === productId);
    if (!currentItem) return;
    
    const quantityDifference = currentItem.quantity - newQuantity;
    
    // If reducing quantity, restore stock for the removed items
    if (quantityDifference > 0) {
      try {
        // Fetch current stock
        const { data: product, error } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("id", productId)
          .single();

        if (error) {
          console.error("Failed to fetch product stock:", error);
          return;
        }

        // Update stock in Supabase
        const newStock = product.stock_quantity + quantityDifference;
        const { error: updateError } = await supabase
          .from("products")
          .update({ stock_quantity: newStock })
          .eq("id", productId);

        if (updateError) {
          console.error("Failed to restore stock:", updateError);
          return;
        }
        
        // Update UI
        handleRestoreStock(productId, quantityDifference);
      } catch (error) {
        console.error("Error updating quantity:", error);
        return;
      }
    }
    // If increasing quantity, reduce stock (similar to adding to cart)
    else if (quantityDifference < 0) {
      // This functionality is handled in Products.tsx since it requires access to products
      return;
    }
    
    // Update cart
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  return {
    cart,
    setCart,
    handleRemoveFromCart,
    handleUpdateQuantity
  };
};
