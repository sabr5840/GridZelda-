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

    // Starter animation loop
    requestAnimationFrame(tick);
}

const player = {
    x: 0,
    y: 0,
    speed: 100, // Enheder per sekund
    moving: 120,
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

function canMoveTo (pos){
    if(pos.x < 0 || player.x > 484 || pos.y < 0 || pos.y > 340 ){
        return false;
    }else{
        return true;
    }
}




