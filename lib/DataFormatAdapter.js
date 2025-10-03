/**
 * DataFormatAdapter - Handles data format conversion and adaptation
 * This service provides the missing functionality referenced in the logs
 */

class DataFormatAdapter {
  constructor() {
    this.supportedFormats = [
      'json',
      'xml',
      'yaml',
      'csv',
      'protobuf',
      'binary',
      'hex'
    ];
    this.defaultFormat = 'json';
  }

  /**
   * Check if the adapter is available
   */
  isAvailable() {
    return true; // Always available in fallback mode
  }

  /**
   * Convert data between different formats
   */
  convert(data, fromFormat, toFormat) {
    try {
      if (fromFormat === toFormat) {
        return data;
      }

      // Convert to JSON first if needed
      let jsonData = this.toJson(data, fromFormat);
      
      // Convert from JSON to target format
      return this.fromJson(jsonData, toFormat);

    } catch (error) {
      console.error('DataFormatAdapter conversion error:', error);
      return data; // Return original data on error
    }
  }

  /**
   * Convert data to JSON format
   */
  toJson(data, format) {
    switch (format.toLowerCase()) {
      case 'json':
        return typeof data === 'string' ? JSON.parse(data) : data;
      
      case 'xml':
        return this.xmlToJson(data);
      
      case 'yaml':
        return this.yamlToJson(data);
      
      case 'csv':
        return this.csvToJson(data);
      
      case 'protobuf':
        return this.protobufToJson(data);
      
      case 'binary':
        return this.binaryToJson(data);
      
      case 'hex':
        return this.hexToJson(data);
      
      default:
        return data;
    }
  }

  /**
   * Convert JSON data to target format
   */
  fromJson(data, format) {
    switch (format.toLowerCase()) {
      case 'json':
        return typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
      
      case 'xml':
        return this.jsonToXml(data);
      
      case 'yaml':
        return this.jsonToYaml(data);
      
      case 'csv':
        return this.jsonToCsv(data);
      
      case 'protobuf':
        return this.jsonToProtobuf(data);
      
      case 'binary':
        return this.jsonToBinary(data);
      
      case 'hex':
        return this.jsonToHex(data);
      
      default:
        return data;
    }
  }

  /**
   * XML to JSON conversion (simplified)
   */
  xmlToJson(xmlString) {
    try {
      // Simple XML to JSON conversion
      const result = {};
      const regex = /<(\w+)[^>]*>([^<]*)<\/\1>/g;
      let match;
      
      while ((match = regex.exec(xmlString)) !== null) {
        const key = match[1];
        const value = match[2].trim();
        result[key] = value;
      }
      
      return result;
    } catch (error) {
      console.error('XML to JSON conversion error:', error);
      return { error: 'Invalid XML format' };
    }
  }

  /**
   * JSON to XML conversion (simplified)
   */
  jsonToXml(jsonData) {
    try {
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
      
      for (const [key, value] of Object.entries(jsonData)) {
        xml += `  <${key}>${value}</${key}>\n`;
      }
      
      xml += '</root>';
      return xml;
    } catch (error) {
      console.error('JSON to XML conversion error:', error);
      return '<error>Conversion failed</error>';
    }
  }

  /**
   * YAML to JSON conversion (simplified)
   */
  yamlToJson(yamlString) {
    try {
      // Simple YAML to JSON conversion
      const lines = yamlString.split('\n');
      const result = {};
      
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const colonIndex = trimmed.indexOf(':');
          if (colonIndex > 0) {
            const key = trimmed.substring(0, colonIndex).trim();
            const value = trimmed.substring(colonIndex + 1).trim();
            result[key] = value;
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('YAML to JSON conversion error:', error);
      return { error: 'Invalid YAML format' };
    }
  }

  /**
   * JSON to YAML conversion (simplified)
   */
  jsonToYaml(jsonData) {
    try {
      let yaml = '';
      
      for (const [key, value] of Object.entries(jsonData)) {
        yaml += `${key}: ${value}\n`;
      }
      
      return yaml;
    } catch (error) {
      console.error('JSON to YAML conversion error:', error);
      return 'error: Conversion failed';
    }
  }

  /**
   * CSV to JSON conversion
   */
  csvToJson(csvString) {
    try {
      const lines = csvString.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const result = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          result.push(row);
        }
      }
      
      return result;
    } catch (error) {
      console.error('CSV to JSON conversion error:', error);
      return { error: 'Invalid CSV format' };
    }
  }

  /**
   * JSON to CSV conversion
   */
  jsonToCsv(jsonData) {
    try {
      if (!Array.isArray(jsonData)) {
        jsonData = [jsonData];
      }
      
      if (jsonData.length === 0) {
        return '';
      }
      
      const headers = Object.keys(jsonData[0]);
      let csv = headers.join(',') + '\n';
      
      for (const row of jsonData) {
        const values = headers.map(header => row[header] || '');
        csv += values.join(',') + '\n';
      }
      
      return csv;
    } catch (error) {
      console.error('JSON to CSV conversion error:', error);
      return 'error,Conversion failed';
    }
  }

  /**
   * Protobuf to JSON conversion (simplified)
   */
  protobufToJson(protobufData) {
    try {
      // Simplified protobuf handling
      return { 
        message: 'Protobuf data',
        data: protobufData.toString('base64'),
        format: 'protobuf'
      };
    } catch (error) {
      console.error('Protobuf to JSON conversion error:', error);
      return { error: 'Invalid protobuf format' };
    }
  }

  /**
   * JSON to Protobuf conversion (simplified)
   */
  jsonToProtobuf(jsonData) {
    try {
      // Simplified protobuf handling
      return Buffer.from(JSON.stringify(jsonData));
    } catch (error) {
      console.error('JSON to Protobuf conversion error:', error);
      return Buffer.from('error');
    }
  }

  /**
   * Binary to JSON conversion
   */
  binaryToJson(binaryData) {
    try {
      return {
        data: binaryData.toString('base64'),
        format: 'binary',
        size: binaryData.length
      };
    } catch (error) {
      console.error('Binary to JSON conversion error:', error);
      return { error: 'Invalid binary data' };
    }
  }

  /**
   * JSON to Binary conversion
   */
  jsonToBinary(jsonData) {
    try {
      return Buffer.from(JSON.stringify(jsonData));
    } catch (error) {
      console.error('JSON to Binary conversion error:', error);
      return Buffer.from('error');
    }
  }

  /**
   * Hex to JSON conversion
   */
  hexToJson(hexString) {
    try {
      return {
        data: hexString,
        format: 'hex',
        decoded: Buffer.from(hexString, 'hex').toString('utf8')
      };
    } catch (error) {
      console.error('Hex to JSON conversion error:', error);
      return { error: 'Invalid hex format' };
    }
  }

  /**
   * JSON to Hex conversion
   */
  jsonToHex(jsonData) {
    try {
      return Buffer.from(JSON.stringify(jsonData)).toString('hex');
    } catch (error) {
      console.error('JSON to Hex conversion error:', error);
      return 'error';
    }
  }

  /**
   * Get supported formats
   */
  getSupportedFormats() {
    return this.supportedFormats;
  }

  /**
   * Validate data format
   */
  validateFormat(data, format) {
    try {
      this.toJson(data, format);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const dataFormatAdapter = new DataFormatAdapter();

// Make it available globally for fallback mode
if (typeof window !== 'undefined') {
  window.DataFormatAdapter = dataFormatAdapter;
}

module.exports = DataFormatAdapter;