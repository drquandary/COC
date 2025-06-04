// ===== GAME CONSTANTS =====

// Game configuration
export const GAME_CONFIG = {
    MAX_PLAYERS: 7,
    MIN_PLAYERS: 2,
    VICTORY_SUPPLY_CENTERS: 12,
    TOTAL_SUPPLY_CENTERS: 22,
    DEFAULT_TURN_LENGTH_HOURS: 48,
    MAX_TURN_LENGTH_HOURS: 168, // 1 week
    MIN_TURN_LENGTH_HOURS: 24,
    NEGOTIATION_PHASE_HOURS: 24
};

// Game phases
export const GAME_PHASES = {
    LOBBY: 'lobby',
    SPRING_ORDERS: 'spring_orders',
    SPRING_RESOLUTION: 'spring_resolution',
    FALL_ORDERS: 'fall_orders',
    FALL_RESOLUTION: 'fall_resolution',
    WINTER_ADJUSTMENTS: 'winter_adjustments',
    DIPLOMACY: 'diplomacy',
    COMPLETED: 'completed',
    PAUSED: 'paused'
};

// Game status
export const GAME_STATUS = {
    LOBBY: 'lobby',
    ACTIVE: 'active',
    PAUSED: 'paused',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

// Seasons
export const SEASONS = {
    SPRING: 'spring',
    FALL: 'fall',
    WINTER: 'winter'
};

// Ancient Middle East Civilizations
export const CIVILIZATIONS = {
    BABYLON: {
        id: 'babylon',
        name: 'Babylon',
        fullName: 'Babylonian Empire',
        description: 'Masters of law and astronomy, rulers of Mesopotamia',
        color: '#FFD700',
        secondaryColor: '#1E3A8A',
        accentColor: '#4338CA',
        startingRegions: ['babylon', 'mesopotamia', 'bagdad'],
        capitalRegion: 'babylon',
        historicalPeriod: '1894-539 BCE',
        keyFigures: ['Hammurabi', 'Nebuchadnezzar II'],
        specialties: ['Law', 'Astronomy', 'Architecture']
    },
    ASSYRIA: {
        id: 'assyria',
        name: 'Assyria',
        fullName: 'Assyrian Empire',
        description: 'Fierce warriors and master tacticians of the north',
        color: '#6B7280',
        secondaryColor: '#DC2626',
        accentColor: '#991B1B',
        startingRegions: ['nineveh', 'assur', 'arbela'],
        capitalRegion: 'nineveh',
        historicalPeriod: '2500-609 BCE',
        keyFigures: ['Sargon II', 'Ashurbanipal'],
        specialties: ['Warfare', 'Siege Craft', 'Administration']
    },
    EGYPT: {
        id: 'egypt',
        name: 'Egypt',
        fullName: 'Kingdom of Egypt',
        description: 'Children of the Nile, builders of eternal monuments',
        color: '#1E40AF',
        secondaryColor: '#F59E0B',
        accentColor: '#0EA5E9',
        startingRegions: ['memphis', 'thebes', 'alexandria'],
        capitalRegion: 'memphis',
        historicalPeriod: '3100-332 BCE',
        keyFigures: ['Ramesses II', 'Cleopatra VII'],
        specialties: ['Architecture', 'Medicine', 'Agriculture']
    },
    PERSIA: {
        id: 'persia',
        name: 'Persia',
        fullName: 'Persian Empire',
        description: 'The great empire that connected East and West',
        color: '#7C3AED',
        secondaryColor: '#E5E7EB',
        accentColor: '#5B21B6',
        startingRegions: ['persepolis', 'ecbatana', 'susa'],
        capitalRegion: 'persepolis',
        historicalPeriod: '550-331 BCE',
        keyFigures: ['Cyrus the Great', 'Darius I'],
        specialties: ['Administration', 'Trade', 'Tolerance']
    },
    PHOENICIA: {
        id: 'phoenicia',
        name: 'Phoenicia',
        fullName: 'Phoenician City-States',
        description: 'Master traders and navigators of the Mediterranean',
        color: '#059669',
        secondaryColor: '#F97316',
        accentColor: '#0D9488',
        startingRegions: ['tyre', 'sidon', 'byblos'],
        capitalRegion: 'tyre',
        historicalPeriod: '1200-300 BCE',
        keyFigures: ['Hiram I', 'Dido of Carthage'],
        specialties: ['Trade', 'Navigation', 'Alphabet']
    },
    HITTITES: {
        id: 'hittites',
        name: 'Hittites',
        fullName: 'Hittite Empire',
        description: 'Iron Age pioneers and masters of Anatolia',
        color: '#92400E',
        secondaryColor: '#CD7F32',
        accentColor: '#A16207',
        startingRegions: ['hattusa', 'kanesh', 'carchemish'],
        capitalRegion: 'hattusa',
        historicalPeriod: '1650-1200 BCE',
        keyFigures: ['Suppiluliuma I', 'Muwatalli II'],
        specialties: ['Metallurgy', 'Diplomacy', 'Law']
    },
    ELAM: {
        id: 'elam',
        name: 'Elam',
        fullName: 'Kingdom of Elam',
        description: 'Ancient rivals of Mesopotamia from the eastern mountains',
        color: '#10B981',
        secondaryColor: '#F59E0B',
        accentColor: '#047857',
        startingRegions: ['susa', 'anshan', 'dur_untash'],
        capitalRegion: 'susa',
        historicalPeriod: '3200-539 BCE',
        keyFigures: ['Shutruk-Nahhunte', 'Humban-numena'],
        specialties: ['Mining', 'Craftsmanship', 'Mountain Warfare']
    }
};

// Unit types
export const UNIT_TYPES = {
    ARMY: {
        id: 'army',
        name: 'Army',
        symbol: '⚔️',
        canConvoy: false,
        canBeConvoyed: true,
        validTerrain: ['land', 'coast']
    },
    FLEET: {
        id: 'fleet',
        name: 'Fleet',
        symbol: '⛵',
        canConvoy: true,
        canBeConvoyed: false,
        validTerrain: ['sea', 'coast']
    }
};

// Order types
export const ORDER_TYPES = {
    HOLD: {
        id: 'hold',
        name: 'Hold',
        symbol: 'H',
        description: 'Unit holds its current position'
    },
    MOVE: {
        id: 'move',
        name: 'Move',
        symbol: 'M',
        description: 'Unit moves to adjacent region'
    },
    SUPPORT: {
        id: 'support',
        name: 'Support',
        symbol: 'S',
        description: 'Unit supports another unit\'s action'
    },
    CONVOY: {
        id: 'convoy',
        name: 'Convoy',
        symbol: 'C',
        description: 'Fleet convoys army across water'
    },
    BUILD: {
        id: 'build',
        name: 'Build',
        symbol: 'B',
        description: 'Build new unit in supply center'
    },
    DISBAND: {
        id: 'disband',
        name: 'Disband',
        symbol: 'D',
        description: 'Remove unit from the board'
    }
};

// Region types
export const REGION_TYPES = {
    LAND: 'land',
    SEA: 'sea',
    COAST: 'coast'
};

// Terrain types for theming
export const TERRAIN_TYPES = {
    DESERT: 'desert',
    MOUNTAINS: 'mountains',
    FERTILE: 'fertile',
    WATER: 'water',
    CITY: 'city'
};

// Ancient Middle East map regions
export const MAP_REGIONS = {
    // Mesopotamian regions
    babylon: {
        id: 'babylon',
        name: 'Babylon',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.FERTILE,
        isSupplyCenter: true,
        civilization: 'babylon',
        coordinates: { x: 400, y: 300 },
        adjacentRegions: ['mesopotamia', 'bagdad', 'susa'],
        description: 'The great city of Hammurabi and Nebuchadnezzar'
    },
    mesopotamia: {
        id: 'mesopotamia',
        name: 'Mesopotamia',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.FERTILE,
        isSupplyCenter: false,
        coordinates: { x: 380, y: 280 },
        adjacentRegions: ['babylon', 'nineveh', 'assur'],
        description: 'The fertile land between two rivers'
    },
    bagdad: {
        id: 'bagdad',
        name: 'Bagdad',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.FERTILE,
        isSupplyCenter: true,
        coordinates: { x: 420, y: 320 },
        adjacentRegions: ['babylon', 'susa', 'persian_gulf'],
        description: 'Strategic crossroads of ancient trade'
    },
    
    // Assyrian regions
    nineveh: {
        id: 'nineveh',
        name: 'Nineveh',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: true,
        civilization: 'assyria',
        coordinates: { x: 380, y: 240 },
        adjacentRegions: ['mesopotamia', 'assur', 'arbela'],
        description: 'Capital of the mighty Assyrian Empire'
    },
    assur: {
        id: 'assur',
        name: 'Assur',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: false,
        coordinates: { x: 390, y: 260 },
        adjacentRegions: ['nineveh', 'mesopotamia', 'arbela'],
        description: 'Ancient religious center of Assyria'
    },
    arbela: {
        id: 'arbela',
        name: 'Arbela',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.FERTILE,
        isSupplyCenter: true,
        coordinates: { x: 410, y: 250 },
        adjacentRegions: ['nineveh', 'assur', 'ecbatana'],
        description: 'Site of Alexander\'s decisive victory'
    },
    
    // Egyptian regions
    memphis: {
        id: 'memphis',
        name: 'Memphis',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: true,
        civilization: 'egypt',
        coordinates: { x: 200, y: 400 },
        adjacentRegions: ['alexandria', 'thebes', 'sinai'],
        description: 'Ancient capital of Lower Egypt'
    },
    thebes: {
        id: 'thebes',
        name: 'Thebes',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: true,
        coordinates: { x: 220, y: 450 },
        adjacentRegions: ['memphis', 'red_sea'],
        description: 'Sacred city of Amun-Ra'
    },
    alexandria: {
        id: 'alexandria',
        name: 'Alexandria',
        type: REGION_TYPES.COAST,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: true,
        coordinates: { x: 180, y: 380 },
        adjacentRegions: ['memphis', 'mediterranean', 'cyrenaica'],
        description: 'The great lighthouse and library'
    },
    
    // Persian regions
    persepolis: {
        id: 'persepolis',
        name: 'Persepolis',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: true,
        civilization: 'persia',
        coordinates: { x: 500, y: 350 },
        adjacentRegions: ['susa', 'ecbatana', 'persian_gulf'],
        description: 'Magnificent capital of the Persian Empire'
    },
    ecbatana: {
        id: 'ecbatana',
        name: 'Ecbatana',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.MOUNTAINS,
        isSupplyCenter: true,
        coordinates: { x: 480, y: 300 },
        adjacentRegions: ['persepolis', 'arbela', 'susa'],
        description: 'Summer capital in the Zagros Mountains'
    },
    susa: {
        id: 'susa',
        name: 'Susa',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: true,
        coordinates: { x: 460, y: 320 },
        adjacentRegions: ['babylon', 'bagdad', 'persepolis', 'ecbatana'],
        description: 'Ancient Elamite capital'
    },
    
    // Phoenician regions
    tyre: {
        id: 'tyre',
        name: 'Tyre',
        type: REGION_TYPES.COAST,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: true,
        civilization: 'phoenicia',
        coordinates: { x: 280, y: 280 },
        adjacentRegions: ['sidon', 'mediterranean', 'damascus'],
        description: 'Purple dye capital of the ancient world'
    },
    sidon: {
        id: 'sidon',
        name: 'Sidon',
        type: REGION_TYPES.COAST,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: false,
        coordinates: { x: 270, y: 270 },
        adjacentRegions: ['tyre', 'byblos', 'mediterranean'],
        description: 'Ancient port city of skilled craftsmen'
    },
    byblos: {
        id: 'byblos',
        name: 'Byblos',
        type: REGION_TYPES.COAST,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: true,
        coordinates: { x: 260, y: 260 },
        adjacentRegions: ['sidon', 'mediterranean', 'damascus'],
        description: 'Birthplace of the alphabet'
    },
    
    // Hittite regions
    hattusa: {
        id: 'hattusa',
        name: 'Hattusa',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.MOUNTAINS,
        isSupplyCenter: true,
        civilization: 'hittites',
        coordinates: { x: 320, y: 180 },
        adjacentRegions: ['kanesh', 'carchemish', 'black_sea'],
        description: 'Capital of the Hittite Empire'
    },
    kanesh: {
        id: 'kanesh',
        name: 'Kanesh',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: false,
        coordinates: { x: 340, y: 200 },
        adjacentRegions: ['hattusa', 'carchemish'],
        description: 'Important Assyrian trading post'
    },
    carchemish: {
        id: 'carchemish',
        name: 'Carchemish',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: true,
        coordinates: { x: 350, y: 220 },
        adjacentRegions: ['hattusa', 'kanesh', 'damascus'],
        description: 'Strategic fortress on the Euphrates'
    },
    
    // Water regions
    mediterranean: {
        id: 'mediterranean',
        name: 'Mediterranean Sea',
        type: REGION_TYPES.SEA,
        terrain: TERRAIN_TYPES.WATER,
        isSupplyCenter: false,
        coordinates: { x: 200, y: 200 },
        adjacentRegions: ['alexandria', 'tyre', 'sidon', 'byblos', 'cyrenaica'],
        description: 'The great sea connecting civilizations'
    },
    persian_gulf: {
        id: 'persian_gulf',
        name: 'Persian Gulf',
        type: REGION_TYPES.SEA,
        terrain: TERRAIN_TYPES.WATER,
        isSupplyCenter: false,
        coordinates: { x: 480, y: 380 },
        adjacentRegions: ['bagdad', 'persepolis'],
        description: 'Vital waterway for ancient trade'
    },
    red_sea: {
        id: 'red_sea',
        name: 'Red Sea',
        type: REGION_TYPES.SEA,
        terrain: TERRAIN_TYPES.WATER,
        isSupplyCenter: false,
        coordinates: { x: 240, y: 480 },
        adjacentRegions: ['thebes'],
        description: 'Ancient route to the spice lands'
    },
    black_sea: {
        id: 'black_sea',
        name: 'Black Sea',
        type: REGION_TYPES.SEA,
        terrain: TERRAIN_TYPES.WATER,
        isSupplyCenter: false,
        coordinates: { x: 340, y: 120 },
        adjacentRegions: ['hattusa'],
        description: 'Northern waters of Anatolia'
    },
    
    // Additional strategic regions
    damascus: {
        id: 'damascus',
        name: 'Damascus',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.CITY,
        isSupplyCenter: true,
        coordinates: { x: 300, y: 300 },
        adjacentRegions: ['tyre', 'byblos', 'carchemish'],
        description: 'Ancient crossroads of trade routes'
    },
    sinai: {
        id: 'sinai',
        name: 'Sinai',
        type: REGION_TYPES.LAND,
        terrain: TERRAIN_TYPES.DESERT,
        isSupplyCenter: false,
        coordinates: { x: 240, y: 380 },
        adjacentRegions: ['memphis', 'damascus'],
        description: 'Desert bridge between Africa and Asia'
    },
    cyrenaica: {
        id: 'cyrenaica',
        name: 'Cyrenaica',
        type: REGION_TYPES.COAST,
        terrain: TERRAIN_TYPES.FERTILE,
        isSupplyCenter: true,
        coordinates: { x: 160, y: 360 },
        adjacentRegions: ['alexandria', 'mediterranean'],
        description: 'Fertile coastal region of Libya'
    }
};

// UI Constants
export const UI_CONSTANTS = {
    TOAST_DURATION: 5000,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300,
    TOUCH_DELAY: 150,
    MAX_ZOOM: 3,
    MIN_ZOOM: 0.5,
    ZOOM_STEP: 0.2
};

// Error messages
export const ERROR_MESSAGES = {
    INVALID_EMAIL: 'Please enter a valid email address',
    WEAK_PASSWORD: 'Password must be at least 6 characters long',
    PASSWORDS_DONT_MATCH: 'Passwords do not match',
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    GAME_FULL: 'This game is already full',
    INVALID_ORDER: 'Invalid order. Please check your selection.',
    CONNECTION_ERROR: 'Connection error. Please check your internet connection.',
    PERMISSION_DENIED: 'You do not have permission to perform this action',
    GAME_NOT_FOUND: 'Game not found',
    ORDER_DEADLINE_PASSED: 'Order deadline has passed'
};

// Success messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Successfully logged in',
    REGISTRATION_SUCCESS: 'Account created successfully',
    ORDER_SUBMITTED: 'Orders submitted successfully',
    GAME_CREATED: 'Game created successfully',
    GAME_JOINED: 'Successfully joined game',
    SETTINGS_SAVED: 'Settings saved successfully'
};

// Firebase collections
export const FIREBASE_COLLECTIONS = {
    USERS: 'users',
    GAMES: 'games',
    PLAYERS: 'players',
    ORDERS: 'orders',
    MESSAGES: 'messages',
    GAME_HISTORY: 'gameHistory'
};

// Local storage keys
export const STORAGE_KEYS = {
    USER_PREFERENCES: 'coc_user_preferences',
    GAME_CACHE: 'coc_game_cache',
    AUTH_STATE: 'coc_auth_state',
    THEME: 'coc_theme'
};

// App routes
export const ROUTES = {
    DASHBOARD: 'dashboard',
    GAMES: 'games',
    CREATE_GAME: 'create-game',
    JOIN_GAME: 'join-game',
    GAME: 'game',
    HISTORY: 'history',
    RULES: 'rules',
    SETTINGS: 'settings',
    AUTH: 'auth'
};

// Default user preferences
export const DEFAULT_PREFERENCES = {
    emailNotifications: true,
    pushNotifications: true,
    soundEffects: true,
    autoSubmitOrders: false,
    theme: 'ancient',
    language: 'en'
};