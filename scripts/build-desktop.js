// Overview: Desktop application build script
// Dependencies: electron-builder | Defines: Build automation
// Zero-Risk: Optional build enhancement

const { build } = require('electron-builder');

async function buildDesktopApp() {
    try {
        console.log('Building 5GLabX Platform Desktop Application...');
        
        const config = {
            appId: 'com.5glabx.platform',
            productName: '5GLabX Platform',
            directories: {
                output: 'dist'
            },
            files: [
                '**/*',
                '!node_modules',
                '!dist',
                '!scripts',
                '!*.md'
            ],
            mac: {
                category: 'public.app-category.developer-tools'
            },
            win: {
                target: 'nsis'
            },
            linux: {
                target: 'AppImage',
                category: 'Development'
            }
        };

        await build({ config });
        console.log('Desktop application built successfully!');

    } catch (error) {
        console.error('Build failed:', error);
        process.exit(1);
    }
}

// Run build if called directly
if (require.main === module) {
    buildDesktopApp();
}

module.exports = { buildDesktopApp };
