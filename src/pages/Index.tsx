import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to AislesAdvantage</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Your modern solution for retail point of sale management
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/pos">Launch POS</Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;