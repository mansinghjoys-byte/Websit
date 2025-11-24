import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function PrivacyPolicy() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="container-custom">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
              <Zap className="w-8 h-8 text-[#16a4a4]" />
              <span className="text-2xl font-bold text-[#16a4a4]">VIBE</span>
              <span className="text-sm text-gray-600 hidden sm:inline">for Wellness</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <Button
                  onClick={() => navigate(user.role === 'superadmin' ? '/admin' : '/dashboard')}
                  variant="outline"
                  className="rounded-full"
                >
                  {user.role === 'superadmin' ? 'Admin' : 'Dashboard'}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="rounded-full"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Back Button */}
      <div className="pt-24 pb-8 bg-gradient-to-br from-[#f0fffe] to-white">
        <div className="container-custom">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-[#16a4a4]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: January 2025</p>

            <h2>Introduction</h2>
            <p>
              VIBE for Wellness ("we," "our," or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website or make a purchase from us.
            </p>

            <h2>Information We Collect</h2>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li>Name and contact information (email address, phone number)</li>
              <li>Shipping and billing address</li>
              <li>Payment information (processed securely through Stripe)</li>
              <li>Order history and preferences</li>
              <li>Communications with us</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders, products, and services</li>
              <li>Provide customer support</li>
              <li>Send you marketing communications (with your consent)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. 
              We may share your information with:
            </p>
            <ul>
              <li>Service providers who assist us in operating our website and conducting our business</li>
              <li>Payment processors (Stripe) to process transactions</li>
              <li>Shipping companies to deliver your orders</li>
              <li>Legal authorities when required by law</li>
            </ul>

            <h2>Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal 
              information. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2>Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access, correct, or delete your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to improve your browsing experience 
              and analyze website traffic. You can control cookies through your browser settings.
            </p>

            <h2>Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13. We do not knowingly collect 
              personal information from children under 13.
            </p>

            <h2>Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
              <br />
              Email: vibeforwellness@gmail.com
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Zap className="w-8 h-8 text-[#16a4a4]" />
              <span className="text-2xl font-bold">VIBE</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 VIBE for Wellness. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
