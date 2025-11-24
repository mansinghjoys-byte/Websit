import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Calendar, Tag, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function BlogPostPage() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      // Update page title and meta tags
      document.title = post.meta_title || `${post.title} | VIBE for Wellness`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.meta_description || post.excerpt);
      }
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API}/blog/${slug}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      if (error.response?.status === 404) {
        toast.error('Blog post not found');
        navigate('/blog');
      } else {
        toast.error('Failed to load blog post');
      }
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

  if (!post) {
    return null;
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

      {/* Back Button */}
      <div className="pt-24 pb-8 bg-gradient-to-br from-[#f0fffe] to-white">
        <div className="container-custom">
          <Button
            variant="ghost"
            onClick={() => navigate('/blog')}
            className="text-gray-600 hover:text-[#16a4a4]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <article className="pb-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            {post.featured_image && (
              <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-auto"
                />
              </div>
            )}

            {/* Post Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(post.published_date)}</span>
              </div>
              <span>•</span>
              <span>By {post.author}</span>
              {post.tags && post.tags.length > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    {post.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Content */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#16a4a4] prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* CTA Section */}
            <div className="mt-12 p-8 bg-gradient-to-br from-[#f0fffe] to-white rounded-2xl border-2 border-[#16a4a4]">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Experience VIBE?
              </h3>
              <p className="text-gray-600 mb-6">
                Discover how PEMF therapy can transform your wellness journey. Get your VIBE device today with our 30-day money-back guarantee.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="btn-primary"
                size="lg"
              >
                Learn More About VIBE
              </Button>
            </div>
          </div>
        </div>
      </article>

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
            <p className="text-gray-400 text-sm mt-8">
              © 2025 VIBE for Wellness. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
