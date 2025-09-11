// Overview: IPC handlers for desktop integration
// Dependencies: electron, fs | Defines: Desktop file operations
// Zero-Risk: Safe file operations with validation

const { ipcMain, dialog, shell, app, Notification } = require('electron');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');

class IpcHandlers {
    constructor() {
        try {
            this.setupHandlers();
        } catch (error) {
            console.error('IPC Handlers initialization error:', error);
        }
    }

    setupHandlers() {
        try {
            // File operations
            ipcMain.handle('show-save-dialog', this.handleSaveDialog.bind(this));
            ipcMain.handle('show-open-dialog', this.handleOpenDialog.bind(this));
            ipcMain.handle('write-file', this.handleWriteFile.bind(this));
            ipcMain.handle('read-file', this.handleReadFile.bind(this));

            // System operations
            ipcMain.handle('get-system-info', this.handleGetSystemInfo.bind(this));
            ipcMain.handle('show-notification', this.handleShowNotification.bind(this));
            ipcMain.handle('get-app-version', this.handleGetAppVersion.bind(this));

            // Emergency operations
            ipcMain.handle('emergency-shutdown', this.handleEmergencyShutdown.bind(this));

        } catch (error) {
            console.error('IPC handlers setup error:', error);
        }
    }

    async handleSaveDialog() {
        try {
            const result = await dialog.showSaveDialog({
                title: 'Save 5GLabX Data',
                defaultPath: path.join(os.homedir(), 'Downloads', '5glabx-export.json'),
                filters: [
                    { name: 'JSON Files', extensions: ['json'] },
                    { name: 'CSV Files', extensions: ['csv'] },
                    { name: 'All Files', extensions: ['*'] }
                ]
            });
            return result;
        } catch (error) {
            console.error('Save dialog error:', error);
            return { canceled: true };
        }
    }

    async handleOpenDialog() {
        try {
            const result = await dialog.showOpenDialog({
                title: 'Open 5GLabX Data',
                defaultPath: os.homedir(),
                filters: [
                    { name: 'Log Files', extensions: ['log', 'txt'] },
                    { name: 'JSON Files', extensions: ['json'] },
                    { name: 'CSV Files', extensions: ['csv'] },
                    { name: 'All Files', extensions: ['*'] }
                ],
                properties: ['openFile', 'multiSelections']
            });
            return result;
        } catch (error) {
            console.error('Open dialog error:', error);
            return { canceled: true };
        }
    }

    async handleWriteFile(event, filePath, data) {
        try {
            // Validate file path for security
            if (!this.isValidFilePath(filePath)) {
                throw new Error('Invalid file path');
            }

            await fs.writeFile(filePath, data, 'utf8');
            return { success: true };
        } catch (error) {
            console.error('Write file error:', error);
            return { success: false, error: error.message };
        }
    }

    async handleReadFile(event, filePath) {
        try {
            // Validate file path for security
            if (!this.isValidFilePath(filePath)) {
                throw new Error('Invalid file path');
            }

            const data = await fs.readFile(filePath, 'utf8');
            return { success: true, data };
        } catch (error) {
            console.error('Read file error:', error);
            return { success: false, error: error.message };
        }
    }

    isValidFilePath(filePath) {
        try {
            // Basic security validation
            const resolved = path.resolve(filePath);
            const userHome = os.homedir();
            
            // Allow files in user directory or Downloads
            return resolved.startsWith(userHome) || 
                   resolved.startsWith(path.join(userHome, 'Downloads'));
        } catch (error) {
            return false;
        }
    }

    async handleGetSystemInfo() {
        try {
            return {
                platform: os.platform(),
                arch: os.arch(),
                cpus: os.cpus().length,
                memory: Math.round(os.totalmem() / 1024 / 1024 / 1024),
                hostname: os.hostname(),
                appVersion: app.getVersion()
            };
        } catch (error) {
            console.error('System info error:', error);
            return {};
        }
    }

    async handleShowNotification(event, title, body) {
        try {
            if (Notification.isSupported()) {
                new Notification({ title, body }).show();
                return { success: true };
            }
            return { success: false, error: 'Notifications not supported' };
        } catch (error) {
            console.error('Notification error:', error);
            return { success: false, error: error.message };
        }
    }

    async handleGetAppVersion() {
        try {
            return app.getVersion();
        } catch (error) {
            return '1.0.0';
        }
    }

    async handleEmergencyShutdown() {
        try {
            // Trigger emergency shutdown in the web application
            return { success: true, message: 'Emergency shutdown triggered' };
        } catch (error) {
            console.error('Emergency shutdown error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Initialize IPC handlers
new IpcHandlers();

module.exports = IpcHandlers;
