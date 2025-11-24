import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star, Check, Zap, Moon, Brain, Heart, Shield, Clock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [seoSettings, setSeoSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (seoSettings) {
      document.title = seoSettings.meta_title;
      
      // Meta tags
      updateMetaTag('description', seoSettings.meta_description);
      updateMetaTag('keywords', seoSettings.keywords?.join(', '));
      
      // Open Graph tags
      updateMetaTag('og:title', seoSettings.og_title, 'property');
      updateMetaTag('og:description', seoSettings.og_description, 'property');
      updateMetaTag('og:image', seoSettings.og_image, 'property');
      
      // Canonical URL
      updateLinkTag('canonical', seoSettings.canonical_url);
    }
  }, [seoSettings]);

  const updateMetaTag = (name, content, type = 'name') => {
    if (!content) return;
    let element = document.querySelector(`meta[${type}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(type, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  const updateLinkTag = (rel, href) => {
    if (!href) return;
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (!element) {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      document.head.appendChild(element);
    }
    element.setAttribute('href', href);
  };

  const fetchData = async () => {
    try {
      const [productsRes, testimonialsRes, faqsRes, seoRes] = await Promise.all([
        axios.get(`${API}/products`),
        axios.get(`${API}/testimonials`),
        axios.get(`${API}/faqs`),
        axios.get(`${API}/seo`)
      ]);

      setProducts(productsRes.data);
      setTestimonials(testimonialsRes.data);
      setFaqs(faqsRes.data);
      setSeoSettings(seoRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load page data');
    } finally {
      setLoading(false);
    }
  };

  const handleGetStarted = () => {
    window.open('https://resona.health/shop/?ap_id=smitashares', '_blank');
  };

  const handleResearch = () => {
    window.open('https://resona.health/research/?ap_id=smitashares', '_blank');
  };

  const mainProduct = products[0];

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
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-[#16a4a4]" />
              <span className="text-2xl font-bold text-[#16a4a4]">VIBE</span>
              <span className="text-sm text-gray-600 hidden sm:inline">for Wellness</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#benefits" className="text-gray-700 hover:text-[#16a4a4] transition-colors font-medium">Benefits</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-[#16a4a4] transition-colors font-medium">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-[#16a4a4] transition-colors font-medium">Reviews</a>
              <a href="#faq" className="text-gray-700 hover:text-[#16a4a4] transition-colors font-medium">FAQ</a>
              <a href="/blog" className="text-gray-700 hover:text-[#16a4a4] transition-colors font-medium">Blog</a>
            </nav>

            <div className="flex items-center space-x-4">
              {user ? (
                <Button
                  onClick={() => navigate(user.role === 'superadmin' ? '/admin' : '/dashboard')}
                  variant="outline"
                  className="rounded-full"
                  data-testid="dashboard-btn"
                >
                  {user.role === 'superadmin' ? 'Admin' : 'Dashboard'}
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  variant="outline"
                  className="rounded-full"
                  data-testid="login-btn"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#f0fffe] to-white" data-testid="hero-section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <Badge className="bg-[#16a4a4] text-white px-4 py-2 text-sm" data-testid="hero-badge">
                NASA-Tested Technology
              </Badge>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-gray-900" data-testid="hero-heading">
                Feel Better.<br />
                <span className="text-[#16a4a4]">Naturally.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 max-w-2xl" data-testid="hero-description">
                Meet VIBE, the pocket PEMF powerhouse designed by Mark Fox, former NASA Space Shuttle Chief Engineer, 
                that optimizes your cellular energy, reduces inflammation, and restores mental clarity — without 
                stimulants, supplements, or guesswork.
              </p>

              {mainProduct && (
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-gray-900" data-testid="sale-price">${mainProduct.sale_price}</span>
                      <span className="text-xl text-gray-400 line-through" data-testid="regular-price">${mainProduct.regular_price}</span>
                      <Badge className="bg-[#f17336] text-white" data-testid="discount-badge">Save ${mainProduct.regular_price - mainProduct.sale_price}</Badge>
                    </div>
                    <p className="text-sm text-gray-500">Free Worldwide Shipping</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleGetStarted}
                  className="btn-primary group"
                  size="lg"
                  data-testid="get-vibe-btn"
                >
                  <ShoppingCart className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                  Get Your VIBE Device - $100 Off
                </Button>
                <Button
                  onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-[#16a4a4] text-[#16a4a4] hover:bg-[#16a4a4] hover:text-white"
                  data-testid="learn-more-btn"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-[#f17336] text-[#f17336]" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-bold">4.9/5</span> from 10,000+ happy users
                </p>
              </div>
            </div>

            <div className="relative animate-fade-in-up" data-testid="hero-image">
              <div className="relative bg-gradient-to-br from-[#16a4a4]/10 to-[#f17336]/10 rounded-3xl p-8">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=600&fit=crop"
                  alt="VIBE PEMF Device"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-2">
                    <Check className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-bold text-gray-900">98% Success Rate</p>
                      <p className="text-sm text-gray-600">Clinically Proven</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* As Seen On */}
      <section className="py-20 bg-gray-50" data-testid="as-seen-on-section">
        <div className="container-custom">
          <div className="relative flex flex-col items-center">
            {/* Black Banner */}
            <div className="relative z-5 bg-black text-white px-32 pt-8 pb-20 rounded-3xl shadow-2xl">
              <h3 className="text-5xl font-bold uppercase tracking-[0.5em] leading-none whitespace-nowrap" style={{ fontFamily: 'Arial Black, sans-serif' }}>
                AS SEEN ON
              </h3>
            </div>
            
            {/* Logos Container - Below the banner, overlapping bottom edge only */}
            <div className="relative z-10 flex items-center justify-center mt-[-80px]">
              <div className="flex items-center justify-center">
                {[
                  { 
                    name: 'BENZINGA',
                    logo: 'https://logo.clearbit.com/benzinga.com',
                    alt: 'Benzinga Logo'
                  },
                  {
                    name: 'NBC',
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/NBC_logo.svg/320px-NBC_logo.svg.png',
                    alt: 'NBC Logo'
                  },
                  {
                    name: 'abc',
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ABC-2021-LOGO.svg/320px-ABC-2021-LOGO.svg.png',
                    alt: 'ABC Logo'
                  },
                  {
                    name: 'CBS',
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/CBS_logo_%282020%29.svg/320px-CBS_logo_%282020%29.svg.png',
                    alt: 'CBS Logo'
                  },
                  {
                    name: 'FOX NEWS',
                    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Fox_News_Channel_logo.svg/320px-Fox_News_Channel_logo.svg.png',
                    alt: 'FOX NEWS Logo'
                  },
                  {
                    name: 'USA TODAY',
                    logo: 'https://logo.clearbit.com/usatoday.com',
                    alt: 'USA Today Logo'
                  },
                  {
                    name: 'DIGITAL JOURNAL',
                    logo: 'https://logo.clearbit.com/digitaljournal.com',
                    alt: 'Digital Journal Logo'
                  }
                ].map((outlet, idx) => (
                  <div
                    key={idx}
                    className="relative bg-white flex items-center justify-center transition-all duration-300 hover:scale-105"
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25), 0 10px 25px rgba(0, 0, 0, 0.15)',
                      marginLeft: idx === 0 ? '0' : '-15px',
                      zIndex: 20 + idx,
                    }}
                  >
                    <img 
                      src={outlet.logo} 
                      alt={outlet.alt}
                      className="max-w-full max-h-full object-contain p-3"
                      style={{ maxHeight: '85px', maxWidth: '95px' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden items-center justify-center text-center w-full">
                      <span className="font-bold text-gray-800 text-sm">{outlet.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="section bg-white" id="problem" data-testid="problem-section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Why You Don't Feel Your Best<br />
              <span className="text-[#16a4a4]">(And How to Feel Better)</span>
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Your body is made of <span className="font-bold text-gray-900">70 trillion tiny batteries</span> called cells. 
              Modern-day life, stress, toxins, poor sleep, illness, inflammation, and aging drain those batteries, 
              leaving you exhausted, achy, and mentally foggy.
            </p>

            <Card className="mt-8 bg-[#f0fffe] border-none shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The VIBE Solution</h3>
                <p className="text-lg text-gray-700 mb-4">
                  The VIBE uses <span className="font-bold text-[#16a4a4]">PEMF (Pulsed Electromagnetic Field) therapy</span>, 
                  the same technology NASA has been using for astronauts for over 50 years, to "recharge" your cells at the deepest level.
                </p>
                <p className="text-xl font-semibold text-gray-900 italic">
                  Think of it like plugging in your phone, but for your body.
                </p>
              </CardContent>
            </Card>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {[
                { icon: Zap, text: 'More Energy', color: '#f17336' },
                { icon: Moon, text: 'Better Sleep', color: '#16a4a4' },
                { icon: Heart, text: 'Less Pain', color: '#f17336' },
                { icon: Brain, text: 'Calmer Mind', color: '#16a4a4' }
              ].map((benefit, idx) => (
                <Card key={idx} className="card-hover bg-white shadow-lg border-none">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${benefit.color}15` }}>
                      <benefit.icon className="w-8 h-8" style={{ color: benefit.color }} />
                    </div>
                    <p className="font-bold text-lg text-gray-900">{benefit.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <Button
                onClick={handleResearch}
                className="btn-primary mt-8"
                size="lg"
                data-testid="try-risk-free-btn-1"
              >
                Try It Risk-Free for 30 Days →
              </Button>
              <p className="text-sm text-gray-600">Free Worldwide Shipping</p>
              <div className="pt-4">
                <Button
                  onClick={handleResearch}
                  variant="link"
                  className="text-[#16a4a4] text-lg font-semibold hover:underline"
                >
                  → See How Cellular Optimization Works
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section bg-gradient-to-br from-[#f0fffe] to-white" id="how-it-works" data-testid="how-it-works-section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                The VIBE Pocket PEMF Device
              </h2>
              <p className="text-xl text-gray-600">
                Trusted by humans, pets, athletes, and wellness professionals worldwide
              </p>
            </div>

            <Card className="bg-white shadow-xl border-none">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-2xl font-bold text-[#16a4a4]">What is PEMF?</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Used by NASA and medical professionals for decades, <span className="font-bold">PEMF (Pulsed Electromagnetic Field) therapy</span> has 
                  helped millions restore their bodies naturally. PEMF sends gentle & safe electromagnetic pulses that recharge your 
                  body's natural batteries, helping you heal and function better.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-center text-gray-900">
                From Drained to Recharged
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    step: '1',
                    title: 'Emit',
                    description: 'The VIBE sends safe, precisely calibrated electromagnetic pulses into your body (you won\'t feel a thing) that sync with your natural electrical rhythms.',
                    icon: Sparkles
                  },
                  {
                    step: '2',
                    title: 'Penetrate',
                    description: 'These invisible pulses penetrate tissue, bone, and organs—reaching cells conventional treatments can\'t.',
                    icon: Zap
                  },
                  {
                    step: '3',
                    title: 'Recharge',
                    description: 'Cellular batteries recharge and energy production ramps up naturally.',
                    icon: Heart
                  },
                  {
                    step: '4',
                    title: 'Transform',
                    description: 'Pain decreases, clarity increases, inflammation drops, sleep deepens, anxiety lifts, energy returns, and so much more.',
                    icon: Star
                  }
                ].map((step) => (
                  <Card key={step.step} className="card-hover bg-white shadow-lg border-none">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#16a4a4] text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                          {step.step}
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <step.icon className="w-6 h-6 text-[#f17336]" />
                            <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
                          </div>
                          <p className="text-gray-700">{step.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="text-center">
              <Button
                onClick={handleResearch}
                className="btn-primary"
                size="lg"
                data-testid="try-risk-free-btn-2"
              >
                Try It Risk-Free for 30 Days →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section bg-white" id="benefits" data-testid="benefits-section">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                What VIBE Users Feel
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: '🔋', title: 'Sustained Energy', description: 'No more 3pm crashes. Feel alert and focused all day.' },
                { icon: '😴', title: 'Deep, Restful Sleep', description: 'Restores sleep patterns to help you fall asleep faster and wake up refreshed.' },
                { icon: '🧠', title: 'Mental Clarity', description: 'Sharper thinking. Better memory. Less brain fog.' },
                { icon: '💪', title: 'Faster Recovery', description: 'Bounce back quicker from workouts and physical stress.' },
                { icon: '😌', title: 'Stress Resilience', description: 'Feel calmer, more balanced, and emotionally steady.' },
                { icon: '🩹', title: 'Natural Pain Relief', description: 'Reduce inflammation and discomfort without medication.' },
                { icon: '💚', title: 'Gut Health', description: 'Supports proper digestion and microbiome balance.' },
                { icon: '🔥', title: 'Reduces Inflammation', description: 'Targets the root cause of many health issues.' },
                { icon: '🛡️', title: 'Stronger Immunity', description: 'Support your body\'s natural defense systems.' }
              ].map((benefit, idx) => (
                <Card key={idx} className="card-hover bg-white shadow-lg border-none">
                  <CardContent className="p-6 space-y-3">
                    <div className="text-4xl mb-2">{benefit.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center space-y-4">
              <Button
                onClick={handleResearch}
                className="btn-primary"
                size="lg"
                data-testid="explore-protocols-btn"
              >
                Explore All 60 Protocols →
              </Button>
              <div>
                <Button
                  onClick={handleResearch}
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-[#16a4a4] text-[#16a4a4] hover:bg-[#16a4a4] hover:text-white"
                  data-testid="try-risk-free-btn-3"
                >
                  Try It Risk-Free for 30 Days →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why VIBE is Different */}
      <section className="section bg-gradient-to-br from-gray-50 to-white" data-testid="why-different-section">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                Most PEMF devices are expensive, bulky,<br />
                and require you to lie down for hours.
              </h2>
              <p className="text-3xl font-bold text-[#16a4a4]">Not the VIBE.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: Check, text: 'World\'s Only Pocket PEMF — Fits anywhere. Works everywhere.' },
                { icon: Check, text: 'Cost-effective — Clinical grade technology at a fraction of the cost.' },
                { icon: Check, text: 'No Time Investment — Wear it during meetings, errands, or sleep.' },
                { icon: Check, text: '98% Success Rate — Clinically proven for PTSD and dozens of other conditions.' },
                { icon: Check, text: '60 Unique Protocols — Immune support, inflammation, pain and everything in between.' },
                { icon: Check, text: 'Silent & Discreet — No one knows you\'re using it.' },
                { icon: Check, text: 'No Apps, No WiFi — Just turn it on and let it work.' },
                { icon: Check, text: 'Backed by 35,000+ Studies — NASA-tested technology. Science you can trust.' },
                { icon: Check, text: 'Inclusive — Safe for all ages, effective for all species — humans, pets, and horses!' },
                { icon: Check, text: 'Works on Airplanes — Travel-friendly. TSA-approved.' }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <feature.icon className="w-6 h-6 text-[#16a4a4] flex-shrink-0 mt-1" />
                  <p className="text-gray-700 font-medium">{feature.text}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={handleResearch}
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-[#16a4a4] text-[#16a4a4] hover:bg-[#16a4a4] hover:text-white"
                data-testid="see-research-btn"
              >
                See the Research →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Buy From Smita */}
      <section className="section bg-[#16a4a4] text-white" data-testid="why-buy-smita-section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold">
              Why Buy Through Me
            </h2>
            <p className="text-xl opacity-90">
              (Instead of directly from Resona or the ads you'll start seeing)
            </p>
            
            <Card className="bg-white text-gray-900 shadow-2xl border-none">
              <CardContent className="p-8 space-y-6">
                <p className="text-lg leading-relaxed">
                  When you purchase through this page, you don't just get the device — you get support, clarity, 
                  and a real human guide.
                </p>

                <div className="grid md:grid-cols-2 gap-4 text-left">
                  {[
                    'Onboarding including personal protocol recommendations',
                    'Access to private wellness community for customers',
                    'Real-time support (not AI or ticketing systems)',
                    'Help with returns / replacements if needed'
                  ].map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#16a4a4] flex-shrink-0 mt-1" />
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t">
                  <p className="text-2xl font-semibold text-[#16a4a4] italic">
                    "Your energy reset shouldn't feel overwhelming."
                  </p>
                </div>

                <Button
                  onClick={handleGetStarted}
                  className="btn-primary w-full sm:w-auto"
                  size="lg"
                  data-testid="get-vibe-guidance-btn"
                >
                  Get VIBE With Personal Guidance →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-white" id="testimonials" data-testid="testimonials-section">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                Don't Just Take Our Word for It
              </h2>
              <p className="text-xl text-gray-600">Real people, real results</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="card-hover bg-white shadow-lg border-none">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#f17336] text-[#f17336]" />
                      ))}
                    </div>
                    <p className="text-gray-700 italic">"{testimonial.text}"</p>
                    <div className="pt-2 border-t">
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      {testimonial.location && (
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                onClick={handleGetStarted}
                className="btn-primary"
                size="lg"
                data-testid="join-users-btn"
              >
                Join 10,000+ Happy Users →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/Investment Section */}
      {mainProduct && (
        <section className="section bg-gradient-to-br from-[#f0fffe] to-white" data-testid="pricing-section">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <Card className="bg-white shadow-2xl border-none overflow-hidden">
                <div className="bg-[#16a4a4] text-white text-center py-4">
                  <p className="text-2xl font-bold">Buy today and get ${mainProduct.regular_price - mainProduct.sale_price} off your VIBE</p>
                </div>
                
                <CardContent className="p-8 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl text-gray-400 line-through">${mainProduct.regular_price}</span>
                      <span className="text-5xl font-bold text-[#16a4a4]">${mainProduct.sale_price}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {mainProduct.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                        <p className="text-gray-700">{feature}</p>
                      </div>
                    ))}
                  </div>

                  <Card className="bg-[#f0fffe] border-[#16a4a4]">
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-[#16a4a4] flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">Our Promise to You</h4>
                          <p className="text-gray-700 text-sm">
                            If the VIBE doesn't improve your energy, mental clarity, and stress resilience within 30 days, 
                            return it for a full refund. No questions asked. We even pay return shipping. Plus, enjoy a 
                            one-year warranty.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Button
                    onClick={handleGetStarted}
                    className="btn-primary w-full"
                    size="lg"
                    data-testid="claim-discount-btn"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Claim Your ${mainProduct.regular_price - mainProduct.sale_price} Discount Now →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="section bg-white" id="faq" data-testid="faq-section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, idx) => (
                <AccordionItem key={faq.id} value={`item-${idx}`} className="bg-gray-50 rounded-lg px-6 border-none">
                  <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-[#16a4a4]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center pt-8">
              <p className="text-gray-600 mb-4">Still have questions?</p>
              <Button
                onClick={() => window.location.href = 'mailto:vibeforwellness@gmail.com'}
                variant="outline"
                size="lg"
                className="rounded-full border-2 border-[#16a4a4] text-[#16a4a4] hover:bg-[#16a4a4] hover:text-white"
                data-testid="contact-smita-btn"
              >
                Ask Smita →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stop Settling Section */}
      <section className="section bg-gradient-to-br from-[#f0fffe] to-white" data-testid="stop-settling-section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900">
              Stop Settling. Start Healing.
            </h2>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              You've tried pills. You've tried diets. You've tried "pushing through." 
              What if the answer isn't about doing more but about giving your body what it actually needs?
            </p>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">The VIBE is designed for people who want:</h3>
              <div className="grid md:grid-cols-2 gap-4 text-left">
                {[
                  'Energy without stimulants',
                  'Sleep without pills',
                  'Calm without medication',
                  'Healing without side effects'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <Check className="w-6 h-6 text-[#16a4a4] flex-shrink-0" />
                    <p className="text-lg text-gray-700 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-2xl font-bold text-[#16a4a4] italic">
              It's time to feel like yourself again.
            </p>

            <Button
              onClick={handleGetStarted}
              className="btn-primary"
              size="lg"
              data-testid="start-trial-btn"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Start Your 30-Day Trial Now →
            </Button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="section bg-gradient-to-br from-[#16a4a4] to-[#128a8a] text-white" data-testid="community-section">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl sm:text-5xl font-bold">
              You're Not Alone on This Journey
            </h2>
            <p className="text-xl opacity-90">
              Join thousands of people around the world who are exploring natural ways to restore energy and health. 
              Connect with others, get live guidance from Smita, and learn how to maximize your VIBE experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => window.open('https://chat.whatsapp.com/Gqfc0dqoN4SDU60yTw1O0G', '_blank')}
                className="bg-white text-[#16a4a4] hover:bg-gray-100"
                size="lg"
                data-testid="whatsapp-btn"
              >
                Join WhatsApp Community →
              </Button>
              <Button
                onClick={() => window.open('https://www.facebook.com/groups/vibecustomers', '_blank')}
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[#16a4a4]"
                size="lg"
                data-testid="facebook-btn"
              >
                Join Facebook Group →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" data-testid="footer">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-[#16a4a4]" />
                <span className="text-2xl font-bold">VIBE</span>
              </div>
              <p className="text-gray-400 text-sm">
                Recharge Your Body. Restore Your Balance. Return to Your Natural Rhythm.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#benefits" className="hover:text-[#16a4a4] transition-colors">Benefits</a></li>
                <li><a href="#how-it-works" className="hover:text-[#16a4a4] transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-[#16a4a4] transition-colors">Reviews</a></li>
                <li><a href="#faq" className="hover:text-[#16a4a4] transition-colors">FAQ</a></li>
                <li><a href="/blog" className="hover:text-[#16a4a4] transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="https://resona.health/shop/?ap_id=smitashares" target="_blank" rel="noopener noreferrer" className="hover:text-[#16a4a4] transition-colors">Shop Now</a></li>
                <li><a href="https://resona.health/research/?ap_id=smitashares" target="_blank" rel="noopener noreferrer" className="hover:text-[#16a4a4] transition-colors">Research Library</a></li>
                <li><a href="https://resona.health/faqs/?ap_id=smitashares" target="_blank" rel="noopener noreferrer" className="hover:text-[#16a4a4] transition-colors">Full FAQs</a></li>
                <li><a href="/privacy-policy" className="hover:text-[#16a4a4] transition-colors">Privacy Policy</a></li>
                <li><a href="/terms-of-service" className="hover:text-[#16a4a4] transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="mailto:vibeforwellness@gmail.com" className="hover:text-[#16a4a4] transition-colors">vibeforwellness@gmail.com</a></li>
                <li><a href="https://chat.whatsapp.com/FR2f9oFRJf44xjthHdIAnO" target="_blank" rel="noopener noreferrer" className="hover:text-[#16a4a4] transition-colors">WhatsApp Info</a></li>
                <li><a href="http://facebook.com/groups/908473734508366" target="_blank" rel="noopener noreferrer" className="hover:text-[#16a4a4] transition-colors">Facebook Group</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 space-y-4">
            <p className="text-gray-400 text-xs text-center max-w-4xl mx-auto">
              <strong>DISCLAIMER:</strong> The VIBE device is an FDA-registered general wellness device. It does NOT treat, 
              diagnose, prevent, or cure any disease, nor do we make ANY claims in this manner. Instead, it helps individuals 
              live better with whatever health condition they may be experiencing.
            </p>
            <p className="text-gray-400 text-sm text-center">
              © 2025 VIBE for Wellness. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
