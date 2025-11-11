import * as ROT from "rot-js";

class NPC {
    constructor(x,y, greeting = "", action = null, char = "") {
        this.x = x;
        this.y = y;
        this.char = char;
        this.greeting = greeting;
        this.action = null;
    }

    interact(display) {
        if (this.greeting) {
            display.drawText(1, 20, this.greeting);
        }
        if (typeof this.action === "function") {
            this.action;
        }
    }
}

class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.inventory = [];
        this.health = 100;
        this.hunger = 100;
        this.goodness = 0;
        this.badness = 0;
        this.name = "";
    }
}


const player = new Player();
const Jeff = new NPC(5, 3, "I have tons of socks for you", null, "&")
const Janet = new NPC(7 , 7, "Please get away from me man...I'm A WOMAN I NEED HELP", null, "J")
const npcList = [Jeff, Janet]
const display = new ROT.Display()
document.body.appendChild(display.getContainer());

function draw() {
	display.clear();
	display.draw(player.x, player.y, "@", "#ff0", "#000");

    for (let npc of npcList) {
        display.draw(npc.x, npc.y, npc.char, "#aa0", "#000")
    }
}

draw();

function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();



window.addEventListener("keydown", handleInput);

function handleInput(e) {
    // Save current position
    const prevX = player.x;
    const prevY = player.y;

    // Move player
    switch (e.key) {
        case "ArrowUp": player.y--; break;
        case "ArrowDown": player.y++; break;
        case "ArrowLeft": player.x--; break;
        case "ArrowRight": player.x++; break;
        default: return;
    }
    for (let npc of npcList) {
        if (player.x === npc.x && player.y === npc.y) {
            player.x = prevX;
            player.y = prevY;
            draw();
            npc.interact(display);
            return;
        }
    }
    draw();
}




