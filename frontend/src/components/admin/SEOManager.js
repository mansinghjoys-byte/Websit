import React, { useState, useEffect } from 'react';
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
                  placeholder="User-agent: *\nAllow: /\nSitemap: https://vibeforwellness.com/sitemap.xml"
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
                  placeholder="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset>...</urlset>"
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
