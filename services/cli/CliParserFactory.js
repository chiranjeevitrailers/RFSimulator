// CliParserFactory - Creates appropriate parsers for different CLI sources
class CliParserFactory {
  constructor() {
    this.parsers = new Map();
    this.initializeParsers();
  }

  initializeParsers() {
    // Register available parsers
    if (typeof SrsranCliParser !== 'undefined') {
      this.parsers.set('srsran', new SrsranCliParser());
    }
    if (typeof Open5gsCliParser !== 'undefined') {
      this.parsers.set('open5gs', new Open5gsCliParser());
    }
    if (typeof KamailioCliParser !== 'undefined') {
      this.parsers.set('kamailio', new KamailioCliParser());
    }
    if (typeof OranCliParser !== 'undefined') {
      this.parsers.set('oran', new OranCliParser());
    }
  }

  getParser(source) {
    try {
      switch (source.toLowerCase()) {
        case 'srsran':
        case 'srsgnb':
        case 'srsue':
          return new SrsranCliParser();
        case 'open5gs':
        case 'amf':
        case 'smf':
        case 'upf':
          return new Open5gsCliParser();
        case 'kamailio':
        case 'sip':
        case 'ims':
          return new KamailioCliParser();
        default:
          return this.createDefaultParser();
      }
    } catch (error) {
      console.error('CliParserFactory getParser error:', error);
      return this.createDefaultParser();
    }
  }

  createDefaultParser() {
    return {
      parseLine: (line) => {
        return {
          level: this.extractLevel(line),
          component: this.extractComponent(line),
          layer: this.extractLayer(line),
          messageType: 'GENERIC',
          fields: {}
        };
      }
    };
  }

  extractLevel(line) {
    if (line.includes('[E]')) return 'error';
    if (line.includes('[W]')) return 'warn';
    if (line.includes('[I]')) return 'info';
    return 'info';
  }

  extractComponent(line) {
    const match = line.match(/\[([A-Z]+)\]/);
    return match ? match[1] : 'UNKNOWN';
  }

  extractLayer(line) {
    if (line.includes('[PHY]')) return 'PHY';
    if (line.includes('[MAC]')) return 'MAC';
    if (line.includes('[RLC]')) return 'RLC';
    if (line.includes('[PDCP]')) return 'PDCP';
    if (line.includes('[RRC]')) return 'RRC';
    if (line.includes('[NAS]')) return 'NAS';
    return 'OTHER';
  }
}

window.CliParserFactory = CliParserFactory;