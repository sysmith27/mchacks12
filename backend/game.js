//get the stuff from the html
const player = document.getElementById('player');
const maze = document.getElementById('maze');
const goal = document.getElementById('goal');
const cloud1 = document.getElementById('cloud1');
const cloud2 = document.getElementById('cloud2');
// grid size and player position
const gridSize = 30; //cell size = 30 x 30 
const gridWidth = 20; 
const gridHeight = 20; 
let playerPosition = { x: 0, y: 0 };
let cloudPosition1 = {x: 0, y: 0};
let cloudPosition2 = {x: 0, y: 0};
let firePosition1 = {x: 8, y: 4};
let firePosition2 = {x: 15, y: 6};
let firePosition3 = {x: 19, y: 15};
let f1 = false, f2 = false, f3 = false;

/*player.style.backgroundImage = url('../images/Butter-toast.png');
player.style.backgroundSize = cover;
player.style.backgroundPosition = center;*/
const flavor = localStorage.char;
//alert(flavor == "nutella");

function getCharacter() {
  if (flavor == "butter") {
    player.classList.add("butter-background");
  }
  else if (flavor == "nutella") {
    player.classList.add("nutella-background");
  }
  else if (flavor == "pbhoney") {
    player.classList.add("pbhoney-background");
  }
  else if (flavor == "jelly") {
    player.classList.add("jelly-background");
  }
}

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
function generateCloud1() {
    cloudPosition1.x = cloudPosition1.x + moving_direction;
    cloudPosition1.y = 90;

    if (cloudWithinBounds(cloudPosition1.x, cloudPosition1.y)) {
        console.log('within_bounds');
        cloud1.style.left = `${cloudPosition1.x}px`;
        cloud1.style.top = `${cloudPosition1.y}px`;
    }
    else {
        cloudPosition1.x = cloudPosition1.x + (-2)*moving_direction;
        moving_direction = (-1)*moving_direction;
        cloud1.style.left = `${cloudPosition1.x}px`;
        cloud1.style.top = `${cloudPosition1.y}px`;
    }

    if (isCloud(playerPosition.x*gridSize, playerPosition.y*gridSize, cloudPosition1)) {
      showLossPopup();
      clearInterval(timerInterval);
      document.getElementById("timer").textContent = `Time: ${timeRemaining}s`;
    }
}

function generateCloud2() {
    cloudPosition2.x = cloudPosition2.x + moving_direction;
    cloudPosition2.y = 360;

    if (cloudWithinBounds(cloudPosition2.x, cloudPosition2.y)) {
        console.log('within_bounds');
        cloud2.style.left = `${cloudPosition2.x}px`;
        cloud2.style.top = `${cloudPosition2.y}px`;
    }
    else {
        cloudPosition2.x = cloudPosition2.x + (-2)*moving_direction;
        moving_direction = (-1)*moving_direction;
        cloud2.style.left = `${cloudPosition2.x}px`;
        cloud2.style.top = `${cloudPosition2.y}px`;
    }

    if (isCloud(playerPosition.x*gridSize, playerPosition.y*gridSize, cloudPosition2)) {
        showLossPopup();
        clearInterval(timerInterval);
        document.getElementById("timer").textContent = `Time: ${timeRemaining}s`;
    }
}

function generateFire(fire, firePosition) {
    fire.style.left = `${firePosition.x * gridSize}px`
    fire.style.top = `${firePosition.y * gridSize}px`
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
    if (isFire(newX,newY)) {
      showLossPopup();
      clearInterval(timerInterval);
      document.getElementById("timer").textContent = `Time: ${timeRemaining}s`;
    }
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

function isCloud(x, y, cloudPosition) {
    return ((cloudPosition.x -1 <= x && cloudPosition.x + 1 >= x) && (cloudPosition.y -1 <= y && cloudPosition.y + 5 >= y));
}

function isFire(x, y){
    if (f1 === true && x === firePosition1.x &&  y === firePosition1.y) {
        return true;
    }
    else if (f2 === true && x === firePosition2.x && y === firePosition2.y) {
        return true;
    }
    else if (f3 === true && x === firePosition3.x && y === firePosition3.y) {
        return true;
    }
    return false;
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
    //alert('You win!');
    window.location.href = 'winning.html';
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
  
getCharacter();
updatePlayerPosition();
setTimeout(() => {
    const fire1 = document.getElementById('fire1');
    fire1.style.display = 'block';
    generateFire(fire1, firePosition1) // Make the element visible
    f1 = true;
}, 6000);
setTimeout(() => {
    const fire2 = document.getElementById('fire2');
    fire2.style.display = 'block';
    generateFire(fire2, firePosition2) // Make the element visible
    f2 = true;
}, 8000);
setTimeout(() => {
    const fire3 = document.getElementById('fire3');
    fire3.style.display = 'block';
    generateFire(fire3, firePosition3) // Make the element visible
    f3 = true;
}, 15000);
setInterval(generateCloud1, 100);
setInterval(generateCloud2, 100);


// Get the popup and the close button
const lossPopup = document.getElementById('loss-popup');
const closePopupBtn = document.getElementById('close-popup-btn');

// Function to show the loss popup
function showLossPopup() {
    lossPopup.style.display = 'flex'; // Show the popup (centered)
}

// Function to hide the popup when the close button is clicked

// Example game loop where you check for collisions or other conditions
function gameLoop() {
    // Your existing game logic (e.g., player movement, timer update)

    // Check for collision between player and cloud
    checkCollision();

    // You can continue updating game state here, such as moving the player, etc.
    const againButton = getElementById('play-again-btn');
    againButton.addEventListener('click', function() {
        window.location.href = "toastchoice.html";
    // Optionally, reset the game state here
    });
}

// You might want to call gameLoop repeatedly, for example using `setInterval`:
setInterval(gameLoop, 100); // Call every 100ms