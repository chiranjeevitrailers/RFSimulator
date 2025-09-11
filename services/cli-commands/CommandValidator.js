// Overview: Validate CLI commands before execution for safety
// Dependencies: SafetyLayer.js | Defines: Command safety validation
// Zero-Risk: Comprehensive validation, safety categories, risk assessment

const CommandValidator = (() => {
    try {
        let validatorActive = false;
        let safeCommands = new Map();
        let validationHistory = [];

        return {
            // Initialize command validator
            initialize() {
                try {
                    validatorActive = true;
                    this.initializeSafeCommands();
                    
                    console.log('CommandValidator: Command validator initialized');
                    return 'Command validator initialized';

                } catch (error) {
                    SafetyLayer.handleError(error, 'command_validator');
                    return 'Failed to initialize command validator';
                }
            },

            // Initialize safe command lists
            initializeSafeCommands() {
                try {
                    // srsRAN safe commands
                    safeCommands.set('srsran', {
                        read_only: [
                            'get_metrics', 'show_status', 'get_config', 'list_ues',
                            'show_cells', 'get_version', 'show_stats'
                        ],
                        monitoring: [
                            'start_trace', 'stop_trace', 'enable_logging', 'disable_logging'
                        ],
                        low_risk: [
                            'set_log_level', 'update_metrics_period'
                        ]
                    });

                    // Open5GS safe commands
                    safeCommands.set('open5gs', {
                        read_only: [
                            'show_subscriber', 'list_sessions', 'get_nf_status',
                            'show_config', 'get_metrics', 'list_nf_profiles'
                        ],
                        monitoring: [
                            'enable_trace', 'disable_trace', 'set_log_level'
                        ],
                        low_risk: [
                            'update_subscriber_profile', 'refresh_nf_profile'
                        ]
                    });

                    // Kamailio safe commands
                    safeCommands.set('kamailio', {
                        read_only: [
                            'ul.dump', 'stats.get_statistics', 'tm.stats',
                            'sl.stats', 'core.info', 'dispatcher.list'
                        ],
                        monitoring: [
                            'log.set_level', 'trace.on', 'trace.off'
                        ],
                        low_risk: [
                            'ul.rm', 'dispatcher.reload'
                        ]
                    });

                } catch (error) {
                    SafetyLayer.handleError(error, 'command_validator');
                }
            },

            // Validate command safety
            async validate(tool, command) {
                try {
                    const validation = {
                        safe: false,
                        tool: tool,
                        command: command,
                        category: 'unknown',
                        riskLevel: 'high',
                        issues: [],
                        recommendations: [],
                        timestamp: Date.now()
                    };

                    // Check if tool is supported
                    if (!safeCommands.has(tool)) {
                        validation.issues.push(`Unsupported tool: ${tool}`);
                        validation.recommendations.push('Use supported tools: srsran, open5gs, kamailio');
                        return validation;
                    }

                    // Validate command format
                    const formatValidation = this.validateCommandFormat(command);
                    if (!formatValidation.valid) {
                        validation.issues.push(...formatValidation.issues);
                        return validation;
                    }

                    // Check command safety category
                    const safetyCheck = this.checkCommandSafety(tool, command);
                    validation.category = safetyCheck.category;
                    validation.riskLevel = safetyCheck.riskLevel;

                    // Determine if command is safe to execute
                    if (safetyCheck.category !== 'unknown' && safetyCheck.category !== 'forbidden') {
                        validation.safe = true;
                    } else {
                        validation.issues.push(`Command not in safe list for ${tool}`);
                        validation.recommendations.push('Use only pre-approved safe commands');
                    }

                    // Additional safety checks
                    const additionalChecks = this.performAdditionalSafetyChecks(tool, command);
                    if (!additionalChecks.passed) {
                        validation.safe = false;
                        validation.issues.push(...additionalChecks.issues);
                    }

                    // Record validation
                    this.recordValidation(validation);

                    return validation;

                } catch (error) {
                    SafetyLayer.handleError(error, 'command_validator');
                    return {
                        safe: false,
                        tool: tool,
                        command: command,
                        error: 'Validation error',
                        issues: ['Validator error occurred']
                    };
                }
            },

            // Validate command format
            validateCommandFormat(command) {
                try {
                    const validation = { valid: true, issues: [] };

                    // Check for empty command
                    if (!command || typeof command !== 'string' || command.trim().length === 0) {
                        validation.valid = false;
                        validation.issues.push('Command cannot be empty');
                    }

                    // Check for dangerous characters
                    const dangerousChars = [';', '|', '&', '>', '<', '`', '$'];
                    for (const char of dangerousChars) {
                        if (command.includes(char)) {
                            validation.valid = false;
                            validation.issues.push(`Dangerous character detected: ${char}`);
                        }
                    }

                    // Check command length
                    if (command.length > 200) {
                        validation.valid = false;
                        validation.issues.push('Command too long (max 200 characters)');
                    }

                    return validation;

                } catch (error) {
                    SafetyLayer.handleError(error, 'command_validator');
                    return { valid: false, issues: ['Format validation error'] };
                }
            },

            // Check command safety category
            checkCommandSafety(tool, command) {
                try {
                    const toolCommands = safeCommands.get(tool);
                    if (!toolCommands) {
                        return { category: 'unknown', riskLevel: 'high' };
                    }

                    // Check each safety category
                    for (const [category, commands] of Object.entries(toolCommands)) {
                        if (commands.some(safeCmd => command.startsWith(safeCmd))) {
                            const riskLevel = this.getRiskLevelForCategory(category);
                            return { category, riskLevel };
                        }
                    }

                    return { category: 'unknown', riskLevel: 'high' };

                } catch (error) {
                    SafetyLayer.handleError(error, 'command_validator');
                    return { category: 'unknown', riskLevel: 'high' };
                }
            },

            // Get risk level for command category
            getRiskLevelForCategory(category) {
                const riskMapping = {
                    'read_only': 'very_low',
                    'monitoring': 'low',
                    'low_risk': 'medium',
                    'configuration': 'high',
                    'system_control': 'very_high'
                };
                return riskMapping[category] || 'high';
            },

            // Perform additional safety checks
            performAdditionalSafetyChecks(tool, command) {
                try {
                    const checks = { passed: true, issues: [] };

                    // Check if safety mode allows this command
                    if (FeatureFlags.isEnabled('STRICT_SAFETY_MODE')) {
                        const allowedInStrictMode = ['read_only', 'monitoring'];
                        const safetyCheck = this.checkCommandSafety(tool, command);
                        
                        if (!allowedInStrictMode.includes(safetyCheck.category)) {
                            checks.passed = false;
                            checks.issues.push('Command not allowed in strict safety mode');
                        }
                    }

                    // Check for rate limiting
                    const recentValidations = validationHistory.filter(
                        v => v.tool === tool && (Date.now() - v.timestamp) < 60000
                    );
                    
                    if (recentValidations.length > 10) {
                        checks.passed = false;
                        checks.issues.push('Rate limit exceeded for this tool');
                    }

                    return checks;

                } catch (error) {
                    SafetyLayer.handleError(error, 'command_validator');
                    return { passed: false, issues: ['Additional safety check error'] };
                }
            },

            // Record validation attempt
            recordValidation(validation) {
                try {
                    validationHistory.push({
                        timestamp: validation.timestamp,
                        tool: validation.tool,
                        command: validation.command,
                        safe: validation.safe,
                        category: validation.category,
                        riskLevel: validation.riskLevel
                    });

                    // Limit history
                    if (validationHistory.length > 200) {
                        validationHistory = validationHistory.slice(-200);
                    }

                } catch (error) {
                    SafetyLayer.handleError(error, 'command_validator');
                }
            },

            // Get safe commands for tool
            getSafeCommands(tool) {
                return safeCommands.get(tool) || {};
            },

            // Get validation history
            getValidationHistory(limit = 50) {
                return validationHistory.slice(-limit);
            },

            // Get validator statistics
            getValidatorStats() {
                try {
                    const stats = {
                        totalValidations: validationHistory.length,
                        safeValidations: validationHistory.filter(v => v.safe).length,
                        unsafeValidations: validationHistory.filter(v => !v.safe).length,
                        toolBreakdown: {},
                        categoryBreakdown: {}
                    };

                    // Tool breakdown
                    validationHistory.forEach(v => {
                        stats.toolBreakdown[v.tool] = (stats.toolBreakdown[v.tool] || 0) + 1;
                    });

                    // Category breakdown
                    validationHistory.forEach(v => {
                        stats.categoryBreakdown[v.category] = (stats.categoryBreakdown[v.category] || 0) + 1;
                    });

                    return stats;

                } catch (error) {
                    SafetyLayer.handleError(error, 'command_validator');
                    return { totalValidations: 0, error: 'Stats calculation error' };
                }
            },

            // Get validator status
            getStatus() {
                return {
                    active: validatorActive,
                    supportedTools: Array.from(safeCommands.keys()),
                    validationCount: validationHistory.length,
                    strictMode: FeatureFlags.isEnabled('STRICT_SAFETY_MODE'),
                    stats: this.getValidatorStats()
                };
            }
        };

    } catch (error) {
        console.error('CommandValidator initialization error:', error);
        reportError(error);
        return {
            initialize: () => 'CommandValidator unavailable',
            validate: async () => ({ safe: false, error: 'Validator unavailable' }),
            getSafeCommands: () => ({}),
            getValidationHistory: () => [],
            getValidatorStats: () => ({ error: 'Unavailable' }),
            getStatus: () => ({ active: false, error: 'Unavailable' })
        };
    }
})();
