import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Calendar, Tag, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function BlogPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API}/blog`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast.error('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

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
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/" className="text-gray-700 hover:text-[#16a4a4] transition-colors font-medium">Home</a>
              <a href="/#benefits" className="text-gray-700 hover:text-[#16a4a4] transition-colors font-medium">Benefits</a>
              <a href="/blog" className="text-[#16a4a4] font-bold">Blog</a>
            </nav>

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

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#f0fffe] to-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge className="bg-[#16a4a4] text-white px-4 py-2 text-sm">
              VIBE Wellness Blog
            </Badge>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-gray-900">
              Wellness Insights &<br />
              <span className="text-[#16a4a4]">PEMF Education</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore the science of PEMF therapy, wellness tips, and real stories from our community
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section bg-white">
        <div className="container-custom">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No blog posts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {posts.map((post) => (
                <Card 
                  key={post.id} 
                  className="card-hover overflow-hidden cursor-pointer border-none shadow-lg"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {post.featured_image && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.published_date)}</span>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          <span>{post.tags[0]}</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-gray-600 line-clamp-3">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center text-[#16a4a4] font-semibold pt-2">
                      <span>Read More</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-custom">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Zap className="w-8 h-8 text-[#16a4a4]" />
              <span className="text-2xl font-bold">VIBE</span>
            </div>
            <p className="text-gray-400 text-sm">
              Recharge Your Body. Restore Your Balance. Return to Your Natural Rhythm.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="border-[#16a4a4] text-[#16a4a4] hover:bg-[#16a4a4] hover:text-white"
              >
                Back to Home
              </Button>
            </div>
            <p className="text-gray-400 text-sm mt-8">
              © 2025 VIBE for Wellness. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
