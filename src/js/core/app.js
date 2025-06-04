// ===== MAIN APPLICATION CONTROLLER =====

import {
    ROUTES,
    STORAGE_KEYS,
    DEFAULT_PREFERENCES,
    UI_CONSTANTS,
    CIVILIZATIONS
} from '../utils/constants.js';
import {
    $,
    $$,
    addEventListenerWithCleanup,
    getFromStorage,
    setInStorage,
    showError,
    showSuccess,
    fadeIn,
    fadeOut,
    isMobile,
    debounce
} from '../utils/helpers.js';
import firebaseService from '../services/firebase-service.js';
import demoAuthService from './demo-auth.js';
import gameService from '../services/game-service.js';
import GameBoard from '../components/game-board.js';
import GameUI from '../components/game-ui.js';

class CradleOfCivilizationApp {
    constructor() {
        this.currentUser = null;
        this.currentRoute = ROUTES.AUTH;
        this.currentGame = null;
        this.eventCleanupFunctions = [];
        this.isInitialized = false;
        
        // Game components
        this.gameBoard = null;
        this.gameUI = null;
        
        // Bind methods
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
        this.handleResize = debounce(this.handleResize.bind(this), 300);
    }

    /**
     * Initialize the application
     */
    async initialize() {
        try {
            console.log('Initializing Cradle of Civilization...');
            
            // Show loading screen
            this.showLoadingScreen();
            
            // Initialize Firebase
            await this.initializeFirebase();
            
            // Setup UI
            this.setupUI();
            
            // Setup routing
            this.setupRouting();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Apply theme
            this.applyTheme();
            
            // Check initial auth state
            this.setupAuthStateListener();
            
            this.isInitialized = true;
            console.log('Application initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showInitializationError(error);
        }
    }

    /**
     * Initialize authentication service
     */
    async initializeFirebase() {
        console.log('🔧 DEBUG: Starting authentication initialization...');
        
        // Always use demo mode for now since Firebase requires real credentials
        console.log('🎭 DEBUG: Using demo authentication service');
        
        // Initialize demo auth service
        demoAuthService.initialize();
        this.authService = demoAuthService;
        
        // Set demo mode flag for compatibility with inline scripts and game service
        this.demoMode = true;
        
        // Also set demo mode on game service
        gameService.demoMode = true;
        
        // Debug logging
        console.log('🔧 DEBUG: Game service demo mode set to:', gameService.demoMode);
        console.log('🔧 DEBUG: Game service isDemoMode():', gameService.isDemoMode());
        console.log('🔧 DEBUG: Current user from game service:', gameService.getCurrentUser());
        
        console.log('✅ DEBUG: Demo authentication service initialized successfully');
        console.log('✅ DEBUG: Demo mode flag set to:', this.demoMode);
    }

    /**
     * Setup UI components
     */
    setupUI() {
        // Apply mobile-specific classes
        if (isMobile()) {
            document.body.classList.add('mobile');
        }
        
        // Setup navigation
        this.setupNavigation();
        
        // Setup auth forms
        this.setupAuthForms();
        
        // Setup dashboard
        this.setupDashboard();
        
        // Setup game screens
        this.setupGameScreens();
        
        // Hide loading screen and show app
        this.hideLoadingScreen();
    }

    /**
     * Setup navigation components
     */
    setupNavigation() {
        const menuToggle = $('#menu-toggle');
        const sideNav = $('#side-nav');
        const navClose = $('#nav-close');
        const navLinks = $$('.nav-menu a[data-route]');
        
        // Menu toggle
        if (menuToggle && sideNav) {
            this.addEventListenerWithCleanup(menuToggle, 'click', () => {
                sideNav.classList.toggle('open');
            });
            
            this.addEventListenerWithCleanup(navClose, 'click', () => {
                sideNav.classList.remove('open');
            });
            
            // Close nav when clicking outside
            this.addEventListenerWithCleanup(document, 'click', (e) => {
                if (!sideNav.contains(e.target) && !menuToggle.contains(e.target)) {
                    sideNav.classList.remove('open');
                }
            });
        }
        
        // Navigation links
        navLinks.forEach(link => {
            this.addEventListenerWithCleanup(link, 'click', (e) => {
                e.preventDefault();
                const route = link.dataset.route;
                this.navigateTo(route);
                sideNav?.classList.remove('open');
            });
        });
        
        // Logout button
        const logoutBtn = $('#logout-btn');
        if (logoutBtn) {
            this.addEventListenerWithCleanup(logoutBtn, 'click', () => {
                this.logout();
            });
        }
    }

    /**
     * Setup authentication forms
     */
    setupAuthForms() {
        console.log('🔧 DEBUG: Setting up authentication forms...');
        
        const loginTab = $('#login-tab');
        const registerTab = $('#register-tab');
        const loginForm = $('#login-form');
        const registerForm = $('#register-form');
        const loginButton = loginForm?.querySelector('button[type="submit"]');
        
        console.log('🔧 DEBUG: Form elements found:', {
            loginTab: !!loginTab,
            registerTab: !!registerTab,
            loginForm: !!loginForm,
            registerForm: !!registerForm,
            loginButton: !!loginButton
        });
        
        // Tab switching
        if (loginTab && registerTab) {
            this.addEventListenerWithCleanup(loginTab, 'click', () => {
                this.switchAuthTab('login');
            });
            
            this.addEventListenerWithCleanup(registerTab, 'click', () => {
                this.switchAuthTab('register');
            });
        }
        
        // Form submissions
        if (loginForm) {
            console.log('🔧 DEBUG: Adding login form submit listener...');
            this.addEventListenerWithCleanup(loginForm, 'submit', (e) => {
                console.log('🔧 DEBUG: Login form submit event triggered');
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        if (registerForm) {
            console.log('🔧 DEBUG: Adding register form submit listener...');
            this.addEventListenerWithCleanup(registerForm, 'submit', (e) => {
                console.log('🔧 DEBUG: Register form submit event triggered');
                e.preventDefault();
                this.handleRegister();
            });
        }
    }

    /**
     * Setup dashboard components
     */
    setupDashboard() {
        const actionButtons = $$('.action-buttons .btn[data-route]');
        
        actionButtons.forEach(button => {
            this.addEventListenerWithCleanup(button, 'click', () => {
                const route = button.dataset.route;
                this.navigateTo(route);
            });
        });
    }

    /**
     * Setup game-related screens
     */
    setupGameScreens() {
        this.setupCreateGameScreen();
        this.setupGamesListScreen();
        this.setupGameScreen();
    }

    /**
     * Setup create game screen
     */
    setupCreateGameScreen() {
        const createGameForm = $('#create-game-form');
        if (createGameForm) {
            this.addEventListenerWithCleanup(createGameForm, 'submit', async (e) => {
                e.preventDefault();
                await this.handleCreateGame();
            });
        }

        // Populate civilization options
        const civSelect = $('#civilization-select');
        if (civSelect) {
            civSelect.innerHTML = '<option value="">Select a civilization...</option>';
            Object.entries(CIVILIZATIONS).forEach(([key, civ]) => {
                const option = document.createElement('option');
                option.value = key.toLowerCase();
                option.textContent = civ.name;
                civSelect.appendChild(option);
            });
        }
    }

    /**
     * Setup games list screen
     */
    setupGamesListScreen() {
        const refreshBtn = $('#refresh-games-btn');
        if (refreshBtn) {
            this.addEventListenerWithCleanup(refreshBtn, 'click', () => {
                this.loadGamesList();
            });
        }
    }

    /**
     * Setup main game screen
     */
    setupGameScreen() {
        const gameContainer = $('#game-container');
        const gameBoardContainer = $('#game-board-container');
        const gameUIContainer = $('#game-ui-container');

        if (gameContainer && gameBoardContainer && gameUIContainer) {
            // Game components will be initialized when entering a game
        }
    }

    /**
     * Setup routing system
     */
    setupRouting() {
        // Handle browser back/forward
        this.addEventListenerWithCleanup(window, 'popstate', () => {
            this.handleRouteChange();
        });
        
        // Initial route
        this.handleRouteChange();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Window resize
        this.addEventListenerWithCleanup(window, 'resize', this.handleResize);
        
        // Online/offline status
        this.addEventListenerWithCleanup(window, 'online', () => {
            showSuccess('Connection restored');
        });
        
        this.addEventListenerWithCleanup(window, 'offline', () => {
            showError('Connection lost. Some features may not work.');
        });
        
        // Prevent zoom on double tap (iOS)
        if (isMobile()) {
            let lastTouchEnd = 0;
            this.addEventListenerWithCleanup(document, 'touchend', (e) => {
                const now = Date.now();
                if (now - lastTouchEnd <= 300) {
                    e.preventDefault();
                }
                lastTouchEnd = now;
            }, { passive: false });
        }
    }

    /**
     * Setup authentication state listener
     */
    setupAuthStateListener() {
        console.log('🔧 DEBUG: Setting up auth state listener');
        this.authService.onAuthStateChanged((user) => {
            console.log('🔧 DEBUG: Auth state changed:', user ? user.email : 'logged out');
            this.handleAuthStateChange(user);
        });
    }

    /**
     * Handle authentication state changes
     */
    handleAuthStateChange(user) {
        this.currentUser = user;
        
        if (user) {
            // User is logged in
            console.log('User logged in:', user.email);
            
            if (this.currentRoute === ROUTES.AUTH) {
                this.navigateTo(ROUTES.DASHBOARD);
            }
            
            this.updateUserInterface(true);
            this.loadUserData();
            
        } else {
            // User is logged out
            console.log('User logged out');
            
            this.navigateTo(ROUTES.AUTH);
            this.updateUserInterface(false);
            this.clearUserData();
        }
    }

    /**
     * Handle route changes
     */
    handleRouteChange() {
        const hash = window.location.hash.slice(1);
        const route = hash || (this.currentUser ? ROUTES.DASHBOARD : ROUTES.AUTH);
        
        this.showScreen(route);
        this.currentRoute = route;
        this.updateActiveNavLink(route);
    }

    /**
     * Navigate to a specific route
     */
    navigateTo(route) {
        if (!this.currentUser && route !== ROUTES.AUTH) {
            route = ROUTES.AUTH;
        }
        
        window.location.hash = route;
        this.handleRouteChange();
    }

    /**
     * Show specific screen
     */
    showScreen(route) {
        const screens = $$('.screen');
        screens.forEach(screen => screen.classList.add('hidden'));
        
        let targetScreen;
        switch (route) {
            case ROUTES.AUTH:
                targetScreen = $('#auth-screen');
                break;
            case ROUTES.DASHBOARD:
                targetScreen = $('#dashboard-screen');
                this.loadDashboardData();
                break;
            case ROUTES.GAMES:
                targetScreen = $('#games-screen');
                this.loadGamesList();
                break;
            case ROUTES.CREATE_GAME:
                targetScreen = $('#create-game-screen');
                break;
            case ROUTES.GAME:
                targetScreen = $('#game-screen');
                this.initializeGameScreen();
                break;
            default:
                targetScreen = $('#dashboard-screen');
        }
        
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
        }
    }

    /**
     * Update active navigation link
     */
    updateActiveNavLink(route) {
        const navLinks = $$('.nav-menu a[data-route]');
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.route === route);
        });
    }

