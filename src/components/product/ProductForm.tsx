
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { ImageUploader } from "@/components/product/ImageUploader";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id?: string;
  name: string;
  category_id: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
  description?: string;
  image?: string | null;
}

interface ProductFormProps {
  product: Product | null;
  categories: Category[] | undefined;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, categories, onSuccess, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    product?.image || null
  );
  const [formData, setFormData] = useState<Product>({
    name: product?.name || "",
    category_id: product?.category_id || "",
    price: product?.price || 0,
    cost_price: product?.cost_price || 0,
    stock_quantity: product?.stock_quantity || 0,
    description: product?.description || "",
    image: product?.image || null
  });

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return formData.image || null;
    
    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = () => {
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return false;
    }
    if (!formData.category_id) {
      toast({
        title: "Error",
        description: "Category is required",
        variant: "destructive",
      });
      return false;
    }
    if (formData.price <= 0) {
      toast({
        title: "Error",
        description: "Price must be greater than 0",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;

      // Upload image if selected
      const imageUrl = await uploadImage();
      
      // Add image URL to form data
      const productData = { ...formData };
      if (imageUrl) {
        productData.image = imageUrl;
      }

      if (product?.id) {
        // Update existing product
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        // Add new product
        const { error } = await supabase
          .from("products")
          .insert(productData);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-4 py-4">
      <ImageUploader 
        initialImage={product?.image || null}
        onImageChange={handleImageChange}
        previewUrl={imagePreview}
      />
      
      <div className="grid gap-2">
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      
      <div className="grid gap-2">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          required
        >
          <option value="">Select a category</option>
          {categories?.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid gap-2">
        <label htmlFor="price">Price</label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
          required
          min="0"
          step="0.01"
        />
      </div>
      
      <div className="grid gap-2">
        <label htmlFor="cost_price">Cost Price</label>
        <Input
          id="cost_price"
          type="number"
          value={formData.cost_price}
          onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
          required
          min="0"
          step="0.01"
        />
      </div>
      
      <div className="grid gap-2">
        <label htmlFor="stock">Stock Quantity</label>
        <Input
          id="stock"
          type="number"
          value={formData.stock_quantity}
          onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
          required
          min="0"
        />
      </div>
      
      <div className="grid gap-2">
        <label htmlFor="description">Description</label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : product?.id ? "Save Changes" : "Add Product"}
        </Button>
      </DialogFooter>
    </div>
  );
}
