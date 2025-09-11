// FileService - Handle file upload and processing
class FileService {
  constructor() {
    try {
      this.maxFileSize = window.CONSTANTS.MAX_FILE_SIZE;
      this.supportedFormats = window.CONSTANTS.SUPPORTED_FORMATS;
      this.uploadCallbacks = [];
    } catch (error) {
      console.error('FileService constructor error:', error);
      reportError(error);
    }
  }

  // Validate uploaded file
  validateFile(file) {
    try {
      const errors = [];
      
      // Check file size
      if (file.size > this.maxFileSize) {
        errors.push(`File too large. Max size: ${window.HELPERS.formatFileSize(this.maxFileSize)}`);
      }
      
      // Check file format
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      if (!this.supportedFormats.includes(extension)) {
        errors.push(`Unsupported format. Supported: ${this.supportedFormats.join(', ')}`);
      }
      
      return {
        valid: errors.length === 0,
        errors: errors
      };
    } catch (error) {
      console.error('FileService validate file error:', error);
      reportError(error);
      return { valid: false, errors: ['Validation failed'] };
    }
  }

  // Read file content
  async readFile(file) {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          resolve({
            name: file.name,
            size: file.size,
            content: e.target.result,
            lastModified: file.lastModified
          });
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        
        reader.readAsText(file);
      });
    } catch (error) {
      console.error('FileService read file error:', error);
      reportError(error);
      throw error;
    }
  }

  // Process uploaded CLI log file
  async processLogFile(file, progressCallback = null) {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }
      
      // Read file content
      const fileData = await this.readFile(file);
      
      // Process content line by line
      const lines = fileData.content.split('\n');
      const logEntries = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const logEntry = this.parseLogLine(line, file.name);
          if (logEntry) {
            logEntries.push(logEntry);
          }
        }
        
        // Report progress
        if (progressCallback && i % 100 === 0) {
          progressCallback(Math.round((i / lines.length) * 100));
        }
      }
      
      return {
        fileName: file.name,
        fileSize: file.size,
        totalLines: lines.length,
        logEntries: logEntries,
        processedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('FileService process log file error:', error);
      reportError(error);
      throw error;
    }
  }

  // Parse individual log line
  parseLogLine(line, fileName) {
    try {
      // Detect CLI source from filename or content
      let source = 'unknown';
      if (fileName.includes('srsran') || line.includes('[PHY]') || line.includes('[MAC]')) {
        source = 'srsran';
      } else if (fileName.includes('open5gs') || line.includes('amf') || line.includes('smf')) {
        source = 'open5gs';
      } else if (fileName.includes('kamailio') || line.includes('SIP/') || line.includes('INVITE')) {
        source = 'kamailio';
      }
      
      // Create log entry
      const logEntry = new LogEntry({
        timestamp: window.HELPERS.extractTimestamp(line),
        level: window.HELPERS.parseLogLevel(line),
        source: source,
        message: line,
        rawLine: line,
        parsed: true
      });
      
      return logEntry;
    } catch (error) {
      console.error('FileService parse log line error:', error);
      return null;
    }
  }
}

// Export FileService
window.FileService = FileService;
