
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProducts = (searchTerm: string) => {
  const { data: products, error, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories (
            name
          )
        `)
        .order("name");
      
      if (error) throw error;
      console.log("Successfully fetched products:", data);
      return data;
    },
  });

  const filteredProducts = products?.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return {
    products: filteredProducts,
    error,
    isLoading
  };
};
