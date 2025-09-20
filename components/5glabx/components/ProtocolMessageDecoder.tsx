'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/Button';
import { 
  Code, 
  Eye, 
  Copy, 
  Download, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Info,
  Layers,
  Clock,
  Database,
  Wifi
} from 'lucide-react';

interface ProtocolMessage {
  id: string;
  timestamp: number;
  direction: 'UL' | 'DL' | 'BIDIRECTIONAL';
  layer: string;
  protocol: string;
  messageType: string;
  messageName: string;
  messageSize: number;
  sourceEntity: string;
  targetEntity: string;
  rnti?: string;
  ueId?: string;
  cellId?: string;
  payload: any;
  informationElements: Record<string, any>;
  validationStatus: 'valid' | 'invalid' | 'warning';
  processingTime: number;
  rawHex?: string;
  decodedData: any;
}

interface ProtocolMessageDecoderProps {
  message: ProtocolMessage;
  onClose: () => void;
}

const ProtocolMessageDecoder: React.FC<ProtocolMessageDecoderProps> = ({ message, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ies' | 'hex' | 'decoded'>('overview');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'invalid': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLayerColor = (layer: string) => {
    switch (layer) {
      case 'PHY': return 'bg-blue-100 text-blue-800';
      case 'MAC': return 'bg-green-100 text-green-800';
      case 'RLC': return 'bg-yellow-100 text-yellow-800';
      case 'PDCP': return 'bg-purple-100 text-purple-800';
      case 'RRC': return 'bg-red-100 text-red-800';
      case 'NAS': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case 'UL': return '↗️';
      case 'DL': return '↘️';
      case 'BIDIRECTIONAL': return '↔️';
      default: return '↔️';
    }
  };

  const formatHex = (hex: string) => {
    const formatted = hex.match(/.{1,2}/g)?.join(' ') || hex;
    const lines = [];
    for (let i = 0; i < formatted.length; i += 48) {
      const line = formatted.slice(i, i + 48);
      const offset = (i / 3).toString(16).padStart(8, '0').toUpperCase();
      lines.push(`${offset}: ${line}`);
    }
    return lines.join('\n');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'ies', label: 'Information Elements', icon: Layers },
    { id: 'hex', label: 'Raw Hex', icon: Code },
    { id: 'decoded', label: 'Decoded Data', icon: Database }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{getDirectionIcon(message.direction)}</span>
              <Badge className={getLayerColor(message.layer)}>
                {message.layer}
              </Badge>
              <span className="text-lg font-semibold">{message.messageName}</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(message.validationStatus)}
              <span className="text-sm text-gray-600 capitalize">{message.validationStatus}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => copyToClipboard(JSON.stringify(message, null, 2))}>
              <Copy className="w-4 h-4 mr-1" />
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Message Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Message ID:</span>
                      <span className="font-mono text-sm">{message.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Timestamp:</span>
                      <span className="text-sm">{new Date(message.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Protocol:</span>
                      <span className="text-sm">{message.protocol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Message Type:</span>
                      <span className="text-sm">{message.messageType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="text-sm">{message.messageSize} bytes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="text-sm">{message.processingTime} ms</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Wifi className="w-5 h-5 mr-2" />
                      Network Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Source:</span>
                      <span className="text-sm">{message.sourceEntity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target:</span>
                      <span className="text-sm">{message.targetEntity}</span>
                    </div>
                    {message.rnti && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">RNTI:</span>
                        <span className="font-mono text-sm">{message.rnti}</span>
                      </div>
                    )}
                    {message.ueId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">UE ID:</span>
                        <span className="font-mono text-sm">{message.ueId}</span>
                      </div>
                    )}
                    {message.cellId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cell ID:</span>
                        <span className="font-mono text-sm">{message.cellId}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Message Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      This {message.layer} layer message ({message.messageName}) was transmitted 
                      {message.direction === 'UL' ? ' from UE to gNB' : 
                       message.direction === 'DL' ? ' from gNB to UE' : 
                       ' bidirectionally'} at {new Date(message.timestamp).toLocaleTimeString()}. 
                      The message contains {Object.keys(message.informationElements).length} information elements 
                      and has a validation status of <span className="font-medium capitalize">{message.validationStatus}</span>.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'ies' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Information Elements ({Object.keys(message.informationElements).length})</h3>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(JSON.stringify(message.informationElements, null, 2))}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy IEs
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(message.informationElements).map(([ieName, ieData]: [string, any]) => (
                  <Card key={ieName}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{ieName}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {ieData.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {ieData.presence}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Value:</span>
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                            {typeof ieData.value === 'object' ? JSON.stringify(ieData.value) : ieData.value}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Reference:</span>
                          <span className="text-sm text-blue-600">{ieData.reference}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hex' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Raw Hexadecimal Data</h3>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(message.rawHex || '')}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Hex
                </Button>
              </div>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <pre>{formatHex(message.rawHex || '')}</pre>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Length:</strong> {message.rawHex?.length ? message.rawHex.length / 2 : 0} bytes</p>
                <p><strong>Format:</strong> Offset: Hex Data</p>
              </div>
            </div>
          )}

          {activeTab === 'decoded' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Decoded Message Data</h3>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard(JSON.stringify(message.decodedData, null, 2))}>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Decoded
                </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  {JSON.stringify(message.decodedData, null, 2)}
                </pre>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="font-medium text-blue-900">Decoder Version</p>
                  <p className="text-blue-700">{message.decodedData.decoderVersion || '1.0.0'}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="font-medium text-green-900">Confidence</p>
                  <p className="text-green-700">{((message.decodedData.confidence || 0.95) * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="font-medium text-yellow-900">Warnings</p>
                  <p className="text-yellow-700">{message.decodedData.warnings?.length || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProtocolMessageDecoder;