// Browser automation test using puppeteer-like approach
const { spawn } = require('child_process');
const http = require('http');

console.log('🤖 Starting automated browser test...');

// Function to check if server is running
function checkServer() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:8000', (res) => {
            resolve(true);
        });
        req.on('error', () => {
            resolve(false);
        });
    });
}

// Function to test the app using curl to simulate browser requests
async function testApp() {
    console.log('🌐 Testing app endpoints...');
    
    const { execSync } = require('child_process');
    
    // Test 1: Check if main page loads
    try {
        console.log('📄 Testing main page...');
        const mainPage = execSync('curl -s http://localhost:8000/public/index.html', { encoding: 'utf8' });
        
        if (!mainPage.includes('Cradle of Civilization')) {
            throw new Error('Main page not loading correctly');
        }
        console.log('✅ Main page loads');
        
        // Check for required scripts
        if (!mainPage.includes('src/js/core/app.js')) {
            throw new Error('Main app script not found');
        }
        console.log('✅ App script included');
        
        if (!mainPage.includes('src/js/core/demo-auth.js')) {
            throw new Error('Demo auth script not found');
        }
        console.log('✅ Demo auth script included');
        
    } catch (error) {
        console.log('❌ Main page test failed:', error.message);
        return false;
    }
    
    // Test 2: Check if JavaScript files are accessible
    try {
        console.log('\n📄 Testing JavaScript files...');
        
        const files = [
            'src/js/core/app.js',
            'src/js/core/demo-auth.js', 
            'src/js/services/game-service.js',
            'src/js/utils/constants.js',
            'src/js/utils/helpers.js'
        ];
        
        for (const file of files) {
            const content = execSync(`curl -s http://localhost:8000/${file}`, { encoding: 'utf8' });
            if (content.includes('404') || content.length < 100) {
                throw new Error(`File not accessible: ${file}`);
            }
            console.log(`✅ ${file} accessible`);
        }
        
    } catch (error) {
        console.log('❌ JavaScript files test failed:', error.message);
        return false;
    }
    
    // Test 3: Create a test page that actually runs the JavaScript
    try {
        console.log('\n🧪 Creating and testing interactive page...');
        
        const testPageContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Automated Test</title>
    <style>
        body { font-family: monospace; padding: 20px; }
        .log { margin: 5px 0; padding: 5px; border-radius: 3px; }
        .success { background: #d4edda; color: #155724; }
        .error { background: #f8d7da; color: #721c24; }
        .info { background: #d1ecf1; color: #0c5460; }
    </style>
</head>
<body>
    <h1>🤖 Automated Test Results</h1>
    <div id="results"></div>
    
    <script type="module">
        const results = document.getElementById('results');
        
        function log(type, message) {
            const div = document.createElement('div');
            div.className = 'log ' + type;
            div.textContent = new Date().toLocaleTimeString() + ' - ' + message;
            results.appendChild(div);
            console.log('[' + type.toUpperCase() + ']', message);
        }
        
        async function runTest() {
            log('info', 'Starting automated test...');
            
            try {
                // Test demo auth import and initialization
                log('info', 'Importing demo auth...');
                const { default: demoAuthService } = await import('./src/js/core/demo-auth.js');
                log('success', 'Demo auth imported successfully');
                
                demoAuthService.initialize();
                log('success', 'Demo auth initialized');
                
                // Test login
                log('info', 'Testing login...');
                const user = await demoAuthService.login('test@example.com', 'password123');
                log('success', 'Login successful: ' + user.email);
                
                // Test game service import
                log('info', 'Importing game service...');
                const { default: gameService } = await import('./src/js/services/game-service.js');
                log('success', 'Game service imported successfully');
                
                // Force demo mode
                gameService.demoMode = true;
                log('info', 'Demo mode forced to: ' + gameService.demoMode);
                
                // Test demo mode detection
                const isDemoMode = gameService.isDemoMode();
                log('info', 'isDemoMode() returns: ' + isDemoMode);
                
                // Test current user
                const currentUser = gameService.getCurrentUser();
                log('info', 'getCurrentUser() returns: ' + (currentUser ? currentUser.email : 'null'));
                
                // Test game creation
                log('info', 'Testing game creation...');
                const gameConfig = {
                    name: 'Auto Test Game',
                    description: 'Created by automated test',
                    maxPlayers: 7,
                    turnLengthHours: 48,
                    isPrivate: false,
                    allowSpectators: true
                };
                
                const gameId = await gameService.createGame(gameConfig);
                log('success', 'Game created successfully: ' + gameId);
                
                // Test game listing
                log('info', 'Testing game listing...');
                const availableGames = await gameService.getAvailableGames();
                log('info', 'Available games: ' + availableGames.length);
                
                const playerGames = await gameService.getPlayerGames();
                log('info', 'Player games: ' + playerGames.length);
                
                // Test game joining
                log('info', 'Testing game joining...');
                const { CIVILIZATIONS } = await import('./src/js/utils/constants.js');
                const firstCiv = Object.keys(CIVILIZATIONS)[0].toLowerCase();
                
                const joinResult = await gameService.joinGame(gameId, firstCiv);
                log('success', 'Game joined successfully: ' + joinResult.playerId);
                
                log('success', '🎉 ALL TESTS PASSED!');
                document.title = '✅ TESTS PASSED';
                
            } catch (error) {
                log('error', 'Test failed: ' + error.message);
                console.error('Full error:', error);
                document.title = '❌ TESTS FAILED';
            }
        }
        
        runTest();
    </script>
</body>
</html>`;
        
        const fs = require('fs');
        fs.writeFileSync('/Users/jeff/COC/auto_test.html', testPageContent);
        console.log('✅ Test page created');
        
    } catch (error) {
        console.log('❌ Test page creation failed:', error.message);
        return false;
    }
    
    return true;
}

// Main test function
async function main() {
    console.log('🔍 Checking if server is running...');
    
    const serverRunning = await checkServer();
    if (!serverRunning) {
        console.log('❌ Server not running on port 8000');
        console.log('💡 Please start server with: python3 -m http.server 8000');
        process.exit(1);
    }
    
    console.log('✅ Server is running');
    
    const success = await testApp();
    
    if (success) {
        console.log('\n🎯 Automated test page created!');
        console.log('📖 Open http://localhost:8000/auto_test.html to see live test results');
        console.log('👀 Check browser console for detailed logs');
    }
}

main();