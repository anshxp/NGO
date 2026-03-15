import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { createDonationOrder, verifyDonationPayment } from '@/lib/donations';
import { Loader2, Heart, CheckCircle } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Donate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    donator: '',
    donatorEmail: '',
    contact: '',
    address: '',
    amount: '',
    donation_type: 'one-time',
    isAnonymous: false,
    referralCode: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.donator || !formData.donatorEmail || !formData.contact || !formData.amount) {
      toast({
        title: 'Missing Information',
        description: 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 1) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid donation amount',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);

    try {
      // Create donation order
      const donation = await createDonationOrder({
        donator: formData.donator,
        donatorEmail: formData.donatorEmail,
        contact: parseFloat(formData.contact),
        address: formData.address || undefined,
        amount,
        payment_method: 'razorpay',
        donation_type: formData.donation_type,
        isAnonymous: formData.isAnonymous,
        referralCode: formData.referralCode || undefined
      });

      // Initialize Razorpay
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

      const options = {
        key: razorpayKeyId,
        amount: amount * 100,
        currency: 'INR',
        name: 'NGO Management',
        description: `Donation - ${formData.donation_type}`,
        order_id: donation.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            await verifyDonationPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            setSuccess(true);
            toast({
              title: '🎉 Thank You!',
              description: 'Your donation was successful. Receipt sent to your email.',
            });

            setTimeout(() => {
              navigate('/');
            }, 3000);
          } catch (error: any) {
            toast({
              title: 'Verification Failed',
              description: error.message || 'Payment verification failed',
              variant: 'destructive'
            });
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.donator,
          email: formData.donatorEmail,
          contact: formData.contact
        },
        theme: {
          color: '#4CAF50'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function () {
        toast({
          title: 'Payment Failed',
          description: 'Your payment could not be processed. Please try again.',
          variant: 'destructive'
        });
        setLoading(false);
      });

      razorpay.open();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to process donation',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-600">Donation Successful!</CardTitle>
            <CardDescription>
              Thank you for your generous contribution. Your receipt has been sent to your email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Make a Donation</h1>
          <p className="text-gray-600">Your contribution helps us make a difference</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Donation Details</CardTitle>
            <CardDescription>Please fill in your information below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDonation} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="donator">Full Name *</Label>
                  <Input
                    id="donator"
                    name="donator"
                    value={formData.donator}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="donatorEmail">Email *</Label>
                  <Input
                    id="donatorEmail"
                    name="donatorEmail"
                    type="email"
                    value={formData.donatorEmail}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact">Phone Number *</Label>
                  <Input
                    id="contact"
                    name="contact"
                    type="tel"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Donation Amount (₹) *</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    min="1"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="1000"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="123 Main Street, City"
                />
              </div>

              <div>
                <Label htmlFor="donation_type">Donation Type</Label>
                <Select
                  value={formData.donation_type}
                  onValueChange={(value) => setFormData({ ...formData, donation_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="one-time">One-Time Donation</SelectItem>
                    <SelectItem value="monthly">Monthly Donation</SelectItem>
                    <SelectItem value="campaign">Campaign Donation</SelectItem>
                    <SelectItem value="general">General Fund</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                <Input
                  id="referralCode"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleInputChange}
                  placeholder="Enter referral code if you have one"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isAnonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isAnonymous: checked as boolean })
                  }
                />
                <Label htmlFor="isAnonymous" className="cursor-pointer">
                  Make this donation anonymous
                </Label>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Donate Now
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-600">
          <p>🔒 Secure payment powered by Razorpay</p>
          <p className="mt-2">80G tax exemption certificate will be sent via email</p>
        </div>
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
}
