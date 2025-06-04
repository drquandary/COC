// ===== UTILITY HELPER FUNCTIONS =====

import { 
    UI_CONSTANTS, 
    ERROR_MESSAGES, 
    SUCCESS_MESSAGES,
    CIVILIZATIONS,
    MAP_REGIONS 
} from './constants.js';

// ===== DOM UTILITIES =====

/**
 * Safe query selector that returns null if element not found
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {Element|null}
 */
export function $(selector, parent = document) {
    return parent.querySelector(selector);
}

/**
 * Safe query selector all
 * @param {string} selector - CSS selector
 * @param {Element} parent - Parent element (optional)
 * @returns {NodeList}
 */
export function $$(selector, parent = document) {
    return parent.querySelectorAll(selector);
}

/**
 * Create element with attributes and content
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {string|Element|Array} content - Element content
 * @returns {Element}
 */
export function createElement(tag, attributes = {}, content = '') {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key === 'dataset') {
            Object.entries(value).forEach(([dataKey, dataValue]) => {
                element.dataset[dataKey] = dataValue;
            });
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Set content
    if (typeof content === 'string') {
        element.textContent = content;
    } else if (content instanceof Element) {
        element.appendChild(content);
    } else if (Array.isArray(content)) {
        content.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else if (child instanceof Element) {
                element.appendChild(child);
            }
        });
    }
    
    return element;
}

/**
 * Add event listener with automatic cleanup
 * @param {Element} element - Target element
 * @param {string} event - Event type
 * @param {Function} handler - Event handler
 * @param {Object} options - Event options
 * @returns {Function} Cleanup function
 */
export function addEventListenerWithCleanup(element, event, handler, options = {}) {
    element.addEventListener(event, handler, options);
    return () => element.removeEventListener(event, handler, options);
}

// ===== VALIDATION UTILITIES =====

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and errors
 */
export function validatePassword(password) {
    const errors = [];
    
    if (password.length < 6) {
        errors.push('Password must be at least 6 characters long');
    }
    
    if (!/[A-Za-z]/.test(password)) {
        errors.push('Password must contain at least one letter');
    }
    
    if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Sanitize user input
 * @param {string} input - Input to sanitize
 * @returns {string}
 */
export function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 1000); // Limit length
}

// ===== FORMAT UTILITIES =====

/**
 * Format date for display
 * @param {Date|string|number} date - Date to format
 * @param {Object} options - Formatting options
 * @returns {string}
 */
export function formatDate(date, options = {}) {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (options.relative) {
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
    }
    
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options
    });
}

/**
 * Format time remaining until deadline
 * @param {Date|string|number} deadline - Deadline date
 * @returns {string}
 */
export function formatTimeRemaining(deadline) {
    const now = new Date();
    const target = new Date(deadline);
    const diffMs = target - now;
    
    if (diffMs <= 0) return 'Deadline passed';
    
    const diffHours = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
        return `${diffDays} day${diffDays === 1 ? '' : 's'} ${diffHours % 24}h remaining`;
    } else if (diffHours > 0) {
        return `${diffHours}h ${diffMins}m remaining`;
    } else {
        return `${diffMins} minute${diffMins === 1 ? '' : 's'} remaining`;
    }
}

/**
 * Format number with appropriate suffix
 * @param {number} num - Number to format
 * @returns {string}
 */
export function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
}

// ===== GAME UTILITIES =====

/**
 * Get civilization data by ID
 * @param {string} civId - Civilization ID
 * @returns {Object|null}
 */
export function getCivilization(civId) {
    return CIVILIZATIONS[civId.toUpperCase()] || null;
}

/**
 * Get region data by ID
 * @param {string} regionId - Region ID
 * @returns {Object|null}
 */
export function getRegion(regionId) {
    return MAP_REGIONS[regionId] || null;
}

/**
 * Check if two regions are adjacent
 * @param {string} regionA - First region ID
 * @param {string} regionB - Second region ID
 * @returns {boolean}
 */
export function areRegionsAdjacent(regionA, regionB) {
    const region = getRegion(regionA);
    return region && region.adjacentRegions.includes(regionB);
}

