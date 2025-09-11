// Unified Log Decoder - Handles all protocol log formats
class UnifiedLogDecoder {
  constructor() {
    this.decoders = {
      oran: new OranLogDecoder(),
      nbiot: new NbiotLogDecoder(), 
      v2x: new V2xLogDecoder(),
      ntn: new NtnLogDecoder()
    };
  }

  decode(logLine, source) {
    try {
      // Determine source from log line if not provided
      if (!source) {
        source = this.detectSource(logLine);
      }

      const decoder = this.decoders[source];
      if (decoder) {
        return decoder.decode(logLine, source);
      }

      // Fallback to generic parsing
      return this.parseGeneric(logLine, source);
    } catch (error) {
      console.error('UnifiedLogDecoder error:', error);
      return null;
    }
  }

  detectSource(logLine) {
    if (logLine.includes('[E1]') || logLine.includes('[F1]') || logLine.includes('[CU-')) {
      return 'oran';
    }
    if (logLine.includes('[NBIOT-') || logLine.includes('NB-IoT')) {
      return 'nbiot';
    }
    if (logLine.includes('[V2X-') || logLine.includes('[SIDELINK]')) {
      return 'v2x';
    }
    if (logLine.includes('[NTN-') || logLine.includes('[SATELLITE]')) {
      return 'ntn';
    }
    return 'srsran';
  }

  parseGeneric(logLine, source) {
    return {
      timestamp: new Date().toISOString(),
      level: 'I',
      message: logLine,
      source: source || 'unknown',
      raw: logLine
    };
  }

  getSupportedSources() {
    return Object.keys(this.decoders);
  }
}

if (typeof window !== 'undefined') {
  window.UnifiedLogDecoder = UnifiedLogDecoder;
}