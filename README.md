# Cradle of Civilization 🏛️

A strategic diplomacy game set in the ancient Middle East, inspired by the classic board game Diplomacy but with ancient civilizations and historical context.

## 📋 Overview

Cradle of Civilization is a multiplayer, web-based strategy game where players control ancient civilizations in the Middle East region. The game combines tactical unit movement, diplomatic negotiations, and strategic resource management in a turn-based format.

### Key Features

- **Ancient Middle East Setting**: Play as civilizations like Babylon, Assyria, Egypt, Persia, and more
- **Real-time Multiplayer**: Support for 2-7 players with Firebase integration
- **Mobile-First Design**: Responsive UI optimized for both desktop and mobile devices
- **Interactive Map**: SVG-based game board with touch-friendly controls
- **Diplomatic System**: Built-in messaging system for player negotiations
- **Progressive Web App**: Installable on mobile devices with offline capabilities

## 🚀 Getting Started

### Prerequisites

- Modern web browser with ES6+ support
- Node.js (for development server, optional)
- Firebase account (for multiplayer features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cradle-of-civilization.git
   cd cradle-of-civilization
   ```

2. **Set up Firebase (Optional)**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore
   - Update the Firebase configuration in `src/js/core/app.js`

3. **Run the application**
   
   **Option A: Local Development Server**
   ```bash
   npm install -g http-server
   http-server . -p 8080
   ```
   
   **Option B: Python Server**
   ```bash
   python -m http.server 8080
   ```
   
   **Option C: Node.js Express Server**
   ```bash
   npm install express
   node server.js
   ```

4. **Open in browser**
   Navigate to `http://localhost:8080`

## 🎮 How to Play

### Game Setup
1. **Create Account**: Register with email and password
2. **Create Game**: Set up a new game with custom settings
3. **Join Game**: Invite friends or join public games
4. **Select Civilization**: Choose from available ancient civilizations

### Gameplay
1. **Spring Orders**: Submit movement and support orders for your units
2. **Resolution**: Orders are processed simultaneously
3. **Fall Orders**: Second movement phase
4. **Winter Adjustments**: Build new units or disband excess units
5. **Diplomacy**: Negotiate with other players between phases

### Victory Conditions
- Control the majority of supply centers (18 out of 34)
- Eliminate all other players
- Achieve diplomatic victory through alliances

## 🏗️ Architecture

### Project Structure
```
cradle-of-civilization/
├── public/
│   ├── index.html              # Main HTML file
│   ├── manifest.json           # PWA manifest
│   ├── service-worker.js       # Service worker for offline support
│   └── icons/                  # App icons
├── src/
│   ├── css/                    # Stylesheets
│   │   ├── main.css           # Main styles
│   │   ├── mobile.css         # Mobile-specific styles
│   │   ├── themes.css         # Theme variations
│   │   ├── game-board.css     # Game board styles
│   │   └── game-ui.css        # Game UI styles
│   └── js/
│       ├── components/         # Reusable UI components
│       │   ├── game-board.js  # Interactive SVG game board
│       │   └── game-ui.js     # Game interface components
│       ├── core/              # Core application logic
│       │   ├── app.js         # Main application controller
│       │   └── game-engine.js # Game logic and rules engine
│       ├── services/          # External service integrations
│       │   ├── firebase-service.js # Firebase integration
│       │   └── game-service.js     # Game state management
│       └── utils/             # Utility functions and constants
│           ├── constants.js   # Game constants and configuration
│           └── helpers.js     # Helper functions
├── ARCHITECTURE.md             # Technical architecture documentation
└── README.md                  # This file
```

### Technology Stack

**Frontend:**
- Vanilla JavaScript (ES6+)
- CSS3 with Flexbox/Grid
- SVG for interactive game board
- Web Components pattern

**Backend:**
- Firebase Firestore (NoSQL database)
- Firebase Authentication
- Firebase Hosting (optional)

**Development Tools:**
- ES6 Modules
- Progressive Web App (PWA)
- Service Worker for offline support

## 🎨 Civilizations

### Available Civilizations

1. **Babylon** 🏛️
   - Color: Gold
   - Starting regions: Babylon, Sippar, Nippur
   - Special: Economic powerhouse

2. **Assyria** ⚔️
   - Color: Crimson
   - Starting regions: Assur, Nineveh, Arbela
   - Special: Military focus

3. **Egypt** 🐪
   - Color: Blue
   - Starting regions: Memphis, Thebes, Elephantine
   - Special: Naval superiority

4. **Persia** 👑
   - Color: Purple
   - Starting regions: Persepolis, Ecbatana, Susa
   - Special: Expansion bonus

5. **Phoenicia** 🚢
   - Color: Teal
   - Starting regions: Tyre, Sidon, Byblos
   - Special: Trade networks

6. **Hittites** 🛡️
   - Color: Brown
   - Starting regions: Hattusa, Kanesh, Carchemish
   - Special: Defensive advantages

7. **Elam** 🌿
   - Color: Green
   - Starting regions: Susa, Anshan, Persepolis
   - Special: Resource production

## 🗺️ Game Map

The game features a historically-inspired map of the ancient Middle East, including:

- **Mesopotamia**: The cradle of civilization with major cities
- **Egypt**: Nile Delta and Upper Egypt regions
- **Anatolia**: Hittite territories and trade routes
- **Persia**: Iranian plateau and mountain passes
- **Levant**: Coastal cities and inland territories
- **Arabia**: Desert regions and oasis cities

### Terrain Types
- **Cities**: High-value supply centers
- **Fertile Land**: Agricultural regions
- **Desert**: Difficult terrain with strategic value
- **Mountains**: Natural barriers and defensive positions
- **Seas**: Naval movement and trade routes

## 🔧 Development

### Code Style
- ES6+ JavaScript with modules
- Functional programming patterns where appropriate
- Component-based architecture
- Mobile-first responsive design

### Key Classes

**GameEngine**: Core game logic, order processing, and rules enforcement
```javascript
import GameEngine from './src/js/core/game-engine.js';
const engine = new GameEngine();
```

**GameBoard**: Interactive SVG map with touch/mouse controls
```javascript
import GameBoard from './src/js/components/game-board.js';
const board = new GameBoard(container, gameEngine);
```

**GameUI**: User interface for orders, chat, and game status
```javascript
import GameUI from './src/js/components/game-ui.js';
const ui = new GameUI(container, gameEngine);
```

### Firebase Integration

The game uses Firebase for:
- User authentication
- Real-time game state synchronization
- Player messaging
- Game history and statistics

### Mobile Optimization

- Touch-friendly UI elements
- Responsive grid layouts
- Optimized SVG rendering
- Gesture support for map navigation

## 🎯 Game Rules

### Basic Rules
1. **Simultaneous Orders**: All players submit orders simultaneously
2. **Order Types**: Hold, Move, Support, Convoy
3. **Conflict Resolution**: Strength-based with support calculations
4. **Supply Centers**: Control determines unit count
5. **Elimination**: Players with no units are eliminated

### Advanced Rules
- **Convoy Chains**: Multiple fleets can create transport routes
- **Support Cutting**: Attacks can disrupt support orders
- **Standoffs**: Equal strength results in no movement
- **Retreats**: Dislodged units must retreat or disband

### Phases
1. **Spring Movement**: Primary movement phase
2. **Spring Retreats**: Resolve dislodged units
3. **Fall Movement**: Second movement phase
4. **Fall Retreats**: Resolve dislodged units
5. **Winter Adjustments**: Build/disband units

## 🤝 Contributing

We welcome contributions! Please read our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and patterns
- Add comments for complex logic
- Test on both desktop and mobile
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the classic board game Diplomacy by Allan B. Calhamer
- Historical research on ancient Middle Eastern civilizations
- Open source community for tools and libraries
- Beta testers and early adopters

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/cradle-of-civilization/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/cradle-of-civilization/discussions)
- **Email**: support@cradleofcivilization.com

## 🚧 Roadmap

### Version 1.1
- [ ] AI opponents
- [ ] Tournament mode
- [ ] Enhanced mobile UI
- [ ] Push notifications

### Version 1.2
- [ ] Map editor
- [ ] Custom scenarios
- [ ] Replay system
- [ ] Statistics dashboard

### Version 2.0
- [ ] 3D map visualization
- [ ] Voice chat integration
- [ ] Achievement system
- [ ] Leaderboards

---

**Built with ❤️ for strategy game enthusiasts and history buffs**

*Experience the ancient art of diplomacy in the cradle of civilization.*