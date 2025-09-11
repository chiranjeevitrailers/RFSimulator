'use client';

import React from 'react';
import { 
  Award, 
  Shield, 
  CheckCircle, 
  Star, 
  Users, 
  Globe, 
  TrendingUp,
  Clock,
  Zap,
  Lock
} from 'lucide-react';

const SocialProofSection = () => {
  const certifications = [
    {
      icon: <Award className="w-8 h-8" />,
      title: '3GPP Compliant',
      description: 'Full compliance with 3GPP standards and specifications',
      verified: true,
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II certified with end-to-end encryption',
      verified: true,
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'ISO 27001',
      description: 'Information security management system certified',
      verified: true,
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'GDPR Compliant',
      description: 'Full compliance with European data protection regulations',
      verified: true,
    },
  ];

  const achievements = [
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Industry Recognition',
      description: 'Winner of Best Protocol Analysis Tool 2024',
      year: '2024',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Global Community',
      description: '10,000+ network professionals worldwide',
      year: '2024',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Rapid Growth',
      description: '300% user growth in the last 12 months',
      year: '2024',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Reach',
      description: 'Available in 50+ countries and 15 languages',
      year: '2024',
    },
  ];

  const reviews = [
    {
      platform: 'G2',
      rating: 4.9,
      reviews: 247,
      badge: 'Leader',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      platform: 'Capterra',
      rating: 4.8,
      reviews: 189,
      badge: 'Top Rated',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      platform: 'Trustpilot',
      rating: 4.7,
      reviews: 156,
      badge: 'Excellent',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const press = [
    {
      source: '5G World',
      title: '5GLabX Revolutionizes Protocol Testing',
      date: 'Dec 2024',
      excerpt: 'The platform has set a new standard for 3GPP protocol analysis...',
    },
    {
      source: 'Network Computing',
      title: 'Best Tools for 5G Network Analysis',
      date: 'Nov 2024',
      excerpt: '5GLabX leads the market with its comprehensive test case library...',
    },
    {
      source: 'Telecom Review',
      title: 'Industry Leaders Choose 5GLabX',
      date: 'Oct 2024',
      excerpt: 'Major telecom companies are adopting 5GLabX for their testing needs...',
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted & Recognized
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is trusted by industry leaders, certified by standards bodies, 
            and recognized by the global network engineering community.
          </p>
        </div>

        {/* Certifications */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Certifications & Compliance
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="card card-hover text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mx-auto mb-4">
                  {cert.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {cert.title}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {cert.description}
                </p>
                {cert.verified && (
                  <div className="flex items-center justify-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Recent Achievements
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="card card-hover">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                    {achievement.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {achievement.title}
                      </h4>
                      <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                        {achievement.year}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review Platforms */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Customer Reviews
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <div key={index} className="card card-hover text-center">
                <div className={`w-16 h-16 ${review.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <span className={`text-2xl font-bold ${review.color}`}>
                    {review.platform.charAt(0)}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {review.platform}
                </h4>
                <div className="flex items-center justify-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(review.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-lg font-semibold text-gray-900">
                    {review.rating}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {review.reviews} reviews
                </p>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${review.bgColor} ${review.color}`}>
                  {review.badge}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Press Coverage */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Press Coverage
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {press.map((article, index) => (
              <div key={index} className="card card-hover">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-primary-600">
                    {article.source}
                  </span>
                  <span className="text-xs text-gray-500">
                    {article.date}
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {article.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {article.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Why Industry Leaders Trust 5GLabX
            </h3>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our platform is built with enterprise-grade security, reliability, and performance 
              that meets the highest industry standards.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                99.9% Uptime
              </h4>
              <p className="text-gray-600 text-sm">
                Enterprise-grade reliability with 24/7 monitoring and support
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Real-Time Processing
              </h4>
              <p className="text-gray-600 text-sm">
                Sub-second response times with advanced caching and optimization
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Enterprise Security
              </h4>
              <p className="text-gray-600 text-sm">
                End-to-end encryption, SSO, and comprehensive audit logging
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Join the Global Community
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Over 10,000 network professionals trust 5GLabX for their protocol analysis needs. 
              Start your free trial today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Start Free Trial
              </button>
              <button className="border border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;