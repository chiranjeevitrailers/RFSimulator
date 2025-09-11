// Helper utilities for data formatting and processing
const HELPERS = {
  formatTime: (timestamp) => {
    try {
      if (!timestamp) return 'N/A';
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch (error) {
      return 'Invalid Time';
    }
  },

  formatBytes: (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  formatFrequency: (freq) => {
    if (!freq) return '0 Hz';
    if (freq >= 1000000000) return (freq / 1000000000).toFixed(1) + ' GHz';
    if (freq >= 1000000) return (freq / 1000000).toFixed(1) + ' MHz';
    if (freq >= 1000) return (freq / 1000).toFixed(1) + ' kHz';
    return freq + ' Hz';
  },

  getLevelColor: (level) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warn': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'debug': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  }
};

window.HELPERS = HELPERS;