/**
 * Calculate distance between two points
 * @param {Object} pointA - First point {x, y}
 * @param {Object} pointB - Second point {x, y}
 * @returns {number}
 */
export function calculateDistance(pointA, pointB) {
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Generate unique game ID
 * @returns {string}
 */
export function generateGameId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 5);
    return `game_${timestamp}_${randomStr}`;
}

/**
 * Generate unique order ID
 * @returns {string}
 */
export function generateOrderId() {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substr(2, 8);
    return `order_${timestamp}_${randomStr}`;
}

// ===== STORAGE UTILITIES =====

/**
 * Safe localStorage getter
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key not found
 * @returns {*}
 */
export function getFromStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.warn(`Failed to get item from storage: ${key}`, error);
        return defaultValue;
    }
}

/**
 * Safe localStorage setter
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export function setInStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.warn(`Failed to set item in storage: ${key}`, error);
        return false;
    }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.warn(`Failed to remove item from storage: ${key}`, error);
    }
}

// ===== NOTIFICATION UTILITIES =====

/**
 * Show toast notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
export function showToast(message, type = 'info', duration = UI_CONSTANTS.TOAST_DURATION) {
    const container = $('#toast-container');
    if (!container) return;
    
    const toast = createElement('div', {
        className: `toast ${type}`,
        role: 'alert',
        'aria-live': 'polite'
    }, message);
    
    container.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });
    
    // Auto remove
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

/**
 * Show error notification
 * @param {string} message - Error message
 */
export function showError(message) {
    showToast(message, 'error');
}

/**
 * Show success notification
 * @param {string} message - Success message
 */
export function showSuccess(message) {
    showToast(message, 'success');
}

/**
 * Show warning notification
 * @param {string} message - Warning message
 */
export function showWarning(message) {
    showToast(message, 'warning');
}

// ===== ASYNC UTILITIES =====

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function}
 */
export function debounce(func, delay = UI_CONSTANTS.DEBOUNCE_DELAY) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function}
 */
export function throttle(func, limit = UI_CONSTANTS.DEBOUNCE_DELAY) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Sleep for specified duration
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise}
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry async operation with exponential backoff
 * @param {Function} operation - Async operation to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise}
 */
export async function retryWithBackoff(operation, maxRetries = 3, baseDelay = 1000) {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
            
            if (attempt === maxRetries) {
                throw lastError;
            }
            
            const delay = baseDelay * Math.pow(2, attempt);
            await sleep(delay);
        }
    }
}

// ===== MOBILE UTILITIES =====

/**
 * Check if device is mobile
 * @returns {boolean}
 */
export function isMobile() {
    return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device supports touch
 * @returns {boolean}
 */
export function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get viewport dimensions
 * @returns {Object}
 */
export function getViewportSize() {
    return {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
}

/**
 * Check if element is in viewport
 * @param {Element} element - Element to check
 * @returns {boolean}
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const viewport = getViewportSize();
    
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= viewport.height &&
        rect.right <= viewport.width
    );
}

// ===== ANIMATION UTILITIES =====

/**
 * Animate element with CSS transitions
 * @param {Element} element - Element to animate
 * @param {Object} styles - CSS styles to apply
 * @param {number} duration - Animation duration in milliseconds
 * @returns {Promise}
 */
export function animateElement(element, styles, duration = UI_CONSTANTS.ANIMATION_DURATION) {
    return new Promise(resolve => {
        const originalTransition = element.style.transition;
        element.style.transition = `all ${duration}ms ease-in-out`;
        
        Object.entries(styles).forEach(([property, value]) => {
            element.style[property] = value;
        });
        
        setTimeout(() => {
            element.style.transition = originalTransition;
            resolve();
        }, duration);
    });
}

/**
 * Fade in element
 * @param {Element} element - Element to fade in
 * @param {number} duration - Animation duration
 * @returns {Promise}
 */
export function fadeIn(element, duration = UI_CONSTANTS.ANIMATION_DURATION) {
    element.style.opacity = '0';
    element.classList.remove('hidden');
    
    return animateElement(element, { opacity: '1' }, duration);
}

/**
 * Fade out element
 * @param {Element} element - Element to fade out
 * @param {number} duration - Animation duration
 * @returns {Promise}
 */
export function fadeOut(element, duration = UI_CONSTANTS.ANIMATION_DURATION) {
    return animateElement(element, { opacity: '0' }, duration)
        .then(() => element.classList.add('hidden'));
}

// ===== CLIPBOARD UTILITIES =====

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = createElement('textarea', {
                value: text,
                style: 'position: fixed; left: -999999px; top: -999999px;'
            });
            
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            return success;
        }
    } catch (error) {
        console.warn('Failed to copy to clipboard:', error);
        return false;
    }
}

