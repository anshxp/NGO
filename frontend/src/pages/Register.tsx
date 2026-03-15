import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Lock, Mail, User, Phone, MapPin, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { gql } from '@/lib/graphqlClient';

const Register = () => {
    const navigate = useNavigate();
    // We can't use login from useAuth directly for registration, we need to call the register mutation.
    // After registration, we can login automatically or ask user to login.
    // The register mutation returns a token and user, so we can potentially login immediately if we expose a setAuth method,
    // but for now, let's just use the `login` method from context after successful registration.
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        dateOfBirth: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('📝 Submitting registration form');

            const registerMutation = `
        mutation Register($input: RegisterInput!) {
          register(input: $input) {
            token
            user {
              _id
              name
              email
              role
            }
          }
        }
      `;

            const variables = {
                input: {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    address: formData.address,
                    // Optional fields if provided
                    ...(formData.dateOfBirth ? { dateOfBirth: formData.dateOfBirth } : {})
                }
            };

            await gql(registerMutation, variables);

            toast.success('Registration successful! Logging you in...');

            // Attempt to login automatically (or just redirect to login if auto-login logic is complex here)
            // Since we have the password, we can just call login
            await login(formData.email, formData.password);

            // Navigation will be handled by the login function's check or manual redirect
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);

        } catch (err: any) {
            const errorMsg = err.message || 'Registration failed. Please try again.';
            console.error('❌ Registration error:', err);
            setError(errorMsg);
            toast.error(errorMsg);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
            <Navigation />

            <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-12">
                <div className="w-full flex-auto my-8 max-w-xl">
                    <Card className="border-0 flex flex-col py-8 justify-around shadow-xl">
                        <CardHeader className="space-y-2">
                            <div className="flex justify-center mb-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                            <CardTitle className="text-center text-2xl">Create an Account</CardTitle>
                            <CardDescription className="text-center">
                                Join our community as a volunteer or donor
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-gap-2">
                                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-sm text-red-700 ml-2">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="px-4 py-2"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="px-4 py-2"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+91 9876543210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            disabled={loading}
                                            className="px-4 py-2"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                                            <User className="w-4 h-4" />
                                            Date of Birth
                                        </Label>
                                        <Input
                                            id="dateOfBirth"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            disabled={loading}
                                            className="px-4 py-2"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address" className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Address
                                    </Label>
                                    <Input
                                        id="address"
                                        type="text"
                                        placeholder="City, Country"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="px-4 py-2"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="flex items-center gap-2">
                                        <Lock className="w-4 h-4" />
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                        className="px-4 py-2"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-accent hover:opacity-90 text-white font-semibold py-2 mt-6"
                                    disabled={loading}
                                >
                                    {loading ? 'Creating Account...' : 'Register'}
                                </Button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                                        Login here
                                    </Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Register;
