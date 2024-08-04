const gridContainer = document.getElementById("grid-container");
const rows = 30;
const cols = 30;
let cells = [];
let intervalId = null;
let isRunning = false;
const intervalTime = 300;


// Initialize the grid with cells
function initializeGrid() {
    gridContainer.innerHTML = '';
    cells = [];

    for (let r = 0; r < rows; r++) {
        cells[r] = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.addEventListener('click', () => toggleCell(r, c));
            gridContainer.appendChild(cell);
            cells[r][c] = cell;
        }
    }
}


// Toggle cell between alive and dead
function toggleCell(r, c) {
    const cell = cells[r][c];
    cell.classList.toggle('alive')
}


// Get neighbors of a cell
function getNeighbors(r, c) {
    const neighbors = [];
    // List of directions for neighbors (8 directions)
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1], [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    directions.forEach(([dr, dc]) => {
        const nr = r + dr; // Новая строка
        const nc = c + dc; // Новый столбец
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
            neighbors.push([nr, nc]);
        }
    });
    return neighbors;
}

// Update the grid based on Conway's rules
function updateGrid() {
    const newCells = cells.map(row => row.map(cell => cell.classList.contains('alive')));

    let hasAliveCells = false;// <-- Новая переменная для отслеживания живых клеток (Бесконечный вариант)

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Check if the current cell is alive
            const alive = cells[r][c].classList.contains('alive');
            const neighbors = getNeighbors(r, c);
            // Count the number of alive neighbors
            const aliveNeighbors = neighbors.filter(([nr, nc]) => cells[nr][nc].classList.contains('alive')).length

            // Apply the rules of Game
            if (alive && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
                newCells[r][c] = false; // Клетка умирает
            } else if (!alive && aliveNeighbors === 3) {
                newCells[r][c] = true; // Клетка оживает
            }

            // Бесконечный вариант START
            // Обновление флага наличия живых клеток
            if (newCells[r][c]) {
                hasAliveCells = true;
            }
        }
    }
    // Если нет живых клеток, случайным образом включаем несколько клеток
    if (!hasAliveCells) {
        for (let i = 0; i < 10; i++) {
            const r = Math.floor(Math.random() * rows)
            const c = Math.floor(Math.random() * cols)
            newCells[r][c] = true;
        }
    }
    // Бесконечный вариант END


    // Update cell states
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = cells[r][c];
            if (newCells[r][c]) {
                cell.classList.add('alive');
            } else {
                cell.classList.remove('alive');
            }
        }
    }
}


// Start, Stop, Reset the game loop
function startSimulation() {
    if (!isRunning) {
        isRunning = true;
        intervalId = setInterval(updateGrid, intervalTime)
    }
}

function stopSimulation() {
    if (isRunning) {
        isRunning = false;
        clearInterval(intervalId)
    }
}

function resetSimulation() {
    stopSimulation();
    initializeGrid();
}

// Set up event listeners
document.getElementById('start').addEventListener('click', startSimulation);
document.getElementById('stop').addEventListener('click', stopSimulation);
document.getElementById('reset').addEventListener('click', resetSimulation);


initializeGrid();
