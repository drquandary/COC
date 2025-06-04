// ===== GAME UI COMPONENTS =====

import { 
    GAME_PHASES, 
    SEASONS, 
    CIVILIZATIONS, 
    UNIT_TYPES, 
    ORDER_TYPES, 
    UI_CONSTANTS 
} from '../utils/constants.js';
import { 
    $, 
    $$, 
    addEventListenerWithCleanup, 
    showError, 
    showSuccess, 
    formatTime, 
    isMobile 
} from '../utils/helpers.js';

/**
 * Game UI components for order input, status display, and player management
 */
export class GameUI {
    constructor(container, gameEngine) {
        this.container = container;
        this.gameEngine = gameEngine;
        this.currentPlayerId = null;
        this.selectedUnit = null;
        this.pendingOrders = new Map();
        this.eventCleanupFunctions = [];
        
        // UI callbacks
        this.onOrderSubmitted = null;
        this.onOrderChanged = null;
        
        this.initialize();
    }

    /**
     * Initialize the game UI
     */
    initialize() {
        this.createUIStructure();
        this.setupEventListeners();
        this.updateDisplay();
    }

    /**
     * Create the main UI structure
     */
    createUIStructure() {
        this.container.innerHTML = `
            <div class="game-ui">
                <!-- Game Status Panel -->
                <div class="game-status-panel">
                    <div class="game-status-header">
                        <h3 class="game-title" id="game-title">Game Title</h3>
                        <div class="phase-indicator" id="phase-indicator">
                            <span class="season" id="current-season">Spring</span>
                            <span class="year" id="current-year">Year 1</span>
                            <span class="phase" id="current-phase">Orders</span>
                        </div>
                    </div>
                    
                    <div class="turn-timer" id="turn-timer">
                        <span class="timer-label">Time remaining:</span>
                        <span class="timer-value" id="timer-value">24:00:00</span>
                    </div>
                    
                    <div class="players-summary" id="players-summary">
                        <!-- Player status cards will be inserted here -->
                    </div>
                </div>

                <!-- Order Panel -->
                <div class="order-panel" id="order-panel">
                    <div class="order-panel-header">
                        <h4>Orders</h4>
                        <button class="btn btn-small" id="clear-orders-btn">Clear All</button>
                    </div>
                    
                    <div class="selected-unit-info" id="selected-unit-info" style="display: none;">
                        <div class="unit-display">
                            <span class="unit-symbol" id="selected-unit-symbol">⚔️</span>
                            <span class="unit-location" id="selected-unit-location">Location</span>
                        </div>
                        <div class="order-type-selector" id="order-type-selector">
                            <button class="order-btn" data-order="hold">Hold</button>
                            <button class="order-btn" data-order="move">Move</button>
                            <button class="order-btn" data-order="support">Support</button>
                            <button class="order-btn" data-order="convoy">Convoy</button>
                        </div>
                    </div>
                    
                    <div class="order-target-selector" id="order-target-selector" style="display: none;">
                        <div class="target-instruction" id="target-instruction">
                            Select a target region on the map
                        </div>
                        <button class="btn btn-small" id="cancel-order-btn">Cancel</button>
                    </div>
                    
                    <div class="orders-list" id="orders-list">
                        <!-- Pending orders will be listed here -->
                    </div>
                    
                    <div class="order-actions">
                        <button class="btn btn-primary" id="submit-orders-btn">Submit Orders</button>
                        <button class="btn btn-secondary" id="save-draft-btn">Save Draft</button>
                    </div>
                </div>

                <!-- Chat Panel -->
                <div class="chat-panel" id="chat-panel">
                    <div class="chat-header">
                        <h4>Diplomacy</h4>
                        <select class="chat-target-selector" id="chat-target-selector">
                            <option value="all">All Players</option>
                            <!-- Player options will be added dynamically -->
                        </select>
                    </div>
                    
                    <div class="chat-messages" id="chat-messages">
                        <!-- Messages will be displayed here -->
                    </div>
                    
                    <div class="chat-input-area">
                        <input type="text" class="chat-input" id="chat-input" placeholder="Type your message...">
                        <button class="btn btn-small" id="send-message-btn">Send</button>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="game-actions">
                    <button class="btn btn-secondary" id="show-rules-btn">Rules</button>
                    <button class="btn btn-secondary" id="show-history-btn">History</button>
                    <button class="btn btn-danger" id="leave-game-btn">Leave Game</button>
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Order panel events
        const orderButtons = $$('.order-btn');
        orderButtons.forEach(btn => {
            addEventListenerWithCleanup(btn, 'click', () => {
                this.selectOrderType(btn.dataset.order);
            }, this.eventCleanupFunctions);
        });

        const submitBtn = $('#submit-orders-btn');
        if (submitBtn) {
            addEventListenerWithCleanup(submitBtn, 'click', () => {
                this.submitOrders();
            }, this.eventCleanupFunctions);
        }

        const clearBtn = $('#clear-orders-btn');
        if (clearBtn) {
            addEventListenerWithCleanup(clearBtn, 'click', () => {
                this.clearAllOrders();
            }, this.eventCleanupFunctions);
        }

        const cancelBtn = $('#cancel-order-btn');
        if (cancelBtn) {
            addEventListenerWithCleanup(cancelBtn, 'click', () => {
                this.cancelOrderCreation();
            }, this.eventCleanupFunctions);
        }

        // Chat events
        const sendBtn = $('#send-message-btn');
        const chatInput = $('#chat-input');
        if (sendBtn && chatInput) {
            addEventListenerWithCleanup(sendBtn, 'click', () => {
                this.sendMessage();
            }, this.eventCleanupFunctions);

            addEventListenerWithCleanup(chatInput, 'keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            }, this.eventCleanupFunctions);
        }

        // Action button events
        const rulesBtn = $('#show-rules-btn');
        if (rulesBtn) {
            addEventListenerWithCleanup(rulesBtn, 'click', () => {
                this.showRules();
            }, this.eventCleanupFunctions);
        }

        const historyBtn = $('#show-history-btn');
        if (historyBtn) {
            addEventListenerWithCleanup(historyBtn, 'click', () => {
                this.showHistory();
            }, this.eventCleanupFunctions);
        }

        const leaveBtn = $('#leave-game-btn');
        if (leaveBtn) {
            addEventListenerWithCleanup(leaveBtn, 'click', () => {
                this.leaveGame();
            }, this.eventCleanupFunctions);
        }
    }

    /**
     * Update the entire display
     */
    updateDisplay() {
        if (!this.gameEngine || !this.gameEngine.gameState) return;
        
        this.updateGameStatus();
        this.updatePlayersSummary();
        this.updateOrdersList();
        this.updateChatTargets();
    }

    /**
     * Update game status display
     */
    updateGameStatus() {
        const gameState = this.gameEngine.gameState;
        
        // Update title
        const titleElement = $('#game-title');
        if (titleElement) {
            titleElement.textContent = gameState.name || 'Cradle of Civilization';
        }

        // Update phase indicator
        const seasonElement = $('#current-season');
        const yearElement = $('#current-year');
        const phaseElement = $('#current-phase');
        
        if (seasonElement) {
            seasonElement.textContent = this.formatSeason(gameState.season);
        }
        
        if (yearElement) {
            yearElement.textContent = `Year ${gameState.year}`;
        }
        
        if (phaseElement) {
            phaseElement.textContent = this.formatPhase(gameState.phase);
        }

        // Update timer (placeholder - would integrate with real timer)
        const timerElement = $('#timer-value');
        if (timerElement) {
            timerElement.textContent = '24:00:00'; // Placeholder
        }
    }

    /**
     * Update players summary
     */
    updatePlayersSummary() {
        const summaryContainer = $('#players-summary');
        if (!summaryContainer || !this.gameEngine.gameState) return;

        summaryContainer.innerHTML = '';

        for (const [playerId, player] of this.gameEngine.gameState.players) {
            const playerCard = this.createPlayerCard(player);
            summaryContainer.appendChild(playerCard);
        }
    }

    /**
     * Create player status card
     */
    createPlayerCard(player) {
        const card = document.createElement('div');
        card.className = 'player-card';
        card.style.borderColor = player.civilizationData.color;

        const isCurrentPlayer = player.id === this.currentPlayerId;
        if (isCurrentPlayer) {
            card.classList.add('current-player');
        }

        card.innerHTML = `
            <div class="player-info">
                <div class="player-name">${player.civilizationData.name}</div>
                <div class="player-status">
                    <span class="supply-centers">${player.supplyCenters.length} SC</span>
                    <span class="units">${player.units.length} Units</span>
                    ${player.hasSubmittedOrders ? '<span class="orders-status submitted">✓</span>' : '<span class="orders-status pending">⏳</span>'}
                </div>
            </div>
        `;

        return card;
    }

    /**
     * Update orders list
     */
    updateOrdersList() {
        const ordersList = $('#orders-list');
        if (!ordersList) return;

        ordersList.innerHTML = '';

        // Show pending orders for current player
        if (this.currentPlayerId && this.gameEngine.gameState) {
            const playerOrders = [];
            
            // Get orders from game state
            for (const [orderId, order] of this.gameEngine.gameState.orders) {
                if (order.playerId === this.currentPlayerId) {
                    playerOrders.push(order);
                }
            }

            // Add pending orders
            for (const [unitId, order] of this.pendingOrders) {
                playerOrders.push(order);
            }

            playerOrders.forEach(order => {
                const orderElement = this.createOrderElement(order);
                ordersList.appendChild(orderElement);
            });
        }
    }

    /**
     * Create order display element
     */
    createOrderElement(order) {
        const div = document.createElement('div');
        div.className = 'order-item';
        
        const unit = this.gameEngine.gameState.units.get(order.unitId);
        const unitType = unit ? UNIT_TYPES[unit.type.toUpperCase()] : null;
        const orderType = ORDER_TYPES[order.type.toUpperCase()];

        let orderText = '';
        switch (order.type) {
            case 'hold':
                orderText = `${unitType?.symbol || '?'} ${order.from} HOLDS`;
                break;
            case 'move':
                orderText = `${unitType?.symbol || '?'} ${order.from} → ${order.to}`;
                break;
            case 'support':
                orderText = `${unitType?.symbol || '?'} ${order.from} SUPPORTS ${order.supportTarget}`;
                break;
            case 'convoy':
                orderText = `${unitType?.symbol || '?'} ${order.from} CONVOYS ${order.convoyFrom} → ${order.convoyTo}`;
                break;
            default:
                orderText = `${unitType?.symbol || '?'} ${order.from} ${order.type.toUpperCase()}`;
        }

        div.innerHTML = `
            <div class="order-text">${orderText}</div>
            <div class="order-actions">
                <button class="btn btn-small btn-danger" onclick="gameUI.removeOrder('${order.unitId}')">Remove</button>
            </div>
        `;

        return div;
    }

    /**
     * Handle unit selection from game board
     */
    onUnitSelected(unitId) {
        this.selectedUnit = unitId;
        this.showUnitOrderInterface(unitId);
    }

    /**
     * Show order interface for selected unit
     */
    showUnitOrderInterface(unitId) {
        const unit = this.gameEngine.gameState.units.get(unitId);
        if (!unit || unit.playerId !== this.currentPlayerId) {
            this.hideUnitOrderInterface();
            return;
        }

        const unitInfo = $('#selected-unit-info');
        const symbolElement = $('#selected-unit-symbol');
        const locationElement = $('#selected-unit-location');

        if (unitInfo && symbolElement && locationElement) {
            const unitType = UNIT_TYPES[unit.type.toUpperCase()];
            symbolElement.textContent = unitType.symbol;
            locationElement.textContent = unit.regionId;
            
            unitInfo.style.display = 'block';
            
            // Update available order types based on unit type and location
            this.updateAvailableOrderTypes(unit);
        }
    }

    /**
     * Hide unit order interface
     */
    hideUnitOrderInterface() {
        const unitInfo = $('#selected-unit-info');
        const targetSelector = $('#order-target-selector');
        
        if (unitInfo) unitInfo.style.display = 'none';
        if (targetSelector) targetSelector.style.display = 'none';
        
        this.selectedUnit = null;
    }

    /**
     * Update available order types for unit
     */
    updateAvailableOrderTypes(unit) {
        const orderButtons = $$('.order-btn');
        const unitType = UNIT_TYPES[unit.type.toUpperCase()];

        orderButtons.forEach(btn => {
            const orderType = btn.dataset.order;
            let enabled = true;

            switch (orderType) {
                case 'convoy':
                    enabled = unitType.canConvoy;
                    break;
                case 'move':
                case 'support':
                case 'hold':
                    enabled = true;
                    break;
            }

            btn.disabled = !enabled;
            btn.classList.toggle('disabled', !enabled);
        });
    }

    /**
     * Select order type
     */
    selectOrderType(orderType) {
        if (!this.selectedUnit) return;

        this.currentOrderType = orderType;

        if (orderType === 'hold') {
            // Hold doesn't need target selection
            this.createOrder(orderType);
        } else {
            // Show target selection interface
            this.showTargetSelector(orderType);
        }
    }

    /**
     * Show target selector interface
     */
    showTargetSelector(orderType) {
        const targetSelector = $('#order-target-selector');
        const instruction = $('#target-instruction');

        if (targetSelector && instruction) {
            let instructionText = '';
            switch (orderType) {
                case 'move':
                    instructionText = 'Select a region to move to';
                    break;
                case 'support':
                    instructionText = 'Select a region to support';
                    break;
                case 'convoy':
                    instructionText = 'Select convoy route';
                    break;
            }

            instruction.textContent = instructionText;
            targetSelector.style.display = 'block';
        }
    }

    /**
     * Handle target selection from game board
     */
    onRegionSelected(regionId) {
        if (this.currentOrderType && this.selectedUnit) {
            this.createOrder(this.currentOrderType, regionId);
        }
    }

    /**
     * Create order
     */
    createOrder(orderType, target = null) {
        if (!this.selectedUnit) return;

        const orderData = {
            unitId: this.selectedUnit,
            type: orderType,
            target: target
        };

        try {
            // Validate order
            const validatedOrder = this.gameEngine.validateOrder(orderData, this.currentPlayerId);
            
            // Add to pending orders
            this.pendingOrders.set(this.selectedUnit, validatedOrder);
            
            // Update display
            this.updateOrdersList();
            this.hideUnitOrderInterface();
            
            // Notify callback
            if (this.onOrderChanged) {
                this.onOrderChanged();
            }
            
            showSuccess('Order created');
            
        } catch (error) {
            showError(error.message);
        }
    }

    /**
     * Remove order
     */
    removeOrder(unitId) {
        this.pendingOrders.delete(unitId);
        this.updateOrdersList();
        
        if (this.onOrderChanged) {
            this.onOrderChanged();
        }
    }

    /**
     * Clear all orders
     */
    clearAllOrders() {
        this.pendingOrders.clear();
        this.updateOrdersList();
        this.hideUnitOrderInterface();
        
        if (this.onOrderChanged) {
            this.onOrderChanged();
        }
    }

    /**
     * Cancel order creation
     */
    cancelOrderCreation() {
        this.currentOrderType = null;
        const targetSelector = $('#order-target-selector');
        if (targetSelector) {
            targetSelector.style.display = 'none';
        }
    }

    /**
     * Submit orders
     */
    async submitOrders() {
        if (this.pendingOrders.size === 0) {
            showError('No orders to submit');
            return;
        }

        try {
            const orders = Array.from(this.pendingOrders.values());
            await this.gameEngine.submitOrders(this.currentPlayerId, orders);
            
            this.pendingOrders.clear();
            this.updateOrdersList();
            this.updatePlayersSummary();
            
            if (this.onOrderSubmitted) {
                this.onOrderSubmitted(orders);
            }
            
            showSuccess('Orders submitted successfully');
            
        } catch (error) {
            showError(error.message);
        }
    }

    /**
     * Update chat target selector
     */
    updateChatTargets() {
        const selector = $('#chat-target-selector');
        if (!selector || !this.gameEngine.gameState) return;

        // Clear existing options except "All Players"
        selector.innerHTML = '<option value="all">All Players</option>';

        // Add player options
        for (const [playerId, player] of this.gameEngine.gameState.players) {
            if (playerId !== this.currentPlayerId) {
                const option = document.createElement('option');
                option.value = playerId;
                option.textContent = player.civilizationData.name;
                selector.appendChild(option);
            }
        }
    }

    /**
     * Send message
     */
    sendMessage() {
        const input = $('#chat-input');
        const selector = $('#chat-target-selector');
        
        if (!input || !selector) return;
        
        const message = input.value.trim();
        const target = selector.value;
        
        if (!message) return;

        // In a real implementation, this would send via Firebase
        console.log('Sending message:', { message, target, from: this.currentPlayerId });
        
        // Clear input
        input.value = '';
        
        // Add to chat display (placeholder)
        this.addChatMessage('You', message, 'outgoing');
    }

    /**
     * Add message to chat display
     */
    addChatMessage(sender, message, type = 'incoming') {
        const chatMessages = $('#chat-messages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${type}`;
        messageElement.innerHTML = `
            <div class="message-sender">${sender}</div>
            <div class="message-text">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        `;

        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    /**
     * Format season name
     */
    formatSeason(season) {
        return season.charAt(0).toUpperCase() + season.slice(1);
    }

    /**
     * Format phase name
     */
    formatPhase(phase) {
        switch (phase) {
            case GAME_PHASES.SPRING_ORDERS:
            case GAME_PHASES.FALL_ORDERS:
                return 'Orders';
            case GAME_PHASES.SPRING_RESOLUTION:
            case GAME_PHASES.FALL_RESOLUTION:
                return 'Resolution';
            case GAME_PHASES.WINTER_ADJUSTMENTS:
                return 'Adjustments';
            case GAME_PHASES.DIPLOMACY:
                return 'Diplomacy';
            default:
                return phase;
        }
    }

    /**
     * Show rules dialog
     */
    showRules() {
        // This would open a rules modal/dialog
        console.log('Show rules dialog');
    }

    /**
     * Show game history
     */
    showHistory() {
        // This would show game history/replay
        console.log('Show game history');
    }

    /**
     * Leave game
     */
    leaveGame() {
        if (confirm('Are you sure you want to leave this game?')) {
            // Navigate back to games list
            window.location.hash = 'games';
        }
    }

    /**
     * Set current player
     */
    setCurrentPlayer(playerId) {
        this.currentPlayerId = playerId;
        this.updateDisplay();
    }

    /**
     * Set callback functions
     */
    setCallbacks({ onOrderSubmitted, onOrderChanged }) {
        this.onOrderSubmitted = onOrderSubmitted;
        this.onOrderChanged = onOrderChanged;
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.eventCleanupFunctions.forEach(cleanup => cleanup());
        this.eventCleanupFunctions = [];
    }
}

export default GameUI;