// Environment Validator - Validates CLI environment setup
class EnvironmentValidator {
  constructor() {
    this.validationResults = new Map();
    this.requirements = {
      srsran: ['gcc', 'cmake', 'libfftw3-dev'],
      open5gs: ['mongodb', 'nodejs', 'build-essential'],
      kamailio: ['gcc', 'flex', 'bison', 'libssl-dev']
    };
  }

  async validateEnvironment(component = 'all') {
    try {
      const results = {
        timestamp: new Date().toISOString(),
        component,
        checks: {},
        overall: 'pending'
      };

      if (component === 'all') {
        for (const comp of Object.keys(this.requirements)) {
          results.checks[comp] = await this.validateComponent(comp);
        }
      } else {
        results.checks[component] = await this.validateComponent(component);
      }

      // Determine overall status
      const allChecks = Object.values(results.checks);
      results.overall = allChecks.every(c => c.status === 'pass') ? 'pass' : 'fail';

      this.validationResults.set(component, results);
      return results;
    } catch (error) {
      console.error('EnvironmentValidator error:', error);
      return { overall: 'error', error: error.message };
    }
  }

  async validateComponent(component) {
    const requirements = this.requirements[component] || [];
    const result = {
      status: 'pass',
      requirements: [],
      missing: []
    };

    for (const req of requirements) {
      const available = await this.checkRequirement(req);
      result.requirements.push({
        name: req,
        available,
        status: available ? 'pass' : 'fail'
      });

      if (!available) {
        result.missing.push(req);
        result.status = 'fail';
      }
    }

    return result;
  }

  async checkRequirement(requirement) {
    // Simulate requirement checking
    const commonTools = ['gcc', 'cmake', 'nodejs', 'mongodb'];
    return commonTools.includes(requirement) || Math.random() > 0.3;
  }

  getValidationReport() {
    return Array.from(this.validationResults.entries()).map(([component, results]) => ({
      component,
      ...results
    }));
  }
}

if (typeof window !== 'undefined') {
  window.EnvironmentValidator = EnvironmentValidator;
}