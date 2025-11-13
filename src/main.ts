import * as ROT from "rot-js";

class NPC {
    constructor(x,y, greeting = "", action = action, char = "", name = "") {
        this.x = x;
        this.y = y;
        this.char = char;
        this.name = name;
        this.greeting = greeting;
        this.action = action;
    }

    interact(display) {
        if (this.greeting) {
            messageLog.push(this.greeting);
        }
        if (typeof this.action === "function") {
            this.action(display);
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
const Jeff = new NPC(5, 3, "I have tons of socks for you", (display) => {
    player.goodness += 5;
    display.drawText(1, 21, "That was better than a fresh pair of socks.")
}, "&", "Jeff");
const Janet = new NPC(7 , 7, "Please get away from me man...I'm A WOMAN I NEED HELP", (display) => {
    player.badness += 5;
    display.drawText(1, 21, "Ohhh I like a bad boy.");
}, "J", "Janet");
const npcList = [Jeff, Janet]
const display = new ROT.Display()
const messageLog = [];

document.body.appendChild(display.getContainer());

function draw() {
	display.clear();
	display.draw(player.x, player.y, "@", "#ff0", "#000");

    for (let npc of npcList) {
        display.draw(npc.x, npc.y, npc.char, "#aa0", "#000")
    }

    while (messageLog.length > 5) {
        messageLog.shift();
    }

    for (let i = 0; i < messageLog.length; i++) {
        display.drawText(1, 20 +i, messageLog[i]);
    }
}



function getAdjacentNPC(player, npcList) {
    for (let npc of npcList) {
        const dx = Math.abs(npc.x - player.x);
        const dy = Math.abs(npc.y - player.y);
        if ((dx + dy) === 1) {
            return npc;
        }
    }
    return null;
}

function isBlocked(x, y) {
    for (let npc of npcList) {
        if (npc.x === x && npc.y === y) {
            return true;
        }
    }
    return false;
}

function showInteractionMenu(npc) {
    messageLog.push(`Interact with ${npc.name}`);
    messageLog.push("1. Talk");
    messageLog.push("2. Gift");
    messageLog.push("3. Leave");

    draw();

    function menuHandler(e) {
        switch (e.key) {
            case "1":
                messageLog.push("You talk to them...");
                npc.interact(display);
                break;
            case "2":
                messageLog.push("You offer a gift....");
                break;
            case "3":
                messageLog.push("You walk away.");
                break;
            default:
                return;
        }
        window.removeEventListener("keydown", menuHandler);
        draw();
    }
   window.addEventListener("keydown", menuHandler);
}

function handleInput(e) {
    // Save current position
    let newX = player.x;
    let newY = player.y;

    // Move player
    switch (e.key) {
        case "ArrowUp": newY--; break;
        case "ArrowDown": newY++; break;
        case "ArrowLeft": newX--; break;
        case "ArrowRight": newX++; break;
        case "z": {
            const nearbyNPC = getAdjacentNPC(player,npcList);
            if (nearbyNPC) {
                showInteractionMenu(nearbyNPC);
            }
            return;
        }
        default: return;
    }

    if (!isBlocked(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }

    draw();
}

draw();
gameLoop();


function gameLoop() {
    draw();
    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", handleInput);
