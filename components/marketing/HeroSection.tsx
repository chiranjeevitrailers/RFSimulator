'use client';

import React from 'react';
import Link from 'next/link';
// Removed Button import for static export
import { ArrowRight, Play, Shield, Zap, Users, Globe } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-bg">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-primary-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative container-max section-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-800 text-sm font-medium mb-6">
              <Shield className="w-4 h-4 mr-2" />
              Professional 3GPP Protocol Simulator
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Master 5G & 4G Networks with{' '}
              <span className="gradient-text">Real Protocol Analysis</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
              Professional 3GPP Protocol Simulator with 1000+ test cases, real-time analysis, 
              and authentic hardware-like experience for 5G/4G network professionals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/signup">
                <button className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-primary-600 bg-transparent border-2 border-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200 flex items-center justify-center">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">1000+</div>
                <div className="text-sm text-gray-600">Test Cases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">7</div>
                <div className="text-sm text-gray-600">Protocols</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">24/7</div>
                <div className="text-sm text-gray-600">Access</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            {/* Main Dashboard Mockup */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500">5GLabX Protocol Simulator</div>
              </div>

              {/* Dashboard Content */}
              <div className="space-y-4">
                {/* Protocol Layers */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary-800">PHY Layer</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-xs text-primary-600">RSRP: -85 dBm</div>
                    <div className="text-xs text-primary-600">SINR: 15 dB</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-800">MAC Layer</span>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    <div className="text-xs text-green-600">HARQ: 8/16</div>
                    <div className="text-xs text-green-600">MCS: 12</div>
                  </div>
                </div>

                {/* Test Case Execution */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-800">5G NR Initial Access</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Running</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div className="bg-primary-600 h-2 rounded-full w-3/4 animate-pulse"></div>
                  </div>
                  <div className="text-xs text-gray-600">Progress: 75% - 23s remaining</div>
                </div>

                {/* Real-time Logs */}
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs">
                  <div className="text-green-400 mb-1">[PHY] RSRP: -85 dBm, RSRQ: -12 dB</div>
                  <div className="text-blue-400 mb-1">[MAC] HARQ Process 8: ACK</div>
                  <div className="text-yellow-400 mb-1">[RRC] RRC Setup Request sent</div>
                  <div className="text-purple-400">[NAS] Registration Request</div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 animate-float">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium">Real-time</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-3 border border-gray-200 animate-float" style={{ animationDelay: '1s' }}>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">1000+ Users</span>
              </div>
            </div>

            <div className="absolute top-1/2 -right-8 bg-white rounded-lg shadow-lg p-3 border border-gray-200 animate-float" style={{ animationDelay: '2s' }}>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium">Global</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;