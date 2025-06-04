// ===== GAME SERVICE =====

import { 
    GAME_CONFIG, 
    GAME_PHASES, 
    GAME_STATUS, 
    CIVILIZATIONS, 
    FIREBASE_COLLECTIONS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES 
} from '../utils/constants.js';
import { 
    showError, 
    showSuccess, 
    logError,
    generateId 
} from '../utils/helpers.js';
import firebaseService from './firebase-service.js';
import demoAuthService from '../core/demo-auth.js';
import GameEngine from '../core/game-engine.js';

/**
 * Game service for managing multiplayer Diplomacy games
 * Handles game creation, joining, state synchronization, and real-time updates
 */
export class GameService {
    constructor() {
        this.gameEngine = null;
        this.currentGame = null;
        this.currentPlayerId = null;
        this.gameListeners = new Map();
        this.isHost = false;
        this.lastSync = 0;
        this.demoMode = false;
        this.demoGames = new Map(); // Store demo games locally
        
        // Real-time listeners
        this.gameListener = null;
        this.ordersListener = null;
        this.playersListener = null;
    }

    /**
     * Check if we're in demo mode
     */
    isDemoMode() {
        // Always use demo mode if explicitly set
        if (this.demoMode) return true;
        
        // Check if Firebase is available without calling methods that might throw
        try {
            return !firebaseService.isAuthenticated();
        } catch (error) {
            // If Firebase throws an error, we're definitely in demo mode
            return true;
        }
    }

    /**
     * Get current user (from Firebase or demo auth)
     */
    getCurrentUser() {
        if (this.isDemoMode()) {
            return demoAuthService.getCurrentUser();
        }
        
        try {
            return firebaseService.getCurrentUser();
        } catch (error) {
            // If Firebase fails, fall back to demo auth
            return demoAuthService.getCurrentUser();
        }
    }

