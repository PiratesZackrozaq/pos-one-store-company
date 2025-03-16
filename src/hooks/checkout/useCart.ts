
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/types/pos";

export const useCart = () => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount
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

  const addToCart = async (product: any) => {
    // Check if we need to decrement stock
    if (product.stock_quantity < 1) {
      toast({
        title: "Out of stock",
        description: `${product.name} is no longer available.`,
        variant: "destructive",
      });
      return;
    }
    
    // Decrease stock in Supabase
    const { error } = await supabase
      .from("products")
      .update({ stock_quantity: product.stock_quantity - 1 })
      .eq("id", product.id);
      
    if (error) {
      console.error("Failed to update stock:", error);
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Update cart
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
      }]);
    }
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`
    });
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    // Find the current item to check if quantity is changing
    const currentItem = cart.find(item => item.id === productId);
    if (!currentItem) return;
    
    const quantityDifference = newQuantity - currentItem.quantity;
    
    // If quantity is decreasing, restore stock
    if (quantityDifference < 0) {
      await restoreStock(productId, Math.abs(quantityDifference));
    } 
    // If quantity is increasing, decrease stock
    else if (quantityDifference > 0) {
      // Check if enough stock is available
      const { data: product, error } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", productId)
        .single();
        
      if (error) {
        console.error("Failed to fetch product stock:", error);
        toast({
          title: "Error",
          description: "Could not update quantity.",
          variant: "destructive",
        });
        return;
      }
      
      if (product.stock_quantity < quantityDifference) {
        toast({
          title: "Not enough stock",
          description: `Only ${product.stock_quantity} more items available.`,
          variant: "destructive",
        });
        return;
      }
      
      // Update stock in Supabase
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: product.stock_quantity - quantityDifference })
        .eq("id", productId);
        
      if (updateError) {
        console.error("Failed to update stock:", updateError);
        toast({
          title: "Error",
          description: "Could not update quantity.",
          variant: "destructive",
        });
        return;
      }
    }
    
    // Update cart state
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeFromCart = async (productId: string, quantity: number) => {
    try {
      // Restore stock first
      await restoreStock(productId, quantity);
      
      // Update cart state
      setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
      
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart."
      });
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Could not remove item. Please try again.",
        variant: "destructive",
      });
    }
  };

  const restoreStock = async (productId: string, quantity: number) => {
    console.log(`🔄 Restoring ${quantity} items to product ${productId} stock in useCart...`);
    try {
      // Fetch current stock
      const { data: product, error } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Failed to fetch product stock:", error);
        return false;
      }

      // Update stock in Supabase
      const newStock = product.stock_quantity + quantity;
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", productId);

      if (updateError) {
        console.error("Failed to restore stock:", updateError);
        return false;
      }

      console.log(`Stock restored for product ${productId}: New stock: ${newStock}`);
      return true;
    } catch (error) {
      console.error("Error restoring stock:", error);
      return false;
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    cart,
    setCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    restoreStock,
    calculateTotal
  };
};
