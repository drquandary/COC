// ===== DIPLOMACY GAME ENGINE =====

import { 
    GAME_CONFIG, 
    GAME_PHASES, 
    SEASONS, 
    CIVILIZATIONS, 
    UNIT_TYPES, 
    ORDER_TYPES, 
    REGION_TYPES, 
    MAP_REGIONS 
} from '../utils/constants.js';
import { logError } from '../utils/helpers.js';

/**
 * Core Diplomacy game engine
 * Manages game state, unit movement, order resolution, and victory conditions
 */
export class GameEngine {
    constructor() {
        this.gameState = null;
        this.turnNumber = 1;
        this.currentSeason = SEASONS.SPRING;
        this.currentPhase = GAME_PHASES.SPRING_ORDERS;
        this.players = new Map();
        this.units = new Map();
        this.orders = new Map();
        this.supplyCenters = new Map();
    }

    /**
     * Initialize a new game
     */
    initializeGame(gameData) {
        this.gameState = {
            id: gameData.id,
            name: gameData.name,
            status: gameData.status,
            phase: GAME_PHASES.SPRING_ORDERS,
            season: SEASONS.SPRING,
            year: 1,
            turnNumber: 1,
            players: new Map(),
            units: new Map(),
            orders: new Map(),
            supplyCenters: new Map(),
            createdAt: gameData.createdAt,
            lastUpdated: Date.now()
        };

        this.initializeSupplyCenters();
        return this.gameState;
    }

    /**
     * Initialize supply centers with their starting ownership
     */
    initializeSupplyCenters() {
        Object.entries(MAP_REGIONS).forEach(([regionId, region]) => {
            if (region.isSupplyCenter) {
                this.gameState.supplyCenters.set(regionId, {
                    id: regionId,
                    name: region.name,
                    owner: region.civilization || null,
                    contested: false
                });
            }
        });
    }

    /**
     * Add a player to the game
     */
    addPlayer(playerId, civilization, userId) {
        const civData = CIVILIZATIONS[civilization.toUpperCase()];
        if (!civData) {
            throw new Error(`Invalid civilization: ${civilization}`);
        }

        const player = {
            id: playerId,
            userId: userId,
            civilization: civilization,
            civilizationData: civData,
            supplyCenters: [...civData.startingRegions.filter(region => 
                MAP_REGIONS[region]?.isSupplyCenter
            )],
            units: [],
            hasSubmittedOrders: false,
            isEliminated: false,
            orderDeadlineExtensions: 0
        };

        this.gameState.players.set(playerId, player);
        this.initializePlayerUnits(player);
        return player;
    }

    /**
     * Initialize starting units for a player
     */
    initializePlayerUnits(player) {
        const civData = player.civilizationData;
        
        console.log('🔍 DEBUG: Initializing units for player:', player.civilization);
        console.log('🔍 DEBUG: Starting regions:', civData.startingRegions);
        
        civData.startingRegions.forEach(regionId => {
            console.log('🔍 DEBUG: Processing region:', regionId);
            const region = MAP_REGIONS[regionId];
            if (!region) {
                console.log('❌ DEBUG: Region not found in MAP_REGIONS:', regionId);
                return;
            }

            let unitType;
            if (region.type === REGION_TYPES.SEA) {
                unitType = UNIT_TYPES.FLEET.id;
            } else if (region.type === REGION_TYPES.COAST) {
                // Start with fleet in coastal regions by default
                unitType = UNIT_TYPES.FLEET.id;
            } else {
                unitType = UNIT_TYPES.ARMY.id;
            }

            console.log('🔍 DEBUG: Creating unit - type:', unitType, 'regionId:', regionId, 'playerId:', player.id);
            const unit = this.createUnit(unitType, regionId, player.id);
            
            // DIAGNOSTIC: Check if JSON.stringify triggers download
            console.log('🔍 DEBUG: About to log unit JSON - checking for download trigger');
            console.log('🔍 DEBUG: Created unit:', JSON.stringify(unit, null, 2));
            console.log('🔍 DEBUG: JSON logging completed - did download occur?');
            
            this.gameState.units.set(unit.id, unit);
            player.units.push(unit.id);
        });
        
        console.log('🔍 DEBUG: Total units created:', this.gameState.units.size);
    }

