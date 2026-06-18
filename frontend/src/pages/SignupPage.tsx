import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import AnimatedPage from '../components/common/AnimatedPage';
import { Building, ShieldAlert } from 'lucide-react';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const SignupPage: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError(null);

    const validation = signupSchema.safeParse({ name, email, password });
    if (!validation.success) {
      const fieldErrors: any = {};
      validation.error.issues.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Sign up maps password to backend field 'password_hash'
      await signup(name, email, password);
      navigate('/onboarding', { replace: true });
    } catch (err: any) {
      console.error(err);
      setApiError(
        err.response?.data?.message || 'An error occurred during registration. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="flex min-h-screen items-center justify-center bg-brand-bg px-4 py-12 sm:px-6 lg:px-8 text-brand-text">
        <div className="w-full max-w-md space-y-8 rounded-xl border border-brand-border bg-brand-card p-8 shadow-2xl">
          {/* Header Branding */}
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary mb-4">
              <Building className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-brand-muted">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* API Error Alert */}
          {apiError && (
            <div className="flex items-center space-x-2 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Signup Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                error={errors.name}
                disabled={isSubmitting}
              />
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                error={errors.email}
                disabled={isSubmitting}
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                error={errors.password}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isSubmitting}
              >
                Sign Up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SignupPage;
