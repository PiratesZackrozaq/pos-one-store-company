
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { CartItem } from '@/types/pos';

interface CustomerInfo {
  name?: string;
  email?: string;
  address?: string;
}

interface ReceiptData {
  orderId: string;
  deliveryReceiptNumber: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  date: Date;
  customerInfo?: CustomerInfo;
}

export const generateReceipt = (data: ReceiptData) => {
  console.log("📄 Starting PDF generation with data:", {
    orderId: data.orderId,
    deliveryReceiptNumber: data.deliveryReceiptNumber,
    itemCount: data.items.length,
    total: data.total,
    customerInfo: data.customerInfo || 'No customer info provided'
  });
  
  try {
    // Validate required data
    if (!data.items || data.items.length === 0) {
      console.error("❌ No items provided for receipt generation");
      throw new Error("No items provided for receipt generation");
    }

    // Create new document with proper encoding
    console.log("📄 Creating PDF document instance...");
    const doc = new jsPDF({
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true
    });

    console.log("📄 PDF document instance created successfully");

    // Store Information
    doc.setFontSize(12);
    doc.text('AISLES ADVANTAGE', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text('123 Main Street, City, Country', 105, 30, { align: 'center' });
    doc.text('Tel: (123) 456-7890', 105, 35, { align: 'center' });

    console.log("📄 Store header information added");

    // Order Information
    doc.text(`Order ID: ${data.orderId}`, 20, 50);
    doc.text(`Delivery Receipt: ${data.deliveryReceiptNumber}`, 20, 55);
    doc.text(`Date: ${data.date.toLocaleString()}`, 20, 60);
    doc.text(`Payment Method: ${data.paymentMethod}`, 20, 65);

    console.log("📄 Order details added to PDF");

    // Items table
    const tableData = data.items.map(item => [
      item.name,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${(item.price * item.quantity).toFixed(2)}`
    ]);

    console.log("📄 Preparing items table with", tableData.length, "items");

    const TAX_RATE = 0.08;
    const subtotal = data.total;
    const tax = subtotal * TAX_RATE;
    const finalTotal = subtotal + tax;

    autoTable(doc, {
      startY: 70,
      head: [['Item', 'Qty', 'Price', 'Total']],
      body: tableData,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [66, 66, 66]
      }
    });

    console.log("📄 Items table generated successfully");

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('------------------------', 20, finalY);
    doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 150, finalY + 10, { align: 'right' });
    doc.text(`Tax (8%): $${tax.toFixed(2)}`, 150, finalY + 15, { align: 'right' });
    doc.text(`Total: $${finalTotal.toFixed(2)}`, 150, finalY + 20, { align: 'right' });
    doc.text('Thank you for shopping with us!', 105, finalY + 35, { align: 'center' });

    console.log("📄 Summary and totals added to PDF");

    return doc;
  } catch (error) {
    console.error("❌ Error in generateReceipt:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

export const downloadReceipt = (receiptData: ReceiptData) => {
  console.log("🔄 Starting receipt download process for order:", {
    orderId: receiptData.orderId,
    itemCount: receiptData.items.length,
    customerInfo: receiptData.customerInfo || 'No customer info provided'
  });
  
  try {
    // Validate receipt data
    if (!receiptData.orderId || !receiptData.deliveryReceiptNumber) {
      console.error("❌ Missing required receipt data:", {
        orderId: !!receiptData.orderId,
        deliveryReceiptNumber: !!receiptData.deliveryReceiptNumber
      });
      throw new Error("Missing required receipt data");
    }

    console.log("📄 Generating PDF document...");
    const doc = generateReceipt(receiptData);
    const fileName = `receipt_${receiptData.deliveryReceiptNumber}.pdf`;
    
    try {
      // Directly save the PDF using jsPDF's save method
      console.log("📄 Saving PDF file...");
      doc.save(fileName);
      console.log("✅ PDF saved successfully!");
      return true;
    } catch (saveError) {
      console.error("❌ Error saving PDF:", {
        error: saveError,
        message: saveError instanceof Error ? saveError.message : 'Unknown error',
        stack: saveError instanceof Error ? saveError.stack : undefined
      });
      throw saveError;
    }
  } catch (error) {
    console.error("❌ Error in downloadReceipt:", {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};
