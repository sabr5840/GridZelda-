"use strict";

// Controller

window.addEventListener("load", start);

function start() {
  console.log("JavaScript kører...");

  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  createTiles();
  displayTiles();
  createItems();


  requestAnimationFrame(tick);
}

let lastTimestamp = 0;

function tick(timestamp) {
  requestAnimationFrame(tick);

  const deltaTime = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  movePlayer(deltaTime);

  checkForItems();

  displayPlayerAtPosition();
  displayPlayerAnimation();

  showDebugging();
}

// Model
const player = {
  x: 0,
  y: 0,
  regX: 10,
  regY: 12,
  hitbox: {
    x: 4,
    y: 7,
    w: 12,
    h: 17,
  },
  speed: 120,
  moving: false,
  direction: undefined,
  isTaking: false, 

};

const tiles = [
    [0, 1, 1, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 11, 5, 5, 5, 5, 5, 5],
    [0, 9, 0, 0, 0, 8, 0, 0, 3, 6, 6, 6, 6, 6, 3, 1, 0, 11, 5, 5, 4, 5, 5],
    [0, 9, 9, 0, 0, 0, 0, 0, 3, 6, 6, 6, 6, 6, 3, 0, 0, 0, 11, 11, 10, 11, 5],
    [0, 0, 0, 0, 0, 0, 0, 0, 3, 6, 6, 6, 6, 6, 3, 0, 9, 0, 0, 0, 10, 11, 11],
    [0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 7, 3, 3, 3, 0, 0, 0, 9, 0, 10, 9, 11],
    [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 10, 0, 0, 0, 0, 0, 9, 0, 0, 10, 0, 0],
    [0, 9, 0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0],
    [0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
    [2, 2, 2, 2, 12, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [9, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 1],
    [0, 9, 0, 0, 10, 9, 0, 0, 9, 0, 1, 0, 0, 0, 0, 3, 6, 6, 6, 3, 0, 0, 0],
    [1, 0, 1, 0, 10, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 3, 6, 6, 6, 3, 0, 1, 0],
    [0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 7, 3, 3, 0, 0, 0],
    [0, 0, 0, 0, 10, 9, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 10, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 10, 10, 10, 10, 10, 10, 10, 10, 8, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0],
    [9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 0, 0, 0, 0, 0, 0, 9, 0, 0],
    [0, 9, 0, 9, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 9, 0, 9, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 1, 0, 0, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 0, 0, 0, 0, 1, 0]
];

const GRID_HEIGHT = tiles.length; // row
const GRID_WIDTH = tiles[0].length; // col
const TILE_SIZE = 32;

function getTileAtCoordinate({ row, col }) {
  return tiles[row][col];
}

function CoordinateFromPosition({ x, y }) {
  const row = Math.round(y / TILE_SIZE);
  const col = Math.round(x / TILE_SIZE);
  const coordinate = { row, col };
  return coordinate;
}

function positionFromCoordinate() {}

function keyDown(event) {
  switch (event.key) {
    case "d":
    case "ArrowRight":
      controls.right = true;
      break;
    case "a":
    case "ArrowLeft":
      controls.left = true;
      break;
    case "w":
    case "ArrowUp":
      controls.up = true;
      break;
    case "s":
    case "ArrowDown":
      controls.down = true;
      break;
    case "e": 
    case " ": 
      controls.use = true;
      break;
  }
}

function keyUp(event) {
  switch (event.key) {
    case "d":
    case "ArrowRight":
      controls.right = false;
      break;
    case "a":
    case "ArrowLeft":
      controls.left = false;
      break;
    case "w":
    case "ArrowUp":
      controls.up = false;
      break;
    case "s":
    case "ArrowDown":
      controls.down = false;
      break;
    case "e": 
    case " ": 
      controls.use = false;
      break;
  }
}

const controls = {
  right: false,
  left: false,
  up: false,
  down: false,
  use: false
};

function movePlayer(deltaTime) {
    
    player.moving = false;

    const newPos = {
        x: player.x,
        y: player.y
    }

    if (controls.left) {
        player.moving = true;
        player.direction = "left";
        newPos.x -= player.speed * deltaTime;
    } else if (controls.right) {
        player.moving = true;
        player.direction = "right";
        newPos.x += player.speed * deltaTime;
    }

    if (controls.up) {
        player.moving = true;
        player.direction = "up";
        newPos.y -= player.speed * deltaTime;
    } else if (controls.down) {
        player.moving = true;
        player.direction = "down";
        newPos.y += player.speed * deltaTime;
    }

    if(canMoveTo(newPos)){
        player.x = newPos.x;
        player.y = newPos.y;
    }

}

function canMoveTo(pos) {
  const { row, col } = CoordinateFromPosition(pos);


  if (row < 0 || row >= GRID_HEIGHT || col < 0 || col >= GRID_WIDTH) {

    return false;
  }

  const tileType = getTileAtCoordinate({ row, col });

  switch (tileType) {
    case 0:
    case 1:
    case 10:
    case 6:
    case 12:
      return true;
    case 2:
    case 3:
    case 4:
    case 5:
    case 7: 
    case 8:
    case 9:
    case 11:    
      return false;
  }
}

function displayPlayerAnimation() {
  const visualPlayer = document.querySelector("#player");

  if (player.moving) {
    visualPlayer.classList.add("animate");
    visualPlayer.classList.remove("up", "down", "right", "left");
    visualPlayer.classList.add(player.direction);
  } else {
    visualPlayer.classList.remove("animate");
  }
}

function displayPlayerAtPosition() {
  const visualPlayer = document.querySelector("#player");
  visualPlayer.style.setProperty("transform", `translate(${player.x - player.regX}px, ${player.y - player.regY}px)`);
}

function createTiles() {
  const background = document.querySelector("#background");
  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      background.append(tile);
    }
  }
  background.style.setProperty("--GRID_WIDTH", GRID_WIDTH);
  background.style.setProperty("--GRID_HEIGHT", GRID_HEIGHT);
  background.style.setProperty("--TILE_SIZE", TILE_SIZE + "px");
}

