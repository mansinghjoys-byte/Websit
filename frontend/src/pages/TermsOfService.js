import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function TermsOfService() {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last updated: January 2025</p>

            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using VIBE for Wellness website and services, you accept and agree to be 
              bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2>Product Information</h2>
            <p>
              The VIBE device is an FDA-registered general wellness device. It does NOT treat, diagnose, 
              prevent, or cure any disease. We make no medical claims. The device is intended to help 
              individuals maintain wellness and support overall well-being.
            </p>

            <h2>Use of Services</h2>
            <p>You agree to:</p>
            <ul>
              <li>Provide accurate and complete information when making purchases</li>
              <li>Use the VIBE device according to provided instructions</li>
              <li>Not use our services for any illegal or unauthorized purpose</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2>Orders and Payments</h2>
            <ul>
              <li>All orders are subject to product availability</li>
              <li>Prices are subject to change without notice</li>
              <li>Payment is processed securely through Stripe</li>
              <li>We reserve the right to refuse or cancel any order</li>
            </ul>

            <h2>Shipping and Delivery</h2>
            <ul>
              <li>We offer free worldwide shipping</li>
              <li>Delivery times vary by location</li>
              <li>Risk of loss transfers to you upon delivery to the carrier</li>
              <li>You are responsible for providing accurate shipping information</li>
            </ul>

            <h2>Returns and Refunds</h2>
            <ul>
              <li>We offer a 30-day money-back guarantee from the date of delivery</li>
              <li>Products must be returned in original condition</li>
              <li>We cover return shipping costs</li>
              <li>Refunds will be processed within 10 business days</li>
              <li>Certain conditions and exclusions may apply</li>
            </ul>

            <h2>Warranty</h2>
            <p>
              The VIBE device comes with a 1-year limited warranty covering manufacturing defects. 
              The warranty does not cover damage from misuse, accidents, or normal wear and tear.
            </p>

            <h2>Disclaimer of Warranties</h2>
            <p>
              THE SERVICES AND PRODUCTS ARE PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, 
              EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, 
              INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED 
              TO YOUR USE OF OUR SERVICES OR PRODUCTS.
            </p>

            <h2>Intellectual Property</h2>
            <p>
              All content on this website, including text, graphics, logos, and images, is the property 
              of VIBE for Wellness or its content suppliers and is protected by intellectual property laws.
            </p>

            <h2>Modifications to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be effective 
              immediately upon posting. Your continued use of our services constitutes acceptance of the 
              modified terms.
            </p>

            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws, 
              without regard to conflict of law principles.
            </p>

            <h2>Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us at:
              <br />
              Email: vibeforwellness@gmail.com
            </p>

            <h2>Medical Disclaimer</h2>
            <p className="text-red-600 font-semibold">
              The VIBE device is an FDA-registered general wellness device. It does NOT treat, diagnose, 
              prevent, or cure any disease, nor do we make ANY claims in this manner. Always consult with 
              a qualified healthcare professional before using any wellness device, especially if you have 
              a pacemaker, are pregnant, or have any medical conditions.
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
