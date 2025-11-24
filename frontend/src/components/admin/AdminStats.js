import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminStats() {
  const { getAuthHeader } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/stats`, {
        headers: getAuthHeader()
      });
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="spinner"></div></div>;
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `$${stats?.total_revenue?.toFixed(2) || '0.00'}`,
      icon: DollarSign,
      color: 'bg-green-500',
      testId: 'admin-total-revenue'
    },
    {
      title: 'Total Orders',
      value: stats?.total_orders || 0,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      testId: 'admin-total-orders'
    },
    {
      title: 'Total Customers',
      value: stats?.total_users || 0,
      icon: Users,
      color: 'bg-purple-500',
      testId: 'admin-total-users'
    },
    {
      title: 'Pending Orders',
      value: stats?.pending_orders || 0,
      icon: Package,
      color: 'bg-yellow-500',
      testId: 'admin-pending-orders'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="shadow-lg border-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900" data-testid={stat.testId}>
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 text-${stat.color.split('-')[1]}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-lg border-none">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#f0fffe] rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Completed Orders</h4>
              <p className="text-2xl font-bold text-[#16a4a4]" data-testid="admin-completed-orders">
                {stats?.completed_orders || 0}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Success Rate</h4>
              <p className="text-2xl font-bold text-green-600">
                {stats?.total_orders > 0 
                  ? `${((stats.completed_orders / stats.total_orders) * 100).toFixed(1)}%`
                  : '0%'
                }
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Avg Order Value</h4>
              <p className="text-2xl font-bold text-purple-600">
                ${stats?.completed_orders > 0
                  ? (stats.total_revenue / stats.completed_orders).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