    /**
     * Switch authentication tab
     */
    switchAuthTab(tab) {
        const loginTab = $('#login-tab');
        const registerTab = $('#register-tab');
        const loginForm = $('#login-form');
        const registerForm = $('#register-form');
        
        if (tab === 'login') {
            loginTab?.classList.add('active');
            registerTab?.classList.remove('active');
            loginForm?.classList.remove('hidden');
            registerForm?.classList.add('hidden');
        } else {
            loginTab?.classList.remove('active');
            registerTab?.classList.add('active');
            loginForm?.classList.add('hidden');
            registerForm?.classList.remove('hidden');
        }
    }

    /**
     * Handle login form submission
     */
    async handleLogin() {
        console.log('🔧 DEBUG: Login attempt started');
        console.log('🔧 DEBUG: Auth service available:', !!this.authService);
        console.log('🔧 DEBUG: Demo mode flag:', this.demoMode);
        
        const email = $('#login-email')?.value?.trim();
        const password = $('#login-password')?.value?.trim();
        
        console.log('🔧 DEBUG: Login form values:', {
            hasEmail: !!email,
            hasPassword: !!password,
            emailValue: email,
            emailElement: !!$('#login-email'),
            passwordElement: !!$('#login-password')
        });
        
        if (!email || !password) {
            console.log('❌ DEBUG: Missing email or password');
            showError('Please enter email and password');
            return;
        }
        
        if (!email.includes('@')) {
            showError('Please enter a valid email address');
            return;
        }
        
        if (password.length < 6) {
            showError('Password must be at least 6 characters long');
            return;
        }
        
        try {
            console.log('🔧 DEBUG: Attempting demo login...');
            const user = await this.authService.login(email, password);
            console.log('✅ DEBUG: Login successful:', user);
            // Don't show success message here, demo auth service will handle it
        } catch (error) {
            console.error('❌ DEBUG: Login failed:', error);
            showError(error.message || 'Login failed. Please try again.');
        }
    }

    

