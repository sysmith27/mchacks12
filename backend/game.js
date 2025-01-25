//get the stuff from the html
const player = document.getElementById('player');
const maze = document.getElementById('maze');
const goal = document.getElementById('goal');
const cloud = document.getElementById('cloud');
// grid size and player position
const gridSize = 30; //cell size = 30 x 30 
const gridWidth = 20; 
const gridHeight = 20; 
let playerPosition = { x: 0, y: 0 };
let cloudPosition = {x: 0, y: 0};

//can't write over this path #thank you chat gpt
const predefinedPath = [
    { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 },
    { x: 5, y: 0 }, { x: 6, y: 0 }, { x: 6, y: 1 }, { x: 6, y: 2 }, { x: 6, y: 3 },
    { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 }, { x: 9, y: 4 }, { x: 10, y: 4 },
    { x: 11, y: 4 }, { x: 12, y: 4 }, { x: 13, y: 4 }, { x: 14, y: 4 }, { x: 15, y: 4 },
    { x: 15, y: 5 }, { x: 15, y: 6 }, { x: 15, y: 7 }, { x: 15, y: 8 }, { x: 15, y: 9 },
    { x: 15, y: 10 }, { x: 16, y: 10 }, { x: 17, y: 10 }, { x: 18, y: 10 }, { x: 19, y: 10 },
    { x: 19, y: 11 }, { x: 19, y: 12 }, { x: 19, y: 13 }, { x: 19, y: 14 }, { x: 19, y: 15 },
    { x: 19, y: 16 }, { x: 19, y: 17 }, { x: 19, y: 18 }, { x: 19, y: 19 }
  ];
  
const walls = generateRandomWalls(gridWidth, gridHeight, predefinedPath, 0.4); // 40% walls

  // gets the random walls
function generateRandomWalls(gridWidth, gridHeight, protectedPath, density) {
    const totalCells = gridWidth * gridHeight;
    const maxWalls = Math.floor(totalCells * density); // Number of walls based on density
    const walls = new Set();
  
    while (walls.size < maxWalls) {
      const randomX = Math.floor(Math.random() * gridWidth);
      const randomY = Math.floor(Math.random() * gridHeight);
  
      // if its in the path alr skip
      const isInPath = protectedPath.some(pos => pos.x === randomX && pos.y === randomY);
      if (!isInPath) {
        walls.add(`${randomX},${randomY}`); // Store walls as strings
      }
    }
  
    // wall strings back to coordinates
    return Array.from(walls).map(wall => {
      const [x, y] = wall.split(',').map(Number);
      return { x, y };
    });
}
  

// make the walls show up
walls.forEach(wall => {
  const wallElement = document.createElement('div');
  wallElement.classList.add('wall');
  wallElement.style.gridColumnStart = wall.x + 1;
  wallElement.style.gridRowStart = wall.y + 1;
  maze.appendChild(wallElement);
});


//make clound 
let moving_direction = 30;
function generateCloud() {
    cloudPosition.x = cloudPosition.x + moving_direction;
    cloudPosition.y = 30;

    if (cloudWithinBounds(cloudPosition.x, cloudPosition.y)) {
        console.log('within_bounds');
        cloud.style.left = `${cloudPosition.x}px`;
        cloud.style.top = `${cloudPosition.y}px`;
    }
    else {
        cloudPosition.x = cloudPosition.x + (-2)*moving_direction;
        moving_direction = (-1)*moving_direction;
        cloud.style.left = `${cloudPosition.x}px`;
        cloud.style.top = `${cloudPosition.y}px`;
    }
    if (isCloud(playerPosition.x, playerPosition.y)) {
        alert('You lost! The bread is soggy');
    }
}

// ariana's event listener thing
document.addEventListener('keydown', (e) => {
  let newX = playerPosition.x;
  let newY = playerPosition.y;

  if (e.key === 'ArrowUp') newY--;
  if (e.key === 'ArrowDown') newY++;
  if (e.key === 'ArrowLeft') newX--;
  if (e.key === 'ArrowRight') newX++;

  //check if the player collides with a wall and in bounds
  if (!isWall(newX, newY) && isWithinBounds(newX, newY)) {
    playerPosition.x = newX;
    playerPosition.y = newY;
    updatePlayerPosition();
    checkWin();
  }
});

// HELPERS
function updatePlayerPosition() {
  player.style.left = `${playerPosition.x * gridSize}px`;
  player.style.top = `${playerPosition.y * gridSize}px`;
}

function isWall(x, y) {
  return walls.some(wall => wall.x === x && wall.y === y);
}

function isWithinBounds(x, y) {
  return x >= 0 && x < gridWidth && y >= 0 && y < gridHeight;
}

function cloudWithinBounds(x, y) {
    return x >= 0 && x < 600 && y >= 0 && y < 600;
}

function isCloud(x, y) {
    //alert(cloudPosition.x);
    return ((cloudPosition.x -10 <= x && cloudPosition.x + 10 >= x) && (cloudPosition.y -10 <= y && cloudPosition.y + 10 >= y));
}

// are they at the goal
function checkWin() {
    if (gameWon) return;
  
    const goalX = (maze.clientWidth / gridSize) - 1; 
    const goalY = (maze.clientHeight / gridSize) - 1;
      
    if (playerPosition.x === goalX && playerPosition.y === goalY) {
      gameWon = true;
      resetCountdown();
    }
      
  }
      
    updatePlayerPosition();
  
    let timerInterval;
    let timeRemaining = 30;
    let gameWon = false;
      
  function startCountdown() {
    timerInterval = setInterval(() => {
  
      // Update the timer display
      document.getElementById("timer").textContent = `Time: ${timeRemaining}s`;
      timeRemaining--;
      // Stop the timer after 60 seconds
      if (timeRemaining < 0) {
        clearInterval(timerInterval);
        alert("Time's up!");
      }
    }, 1000);
  }
       
  function resetCountdown() {
    clearInterval(timerInterval);
    document.getElementById("timer").textContent = `Time: ${timeRemaining}s`;
    alert('You win!');
  }
  
  document.addEventListener("DOMContentLoaded", () => {

  // Get the modal and start button
  const modal = document.getElementById("game-instructions-modal");
  const startButton = document.getElementById("start-game-btn");

  // Show the modal when the page loads
  window.onload = function() {
    modal.style.display = "block";
  }

  // Hide the modal when the start button is clicked
  startButton.onclick = function() {
    modal.style.display = "none"; // Hide the modal
    startCountdown();
  }

  setInterval(() => {
    // Check if the player has won
    if (!gameWon) checkWin();
  }, 100);
});
  

updatePlayerPosition();
setInterval(generateCloud, 100);