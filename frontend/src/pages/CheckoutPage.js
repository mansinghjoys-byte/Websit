import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Zap, Check, CreditCard, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, getAuthHeader } = useAuth();
  
  const productId = location.state?.productId;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  
  const [shippingData, setShippingData] = useState({
    name: '',
    email: user?.email || '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      fetchFirstProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API}/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const fetchFirstProduct = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      if (response.data.length > 0) {
        setProduct(response.data[0]);
      }
    } catch (error) {
      toast.error('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!product) {
      toast.error('No product selected');
      return;
    }

    setProcessing(true);

    try {
      // Create order
      const orderData = {
        product_id: product.id,
        quantity: quantity,
        customer_email: shippingData.email,
        customer_name: shippingData.name,
        shipping_address: {
          address: shippingData.address,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          country: shippingData.country
        }
      };

      const orderResponse = await axios.post(
        `${API}/orders`,
        orderData,
        { headers: getAuthHeader() }
      );

      toast.success('Order created successfully!');
      
      // In production, integrate with Stripe payment
      // For now, redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">No product available</p>
          <Button onClick={() => navigate('/')} className="btn-primary">Go to Home</Button>
        </div>
      </div>
    );
  }

  const subtotal = product.sale_price * quantity;
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fffe] to-white py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-[#16a4a4]" />
            <span className="text-2xl font-bold text-[#16a4a4]">VIBE</span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            data-testid="back-home-checkout-btn"
          >
            ← Back to Home
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Checkout Form */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-6" data-testid="checkout-heading">Checkout</h1>
            
            <form onSubmit={handleCheckout} className="space-y-6">
              <Card className="shadow-lg border-none">
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={shippingData.name}
                        onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                        required
                        data-testid="shipping-name-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        required
                        data-testid="shipping-email-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      required
                      data-testid="shipping-address-input"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        required
                        data-testid="shipping-city-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={shippingData.state}
                        onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                        required
                        data-testid="shipping-state-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code *</Label>
                      <Input
                        id="zipCode"
                        value={shippingData.zipCode}
                        onChange={(e) => setShippingData({ ...shippingData, zipCode: e.target.value })}
                        required
                        data-testid="shipping-zip-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={shippingData.country}
                      onChange={(e) => setShippingData({ ...shippingData, country: e.target.value })}
                      required
                      data-testid="shipping-country-input"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-none bg-[#f0fffe]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <CreditCard className="w-6 h-6 text-[#16a4a4] flex-shrink-0 mt-1" />
                    <div className="text-sm text-gray-700">
                      <p className="font-semibold mb-1">Stripe Payment Integration</p>
                      <p>Complete payment processing will be enabled when Stripe keys are configured by the administrator.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Button
                type="submit"
                className="w-full btn-primary"
                size="lg"
                disabled={processing}
                data-testid="place-order-btn"
              >
                {processing ? 'Processing...' : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Place Order - ${total.toFixed(2)}
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <Card className="shadow-lg border-none sticky top-4">
              <CardContent className="p-6 space-y-6">
                <div className="flex gap-4">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=150&h=150&fit=crop"
                    alt={product.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.description.substring(0, 80)}...</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Label htmlFor="quantity" className="text-sm">Qty:</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        max="10"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-20"
                        data-testid="quantity-input"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span data-testid="subtotal-amount">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold" data-testid="shipping-amount">FREE</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span data-testid="total-amount">${total.toFixed(2)}</span>
                </div>

                <div className="bg-[#f0fffe] rounded-lg p-4 space-y-2">
                  {product.features.slice(0, 5).map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#16a4a4] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">{feature}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
