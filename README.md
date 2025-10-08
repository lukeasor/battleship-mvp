# Battleship MVP 🚢

A fully playable browser-based Battleship game with AI opponent, manual ship placement, and hidden power-ups!

## 🎮 Live Game

**Play now:** https://lukeasor.github.io/battleship-mvp/

## 📦 Repository

**Source code:** https://github.com/lukeasor/battleship-mvp

## 🐛 Bug Documentation

See [BUGLOG.md](./BUGLOG.md) for detailed bug tracking and fixes during development.

## 🎯 Game Rules

### Classic Battleship
- **Board Size:** 10×10 grid for both player and AI
- **Ships:** 
  - Carrier (5 cells)
  - Battleship (4 cells)
  - Cruiser (3 cells)
  - Submarine (3 cells)
  - Destroyer (2 cells)
- **Objective:** Sink all opponent ships before they sink yours!

### Gameplay
1. **Setup Phase:** Place your ships manually on your board
   - Click a ship from the tray to select it
   - Press **R** to rotate between horizontal and vertical
   - Click on your board to place the ship
   - Ships turn red if placement is invalid, green if valid

2. **Battle Phase:** Take turns firing at the enemy
   - Click on the AI's board to fire
   - **Red X** = Hit! 
   - **Blue dot** = Miss
   - AI automatically fires after your turn

3. **Victory/Defeat:** First to sink all enemy ships wins!

## 🎁 Secret Power-Ups

### 🔍 Sonar Ping
**Unlock:** Enter player name **"SEAWOLF"** on the start screen

**Effect:** Once per game, scan a 3×3 area on the AI board
- Yellow cells = Ships present
- Light blue cells = Empty water
- Revealed for 3 seconds
- Does NOT count as a shot

### 💣 Airstrike
**Unlock:** Enter the Konami Code on any screen: **↑ ↑ ↓ ↓ ← → ← → B A**

**Effect:** Once per game, attack an entire row or column
- Choose any row (A-J) or column (1-10)
- Every cell in that line is attacked simultaneously
- Counts as your turn

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation
```bash
# Clone the repository
git clone https://github.com/lukeasor/battleship-mvp.git
cd battleship-mvp

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test
```

### Development Commands
- `pnpm dev` - Start local dev server (http://localhost:5173)
- `pnpm build` - Create production build
- `pnpm preview` - Preview production build locally
- `pnpm test` - Run all tests
- `pnpm lint` - Run ESLint

### Debug Mode
Add `?debug=1` to the URL to enable debug overlay showing:
- AI target queue size
- Remaining ships for both players
- Current turn state

Example: `http://localhost:5173/?debug=1`

## 🛠️ Tech Stack

- **Frontend Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **Testing:** Vitest + Testing Library
- **Deployment:** GitHub Pages via GitHub Actions
- **Code Quality:** ESLint + Prettier

## 📁 Project Structure

```
/src
  /components       # React UI components
    Board.tsx
    Cell.tsx
    ShipTray.tsx
    Controls.tsx
    Modal.tsx
  /logic           # Game logic (pure TypeScript)
    types.ts       # TypeScript types & interfaces
    shipUtils.ts   # Ship placement utilities
    placement.ts   # Placement validation
    ai.ts          # AI opponent logic
    rules.ts       # Game rules & shot processing
    powerups.ts    # Power-up implementations
  /state
    gameState.ts   # Game state management
  /styles
    index.css      # Global styles + Tailwind
  App.tsx          # Main application component
  main.tsx         # Application entry point
```

## 🤖 AI Behavior

The AI uses a two-phase strategy:

1. **Hunt Mode:** Randomly fires at unfired cells
2. **Target Mode:** When a hit occurs, prioritizes adjacent cells (up/down/left/right) until the ship is sunk

The AI maintains a target queue and never repeats shots.

## ♿ Accessibility

- Keyboard navigation for ship placement (arrow keys + R to rotate)
- Keyboard navigation for firing (tab + enter)
- ARIA labels on all grid cells
- Visible focus states
- High contrast colors for hits/misses

## 🧪 Testing

Comprehensive test coverage for all game logic:

- ✅ Ship placement validation (no overlaps, in-bounds)
- ✅ AI behavior (no repeated shots, hunt/target modes)
- ✅ Game rules (hit detection, game over conditions)
- ✅ Power-ups (Sonar 3×3 scan, Airstrike row/column)

Run tests: `pnpm test`

## 📝 Development Notes

- No backend required - 100% client-side
- Game state managed in React state
- No authentication/login system
- Optional: Player name saved to localStorage
- Ships placed manually by player
- AI ships placed randomly with no overlaps

## 🔗 Links

- **Live Game:** https://lukeasor.github.io/battleship-mvp/
- **GitHub Repo:** https://github.com/lukeasor/battleship-mvp
- **Bug Log:** [BUGLOG.md](./BUGLOG.md)
- **Devin Session:** https://app.devin.ai/sessions/9d2c158a1f8c4f2faccc13e990aac589

## 👤 Credits

Built by Luke Sorensen (@lukeasor) with Devin AI

---

**Have fun and may your shots be true! ⚓**