    /**
     * Create a new unit
     */
    createUnit(type, regionId, playerId) {
        const unitId = `${playerId}_${type}_${regionId}_${Date.now()}`;
        return {
            id: unitId,
            type: type,
            region: regionId,        // Use 'region' for consistency
            regionId: regionId,      // Keep regionId for backwards compatibility
            playerId: playerId,
            canRetreat: false,
            isRetreating: false,
            mustRetreat: false,
            dislodged: false
        };
    }

    /**
     * Submit orders for a player
     */
    submitOrders(playerId, orders) {
        if (!this.gameState.players.has(playerId)) {
            throw new Error('Player not found');
        }

        // Validate phase
        if (![GAME_PHASES.SPRING_ORDERS, GAME_PHASES.FALL_ORDERS, GAME_PHASES.WINTER_ADJUSTMENTS].includes(this.gameState.phase)) {
            throw new Error('Not in order submission phase');
        }

        // Clear existing orders for this player
        for (const [orderId, order] of this.gameState.orders) {
            if (order.playerId === playerId) {
                this.gameState.orders.delete(orderId);
            }
        }

        // Validate and store new orders
        orders.forEach(orderData => {
            const order = this.validateOrder(orderData, playerId);
            this.gameState.orders.set(order.id, order);
        });

        // Mark player as having submitted orders
        const player = this.gameState.players.get(playerId);
        player.hasSubmittedOrders = true;

        return true;
    }

    /**
     * Validate an order
     */
    validateOrder(orderData, playerId) {
        const { unitId, type, target, supportTarget } = orderData;
        
        // Check if unit exists and belongs to player
        const unit = this.gameState.units.get(unitId);
        if (!unit || unit.playerId !== playerId) {
            throw new Error('Invalid unit');
        }

        // Check if order type is valid
        if (!ORDER_TYPES[type.toUpperCase()]) {
            throw new Error('Invalid order type');
        }

        // Validate order based on type
        switch (type.toLowerCase()) {
            case ORDER_TYPES.HOLD.id:
                return this.validateHoldOrder(unit, orderData);
            case ORDER_TYPES.MOVE.id:
                return this.validateMoveOrder(unit, orderData);
            case ORDER_TYPES.SUPPORT.id:
                return this.validateSupportOrder(unit, orderData);
            case ORDER_TYPES.CONVOY.id:
                return this.validateConvoyOrder(unit, orderData);
            case ORDER_TYPES.BUILD.id:
                return this.validateBuildOrder(unit, orderData, playerId);
            case ORDER_TYPES.DISBAND.id:
                return this.validateDisbandOrder(unit, orderData);
            default:
                throw new Error('Unsupported order type');
        }
    }

    /**
     * Validate hold order
     */
    validateHoldOrder(unit, orderData) {
        return {
            id: `${unit.id}_hold_${Date.now()}`,
            type: ORDER_TYPES.HOLD.id,
            unitId: unit.id,
            playerId: unit.playerId,
            from: unit.regionId,
            status: 'pending'
        };
    }

    /**
     * Validate move order
     */
    validateMoveOrder(unit, orderData) {
        const { target } = orderData;
        
        if (!target || !MAP_REGIONS[target]) {
            throw new Error('Invalid target region');
        }

        // Check if move is to adjacent region
        const currentRegion = MAP_REGIONS[unit.regionId];
        if (!currentRegion.adjacentRegions.includes(target)) {
            throw new Error('Cannot move to non-adjacent region');
        }

        // Check terrain compatibility
        const targetRegion = MAP_REGIONS[target];
        const unitType = UNIT_TYPES[unit.type.toUpperCase()];
        
        if (!unitType.validTerrain.includes(targetRegion.type)) {
            throw new Error('Unit cannot move to this terrain type');
        }

        return {
            id: `${unit.id}_move_${Date.now()}`,
            type: ORDER_TYPES.MOVE.id,
            unitId: unit.id,
            playerId: unit.playerId,
            from: unit.regionId,
            to: target,
            status: 'pending'
        };
    }

