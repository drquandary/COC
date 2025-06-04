// ===== FIREBASE SERVICE =====

import { 
    FIREBASE_COLLECTIONS, 
    ERROR_MESSAGES, 
    SUCCESS_MESSAGES,
    STORAGE_KEYS 
} from '../utils/constants.js';
import { 
    showError, 
    showSuccess, 
    setInStorage, 
    getFromStorage, 
    removeFromStorage,
    retryWithBackoff,
    logError 
} from '../utils/helpers.js';

class FirebaseService {
    constructor() {
        this.app = null;
        this.auth = null;
        this.db = null;
        this.currentUser = null;
        this.authListeners = [];
        this.gameListeners = new Map();
        this.isInitialized = false;
    }

    /**
     * Initialize Firebase SDK
     * @param {Object} config - Firebase configuration
     */
    async initialize(config) {
        try {
            // Dynamic import of Firebase modules
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js');
            const { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js');
            const { getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, orderBy, limit, onSnapshot, addDoc, arrayUnion, arrayRemove, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.1.0/firebase-firestore.js');

            // Store Firebase modules
            this.firebase = {
                initializeApp,
                getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile,
                getFirestore, doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, orderBy, limit, onSnapshot, addDoc, arrayUnion, arrayRemove, serverTimestamp
            };

            // Initialize Firebase app
            this.app = this.firebase.initializeApp(config);
            this.auth = this.firebase.getAuth(this.app);
            this.db = this.firebase.getFirestore(this.app);

            // Set up auth state listener
            this.firebase.onAuthStateChanged(this.auth, (user) => {
                this.currentUser = user;
                this.notifyAuthListeners(user);
                
                if (user) {
                    setInStorage(STORAGE_KEYS.AUTH_STATE, {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName
                    });
                } else {
                    removeFromStorage(STORAGE_KEYS.AUTH_STATE);
                }
            });

            this.isInitialized = true;
            console.log('Firebase initialized successfully');
            
        } catch (error) {
            logError('FirebaseService.initialize', error);
            throw new Error('Failed to initialize Firebase');
        }
    }

    /**
     * Check if Firebase is initialized
     */
    checkInitialized() {
        if (!this.isInitialized) {
            throw new Error('Firebase not initialized. Call initialize() first.');
        }
    }

    // ===== AUTHENTICATION METHODS =====

    /**
     * Register new user
     * @param {string} email - User email
     * @param {string} password - User password
     * @param {string} displayName - User display name
     * @returns {Promise<Object>} User object
     */
    async register(email, password, displayName) {
        this.checkInitialized();
        
        try {
            const userCredential = await this.firebase.createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            // Update user profile
            await this.firebase.updateProfile(user, { displayName });

            // Create user document in Firestore
            await this.createUser({
                uid: user.uid,
                email: user.email,
                displayName: displayName,
                emailNotifications: true,
                pushNotifications: true,
                createdAt: this.firebase.serverTimestamp(),
                lastLogin: this.firebase.serverTimestamp(),
                gamesPlayed: 0,
                gamesWon: 0
            });

            showSuccess(SUCCESS_MESSAGES.REGISTRATION_SUCCESS);
            return user;

        } catch (error) {
            logError('FirebaseService.register', error);
            showError(this.getAuthErrorMessage(error));
            throw error;
        }
    }

    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} User object
     */
    async login(email, password) {
        this.checkInitialized();
        
        try {
            const userCredential = await this.firebase.signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;

            // Update last login
            await this.updateUser(user.uid, {
                lastLogin: this.firebase.serverTimestamp()
            });

            showSuccess(SUCCESS_MESSAGES.LOGIN_SUCCESS);
            return user;

        } catch (error) {
            logError('FirebaseService.login', error);
            showError(this.getAuthErrorMessage(error));
            throw error;
        }
    }

    /**
     * Logout user
     */
    async logout() {
        this.checkInitialized();
        
        try {
            await this.firebase.signOut(this.auth);
            
            // Clear all listeners
            this.gameListeners.forEach(unsubscribe => unsubscribe());
            this.gameListeners.clear();
            
            // Clear local storage
            removeFromStorage(STORAGE_KEYS.AUTH_STATE);
            removeFromStorage(STORAGE_KEYS.GAME_CACHE);

        } catch (error) {
            logError('FirebaseService.logout', error);
            showError('Failed to logout');
            throw error;
        }
    }

    /**
     * Add authentication state listener
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    onAuthStateChanged(callback) {
        this.authListeners.push(callback);
        
        // Call immediately with current state
        callback(this.currentUser);
        
        return () => {
            const index = this.authListeners.indexOf(callback);
            if (index > -1) {
                this.authListeners.splice(index, 1);
            }
        };
    }

    /**
     * Notify auth listeners
     * @param {Object} user - User object
     */
    notifyAuthListeners(user) {
        this.authListeners.forEach(callback => {
            try {
                callback(user);
            } catch (error) {
                logError('AuthListener', error);
            }
        });
    }

    /**
     * Get user-friendly auth error message
     * @param {Error} error - Firebase auth error
     * @returns {string}
     */
    getAuthErrorMessage(error) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'Invalid email or password';
            case 'auth/email-already-in-use':
                return 'Email already registered';
            case 'auth/weak-password':
                return 'Password is too weak';
            case 'auth/invalid-email':
                return 'Invalid email address';
            case 'auth/network-request-failed':
                return 'Network error. Please check your connection.';
            default:
                return ERROR_MESSAGES.LOGIN_FAILED;
        }
    }

    // ===== USER MANAGEMENT =====

    /**
     * Create user document
     * @param {Object} userData - User data
     */
    async createUser(userData) {
        this.checkInitialized();
        
        try {
            const userRef = this.firebase.doc(this.db, FIREBASE_COLLECTIONS.USERS, userData.uid);
            await this.firebase.setDoc(userRef, userData);
        } catch (error) {
            logError('FirebaseService.createUser', error);
            throw error;
        }
    }

    /**
     * Get user document
     * @param {string} uid - User ID
     * @returns {Promise<Object>} User data
     */
    async getUser(uid) {
        this.checkInitialized();
        
        try {
            const userRef = this.firebase.doc(this.db, FIREBASE_COLLECTIONS.USERS, uid);
            const userSnap = await this.firebase.getDoc(userRef);
            
            if (userSnap.exists()) {
                return { id: userSnap.id, ...userSnap.data() };
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            logError('FirebaseService.getUser', error);
            throw error;
        }
    }

    /**
     * Update user document
     * @param {string} uid - User ID
     * @param {Object} updates - Data to update
     */
    async updateUser(uid, updates) {
        this.checkInitialized();
        
        try {
            const userRef = this.firebase.doc(this.db, FIREBASE_COLLECTIONS.USERS, uid);
            await this.firebase.updateDoc(userRef, updates);
        } catch (error) {
            logError('FirebaseService.updateUser', error);
            throw error;
        }
    }

    // ===== GAME MANAGEMENT =====

    /**
     * Create new game
     * @param {Object} gameData - Game data
     * @returns {Promise<string>} Game ID
     */
    async createGame(gameData) {
        this.checkInitialized();
        
        try {
            const gamesRef = this.firebase.collection(this.db, FIREBASE_COLLECTIONS.GAMES);
            const gameRef = await this.firebase.addDoc(gamesRef, {
                ...gameData,
                createdAt: this.firebase.serverTimestamp(),
                lastUpdated: this.firebase.serverTimestamp()
            });
            
            return gameRef.id;
        } catch (error) {
            logError('FirebaseService.createGame', error);
            throw error;
        }
    }

    /**
     * Get game document
     * @param {string} gameId - Game ID
     * @returns {Promise<Object>} Game data
     */
    async getGame(gameId) {
        this.checkInitialized();
        
        try {
            const gameRef = this.firebase.doc(this.db, FIREBASE_COLLECTIONS.GAMES, gameId);
            const gameSnap = await this.firebase.getDoc(gameRef);
            
            if (gameSnap.exists()) {
                return { id: gameSnap.id, ...gameSnap.data() };
            } else {
                throw new Error(ERROR_MESSAGES.GAME_NOT_FOUND);
            }
        } catch (error) {
            logError('FirebaseService.getGame', error);
            throw error;
        }
    }

    /**
     * Update game document
     * @param {string} gameId - Game ID
     * @param {Object} updates - Data to update
     */
    async updateGame(gameId, updates) {
        this.checkInitialized();
        
        try {
            const gameRef = this.firebase.doc(this.db, FIREBASE_COLLECTIONS.GAMES, gameId);
            await this.firebase.updateDoc(gameRef, {
                ...updates,
                lastUpdated: this.firebase.serverTimestamp()
            });
        } catch (error) {
            logError('FirebaseService.updateGame', error);
            throw error;
        }
    }

    /**
     * Listen to game changes
     * @param {string} gameId - Game ID
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    onGameChanged(gameId, callback) {
        this.checkInitialized();
        
        const gameRef = this.firebase.doc(this.db, FIREBASE_COLLECTIONS.GAMES, gameId);
        const unsubscribe = this.firebase.onSnapshot(gameRef, (doc) => {
            if (doc.exists()) {
                callback({ id: doc.id, ...doc.data() });
            } else {
                callback(null);
            }
        }, (error) => {
            logError('Game listener', error);
            callback(null);
        });
        
        this.gameListeners.set(gameId, unsubscribe);
        return unsubscribe;
    }

    /**
     * Get user's games
     * @param {string} uid - User ID
     * @returns {Promise<Array>} User's games
     */
    async getUserGames(uid) {
        this.checkInitialized();
        
        try {
            const playersRef = this.firebase.collection(this.db, FIREBASE_COLLECTIONS.PLAYERS);
            const q = this.firebase.query(
                playersRef,
                this.firebase.where('userId', '==', uid),
                this.firebase.orderBy('joinedAt', 'desc')
            );
            
            const querySnap = await this.firebase.getDocs(q);
            const gameIds = querySnap.docs.map(doc => doc.data().gameId);
            
            if (gameIds.length === 0) return [];
            
            // Get game details
            const games = await Promise.all(
                gameIds.map(gameId => this.getGame(gameId))
            );
            
            return games.filter(game => game !== null);
        } catch (error) {
            logError('FirebaseService.getUserGames', error);
            throw error;
        }
    }

    // ===== PLAYER MANAGEMENT =====

    /**
     * Join game as player
     * @param {string} gameId - Game ID
     * @param {string} civilization - Civilization ID
     * @returns {Promise<string>} Player ID
     */
    async joinGame(gameId, civilization) {
        this.checkInitialized();
        
        if (!this.currentUser) {
            throw new Error('User not authenticated');
        }
        
        try {
            const playersRef = this.firebase.collection(this.db, FIREBASE_COLLECTIONS.PLAYERS);
            const playerRef = await this.firebase.addDoc(playersRef, {
                gameId,
                userId: this.currentUser.uid,
                civilization,
                hasSubmittedOrders: false,
                isEliminated: false,
                supplyCenters: [],
                units: [],
                supplyCenterCount: 0,
                joinedAt: this.firebase.serverTimestamp()
            });
            
            return playerRef.id;
        } catch (error) {
            logError('FirebaseService.joinGame', error);
            throw error;
        }
    }

    /**
     * Get game players
     * @param {string} gameId - Game ID
     * @returns {Promise<Array>} Game players
     */
    async getGamePlayers(gameId) {
        this.checkInitialized();
        
        try {
            const playersRef = this.firebase.collection(this.db, FIREBASE_COLLECTIONS.PLAYERS);
            const q = this.firebase.query(
                playersRef,
                this.firebase.where('gameId', '==', gameId)
            );
            
            const querySnap = await this.firebase.getDocs(q);
            return querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            logError('FirebaseService.getGamePlayers', error);
            throw error;
        }
    }

    // ===== ORDER MANAGEMENT =====

    /**
     * Submit orders
     * @param {string} gameId - Game ID
     * @param {string} playerId - Player ID
     * @param {Array} orders - Array of orders
     */
    async submitOrders(gameId, playerId, orders) {
        this.checkInitialized();
        
        try {
            // Delete existing orders for this player and turn
            const existingOrdersRef = this.firebase.collection(this.db, FIREBASE_COLLECTIONS.ORDERS);
            const q = this.firebase.query(
                existingOrdersRef,
                this.firebase.where('gameId', '==', gameId),
                this.firebase.where('playerId', '==', playerId)
            );
            
            const querySnap = await this.firebase.getDocs(q);
            const deletePromises = querySnap.docs.map(doc => this.firebase.deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            
            // Add new orders
            const ordersRef = this.firebase.collection(this.db, FIREBASE_COLLECTIONS.ORDERS);
            const addPromises = orders.map(order => 
                this.firebase.addDoc(ordersRef, {
                    ...order,
                    gameId,
                    playerId,
                    submittedAt: this.firebase.serverTimestamp()
                })
            );
            await Promise.all(addPromises);
            
            // Update player status
            const playerRef = this.firebase.doc(this.db, FIREBASE_COLLECTIONS.PLAYERS, playerId);
            await this.firebase.updateDoc(playerRef, {
                hasSubmittedOrders: true
            });
            
            showSuccess(SUCCESS_MESSAGES.ORDER_SUBMITTED);
        } catch (error) {
            logError('FirebaseService.submitOrders', error);
            throw error;
        }
    }

    /**
     * Get game orders
     * @param {string} gameId - Game ID
     * @returns {Promise<Array>} Game orders
     */
    async getGameOrders(gameId) {
        this.checkInitialized();
        
        try {
            const ordersRef = this.firebase.collection(this.db, FIREBASE_COLLECTIONS.ORDERS);
            const q = this.firebase.query(
                ordersRef,
                this.firebase.where('gameId', '==', gameId),
                this.firebase.orderBy('submittedAt', 'desc')
            );
            
            const querySnap = await this.firebase.getDocs(q);
            return querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            logError('FirebaseService.getGameOrders', error);
            throw error;
        }
    }

    // ===== UTILITY METHODS =====

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this.currentUser;
    }

    /**
     * Get current user
     * @returns {Object|null}
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Test Firebase connection
     * @returns {Promise<boolean>}
     */
    async testConnection() {
        try {
            this.checkInitialized();
            
            // Try to read from a test document
            const testRef = this.firebase.doc(this.db, 'test', 'connection');
            await this.firebase.getDoc(testRef);
            
            return true;
        } catch (error) {
            logError('FirebaseService.testConnection', error);
            return false;
        }
    }
}

// Create singleton instance
export const firebaseService = new FirebaseService();

// Export default for easy importing
export default firebaseService;