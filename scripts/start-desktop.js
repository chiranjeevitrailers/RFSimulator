// Overview: Development start script for desktop app
// Dependencies: electron | Defines: Development workflow
// Zero-Risk: Development helper script

const { spawn } = require('child_process');
const path = require('path');

function startDesktopDev() {
    try {
        console.log('Starting 5GLabX Platform in desktop development mode...');
        
        // Set development environment
        process.env.ELECTRON_IS_DEV = 'true';
        
        // Start Electron with development flags
        const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron');
        const appPath = path.join(__dirname, '..');
        
        const electronProcess = spawn(electronPath, [appPath, '--dev'], {
            stdio: 'inherit',
            env: { ...process.env, ELECTRON_IS_DEV: 'true' }
        });

        electronProcess.on('close', (code) => {
            console.log(`Desktop application exited with code ${code}`);
        });

        electronProcess.on('error', (error) => {
            console.error('Failed to start desktop application:', error);
        });

        // Handle process termination
        process.on('SIGINT', () => {
            electronProcess.kill();
            process.exit(0);
        });

    } catch (error) {
        console.error('Start desktop development error:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    startDesktopDev();
}

module.exports = { startDesktopDev };
