#!/usr/bin/env python3
import os

components_dir = "/app/frontend/src/components/admin"

remaining_components = {
    "TestimonialsManager.js": """import React, { useState, useEffect } from 'react';
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
""",

    "FAQManager.js": """import React, { useState, useEffect } from 'react';
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
""",

    "SEOManager.js": """import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function SEOManager() {
  const { getAuthHeader } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [seoData, setSeoData] = useState({
    meta_title: '',
    meta_description: '',
    keywords: [],
    og_title: '',
    og_description: '',
    og_image: '',
    canonical_url: '',
    robots_txt: '',
    sitemap_xml: '',
    json_ld: {}
  });

  const [keywordsInput, setKeywordsInput] = useState('');

  useEffect(() => {
    fetchSEOSettings();
  }, []);

  const fetchSEOSettings = async () => {
    try {
      const response = await axios.get(`${API}/seo`);
      setSeoData(response.data);
      setKeywordsInput(response.data.keywords?.join(', ') || '');
    } catch (error) {
      toast.error('Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    
    const updateData = {
      ...seoData,
      keywords: keywordsInput.split(',').map(k => k.trim()).filter(k => k)
    };

    try {
      await axios.put(`${API}/seo`, updateData, {
        headers: getAuthHeader()
      });
      toast.success('SEO settings updated successfully');
      fetchSEOSettings();
    } catch (error) {
      toast.error('Failed to update SEO settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center py-12"><div className="spinner"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">SEO Management</h2>
        <Button onClick={handleSave} className="btn-primary" disabled={saving} data-testid="save-seo-btn">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="meta" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="meta" data-testid="meta-tab">Meta Tags</TabsTrigger>
          <TabsTrigger value="opengraph" data-testid="og-tab">Open Graph</TabsTrigger>
          <TabsTrigger value="technical" data-testid="technical-tab">Technical SEO</TabsTrigger>
          <TabsTrigger value="schema" data-testid="schema-tab">Schema/JSON-LD</TabsTrigger>
        </TabsList>

        <TabsContent value="meta">
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle>Meta Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Meta Title *</Label>
                <Input
                  value={seoData.meta_title}
                  onChange={(e) => setSeoData({...seoData, meta_title: e.target.value})}
                  placeholder="VIBE for Wellness | Portable PEMF Device"
                  data-testid="meta-title-input"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
              </div>
              <div>
                <Label>Meta Description *</Label>
                <Textarea
                  value={seoData.meta_description}
                  onChange={(e) => setSeoData({...seoData, meta_description: e.target.value})}
                  rows={3}
                  placeholder="Discover the VIBE device, a pocket-sized PEMF therapy tool..."
                  data-testid="meta-description-input"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
              </div>
              <div>
                <Label>Keywords (comma-separated)</Label>
                <Textarea
                  value={keywordsInput}
                  onChange={(e) => setKeywordsInput(e.target.value)}
                  rows={3}
                  placeholder="PEMF therapy, wellness device, natural healing"
                  data-testid="keywords-input"
                />
              </div>
              <div>
                <Label>Canonical URL</Label>
                <Input
                  value={seoData.canonical_url}
                  onChange={(e) => setSeoData({...seoData, canonical_url: e.target.value})}
                  placeholder="https://vibeforwellness.com"
                  data-testid="canonical-url-input"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opengraph">
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle>Open Graph Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>OG Title</Label>
                <Input
                  value={seoData.og_title}
                  onChange={(e) => setSeoData({...seoData, og_title: e.target.value})}
                  placeholder="VIBE for Wellness - Feel Better Naturally"
                  data-testid="og-title-input"
                />
              </div>
              <div>
                <Label>OG Description</Label>
                <Textarea
                  value={seoData.og_description}
                  onChange={(e) => setSeoData({...seoData, og_description: e.target.value})}
                  rows={3}
                  placeholder="Pocket PEMF powerhouse designed by NASA engineer..."
                  data-testid="og-description-input"
                />
              </div>
              <div>
                <Label>OG Image URL</Label>
                <Input
                  value={seoData.og_image}
                  onChange={(e) => setSeoData({...seoData, og_image: e.target.value})}
                  placeholder="/images/og-image.jpg"
                  data-testid="og-image-input"
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 1200x630 pixels</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical">
          <div className="space-y-6">
            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle>Robots.txt</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={seoData.robots_txt}
                  onChange={(e) => setSeoData({...seoData, robots_txt: e.target.value})}
                  rows={8}
                  placeholder="User-agent: *\\nAllow: /\\nSitemap: https://vibeforwellness.com/sitemap.xml"
                  data-testid="robots-txt-input"
                  className="font-mono text-sm"
                />
                <div className="mt-2">
                  <a
                    href={`${API}/robots.txt`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#16a4a4] hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    View Current Robots.txt
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none">
              <CardHeader>
                <CardTitle>Sitemap XML</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={seoData.sitemap_xml}
                  onChange={(e) => setSeoData({...seoData, sitemap_xml: e.target.value})}
                  rows={12}
                  placeholder="<?xml version=\\"1.0\\" encoding=\\"UTF-8\\"?>\\n<urlset>...</urlset>"
                  data-testid="sitemap-xml-input"
                  className="font-mono text-sm"
                />
                <div className="mt-2">
                  <a
                    href={`${API}/sitemap.xml`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#16a4a4] hover:underline flex items-center gap-1"
                  >
                    <Globe className="w-4 h-4" />
                    View Current Sitemap
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="schema">
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle>JSON-LD Structured Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={JSON.stringify(seoData.json_ld, null, 2)}
                onChange={(e) => {
                  try {
                    setSeoData({...seoData, json_ld: JSON.parse(e.target.value)});
                  } catch (err) {
                    // Invalid JSON, don't update
                  }
                }}
                rows={15}
                placeholder='{"@context": "https://schema.org", "@type": "Product", "name": "VIBE Device"}'
                data-testid="json-ld-input"
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-2">
                Add structured data for better search engine understanding. 
                <a href="https://schema.org" target="_blank" rel="noopener noreferrer" className="text-[#16a4a4] hover:underline ml-1">
                  Learn more about Schema.org
                </a>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
"""
}

# Create remaining components
for filename, content in remaining_components.items():
    filepath = os.path.join(components_dir, filename)
    with open(filepath, 'w') as f:
        f.write(content)
    print(f"Created {filename}")

print(f"\nAll remaining components created successfully!")
