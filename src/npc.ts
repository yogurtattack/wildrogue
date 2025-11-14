import * as ROT from "rot-js";

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

    interact(optionKey, display, player, messageLog) {
        const response = this.dialogue[optionKey];
        if (typeof response === "function") {
            messageLog.push(response(player));
        } else if (response) {
            messageLog.push(response)
        } else {
            messageLog.push("They stare at you silently before returning back to what they were doing.");
        }

        if (typeof this.action === "function") {
            this.action(optionKey, display, player, messageLog);
        }
    }
    }

export const Jeff = new NPC(5, 3, {
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



export const Janet = new NPC(24 , 6, {
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

export const JeffBoss = new NPC("Jeff", "boss", {
    Talk: (player) => "Yes, have you completed that sock trade yet?",
    "Quit": "You're trying to quit? No one quits me....*hits you vigorously on the noggin.",
    "Leave": "BACK TO WORK"
}, ["Talk", "Quit", "Leave"], function(optionKey, display, player, messageLog) {
    if(optionKey === "Quit") {
        player.health -= 50;
        player.coinage -= 30;
        messageLog.push("You pledge your undying love to the Office. Vowing never to quit again.")
    }

}, "&", "Jeff")

export function computePathToPlayer(player, map, jeff) {
    const passableCallback = (x,y) => map[y][x] !== "#";

    const astar = new ROT.Path.AStar(player.x,player.y, passableCallback);

    const path: [number, number][] = [];
    astar.compute(jeff.x, jeff.y, (x,y) => {
        path.push([x, y]);
    })
    path.pop();
    return path;

}

















