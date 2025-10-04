'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronRight,
  Clock,
  Layers,
  Network,
  Phone,
  Wifi,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Play,
  Pause,
  Square,
  Settings,
  Maximize2,
  Minimize2,
  Copy,
  ExternalLink
} from 'lucide-react';

interface LogMessage {
  id: string;
  timestamp: number;
  timestampMs: number;
  sfn: number;
  slot: number;
  symbol: number;
  layer: string;
  channel: string;
  direction: 'UL' | 'DL';
  messageType: string;
  messageName: string;
  messagePayload: any;
  informationElements: Record<string, any>;
  layerParameters: Record<string, any>;
  standardReference: string;
  protocol: string;
  rnti: string;
  crcStatus: 'PASS' | 'FAIL' | 'UNKNOWN';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  subCategory: string;
  rawData: string;
  hexData: string;
  decodedData: any;
}

interface FilterState {
  searchQuery: string;
  selectedLayers: string[];
  selectedChannels: string[];
  selectedDirections: string[];
  selectedMessageTypes: string[];
  timeRange: { start: number; end: number };
  sfnRange: { start: number; end: number };
  showOnlyErrors: boolean;
  showOnlyHighPriority: boolean;
}

interface ProfessionalLogViewerProps {
  executionId?: string | null;
  platform: '5GLABX' | 'UE_ANALYSIS';
}

