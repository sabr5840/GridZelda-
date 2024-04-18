document.addEventListener('DOMContentLoaded', (event) => {
    start();
});

function start() {
    console.log("javascript is running");

    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
                controls.left = true;
                break;
            case 'ArrowRight':
                controls.right = true;
                break;
            case 'ArrowUp':
                controls.up = true;
                break;
            case 'ArrowDown':
                controls.down = true;
                break;
        }
    });

    document.addEventListener('keyup', function(e) {
        switch(e.key) {
            case 'ArrowLeft':
                controls.left = false;
                break;
            case 'ArrowRight':
                controls.right = false;
                break;
            case 'ArrowUp':
                controls.up = false;
                break;
            case 'ArrowDown':
                controls.down = false;
                break;
        }
    });

    requestAnimationFrame(tick);
}

const player = {
    x: 0,
    y: 0,
    speed: 100, 
    moving: 120,
    regX: 8, 
    regY: 12,
    direction: undefined

};

function displayPlayerAtPos() {
    const visualPlayer = document.querySelector("#player");
    visualPlayer.style.transform = `translate(${player.x}px, ${player.y}px)`;
}

let lastTimestamp = 0;

function tick(timestamp) {
    requestAnimationFrame(tick);

    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    movePlayer(deltaTime);
    
    displayPlayerAtPos();
    displayPlayerAnimation();
    showDebugging();

    
}

function tick(timestamp) {
    requestAnimationFrame(tick);

    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    movePlayer(deltaTime);
    displayPlayerAtPos();
    displayPlayerAnimation();

    showDebugging();
}

const controls = {
    left: false,
    right: false,
    up: false,
    down: false
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

function displayPlayerAnimation() {
    const visualPlayer = document.querySelector("#player");

    if(player.moving){
        visualPlayer.classList.add("animate");
        visualPlayer.classList.remove("up", "down", "left", "right");
        visualPlayer.classList.add(player.direction);
    }else {
        visualPlayer.classList.remove("animate");

    }
}

let lastLoggedTileCoord = { col: null, row: null, type: null };

function getTileCoordUnder(player) {
    const TILE_SIZE = 32; 
    const NUM_TILES_WIDTH = 23; 
    const NUM_TILES_HEIGHT = 19; 


    const col = Math.floor(player.x / TILE_SIZE);
    const row = Math.floor(player.y / TILE_SIZE);

    if (col < 0 || col >= NUM_TILES_WIDTH || row < 0 || row >= NUM_TILES_HEIGHT) {
        return { col: null, row: null, type: 'undefined' };
    }
    
    const tiles = document.querySelectorAll('#background .tile');

    const index = row * NUM_TILES_WIDTH + col;

    const tileType = (tiles[index] && tiles[index].classList.length > 1) ? tiles[index].classList[1] : 'undefined';

    if (lastLoggedTileCoord.col !== col || lastLoggedTileCoord.row !== row) {

        unhighlightTile(lastLoggedTileCoord);

        lastLoggedTileCoord = { col, row, type: tileType };

        highlightTile({ col, row });
    }

    // Log the tile info if there's a change
    if (lastLoggedTileCoord.type !== tileType) {
        console.log(`Player is now at tile coordinates: row=${row}, col=${col}, type=${tileType}`);
        lastLoggedTileCoord.type = tileType; 
    }

    return { col, row, type: tileType };
}


function canMoveTo(pos) {
    const TILE_SIZE = 32; 
    const NUM_TILES_WIDTH = 23; 
    const NUM_TILES_HEIGHT = 19; 

    const playerWidth = 30; 
    const playerHeight = 30; 

    const gameFieldWidth = NUM_TILES_WIDTH * TILE_SIZE; 
    const gameFieldHeight = NUM_TILES_HEIGHT * TILE_SIZE; 

    if (pos.x < 0 || pos.x > (gameFieldWidth - TILE_SIZE) || pos.y < 0 || pos.y > (gameFieldHeight - TILE_SIZE)) {
        console.log(`Position out of bounds: x=${pos.x}, y=${pos.y}`);
        return false;
    }

    // Udregner hjørnepositionerne for spillerens bounding box.
    const corners = [
        { x: pos.x - playerWidth / 2, y: pos.y - playerHeight / 2 },
        { x: pos.x + playerWidth / 2, y: pos.y - playerHeight / 2 },
        { x: pos.x - playerWidth / 2, y: pos.y + playerHeight / 2 },
        { x: pos.x + playerWidth / 2, y: pos.y + playerHeight / 2 },
    ];

    const tileCoord = getTileCoordUnder(pos);

    return corners.every(corner => {
        const tileCoord = getTileCoordUnder(corner);
        return isTileWalkable(tileCoord);
    });
}


function isTileWalkable(tileCoord) {
    const NUM_TILES_WIDTH = 23; 
    const tiles = document.querySelectorAll('#background .tile');
    const index = tileCoord.row * NUM_TILES_WIDTH + tileCoord.col;
    if (index >= 0 && index < tiles.length) {
        const tile = tiles[index];
        switch (tile.classList[1]) { 
            case 'grass':
            case 'flower':
            case 'path':
            case 'floor':
            case 'floorStone':
                return true;
            case 'water':
            case 'tree':
            case 'redwall':
            case 'lava':
            case 'mine':
            case 'cliff':
            case 'well':
            case 'door':
                return false;
            default:
                return false;
        }
    } else {
        return false; 
    }
}

const TILE_SIZE = 32; 

function highlightTile(coord) {
    const tiles = document.querySelectorAll('#background .tile');
    const index = coord.row * 23 + coord.col; 
    if (tiles[index]) {
        tiles[index].classList.add('highlight');
    }
}

function unhighlightTile(coord) {
    const tiles = document.querySelectorAll('#background .tile');
    const index = coord.row * 23 + coord.col; 
    if (tiles[index]) {
        tiles[index].classList.remove('highlight');
    }
}

let debugHighlightedTile = { col: null, row: null };

function showDebugTileUnderPlayer() {
    const currentTile = getTileCoordUnder(player);

    // If there's a previously highlighted tile, unhighlight it
    if (debugHighlightedTile.col !== null && debugHighlightedTile.row !== null) {
        unhighlightTile(debugHighlightedTile);
    }

    // Highlight the new tile
    highlightTile(currentTile);

    // Update the debug highlighted tile to the new tile
    debugHighlightedTile = { col: currentTile.col, row: currentTile.row };
}

function showDebugging() {
    showDebugTileUnderPlayer();
    showDebugPlayerRegPoint();

}

function showDebugPlayerRegPoint() {
    const visualPlayer = document.querySelector("#player");
    visualPlayer.style.setProperty('--regX', `${player.regX}px`);
    visualPlayer.style.setProperty('--regY', `${player.regY}px`);
    visualPlayer.classList.add('show-reg-point');
}

function displayPlayerAtPos() {
    const visualPlayer = document.querySelector("#player");
    visualPlayer.style.transform = `translate(${player.x - player.regX}px, ${player.y - player.regY}px)`;
}

function showDebugPlayerRect() {
    const playerElement = document.querySelector("#player");
    playerElement.classList.add('show-rect');
}

// In your game loop (tick function), add:
showDebugPlayerRect();














