
import { Link } from "react-router-dom";

export const CustomerFooter = () => {
  return (
    <footer className="border-t bg-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold mb-4">About Us</h3>
            <p className="text-sm text-muted-foreground">
            OneStoreCompanyPOS provides modern shopping solutions for customers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary">Home</Link></li>
              <li><Link to="/cart" className="hover:text-primary">Cart</Link></li>
              <li><Link to="/orders" className="hover:text-primary">Orders</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: support@onestorecompanypos.com</li>
              <li>Phone: (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} OneStoreCompanyPOS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
