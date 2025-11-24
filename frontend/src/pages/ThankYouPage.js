import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, CheckCircle, Package, Mail, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ThankYouPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const orderData = location.state?.orderData;

  useEffect(() => {
    // Track conversion
    if (window.posthog) {
      window.posthog.capture('purchase_completed', {
        order_id: orderData?.id,
        amount: orderData?.amount
      });
    }
  }, [orderData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fffe] to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-8 h-8 text-[#16a4a4]" />
            <span className="text-2xl font-bold text-[#16a4a4]">VIBE</span>
            <span className="text-sm text-gray-600">for Wellness</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-custom py-20">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Thank You for Your Order!
            </h1>
            <p className="text-xl text-gray-600">
              Your VIBE journey begins now. We're excited to be part of your wellness transformation.
            </p>
          </div>

          {/* Order Details */}
          {orderData && (
            <Card className="bg-white shadow-lg border-none">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Order Confirmation</h2>
                <div className="text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order ID:</span>
                    <span className="font-semibold text-gray-900">{orderData.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-semibold text-gray-900">${orderData.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-semibold text-gray-900">{orderData.customer_email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* What Happens Next */}
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <Card className="bg-white shadow-md border-none">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-[#16a4a4]/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-[#16a4a4]" />
                </div>
                <h3 className="font-bold text-gray-900">Confirmation Email</h3>
                <p className="text-sm text-gray-600">
                  You'll receive an order confirmation email shortly with all the details.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-none">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-[#16a4a4]/10 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-[#16a4a4]" />
                </div>
                <h3 className="font-bold text-gray-900">Fast Shipping</h3>
                <p className="text-sm text-gray-600">
                  Your VIBE device will ship within 1-2 business days with free worldwide shipping.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-md border-none">
              <CardContent className="p-6 space-y-3">
                <div className="w-12 h-12 bg-[#16a4a4]/10 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-[#16a4a4]" />
                </div>
                <h3 className="font-bold text-gray-900">Join Our Community</h3>
                <p className="text-sm text-gray-600">
                  Get personal guidance and connect with other VIBE users.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Community CTA */}
          <Card className="bg-gradient-to-br from-[#16a4a4] to-[#128a8a] text-white border-none">
            <CardContent className="p-8 space-y-4">
              <h2 className="text-2xl font-bold">Join the VIBE Community</h2>
              <p className="text-white/90">
                Connect with thousands of VIBE users, get personalized protocol recommendations, 
                and receive ongoing support from Smita.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  onClick={() => window.open('https://chat.whatsapp.com/Gqfc0dqoN4SDU60yTw1O0G', '_blank')}
                  className="bg-white text-[#16a4a4] hover:bg-gray-100"
                  size="lg"
                >
                  Join WhatsApp Community
                </Button>
                <Button
                  onClick={() => window.open('https://www.facebook.com/groups/vibecustomers', '_blank')}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-[#16a4a4]"
                  size="lg"
                >
                  Join Facebook Group
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            {user && (
              <Button
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
                size="lg"
              >
                View My Orders
              </Button>
            )}
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-[#16a4a4] text-[#16a4a4] hover:bg-[#16a4a4] hover:text-white"
            >
              Return to Home
            </Button>
          </div>

          {/* Support */}
          <div className="pt-8 border-t">
            <p className="text-gray-600">
              Questions about your order? Contact us at{' '}
              <a href="mailto:vibeforwellness@gmail.com" className="text-[#16a4a4] font-semibold hover:underline">
                vibeforwellness@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container-custom text-center">
          <p className="text-gray-400 text-sm">
            © 2025 VIBE for Wellness. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
