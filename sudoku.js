class MiniSudoku {
    constructor() {
        this.size = 6;
        this.grid = [];
        this.solution = [];
        this.selectedCell = null;
    }

    // Erstelle ein leeres 6x6 Grid
    createEmptyGrid() {
        return Array(this.size).fill().map(() => Array(this.size).fill(0));
    }

    // Prüfe ob eine Zahl an der Position gültig ist
    isValid(grid, row, col, num) {
        // Prüfe Reihe
        for (let x = 0; x < this.size; x++) {
            if (grid[row][x] === num) return false;
        }

        // Prüfe Spalte
        for (let x = 0; x < this.size; x++) {
            if (grid[x][col] === num) return false;
        }

        // Prüfe 3x2 Block
        const startRow = Math.floor(row / 2) * 2;
        const startCol = Math.floor(col / 3) * 3;
        
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) return false;
            }
        }

        return true;
    }

    // Löse das Sudoku mit Backtracking
    solve(grid) {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (grid[row][col] === 0) {
                    const numbers = this.shuffle([1, 2, 3, 4, 5, 6]);
                    for (let num of numbers) {
                        if (this.isValid(grid, row, col, num)) {
                            grid[row][col] = num;
                            if (this.solve(grid)) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Mische Array zufällig
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Generiere ein komplett gefülltes Sudoku
    generateComplete() {
        const grid = this.createEmptyGrid();
        this.solve(grid);
        return grid;
    }

    // Entferne Zellen für das Puzzle
    generatePuzzle(difficulty = 0.5) {
        const complete = this.generateComplete();
        this.solution = complete.map(row => [...row]);
        
        const puzzle = complete.map(row => [...row]);
        // Pro Zeile nur eine Zahl entfernen
        const rows = this.shuffle(Array.from({ length: this.size }, (_, i) => i));
        
        for (let row = 0; row < rows.length/2; row++) {
            // Find which column has the number 5 in this row
            const colWith5 = complete[rows[row]].indexOf(5);
            puzzle[rows[row]][colWith5] = 0;
        }
        for (let row = rows.length/2; row < rows.length; row++) {
            const col = Math.floor(Math.random() * this.size);
            puzzle[rows[row]][col] = 0;
        }

        // Falls ein einem Block keine Zahl entfernt wurde, entferne eine zufällige Zahl
        for (let blockRow = 0; blockRow <= 2; blockRow++) {
            for (let blockCol = 0; blockCol < 2; blockCol++) {
                let hasRemoved = false;
                for (let i = 0; i < 2; i++) {
                    for (let j = 0; j < 3; j++) {
                        if (puzzle[blockRow * 2 + i][blockCol * 3 + j] === 0) {
                            hasRemoved = true;
                        }
                    }
                }
                if (!hasRemoved) {
                    const i = Math.floor(Math.random() * 2);
                    const j = Math.floor(Math.random() * 3);
                    puzzle[blockRow * 2 + i][blockCol * 3 + j] = 0;
                }
            }
        }
        
        this.grid = puzzle;
        return puzzle;
    }

    // Prüfe ob das Puzzle gelöst ist
    isSolved() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.grid[row][col] === 0 || 
                    this.grid[row][col] !== this.solution[row][col]) {
                    return false;
                }
            }
        }
        return true;
    }

    // Setze eine Zahl
    setNumber(row, col, num) {
        if (this.solution[row][col] === 0) return false; // Nicht änderbar
        
        this.grid[row][col] = num;
        return true;
    }

    // Prüfe ob eine Zahl korrekt ist
    isCorrect(row, col, num) {
        return this.solution[row][col] === num;
    }

    // Prüfe ob eine Zelle vorgegeben ist
    isGiven(row, col) {
        return this.solution[row][col] !== 0 && this.grid[row][col] !== 0;
    }
}