    /**
     * Validate support order
     */
    validateSupportOrder(unit, orderData) {
        const { target, supportTarget } = orderData;
        
        if (!target || !supportTarget) {
            throw new Error('Support order requires target unit and support target');
        }

        const supportedUnit = this.gameState.units.get(target);
        if (!supportedUnit) {
            throw new Error('Supported unit does not exist');
        }

        if (!MAP_REGIONS[supportTarget]) {
            throw new Error('Invalid support target region');
        }

        return {
            id: `${unit.id}_support_${Date.now()}`,
            type: ORDER_TYPES.SUPPORT.id,
            unitId: unit.id,
            playerId: unit.playerId,
            from: unit.regionId,
            supportedUnit: target,
            supportTarget: supportTarget,
            status: 'pending'
        };
    }

    /**
     * Validate convoy order
     */
    validateConvoyOrder(unit, orderData) {
        const { target, convoyFrom, convoyTo } = orderData;
        
        // Only fleets can convoy
        if (unit.type !== UNIT_TYPES.FLEET.id) {
            throw new Error('Only fleets can convoy');
        }

        // Fleet must be in sea region
        const currentRegion = MAP_REGIONS[unit.regionId];
        if (currentRegion.type !== REGION_TYPES.SEA) {
            throw new Error('Fleet must be in sea region to convoy');
        }

        return {
            id: `${unit.id}_convoy_${Date.now()}`,
            type: ORDER_TYPES.CONVOY.id,
            unitId: unit.id,
            playerId: unit.playerId,
            from: unit.regionId,
            convoyedUnit: target,
            convoyFrom: convoyFrom,
            convoyTo: convoyTo,
            status: 'pending'
        };
    }

    /**
     * Validate build order
     */
    validateBuildOrder(unit, orderData, playerId) {
        const { unitType, location } = orderData;
        
        // Check if it's winter adjustment phase
        if (this.gameState.phase !== GAME_PHASES.WINTER_ADJUSTMENTS) {
            throw new Error('Can only build during winter adjustments');
        }

        const player = this.gameState.players.get(playerId);
        const supplyCenterCount = player.supplyCenters.length;
        const unitCount = player.units.length;
        
        if (unitCount >= supplyCenterCount) {
            throw new Error('Cannot build more units than supply centers');
        }

        return {
            id: `${playerId}_build_${Date.now()}`,
            type: ORDER_TYPES.BUILD.id,
            playerId: playerId,
            unitType: unitType,
            location: location,
            status: 'pending'
        };
    }

    /**
     * Validate disband order
     */
    validateDisbandOrder(unit, orderData) {
        return {
            id: `${unit.id}_disband_${Date.now()}`,
            type: ORDER_TYPES.DISBAND.id,
            unitId: unit.id,
            playerId: unit.playerId,
            from: unit.regionId,
            status: 'pending'
        };
    }

    /**
     * Process turn resolution
     */
    async resolveTurn() {
        try {
            console.log(`Resolving turn ${this.gameState.turnNumber}, ${this.gameState.season} ${this.gameState.year}`);

            if (this.gameState.phase === GAME_PHASES.SPRING_ORDERS) {
                await this.resolveMovementPhase();
                this.gameState.phase = GAME_PHASES.SPRING_RESOLUTION;
            } else if (this.gameState.phase === GAME_PHASES.FALL_ORDERS) {
                await this.resolveMovementPhase();
                this.updateSupplyCenterOwnership();
                this.gameState.phase = GAME_PHASES.WINTER_ADJUSTMENTS;
            } else if (this.gameState.phase === GAME_PHASES.WINTER_ADJUSTMENTS) {
                await this.resolveAdjustmentPhase();
                this.advanceTurn();
            }

            // Check victory conditions
            const winner = this.checkVictoryConditions();
            if (winner) {
                this.gameState.phase = GAME_PHASES.COMPLETED;
                this.gameState.winner = winner;
            }

            this.gameState.lastUpdated = Date.now();
            return this.gameState;

        } catch (error) {
            logError('GameEngine.resolveTurn', error);
            throw error;
        }
    }

