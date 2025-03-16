
import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/types/pos";

interface SaleData {
  total_amount: number;
  payment_method: 'cash' | 'card';
  status: 'completed';
}

export const useSaleProcessor = () => {
  const processSale = async (saleData: SaleData, cartItems: CartItem[]) => {
    console.log("📡 Sending sale creation request to Supabase...");
    console.log("📦 Sale data to be inserted:", saleData);

    const { data: sale, error: saleError } = await supabase
      .from('sales')
      .insert(saleData)
      .select()
      .single();

    if (saleError) {
      console.error("❌ Error creating sale:", {
        error: saleError,
        errorMessage: saleError.message,
        errorCode: saleError.code,
        details: saleError.details,
        hint: saleError.hint
      });
      throw saleError;
    }

    if (!sale) {
      console.error("❌ Sale data is null after successful insert");
      throw new Error("Sale data is null after successful insert");
    }

    console.log("✅ Sale record created successfully:", {
      saleId: sale.id,
      amount: sale.total_amount,
      timestamp: sale.created_at,
      status: sale.status
    });

    // Create sale items
    const saleItems = cartItems.map(item => ({
      sale_id: sale.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      subtotal: item.price * item.quantity
    }));

    console.log("📡 Sending sale items creation request to Supabase...");
    console.log("📦 Sale items data to be inserted:", saleItems);

    const { data: insertedItems, error: itemsError } = await supabase
      .from('sale_items')
      .insert(saleItems)
      .select();

    if (itemsError) {
      console.error("❌ Error creating sale items:", {
        error: itemsError,
        errorMessage: itemsError.message,
        errorCode: itemsError.code,
        details: itemsError.details,
        hint: itemsError.hint
      });
      throw itemsError;
    }

    if (!insertedItems) {
      console.error("❌ Sale items data is null after successful insert");
      throw new Error("Sale items data is null after successful insert");
    }

    console.log("✅ Sale items created successfully:", {
      itemsCount: insertedItems.length,
      items: insertedItems
    });

    return { sale, saleItems: insertedItems };
  };

  return { processSale };
};
