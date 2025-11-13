import * as ROT from "rot-js";
import {townMap} from "./townMap.ts";
import {house} from "./townMap.ts";

let map = townMap;

class NPC {
    constructor(x,y, dialogue = {}, menu = [],  action = null, char = "", name = "") {
        this.x = x;
        this.y = y;
        this.char = char;
        this.name = name;
        this.menu = menu;
        this.dialogue = dialogue;
        this.action = action;
    }

    interact(optionKey, display) {
        const response = this.dialogue[optionKey];
        if (response) {
            messageLog.push(response);
        } else{
            messageLog.push("They stare at you silently before returning back to what they were doing.")
        }
        if (typeof this.action === "function") {
            this.action(optionKey, display);
        }
    }
}

class Player {
    constructor() {
        this.x = 1;
        this.y = 1;
        this.inventory = [];
        this.coinage = 100;
        this.health = 100;
        this.hunger = 100;
        this.goodness = 0;
        this.badness = 0;
        this.name = "";
    }
}
function setTile(map, x, y, char) {
    map[y] = map[y].substring(0,x) + char + map[y].substring(x + 1);
}

const player = new Player();
const Jeff = new NPC(5, 3, {
    "Talk": "Jeff says: 'Socks are the backbone of this economy.'",
    "Buy House": "Jeff nods. 'That'll be 50 coins.'",
    "Leave": "Jeff turns away silently."
},["Talk", "Buy House", "Leave"], function(optionKey, display) {
    if (optionKey === "Buy House") {
        if (player.coinage >= 50 && !player.house) {
            player.coinage -= 50;
            player.house = {x: 25, y:1};
            setTile(map, 24, 1, "D");
            messageLog.push("You now own a house!");
        } else if (player.house) {
            messageLog.push("Jeff: 'You already own property. Buy some socks.");
        } else {
            messageLog.push("Jeff: 'Come Back with you have the coin.'");
        }
    }
}, "&", "Jeff")
const Janet = new NPC(24 , 6, {
    "Talk": "Janet mutter: 'I need help....but not from you.'",
    "Gift": "Janet blushes. 'I guess I'll take it.'",
    "Leave": "Janet scoffs and walks off."
}, ["Talk", "Gift", "Leave"], null, "J", "Janet");
let npcList = [Jeff, Janet];
let houseNPCList = [];
const display = new ROT.Display()
const messageLog = [];

document.body.appendChild(display.getContainer());

function draw() {
	display.clear();
    for (let y = 0; y < map.length; y++) {
        const row = map[y];
        for (let x = 0; x < row.length; x++){
            const ch = row[x];
            let fg = "#9999";

            if (ch === "#") fg = "#444";
            if (ch === ".") fg = "#222";

            display.draw(x, y, ch, fg, "#000")

        }
    }
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

function enterHouse() {
    map = house;
    npcList = houseNPCList;
    player.x = 1;
    player.y = 1;
    messageLog.push("You enter your house.");
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === "@") {
                player.x = x;
                player.y = y;
                setTile(map, x, y, ">");
                return;
            }
        }
    }
}

function checkForPortal(x, y) {
    const tile = map[y][x];

    if (tile === "D" && player.house) {
        enterHouse();
        return true;
    }

    if (tile === "E") {
        map = townMap;
        npcList = [Jeff, Janet];
        player.x = player.house.x;
        player.y = player.house.y;
        messageLog.push("You step back into the town.");
        return true;
    }
    return false;
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
    const tile = map[y][x];
    if (tile === "#" || tile === "H") return true;
    for (let npc of npcList) {
        if (npc.x === x && npc.y === y) {
            return true;
        }
    }
    return false;
}

function showInteractionMenu(npc) {
   messageLog.push(`Interact with ${npc.name}`);
    {
        npc.menu.forEach((option, index) => {
            messageLog.push(`${index + 1}. ${option}`);
        })
    }

    draw();

    function menuHandler(e) {
        console.log("Pressed:", e.key);
        const index = parseInt(e.key) -1;
        const optionKey = npc.menu[index];
        if (optionKey) {
            npc.interact(optionKey, display);
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
        case "ArrowUp":
            newY--;
            break;
        case "ArrowDown":
            newY++;
            break;
        case "ArrowLeft":
            newX--;
            break;
        case "ArrowRight":
            newX++;
            break;
        case "z": {
            const nearbyNPC = getAdjacentNPC(player, npcList);
            if (nearbyNPC) {
                showInteractionMenu(nearbyNPC);
            }
            return;
        }
        default:
            return;
    }

    // Check for portal tile
    const tile = map[newY][newX]; // ← use newX/newY, not player.x/y
    if (tile === "D" && player.house) {
        enterHouse();
        return;
    }

    // Move if not blocked
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
