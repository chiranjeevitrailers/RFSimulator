// Real srsRAN Log Reader
const fs = require('fs');
const path = require('path');

class RealSrsranReader {
  constructor() {
    this.isReading = false;
    this.logBuffer = [];
    this.subscribers = new Set();
    this.fileWatcher = null;
    this.fileCreationWatcher = null;
    this.readInterval = null;
    this.logFormats = {
      phy: /^\[PHY\]\s*\[([IWED])\]\s*(.*)$/,
      mac: /^\[MAC\]\s*\[([IWED])\]\s*(.*)$/,
      rrc: /^\[RRC\]\s*\[([IWED])\]\s*(.*)$/,
      pdcp: /^\[PDCP\]\s*\[([IWED])\]\s*(.*)$/,
      rlc: /^\[RLC\]\s*\[([IWED])\]\s*(.*)$/,
      general: /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+)\s+\[([A-Z]+)\]\s*\[([IWED])\]\s*(.*)$/
    };
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  parseLogLine(line) {
    try {
      // Use unified decoder for enhanced parsing
      if (window.UnifiedLogDecoder) {
        const decoder = new UnifiedLogDecoder();
        const decoded = decoder.decode(line, null); // Let decoder detect source
        if (decoded) {
          return decoded;
        }
      }

      // Fallback to original parsing
      const timestamp = new Date().toISOString();
      
      let match = this.logFormats.general.exec(line);
      if (match) {
        return {
          timestamp: match[1],
          layer: match[2].toLowerCase(),
          level: match[3],
          message: match[4],
          source: 'srsran',
          raw: line
        };
      }

      for (const [layer, regex] of Object.entries(this.logFormats)) {
        if (layer === 'general') continue;
        match = regex.exec(line);
        if (match) {
          return {
            timestamp,
            layer,
            level: match[1],
            message: match[2],
            source: 'srsran',
            raw: line
          };
        }
      }

      return {
        timestamp,
        layer: 'unknown',
        level: 'I',
        message: line,
        source: 'srsran',
        raw: line
      };
    } catch (error) {
      console.error('RealSrsranReader parseLogLine error:', error);
      return null;
    }
  }

  async startReading(logPath = '/tmp/srsran.log') {
    try {
      this.isReading = true;

      // Check if log file exists
      if (!fs.existsSync(logPath)) {
        console.warn(`srsRAN log file not found: ${logPath}`);
        console.log('Waiting for log file to be created...');

        // Watch for file creation
        const dirPath = path.dirname(logPath);
        const fileName = path.basename(logPath);

        this.fileCreationWatcher = fs.watch(dirPath, (eventType, filename) => {
          if (eventType === 'rename' && filename === fileName) {
            if (fs.existsSync(logPath)) {
              console.log(`srsRAN log file created: ${logPath}`);
              this.fileCreationWatcher.close();
              this.setupFileWatcher(logPath);
            }
          }
        });
        return;
      }

      // File exists, set up watcher
      this.setupFileWatcher(logPath);

    } catch (error) {
      console.error('RealSrsranReader startReading error:', error);
      this.isReading = false;
    }
  }

  setupFileWatcher(logPath) {
    try {
      console.log(`Setting up file watcher for: ${logPath}`);

      // Read initial content to get current position
      let lastPosition = 0;
      if (fs.existsSync(logPath)) {
        const stats = fs.statSync(logPath);
        lastPosition = stats.size;
      }

      // Watch for file changes
      this.fileWatcher = fs.watch(logPath, (eventType) => {
        if (eventType === 'change' && this.isReading) {
          this.readNewLogLines(logPath, lastPosition);
        }
      });

      // Set up periodic reading as backup
      this.readInterval = setInterval(() => {
        if (this.isReading) {
          this.readNewLogLines(logPath, lastPosition);
        }
      }, 1000); // Check every second

    } catch (error) {
      console.error('Error setting up file watcher:', error);
    }
  }

  readNewLogLines(logPath, lastPosition) {
    try {
      if (!fs.existsSync(logPath)) return;

      const content = fs.readFileSync(logPath, 'utf8');
      const lines = content.split('\n');

      // Find new lines since last position
      const newLines = [];
      let currentPosition = 0;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        currentPosition += line.length + 1; // +1 for newline

        if (currentPosition > lastPosition && line.trim()) {
          newLines.push(line);
        }
      }

      // Update last position
      lastPosition = content.length;

      // Process new lines
      newLines.forEach(line => {
        const parsedLog = this.parseLogLine(line);
        if (parsedLog) {
          this.subscribers.forEach(callback => {
            try {
              callback(parsedLog);
            } catch (error) {
              console.error('Subscriber callback error:', error);
            }
          });
        }
      });

    } catch (error) {
      console.error('Error reading new log lines:', error);
    }
  }

  stopReading() {
    this.isReading = false;

    // Clear reading interval
    if (this.readInterval) {
      clearInterval(this.readInterval);
      this.readInterval = null;
    }

    // Close file watcher
    if (this.fileWatcher) {
      this.fileWatcher.close();
      this.fileWatcher = null;
    }

    // Close file creation watcher
    if (this.fileCreationWatcher) {
      this.fileCreationWatcher.close();
      this.fileCreationWatcher = null;
    }

    console.log('RealSrsranReader stopped');
  }

  getLogBuffer() {
    return [...this.logBuffer];
  }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
  window.RealSrsranReader = RealSrsranReader;
}