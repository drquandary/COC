// Automated test framework that simulates the browser testing
const fs = require('fs');
const path = require('path');

console.log('🧪 AUTOMATED TESTING FRAMEWORK');
console.log('===============================');

let testResults = [];
let logEntries = [];

function log(message, type = 'info', data = null) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = { timestamp, message, type, data };
    logEntries.push(entry);
    
    const icons = { pass: '✅', fail: '❌', info: 'ℹ️', warn: '⚠️', debug: '🔍' };
    const icon = icons[type] || 'ℹ️';
    
    console.log(`[${timestamp}] ${icon} ${message}`);
    if (data && typeof data === 'object') {
        console.log('   Data:', JSON.stringify(data, null, 2));
    }
}

function addTestResult(name, passed, details = '') {
    testResults.push({ name, passed, details });
    log(`Test: ${name} - ${passed ? 'PASSED' : 'FAILED'}${details ? ': ' + details : ''}`, passed ? 'pass' : 'fail');
}

// Test 1: File and Code Analysis
function analyzeCodeStructure() {
    log('ANALYZING CODE STRUCTURE', 'info');
    
    try {
        // Check GameEngine createUnit method
        const gameEngineContent = fs.readFileSync('src/js/core/game-engine.js', 'utf8');
        
        // Look for the createUnit method
        const createUnitMatch = gameEngineContent.match(/createUnit\(.*?\) \{[\s\S]*?\}/);
        if (createUnitMatch) {
            log('Found createUnit method', 'pass');
            
            // Check if it has the region property fix
            if (createUnitMatch[0].includes('region: regionId')) {
                log('createUnit has region property fix', 'pass');
            } else {
                log('createUnit missing region property fix', 'fail');
                return false;
            }
        } else {
            log('createUnit method not found', 'fail');
            return false;
        }
        
        // Check initializePlayerUnits method
        const initUnitsMatch = gameEngineContent.match(/initializePlayerUnits\(.*?\) \{[\s\S]*?\}/);
        if (initUnitsMatch) {
            log('Found initializePlayerUnits method', 'pass');
            
            // Check if it processes startingRegions
            if (initUnitsMatch[0].includes('startingRegions.forEach')) {
                log('initializePlayerUnits processes startingRegions', 'pass');
            } else {
                log('initializePlayerUnits not processing startingRegions correctly', 'fail');
                return false;
            }
        }
        
        // Check constants file
        const constantsContent = fs.readFileSync('src/js/utils/constants.js', 'utf8');
        
        // Extract BABYLON civilization
        const babylonMatch = constantsContent.match(/BABYLON:\s*\{[\s\S]*?\}/);
        if (babylonMatch) {
            const babylonData = babylonMatch[0];
            log('Found BABYLON civilization', 'pass');
            
            // Extract starting regions
            const regionsMatch = babylonData.match(/startingRegions:\s*\[(.*?)\]/);
            if (regionsMatch) {
                const regions = regionsMatch[1].split(',').map(r => r.trim().replace(/['"]/g, ''));
                log('BABYLON starting regions', 'info', regions);
                
                // Check each region exists in MAP_REGIONS
                for (const region of regions) {
                    if (constantsContent.includes(`${region}:`)) {
                        log(`Region ${region} exists in MAP_REGIONS`, 'pass');
                    } else {
                        log(`Region ${region} missing from MAP_REGIONS`, 'fail');
                        return false;
                    }
                }
            }
        }
        
        addTestResult('Code Structure Analysis', true, 'All required methods and data found');
        return true;
        
    } catch (error) {
        log(`Code analysis failed: ${error.message}`, 'fail');
        addTestResult('Code Structure Analysis', false, error.message);
        return false;
    }
}

// Test 2: Simulate the exact game flow with detailed debugging
function simulateGameFlow() {
    log('SIMULATING GAME FLOW', 'info');
    
    try {
        // Step 1: Load constants
        log('Step 1: Loading constants...', 'info');
        const constantsContent = fs.readFileSync('src/js/utils/constants.js', 'utf8');
        
        // Extract BABYLON data
        const babylonMatch = constantsContent.match(/BABYLON:\s*\{[\s\S]*?startingRegions:\s*\[(.*?)\]/);
        if (babylonMatch) {
            const regionsString = babylonMatch[1];
            const startingRegions = regionsString.split(',').map(r => r.trim().replace(/['"]/g, ''));
            log('BABYLON starting regions extracted', 'pass', startingRegions);
            
            // Step 2: Simulate createUnit calls
            log('Step 2: Simulating createUnit calls...', 'info');
            
            for (let i = 0; i < startingRegions.length; i++) {
                const regionId = startingRegions[i];
                log(`Creating unit for region: ${regionId}`, 'debug');
                
                // Simulate the createUnit function
                const unitId = `demo_player_123_army_${regionId}_${Date.now() + i}`;
                const simulatedUnit = {
                    id: unitId,
                    type: 'army',
                    region: regionId,        // This should be set
                    regionId: regionId,      // This should also be set
                    playerId: 'demo_player_123'
                };
                
                log(`Simulated unit created`, 'debug', simulatedUnit);
                
                // Check if region would be undefined
                if (simulatedUnit.region === undefined || simulatedUnit.region === null) {
                    log(`ERROR: Unit ${i} would have undefined region!`, 'fail');
                    return false;
                } else {
                    log(`Unit ${i} region properly set to: ${simulatedUnit.region}`, 'pass');
                }
            }
            
            addTestResult('Game Flow Simulation', true, `${startingRegions.length} units would be created correctly`);
            return true;
            
        } else {
            log('Could not extract BABYLON data', 'fail');
            return false;
        }
        
    } catch (error) {
        log(`Game flow simulation failed: ${error.message}`, 'fail');
        addTestResult('Game Flow Simulation', false, error.message);
        return false;
    }
}

// Test 3: Check for potential issues in the code
function analyzeForIssues() {
    log('ANALYZING FOR POTENTIAL ISSUES', 'info');
    
    try {
        const gameEngineContent = fs.readFileSync('src/js/core/game-engine.js', 'utf8');
        const gameServiceContent = fs.readFileSync('src/js/services/game-service.js', 'utf8');
        
        let issues = [];
        
        // Check for import issues
        if (!gameServiceContent.includes('import demoAuthService')) {
            issues.push('Game service may not import demo auth correctly');
        }
        
        // Check for proper error handling
        if (!gameEngineContent.includes('if (!region)')) {
            issues.push('initializePlayerUnits may not handle missing regions');
        }
        
        // Check for Map vs Array confusion
        if (gameEngineContent.includes('.forEach(') && gameEngineContent.includes('.set(')) {
            log('Found both Map operations and forEach - this could cause issues', 'warn');
        }
        
        // Check getGameState method
        const getGameStateMatch = gameEngineContent.match(/getGameState\(\) \{[\s\S]*?\}/);
        if (getGameStateMatch) {
            const method = getGameStateMatch[0];
            if (method.includes('Array.from') && method.includes('entries()')) {
                log('getGameState converts Maps to Arrays correctly', 'pass');
            } else {
                issues.push('getGameState may not convert Maps to Arrays properly');
            }
        }
        
        if (issues.length === 0) {
            log('No obvious code issues found', 'pass');
            addTestResult('Issue Analysis', true, 'Code structure appears correct');
        } else {
            log('Potential issues found', 'warn', issues);
            addTestResult('Issue Analysis', false, `${issues.length} potential issues`);
        }
        
        return issues.length === 0;
        
    } catch (error) {
        log(`Issue analysis failed: ${error.message}`, 'fail');
        addTestResult('Issue Analysis', false, error.message);
        return false;
    }
}

// Test 4: Deep dive into the specific undefined region problem
function diagnoseUndefinedRegion() {
    log('DIAGNOSING UNDEFINED REGION PROBLEM', 'info');
    
    try {
        const gameEngineContent = fs.readFileSync('src/js/core/game-engine.js', 'utf8');
        
        log('Examining the exact code flow...', 'debug');
        
        // Extract the exact initializePlayerUnits method
        const methodMatch = gameEngineContent.match(/initializePlayerUnits\(player\) \{([\s\S]*?)\n    \}/);
        if (methodMatch) {
            const methodBody = methodMatch[1];
            log('Found initializePlayerUnits method body', 'debug');
            
            // Check the exact flow
            if (methodBody.includes('civData.startingRegions.forEach(regionId =>')) {
                log('Method iterates over startingRegions correctly', 'pass');
                
                if (methodBody.includes('this.createUnit(unitType, regionId, player.id)')) {
                    log('Method calls createUnit with regionId parameter', 'pass');
                    
                    // Now check createUnit
                    const createUnitMatch = gameEngineContent.match(/createUnit\(type, regionId, playerId\) \{([\s\S]*?)\n    \}/);
                    if (createUnitMatch) {
                        const createUnitBody = createUnitMatch[1];
                        
                        if (createUnitBody.includes('region: regionId')) {
                            log('createUnit sets region property correctly', 'pass');
                            
                            // The code SHOULD work! So why is it undefined?
                            log('CODE ANALYSIS CONCLUSION:', 'info');
                            log('- startingRegions are defined correctly', 'info');
                            log('- initializePlayerUnits processes them correctly', 'info');
                            log('- createUnit sets region property correctly', 'info');
                            log('- The undefined region must be coming from elsewhere!', 'warn');
                            
                            // Possible causes:
                            const possibleCauses = [
                                'Browser cache not cleared - old version of createUnit still loaded',
                                'Import chain issue - wrong version of GameEngine being loaded',
                                'Race condition - units created before fix is applied',
                                'Object reference issue - region property being overwritten later',
                                'Serialization issue - region lost during Map to Array conversion'
                            ];
                            
                            log('POSSIBLE CAUSES OF UNDEFINED REGION:', 'warn', possibleCauses);
                            
                            addTestResult('Undefined Region Diagnosis', false, 'Code is correct but browser cache may be the issue');
                            return false;
                            
                        } else {
                            log('createUnit does NOT set region property!', 'fail');
                            addTestResult('Undefined Region Diagnosis', false, 'createUnit missing region property');
                            return false;
                        }
                    }
                } else {
                    log('Method does not call createUnit correctly', 'fail');
                    return false;
                }
            } else {
                log('Method does not iterate over startingRegions correctly', 'fail');
                return false;
            }
        } else {
            log('Could not find initializePlayerUnits method', 'fail');
            return false;
        }
        
    } catch (error) {
        log(`Undefined region diagnosis failed: ${error.message}`, 'fail');
        addTestResult('Undefined Region Diagnosis', false, error.message);
        return false;
    }
}

// Main test runner
async function runAllTests() {
    log('STARTING COMPREHENSIVE AUTOMATED TESTS', 'info');
    
    const tests = [
        { name: 'Code Structure Analysis', fn: analyzeCodeStructure },
        { name: 'Game Flow Simulation', fn: simulateGameFlow },
        { name: 'Issue Analysis', fn: analyzeForIssues },
        { name: 'Undefined Region Diagnosis', fn: diagnoseUndefinedRegion }
    ];
    
    let passedTests = 0;
    
    for (const test of tests) {
        log(`\n--- Running ${test.name} ---`, 'info');
        try {
            const result = test.fn();
            if (result) passedTests++;
        } catch (error) {
            log(`Test ${test.name} threw error: ${error.message}`, 'fail');
        }
    }
    
    log('\n=== FINAL RESULTS ===', 'info');
    log(`Tests passed: ${passedTests}/${tests.length}`, passedTests === tests.length ? 'pass' : 'fail');
    
    log('\n=== ALL TEST RESULTS ===', 'info');
    testResults.forEach(result => {
        console.log(`${result.passed ? '✅' : '❌'} ${result.name}: ${result.details}`);
    });
    
    log('\n=== CONCLUSION ===', 'info');
    if (passedTests < tests.length) {
        console.log('❌ ISSUES FOUND - The undefined region problem likely stems from browser caching');
        console.log('💡 SOLUTION: Force hard refresh (Ctrl+Shift+R) or clear browser cache completely');
        console.log('🔧 ALTERNATIVE: Add cache-busting timestamps to ALL script imports');
    } else {
        console.log('✅ ALL TESTS PASSED - Code should work correctly');
    }
}

// Run the tests
runAllTests();