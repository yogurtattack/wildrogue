export class Player {
    x: number;
    y: number;
    inventory: string[];
    coinage: number;
    health: number;
    hunger: number;
    goodness: number;
    badness: number;
    name: string;
    firstHouse: boolean;
    secondHouse: boolean;

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
        this.firstHouse;
        this.secondHouse;
    }
}