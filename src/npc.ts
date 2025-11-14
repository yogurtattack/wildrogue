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