// Overview: UI panel for safe CLI command execution with monitoring
// Dependencies: SafeCLIExecutor.js, CommandValidator.js | Defines: CLI command UI
// Zero-Risk: Validation UI, execution monitoring, safety controls

function CLICommandPanel() {
    try {
        const [selectedTool, setSelectedTool] = React.useState('srsran');
        const [command, setCommand] = React.useState('');
        const [executionHistory, setExecutionHistory] = React.useState([]);
        const [validationResult, setValidationResult] = React.useState(null);
        const [isExecuting, setIsExecuting] = React.useState(false);

        // Initialize panel
        React.useEffect(() => {
            loadExecutionHistory();
        }, []);

        // Load execution history
        const loadExecutionHistory = () => {
            try {
                if (typeof SafeCLIExecutor !== 'undefined') {
                    const history = SafeCLIExecutor.getExecutionHistory(20);
                    setExecutionHistory(history);
                }
            } catch (error) {
                if (typeof reportError !== 'undefined') {
                    reportError(error, 'cli_command_panel');
                } else {
                    console.error('CLI Command Panel error:', error);
                }
            }
        };

        // Validate command as user types
        React.useEffect(() => {
            if (command.trim() && typeof CommandValidator !== 'undefined') {
                const validateCommand = async () => {
                    try {
                        const result = await CommandValidator.validate(selectedTool, command);
                        setValidationResult(result);
                    } catch (error) {
                        SafetyLayer.handleError(error, 'cli_command_panel');
                    }
                };
                
                const timeoutId = setTimeout(validateCommand, 500);
                return () => clearTimeout(timeoutId);
            } else {
                setValidationResult(null);
            }
        }, [command, selectedTool]);

        // Execute CLI command
        const executeCommand = async () => {
            if (!FeatureFlags.isEnabled('CLI_COMMAND_CONTROL')) {
                alert('CLI command control is disabled');
                return;
            }

            try {
                setIsExecuting(true);
                
                const result = await SafeCLIExecutor.executeCommand(selectedTool, command);
                
                // Refresh execution history
                loadExecutionHistory();
                
                // Clear command input on success
                if (result.success) {
                    setCommand('');
                    setValidationResult(null);
                }
                
                // Show result
                alert(result.success ? 'Command executed successfully' : `Execution failed: ${result.reason}`);
                
            } catch (error) {
                if (typeof reportError !== 'undefined') {
                    reportError(error, 'cli_command_panel');
                } else {
                    console.error('CLI Command Panel error:', error);
                }
                alert('Command execution error');
            } finally {
                setIsExecuting(false);
            }
        };

        // Get validation status styling
        const getValidationStyling = () => {
            if (!validationResult) return '';
            return validationResult.safe ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50';
        };

        // Get safe commands for selected tool
        const getSafeCommands = () => {
            if (typeof CommandValidator === 'undefined') return {};
            return CommandValidator.getSafeCommands(selectedTool);
        };

        return (
            <div data-name="cli-command-panel" data-file="components/config/CLICommandPanel.js" 
                 className="bg-white rounded-lg shadow-lg p-6">
                
                {/* Header */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">CLI Command Execution</h3>
                    <p className="text-sm text-gray-600">
                        Execute safe CLI commands with validation and monitoring
                    </p>
                </div>

                {/* Tool Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Tool
                    </label>
                    <select 
                        value={selectedTool}
                        onChange={(e) => setSelectedTool(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="srsran">srsRAN</option>
                        <option value="open5gs">Open5GS</option>
                        <option value="kamailio">Kamailio</option>
                    </select>
                </div>

                {/* Command Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Command
                    </label>
                    <input
                        type="text"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        placeholder="Enter CLI command..."
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${getValidationStyling()}`}
                        disabled={isExecuting}
                    />
                </div>

                {/* Validation Result */}
                {validationResult && (
                    <div className={`mb-4 p-3 rounded-md ${validationResult.safe ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                        <div className="flex items-center mb-2">
                            <span className={`text-sm font-medium ${validationResult.safe ? 'text-green-800' : 'text-red-800'}`}>
                                {validationResult.safe ? '✓ Command Valid' : '✗ Command Invalid'}
                            </span>
                            <span className="ml-2 text-xs text-gray-600">
                                Risk: {validationResult.riskLevel}
                            </span>
                        </div>
                        {validationResult.issues && validationResult.issues.length > 0 && (
                            <ul className="text-xs text-red-700 list-disc list-inside">
                                {validationResult.issues.map((issue, index) => (
                                    <li key={index}>{issue}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Execute Button */}
                <div className="mb-6">
                    <button
                        onClick={executeCommand}
                        disabled={!command.trim() || !validationResult?.safe || isExecuting || !FeatureFlags.isEnabled('CLI_COMMAND_CONTROL')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
                    >
                        {isExecuting ? 'Executing...' : 'Execute Command'}
                    </button>
                </div>

                {/* Execution History */}
                <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">Recent Executions</h4>
                    <div className="max-h-40 overflow-y-auto">
                        {executionHistory.length === 0 ? (
                            <p className="text-sm text-gray-500">No command executions yet</p>
                        ) : (
                            executionHistory.map((execution, index) => (
                                <div key={index} className="mb-2 p-2 bg-gray-50 rounded text-xs">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{execution.tool}: {execution.command}</span>
                                        <span className={`px-2 py-1 rounded text-xs ${execution.result?.success ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {execution.result?.success ? 'Success' : 'Failed'}
                                        </span>
                                    </div>
                                    <div className="text-gray-500 mt-1">
                                        {new Date(execution.startTime).toLocaleTimeString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );

    } catch (error) {
        console.error('CLICommandPanel component error:', error);
        return React.createElement('div', {
            className: "bg-red-50 border border-red-300 rounded-lg p-4"
        }, React.createElement('p', {
            className: "text-red-800"
        }, 'CLI Command Panel unavailable'));
    }
}

window.CLICommandPanel = CLICommandPanel;