    /**
     * Handle register form submission
     */
    async handleRegister() {
        console.log('🔧 DEBUG: Registration attempt started');
        
        const email = $('#register-email')?.value?.trim();
        const displayName = $('#register-display-name')?.value?.trim();
        const password = $('#register-password')?.value?.trim();
        const confirmPassword = $('#register-confirm-password')?.value?.trim();
        
        console.log('🔧 DEBUG: Registration form values:', {
            hasEmail: !!email,
            hasDisplayName: !!displayName,
            hasPassword: !!password,
            hasConfirmPassword: !!confirmPassword,
            emailValue: email
        });
        
        if (!email || !displayName || !password || !confirmPassword) {
            console.log('❌ DEBUG: Missing required fields');
            showError('Please fill in all fields');
            return;
        }
        
        if (password !== confirmPassword) {
            console.log('❌ DEBUG: Passwords do not match');
            showError('Passwords do not match');
            return;
        }
        
        if (!email.includes('@')) {
            console.log('❌ DEBUG: Invalid email format');
            showError('Please enter a valid email address');
            return;
        }
        
        if (password.length < 6) {
            console.log('❌ DEBUG: Password too short');
            showError('Password must be at least 6 characters long');
            return;
        }
        
        try {
            console.log('🔧 DEBUG: Attempting demo registration...');
            const user = await this.authService.register(email, password, displayName);
            console.log('✅ DEBUG: Registration successful:', user);
            // Don't show success message here, demo auth service will handle it
        } catch (error) {
            console.error('❌ DEBUG: Registration failed:', error);
            showError(error.message || 'Registration failed. Please try again.');
        }
    }

