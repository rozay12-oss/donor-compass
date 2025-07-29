import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Lock, User, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    fullName: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!isLogin) {
        // Sign up flow
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Password Mismatch",
            description: "Please ensure passwords match",
            variant: "destructive",
          });
          return;
        }

        if (!formData.role) {
          toast({
            title: "Role Required",
            description: "Please select your role",
            variant: "destructive",
          });
          return;
        }

        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
          role: formData.role
        });

        if (!error) {
          // Clear form on successful signup
          setFormData({
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
            fullName: "",
          });
        }
      } else {
        // Sign in flow
        const { error } = await signIn(formData.email, formData.password);
        
        if (!error) {
          navigate("/");
        }
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Blood Bank System
            </CardTitle>
            <p className="text-muted-foreground">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex gap-2 mb-6">
              <Button
                type="button"
                variant={isLogin ? "default" : "outline"}
                onClick={() => setIsLogin(true)}
                className="flex-1"
              >
                Sign In
              </Button>
              <Button
                type="button"
                variant={!isLogin ? "default" : "outline"}
                onClick={() => setIsLogin(false)}
                className="flex-1"
              >
                Sign Up
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required={!isLogin}
                    className="bg-background/50"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="bg-background/50"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                      required
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="donor">Donor</SelectItem>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="hospital">Hospital Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary text-white hover:opacity-90 transition-opacity"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Please wait..." : (isLogin ? "Sign In" : "Create Account")}
              </Button>
            </form>

            {isLogin && (
              <div className="text-center">
                <Link to="#" className="text-sm text-primary hover:underline">
                  Forgot your password?
                </Link>
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;