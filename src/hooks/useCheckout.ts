
import { useToast } from "@/hooks/use-toast";
import { useCart } from "./checkout/useCart";
import { useSaleProcessor } from "./checkout/useSaleProcessor";
import { useReceiptGenerator } from "./checkout/useReceiptGenerator";

export const useCheckout = () => {
  const { toast } = useToast();
  const { cart, setCart, addToCart, updateQuantity, removeFromCart, calculateTotal } = useCart();
  const { processSale } = useSaleProcessor();
  const { generateReceipt } = useReceiptGenerator();

  const handleCheckout = async (paymentMethod: 'cash' | 'card') => {
    try {
      if (cart.length === 0) {
        console.error("❌ Cannot checkout with empty cart");
        toast({
          title: "Error",
          description: "Cannot checkout with empty cart",
          variant: "destructive"
        });
        return;
      }

      console.log("🛍️ Starting checkout process:", {
        paymentMethod,
        itemCount: cart.length,
        total: calculateTotal(),
        cartItems: cart
      });

      const { sale } = await processSale({
        total_amount: calculateTotal(),
        payment_method: paymentMethod,
        status: 'completed'
      }, cart);

      const receiptSuccess = await generateReceipt({
        orderId: sale.id,
        items: cart,
        total: calculateTotal(),
        paymentMethod,
        date: new Date(),
        customerInfo: {
          name: "Walk-in Customer",
          email: "",
          address: ""
        }
      });

      if (!receiptSuccess) {
        toast({
          title: "Warning",
          description: "Sale completed but there was an error generating the receipt.",
          variant: "destructive"
        });
      }

      toast({
        title: "✅ Sale completed",
        description: "Your sale has been processed successfully."
      });

      console.log("🔄 Clearing cart...");
      setCart([]);
      console.log("✅ Checkout process completed successfully!", {
        saleId: sale.id,
        itemsProcessed: cart.length,
        totalAmount: calculateTotal(),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Checkout process failed:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      });
      
      toast({
        title: "Error",
        description: "There was an error processing your sale.",
        variant: "destructive"
      });
    }
  };

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    calculateTotal,
    handleCheckout
  };
};
