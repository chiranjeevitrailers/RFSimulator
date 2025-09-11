// Production Safety Manager - Ensures safe CLI operations
class ProductionSafetyManager {
  constructor() {
    this.isProductionMode = false;
    this.emergencyStop = false;
    this.maxConcurrentCommands = 3;
    this.activeCommands = new Set();
    this.commandHistory = [];
    this.safetyChecks = new Map();
  }

  initialize(config = {}) {
    try {
      this.isProductionMode = config.productionMode || false;
      this.maxConcurrentCommands = config.maxCommands || 3;
      
      // Register safety checks
      this.registerSafetyCheck('command_validation', this.validateCommand.bind(this));
      this.registerSafetyCheck('resource_limits', this.checkResourceLimits.bind(this));
      this.registerSafetyCheck('emergency_stop', this.checkEmergencyStop.bind(this));
      
      return true;
    } catch (error) {
      console.error('ProductionSafetyManager initialization error:', error);
      return false;
    }
  }

  registerSafetyCheck(name, checkFunction) {
    this.safetyChecks.set(name, checkFunction);
  }

  async validateOperation(operation) {
    try {
      // Run all safety checks
      for (const [name, check] of this.safetyChecks) {
        const result = await check(operation);
        if (!result.safe) {
          return {
            allowed: false,
            reason: `Safety check failed: ${name}`,
            details: result.reason
          };
        }
      }

      return { allowed: true };
    } catch (error) {
      console.error('ProductionSafetyManager validateOperation error:', error);
      return { 
        allowed: false, 
        reason: 'Safety validation error',
        details: error.message 
      };
    }
  }

  validateCommand(operation) {
    try {
      if (operation.type !== 'command') {
        return { safe: true };
      }

      const dangerousCommands = [
        'rm -rf', 'mkfs', 'dd if=', 'killall', 'reboot', 'shutdown'
      ];

      const isDangerous = dangerousCommands.some(cmd => 
        operation.command.includes(cmd)
      );

      if (isDangerous && this.isProductionMode) {
        return { 
          safe: false, 
          reason: 'Dangerous command blocked in production mode' 
        };
      }

      return { safe: true };
    } catch (error) {
      return { safe: false, reason: 'Command validation error' };
    }
  }

  checkResourceLimits(operation) {
    try {
      if (this.activeCommands.size >= this.maxConcurrentCommands) {
        return { 
          safe: false, 
          reason: 'Maximum concurrent commands exceeded' 
        };
      }

      return { safe: true };
    } catch (error) {
      return { safe: false, reason: 'Resource limit check error' };
    }
  }

  checkEmergencyStop(operation) {
    if (this.emergencyStop) {
      return { 
        safe: false, 
        reason: 'Emergency stop is active' 
      };
    }
    return { safe: true };
  }

  triggerEmergencyStop(reason = 'Manual emergency stop') {
    try {
      this.emergencyStop = true;
      
      // Stop all active operations
      this.activeCommands.forEach(commandId => {
        this.stopCommand(commandId);
      });

      // Log emergency stop
      this.logEmergencyEvent('EMERGENCY_STOP', reason);
      
      return true;
    } catch (error) {
      console.error('ProductionSafetyManager triggerEmergencyStop error:', error);
      return false;
    }
  }

  clearEmergencyStop() {
    this.emergencyStop = false;
    this.logEmergencyEvent('EMERGENCY_CLEARED', 'Emergency stop cleared');
  }

  logEmergencyEvent(type, details) {
    const event = {
      timestamp: new Date().toISOString(),
      type,
      details,
      activeCommands: Array.from(this.activeCommands)
    };
    
    console.warn('SAFETY EVENT:', event);
    // In production, this would be logged to a secure audit trail
  }

  stopCommand(commandId) {
    this.activeCommands.delete(commandId);
    // Implementation would stop the actual command process
  }

  getStatus() {
    return {
      isProductionMode: this.isProductionMode,
      emergencyStop: this.emergencyStop,
      activeCommands: this.activeCommands.size,
      maxConcurrentCommands: this.maxConcurrentCommands,
      safetyChecksRegistered: this.safetyChecks.size
    };
  }
}

if (typeof window !== 'undefined') {
  window.ProductionSafetyManager = ProductionSafetyManager;
}