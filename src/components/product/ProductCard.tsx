
import React from "react";
import { Plus, ShoppingCart, AlertCircle, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  description?: string | null;
  image?: string | null;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (product.stock_quantity < 1) {
      toast({
        title: "Out of stock",
        description: "This product is currently out of stock.",
        variant: "destructive",
        icon: <AlertCircle className="h-4 w-4" />
      });
      return;
    }

    onAddToCart(product);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      icon: <ShoppingCart className="h-4 w-4" />
    });
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-center mb-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={product.image || ''} alt={product.name} />
            <AvatarFallback>
              <Image className="h-8 w-8 text-gray-400" />
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-2xl font-bold mb-2">${product.price.toFixed(2)}</p>
        {product.description && (
          <p className="text-muted-foreground">{product.description}</p>
        )}
        <p className="text-sm text-muted-foreground mt-2">
          Stock: {product.stock_quantity}
          {product.stock_quantity < 1 && (
            <span className="text-red-500 ml-2">Out of stock</span>
          )}
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
          disabled={product.stock_quantity < 1}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
