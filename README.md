# Interactive Adventure Game

## Introduction
This interactive adventure game lets players explore a dynamic world where they can collect items, navigate through different terrains, and experience smooth animations and gameplay mechanics. Built with HTML, CSS, and JavaScript, this game combines various web technologies to create an engaging environment for gamers.

## Features

### Player Movement and Animation
- **Directional Movement:** Players can move the character using the arrow keys or `W`, `A`, `S`, `D` keys. The game responds to both key press (`keydown`) and key release (`keyup`) events to start or stop the character's movement.
- **Smooth Animations:** Character movement is accompanied by smooth animations, changing dynamically based on the direction of the movement. This is achieved through CSS animations and sprites.

### Game Environment
- **Dynamic Tiles:** The game features a grid of tiles that the player can navigate. Each tile has a specific type, such as grass, water, or lava, and is represented visually in a distinct style.
- **Collision Detection:** The game prevents the player from moving through certain types of tiles, implementing basic collision detection logic.

### Item Interaction
- **Item Collection:** Various items like gold, pots, and gems are scattered throughout the game world. Players can collect these items by moving over them and pressing the 'E' or spacebar.
- **Item Animation:** Items disappear from the game grid with an animation when collected, enhancing the interactive experience.

### Debugging Tools
- **Visual Debugging:** The game includes visual debugging tools that highlight the current tile under the player and display the player's bounding box and registration point. This is useful for developers during the testing phase to understand movement and collision mechanics accurately.