    /**
     * Handle logout
     */
    async logout() {
        try {
            console.log('🔧 DEBUG: Attempting logout...');
            await this.authService.logout();
            console.log('✅ DEBUG: Logout successful');
        } catch (error) {
            console.error('❌ DEBUG: Logout failed:', error);
        }
    }

    /**
     * Update user interface based on auth state
     */
    updateUserInterface(isLoggedIn) {
        const appHeader = $('.app-header');
        const sideNav = $('#side-nav');
        
        if (isLoggedIn) {
            appHeader?.classList.remove('hidden');
            sideNav?.classList.remove('hidden');
        } else {
            appHeader?.classList.add('hidden');
            sideNav?.classList.add('hidden');
        }
    }

    /**
     * Load user data
     */
    async loadUserData() {
        if (!this.currentUser) return;
        
        try {
            // Load user preferences
            const preferences = getFromStorage(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_PREFERENCES);
            this.applyUserPreferences(preferences);
            
            // Load user's games (skip in demo mode since game service handles this)
            if (!this.demoMode && firebaseService.isAuthenticated()) {
                const games = await firebaseService.getUserGames(this.currentUser.uid);
                this.updateGamesList(games);
            }
            
        } catch (error) {
            console.error('Failed to load user data:', error);
        }
    }