function displayTiles() {
  const visualTiles = document.querySelectorAll("#background .tile");

  for (let row = 0; row < GRID_HEIGHT; row++) {
    for (let col = 0; col < GRID_WIDTH; col++) {
      const tileType = getTileAtCoordinate({ row, col });
      const visualTile = visualTiles[row * GRID_WIDTH + col];

      visualTile.classList.add(getClassForTileType(tileType));
    }
  }
}

function getClassForTileType(tileType) {
    switch (tileType) {
        case 0:
            return "grass";
        case 1:
            return "flower";
        case 2:
            return "water";
        case 3:
            return "redwall";
        case 4:
            return "mine";
        case 5:
            return "cliff";
        case 6:
            return "floor";
        case 7:
            return "door";
        case 8:
            return "well";
        case 9:
            return "tree";
        case 10:
            return "path";
        case 11:
            return "lava";
        case 12:
            return "floorStone";
        default:
            return "undefined"; // Default case for unassigned tile ids
    }
}

function showDebugging() {
  showDebugTileUnderPlayer();
  showDebugPlayerRect();
  showDebugPlayerRegistrationPoint();
}

let lastPlayerCoordinate = { row: 0, col: 0 };

function showDebugTileUnderPlayer() {
  const coordinate = CoordinateFromPosition(player);

  if (
    coordinate.row != lastPlayerCoordinate.row ||
    coordinate.col != lastPlayerCoordinate.col
  ) {
    unHighlightTile(lastPlayerCoordinate);
    highlightTile(coordinate);
  }
  lastPlayerCoordinate = coordinate;
}

function highlightTile({ row, col }) {
  const visualTiles = document.querySelectorAll("#background .tile");
  const visualTile = visualTiles[row * GRID_WIDTH + col];
  visualTile.classList.add("highlight");
}

