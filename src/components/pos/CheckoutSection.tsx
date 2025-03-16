
import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CartItem } from "@/types/pos";
import { downloadReceipt } from "@/utils/receiptGenerator";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  shippingAddress: Address;
  paymentMethod: "cash" | "card";
}

interface CheckoutSectionProps {
  cart: CartItem[];
  total: number;
  onCheckout: (paymentMethod: "cash" | "card") => void;
  disabled: boolean;
}

export function CheckoutSection({ cart, total, onCheckout, disabled }: CheckoutSectionProps) {
  const TAX_RATE = 0.08;
  const subtotal = total;
  const tax = subtotal * TAX_RATE;
  const finalTotal = subtotal + tax;

  const [formData, setFormData] = useState<CheckoutFormData>({
    name: "",
    email: "",
    phone: "",
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    paymentMethod: "cash",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, [name]: value },
    }));
  };

  const handleCheckout = (paymentMethod: "cash" | "card") => {
    console.log("CheckoutSection: Initiating checkout with payment method:", paymentMethod);
    onCheckout(paymentMethod);

    if (!formData.name || !formData.email || !formData.phone || !formData.shippingAddress.street) {
      alert("Please fill out all fields before proceeding.");
      return;
    }

    const receiptData = {
      orderId: `ORD-${Date.now()}`,
      deliveryReceiptNumber: `DR-${Date.now()}`,
      items: cart,
      total: finalTotal,
      paymentMethod,
      date: new Date(),
      customerInfo: {
        name: formData.name,
        email: formData.email,
        address: `${formData.shippingAddress.street}, ${formData.shippingAddress.city}, ${formData.shippingAddress.state}, ${formData.shippingAddress.zipCode}, ${formData.shippingAddress.country}`,
      },
    };

    console.log("📄 Generating receipt with data:", receiptData);
    downloadReceipt(receiptData);
  };

  return (
    <div className="mt-6 space-y-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.shippingAddress.street}
                    onChange={handleAddressChange}
                    placeholder="Enter street address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.shippingAddress.city}
                      onChange={handleAddressChange}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.shippingAddress.state}
                      onChange={handleAddressChange}
                      placeholder="Enter state"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleAddressChange}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      value={formData.shippingAddress.country}
                      onChange={handleAddressChange}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={() => handleCheckout("cash")}
          disabled={disabled}
          className="w-full"
        >
          Pay with Cash
        </Button>
        <Button
          onClick={() => handleCheckout("card")}
          disabled={disabled}
          className="w-full"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Pay with Card
        </Button>
      </div>
    </div>
  );
}
