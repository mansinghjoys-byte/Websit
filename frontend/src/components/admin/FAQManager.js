import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function FAQManager() {
  const { getAuthHeader } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    is_active: true,
    order: 0
  });

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const response = await axios.get(`${API}/faqs`);
      setFaqs(response.data);
    } catch (error) {
      toast.error('Failed to load FAQs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await axios.put(`${API}/faqs/${editingItem.id}`, formData, {
          headers: getAuthHeader()
        });
        toast.success('FAQ updated');
      } else {
        await axios.post(`${API}/faqs`, formData, {
          headers: getAuthHeader()
        });
        toast.success('FAQ created');
      }
      
      fetchFAQs();
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
      await axios.delete(`${API}/faqs/${id}`, {
        headers: getAuthHeader()
      });
      toast.success('FAQ deleted');
      fetchFAQs();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      answer: '',
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
        <h2 className="text-2xl font-bold text-gray-900">FAQs</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="btn-primary" data-testid="add-faq-btn">
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingItem ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="faq-form">
              <div>
                <Label>Question *</Label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({...formData, question: e.target.value})}
                  required
                  data-testid="faq-question-input"
                />
              </div>
              <div>
                <Label>Answer *</Label>
                <Textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({...formData, answer: e.target.value})}
                  required
                  rows={4}
                  data-testid="faq-answer-input"
                />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  data-testid="faq-order-input"
                />
              </div>
              <Button type="submit" className="w-full btn-primary" data-testid="submit-faq-btn">
                {editingItem ? 'Update' : 'Create'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {faqs.map((item) => (
          <Card key={item.id} className="shadow-lg border-none" data-testid="faq-card">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)} data-testid="edit-faq-btn">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDelete(item.id)}
                    data-testid="delete-faq-btn"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-700">{item.answer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