    /**
     * Resolve movement phase
     */
    async resolveMovementPhase() {
        const conflicts = new Map();
        const moves = new Map();
        const supports = new Map();
        const convoys = new Map();

        // Categorize orders
        for (const [orderId, order] of this.gameState.orders) {
            switch (order.type) {
                case ORDER_TYPES.MOVE.id:
                    if (!moves.has(order.to)) {
                        moves.set(order.to, []);
                    }
                    moves.get(order.to).push(order);
                    break;
                case ORDER_TYPES.SUPPORT.id:
                    supports.set(orderId, order);
                    break;
                case ORDER_TYPES.CONVOY.id:
                    convoys.set(orderId, order);
                    break;
            }
        }

        // Resolve conflicts
        for (const [regionId, movingUnits] of moves) {
            if (movingUnits.length > 1) {
                const winner = this.resolveConflict(regionId, movingUnits, supports);
                if (winner) {
                    this.executeMove(winner);
                    // Mark other moves as failed
                    movingUnits.forEach(order => {
                        if (order !== winner) {
                            order.status = 'failed';
                        }
                    });
                } else {
                    // Standoff - all moves fail
                    movingUnits.forEach(order => {
                        order.status = 'failed';
                    });
                }
            } else if (movingUnits.length === 1) {
                this.executeMove(movingUnits[0]);
            }
        }

        // Clear orders for next phase
        this.clearPlayerOrders();
    }

    /**
     * Resolve conflict between multiple units moving to same region
     */
    resolveConflict(regionId, movingUnits, supports) {
        const unitStrengths = new Map();

        // Calculate base strength (1) + support for each unit
        movingUnits.forEach(order => {
            let strength = 1;
            
            // Count supporting units
            for (const [supportId, support] of supports) {
                if (support.supportedUnit === order.unitId && 
                    support.supportTarget === regionId) {
                    strength++;
                }
            }
            
            unitStrengths.set(order.unitId, strength);
        });

        // Find highest strength
        let maxStrength = 0;
        let winners = [];
        
        for (const [unitId, strength] of unitStrengths) {
            if (strength > maxStrength) {
                maxStrength = strength;
                winners = [unitId];
            } else if (strength === maxStrength) {
                winners.push(unitId);
            }
        }

        // If tie, no one wins (standoff)
        if (winners.length > 1) {
            return null;
        }

        // Return winning order
        return movingUnits.find(order => order.unitId === winners[0]);
    }

    /**
     * Execute a successful move
     */
    executeMove(order) {
        const unit = this.gameState.units.get(order.unitId);
        if (unit) {
            unit.regionId = order.to;
            order.status = 'successful';
        }
    }

    /**
     * Update supply center ownership after fall movement
     */
    updateSupplyCenterOwnership() {
        for (const [regionId, supplyCenter] of this.gameState.supplyCenters) {
            // Find if any unit is in this supply center
            let occupyingUnit = null;
            for (const [unitId, unit] of this.gameState.units) {
                if (unit.regionId === regionId) {
                    occupyingUnit = unit;
                    break;
                }
            }

            if (occupyingUnit) {
                const oldOwner = supplyCenter.owner;
                const newOwner = this.getPlayerCivilization(occupyingUnit.playerId);
                
                if (oldOwner !== newOwner) {
                    // Transfer ownership
                    supplyCenter.owner = newOwner;
                    
                    // Update player supply center lists
                    if (oldOwner) {
                        const oldPlayer = this.getPlayerByCivilization(oldOwner);
                        if (oldPlayer) {
                            oldPlayer.supplyCenters = oldPlayer.supplyCenters.filter(sc => sc !== regionId);
                        }
                    }
                    
                    const newPlayer = this.gameState.players.get(occupyingUnit.playerId);
                    if (newPlayer && !newPlayer.supplyCenters.includes(regionId)) {
                        newPlayer.supplyCenters.push(regionId);
                    }
                }
            }
        }
    }

    /**
     * Resolve adjustment phase (winter)
     */
    async resolveAdjustmentPhase() {
        for (const [playerId, player] of this.gameState.players) {
            const supplyCenterCount = player.supplyCenters.length;
            const unitCount = player.units.length;
            
            if (supplyCenterCount > unitCount) {
                // Player can build units
                this.processBuildOrders(playerId, supplyCenterCount - unitCount);
            } else if (unitCount > supplyCenterCount) {
                // Player must disband units
                this.processDisbandOrders(playerId, unitCount - supplyCenterCount);
            }
        }
    }

    /**
     * Process build orders for a player
     */
    processBuildOrders(playerId, maxBuilds) {
        let buildsProcessed = 0;
        
        for (const [orderId, order] of this.gameState.orders) {
            if (order.playerId === playerId && 
                order.type === ORDER_TYPES.BUILD.id && 
                buildsProcessed < maxBuilds) {
                
                const newUnit = this.createUnit(order.unitType, order.location, playerId);
                this.gameState.units.set(newUnit.id, newUnit);
                
                const player = this.gameState.players.get(playerId);
                player.units.push(newUnit.id);
                
                order.status = 'successful';
                buildsProcessed++;
            }
        }
    }