    /**
     * Clear user data
     */
    clearUserData() {
        this.currentGame = null;
        
        // Clear cached data
        const gamesList = $('#games-list');
        if (gamesList) {
            gamesList.innerHTML = '';
        }
    }

    /**
     * Load dashboard data
     */
    async loadDashboardData() {
        if (!this.currentUser) return;
        
        try {
            // Update dashboard stats (demo data for now)
            this.updateDashboardStats({
                activeGames: 2,
                pendingTurns: 1,
                totalGames: 5,
                winRate: 60
            });
            
            // Load recent activity
            this.loadRecentActivity();
            
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        }
    }

    /**
     * Handle create game form submission
     */
    async handleCreateGame() {
        const formData = new FormData($('#create-game-form'));
        const gameConfig = {
            name: formData.get('game-name'),
            description: formData.get('description'),
            maxPlayers: parseInt(formData.get('max-players')),
            turnLengthHours: parseInt(formData.get('turn-length')),
            isPrivate: formData.get('is-private') === 'on',
            password: formData.get('password'),
            allowSpectators: formData.get('allow-spectators') === 'on'
        };

        try {
            const gameId = await gameService.createGame(gameConfig);
            
            // Join the game with selected civilization
            const civilization = formData.get('civilization');
            if (civilization) {
                await gameService.joinGame(gameId, civilization);
            }
            
            // Navigate to the game
            this.navigateTo(`${ROUTES.GAME}/${gameId}`);
            
        } catch (error) {
            console.error('Failed to create game:', error);
            showError('Failed to create game: ' + (error.message || 'Unknown error'));
        }
    }

    /**
     * Load and display games list
     */
    async loadGamesList() {
        const gamesList = $('#games-list');
        if (!gamesList) return;

        try {
            gamesList.innerHTML = '<div class="loading">Loading games...</div>';
            
            const [availableGames, playerGames] = await Promise.all([
                gameService.getAvailableGames(),
                gameService.getPlayerGames()
            ]);

            gamesList.innerHTML = '';

            // Add player's active games
            if (playerGames.length > 0) {
                const playerSection = document.createElement('div');
                playerSection.className = 'games-section';
                playerSection.innerHTML = '<h3>Your Games</h3>';
                
                playerGames.forEach(game => {
                    const gameCard = this.createGameCard(game, true);
                    playerSection.appendChild(gameCard);
                });
                
                gamesList.appendChild(playerSection);
            }

            // Add available games
            if (availableGames.length > 0) {
                const availableSection = document.createElement('div');
                availableSection.className = 'games-section';
                availableSection.innerHTML = '<h3>Available Games</h3>';
                
                availableGames.forEach(game => {
                    const gameCard = this.createGameCard(game, false);
                    availableSection.appendChild(gameCard);
                });
                
                gamesList.appendChild(availableSection);
            }

            if (availableGames.length === 0 && playerGames.length === 0) {
                gamesList.innerHTML = '<div class="no-games">No games available. Create one!</div>';
            }

        } catch (error) {
            console.error('Failed to load games:', error);
            gamesList.innerHTML = '<div class="error">Failed to load games</div>';
        }
    }

    /**
     * Create game card element
     */
    createGameCard(game, isPlayerGame) {
        const card = document.createElement('div');
        card.className = 'game-card';
        
        const statusClass = game.status === 'active' ? 'active' : 'lobby';
        
        card.innerHTML = `
            <div class="game-card-header">
                <h4 class="game-name">${game.name}</h4>
                <span class="game-status ${statusClass}">${game.status}</span>
            </div>
            <div class="game-info">
                <div class="game-players">${game.currentPlayers}/${game.maxPlayers} players</div>
                <div class="game-phase">${gameService.getPhaseDisplayName(game.phase)}</div>
            </div>
            <div class="game-actions">
                ${isPlayerGame ?
                    `<button class="btn btn-primary" onclick="cradleApp.joinGame('${game.id}')">Continue</button>` :
                    `<button class="btn btn-secondary" onclick="cradleApp.showJoinGameDialog('${game.id}')">Join</button>`
                }
            </div>
        `;
        
        return card;
    }

