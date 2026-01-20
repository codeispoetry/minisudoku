# Mini Sudoku PWA

A touch-optimized 6x6 Mini Sudoku game built as a Progressive Web App (PWA). Perfect for quick brain training sessions on any device!

## 🎮 Features

### Core Gameplay
- **6x6 Mini Sudoku**: Smaller than traditional 9x9, perfect for quick games
- **Smart Puzzle Generation**: Each row has exactly one missing number for balanced difficulty
- **Touch-Optimized**: Designed specifically for mobile devices with large, accessible buttons
- **Visual Feedback**: Color-coded validation (green for correct, red for errors)

### Smart Highlighting System
- **Row/Column/Block Highlighting**: When selecting a cell, related cells are highlighted in pink
- **3x2 Block Structure**: Visual separation of the six 3×2 blocks
- **Click-to-Clear**: Click outside the grid to remove all highlights

### Timer & Highscores
- **Live Timer**: Track your solving time in real-time
- **Local Highscores**: Top 10 best times stored locally
- **Name Entry**: Uppercase name input for consistent highscore display
- **Persistent Storage**: Scores saved using localStorage

### PWA Features
- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Play even without internet connection
- **Responsive Design**: Optimized for all screen sizes
- **Service Worker**: Fast loading and caching

## 🚀 Quick Start

### Online Access
Deploy to any web server and access via browser at `/sudoku/` path.

### Local Development
1. Clone or download the project files
2. Start a local web server:
   ```bash
   python3 -m http.server 8080
   ```
3. Open `http://localhost:8080` in your browser

### Installation as PWA
- **Desktop**: Look for the install button in your browser's address bar
- **Android**: Tap "Add to Home Screen" when prompted
- **iOS**: Use Safari's "Share" → "Add to Home Screen"

## 🎯 How to Play

1. **Select a Cell**: Tap any empty (white) cell to select it
2. **Choose a Number**: Use the number buttons (1-6) below the grid
3. **Clear a Cell**: Use the × button to remove a number
4. **Visual Cues**: 
   - Pink highlighting shows related cells (same row/column/block)
   - Green = correct number
   - Red = incorrect number
5. **Complete the Puzzle**: Fill all empty cells to win!

### Sudoku Rules
- Each **row** must contain numbers 1-6 exactly once
- Each **column** must contain numbers 1-6 exactly once  
- Each **3×2 block** must contain numbers 1-6 exactly once

## 📱 Controls

### Touch Controls
- **Tap cell**: Select for input
- **Tap number**: Insert number into selected cell
- **Tap × button**: Clear selected cell
- **Tap outside grid**: Clear selection and highlights

### Keyboard Controls (Desktop)
- **1-6 keys**: Insert numbers
- **Delete/Backspace**: Clear cell
- **Escape**: Clear selection
- **Enter**: Save highscore (in name input)

## 🏗 Project Structure

```
minisudoku/
├── index.html          # Main HTML structure
├── style.css           # Styles and responsive design
├── app.js              # Main application logic
├── sudoku.js           # Sudoku generation and validation
├── sw.js               # Service Worker for PWA features
├── manifest.json       # PWA manifest
├── icon-192x192.png    # PWA icon (small)
├── icon-512x512.png    # PWA icon (large)
└── README.md           # This file
```

## 🔧 Technical Details

### Technologies Used
- **Vanilla JavaScript**: No frameworks for fast loading
- **CSS Grid**: Responsive sudoku grid layout
- **CSS Flexbox**: Button layouts and modal centering
- **Service Worker**: Offline caching and PWA functionality
- **LocalStorage**: Persistent highscore storage

### Browser Compatibility
- **Chrome**: Full support (Android/Desktop)
- **Safari**: Full support (iOS/macOS)
- **Firefox**: Full support
- **Edge**: Full support

### PWA Features
- **Manifest**: Proper app metadata and theming
- **Service Worker**: Offline support and fast loading
- **Responsive**: Works on phones, tablets, and desktop
- **Touch Optimized**: Large tap targets, no hover dependencies

## 🎨 Customization

### Styling
- Main colors defined in CSS custom properties
- Easy to modify color scheme in `style.css`
- Responsive breakpoints for different screen sizes

### Game Logic
- Difficulty can be adjusted in `sudoku.js`
- Timer format customizable in `app.js`
- Highscore limit (currently 10) easily changed

## 📄 License

This project is open source. Feel free to modify and distribute.

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Additional difficulty levels
- Sound effects
- Animations
- Hint system
- Statistics tracking

---

Built with ❤️ for puzzle lovers everywhere!