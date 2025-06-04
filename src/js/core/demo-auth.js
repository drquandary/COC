// ===== DEMO AUTHENTICATION SYSTEM =====
// Simple demo authentication that works without Firebase

import { showSuccess, showError } from '../utils/helpers.js';

class DemoAuthService {
    constructor() {
        this.currentUser = null;
        this.authListeners = [];
        this.isInitialized = false;
    }

    /**
     * Initialize demo auth service
     */
    initialize() {
        console.log('🎭 Demo Auth: Initializing demo authentication service');
        this.isInitialized = true;
        
        // Check for stored demo user
        const storedUser = localStorage.getItem('demo_user');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
                console.log('🎭 Demo Auth: Restored demo user from storage:', this.currentUser.email);
                setTimeout(() => this.notifyAuthListeners(this.currentUser), 100);
            } catch (error) {
                console.warn('🎭 Demo Auth: Failed to restore user from storage:', error);
                localStorage.removeItem('demo_user');
            }
        }
    }

    /**
     * Demo login - accepts any email/password
     */
    async login(email, password) {
        console.log('🎭 Demo Auth: Login attempt for:', email);
        
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        if (!email.includes('@')) {
            throw new Error('Please enter a valid email address');
        }

        // Create demo user
        this.currentUser = {
            uid: 'demo_' + Date.now(),
            email: email,
            displayName: email.split('@')[0], // Use part before @ as display name
            isDemo: true
        };

        // Store in localStorage
        localStorage.setItem('demo_user', JSON.stringify(this.currentUser));
        
        console.log('🎭 Demo Auth: Login successful for:', email);
        
        // Show success message
        showSuccess('Login successful! Welcome to Cradle of Civilization.');
        
        // Notify listeners
        setTimeout(() => {
            this.notifyAuthListeners(this.currentUser);
        }, 100);

        return this.currentUser;
    }

    /**
     * Demo registration - accepts any email/password/displayName
     */
    async register(email, password, displayName) {
        console.log('🎭 Demo Auth: Registration attempt for:', email);
        
        if (!email || !password || !displayName) {
            throw new Error('All fields are required');
        }

        if (!email.includes('@')) {
            throw new Error('Please enter a valid email address');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters long');
        }

        // Create demo user
        this.currentUser = {
            uid: 'demo_' + Date.now(),
            email: email,
            displayName: displayName,
            isDemo: true
        };

        // Store in localStorage
        localStorage.setItem('demo_user', JSON.stringify(this.currentUser));
        
        console.log('🎭 Demo Auth: Registration successful for:', email);
        
        // Show success message
        showSuccess('Registration successful! Welcome to Cradle of Civilization.');
        
        // Notify listeners
        setTimeout(() => {
            this.notifyAuthListeners(this.currentUser);
        }, 100);

        return this.currentUser;
    }

    /**
     * Demo logout
     */
    async logout() {
        console.log('🎭 Demo Auth: Logging out user:', this.currentUser?.email);
        
        this.currentUser = null;
        localStorage.removeItem('demo_user');
        
        // Notify listeners
        setTimeout(() => {
            this.notifyAuthListeners(null);
        }, 100);
    }

    /**
     * Add authentication state listener
     */
    onAuthStateChanged(callback) {
        this.authListeners.push(callback);
        
        // Call immediately with current state
        if (this.isInitialized) {
            setTimeout(() => callback(this.currentUser), 0);
        }
        
        return () => {
            const index = this.authListeners.indexOf(callback);
            if (index > -1) {
                this.authListeners.splice(index, 1);
            }
        };
    }

    /**
     * Notify all auth listeners
     */
    notifyAuthListeners(user) {
        console.log('🎭 Demo Auth: Notifying listeners of auth state change:', user?.email || 'logged out');
        this.authListeners.forEach(callback => {
            try {
                callback(user);
            } catch (error) {
                console.error('🎭 Demo Auth: Error in auth listener:', error);
            }
        });
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }
}

// Create and export singleton instance
const demoAuthService = new DemoAuthService();
export default demoAuthService;