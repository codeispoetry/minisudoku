class SudokuApp {
    constructor() {
        this.game = new MiniSudoku();
        this.selectedCell = null;
        this.givenCells = new Set();
        this.startTime = null;
        this.timerInterval = null;
        this.gameWon = false;
        this.init();
    }

    init() {
        this.createGrid();
        this.setupEventListeners();
        this.newGame();
        this.registerServiceWorker();
    }

    // Erstelle das Spielfeld
    createGrid() {
        const grid = document.getElementById('sudokuGrid');
        grid.innerHTML = '';

        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                cell.addEventListener('click', () => this.selectCell(row, col));
                cell.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.selectCell(row, col);
                });
                
                grid.appendChild(cell);
            }
        }
    }

    // Event Listeners einrichten
    setupEventListeners() {
        // Zahlen-Buttons
        document.querySelectorAll('.number-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const number = btn.dataset.number;
                this.inputNumber(number === '' ? 0 : parseInt(number));
            });
            
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const number = btn.dataset.number;
                this.inputNumber(number === '' ? 0 : parseInt(number));
            });
        });

        // Highscore-Button
        document.getElementById('highscoreBtn').addEventListener('click', () => {
            this.showHighscores();
        });

        // Neues Spiel Button (falls vorhanden)
        const newGameBtn = document.getElementById('newGameBtn');
        if (newGameBtn) {
            newGameBtn.addEventListener('click', () => {
                this.newGame();
            });
        }

        // Modal Event Listeners
        document.getElementById('closeHighscore').addEventListener('click', () => {
            this.hideHighscores();
        });

        document.getElementById('clearHighscores').addEventListener('click', () => {
            this.clearHighscores();
        });

        document.getElementById('saveScore').addEventListener('click', () => {
            this.saveHighscore();
        });

        document.getElementById('skipSave').addEventListener('click', () => {
            this.hideWinModal();
        });

        // Enter-Taste im Namen-Eingabefeld
        document.getElementById('playerName').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.saveHighscore();
            }
        });

        // Modal-Hintergrund schließt Modal
        document.getElementById('highscoreModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideHighscores();
            }
        });

        document.getElementById('winModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideWinModal();
            }
        });

        // Tastatur-Events
        document.addEventListener('keydown', (e) => {
            if (this.selectedCell && !document.querySelector('.modal:not(.hidden)')) {
                const key = e.key;
                if (key >= '1' && key <= '6') {
                    this.inputNumber(parseInt(key));
                } else if (key === 'Delete' || key === 'Backspace') {
                    this.inputNumber(0);
                } else if (key === 'Escape') {
                    this.clearSelection();
                }
            }
        });

        // Prevent default touch behaviors
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.app')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Neues Spiel starten
    newGame() {
        this.game.generatePuzzle(0.4);
        this.givenCells.clear();
        this.selectedCell = null;
        this.gameWon = false;
        this.startTimer();
        this.updateDisplay();
        this.showMessage('Neues Spiel gestartet! Viel Spaß!');
        
        // Merke vorgefüllte Zellen
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                if (this.game.grid[row][col] !== 0) {
                    this.givenCells.add(`${row}-${col}`);
                }
            }
        }
    }

    // Zelle auswählen
    selectCell(row, col) {
        // Bereits ausgefüllte Zellen sind nicht editierbar
        if (this.givenCells.has(`${row}-${col}`)) {
            return;
        }

        this.clearSelection();
        this.selectedCell = { row, col };
        
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.classList.add('selected');
    }

    // Auswahl aufheben
    clearSelection() {
        if (this.selectedCell) {
            const cell = document.querySelector(`[data-row="${this.selectedCell.row}"][data-col="${this.selectedCell.col}"]`);
            cell.classList.remove('selected');
        }
        this.selectedCell = null;
    }

    // Zahl eingeben
    inputNumber(num) {
        if (!this.selectedCell) return;

        const { row, col } = this.selectedCell;
        
        // Nicht editierbare Zellen überspringen
        if (this.givenCells.has(`${row}-${col}`)) return;

        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        
        // Zahl setzen oder löschen
        if (num === 0) {
            this.game.grid[row][col] = 0;
            cell.textContent = '';
            cell.classList.remove('error', 'correct');
        } else {
            this.game.grid[row][col] = num;
            cell.textContent = num;
            
            // Validierung
            if (this.game.isCorrect(row, col, num)) {
                cell.classList.remove('error');
                cell.classList.add('correct');
                
                // Prüfe ob gelöst
                setTimeout(() => {
                    if (this.game.isSolved() && !this.gameWon) {
                        this.gameWon = true;
                        this.stopTimer();
                        this.showWinModal();
                        this.clearSelection();
                    }
                }, 100);
            } else {
                cell.classList.remove('correct');
                cell.classList.add('error');
                
                // Fehler-Animation
                setTimeout(() => {
                    cell.classList.remove('error');
                }, 500);
            }
        }
    }

    // Display aktualisieren
    updateDisplay() {
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                const value = this.game.grid[row][col];
                
                cell.textContent = value === 0 ? '' : value;
                cell.classList.remove('given', 'selected', 'error', 'correct');
                
                if (value !== 0) {
                    cell.classList.add('given');
                }
            }
        }
    }

    // Nachricht anzeigen
    showMessage(text, type = '') {
        const message = document.getElementById('message');
        message.textContent = text;
        message.className = `message ${type}`;
        
        if (text) {
            setTimeout(() => {
                message.textContent = '';
                message.className = 'message';
            }, 3000);
        }
    }

    // Service Worker registrieren
    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        }
    }

    // Timer-Funktionen
    startTimer() {
        this.stopTimer(); // Stoppe vorherigen Timer falls vorhanden
        this.startTime = Date.now();
        this.updateTimer();
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateTimer() {
        if (!this.startTime) return;
        
        const elapsed = Date.now() - this.startTime;
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        const timeString = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        document.getElementById('timer').textContent = timeString;
    }

    getCurrentTime() {
        if (!this.startTime) return 0;
        return Math.floor((Date.now() - this.startTime) / 1000);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Gewinn-Modal
    showWinModal() {
        const finalTime = this.getCurrentTime();
        document.getElementById('finalTime').textContent = this.formatTime(finalTime);
        document.getElementById('playerName').value = '';
        document.getElementById('winModal').classList.remove('hidden');
        
        // Fokus auf Name-Eingabe nach kurzer Verzögerung
        setTimeout(() => {
            document.getElementById('playerName').focus();
        }, 100);
    }

    hideWinModal() {
        document.getElementById('winModal').classList.add('hidden');
    }

    // Highscore-Funktionen
    saveHighscore() {
        const playerName = document.getElementById('playerName').value.trim();
        if (!playerName) {
            alert('Bitte gib deinen Namen ein!');
            return;
        }

        const finalTime = this.getCurrentTime();
        const highscores = this.getHighscores();
        
        highscores.push({
            name: playerName,
            time: finalTime,
            date: new Date().toISOString()
        });

        // Sortiere nach Zeit (aufsteigend)
        highscores.sort((a, b) => a.time - b.time);

        // Behalte nur Top 10
        const topScores = highscores.slice(0, 10);
        
        localStorage.setItem('miniSudokuHighscores', JSON.stringify(topScores));
        this.hideWinModal();
        this.showHighscores();
    }

    getHighscores() {
        try {
            const scores = localStorage.getItem('miniSudokuHighscores');
            return scores ? JSON.parse(scores) : [];
        } catch (e) {
            console.error('Fehler beim Laden der Highscores:', e);
            return [];
        }
    }

    showHighscores() {
        const highscores = this.getHighscores();
        const listElement = document.getElementById('highscoreList');
        
        if (highscores.length === 0) {
            listElement.innerHTML = '<div class="empty-highscores">Noch keine Bestzeiten vorhanden.<br>Spiele dein erstes Spiel!</div>';
        } else {
            listElement.innerHTML = highscores.map((score, index) => `
                <div class="highscore-item">
                    <div class="highscore-rank">${index + 1}.</div>
                    <div class="highscore-name">${this.escapeHtml(score.name)}</div>
                    <div class="highscore-time">${this.formatTime(score.time)}</div>
                </div>
            `).join('');
        }
        
        document.getElementById('highscoreModal').classList.remove('hidden');
    }

    hideHighscores() {
        document.getElementById('highscoreModal').classList.add('hidden');
    }

    clearHighscores() {
        if (confirm('Möchtest du wirklich alle Bestzeiten löschen?')) {
            localStorage.removeItem('miniSudokuHighscores');
            this.showHighscores();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// App starten wenn DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
    new SudokuApp();
});

// Installierbarkeit
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Zeige Install-Button falls gewünscht
    console.log('App kann installiert werden');
});