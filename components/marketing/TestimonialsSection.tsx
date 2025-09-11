'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, Award, Users, TrendingUp, Globe } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Dr. Sarah Chen',
      role: 'Senior 5G Engineer',
      company: 'Ericsson',
      avatar: '/avatars/sarah-chen.jpg',
      rating: 5,
      text: '5GLabX has revolutionized our protocol testing workflow. The 1000+ test cases cover every scenario we need, and the real-time analysis is incredibly accurate. It\'s like having a professional protocol analyzer without the hardware costs.',
      location: 'Stockholm, Sweden',
      verified: true,
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      role: 'Network Architect',
      company: 'Nokia',
      avatar: '/avatars/michael-rodriguez.jpg',
      rating: 5,
      text: 'The 3GPP compliance and ASN.1 decoding capabilities are outstanding. We\'ve reduced our testing time by 70% while improving accuracy. The team collaboration features make it perfect for our distributed engineering teams.',
      location: 'Espoo, Finland',
      verified: true,
    },
    {
      id: 3,
      name: 'Dr. Aisha Patel',
      role: 'Principal Engineer',
      company: 'Qualcomm',
      avatar: '/avatars/aisha-patel.jpg',
      rating: 5,
      text: 'As someone who\'s worked with protocol analyzers for 15 years, 5GLabX is the most comprehensive platform I\'ve used. The O-RAN and NTN test cases are particularly valuable for our advanced research projects.',
      location: 'San Diego, USA',
      verified: true,
    },
    {
      id: 4,
      name: 'James Thompson',
      role: 'Technical Director',
      company: 'Vodafone',
      avatar: '/avatars/james-thompson.jpg',
      rating: 5,
      text: 'The platform\'s ability to simulate real network conditions is remarkable. We use it for training our engineers and validating new features. The export capabilities and reporting tools are exactly what we needed.',
      location: 'London, UK',
      verified: true,
    },
    {
      id: 5,
      name: 'Dr. Yuki Tanaka',
      role: 'Research Scientist',
      company: 'NTT DOCOMO',
      avatar: '/avatars/yuki-tanaka.jpg',
      rating: 5,
      text: '5GLabX has become an essential tool in our 6G research. The V2X and NB-IoT test cases help us understand edge cases that are difficult to reproduce in lab environments. Highly recommended for any serious protocol work.',
      location: 'Tokyo, Japan',
      verified: true,
    },
    {
      id: 6,
      name: 'Elena Volkov',
      role: 'Lead Protocol Engineer',
      company: 'Huawei',
      avatar: '/avatars/elena-volkov.jpg',
      rating: 5,
      text: 'The multi-layer analysis capabilities are exceptional. Being able to see PHY, MAC, RLC, PDCP, RRC, and NAS layers simultaneously with authentic 3GPP values has transformed our debugging process.',
      location: 'Shenzhen, China',
      verified: true,
    },
  ];

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: '10,000+',
      label: 'Active Users',
      description: 'Network professionals worldwide',
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: '98%',
      label: 'Satisfaction Rate',
      description: 'Based on user feedback',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: '70%',
      label: 'Time Saved',
      description: 'Average testing efficiency gain',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      value: '50+',
      label: 'Countries',
      description: 'Global user base',
    },
  ];

  const companies = [
    { name: 'Ericsson', logo: '/logos/ericsson.svg' },
    { name: 'Nokia', logo: '/logos/nokia.svg' },
    { name: 'Qualcomm', logo: '/logos/qualcomm.svg' },
    { name: 'Vodafone', logo: '/logos/vodafone.svg' },
    { name: 'NTT DOCOMO', logo: '/logos/ntt-docomo.svg' },
    { name: 'Huawei', logo: '/logos/huawei.svg' },
    { name: 'Samsung', logo: '/logos/samsung.svg' },
    { name: 'Intel', logo: '/logos/intel.svg' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="section-padding bg-gray-50">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Industry Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of network professionals from leading companies who rely on 5GLabX 
            for their protocol analysis needs.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mx-auto mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Companies Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Trusted by leading companies worldwide
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center opacity-60">
            {companies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="text-gray-400 font-semibold text-sm">{company.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Quote Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                <Quote className="w-8 h-8 text-primary-600" />
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6 max-w-4xl mx-auto">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
            </div>

            {/* Author Info */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {testimonials[currentTestimonial].name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </h4>
                    {testimonials[currentTestimonial].verified && (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonials[currentTestimonial].location}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center space-x-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Dots */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentTestimonial ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-primary-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Join Our Community?
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Start your free trial today and experience the same professional-grade protocol analysis 
              that industry leaders trust.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Start Free Trial
              </button>
              <button className="border border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                View All Testimonials
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;