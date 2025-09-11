// Overview: Desktop integration utilities
// Dependencies: electronAPI | Defines: Desktop-specific enhancements
// Zero-Risk: Optional enhancements that don't affect core functionality

class DesktopIntegration {
    constructor() {
        try {
            this.isDesktop = window.electronAPI?.isDesktop || false;
            this.setupDesktopFeatures();
        } catch (error) {
            console.error('Desktop integration error:', error);
        }
    }

    setupDesktopFeatures() {
        try {
            if (!this.isDesktop) return;

            // Add desktop-specific UI enhancements
            this.addDesktopMenuItems();
            this.setupFileOperations();
            this.enhanceEmergencyControls();
            this.addSystemInfoDisplay();

        } catch (error) {
            console.error('Desktop features setup error:', error);
        }
    }

    addDesktopMenuItems() {
        try {
            // Add desktop-specific menu items to existing UI
            const headerElement = document.querySelector('header');
            if (headerElement) {
                const desktopMenu = this.createDesktopMenu();
                headerElement.appendChild(desktopMenu);
            }
        } catch (error) {
            console.error('Desktop menu error:', error);
        }
    }

    createDesktopMenu() {
        try {
            const menuContainer = document.createElement('div');
            menuContainer.className = 'desktop-menu flex items-center space-x-2';
            
            // File operations button
            const fileBtn = document.createElement('button');
            fileBtn.className = 'px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700';
            fileBtn.textContent = 'File';
            fileBtn.onclick = () => this.showFileMenu();
            
            menuContainer.appendChild(fileBtn);
            return menuContainer;

        } catch (error) {
            console.error('Create desktop menu error:', error);
            return document.createElement('div');
        }
    }

    async showFileMenu() {
        try {
            const menu = [
                { label: 'Export Data', action: () => this.exportData() },
                { label: 'Import Logs', action: () => this.importLogs() },
                { label: 'Save Report', action: () => this.saveReport() }
            ];

            // Simple menu implementation
            const menuHtml = menu.map(item => 
                `<button onclick="desktopIntegration.${item.action.name}()" 
                         class="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    ${item.label}
                 </button>`
            ).join('');

            // Show menu (simplified implementation)
            console.log('Desktop file menu:', menu);

        } catch (error) {
            console.error('File menu error:', error);
        }
    }

    async exportData() {
        try {
            if (!window.electronAPI) return;

            const result = await window.electronAPI.showSaveDialog();
            if (!result.canceled) {
                const data = this.getCurrentPlatformData();
                await window.electronAPI.writeFile(result.filePath, JSON.stringify(data, null, 2));
                this.showDesktopNotification('Export Complete', 'Data exported successfully');
            }
        } catch (error) {
            console.error('Export data error:', error);
        }
    }

    async importLogs() {
        try {
            if (!window.electronAPI) return;

            const result = await window.electronAPI.showOpenDialog();
            if (!result.canceled && result.filePaths.length > 0) {
                for (const filePath of result.filePaths) {
                    const fileData = await window.electronAPI.readFile(filePath);
                    if (fileData.success) {
                        this.processImportedLog(fileData.data);
                    }
                }
                this.showDesktopNotification('Import Complete', 'Log files imported successfully');
            }
        } catch (error) {
            console.error('Import logs error:', error);
        }
    }

    getCurrentPlatformData() {
        try {
            // Get current platform state for export
            return {
                timestamp: new Date().toISOString(),
                platform: '5GLabX Desktop',
                version: '1.0.0',
                data: {
                    logs: [], // Get from current state
                    metrics: {}, // Get from current state
                    configuration: {} // Get from current state
                }
            };
        } catch (error) {
            console.error('Get platform data error:', error);
            return {};
        }
    }

    processImportedLog(logData) {
        try {
            // Process imported log data through existing log processor
            if (window.LogProcessor) {
                window.LogProcessor.processLogFile(logData, 'imported-file');
            }
        } catch (error) {
            console.error('Process imported log error:', error);
        }
    }

    async showDesktopNotification(title, message) {
        try {
            if (window.electronAPI) {
                await window.electronAPI.showNotification(title, message);
            }
        } catch (error) {
            console.error('Desktop notification error:', error);
        }
    }

    setupFileOperations() {
        try {
            // Enhance existing file operations with desktop capabilities
            if (this.isDesktop) {
                // Add desktop file handling to existing components
                console.log('Desktop file operations enabled');
            }
        } catch (error) {
            console.error('File operations setup error:', error);
        }
    }

    enhanceEmergencyControls() {
        try {
            // Add desktop-specific emergency controls
            if (this.isDesktop) {
                // Add keyboard shortcut for emergency shutdown
                document.addEventListener('keydown', (event) => {
                    if ((event.ctrlKey || event.metaKey) && event.key === 'e') {
                        this.triggerDesktopEmergencyShutdown();
                    }
                });
            }
        } catch (error) {
            console.error('Emergency controls enhancement error:', error);
        }
    }

    async triggerDesktopEmergencyShutdown() {
        try {
            // Trigger both web and desktop emergency procedures
            if (window.EmergencyResponseSystem) {
                window.EmergencyResponseSystem.manualEmergencyShutdown();
            }
            
            if (window.electronAPI) {
                await window.electronAPI.emergencyShutdown();
            }
        } catch (error) {
            console.error('Desktop emergency shutdown error:', error);
        }
    }

    addSystemInfoDisplay() {
        try {
            // Add system information to dashboard if available
            if (this.isDesktop && window.electronAPI) {
                window.electronAPI.getSystemInfo().then(info => {
                    console.log('Desktop system info:', info);
                });
            }
        } catch (error) {
            console.error('System info display error:', error);
        }
    }
}

// Initialize desktop integration when available
if (typeof window !== 'undefined') {
    window.desktopIntegration = new DesktopIntegration();
}
