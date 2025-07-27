import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center p-4">
      <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Heart className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Page Not Found
          </h2>
          
          <p className="text-muted-foreground mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved. 
            Let's get you back to helping save lives.
          </p>
          
          <div className="space-y-4">
            <Link to="/" className="block">
              <Button className="w-full bg-gradient-primary text-white" size="lg">
                <Home className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              onClick={() => window.history.back()} 
              className="w-full"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Need help? Contact our support team at{" "}
              <a href="mailto:support@bloodbank.com" className="text-primary hover:underline">
                support@bloodbank.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