    /**
     * Process disband orders for a player
     */
    processDisbandOrders(playerId, requiredDisbands) {
        let disbandsProcessed = 0;
        
        for (const [orderId, order] of this.gameState.orders) {
            if (order.playerId === playerId && 
                order.type === ORDER_TYPES.DISBAND.id && 
                disbandsProcessed < requiredDisbands) {
                
                this.gameState.units.delete(order.unitId);
                
                const player = this.gameState.players.get(playerId);
                player.units = player.units.filter(unitId => unitId !== order.unitId);
                
                order.status = 'successful';
                disbandsProcessed++;
            }
        }
    }

    /**
     * Advance to next turn
     */
    advanceTurn() {
        if (this.gameState.season === SEASONS.SPRING) {
            this.gameState.season = SEASONS.FALL;
            this.gameState.phase = GAME_PHASES.FALL_ORDERS;
        } else {
            this.gameState.season = SEASONS.SPRING;
            this.gameState.phase = GAME_PHASES.SPRING_ORDERS;
            this.gameState.year++;
        }
        
        this.gameState.turnNumber++;
        this.clearPlayerOrders();
    }

    /**
     * Clear all player orders and reset submission status
     */
    clearPlayerOrders() {
        this.gameState.orders.clear();
        
        for (const [playerId, player] of this.gameState.players) {
            player.hasSubmittedOrders = false;
        }
    }

    /**
     * Check victory conditions
     */
    checkVictoryConditions() {
        for (const [playerId, player] of this.gameState.players) {
            if (player.supplyCenters.length >= GAME_CONFIG.VICTORY_SUPPLY_CENTERS) {
                return {
                    playerId: playerId,
                    civilization: player.civilization,
                    supplyCenterCount: player.supplyCenters.length
                };
            }
        }
        return null;
    }

    /**
     * Check if all players have submitted orders
     */
    allPlayersSubmitted() {
        for (const [playerId, player] of this.gameState.players) {
            if (!player.isEliminated && !player.hasSubmittedOrders) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get player civilization ID
     */
    getPlayerCivilization(playerId) {
        const player = this.gameState.players.get(playerId);
        return player ? player.civilization : null;
    }

    /**
     * Get player by civilization
     */
    getPlayerByCivilization(civilization) {
        for (const [playerId, player] of this.gameState.players) {
            if (player.civilization === civilization) {
                return player;
            }
        }
        return null;
    }

    /**
     * Get current game state
     */
    getGameState() {
        return {
            ...this.gameState,
            players: Array.from(this.gameState.players.entries()).map(([id, player]) => ({
                id,
                ...player
            })),
            units: Array.from(this.gameState.units.entries()).map(([id, unit]) => ({
                id,
                ...unit
            })),
            orders: Array.from(this.gameState.orders.entries()).map(([id, order]) => ({
                id,
                ...order
            })),
            supplyCenters: Array.from(this.gameState.supplyCenters.entries()).map(([id, sc]) => ({
                id,
                ...sc
            }))
        };
    }

    /**
     * Validate game state
     */
    validateGameState() {
        const errors = [];

        // Check player count
        if (this.gameState.players.size < GAME_CONFIG.MIN_PLAYERS) {
            errors.push(`Insufficient players: ${this.gameState.players.size}/${GAME_CONFIG.MIN_PLAYERS}`);
        }

        if (this.gameState.players.size > GAME_CONFIG.MAX_PLAYERS) {
            errors.push(`Too many players: ${this.gameState.players.size}/${GAME_CONFIG.MAX_PLAYERS}`);
        }

        // Check supply center totals
        const totalSupplyCenters = this.gameState.supplyCenters.size;
        if (totalSupplyCenters !== GAME_CONFIG.TOTAL_SUPPLY_CENTERS) {
            errors.push(`Incorrect supply center count: ${totalSupplyCenters}/${GAME_CONFIG.TOTAL_SUPPLY_CENTERS}`);
        }

        return errors;
    }
}

export default GameEngine;