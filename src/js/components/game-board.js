// ===== INTERACTIVE GAME BOARD COMPONENT =====

import { 
    MAP_REGIONS, 
    CIVILIZATIONS, 
    UNIT_TYPES, 
    REGION_TYPES, 
    TERRAIN_TYPES,
    UI_CONSTANTS 
} from '../utils/constants.js';
import { 
    $, 
    addEventListenerWithCleanup, 
    isMobile, 
    debounce 
} from '../utils/helpers.js';

/**
 * Interactive SVG-based game board for the ancient Middle East
 * Handles unit rendering, territory display, and touch/mouse interactions
 */
export class GameBoard {
    constructor(container, gameEngine) {
        this.container = container;
        this.gameEngine = gameEngine;
        this.svg = null;
        this.viewBox = { x: 0, y: 0, width: 600, height: 500 };
        this.scale = 1;
        this.isDragging = false;
        this.lastPanPoint = { x: 0, y: 0 };
        this.selectedUnit = null;
        this.hoveredRegion = null;
        this.eventCleanupFunctions = [];
        
        // Touch/gesture state
        this.touches = new Map();
        this.lastTouchDistance = 0;
        
        // Interaction callbacks
        this.onUnitSelected = null;
        this.onRegionClicked = null;
        this.onOrderCreated = null;
        
        this.initialize();
    }

    /**
     * Initialize the game board
     */
    initialize() {
        this.createSVG();
        this.renderMap();
        this.setupEventListeners();
        this.updateDisplay();
    }

    /**
     * Create the main SVG element
     */
    createSVG() {
        this.container.innerHTML = '';
        
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('class', 'game-board-svg');
        this.svg.setAttribute('viewBox', `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.width} ${this.viewBox.height}`);
        this.svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        
        // Create main groups for different layers
        this.regionsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.regionsGroup.setAttribute('class', 'regions-layer');
        
        this.unitsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.unitsGroup.setAttribute('class', 'units-layer');
        
        this.overlayGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        this.overlayGroup.setAttribute('class', 'overlay-layer');
        
        this.svg.appendChild(this.regionsGroup);
        this.svg.appendChild(this.unitsGroup);
        this.svg.appendChild(this.overlayGroup);
        
        this.container.appendChild(this.svg);
    }

    /**
     * Render the complete map
     */
    renderMap() {
        this.renderRegions();
        this.renderConnections();
        this.renderRegionLabels();
    }

    /**
     * Render all regions
     */
    renderRegions() {
        Object.entries(MAP_REGIONS).forEach(([regionId, region]) => {
            const regionElement = this.createRegionElement(regionId, region);
            this.regionsGroup.appendChild(regionElement);
        });
    }

    /**
     * Create a region element
     */
    createRegionElement(regionId, region) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', `region region-${regionId}`);
        group.setAttribute('data-region-id', regionId);

        // Create region shape based on type
        let shape;
        if (region.type === REGION_TYPES.SEA) {
            shape = this.createSeaRegion(region);
        } else {
            shape = this.createLandRegion(region);
        }

        group.appendChild(shape);

        // Add supply center indicator if applicable
        if (region.isSupplyCenter) {
            const scIndicator = this.createSupplyCenterIndicator(region);
            group.appendChild(scIndicator);
        }