function unHighlightTile({ row, col }) {
  const visualTiles = document.querySelectorAll("#background .tile");
  const visualTile = visualTiles[row * GRID_WIDTH + col];
  visualTile.classList.remove("highlight");
}

function showDebugPlayerRect() {
  const visualPlayer = document.querySelector("#player");
  if (!visualPlayer.classList.contains("show-rect")) {
    visualPlayer.classList.add("show-rect");
  }
}

function showDebugPlayerRegistrationPoint() {
  const visualPlayer = document.querySelector("#player");
  if (!visualPlayer.classList.contains("show-reg-point")) {
    visualPlayer.classList.add("show-reg-point");
  }

  visualPlayer.style.setProperty("--regX", player.regX + "px");
  visualPlayer.style.setProperty("--regY", player.regY + "px");
}





//Items handel 

const itemsGrid = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
];

const visualItemsGrid = [];

function createItems() {
  const itemsContainer = document.querySelector("#items");

  // Initialize visualItemsGrid with an empty array for each row
  for (let row = 0; row < itemsGrid.length; row++) {
    visualItemsGrid[row] = []; // Create a new array for the current row
    for (let col = 0; col < itemsGrid[row].length; col++) {
      const itemType = itemsGrid[row][col];
      if (itemType !== 0) { // Only create items where the value is not 0
        const itemElement = document.createElement("div");
        itemElement.classList.add("item");

        // Assign classes based on the itemType using a switch or if-else block
        switch (itemType) {
          case 1:
            itemElement.classList.add("gold");
            break;
          case 2:
            itemElement.classList.add("pot");
            break;
          case 3:
            itemElement.classList.add("gems");
            break;
          default:
            console.log("Unknown item type:", itemType);
            // Skip the rest of this iteration if the item type is unknown
            visualItemsGrid[row][col] = null;
            continue;
        }

        // Set the position for the item using CSS variables
        itemElement.style.setProperty("--row", row);
        itemElement.style.setProperty("--col", col);

        // Append the item element to the items container in the DOM
        itemsContainer.append(itemElement);

        // Store the item element in the visualItemsGrid
        visualItemsGrid[row][col] = itemElement;
      } else {
        // Set the current cell to null to indicate no item
        visualItemsGrid[row][col] = null;
      }
    }
  }
}


function checkForItems() {
  const items = getItemsUnderPlayer();
  if (items.length > 0 && controls.use && !player.isTaking) {
    player.isTaking = true;
    items.forEach(takeItem);
  }

  // Tjek om brug-tasten er sluppet efter en samle-aktion
  if (player.isTaking && !controls.use) {
    player.isTaking = false;
  }
}



function getItemsUnderPlayer() {
  const coords = getTileCoordsUnder(player); // Assuming this returns [{ row, col }]
  return coords.filter(({ row, col }) => itemsGrid[row][col] !== 0)
    .map(({ row, col }) => {
      return {
        row: row,
        col: col,
        value: itemsGrid[row][col]
      };
    });
}

function getTileCoordsUnder(player) {
  const row = Math.floor(player.y / TILE_SIZE);
  const col = Math.floor(player.x / TILE_SIZE);
  return [{ row, col }];
}


function takeItem(coords) {
  const itemValue = itemsGrid[coords.row][coords.col];
  if (itemValue !== 0) {
    itemsGrid[coords.row][coords.col] = 0; // Fjerner item fra spillets grid

    const visualItem = visualItemsGrid[coords.row][coords.col];
    if (visualItem) {
      visualItem.classList.add("take"); // Starter animationen

      // Fjerner item efter animationen er fuldført
      visualItem.addEventListener('animationend', function handleAnimationEnd() {
        visualItem.remove(); // Fjerner item fra DOM'en
        visualItem.removeEventListener('animationend', handleAnimationEnd); // Fjerner event listeneren
      }, { once: true }); // Denne event listener vil kun udløse én gang

      // Afspiller lydeffekt
      new Audio('simple-assets/sounds/coins.mp3').play();
    }
  }
}








