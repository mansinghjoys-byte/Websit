import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function TestimonialsManager() {
  const { getAuthHeader } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    text: '',
    rating: 5,
    is_active: true,
    order: 0
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${API}/testimonials`);
      setTestimonials(response.data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await axios.put(`${API}/testimonials/${editingItem.id}`, formData, {
          headers: getAuthHeader()
        });
        toast.success('Testimonial updated');
      } else {
        await axios.post(`${API}/testimonials`, formData, {
          headers: getAuthHeader()
        });
        toast.success('Testimonial created');
      }
      
      fetchTestimonials();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    
    try {
      await axios.delete(`${API}/testimonials/${id}`, {
        headers: getAuthHeader()
      });
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      text: '',
      rating: 5,
      is_active: true,
      order: 0
    });
    setEditingItem(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="spinner"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Testimonials</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="btn-primary" data-testid="add-testimonial-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="testimonial-form">
              <div>
                <Label>Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  data-testid="testimonial-name-input"
                />
              </div>
              <div>
                <Label>Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  data-testid="testimonial-location-input"
                />
              </div>
              <div>
                <Label>Testimonial Text *</Label>
                <Textarea
                  value={formData.text}
                  onChange={(e) => setFormData({...formData, text: e.target.value})}
                  required
                  rows={4}
                  data-testid="testimonial-text-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Rating (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
                    data-testid="testimonial-rating-input"
                  />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    data-testid="testimonial-order-input"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full btn-primary" data-testid="submit-testimonial-btn">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map((item) => (
          <Card key={item.id} className="shadow-lg border-none" data-testid="testimonial-card">
            <CardContent className="p-6">
              <div className="flex justify-between mb-3">
                <div className="flex gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#f17336] text-[#f17336]" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)} data-testid="edit-testimonial-btn">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDelete(item.id)}
                    data-testid="delete-testimonial-btn"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-700 italic mb-3">{item.text}</p>
              <p className="font-semibold text-gray-900">{item.name}</p>
              {item.location && <p className="text-sm text-gray-600">{item.location}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