// ===== ERROR HANDLING =====

/**
 * Safe function execution with error handling
 * @param {Function} fn - Function to execute
 * @param {*} fallback - Fallback value on error
 * @returns {*}
 */
export function safeExecute(fn, fallback = null) {
    try {
        return fn();
    } catch (error) {
        console.warn('Safe execution failed:', error);
        return fallback;
    }
}

/**
 * Log error with context
 * @param {string} context - Error context
 * @param {Error} error - Error object
 * @param {Object} additionalData - Additional data to log
 */
export function logError(context, error, additionalData = {}) {
    console.error(`[${context}]`, error, additionalData);
    
    // In production, you might want to send this to an error tracking service
    if (window.errorTracker) {
        window.errorTracker.logError(context, error, additionalData);
    }
}

// ===== ADDITIONAL GAME UTILITIES =====

/**
 * Generate a unique ID
 * @returns {string}
 */
export function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

/**
 * Format time for display (HH:MM:SS format)
 * @param {number} milliseconds - Time in milliseconds
 * @returns {string}
 */
export function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Deep clone an object
 * @param {*} obj - Object to clone
 * @returns {*}
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * Check if an object is empty
 * @param {Object} obj - Object to check
 * @returns {boolean}
 */
export function isEmpty(obj) {
    if (obj == null) return true;
    if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
    return Object.keys(obj).length === 0;
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string}
 */
export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert snake_case to camelCase
 * @param {string} str - String to convert
 * @returns {string}
 */
export function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Convert camelCase to snake_case
 * @param {string} str - String to convert
 * @returns {string}
 */
export function toSnakeCase(str) {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

/**
 * Generate a random color
 * @returns {string} Hex color string
 */
export function randomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

/**
 * Clamp a number between min and max values
 * @param {number} num - Number to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number}
 */
export function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} factor - Interpolation factor (0-1)
 * @returns {number}
 */
export function lerp(start, end, factor) {
    return start + (end - start) * clamp(factor, 0, 1);
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Degrees
 * @returns {number} Radians
 */
export function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - Radians
 * @returns {number} Degrees
 */
export function toDegrees(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Check if a value is numeric
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export function isNumeric(value) {
    return !isNaN(value) && !isNaN(parseFloat(value));
}

/**
 * Round number to specified decimal places
 * @param {number} num - Number to round
 * @param {number} decimals - Number of decimal places
 * @returns {number}
 */
export function roundTo(num, decimals) {
    return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
}

/**
 * Get a random element from an array
 * @param {Array} array - Array to pick from
 * @returns {*} Random element
 */
export function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle an array (Fisher-Yates algorithm)
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Create a range of numbers
 * @param {number} start - Start number
 * @param {number} end - End number
 * @param {number} step - Step size
 * @returns {Array<number>}
 */
export function range(start, end, step = 1) {
    const result = [];
    for (let i = start; i < end; i += step) {
        result.push(i);
    }
    return result;
}

/**
 * Group array elements by a key function
 * @param {Array} array - Array to group
 * @param {Function} keyFn - Function to generate group key
 * @returns {Object}
 */
export function groupBy(array, keyFn) {
    return array.reduce((groups, item) => {
        const key = keyFn(item);
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(item);
        return groups;
    }, {});
}