    /**
     * Show join game dialog
     */
    showJoinGameDialog(gameId) {
        // This would show a modal to select civilization and enter password if needed
        // For now, we'll use a simple prompt
        const civilizations = Object.keys(CIVILIZATIONS).map(key => key.toLowerCase());
        const selectedCiv = prompt(`Select civilization: ${civilizations.join(', ')}`);
        
        if (selectedCiv && civilizations.includes(selectedCiv)) {
            this.joinGame(gameId, selectedCiv);
        }
    }

    /**
     * Join a game
     */
    async joinGame(gameId, civilization = null) {
        try {
            console.log('🔍 DIAGNOSTIC: Starting game join process', { gameId, civilization });
            console.log('🔍 DIAGNOSTIC: About to call gameService.joinGame - checking for download trigger');
            
            if (civilization) {
                await gameService.joinGame(gameId, civilization);
            }
            
            console.log('🔍 DIAGNOSTIC: Game join completed, about to navigate');
            this.navigateTo(`${ROUTES.GAME}/${gameId}`);
            console.log('🔍 DIAGNOSTIC: Navigation completed');
            
        } catch (error) {
            console.error('Failed to join game:', error);
        }
    }

    /**
     * Initialize game screen
     */
    async initializeGameScreen() {
        const gameId = this.extractGameIdFromRoute();
        if (!gameId) {
            this.navigateTo(ROUTES.GAMES);
            return;
        }

        try {
            // Get game state from service
            const gameState = gameService.getCurrentGameState();
            if (!gameState) {
                throw new Error('Game not found');
            }

            // Initialize game board
            const gameBoardContainer = $('#game-board-container');
            if (gameBoardContainer && !this.gameBoard) {
                this.gameBoard = new GameBoard(gameBoardContainer, gameService.gameEngine);
                
                // Set up board callbacks
                this.gameBoard.setCallbacks({
                    onUnitSelected: (unitId) => {
                        if (this.gameUI) {
                            this.gameUI.onUnitSelected(unitId);
                        }
                    },
                    onRegionClicked: (regionId) => {
                        if (this.gameUI) {
                            this.gameUI.onRegionSelected(regionId);
                        }
                    },
                    onOrderCreated: (unitId, targetRegion) => {
                        if (this.gameUI) {
                            this.gameUI.createOrder('move', targetRegion);
                        }
                    }
                });
            }

            // Initialize game UI
            const gameUIContainer = $('#game-ui-container');
            if (gameUIContainer && !this.gameUI) {
                this.gameUI = new GameUI(gameUIContainer, gameService.gameEngine);
                this.gameUI.setCurrentPlayer(gameService.getCurrentPlayerId());
                
                // Set up UI callbacks
                this.gameUI.setCallbacks({
                    onOrderSubmitted: async (orders) => {
                        await gameService.submitOrders(orders);
                        this.updateGameDisplay();
                    },
                    onOrderChanged: () => {
                        this.updateGameDisplay();
                    }
                });
            }

            // Update displays
            this.updateGameDisplay();

        } catch (error) {
            console.error('Failed to initialize game screen:', error);
            showError('Failed to load game');
            this.navigateTo(ROUTES.GAMES);
        }
    }

    /**
     * Update game display
     */
    updateGameDisplay() {
        if (this.gameBoard) {
            this.gameBoard.updateDisplay();
        }
        if (this.gameUI) {
            this.gameUI.updateDisplay();
        }
    }

    /**
     * Extract game ID from current route
     */
    extractGameIdFromRoute() {
        const hash = window.location.hash.slice(1);
        const parts = hash.split('/');
        return parts.length > 1 ? parts[1] : null;
    }

    /**
     * Update dashboard statistics
     */
    updateDashboardStats(stats) {
        const activeGamesCount = $('#active-games-count');
        const pendingTurnsCount = $('#pending-turns-count');
        const totalGamesCount = $('#total-games-count');
        const winRate = $('#win-rate');
        
        if (activeGamesCount) activeGamesCount.textContent = stats.activeGames;
        if (pendingTurnsCount) pendingTurnsCount.textContent = stats.pendingTurns;
        if (totalGamesCount) totalGamesCount.textContent = stats.totalGames;
        if (winRate) winRate.textContent = `${stats.winRate}%`;
    }

