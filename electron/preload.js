// Overview: Preload script for secure desktop integration
// Dependencies: electron | Defines: Desktop API bridge
// Zero-Risk: Secure context isolation, limited API exposure

const { contextBridge, ipcRenderer } = require('electron');

try {
    // Expose safe desktop APIs to renderer process
    contextBridge.exposeInMainWorld('electronAPI', {
        // Platform information
        platform: process.platform,
        isDesktop: true,
        
        // Safe desktop operations
        showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
        showOpenDialog: () => ipcRenderer.invoke('show-open-dialog'),
        writeFile: (filePath, data) => ipcRenderer.invoke('write-file', filePath, data),
        readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
        
        // Emergency procedures
        emergencyShutdown: () => ipcRenderer.invoke('emergency-shutdown'),
        
        // System information
        getSystemInfo: () => ipcRenderer.invoke('get-system-info'),
        
        // Safe notifications
        showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body),
        
        // Version information
        getAppVersion: () => ipcRenderer.invoke('get-app-version')
    });

    // Desktop-specific feature detection
    contextBridge.exposeInMainWorld('desktopFeatures', {
        fileSystem: true,
        notifications: true,
        systemInfo: true,
        emergencyControls: true
    });

} catch (error) {
    console.error('Preload script error:', error);
}
