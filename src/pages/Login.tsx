import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Heart, Lock, User, Mail, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, resetPassword, updatePassword, user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    fullName: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // Check for password reset mode
  useEffect(() => {
    const isResetMode = searchParams.get('reset') === 'true';
    setShowResetPassword(isResetMode);
    if (isResetMode) {
      setIsLogin(true);
      setShowForgotPassword(false);
    }
  }, [searchParams]);

  // Redirect if already authenticated (but not during password reset)
  useEffect(() => {
    if (user && !loading && !showResetPassword) {
      navigate("/");
    }
  }, [user, loading, navigate, showResetPassword]);

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
            newPassword: "",
            confirmNewPassword: "",
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await resetPassword(formData.email);
    setIsSubmitting(false);
    
    if (!error) {
      setShowForgotPassword(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please ensure passwords match",
        variant: "destructive",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await updatePassword(formData.newPassword);
    setIsSubmitting(false);
    
    if (!error) {
      toast({
        title: "Success!",
        description: "Your password has been updated. You can now sign in.",
      });
      setShowResetPassword(false);
      navigate('/login');
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
            {showResetPassword ? (
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium">Set New Password</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your new password below
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      required
                      className="bg-background/50 pr-10"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmNewPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmNewPassword}
                      onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                      required
                      className="bg-background/50 pr-10"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary text-white hover:opacity-90 transition-opacity"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetPassword(false);
                      navigate('/login');
                    }}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Back to sign in
                  </button>
                </div>
              </form>
            ) : (
              <>
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
                            <SelectItem value="admin">Admin</SelectItem>
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

                {isLogin && !showForgotPassword && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot your password?
                    </button>
                  </div>
                )}

                {showForgotPassword && (
                  <form onSubmit={handleForgotPassword} className="space-y-4 border-t pt-4">
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Reset Password</h3>
                      <p className="text-sm text-muted-foreground">
                        Enter your email to receive a reset link
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input
                        id="reset-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="bg-background/50"
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowForgotPassword(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </div>
                  </form>
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;