
import React from "react";
import { Minus, Plus, Trash2, ShoppingCart as CartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CartItem } from "@/types/pos";

interface ShoppingCartProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string, quantity: number) => void;
  onRestoreStock: (productId: string, quantity: number) => void;
}

export function ShoppingCart({ 
  cart, 
  onUpdateQuantity, 
  onRemoveFromCart, 
  onRestoreStock 
}: ShoppingCartProps) {

  const handleRemoveFromCart = (productId: string, quantity: number) => {
    console.log(`🛒 Removing ${quantity} items from cart...`);
    onRemoveFromCart(productId, quantity);
  };

  return (
    <div className="h-full">
      {cart.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center py-8">
          <CartIcon className="h-8 w-8 text-gray-400 mb-4" />
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardHeader className="p-4">
                <CardTitle className="text-base">{item.name}</CardTitle>
                <CardDescription>${item.price.toFixed(2)} each</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemoveFromCart(item.id, item.quantity)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <p className="font-bold">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
