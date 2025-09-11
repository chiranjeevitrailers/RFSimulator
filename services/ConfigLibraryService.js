// ConfigLibraryService - Manage configuration library and storage
class ConfigLibraryService {
  constructor() {
    this.storageKey = 'config_library';
    this.myConfigsKey = 'my_configs';
  }

  // Get all library configurations
  getLibraryConfigs() {
    try {
      const allConfigs = {};
      
      // Load from ConfigTemplates
      const types = window.ConfigTemplates?.getAvailableTypes() || [];
      types.forEach(type => {
        const templates = window.ConfigTemplates.getTemplatesForType(type);
        allConfigs[type] = Object.entries(templates).map(([id, config]) => ({
          id,
          name: config.name,
          description: config.description,
          type: 'library',
          config: config,
          source: 'built-in'
        }));
      });

      return allConfigs;
    } catch (error) {
      console.error('Failed to load library configs:', error);
      return {};
    }
  }

  // Get user's custom configurations
  getMyConfigs() {
    try {
      return JSON.parse(localStorage.getItem(this.myConfigsKey) || '{}');
    } catch (error) {
      console.error('Failed to load my configs:', error);
      return {};
    }
  }

  // Save custom configuration
  saveMyConfig(componentType, config) {
    try {
      const myConfigs = this.getMyConfigs();
      if (!myConfigs[componentType]) {
        myConfigs[componentType] = [];
      }
      
      myConfigs[componentType].push({
        ...config,
        id: config.id || Date.now().toString(),
        createdAt: config.createdAt || new Date().toISOString(),
        type: 'custom'
      });

      localStorage.setItem(this.myConfigsKey, JSON.stringify(myConfigs));
      return true;
    } catch (error) {
      console.error('Failed to save config:', error);
      return false;
    }
  }

  // Delete custom configuration
  deleteMyConfig(componentType, configId) {
    try {
      const myConfigs = this.getMyConfigs();
      if (myConfigs[componentType]) {
        myConfigs[componentType] = myConfigs[componentType].filter(c => c.id !== configId);
        localStorage.setItem(this.myConfigsKey, JSON.stringify(myConfigs));
      }
      return true;
    } catch (error) {
      console.error('Failed to delete config:', error);
      return false;
    }
  }

  // Export configurations
  exportConfigs(componentType) {
    try {
      const myConfigs = this.getMyConfigs();
      const configs = myConfigs[componentType] || [];
      
      const dataStr = JSON.stringify(configs, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${componentType}_configs_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Failed to export configs:', error);
      return false;
    }
  }

  // Import configurations
  importConfigs(componentType, configsData) {
    try {
      const myConfigs = this.getMyConfigs();
      if (!myConfigs[componentType]) {
        myConfigs[componentType] = [];
      }
      
      configsData.forEach(config => {
        config.id = Date.now().toString() + Math.random();
        config.importedAt = new Date().toISOString();
        myConfigs[componentType].push(config);
      });
      
      localStorage.setItem(this.myConfigsKey, JSON.stringify(myConfigs));
      return true;
    } catch (error) {
      console.error('Failed to import configs:', error);
      return false;
    }
  }
}

// Export ConfigLibraryService
window.ConfigLibraryService = new ConfigLibraryService();
