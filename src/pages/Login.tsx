
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Navbar from '../components/Navbar';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const { signIn, resetPassword } = useAuth();
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      if (isResettingPassword) {
        await resetPassword(data.email);
        setIsResettingPassword(false);
        form.reset();
      } else {
        await signIn(data.email, data.password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isResettingPassword ? 'Reset Password' : 'Log in to TaskPal'}
            </CardTitle>
            <CardDescription className="text-center">
              {isResettingPassword 
                ? 'Enter your email to receive a password reset link'
                : 'Enter your credentials to access your tasks'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="your.email@example.com"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!isResettingPassword && (
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full">
                  {isResettingPassword ? 'Send Reset Link' : 'Log in'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center">
              {isResettingPassword ? (
                <Button
                  variant="link"
                  className="px-0"
                  onClick={() => setIsResettingPassword(false)}
                >
                  Back to login
                </Button>
              ) : (
                <Button
                  variant="link"
                  className="px-0"
                  onClick={() => setIsResettingPassword(true)}
                >
                  Forgot password?
                </Button>
              )}
            </div>
            {!isResettingPassword && (
              <div className="text-sm text-center">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Login;