        return group;
    }

    /**
     * Create land region shape
     */
    createLandRegion(region) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const size = this.getRegionSize(region.type);
        
        rect.setAttribute('x', region.coordinates.x - size.width / 2);
        rect.setAttribute('y', region.coordinates.y - size.height / 2);
        rect.setAttribute('width', size.width);
        rect.setAttribute('height', size.height);
        rect.setAttribute('rx', 8);
        rect.setAttribute('ry', 8);
        
        // Apply styling based on terrain and ownership
        const classes = ['region-shape', `terrain-${region.terrain}`];
        if (region.civilization) {
            classes.push(`owner-${region.civilization}`);
        }
        rect.setAttribute('class', classes.join(' '));
        
        return rect;
    }

    /**
     * Create sea region shape
     */
    createSeaRegion(region) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        
        circle.setAttribute('cx', region.coordinates.x);
        circle.setAttribute('cy', region.coordinates.y);
        circle.setAttribute('r', 25);
        circle.setAttribute('class', 'region-shape terrain-water');
        
        return circle;
    }

    /**
     * Create supply center indicator
     */
    createSupplyCenterIndicator(region) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        
        circle.setAttribute('cx', region.coordinates.x);
        circle.setAttribute('cy', region.coordinates.y + 20);
        circle.setAttribute('r', 6);
        circle.setAttribute('class', 'supply-center-indicator');
        
        return circle;
    }

    /**
     * Get region size based on type
     */
    getRegionSize(regionType) {
        switch (regionType) {
            case REGION_TYPES.LAND:
                return { width: 40, height: 30 };
            case REGION_TYPES.COAST:
                return { width: 45, height: 35 };
            default:
                return { width: 35, height: 25 };
        }
    }

    /**
     * Render connections between adjacent regions
     */
    renderConnections() {
        const drawnConnections = new Set();
        
        Object.entries(MAP_REGIONS).forEach(([regionId, region]) => {
            region.adjacentRegions.forEach(adjacentId => {
                const connectionKey = [regionId, adjacentId].sort().join('-');
                
                if (!drawnConnections.has(connectionKey)) {
                    const adjacentRegion = MAP_REGIONS[adjacentId];
                    if (adjacentRegion) {
                        const line = this.createConnectionLine(region, adjacentRegion);
                        this.regionsGroup.appendChild(line);
                        drawnConnections.add(connectionKey);
                    }
                }
            });
        });
    }

    /**
     * Create connection line between regions
     */
    createConnectionLine(region1, region2) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        
        line.setAttribute('x1', region1.coordinates.x);
        line.setAttribute('y1', region1.coordinates.y);
        line.setAttribute('x2', region2.coordinates.x);
        line.setAttribute('y2', region2.coordinates.y);
        line.setAttribute('class', 'region-connection');
        
        return line;
    }

    /**
     * Render region labels
     */
    renderRegionLabels() {
        Object.entries(MAP_REGIONS).forEach(([regionId, region]) => {
            const label = this.createRegionLabel(region);
            this.regionsGroup.appendChild(label);
        });
    }

    /**
     * Create region label
     */
    createRegionLabel(region) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        
        text.setAttribute('x', region.coordinates.x);
        text.setAttribute('y', region.coordinates.y - 25);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('class', 'region-label');
        text.textContent = region.name;
        
        return text;
    }

    /**
     * Update display with current game state
     */
    updateDisplay() {
        if (!this.gameEngine || !this.gameEngine.gameState) return;
        
        this.updateSupplyCenterOwnership();
        this.updateUnits();
        this.updateOrderDisplay();
    }

    /**
     * Update supply center ownership display
     */
    updateSupplyCenterOwnership() {
        const gameState = this.gameEngine.gameState;
        
        for (const [regionId, supplyCenter] of gameState.supplyCenters) {
            const regionElement = this.svg.querySelector(`[data-region-id="${regionId}"]`);
            if (regionElement) {
                // Remove old owner classes
                Object.keys(CIVILIZATIONS).forEach(civ => {
                    regionElement.classList.remove(`owner-${civ.toLowerCase()}`);
                });
                
                // Add new owner class
                if (supplyCenter.owner) {
                    regionElement.classList.add(`owner-${supplyCenter.owner}`);
                }
            }
        }
    }

    /**
     * Update unit display
     */
    updateUnits() {
        // Clear existing units
        this.unitsGroup.innerHTML = '';
        
        const gameState = this.gameEngine.gameState;
        
        for (const [unitId, unit] of gameState.units) {
            const unitElement = this.createUnitElement(unit);
            this.unitsGroup.appendChild(unitElement);
        }
    }

    /**
     * Create unit element
     */
    createUnitElement(unit) {
        const region = MAP_REGIONS[unit.regionId];
        if (!region) return null;
        
        const player = this.gameEngine.gameState.players.get(unit.playerId);
        if (!player) return null;
        
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', `unit unit-${unit.type}`);
        group.setAttribute('data-unit-id', unit.id);
        group.setAttribute('data-player-id', unit.playerId);
        
        // Unit background circle
        const background = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        background.setAttribute('cx', region.coordinates.x);
        background.setAttribute('cy', region.coordinates.y);
        background.setAttribute('r', 12);
        background.setAttribute('class', 'unit-background');
        background.setAttribute('fill', player.civilizationData.color);
        
        // Unit symbol
        const symbol = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        symbol.setAttribute('x', region.coordinates.x);
        symbol.setAttribute('y', region.coordinates.y + 4);
        symbol.setAttribute('text-anchor', 'middle');
        symbol.setAttribute('class', 'unit-symbol');
        symbol.textContent = UNIT_TYPES[unit.type.toUpperCase()].symbol;
        
        group.appendChild(background);
        group.appendChild(symbol);
        
        return group;
    }

    /**
     * Update order display
     */
    updateOrderDisplay() {
        // Clear existing order overlays
        this.overlayGroup.innerHTML = '';
        
        if (!this.gameEngine.gameState) return;
        
        for (const [orderId, order] of this.gameEngine.gameState.orders) {
            const orderElement = this.createOrderElement(order);
            if (orderElement) {
                this.overlayGroup.appendChild(orderElement);
            }
        }
    }

    /**
     * Create order visualization element
     */
    createOrderElement(order) {
        const unit = this.gameEngine.gameState.units.get(order.unitId);
        if (!unit) return null;
        
        const fromRegion = MAP_REGIONS[order.from];
        if (!fromRegion) return null;
        
        switch (order.type) {
            case 'move':
                return this.createMoveOrderElement(order, fromRegion);
            case 'support':
                return this.createSupportOrderElement(order, fromRegion);
            case 'convoy':
                return this.createConvoyOrderElement(order, fromRegion);
            default:
                return null;
        }
    }

    /**
     * Create move order visualization
     */
    createMoveOrderElement(order, fromRegion) {
        const toRegion = MAP_REGIONS[order.to];
        if (!toRegion) return null;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromRegion.coordinates.x);
        line.setAttribute('y1', fromRegion.coordinates.y);
        line.setAttribute('x2', toRegion.coordinates.x);
        line.setAttribute('y2', toRegion.coordinates.y);
        line.setAttribute('class', `order-arrow order-move ${order.status}`);
        line.setAttribute('marker-end', 'url(#arrowhead)');
        
        return line;
    }

    /**
     * Create support order visualization
     */
    createSupportOrderElement(order, fromRegion) {
        const targetRegion = MAP_REGIONS[order.supportTarget];
        if (!targetRegion) return null;
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromRegion.coordinates.x);
        line.setAttribute('y1', fromRegion.coordinates.y);
        line.setAttribute('x2', targetRegion.coordinates.x);
        line.setAttribute('y2', targetRegion.coordinates.y);
        line.setAttribute('class', `order-arrow order-support ${order.status}`);
        line.setAttribute('stroke-dasharray', '5,5');
        
        return line;
    }

    /**
     * Create convoy order visualization
     */
    createConvoyOrderElement(order, fromRegion) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'order-convoy');
        
        // Convoy indicator circle
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', fromRegion.coordinates.x);
        circle.setAttribute('cy', fromRegion.coordinates.y);
        circle.setAttribute('r', 18);
        circle.setAttribute('class', 'convoy-indicator');
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#3B82F6');
        circle.setAttribute('stroke-width', '2');
        circle.setAttribute('stroke-dasharray', '3,3');
        
        group.appendChild(circle);
        return group;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (isMobile()) {
            this.setupTouchEvents();
        } else {
            this.setupMouseEvents();
        }
        
        // Window resize
        const resizeHandler = debounce(() => this.handleResize(), 300);
        addEventListenerWithCleanup(window, 'resize', resizeHandler, this.eventCleanupFunctions);
    }

    /**
     * Setup touch events for mobile
     */
    setupTouchEvents() {
        addEventListenerWithCleanup(this.svg, 'touchstart', (e) => this.handleTouchStart(e), this.eventCleanupFunctions);
        addEventListenerWithCleanup(this.svg, 'touchmove', (e) => this.handleTouchMove(e), this.eventCleanupFunctions);
        addEventListenerWithCleanup(this.svg, 'touchend', (e) => this.handleTouchEnd(e), this.eventCleanupFunctions);
        addEventListenerWithCleanup(this.svg, 'touchcancel', (e) => this.handleTouchEnd(e), this.eventCleanupFunctions);
    }

    /**
     * Setup mouse events for desktop
     */
    setupMouseEvents() {
        addEventListenerWithCleanup(this.svg, 'mousedown', (e) => this.handleMouseDown(e), this.eventCleanupFunctions);
        addEventListenerWithCleanup(this.svg, 'mousemove', (e) => this.handleMouseMove(e), this.eventCleanupFunctions);
        addEventListenerWithCleanup(this.svg, 'mouseup', (e) => this.handleMouseUp(e), this.eventCleanupFunctions);
        addEventListenerWithCleanup(this.svg, 'click', (e) => this.handleClick(e), this.eventCleanupFunctions);
        addEventListenerWithCleanup(this.svg, 'wheel', (e) => this.handleWheel(e), this.eventCleanupFunctions);
    }

    /**
     * Handle touch start
     */
    handleTouchStart(e) {
        e.preventDefault();
        
        Array.from(e.changedTouches).forEach(touch => {
            this.touches.set(touch.identifier, {
                x: touch.clientX,
                y: touch.clientY,
                startTime: Date.now()
            });
        });
        
        if (this.touches.size === 2) {
            // Start pinch zoom
            const touches = Array.from(this.touches.values());
            this.lastTouchDistance = this.getTouchDistance(touches[0], touches[1]);
        }
    }

    /**
     * Handle touch move
     */
    handleTouchMove(e) {
        e.preventDefault();
        
        if (this.touches.size === 1) {
            // Pan
            const touch = e.touches[0];
            const startTouch = this.touches.get(touch.identifier);
            
            if (startTouch) {
                const deltaX = touch.clientX - startTouch.x;
                const deltaY = touch.clientY - startTouch.y;
                this.pan(deltaX, deltaY);
                
                // Update start position
                startTouch.x = touch.clientX;
                startTouch.y = touch.clientY;
            }
        } else if (this.touches.size === 2) {
            // Pinch zoom
            const touches = Array.from(e.touches);
            const currentDistance = this.getTouchDistance(touches[0], touches[1]);
            const zoomFactor = currentDistance / this.lastTouchDistance;
            
            this.zoom(zoomFactor, {
                x: (touches[0].clientX + touches[1].clientX) / 2,
                y: (touches[0].clientY + touches[1].clientY) / 2
            });
            
            this.lastTouchDistance = currentDistance;
        }
    }

    /**
     * Handle touch end
     */
    handleTouchEnd(e) {
        Array.from(e.changedTouches).forEach(touch => {
            const startTouch = this.touches.get(touch.identifier);
            
            if (startTouch) {
                const duration = Date.now() - startTouch.startTime;
                const deltaX = Math.abs(touch.clientX - startTouch.x);
                const deltaY = Math.abs(touch.clientY - startTouch.y);
                
                // Check for tap (short duration, minimal movement)
                if (duration < 300 && deltaX < 10 && deltaY < 10) {
                    this.handleTap(touch.clientX, touch.clientY);
                }
            }
            
            this.touches.delete(touch.identifier);
        });
    }

    /**
     * Handle mouse events
     */
    handleMouseDown(e) {
        if (e.button === 0) { // Left click
            this.isDragging = true;
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
        }
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            const deltaX = e.clientX - this.lastPanPoint.x;
            const deltaY = e.clientY - this.lastPanPoint.y;
            this.pan(deltaX, deltaY);
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
        }
    }

    handleMouseUp(e) {
        this.isDragging = false;
    }

    handleClick(e) {
        if (!this.isDragging) {
            this.handleTap(e.clientX, e.clientY);
        }
    }

    handleWheel(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom(zoomFactor, { x: e.clientX, y: e.clientY });
    }

    /**
     * Handle tap/click on board
     */
    handleTap(clientX, clientY) {
        const svgPoint = this.clientToSVGPoint(clientX, clientY);
        const element = document.elementFromPoint(clientX, clientY);
        
        // Check if clicked on unit
        const unitElement = element.closest('.unit');
        if (unitElement) {
            const unitId = unitElement.getAttribute('data-unit-id');
            this.selectUnit(unitId);
            return;
        }
        
        // Check if clicked on region
        const regionElement = element.closest('.region');
        if (regionElement) {
            const regionId = regionElement.getAttribute('data-region-id');
            this.selectRegion(regionId);
            return;
        }
        
        // Clicked on empty space - deselect
        this.clearSelection();
    }

    /**
     * Convert client coordinates to SVG coordinates
     */
    clientToSVGPoint(clientX, clientY) {
        const rect = this.svg.getBoundingClientRect();
        const x = (clientX - rect.left) * this.viewBox.width / rect.width + this.viewBox.x;
        const y = (clientY - rect.top) * this.viewBox.height / rect.height + this.viewBox.y;
        return { x, y };
    }

    /**
     * Pan the view
     */
    pan(deltaX, deltaY) {
        const rect = this.svg.getBoundingClientRect();
        const scaleX = this.viewBox.width / rect.width;
        const scaleY = this.viewBox.height / rect.height;
        
        this.viewBox.x -= deltaX * scaleX;
        this.viewBox.y -= deltaY * scaleY;
        
        this.updateViewBox();
    }

    /**
     * Zoom the view
     */
    zoom(factor, center) {
        const rect = this.svg.getBoundingClientRect();
        const centerX = (center.x - rect.left) * this.viewBox.width / rect.width + this.viewBox.x;
        const centerY = (center.y - rect.top) * this.viewBox.height / rect.height + this.viewBox.y;
        
        const newWidth = this.viewBox.width / factor;
        const newHeight = this.viewBox.height / factor;
        
        // Constrain zoom levels
        if (newWidth < 200 || newWidth > 1200) return;
        
        this.viewBox.x = centerX - (centerX - this.viewBox.x) / factor;
        this.viewBox.y = centerY - (centerY - this.viewBox.y) / factor;
        this.viewBox.width = newWidth;
        this.viewBox.height = newHeight;
        
        this.updateViewBox();
    }

    /**
     * Update SVG viewBox
     */
    updateViewBox() {
        this.svg.setAttribute('viewBox', 
            `${this.viewBox.x} ${this.viewBox.y} ${this.viewBox.width} ${this.viewBox.height}`);
    }

    /**
     * Get distance between two touch points
     */
    getTouchDistance(touch1, touch2) {
        const dx = touch1.x - touch2.x;
        const dy = touch1.y - touch2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Select a unit
     */
    selectUnit(unitId) {
        this.clearSelection();
        this.selectedUnit = unitId;
        
        const unitElement = this.svg.querySelector(`[data-unit-id="${unitId}"]`);
        if (unitElement) {
            unitElement.classList.add('selected');
        }
        
        if (this.onUnitSelected) {
            this.onUnitSelected(unitId);
        }
    }

    /**
     * Select a region
     */
    selectRegion(regionId) {
        if (this.selectedUnit) {
            // Try to create order from selected unit to this region
            if (this.onOrderCreated) {
                this.onOrderCreated(this.selectedUnit, regionId);
            }
        } else {
            if (this.onRegionClicked) {
                this.onRegionClicked(regionId);
            }
        }
    }

    /**
     * Clear all selections
     */
    clearSelection() {
        if (this.selectedUnit) {
            const unitElement = this.svg.querySelector(`[data-unit-id="${this.selectedUnit}"]`);
            if (unitElement) {
                unitElement.classList.remove('selected');
            }
            this.selectedUnit = null;
        }
        
        // Clear region highlights
        this.svg.querySelectorAll('.region.highlighted').forEach(element => {
            element.classList.remove('highlighted');
        });
    }

    /**
     * Highlight valid move targets for selected unit
     */
    highlightValidMoves(unitId) {
        this.clearHighlights();
        
        const unit = this.gameEngine.gameState.units.get(unitId);
        if (!unit) return;
        
        const currentRegion = MAP_REGIONS[unit.regionId];
        if (!currentRegion) return;
        
        // Highlight adjacent regions based on unit type
        const unitType = UNIT_TYPES[unit.type.toUpperCase()];
        currentRegion.adjacentRegions.forEach(regionId => {
            const region = MAP_REGIONS[regionId];
            if (region && unitType.validTerrain.includes(region.type)) {
                const regionElement = this.svg.querySelector(`[data-region-id="${regionId}"]`);
                if (regionElement) {
                    regionElement.classList.add('valid-move');
                }
            }
        });
    }

    /**
     * Clear all highlights
     */
    clearHighlights() {
        this.svg.querySelectorAll('.valid-move, .highlighted').forEach(element => {
            element.classList.remove('valid-move', 'highlighted');
        });
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Update SVG dimensions if needed
        const containerRect = this.container.getBoundingClientRect();
        if (containerRect.width > 0 && containerRect.height > 0) {
            this.updateViewBox();
        }
    }

    /**
     * Set interaction callbacks
     */
    setCallbacks({ onUnitSelected, onRegionClicked, onOrderCreated }) {
        this.onUnitSelected = onUnitSelected;
        this.onRegionClicked = onRegionClicked;
        this.onOrderCreated = onOrderCreated;
    }

    /**
     * Reset view to show entire map
     */
    resetView() {
        this.viewBox = { x: 0, y: 0, width: 600, height: 500 };
        this.updateViewBox();
    }

    /**
     * Cleanup resources
     */
    destroy() {
        this.eventCleanupFunctions.forEach(cleanup => cleanup());
        this.eventCleanupFunctions = [];
        
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

export default GameBoard;