    /**
     * Load recent activity
     */
    loadRecentActivity() {
        const activityList = $('#activity-list');
        if (!activityList) return;
        
        // Demo activity data
        const activities = [
            { text: 'Orders submitted for Ancient Conflicts', time: '2 hours ago' },
            { text: 'New turn started in Mesopotamian Wars', time: '1 day ago' },
            { text: 'Victory achieved in Pharaoh\'s Empire!', time: '3 days ago' }
        ];
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <span class="activity-text">${activity.text}</span>
                <span class="activity-time">${activity.time}</span>
            </div>
        `).join('');
    }

    /**
     * Apply theme
     */
    applyTheme() {
        const theme = getFromStorage(STORAGE_KEYS.THEME, 'ancient');
        document.body.className = `theme-${theme}`;
    }

    /**
     * Apply user preferences
     */
    applyUserPreferences(preferences) {
        // Apply theme
        if (preferences.theme) {
            document.body.className = `theme-${preferences.theme}`;
        }
        
        // Store preferences
        setInStorage(STORAGE_KEYS.USER_PREFERENCES, preferences);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            const sideNav = $('#side-nav');
            sideNav?.classList.remove('open');
        }
    }

    /**
     * Show loading screen
     */
    showLoadingScreen() {
        const loadingScreen = $('#loading-screen');
        const app = $('#app');
        
        if (loadingScreen) loadingScreen.classList.remove('hidden');
        if (app) app.classList.add('hidden');
    }

    /**
     * Hide loading screen
     */
    hideLoadingScreen() {
        const loadingScreen = $('#loading-screen');
        const app = $('#app');
        
        setTimeout(() => {
            if (loadingScreen) fadeOut(loadingScreen);
            if (app) {
                app.classList.remove('hidden');
                fadeIn(app);
            }
        }, 1000); // Show loading for at least 1 second
    }

    /**
     * Show initialization error
     */
    showInitializationError(error) {
        const loadingScreen = $('#loading-screen');
        if (loadingScreen) {
            loadingScreen.innerHTML = `
                <div class="loading-content">
                    <div class="logo">
                        <h1>Cradle of Civilization</h1>
                        <p>Initialization Failed</p>
                    </div>
                    <div class="error-message">
                        <p>Failed to load the application. Please refresh the page.</p>
                        <button onclick="window.location.reload()" class="btn btn-primary">Refresh</button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Add event listener with automatic cleanup
     */
    addEventListenerWithCleanup(element, event, handler, options) {
        if (!element) return;
        
        const cleanup = addEventListenerWithCleanup(element, event, handler, options);
        this.eventCleanupFunctions.push(cleanup);
        return cleanup;
    }

    /**
     * Cleanup all event listeners
     */
    cleanup() {
        this.eventCleanupFunctions.forEach(cleanup => cleanup());
        this.eventCleanupFunctions = [];
    }

    /**
     * Destroy the application
     */
    destroy() {
        // Cleanup game components
        if (this.gameBoard) {
            this.gameBoard.destroy();
            this.gameBoard = null;
        }
        if (this.gameUI) {
            this.gameUI.destroy();
            this.gameUI = null;
        }
        
        // Cleanup game service
        gameService.cleanup();
        
        this.cleanup();
        this.isInitialized = false;
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DEBUG: DOM loaded, creating Cradle of Civilization app...');
    
    const app = new CradleOfCivilizationApp();
    
    try {
        console.log('🚀 DEBUG: Starting app initialization...');
        await app.initialize();
        
        console.log('✅ DEBUG: App initialization complete!');
        
        // Make app globally available for debugging
        window.cradleApp = app;
        
    } catch (error) {
        console.error('❌ DEBUG: Application failed to start:', error);
        console.error('❌ DEBUG: Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.cradleApp) {
        window.cradleApp.destroy();
    }
});

export default CradleOfCivilizationApp;
