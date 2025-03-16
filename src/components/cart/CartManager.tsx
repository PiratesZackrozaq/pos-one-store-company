
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from "@/types/pos";
import { ShoppingCart, Trash2, AlertCircle, CheckCircle, XCircle } from "lucide-react";

export const CartManager = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [session, setSession] = useState(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Check authentication status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
        return;
      }
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
        return;
      }
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

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

  const updateQuantity = async (productId: string, quantity: number) => {
    const currentItem = cart.find(item => item.id === productId);
    
    if (!currentItem) return;
    
    // If quantity is decreasing, restore stock for the difference
    if (currentItem.quantity > quantity) {
      const restoreAmount = currentItem.quantity - quantity;
      await restoreStock(productId, restoreAmount);
    } else if (currentItem.quantity < quantity) {
      // If increasing quantity, check and reduce stock
      await reduceStock(productId, quantity - currentItem.quantity);
    }
    
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(quantity, 1) }
          : item
      ).filter(item => item.quantity > 0);
      
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const reduceStock = async (productId: string, quantity: number) => {
    try {
      // Fetch current stock
      const { data: product, error } = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Failed to fetch product stock:", error);
        toast({
          title: "Error",
          description: "Could not update product quantity.",
          variant: "destructive",
          icon: <XCircle className="h-4 w-4" />
        });
        return false;
      }

      // Check if enough stock is available
      if (product.stock_quantity < quantity) {
        toast({
          title: "Insufficient stock",
          description: `Only ${product.stock_quantity} items available.`,
          variant: "destructive",
          icon: <AlertCircle className="h-4 w-4" />
        });
        return false;
      }

      // Update stock in Supabase
      const newStock = product.stock_quantity - quantity;
      const { error: updateError } = await supabase
        .from("products")
        .update({ stock_quantity: newStock })
        .eq("id", productId);

      if (updateError) {
        console.error("Failed to update stock:", updateError);
        toast({
          title: "Error",
          description: "Could not update product quantity.",
          variant: "destructive",
          icon: <XCircle className="h-4 w-4" />
        });
        return false;
      }

      console.log(`Stock reduced for product ${productId}: New stock: ${newStock}`);
      return true;
    } catch (error) {
      console.error("Error reducing stock:", error);
      return false;
    }
  };

  const removeFromCart = async (productId: string, quantity: number) => {
    try {
      // Don't handle stock updates here - ShoppingCart component will do it
      await restoreStock(productId, quantity);
      
      // Update the cart state
      setCart((prevCart) => {
        const updatedCart = prevCart.filter((item) => item.id !== productId);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });

      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart.",
        icon: <Trash2 className="h-4 w-4" />
      });
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      toast({
        title: "Error",
        description: "Could not remove item. Please try again.",
        variant: "destructive",
        icon: <XCircle className="h-4 w-4" />
      });
    }
  };

  // Centralized function to handle stock restoration
  const restoreStock = async (productId: string, quantity: number) => {
    try {
      console.log(`🔄 Restoring ${quantity} items to product ${productId} stock...`);
      
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

  const handleCheckout = async (paymentMethod: 'cash' | 'card') => {
    try {
      if (!session?.user?.id) {
        toast({
          title: "Authentication required",
          description: "Please log in to complete your purchase",
          variant: "destructive",
          icon: <AlertCircle className="h-4 w-4" />
        });
        return;
      }

      // Create order record
      const { data: order, error: orderError } = await supabase
        .from('customer_orders')
        .insert({
          customer_id: session.user.id,
          total_amount: calculateTotal(),
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('customer_order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Clear cart after successful order
      setCart([]);
      localStorage.removeItem('cart');

      toast({
        title: "Order placed successfully",
        description: "Thank you for your purchase!",
        icon: <CheckCircle className="h-4 w-4" />
      });

      // Redirect to orders page or confirmation page
      navigate('/orders');

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
        icon: <XCircle className="h-4 w-4" />
      });
    }
  };

  return {
    cart,
    updateQuantity,
    removeFromCart,
    restoreStock,
    calculateTotal,
    handleCheckout
  };
};
