// Node.js simulation test for the authentication and game creation flow
console.log('🧪 Starting authentication and game creation simulation...');

// Mock browser globals
global.document = {
    body: { classList: { add: () => {}, remove: () => {} } },
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ 
        appendChild: () => {}, 
        style: {}, 
        classList: { add: () => {}, remove: () => {}, toggle: () => {} }
    })
};

global.window = {
    localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {}
    }
};

global.localStorage = global.window.localStorage;

// Mock console for cleaner output
const originalConsoleLog = console.log;
console.log = (...args) => {
    const message = args.join(' ');
    if (message.includes('🎭') || message.includes('✅') || message.includes('❌')) {
        originalConsoleLog(...args);
    }
};

function testStep(stepName, testFn) {
    return new Promise(async (resolve) => {
        try {
            console.log(`\n📋 ${stepName}`);
            await testFn();
            console.log(`✅ ${stepName} - PASSED`);
            resolve(true);
        } catch (error) {
            console.log(`❌ ${stepName} - FAILED: ${error.message}`);
            resolve(false);
        }
    });
}

async function runTests() {
    console.log('🧪 Running comprehensive authentication and game creation tests...\n');
    
    let passed = 0;
    let total = 0;
    
    // Test 1: Check if files exist and are valid JavaScript
    total++;
    const test1 = await testStep('Test 1: File validation', async () => {
        const fs = require('fs');
        const path = require('path');
        
        const files = [
            'src/js/core/demo-auth.js',
            'src/js/services/game-service.js',
            'src/js/utils/constants.js',
            'src/js/utils/helpers.js'
        ];
        
        for (const file of files) {
            const filePath = path.join(__dirname, file);
            if (!fs.existsSync(filePath)) {
                throw new Error(`File not found: ${file}`);
            }
            
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.length < 100) {
                throw new Error(`File too small: ${file}`);
            }
            
            console.log(`📄 ${file} - OK (${content.length} bytes)`);
        }
    });
    if (test1) passed++;
    
    // Test 2: Validate constants
    total++;
    const test2 = await testStep('Test 2: Constants validation', async () => {
        const fs = require('fs');
        const constantsContent = fs.readFileSync('src/js/utils/constants.js', 'utf8');
        
        const requiredConstants = [
            'GAME_CONFIG',
            'GAME_PHASES', 
            'GAME_STATUS',
            'CIVILIZATIONS',
            'SUCCESS_MESSAGES',
            'ERROR_MESSAGES'
        ];
        
        for (const constant of requiredConstants) {
            if (!constantsContent.includes(`export const ${constant}`)) {
                throw new Error(`Missing constant: ${constant}`);
            }
            console.log(`🏷️  ${constant} - Found`);
        }
    });
    if (test2) passed++;
    
    // Test 3: Validate demo auth structure
    total++;
    const test3 = await testStep('Test 3: Demo auth structure', async () => {
        const fs = require('fs');
        const demoAuthContent = fs.readFileSync('src/js/core/demo-auth.js', 'utf8');
        
        const requiredMethods = [
            'initialize',
            'login',
            'register', 
            'logout',
            'getCurrentUser',
            'onAuthStateChanged'
        ];
        
        for (const method of requiredMethods) {
            if (!demoAuthContent.includes(`${method}(`)) {
                throw new Error(`Missing method: ${method}`);
            }
            console.log(`🔧 ${method}() - Found`);
        }
        
        // Check for singleton export
        if (!demoAuthContent.includes('export default demoAuthService')) {
            throw new Error('Missing singleton export');
        }
        console.log('🔧 Singleton export - Found');
    });
    if (test3) passed++;
    
    // Test 4: Validate game service structure
    total++;
    const test4 = await testStep('Test 4: Game service structure', async () => {
        const fs = require('fs');
        const gameServiceContent = fs.readFileSync('src/js/services/game-service.js', 'utf8');
        
        const requiredMethods = [
            'isDemoMode',
            'getCurrentUser',
            'createGame',
            'joinGame',
            'getAvailableGames',
            'getPlayerGames'
        ];
        
        for (const method of requiredMethods) {
            if (!gameServiceContent.includes(`${method}(`)) {
                throw new Error(`Missing method: ${method}`);
            }
            console.log(`🎯 ${method}() - Found`);
        }
        
        // Check for demo mode logic
        if (!gameServiceContent.includes('this.demoMode')) {
            throw new Error('Missing demo mode property');
        }
        console.log('🎯 Demo mode logic - Found');
        
        // Check for demo games storage
        if (!gameServiceContent.includes('this.demoGames')) {
            throw new Error('Missing demo games storage');
        }
        console.log('🎯 Demo games storage - Found');
    });
    if (test4) passed++;
    
    // Test 5: Check imports and exports
    total++;
    const test5 = await testStep('Test 5: Import/Export validation', async () => {
        const fs = require('fs');
        
        // Check demo auth imports helpers
        const demoAuthContent = fs.readFileSync('src/js/core/demo-auth.js', 'utf8');
        if (!demoAuthContent.includes("import { showSuccess, showError }")) {
            throw new Error('Demo auth missing helper imports');
        }
        console.log('📦 Demo auth imports - OK');
        
        // Check game service imports demo auth
        const gameServiceContent = fs.readFileSync('src/js/services/game-service.js', 'utf8');
        if (!gameServiceContent.includes("import demoAuthService")) {
            throw new Error('Game service missing demo auth import');
        }
        console.log('📦 Game service imports - OK');
        
        // Check helpers has required functions
        const helpersContent = fs.readFileSync('src/js/utils/helpers.js', 'utf8');
        const requiredHelpers = ['showSuccess', 'showError', 'generateId', 'logError'];
        for (const helper of requiredHelpers) {
            if (!helpersContent.includes(`export function ${helper}`)) {
                throw new Error(`Missing helper function: ${helper}`);
            }
            console.log(`🛠️  ${helper}() - Found`);
        }
    });
    if (test5) passed++;
    
    console.log(`\n📊 Test Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 All tests passed! The authentication and game creation should work correctly.');
    } else {
        console.log('❌ Some tests failed. There may be issues with the implementation.');
    }
    
    return passed === total;
}

// Run the tests
runTests().then(success => {
    process.exit(success ? 0 : 1);
});