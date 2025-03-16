import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <span className="hidden sm:inline">•</span>
            <Link to="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} AislesAdvantage. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};