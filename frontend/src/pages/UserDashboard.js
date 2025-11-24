import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Package, User, LogOut, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout, getAuthHeader } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API}/orders`, {
        headers: getAuthHeader()
      });
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      completed: 'bg-green-500',
      failed: 'bg-red-500',
      refunded: 'bg-gray-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fffe] to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-[#16a4a4]" />
              <span className="text-2xl font-bold text-[#16a4a4]">VIBE</span>
              <span className="text-sm text-gray-600 hidden sm:inline">Dashboard</span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                data-testid="home-btn"
              >
                Home
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-red-600 border-red-600 hover:bg-red-50"
                data-testid="logout-btn"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8" data-testid="welcome-section">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back!</h1>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="shadow-lg border-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#16a4a4]/10 flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-[#16a4a4]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="total-orders">{orders.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="completed-orders">
                      {orders.filter(o => o.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Package className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="pending-orders">
                      {orders.filter(o => o.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="orders" data-testid="orders-tab">My Orders</TabsTrigger>
              <TabsTrigger value="profile" data-testid="profile-tab">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="orders">
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-12" data-testid="no-orders">
                      <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No orders yet</p>
                      <Button
                        onClick={() => navigate('/')}
                        className="btn-primary"
                        data-testid="shop-now-btn"
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id} className="bg-gray-50 border-none" data-testid="order-card">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge className={`${getStatusColor(order.status)} text-white`}>
                                    {order.status.toUpperCase()}
                                  </Badge>
                                  <span className="text-sm text-gray-600">
                                    Order #{order.id.slice(0, 8)}
                                  </span>
                                </div>
                                <p className="text-gray-700 font-medium">Quantity: {order.quantity}</p>
                                <p className="text-sm text-gray-600">
                                  {new Date(order.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900" data-testid="order-amount">
                                  ${order.amount.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#16a4a4] flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                      <Badge className="bg-[#16a4a4] text-white mt-1">Customer</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-gray-900 font-medium" data-testid="user-email">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Status</p>
                      <p className="text-gray-900 font-medium">Active</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="text-gray-900 font-medium">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
