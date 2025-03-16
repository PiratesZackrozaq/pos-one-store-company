import { supabase } from "@/integrations/supabase/client";

export async function insertDummyData() {
  // Insert categories
  const { data: categories, error: categoriesError } = await supabase
    .from("categories")
    .insert([
      { name: "Beverages" },
      { name: "Snacks" },
      { name: "Dairy" },
      { name: "Produce" },
      { name: "Bakery" },
    ])
    .select();

  if (categoriesError) {
    console.error("Error inserting categories:", categoriesError);
    return;
  }

  // Insert products
  const products = [];
  for (const category of categories) {
    switch (category.name) {
      case "Beverages":
        products.push(
          { name: "Cola", price: 1.99, cost_price: 0.50, category_id: category.id, stock_quantity: 100 },
          { name: "Water", price: 0.99, cost_price: 0.20, category_id: category.id, stock_quantity: 200 },
          { name: "Orange Juice", price: 2.99, cost_price: 1.00, category_id: category.id, stock_quantity: 50 }
        );
        break;
      case "Snacks":
        products.push(
          { name: "Potato Chips", price: 2.49, cost_price: 0.75, category_id: category.id, stock_quantity: 80 },
          { name: "Chocolate Bar", price: 1.49, cost_price: 0.40, category_id: category.id, stock_quantity: 120 },
          { name: "Popcorn", price: 1.99, cost_price: 0.30, category_id: category.id, stock_quantity: 60 }
        );
        break;
      case "Dairy":
        products.push(
          { name: "Milk", price: 3.99, cost_price: 2.00, category_id: category.id, stock_quantity: 40 },
          { name: "Cheese", price: 4.99, cost_price: 2.50, category_id: category.id, stock_quantity: 30 },
          { name: "Yogurt", price: 1.99, cost_price: 0.80, category_id: category.id, stock_quantity: 70 }
        );
        break;
      case "Produce":
        products.push(
          { name: "Bananas", price: 0.99, cost_price: 0.30, category_id: category.id, stock_quantity: 150 },
          { name: "Apples", price: 0.50, cost_price: 0.20, category_id: category.id, stock_quantity: 200 },
          { name: "Tomatoes", price: 1.99, cost_price: 0.60, category_id: category.id, stock_quantity: 100 }
        );
        break;
      case "Bakery":
        products.push(
          { name: "Bread", price: 2.99, cost_price: 1.00, category_id: category.id, stock_quantity: 40 },
          { name: "Muffins", price: 3.99, cost_price: 1.50, category_id: category.id, stock_quantity: 30 },
          { name: "Cookies", price: 4.99, cost_price: 2.00, category_id: category.id, stock_quantity: 60 }
        );
        break;
    }
  }

  const { error: productsError } = await supabase
    .from("products")
    .insert(products);

  if (productsError) {
    console.error("Error inserting products:", productsError);
  }
}