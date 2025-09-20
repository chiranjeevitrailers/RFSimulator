'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertTriangle, XCircle, FileText, 
  Award, Shield, BookOpen, Layers, Activity
} from 'lucide-react';

interface ComplianceData {
  level: 'FULLY_COMPLIANT' | 'MOSTLY_COMPLIANT' | 'BASIC_COMPLIANT' | 'NON_COMPLIANT';
  standardReferences: string[];
  releaseVersion: string;
  validated: boolean;
  complianceScore: number;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

const ThreeGPPComplianceDashboard: React.FC<{
  testCaseData?: any;
}> = ({ testCaseData }) => {
  const [complianceData, setComplianceData] = useState<ComplianceData>({
    level: 'NON_COMPLIANT',
    standardReferences: [],
    releaseVersion: 'Unknown',
    validated: false,
    complianceScore: 0,
    errors: [],
    warnings: [],
    recommendations: []
  });

  useEffect(() => {
    if (testCaseData?.compliance) {
      setComplianceData({
        level: testCaseData.compliance.level || 'NON_COMPLIANT',
        standardReferences: testCaseData.compliance.standardReferences || [],
        releaseVersion: testCaseData.compliance.releaseVersion || 'Unknown',
        validated: testCaseData.compliance.validated || false,
        complianceScore: testCaseData.compliance.complianceScore || 0,
        errors: testCaseData.compliance.errors || [],
        warnings: testCaseData.compliance.warnings || [],
        recommendations: testCaseData.compliance.recommendations || []
      });
    }
  }, [testCaseData]);

  const getComplianceColor = (level: string) => {
    switch (level) {
      case 'FULLY_COMPLIANT':
        return 'text-green-600 bg-green-100';
      case 'MOSTLY_COMPLIANT':
        return 'text-blue-600 bg-blue-100';
      case 'BASIC_COMPLIANT':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-red-600 bg-red-100';
    }
  };

  const getComplianceIcon = (level: string) => {
    switch (level) {
      case 'FULLY_COMPLIANT':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'MOSTLY_COMPLIANT':
        return <Award className="w-5 h-5 text-blue-600" />;
      case 'BASIC_COMPLIANT':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          3GPP Compliance Status
        </h3>
        <div className="flex items-center space-x-2">
          {getComplianceIcon(complianceData.level)}
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplianceColor(complianceData.level)}`}>
            {complianceData.level.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Compliance Score */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Compliance Score</span>
          <span className="text-sm font-bold text-gray-900">{complianceData.complianceScore}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              complianceData.complianceScore >= 90 ? 'bg-green-600' :
              complianceData.complianceScore >= 70 ? 'bg-blue-600' :
              complianceData.complianceScore >= 50 ? 'bg-yellow-600' : 'bg-red-600'
            }`}
            style={{ width: `${Math.max(complianceData.complianceScore, 5)}%` }}
          ></div>
        </div>
      </div>

      {/* Standard References */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
          <BookOpen className="w-4 h-4 mr-2" />
          3GPP Standard References
        </h4>
        {complianceData.standardReferences.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {complianceData.standardReferences.map((ref, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border"
              >
                {ref}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No standard references available</p>
        )}
      </div>

      {/* Release Version */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
          <Layers className="w-4 h-4 mr-2" />
          3GPP Release Version
        </h4>
        <span className="px-3 py-1 bg-green-50 text-green-700 text-sm rounded border">
          {complianceData.releaseVersion}
        </span>
      </div>

      {/* Compliance Details */}
      <div className="space-y-4">
        {/* Errors */}
        {complianceData.errors.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center">
              <XCircle className="w-4 h-4 mr-2" />
              Compliance Errors ({complianceData.errors.length})
            </h4>
            <div className="space-y-1">
              {complianceData.errors.map((error, index) => (
                <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded border-l-2 border-red-200">
                  {error}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warnings */}
        {complianceData.warnings.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-yellow-700 mb-2 flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Compliance Warnings ({complianceData.warnings.length})
            </h4>
            <div className="space-y-1">
              {complianceData.warnings.map((warning, index) => (
                <div key={index} className="text-sm text-yellow-600 bg-yellow-50 p-2 rounded border-l-2 border-yellow-200">
                  {warning}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {complianceData.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-blue-700 mb-2 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              Recommendations ({complianceData.recommendations.length})
            </h4>
            <div className="space-y-1">
              {complianceData.recommendations.map((recommendation, index) => (
                <div key={index} className="text-sm text-blue-600 bg-blue-50 p-2 rounded border-l-2 border-blue-200">
                  {recommendation}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Success Message */}
        {complianceData.level === 'FULLY_COMPLIANT' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <h4 className="text-sm font-medium text-green-800">Fully 3GPP Compliant</h4>
                <p className="text-sm text-green-700 mt-1">
                  This test case meets all 3GPP standards with proper message structures, 
                  Information Elements, and layer parameters.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Validation Status */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Validation Status:</span>
          <div className="flex items-center">
            {complianceData.validated ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 font-medium">Validated</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-red-600 font-medium">Not Validated</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeGPPComplianceDashboard;