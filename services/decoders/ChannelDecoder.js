// ChannelDecoder - Extract channel information from logs
class ChannelDecoder {
  static extractChannelInfo(log) {
    try {
      if (!log || !log.message) return null;
      
      const message = log.message;
      const timestamp = log.timestamp;
      
      // Detect channel type
      const channelType = this.detectChannelType(message);
      if (!channelType) return null;
      
      // Extract common parameters
      const info = {
        timestamp: timestamp,
        channelType: channelType,
        direction: this.extractDirection(message),
        networkType: this.detectNetworkType(message),
        rnti: this.extractRnti(message),
        mcs: this.extractMcs(message),
        harq: this.extractHarq(message),
        frameNumber: this.extractFrame(message),
        subframeNumber: this.extractSubframe(message),
        slotNumber: this.extractSlot(message),
        tbSize: this.extractTbSize(message),
        rawMessage: message
      };
      
      return info;
    } catch (error) {
      console.error('ChannelDecoder extract error:', error);
      return null;
    }
  }
  
  static detectChannelType(message) {
    try {
      const upperMsg = message.toUpperCase();
      
      if (upperMsg.includes('PDCCH')) return 'PDCCH';
      if (upperMsg.includes('PDSCH')) return 'PDSCH';
      if (upperMsg.includes('PUCCH')) return 'PUCCH';
      if (upperMsg.includes('PUSCH')) return 'PUSCH';
      if (upperMsg.includes('PBCH')) return 'PBCH';
      if (upperMsg.includes('PRACH')) return 'PRACH';
      if (upperMsg.includes('PCFICH')) return 'PCFICH';
      if (upperMsg.includes('PHICH')) return 'PHICH';
      
      return null;
    } catch (error) {
      console.error('ChannelDecoder detect type error:', error);
      return null;
    }
  }
  
  static extractDirection(message) {
    try {
      const lowerMsg = message.toLowerCase();
      
      if (lowerMsg.includes('dl') || lowerMsg.includes('downlink')) return 'DL';
      if (lowerMsg.includes('ul') || lowerMsg.includes('uplink')) return 'UL';
      if (lowerMsg.includes('tx') || lowerMsg.includes('send')) return 'DL';
      if (lowerMsg.includes('rx') || lowerMsg.includes('receive')) return 'UL';
      
      return 'UNK';
    } catch (error) {
      console.error('ChannelDecoder extract direction error:', error);
      return 'UNK';
    }
  }
  
  static detectNetworkType(message) {
    try {
      const upperMsg = message.toUpperCase();
      
      if (upperMsg.includes('NR') || upperMsg.includes('5G')) return '5G';
      if (upperMsg.includes('LTE') || upperMsg.includes('4G')) return 'LTE';
      if (upperMsg.includes('NB-IOT')) return 'NB-IoT';
      if (upperMsg.includes('V2X')) return 'V2X';
      if (upperMsg.includes('NTN')) return 'NTN';
      
      return '5G'; // Default assumption
    } catch (error) {
      console.error('ChannelDecoder detect network type error:', error);
      return '5G';
    }
  }
  
  static extractRnti(message) {
    try {
      const rntiMatch = message.match(/rnti[:\s]*([0-9a-fx]+)/i);
      if (rntiMatch) {
        return parseInt(rntiMatch[1], rntiMatch[1].includes('x') ? 16 : 10);
      }
      return null;
    } catch (error) {
      console.error('ChannelDecoder extract RNTI error:', error);
      return null;
    }
  }
  
  static extractMcs(message) {
    try {
      const mcsMatch = message.match(/mcs[:\s]*(\d+)/i);
      return mcsMatch ? parseInt(mcsMatch[1]) : null;
    } catch (error) {
      console.error('ChannelDecoder extract MCS error:', error);
      return null;
    }
  }
  
  static extractHarq(message) {
    try {
      const harqMatch = message.match(/harq[:\s]*(\d+)/i);
      return harqMatch ? parseInt(harqMatch[1]) : null;
    } catch (error) {
      console.error('ChannelDecoder extract HARQ error:', error);
      return null;
    }
  }
  
  static extractFrame(message) {
    try {
      const frameMatch = message.match(/frame[:\s]*(\d+)/i);
      return frameMatch ? parseInt(frameMatch[1]) : null;
    } catch (error) {
      console.error('ChannelDecoder extract frame error:', error);
      return null;
    }
  }
  
  static extractSubframe(message) {
    try {
      const sfMatch = message.match(/s(?:ub)?f(?:rame)?[:\s]*(\d+)/i);
      return sfMatch ? parseInt(sfMatch[1]) : null;
    } catch (error) {
      console.error('ChannelDecoder extract subframe error:', error);
      return null;
    }
  }
  
  static extractSlot(message) {
    try {
      const slotMatch = message.match(/slot[:\s]*(\d+)/i);
      return slotMatch ? parseInt(slotMatch[1]) : null;
    } catch (error) {
      console.error('ChannelDecoder extract slot error:', error);
      return null;
    }
  }
  
  static extractTbSize(message) {
    try {
      const tbMatch = message.match(/tb[_\s]*size[:\s]*(\d+)/i);
      return tbMatch ? parseInt(tbMatch[1]) : null;
    } catch (error) {
      console.error('ChannelDecoder extract TB size error:', error);
      return null;
    }
  }
}

// Export ChannelDecoder
window.ChannelDecoder = ChannelDecoder;
