import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, LogOut, BarChart3, Package, Users, Settings, MessageSquare, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

// Import admin components
import AdminStats from '../components/admin/AdminStats';
import ProductsManager from '../components/admin/ProductsManager';
import OrdersManager from '../components/admin/OrdersManager';
import UsersManager from '../components/admin/UsersManager';
import TestimonialsManager from '../components/admin/TestimonialsManager';
import FAQManager from '../components/admin/FAQManager';
import SEOManager from '../components/admin/SEOManager';
import BlogManager from '../components/admin/BlogManager';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout, getAuthHeader } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fffe] to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-[#16a4a4]" />
              <span className="text-2xl font-bold text-[#16a4a4]">VIBE</span>
              <span className="text-sm text-gray-600 hidden sm:inline">Admin Dashboard</span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                data-testid="view-site-btn"
              >
                View Site
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                data-testid="admin-logout-btn"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your VIBE wellness platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-2 h-auto bg-white p-2 rounded-lg shadow">
            <TabsTrigger value="overview" className="flex items-center gap-2" data-testid="overview-tab">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2" data-testid="products-tab">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Products</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2" data-testid="orders-admin-tab">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2" data-testid="users-tab">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2" data-testid="blog-tab">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2" data-testid="testimonials-tab">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Reviews</span>
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2" data-testid="faqs-tab">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">FAQs</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="flex items-center gap-2" data-testid="seo-tab">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminStats />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>

          <TabsContent value="orders">
            <OrdersManager />
          </TabsContent>

          <TabsContent value="users">
            <UsersManager />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsManager />
          </TabsContent>

          <TabsContent value="faqs">
            <FAQManager />
          </TabsContent>

          <TabsContent value="seo">
            <SEOManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
