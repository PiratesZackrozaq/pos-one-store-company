
import { downloadReceipt } from "@/utils/receiptGenerator";
import type { CartItem } from "@/types/pos";

interface ReceiptData {
  orderId: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'card';
  date: Date;
  customerInfo: {
    name: string;
    email: string;
    address: string;
  };
}

export const useReceiptGenerator = () => {
  const generateReceipt = async (data: ReceiptData) => {
    const deliveryReceiptNumber = `DR-${new Date().getFullYear()}${String(data.orderId).padStart(6, '0')}`;
    
    const receiptData = {
      ...data,
      deliveryReceiptNumber,
    };

    console.log("🧾 Preparing receipt data:", {
      orderId: data.orderId,
      deliveryReceiptNumber,
      itemCount: data.items.length,
      total: data.total,
      timestamp: new Date().toISOString(),
      customerInfo: data.customerInfo
    });

    try {
      console.log("📄 Initiating receipt generation and download...");
      await downloadReceipt(receiptData);
      console.log("✅ Receipt generation process completed");
      return true;
    } catch (error) {
      console.error("❌ Error in receipt generation:", {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      return false;
    }
  };

  return { generateReceipt };
};