const ProfessionalLogViewer: React.FC<ProfessionalLogViewerProps> = ({ 
  executionId, 
  platform 
}) => {
  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<LogMessage[]>([]);
  const [selectedLog, setSelectedLog] = useState<LogMessage | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    selectedLayers: [],
    selectedChannels: [],
    selectedDirections: [],
    selectedMessageTypes: [],
    timeRange: { start: 0, end: Date.now() },
    sfnRange: { start: 0, end: 1023 },
    showOnlyErrors: false,
    showOnlyHighPriority: false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [statistics, setStatistics] = useState({
    totalMessages: 0,
    messagesByLayer: {} as Record<string, number>,
    messagesByChannel: {} as Record<string, number>,
    errorCount: 0,
    highPriorityCount: 0
  });

  const logContainerRef = useRef<HTMLDivElement>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Available filter options
  const availableLayers = ['PHY', 'MAC', 'RLC', 'PDCP', 'RRC', 'NAS', 'IMS', 'APPLICATION'];
  const availableChannels = ['BCCH', 'PCCH', 'CCCH', 'DCCH', 'DTCH', 'MCCH', 'MTCH', 'PDSCH', 'PUSCH', 'PDCCH', 'PUCCH'];
  const availableDirections = ['UL', 'DL'];
  const availableMessageTypes = ['RRC_SETUP_REQUEST', 'RRC_SETUP', 'RRC_SETUP_COMPLETE', 'RRC_RECONFIGURATION', 'RRC_RELEASE'];

  // Generate realistic test data
  const generateRealisticLogs = useMemo(() => {
    const logs: LogMessage[] = [];
    const startTime = Date.now() - 60000; // 1 minute ago
    const sfnStart = 0;
    
    // Generate realistic 5G NR call flow
    const callFlowMessages = [
      // Initial Access
      { layer: 'PHY', channel: 'PDSCH', direction: 'DL', messageType: 'SSB', messageName: 'Synchronization Signal Block', priority: 'HIGH' },
      { layer: 'PHY', channel: 'PDCCH', direction: 'DL', messageType: 'DCI', messageName: 'Downlink Control Information', priority: 'HIGH' },
      { layer: 'RRC', channel: 'BCCH', direction: 'DL', messageType: 'SIB1', messageName: 'System Information Block 1', priority: 'HIGH' },
      { layer: 'RRC', channel: 'BCCH', direction: 'DL', messageType: 'SIB2', messageName: 'System Information Block 2', priority: 'MEDIUM' },
      { layer: 'RRC', channel: 'BCCH', direction: 'DL', messageType: 'SIB3', messageName: 'System Information Block 3', priority: 'MEDIUM' },
      
      // Random Access
      { layer: 'PHY', channel: 'PRACH', direction: 'UL', messageType: 'RACH_PREAMBLE', messageName: 'Random Access Preamble', priority: 'HIGH' },
      { layer: 'MAC', channel: 'PDCCH', direction: 'DL', messageType: 'RAR', messageName: 'Random Access Response', priority: 'HIGH' },
      
      // RRC Connection Setup
      { layer: 'RRC', channel: 'CCCH', direction: 'UL', messageType: 'RRC_SETUP_REQUEST', messageName: 'RRC Setup Request', priority: 'HIGH' },
      { layer: 'RRC', channel: 'CCCH', direction: 'DL', messageType: 'RRC_SETUP', messageName: 'RRC Setup', priority: 'HIGH' },
      { layer: 'RRC', channel: 'DCCH', direction: 'UL', messageType: 'RRC_SETUP_COMPLETE', messageName: 'RRC Setup Complete', priority: 'HIGH' },
      
      // Security
      { layer: 'RRC', channel: 'DCCH', direction: 'DL', messageType: 'SECURITY_MODE_COMMAND', messageName: 'Security Mode Command', priority: 'HIGH' },
      { layer: 'RRC', channel: 'DCCH', direction: 'UL', messageType: 'SECURITY_MODE_COMPLETE', messageName: 'Security Mode Complete', priority: 'HIGH' },
      
      // Registration
      { layer: 'NAS', channel: 'DCCH', direction: 'UL', messageType: 'REGISTRATION_REQUEST', messageName: 'Registration Request', priority: 'HIGH' },
      { layer: 'NAS', channel: 'DCCH', direction: 'DL', messageType: 'REGISTRATION_ACCEPT', messageName: 'Registration Accept', priority: 'HIGH' },
      { layer: 'NAS', channel: 'DCCH', direction: 'UL', messageType: 'REGISTRATION_COMPLETE', messageName: 'Registration Complete', priority: 'HIGH' },
      
      // PDU Session Establishment
      { layer: 'NAS', channel: 'DCCH', direction: 'UL', messageType: 'PDU_SESSION_ESTABLISHMENT_REQUEST', messageName: 'PDU Session Establishment Request', priority: 'HIGH' },
      { layer: 'NAS', channel: 'DCCH', direction: 'DL', messageType: 'PDU_SESSION_ESTABLISHMENT_ACCEPT', messageName: 'PDU Session Establishment Accept', priority: 'HIGH' },
      
      // Data Transfer
      { layer: 'RLC', channel: 'DTCH', direction: 'UL', messageType: 'RLC_DATA_PDU', messageName: 'RLC Data PDU', priority: 'MEDIUM' },
      { layer: 'RLC', channel: 'DTCH', direction: 'DL', messageType: 'RLC_DATA_PDU', messageName: 'RLC Data PDU', priority: 'MEDIUM' },
      { layer: 'MAC', channel: 'PDSCH', direction: 'DL', messageType: 'MAC_CE', messageName: 'MAC Control Element', priority: 'MEDIUM' },
      
      // Measurement Reports
      { layer: 'RRC', channel: 'DCCH', direction: 'UL', messageType: 'MEASUREMENT_REPORT', messageName: 'Measurement Report', priority: 'MEDIUM' },
      
      // Handover
      { layer: 'RRC', channel: 'DCCH', direction: 'DL', messageType: 'RRC_RECONFIGURATION', messageName: 'RRC Reconfiguration', priority: 'HIGH' },
      { layer: 'RRC', channel: 'DCCH', direction: 'UL', messageType: 'RRC_RECONFIGURATION_COMPLETE', messageName: 'RRC Reconfiguration Complete', priority: 'HIGH' },
      
      // Release
      { layer: 'RRC', channel: 'DCCH', direction: 'DL', messageType: 'RRC_RELEASE', messageName: 'RRC Release', priority: 'HIGH' },
      { layer: 'RRC', channel: 'CCCH', direction: 'UL', messageType: 'RRC_RELEASE_COMPLETE', messageName: 'RRC Release Complete', priority: 'HIGH' }
    ];

    callFlowMessages.forEach((msg, index) => {
      const timestamp = startTime + (index * 2000) + Math.random() * 1000;
      const sfn = (sfnStart + Math.floor(index / 10)) % 1024;
      const slot = Math.floor(Math.random() * 20);
      const symbol = Math.floor(Math.random() * 14);
      
      // Generate realistic Information Elements based on message type
      const informationElements = generateInformationElements(msg.messageType);
      const layerParameters = generateLayerParameters(msg.layer);
      
      logs.push({
        id: `log-${executionId || 'demo'}-${index}`,
        timestamp: timestamp,
        timestampMs: timestamp,
        sfn: sfn,
        slot: slot,
        symbol: symbol,
        layer: msg.layer,
        channel: msg.channel,
        direction: msg.direction,
        messageType: msg.messageType,
        messageName: msg.messageName,
        messagePayload: generateMessagePayload(msg.messageType),
        informationElements: informationElements,
        layerParameters: layerParameters,
        standardReference: '3GPP TS 38.331',
        protocol: '5G_NR',
        rnti: generateRNTI(msg.direction),
        crcStatus: Math.random() > 0.05 ? 'PASS' : 'FAIL',
        priority: msg.priority,
        category: getCategory(msg.layer),
        subCategory: getSubCategory(msg.messageType),
        rawData: generateRawData(msg.messageType),
        hexData: generateHexData(msg.messageType),
        decodedData: generateDecodedData(msg.messageType, informationElements)
      });
    });

    return logs;
  }, [executionId]);

  // Generate realistic Information Elements
  const generateInformationElements = (messageType: string): Record<string, any> => {
    const ieMap: Record<string, Record<string, any>> = {
      'RRC_SETUP_REQUEST': {
        'ue-Identity': { value: 'IMSI-123456789012345', type: 'IMSI', presence: 'mandatory', description: 'UE Identity' },
        'establishmentCause': { value: 'mo-Data', type: 'ENUMERATED', presence: 'mandatory', description: 'Establishment Cause' },
        'spare': { value: '0', type: 'BIT', presence: 'optional', description: 'Spare bits' }
      },
      'RRC_SETUP': {
        'rrc-TransactionIdentifier': { value: '1', type: 'INTEGER', presence: 'mandatory', description: 'RRC Transaction ID' },
        'radioBearerConfig': { value: 'SRB1', type: 'SEQUENCE', presence: 'mandatory', description: 'Radio Bearer Configuration' },
        'masterCellGroup': { value: 'MCG-Config', type: 'SEQUENCE', presence: 'mandatory', description: 'Master Cell Group' }
      },
      'RRC_SETUP_COMPLETE': {
        'rrc-TransactionIdentifier': { value: '1', type: 'INTEGER', presence: 'mandatory', description: 'RRC Transaction ID' },
        'selectedPLMN-Identity': { value: '310-410', type: 'INTEGER', presence: 'mandatory', description: 'Selected PLMN Identity' }
      },
      'MEASUREMENT_REPORT': {
        'measId': { value: '1', type: 'INTEGER', presence: 'mandatory', description: 'Measurement ID' },
        'measResultPCell': { value: 'RSRP=-85, RSRQ=-10', type: 'SEQUENCE', presence: 'mandatory', description: 'PCell Measurement Result' },
        'measResultNeighCells': { value: 'Neighbor-1: RSRP=-90', type: 'SEQUENCE', presence: 'optional', description: 'Neighbor Cell Results' }
      }
    };

    return ieMap[messageType] || {
      'default-ie': { value: 'Default Value', type: 'OCTET_STRING', presence: 'mandatory', description: 'Default Information Element' }
    };
  };

  // Generate realistic Layer Parameters
  const generateLayerParameters = (layer: string): Record<string, any> => {
    const paramMap: Record<string, Record<string, any>> = {
      'PHY': {
        'RSRP': { value: -85 + Math.random() * 20, unit: 'dBm', range: '-140 to -44', description: 'Reference Signal Received Power' },
        'RSRQ': { value: -10 + Math.random() * 5, unit: 'dB', range: '-20 to -3', description: 'Reference Signal Received Quality' },
        'SINR': { value: 15 + Math.random() * 10, unit: 'dB', range: '-10 to 30', description: 'Signal to Interference plus Noise Ratio' },
        'CQI': { value: Math.floor(Math.random() * 16), unit: '', range: '0 to 15', description: 'Channel Quality Indicator' },
        'MCS': { value: Math.floor(Math.random() * 32), unit: '', range: '0 to 31', description: 'Modulation and Coding Scheme' }
      },
      'MAC': {
        'HARQ-Process-ID': { value: Math.floor(Math.random() * 16), unit: '', range: '0 to 15', description: 'HARQ Process ID' },
        'NDI': { value: Math.floor(Math.random() * 2), unit: '', range: '0 to 1', description: 'New Data Indicator' },
        'RV': { value: Math.floor(Math.random() * 4), unit: '', range: '0 to 3', description: 'Redundancy Version' }
      },
      'RLC': {
        'SN': { value: Math.floor(Math.random() * 1024), unit: '', range: '0 to 1023', description: 'Sequence Number' },
        'SO': { value: Math.floor(Math.random() * 65536), unit: 'bytes', range: '0 to 65535', description: 'Segment Offset' },
        'LI': { value: Math.floor(Math.random() * 1500), unit: 'bytes', range: '0 to 1500', description: 'Length Indicator' }
      },
      'RRC': {
        'Transaction-ID': { value: Math.floor(Math.random() * 4), unit: '', range: '0 to 3', description: 'Transaction Identifier' },
        'Procedure-Code': { value: 'rrcSetup', type: 'ENUMERATED', description: 'RRC Procedure Code' }
      },
      'NAS': {
        'Security-Header-Type': { value: 'Integrity protected', type: 'ENUMERATED', description: 'Security Header Type' },
        'Protocol-Discriminator': { value: '5GS Mobility Management', type: 'ENUMERATED', description: 'Protocol Discriminator' }
      }
    };

    return paramMap[layer] || {
      'default-param': { value: 'Default Value', unit: '', description: 'Default Parameter' }
    };
  };

  // Generate message payload
  const generateMessagePayload = (messageType: string): any => {
    const payloadMap: Record<string, any> = {
      'RRC_SETUP_REQUEST': {
        'ue-Identity': 'IMSI-123456789012345',
        'establishmentCause': 'mo-Data',
        'spare': '0'
      },
      'RRC_SETUP': {
        'rrc-TransactionIdentifier': 1,
        'radioBearerConfig': {
          'srb-ToAddModList': ['SRB1'],
          'srb-ToReleaseList': []
        }
      },
      'MEASUREMENT_REPORT': {
        'measId': 1,
        'measResultPCell': {
          'rsrp': -85,
          'rsrq': -10
        }
      }
    };

    return payloadMap[messageType] || { 'default': 'Default Payload' };
  };

  // Generate raw data
  const generateRawData = (messageType: string): string => {
    const rawDataMap: Record<string, string> = {
      'RRC_SETUP_REQUEST': '00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F',
      'RRC_SETUP': '10 11 12 13 14 15 16 17 18 19 1A 1B 1C 1D 1E 1F',
      'MEASUREMENT_REPORT': '20 21 22 23 24 25 26 27 28 29 2A 2B 2C 2D 2E 2F'
    };

    return rawDataMap[messageType] || '00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F';
  };

  // Generate hex data
  const generateHexData = (messageType: string): string => {
    return generateRawData(messageType).replace(/\s/g, '');
  };

  // Generate decoded data
  const generateDecodedData = (messageType: string, ies: Record<string, any>): any => {
    return {
      messageType,
      informationElements: ies,
      timestamp: new Date().toISOString(),
      decoded: true
    };
  };

  // Generate RNTI
  const generateRNTI = (direction: string): string => {
    const rntiMap: Record<string, string> = {
      'UL': 'C-RNTI-12345',
      'DL': 'C-RNTI-12345'
    };
    return rntiMap[direction] || 'C-RNTI-12345';
  };

  // Get category
  const getCategory = (layer: string): string => {
    const categoryMap: Record<string, string> = {
      'PHY': 'Physical Layer',
      'MAC': 'Medium Access Control',
      'RLC': 'Radio Link Control',
      'PDCP': 'Packet Data Convergence Protocol',
      'RRC': 'Radio Resource Control',
      'NAS': 'Non-Access Stratum',
      'IMS': 'IP Multimedia Subsystem',
      'APPLICATION': 'Application Layer'
    };
    return categoryMap[layer] || 'Unknown';
  };

  // Get subcategory
  const getSubCategory = (messageType: string): string => {
    const subCategoryMap: Record<string, string> = {
      'RRC_SETUP_REQUEST': 'Connection Establishment',
      'RRC_SETUP': 'Connection Establishment',
      'RRC_SETUP_COMPLETE': 'Connection Establishment',
      'MEASUREMENT_REPORT': 'Measurement',
      'RRC_RECONFIGURATION': 'Reconfiguration',
      'RRC_RELEASE': 'Connection Release'
    };
    return subCategoryMap[messageType] || 'General';
  };

  // Load logs on mount
  useEffect(() => {
    setLogs(generateRealisticLogs);
  }, [generateRealisticLogs]);

  // Apply filters
  useEffect(() => {
    let filtered = logs;

    // Search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(log => 
        log.messageName.toLowerCase().includes(query) ||
        log.messageType.toLowerCase().includes(query) ||
        log.layer.toLowerCase().includes(query) ||
        log.channel.toLowerCase().includes(query)
      );
    }

    // Layer filter
    if (filters.selectedLayers.length > 0) {
      filtered = filtered.filter(log => filters.selectedLayers.includes(log.layer));
    }

    // Channel filter
    if (filters.selectedChannels.length > 0) {
      filtered = filtered.filter(log => filters.selectedChannels.includes(log.channel));
    }

    // Direction filter
    if (filters.selectedDirections.length > 0) {
      filtered = filtered.filter(log => filters.selectedDirections.includes(log.direction));
    }

    // Message type filter
    if (filters.selectedMessageTypes.length > 0) {
      filtered = filtered.filter(log => filters.selectedMessageTypes.includes(log.messageType));
    }

    // Time range filter
    filtered = filtered.filter(log => 
      log.timestamp >= filters.timeRange.start && 
      log.timestamp <= filters.timeRange.end
    );

    // SFN range filter
    filtered = filtered.filter(log => 
      log.sfn >= filters.sfnRange.start && 
      log.sfn <= filters.sfnRange.end
    );

    // Error filter
    if (filters.showOnlyErrors) {
      filtered = filtered.filter(log => log.crcStatus === 'FAIL');
    }

    // High priority filter
    if (filters.showOnlyHighPriority) {
      filtered = filtered.filter(log => log.priority === 'HIGH');
    }

    setFilteredLogs(filtered);
  }, [logs, filters]);

  // Calculate statistics
  useEffect(() => {
    const stats = {
      totalMessages: logs.length,
      messagesByLayer: {} as Record<string, number>,
      messagesByChannel: {} as Record<string, number>,
      errorCount: logs.filter(log => log.crcStatus === 'FAIL').length,
      highPriorityCount: logs.filter(log => log.priority === 'HIGH').length
    };

    logs.forEach(log => {
      stats.messagesByLayer[log.layer] = (stats.messagesByLayer[log.layer] || 0) + 1;
      stats.messagesByChannel[log.channel] = (stats.messagesByChannel[log.channel] || 0) + 1;
    });

    setStatistics(stats);
  }, [logs]);

  // Playback functionality
  const startPlayback = () => {
    setIsPlaying(true);
    let currentIndex = 0;
    
    playbackIntervalRef.current = setInterval(() => {
      if (currentIndex < filteredLogs.length) {
        setExpandedLogs(prev => new Set([...prev, filteredLogs[currentIndex].id]));
        currentIndex++;
      } else {
        setIsPlaying(false);
        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current);
        }
      }
    }, 1000 / playbackSpeed);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
    }
  };

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getDirectionColor = (direction: string): string => {
    return direction === 'UL' ? 'text-blue-600 bg-blue-50' : 'text-purple-600 bg-purple-50';
  };

  const getLayerColor = (layer: string): string => {
    const colorMap: Record<string, string> = {
      'PHY': 'text-orange-600 bg-orange-50',
      'MAC': 'text-red-600 bg-red-50',
      'RLC': 'text-yellow-600 bg-yellow-50',
      'PDCP': 'text-green-600 bg-green-50',
      'RRC': 'text-blue-600 bg-blue-50',
      'NAS': 'text-purple-600 bg-purple-50',
      'IMS': 'text-pink-600 bg-pink-50',
      'APPLICATION': 'text-indigo-600 bg-indigo-50'
    };
    return colorMap[layer] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className={`h-full flex flex-col bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-gray-900">
              Professional Log Analysis - {platform}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
            <span className="text-sm text-gray-500">
              {filteredLogs.length} / {logs.length} messages
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
            <button
              onClick={isPlaying ? stopPlayback : startPlayback}
              className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search messages..."
                />
              </div>
            </div>

            {/* Layer Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Layers</label>
              <select
                multiple
                value={filters.selectedLayers}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  selectedLayers: Array.from(e.target.selectedOptions, option => option.value) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableLayers.map(layer => (
                  <option key={layer} value={layer}>{layer}</option>
                ))}
              </select>
            </div>

            {/* Channel Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Channels</label>
              <select
                multiple
                value={filters.selectedChannels}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  selectedChannels: Array.from(e.target.selectedOptions, option => option.value) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableChannels.map(channel => (
                  <option key={channel} value={channel}>{channel}</option>
                ))}
              </select>
            </div>

            {/* Direction Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
              <select
                multiple
                value={filters.selectedDirections}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  selectedDirections: Array.from(e.target.selectedOptions, option => option.value) 
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {availableDirections.map(direction => (
                  <option key={direction} value={direction}>{direction}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="mt-4 flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showOnlyErrors}
                onChange={(e) => setFilters(prev => ({ ...prev, showOnlyErrors: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Show only errors</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.showOnlyHighPriority}
                onChange={(e) => setFilters(prev => ({ ...prev, showOnlyHighPriority: e.target.checked }))}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Show only high priority</span>
            </label>
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700">Playback Speed:</label>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="px-2 py-1 border border-gray-300 rounded-md"
              >
                <option value={0.5}>0.5x</option>
                <option value={1}>1x</option>
                <option value={2}>2x</option>
                <option value={4}>4x</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Bar */}
      <div className="bg-gray-100 border-b border-gray-200 p-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="font-medium">Total: {statistics.totalMessages}</span>
            <span className="text-red-600">Errors: {statistics.errorCount}</span>
            <span className="text-orange-600">High Priority: {statistics.highPriorityCount}</span>
          </div>
          <div className="flex items-center space-x-4">
            {Object.entries(statistics.messagesByLayer).map(([layer, count]) => (
              <span key={layer} className="text-xs">
                {layer}: {count}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Log List */}
        <div className="flex-1 overflow-auto">
          <div className="space-y-1 p-2">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleLogExpansion(log.id)}
                      className="flex-shrink-0"
                    >
                      {expandedLogs.has(log.id) ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </span>
                      <span className="text-xs font-mono text-gray-400">
                        SFN:{log.sfn} Slot:{log.slot} Sym:{log.symbol}
                      </span>
                    </div>

                    <span className={`px-2 py-1 rounded text-xs font-medium ${getLayerColor(log.layer)}`}>
                      {log.layer}
                    </span>
                    
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDirectionColor(log.direction)}`}>
                      {log.direction}
                    </span>
                    
                    <span className="text-xs text-gray-600">
                      {log.channel}
                    </span>
                    
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(log.priority)}`}>
                      {log.priority}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      {log.messageName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {log.messageType}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      log.crcStatus === 'PASS' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                    }`}>
                      {log.crcStatus}
                    </span>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedLogs.has(log.id) && (
                  <div className="mt-4 space-y-4">
                    {/* Message Payload */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Message Payload</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                          {JSON.stringify(log.messagePayload, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {/* Information Elements */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Information Elements</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="space-y-2">
                          {Object.entries(log.informationElements).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-xs">
                              <span className="font-medium text-gray-700">{key}:</span>
                              <div className="text-right">
                                <span className="text-gray-600">{value.value}</span>
                                <span className="text-gray-400 ml-2">({value.type})</span>
                                <span className="text-gray-400 ml-2">{value.presence}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Layer Parameters */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Layer Parameters</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="space-y-2">
                          {Object.entries(log.layerParameters).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between text-xs">
                              <span className="font-medium text-gray-700">{key}:</span>
                              <div className="text-right">
                                <span className="text-gray-600">{value.value}</span>
                                <span className="text-gray-400 ml-2">{value.unit}</span>
                                <span className="text-gray-400 ml-2">({value.range})</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Raw Data */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Raw Data</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="space-y-2">
                          <div className="text-xs">
                            <span className="font-medium text-gray-700">Hex: </span>
                            <span className="font-mono text-gray-800">{log.hexData}</span>
                          </div>
                          <div className="text-xs">
                            <span className="font-medium text-gray-700">Raw: </span>
                            <span className="font-mono text-gray-800">{log.rawData}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Decoded Data */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Decoded Data</h4>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <pre className="text-xs text-gray-800 whitespace-pre-wrap">
                          {JSON.stringify(log.decodedData, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message Details Panel */}
        {selectedLog && (
          <div className="w-1/3 border-l border-gray-200 bg-white">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Basic Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Message Type:</span>
                    <span className="font-medium">{selectedLog.messageType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Layer:</span>
                    <span className="font-medium">{selectedLog.layer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Channel:</span>
                    <span className="font-medium">{selectedLog.channel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Direction:</span>
                    <span className="font-medium">{selectedLog.direction}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">RNTI:</span>
                    <span className="font-medium">{selectedLog.rnti}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">CRC Status:</span>
                    <span className={`font-medium ${
                      selectedLog.crcStatus === 'PASS' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedLog.crcStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalLogViewer;