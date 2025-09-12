'use client';

import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  Undo, 
  Redo, 
  Settings, 
  Type, 
  Image, 
  Link,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { HomepageContent, DEFAULT_HOMEPAGE_CONTENT, saveHomepageContent, loadHomepageContent } from '@/lib/homepage-content';

const HomepageEditor: React.FC = () => {
  const [content, setContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      const loadedContent = await loadHomepageContent();
      setContent(loadedContent);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const result = await saveHomepageContent(content);
      
      if (result.success) {
        setSaveStatus({ type: 'success', message: result.message });
      } else {
        setSaveStatus({ type: 'error', message: 'Failed to save content' });
      }
    } catch (error) {
      setSaveStatus({ type: 'error', message: 'Error saving content' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus({ type: null, message: '' }), 3000);
    }
  };

  const updateContent = (section: string, field: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof HomepageContent],
        [field]: value
      }
    }));
  };

  const updateNestedContent = (section: string, field: string, subField: string, value: any) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof HomepageContent],
        [field]: {
          ...(prev[section as keyof HomepageContent] as any)[field],
          [subField]: value
        }
      }
    }));
  };

  const updateArrayItem = (section: string, field: string, index: number, subField: string, value: any) => {
    setContent(prev => {
      const sectionData = prev[section as keyof HomepageContent] as any;
      const newArray = [...sectionData[field]];
      newArray[index] = {
        ...newArray[index],
        [subField]: value
      };
      
      return {
        ...prev,
        [section]: {
          ...sectionData,
          [field]: newArray
        }
      };
    });
  };

  const sections = [
    { id: 'hero', label: 'Hero Section', icon: Type },
    { id: 'features', label: 'Features', icon: Settings },
    { id: 'equipment', label: 'Equipment', icon: Settings },
    { id: 'service', label: 'Service', icon: Settings },
    { id: 'testimonials', label: 'Testimonials', icon: Settings },
    { id: 'cta', label: 'Call to Action', icon: Link }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
        <span className="ml-2 text-gray-600">Loading homepage content...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Homepage Editor</h1>
          <p className="text-gray-600">Edit and manage your homepage content</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {saveStatus.type && (
            <div className={`flex items-center px-4 py-2 rounded-lg ${
              saveStatus.type === 'success' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {saveStatus.type === 'success' ? (
                <CheckCircle className="w-4 h-4 mr-2" />
              ) : (
                <AlertCircle className="w-4 h-4 mr-2" />
              )}
              {saveStatus.message}
            </div>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sections</h3>
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <section.icon className="w-4 h-4 mr-3" />
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeSection === 'hero' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Hero Section</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.hero.title}
                    onChange={(e) => updateContent('hero', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.hero.subtitle}
                    onChange={(e) => updateContent('hero', 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={content.hero.description}
                    onChange={(e) => updateContent('hero', 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Text</label>
                    <input
                      type="text"
                      value={content.hero.primaryButton.text}
                      onChange={(e) => updateNestedContent('hero', 'primaryButton', 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Link</label>
                    <input
                      type="text"
                      value={content.hero.primaryButton.link}
                      onChange={(e) => updateNestedContent('hero', 'primaryButton', 'link', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Text</label>
                    <input
                      type="text"
                      value={content.hero.secondaryButton.text}
                      onChange={(e) => updateNestedContent('hero', 'secondaryButton', 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Link</label>
                    <input
                      type="text"
                      value={content.hero.secondaryButton.link}
                      onChange={(e) => updateNestedContent('hero', 'secondaryButton', 'link', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'features' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Features Section</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.features.title}
                    onChange={(e) => updateContent('features', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.features.subtitle}
                    onChange={(e) => updateContent('features', 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Features</h4>
                  {content.features.features.map((feature, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                          <input
                            type="text"
                            value={feature.icon}
                            onChange={(e) => updateArrayItem('features', 'features', index, 'icon', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => updateArrayItem('features', 'features', index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                          <textarea
                            value={feature.description}
                            onChange={(e) => updateArrayItem('features', 'features', index, 'description', e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'equipment' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Equipment Section</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.equipment.title}
                    onChange={(e) => updateContent('equipment', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.equipment.subtitle}
                    onChange={(e) => updateContent('equipment', 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={content.equipment.description}
                    onChange={(e) => updateContent('equipment', 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {activeSection === 'service' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Service Section</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.service.title}
                    onChange={(e) => updateContent('service', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.service.subtitle}
                    onChange={(e) => updateContent('service', 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={content.service.description}
                    onChange={(e) => updateContent('service', 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Pricing Plans</h4>
                  
                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Starter Plan</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                          <input
                            type="text"
                            value={content.service.pricing.starter.price}
                            onChange={(e) => updateNestedContent('service', 'pricing', 'starter', {
                              ...content.service.pricing.starter,
                              price: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Professional Plan</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                          <input
                            type="text"
                            value={content.service.pricing.professional.price}
                            onChange={(e) => updateNestedContent('service', 'pricing', 'professional', {
                              ...content.service.pricing.professional,
                              price: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h5 className="font-medium text-gray-900 mb-3">Enterprise Plan</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                          <input
                            type="text"
                            value={content.service.pricing.enterprise.price}
                            onChange={(e) => updateNestedContent('service', 'pricing', 'enterprise', {
                              ...content.service.pricing.enterprise,
                              price: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'testimonials' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Testimonials Section</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.testimonials.title}
                    onChange={(e) => updateContent('testimonials', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                  <input
                    type="text"
                    value={content.testimonials.subtitle}
                    onChange={(e) => updateContent('testimonials', 'subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Testimonials</h4>
                  {content.testimonials.testimonials.map((testimonial, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                          <input
                            type="text"
                            value={testimonial.name}
                            onChange={(e) => updateArrayItem('testimonials', 'testimonials', index, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                          <input
                            type="text"
                            value={testimonial.role}
                            onChange={(e) => updateArrayItem('testimonials', 'testimonials', index, 'role', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                          <input
                            type="text"
                            value={testimonial.company}
                            onChange={(e) => updateArrayItem('testimonials', 'testimonials', index, 'company', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                          <textarea
                            value={testimonial.content}
                            onChange={(e) => updateArrayItem('testimonials', 'testimonials', index, 'content', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'cta' && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Call to Action Section</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={content.cta.title}
                    onChange={(e) => updateContent('cta', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={content.cta.description}
                    onChange={(e) => updateContent('cta', 'description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Text</label>
                    <input
                      type="text"
                      value={content.cta.primaryButton.text}
                      onChange={(e) => updateNestedContent('cta', 'primaryButton', 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Button Link</label>
                    <input
                      type="text"
                      value={content.cta.primaryButton.link}
                      onChange={(e) => updateNestedContent('cta', 'primaryButton', 'link', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Text</label>
                    <input
                      type="text"
                      value={content.cta.secondaryButton.text}
                      onChange={(e) => updateNestedContent('cta', 'secondaryButton', 'text', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Button Link</label>
                    <input
                      type="text"
                      value={content.cta.secondaryButton.link}
                      onChange={(e) => updateNestedContent('cta', 'secondaryButton', 'link', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageEditor;