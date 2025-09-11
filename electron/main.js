// Overview: Main Electron process for 5GLabX Platform Desktop
// Dependencies: electron | Defines: Desktop application wrapper
// Zero-Risk: Preserves all existing functionality, adds desktop capabilities

const { app, BrowserWindow, Menu, dialog, shell, ipcMain } = require('electron');
const path = require('path');

class MainProcess {
    constructor() {
        try {
            this.mainWindow = null;
            this.isDev = process.env.ELECTRON_IS_DEV === 'true';
            this.setupApp();
        } catch (error) {
            console.error('MainProcess initialization error:', error);
        }
    }

    setupApp() {
        try {
            // App event handlers
            app.whenReady().then(() => this.createWindow());
            app.on('window-all-closed', () => this.handleWindowsClosed());
            app.on('activate', () => this.handleActivate());

            // Setup IPC handlers
            this.setupIpcHandlers();

        } catch (error) {
            console.error('App setup error:', error);
        }
    }

    createWindow() {
        try {
            this.mainWindow = new BrowserWindow({
                width: 1400,
                height: 900,
                minWidth: 1200,
                minHeight: 800,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                    preload: path.join(__dirname, 'preload.js')
                },
                title: '5GLabX Platform - Desktop',
                show: false
            });

            // Load existing web application
            const indexPath = path.join(__dirname, '..', 'index.html');
            this.mainWindow.loadFile(indexPath);

            this.mainWindow.once('ready-to-show', () => {
                this.mainWindow.show();
                if (this.isDev) {
                    this.mainWindow.webContents.openDevTools();
                }
            });

            this.createMenu();
            this.mainWindow.on('closed', () => {
                this.mainWindow = null;
            });

        } catch (error) {
            console.error('Window creation error:', error);
        }
    }

    setupIpcHandlers() {
        try {
            // Load IPC handlers
            require('./ipc-handlers.js');
        } catch (error) {
            console.error('IPC handlers setup error:', error);
        }
    }

    createMenu() {
        try {
            const template = [
                {
                    label: 'File',
                    submenu: [
                        {
                            label: 'Emergency Shutdown',
                            accelerator: 'CmdOrCtrl+E',
                            click: () => this.triggerEmergencyShutdown()
                        },
                        { type: 'separator' },
                        { role: 'quit' }
                    ]
                },
                {
                    label: 'View',
                    submenu: [
                        { role: 'reload' },
                        { role: 'toggleDevTools' },
                        { type: 'separator' },
                        { role: 'togglefullscreen' }
                    ]
                }
            ];

            const menu = Menu.buildFromTemplate(template);
            Menu.setApplicationMenu(menu);

        } catch (error) {
            console.error('Menu creation error:', error);
        }
    }

    triggerEmergencyShutdown() {
        try {
            if (this.mainWindow) {
                this.mainWindow.webContents.send('emergency-shutdown');
            }
        } catch (error) {
            console.error('Emergency shutdown error:', error);
        }
    }

    handleWindowsClosed() {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    }

    handleActivate() {
        if (BrowserWindow.getAllWindows().length === 0) {
            this.createWindow();
        }
    }
}

// Initialize application
new MainProcess();
