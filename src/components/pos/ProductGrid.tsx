import React from "react";
import { Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  categories?: {
    name: string;
  };
}

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ products, isLoading, onAddToCart }: ProductGridProps) {
  const { toast } = useToast();

  const handleAddToCart = (product: Product) => {
    if (product.stock_quantity < 1) {
      toast({
        title: "Out of stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
      });
      return;
    }

    onAddToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products?.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.categories?.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500">
              Stock: {product.stock_quantity}
              {product.stock_quantity < 1 && (
                <span className="text-red-500 ml-2">Out of stock</span>
              )}
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => handleAddToCart(product)}
              disabled={product.stock_quantity < 1}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}