    /**
     * Create a new game
     */
    async createGame(gameConfig) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                throw new Error('User not authenticated');
            }

            const gameData = {
                name: gameConfig.name || 'New Game',
                description: gameConfig.description || '',
                status: GAME_STATUS.LOBBY,
                phase: GAME_PHASES.LOBBY,
                maxPlayers: gameConfig.maxPlayers || GAME_CONFIG.MAX_PLAYERS,
                currentPlayers: 0,
                turnLengthHours: gameConfig.turnLengthHours || GAME_CONFIG.DEFAULT_TURN_LENGTH_HOURS,
                isPrivate: gameConfig.isPrivate || false,
                password: gameConfig.password || null,
                hostId: currentUser.uid,
                players: [],
                availableCivilizations: Object.keys(CIVILIZATIONS).map(key => key.toLowerCase()),
                settings: {
                    allowSpectators: gameConfig.allowSpectators || false,
                    pauseOnPlayerLeave: gameConfig.pauseOnPlayerLeave || true,
                    autoResolve: gameConfig.autoResolve || false
                },
                createdAt: Date.now()
            };

            let gameId;
            
            if (this.isDemoMode()) {
                // Demo mode: store game locally
                gameId = 'demo_game_' + Date.now();
                gameData.id = gameId;
                this.demoGames.set(gameId, gameData);
                console.log('🎭 Demo: Created game locally:', gameId);
            } else {
                // Firebase mode: store in Firebase
                gameId = await firebaseService.createGame(gameData);
            }
            
            // Initialize game engine
            this.gameEngine = new GameEngine();
            this.currentGame = this.gameEngine.initializeGame({
                id: gameId,
                ...gameData
            });
            
            this.isHost = true;
            
            showSuccess(SUCCESS_MESSAGES.GAME_CREATED || 'Game created successfully!');
            return gameId;
            
        } catch (error) {
            logError('GameService.createGame', error);
            showError('Failed to create game: ' + (error.message || 'Unknown error'));
            throw error;
        }
    }

    /**
     * Join an existing game
     */
    async joinGame(gameId, civilization, password = null) {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) {
                throw new Error('User not authenticated');
            }

            let gameData;
            
            if (this.isDemoMode()) {
                // Demo mode: get game from local storage
                gameData = this.demoGames.get(gameId);
                if (!gameData) {
                    throw new Error('Game not found');
                }
            } else {
                // Firebase mode: get game from Firebase
                gameData = await firebaseService.getGame(gameId);
            }
            
            if (gameData.status !== GAME_STATUS.LOBBY) {
                throw new Error('Game has already started');
            }
            
            if (gameData.currentPlayers >= gameData.maxPlayers) {
                throw new Error(ERROR_MESSAGES.GAME_FULL || 'Game is full');
            }
            
            if (gameData.isPrivate && gameData.password !== password) {
                throw new Error('Invalid password');
            }
            
            // Check if civilization is available
            if (!gameData.availableCivilizations.includes(civilization)) {
                throw new Error('Civilization is not available');
            }
            
            let playerId;
            
            if (this.isDemoMode()) {
                // Demo mode: update game locally
                playerId = 'demo_player_' + Date.now();
                
                // Update game data locally
                gameData.currentPlayers += 1;
                gameData.availableCivilizations = gameData.availableCivilizations.filter(civ => civ !== civilization);
                gameData.players[playerId] = {
                    userId: currentUser.uid,
                    civilization: civilization,
                    joinedAt: Date.now(),
                    isReady: false
                };
                
                // Update in local storage
                this.demoGames.set(gameId, gameData);
                console.log('🎭 Demo: Joined game locally:', gameId, 'as', civilization);
            } else {
                // Firebase mode: join via Firebase
                playerId = await firebaseService.joinGame(gameId, civilization);
                
                // Update game data
                await firebaseService.updateGame(gameId, {
                    currentPlayers: gameData.currentPlayers + 1,
                    availableCivilizations: gameData.availableCivilizations.filter(civ => civ !== civilization),
                    [`players.${playerId}`]: {
                        userId: currentUser.uid,
                        civilization: civilization,
                        joinedAt: Date.now(),
                        isReady: false
                    }
                });
            }
            
            // Initialize game engine
            this.gameEngine = new GameEngine();
            this.currentGame = this.gameEngine.initializeGame(gameData);
            this.currentPlayerId = playerId;
            
            // Add player to local game state
            if (this.gameEngine.addPlayer) {
                this.gameEngine.addPlayer(playerId, civilization, currentUser.uid);
            }
            
            // Setup real-time listeners (skip in demo mode)
            if (!this.isDemoMode()) {
                this.setupGameListeners(gameId);
            }
            
            showSuccess(SUCCESS_MESSAGES.GAME_JOINED || 'Successfully joined game!');
            return { gameId, playerId };
            
        } catch (error) {
            logError('GameService.joinGame', error);
            showError(error.message || 'Failed to join game');
            throw error;
        }
    }

    /**
     * Start the game (host only)
     */
    async startGame() {
        if (!this.isHost || !this.currentGame) {
            throw new Error('Only the host can start the game');
        }
        
        try {
            const gameState = this.gameEngine.gameState;
            
            // Validate minimum players
            if (gameState.players.size < GAME_CONFIG.MIN_PLAYERS) {
                throw new Error(`Need at least ${GAME_CONFIG.MIN_PLAYERS} players to start`);
            }
            
            // Update game status
            await firebaseService.updateGame(this.currentGame.id, {
                status: GAME_STATUS.ACTIVE,
                phase: GAME_PHASES.SPRING_ORDERS,
                startedAt: Date.now(),
                currentTurn: 1,
                turnDeadline: Date.now() + (this.currentGame.turnLengthHours * 60 * 60 * 1000)
            });
            
            // Sync initial game state
            await this.syncGameState();
            
            showSuccess('Game started!');
            
        } catch (error) {
            logError('GameService.startGame', error);
            showError(error.message || 'Failed to start game');
            throw error;
        }
    }

    /**
     * Submit player orders
     */
    async submitOrders(orders) {
        if (!this.currentPlayerId || !this.gameEngine) {
            throw new Error('Not in a game');
        }
        
        try {
            // Submit orders to game engine
            this.gameEngine.submitOrders(this.currentPlayerId, orders);
            
            // Save orders to Firebase
            await firebaseService.submitOrders(this.currentGame.id, this.currentPlayerId, orders);
            
            // Check if all players have submitted orders
            if (this.gameEngine.allPlayersSubmitted() && this.isHost) {
                await this.processAutoResolution();
            }
            
            showSuccess(SUCCESS_MESSAGES.ORDER_SUBMITTED);
            
        } catch (error) {
            logError('GameService.submitOrders', error);
            showError(error.message || 'Failed to submit orders');
            throw error;
        }
    }

    /**
     * Process automatic turn resolution (host only)
     */
    async processAutoResolution() {
        if (!this.isHost || !this.gameEngine) return;
        
        try {
            console.log('Processing turn resolution...');
            
            // Resolve turn
            const newGameState = await this.gameEngine.resolveTurn();
            
            // Sync state to Firebase
            await this.syncGameState();
            
            // Set next turn deadline
            if (newGameState.phase !== GAME_PHASES.COMPLETED) {
                await firebaseService.updateGame(this.currentGame.id, {
                    turnDeadline: Date.now() + (this.currentGame.turnLengthHours * 60 * 60 * 1000)
                });
            }
            
            console.log('Turn resolution completed');
            
        } catch (error) {
            logError('GameService.processAutoResolution', error);
        }
    }

    /**
     * Sync local game state to Firebase
     */
    async syncGameState() {
        if (!this.gameEngine || !this.currentGame) return;
        
        try {
            const gameState = this.gameEngine.getGameState();
            
            await firebaseService.updateGame(this.currentGame.id, {
                phase: gameState.phase,
                season: gameState.season,
                year: gameState.year,
                turnNumber: gameState.turnNumber,
                gameState: {
                    players: gameState.players,
                    units: gameState.units,
                    supplyCenters: gameState.supplyCenters,
                    lastUpdated: gameState.lastUpdated
                }
            });
            
            this.lastSync = Date.now();
            
        } catch (error) {
            logError('GameService.syncGameState', error);
        }
    }

    /**
     * Setup real-time game listeners
     */
    setupGameListeners(gameId) {
        // Listen to game document changes
        this.gameListener = firebaseService.onGameChanged(gameId, (gameData) => {
            this.handleGameUpdate(gameData);
        });
        
        // Listen to orders collection changes
        this.ordersListener = firebaseService.onGameOrdersChanged?.(gameId, (orders) => {
            this.handleOrdersUpdate(orders);
        });
    }

    /**
     * Handle game update from Firebase
     */
    handleGameUpdate(gameData) {
        if (!gameData || !this.gameEngine) return;
        
        try {
            // Update local game state if remote is newer
            if (gameData.lastUpdated > this.lastSync) {
                this.updateLocalGameState(gameData);
            }
            
            // Trigger UI updates
            this.notifyGameStateChanged(gameData);
            
        } catch (error) {
            logError('GameService.handleGameUpdate', error);
        }
    }

    /**
     * Handle orders update from Firebase
     */
    handleOrdersUpdate(orders) {
        if (!this.gameEngine) return;
        
        try {
            // Update orders in game engine
            // This would involve reconciling remote orders with local state
            console.log('Orders updated:', orders);
            
        } catch (error) {
            logError('GameService.handleOrdersUpdate', error);
        }
    }

    /**
     * Update local game state from Firebase data
     */
    updateLocalGameState(gameData) {
        if (!this.gameEngine || !gameData.gameState) return;
        
        // Update game phase and metadata
        this.gameEngine.gameState.phase = gameData.phase;
        this.gameEngine.gameState.season = gameData.season;
        this.gameEngine.gameState.year = gameData.year;
        this.gameEngine.gameState.turnNumber = gameData.turnNumber;
        
        // Update players, units, and supply centers if provided
        if (gameData.gameState.players) {
            this.gameEngine.gameState.players.clear();
            gameData.gameState.players.forEach(player => {
                this.gameEngine.gameState.players.set(player.id, player);
            });
        }
        
        if (gameData.gameState.units) {
            this.gameEngine.gameState.units.clear();
            gameData.gameState.units.forEach(unit => {
                this.gameEngine.gameState.units.set(unit.id, unit);
            });
        }
        
        if (gameData.gameState.supplyCenters) {
            this.gameEngine.gameState.supplyCenters.clear();
            gameData.gameState.supplyCenters.forEach(sc => {
                this.gameEngine.gameState.supplyCenters.set(sc.id, sc);
            });
        }
        
        this.gameEngine.gameState.lastUpdated = gameData.gameState.lastUpdated;
    }

    /**
     * Get available games list
     */
    async getAvailableGames() {
        try {
            if (this.isDemoMode()) {
                // Demo mode: return local games
                const games = Array.from(this.demoGames.values());
                return games.filter(game => 
                    game.status === GAME_STATUS.LOBBY && 
                    game.currentPlayers < game.maxPlayers &&
                    !game.isPrivate
                );
            } else {
                // Firebase mode: query Firebase
                const games = await firebaseService.getAvailableGames?.() || [];
                return games.filter(game => 
                    game.status === GAME_STATUS.LOBBY && 
                    game.currentPlayers < game.maxPlayers
                );
            }
            
        } catch (error) {
            logError('GameService.getAvailableGames', error);
            return [];
        }
    }

    /**
     * Get player's active games
     */
    async getPlayerGames() {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser) return [];
            
            if (this.isDemoMode()) {
                // Demo mode: return games where user is a player
                const games = Array.from(this.demoGames.values());
                return games.filter(game => 
                    game.hostId === currentUser.uid ||
                    Object.values(game.players || {}).some(player => player.userId === currentUser.uid)
                );
            } else {
                // Firebase mode: query Firebase
                return await firebaseService.getUserGames(currentUser.uid);
            }
            
        } catch (error) {
            logError('GameService.getPlayerGames', error);
            return [];
        }
    }

    /**
     * Leave current game
     */
    async leaveGame() {
        if (!this.currentGame || !this.currentPlayerId) return;
        
        try {
            // Remove player from game
            await firebaseService.updateGame(this.currentGame.id, {
                [`players.${this.currentPlayerId}`]: null,
                currentPlayers: this.currentGame.currentPlayers - 1
            });
            
            // Cleanup listeners
            this.cleanup();
            
            showSuccess('Left game successfully');
            
        } catch (error) {
            logError('GameService.leaveGame', error);
            showError('Failed to leave game');
        }
    }

    /**
     * Send diplomatic message
     */
    async sendMessage(targetPlayerId, message) {
        if (!this.currentGame || !this.currentPlayerId) return;
        
        try {
            const messageData = {
                gameId: this.currentGame.id,
                fromPlayerId: this.currentPlayerId,
                toPlayerId: targetPlayerId || 'all',
                message: message,
                timestamp: Date.now(),
                turn: this.gameEngine?.gameState?.turnNumber || 1
            };
            
            // Save message to Firebase
            await firebaseService.sendMessage?.(messageData);
            
        } catch (error) {
            logError('GameService.sendMessage', error);
            showError('Failed to send message');
        }
    }

    /**
     * Get game messages
     */
    async getMessages(limit = 50) {
        if (!this.currentGame || !this.currentPlayerId) return [];
        
        try {
            return await firebaseService.getGameMessages?.(this.currentGame.id, this.currentPlayerId, limit) || [];
            
        } catch (error) {
            logError('GameService.getMessages', error);
            return [];
        }
    }

    /**
     * Add game state change listener
     */
    addGameStateListener(callback) {
        const listenerId = generateId();
        this.gameListeners.set(listenerId, callback);
        return () => this.gameListeners.delete(listenerId);
    }

    /**
     * Notify all listeners of game state change
     */
    notifyGameStateChanged(gameData) {
        for (const callback of this.gameListeners.values()) {
            try {
                callback(gameData);
            } catch (error) {
                logError('GameStateListener', error);
            }
        }
    }

    /**
     * Get current game state
     */
    getCurrentGameState() {
        return this.gameEngine?.getGameState() || null;
    }

    /**
     * Check if current user is game host
     */
    isGameHost() {
        return this.isHost;
    }

    /**
     * Get current player ID
     */
    getCurrentPlayerId() {
        return this.currentPlayerId;
    }

    /**
     * Validate game can be started
     */
    canStartGame() {
        if (!this.isHost || !this.gameEngine) return false;
        
        const gameState = this.gameEngine.gameState;
        return gameState.players.size >= GAME_CONFIG.MIN_PLAYERS &&
               gameState.players.size <= GAME_CONFIG.MAX_PLAYERS;
    }

    /**
     * Get game phase display name
     */
    getPhaseDisplayName(phase) {
        switch (phase) {
            case GAME_PHASES.LOBBY:
                return 'Waiting for Players';
            case GAME_PHASES.SPRING_ORDERS:
                return 'Spring Orders';
            case GAME_PHASES.SPRING_RESOLUTION:
                return 'Spring Resolution';
            case GAME_PHASES.FALL_ORDERS:
                return 'Fall Orders';
            case GAME_PHASES.FALL_RESOLUTION:
                return 'Fall Resolution';
            case GAME_PHASES.WINTER_ADJUSTMENTS:
                return 'Winter Adjustments';
            case GAME_PHASES.DIPLOMACY:
                return 'Diplomatic Phase';
            case GAME_PHASES.COMPLETED:
                return 'Game Completed';
            case GAME_PHASES.PAUSED:
                return 'Game Paused';
            default:
                return phase;
        }
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        // Remove Firebase listeners
        if (this.gameListener) {
            this.gameListener();
            this.gameListener = null;
        }
        
        if (this.ordersListener) {
            this.ordersListener();
            this.ordersListener = null;
        }
        
        if (this.playersListener) {
            this.playersListener();
            this.playersListener = null;
        }
        
        // Clear local state
        this.gameEngine = null;
        this.currentGame = null;
        this.currentPlayerId = null;
        this.isHost = false;
        this.gameListeners.clear();
    }

    /**
     * Destroy service
     */
    destroy() {
        this.cleanup();
    }
}

// Create singleton instance
const gameService = new GameService();
export default gameService;