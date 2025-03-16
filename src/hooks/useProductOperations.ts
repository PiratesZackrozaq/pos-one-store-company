
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const useProductOperations = (session: any) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      
      if (error) throw error;
      console.log("Successfully fetched products:", data);
      return data;
    },
  });

  const handleAddToCart = async (product: any, cart: any[], setCart: (cart: any[]) => void) => {
    if (!session) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Prevent adding if stock is 0
    if (product.stock_quantity < 1) {
      toast({
        title: "Out of stock",
        description: `${product.name} is no longer available.`,
        variant: "destructive",
      });
      return;
    }

    // Decrease stock quantity in Supabase
    const newStock = product.stock_quantity - 1;
    const { error } = await supabase
      .from("products")
      .update({ stock_quantity: newStock })
      .eq("id", product.id);

    if (error) {
      console.error("❌ Failed to update stock:", error);
      toast({
        title: "Error",
        description: "Failed to update stock. Please try again.",
        variant: "destructive",
      });
      return;
    }

    // Update local state (reduce stock in UI)
    const updatedProducts = products?.map((p) =>
      p.id === product.id ? { ...p, stock_quantity: newStock } : p
    );

    // Update React Query Cache (Triggers UI Update)
    queryClient.setQueryData(["products"], updatedProducts);

    // Update cart
    const existingItem = cart.find((item) => item.id === product.id);
    const updatedCart = existingItem
      ? cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      : [...cart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Function to handle restoring stock
  const handleRestoreStock = async (productId: string, quantity: number) => {
    console.log(`🔄 Restoring ${quantity} items to product ${productId} stock...`);
    
    // Update products in the UI by updating React Query cache
    const updatedProducts = products?.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          stock_quantity: product.stock_quantity + quantity
        };
      }
      return product;
    });
    
    // Update React Query Cache (Triggers UI Update)
    queryClient.setQueryData(["products"], updatedProducts);
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart and stock has been restored.",
    });
  };

  return {
    products,
    isLoading,
    handleAddToCart,
    handleRestoreStock
  };
};
