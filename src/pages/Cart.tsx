
import { useEffect } from "react";
import CustomerLayout from "@/components/layout/CustomerLayout";
import { ShoppingCart } from "@/components/pos/ShoppingCart";
import { CheckoutSection } from "@/components/pos/CheckoutSection";
import { CartManager } from "@/components/cart/CartManager";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart as CartIcon } from "lucide-react";

const Cart = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    restoreStock,
    calculateTotal,
    handleCheckout
  } = CartManager();

  return (
    <CustomerLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        
        {cart.length === 0 && (
          <Alert className="mb-6">
            <CartIcon className="h-4 w-4 mr-2" />
            <AlertTitle>Your cart is empty</AlertTitle>
            <AlertDescription>
              Browse our products and add items to your cart to get started.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ShoppingCart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveFromCart={removeFromCart}
              onRestoreStock={restoreStock}
            />
          </div>
          <div>
            <CheckoutSection
              cart={cart}
              total={calculateTotal()}
              onCheckout={handleCheckout}
              disabled={cart.length === 0}
            />
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default Cart;
