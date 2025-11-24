import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Zap, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fffe] to-white flex items-center justify-center">
      <div className="container-custom py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex items-center space-x-2">
              <Zap className="w-12 h-12 text-[#16a4a4]" />
              <span className="text-4xl font-bold text-[#16a4a4]">VIBE</span>
            </div>
          </div>

          {/* 404 */}
          <div className="space-y-4">
            <h1 className="text-9xl font-bold text-[#16a4a4]">404</h1>
            <h2 className="text-4xl font-bold text-gray-900">
              Page Not Found
            </h2>
            <p className="text-xl text-gray-600">
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Illustration */}
          <div className="py-8">
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-[#16a4a4]/10 to-[#f17336]/10 rounded-full flex items-center justify-center">
              <Search className="w-32 h-32 text-[#16a4a4]/30" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate('/')}
              className="btn-primary"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Go to Homepage
            </Button>
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="lg"
              className="rounded-full border-2 border-[#16a4a4] text-[#16a4a4] hover:bg-[#16a4a4] hover:text-white"
            >
              Go Back
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-8 border-t">
            <p className="text-gray-600 mb-4">Looking for something specific?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/#benefits" className="text-[#16a4a4] hover:underline">Benefits</a>
              <span className="text-gray-300">•</span>
              <a href="/#testimonials" className="text-[#16a4a4] hover:underline">Reviews</a>
              <span className="text-gray-300">•</span>
              <a href="/#faq" className="text-[#16a4a4] hover:underline">FAQ</a>
              <span className="text-gray-300">•</span>
              <a href="/blog" className="text-[#16a4a4] hover:underline">Blog</a>
              <span className="text-gray-300">•</span>
              <a href="mailto:vibeforwellness@gmail.com" className="text-[#16a4a4] hover:underline">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
