import * as ROT from "rot-js";
import {townMap} from "./townMap.ts";
import {house} from "./townMap.ts";
import {office} from "./townMap.ts";

let map = townMap;
const tileSize = 18;
const display = new ROT.Display({
    width: 123,
    height: 33,
    fontSize: tileSize
});

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
            messageLog.push("Coin deduction triggered.");
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
    "Buy Food": "Janet grumbles, 'Fine. Here's some stew.'",
    "Leave": "Janet scoffs and walks off."
}, ["Talk", "Gift", "Buy Food", "Leave"], function(optionKey, display) {
    if (optionKey === "Buy Food") {
        if (player.coinage >= 10) {
            player.coinage -= 10;
            player.inventory.push("Stew");
            messageLog.push("You receive a warm bowl of stew.");
        } else {
            messageLog.push("You can't afford my stew! Scram!")
        }
    }
}, "J", "Janet");
let npcList = [Jeff, Janet];
let houseNPCList = [];
//const display = new ROT.Display()
const messageLog = [];


document.body.appendChild(display.getContainer());

function draw() {
	display.clear();
    display.drawText(97, 0, `Name: ${player.name}`);
    display.drawText(97, 1, `Health: ${player.health}`);
    display.drawText(97,  2,`Hunger: ${player.hunger}`);
    display.drawText(97, 3, `Coins: ${player.coinage}`);

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

const name = window.prompt("Name your adventurer:");
if (name) {
    player.name = name.trim();
    messageLog.push(`Welcome, ${player.name}!`);
} else {
    player.name = "Wanderer";
    messageLog.push("Starts adventure with boring name.");
};

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
let workTick = 0;
let hasStartedWork = false;
function doWork() {
    const tile = map[player.y][player.x];
    if (tile === "C") {
        workTick++;

        if (!hasStartedWork) {
            messageLog.push("Started Work");
            hasStartedWork = true;
        }
        if (workTick >= 300){
            workTick = 0;
            messageLog.push("Whoa, momma Big Money")
            player.coinage++;
            }
    } else {
        workTick = 0;
        hasStartedWork = false;
    }
}

function checkForPortal(x, y) {
    draw();
    const tile = map[y][x];

    if (tile === "D" && player.house) {
        enterHouse();
        return true;
    }

    if (tile === "E") {
        map = townMap;
        npcList = [Jeff, Janet];
        Jeff.x = 5;
        Jeff.y = 3;
        player.x = 1;
        player.y = 1;
        messageLog.push("You step back into the town.");
        return true;
    }

    if (tile === "O") {
        map = office;
        npcList = [Jeff];
        Jeff.x = 38;
        Jeff.y = 1;
        player.x = 1;
        player.y = 1;
        messageLog.push("Welcome back to work, please choose a cubicle.");
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
    if (tile === "#" || tile === "H" || tile === "|") return true;
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
        case "e": {
            const index = player.inventory.indexOf("Stew");
            if (index !== -1) {
                player.inventory.splice(index, 1);
                player.hunger = Math.min(player.hunger + 30, 100);
                messageLog.push("You eat the stew.  Warmth fills your bell.");
                player.health = player.health + 50;
            } else {
                messageLog.push("No food to eat....try buying some from Janet.");
            }
            break;
        }
        case "i": {
            let player_info = [
                `Name: ${player.name}`,
                `Health: ${player.health}`,
                `Hunger: ${player.hunger}`,
                `Coins: ${player.coinage}`
            ];
            player_info.forEach(line => messageLog.push(line));
        }
        break;

        default: return;
    }

    // Check for portal tile
    if (checkForPortal(newX, newY)) return;

    // Move if not blocked
    if (!isBlocked(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }

    draw();
}
draw();



let hungerTick = 0;

function gameLoop() {
    draw();
    doWork();

    hungerTick++;
    if (hungerTick >= 300) {
        hungerTick = 0;
        if (player.hunger > 0) {
            player.hunger --;
        } else {
            messageLog.push("You feel faint from hunger.")
            player.health --;
        }
    }
    if (player.health <= 0){
        messageLog.push("You collapse from exhaustion...  Your journey comes to an end.");
        window.removeEventListener("keydown", handleInput);
        cancelAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
}

window.addEventListener("keydown", handleInput);
gameLoop();