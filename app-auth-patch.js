// ===== AUTHENTICATION PATCH FOR CRADLE OF CIVILIZATION =====
// This file contains the fixed authentication methods

// Import the auth fixes
import { handleDemoLogin, handleDemoRegister, initializeFirebaseWithFallback } from './src/js/core/auth-fixes.js';
import {
    showError,
    showSuccess
} from './src/js/utils/helpers.js';
import firebaseService from './src/js/services/firebase-service.js';

// Patch the main app class methods
export function patchCradleOfCivilizationApp(app) {
    console.log('🔧 Applying authentication fixes...');
    
    // Improved Firebase initialization
    app.initializeFirebase = async function() {
        const isFirebaseConnected = await initializeFirebaseWithFallback(
            firebaseService,
            () => this.setupDemoMode(),
            showSuccess
        );
        
        if (!isFirebaseConnected) {
            console.log('🎭 Running in demo mode - Firebase connection failed');
        }
    };
    
    // Improved demo login
    app.handleDemoLogin = function(email, password) {
        handleDemoLogin(
            email,
            password,
            this.demoUser,
            (user) => this.handleAuthStateChange(user),
            showError,
            showSuccess
        );
    };
    
    // Add demo registration method
    app.handleDemoRegister = function(email, displayName, password) {
        handleDemoRegister(
            email,
            displayName,
            password,
            this.demoUser,
            (user) => this.handleAuthStateChange(user),
            showError,
            showSuccess
        );
    };
    
    // Improved registration handler
    const originalHandleRegister = app.handleRegister;
    app.handleRegister = async function() {
        const email = document.getElementById('register-email')?.value;
        const displayName = document.getElementById('register-display-name')?.value;
        const password = document.getElementById('register-password')?.value;
        const confirmPassword = document.getElementById('register-confirm-password')?.value;
        
        console.log('🔧 DEBUG: Registration attempt started');
        
        if (!email || !displayName || !password || !confirmPassword) {
            showError('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }
        
        if (!email.includes('@')) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Check if we're in demo mode
        if (this.demoMode) {
            console.log('🎭 DEBUG: Using demo mode registration');
            this.handleDemoRegister(email, displayName, password);
            return;
        }
        
        try {
            await firebaseService.register(email, password, displayName);
            console.log('✅ DEBUG: Firebase registration successful');
        } catch (error) {
            console.error('❌ DEBUG: Firebase registration failed:', error);
        }
    };
    
    // Improved logout handler
    const originalLogout = app.logout;
    app.logout = async function() {
        try {
            if (this.demoMode) {
                console.log('🎭 DEBUG: Demo logout');
                this.handleAuthStateChange(null);
                showSuccess('Logged out successfully');
            } else {
                await firebaseService.logout();
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };
    
    console.log('✅ Authentication fixes applied successfully');
}

// Auto-apply patches when the main app is available
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait for the app to be created
        const checkForApp = setInterval(() => {
            if (window.cradleApp) {
                patchCradleOfCivilizationApp(window.cradleApp);
                clearInterval(checkForApp);
            }
        }, 100);
    });
}
