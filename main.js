const canvas = document.getElementById('ctx');
const ctx = canvas.getContext('2d');

const settings = {};

settings.GRID_SIZE = 32;
settings.WIDTH = canvas.clientWidth / settings.GRID_SIZE;
settings.HEIGHT = canvas.clientHeight / settings.GRID_SIZE;

//#region PATHFINDING

var es = new EasyStar.js();

//#endregion

//#region SCENE CLASS 

class Scene {
    constructor(density) {
        this.grid = [];
        this.density = density;
        this.trees = [];
    }

    generateMap() {
        for (let y = 0; y < settings.HEIGHT; y++) {
            this.grid[y] = [];
            for (let x = 0; x < settings.WIDTH; x++) {
                let ran = Math.random();

                if (ran < this.density) {
                    this.grid[y][x] = Math.round(1 + Math.random());
                    if (this.grid[y][x] === 1)
                        this.trees.push(new Tree(x, y));
                } else {
                    this.grid[y][x] = 0;
                }

            }
        }

    }

    drawMap(context) {
        for (let y = 0; y < settings.HEIGHT; y++) {
            for (let x = 0; x < settings.WIDTH; x++) {

                if (this.grid[y][x] == 2)
                    context.fillStyle = '#454545';
                else
                    context.fillStyle = '#53995b';

                context.fillRect(
                    x * settings.GRID_SIZE,
                    y * settings.GRID_SIZE,
                    settings.GRID_SIZE,
                    settings.GRID_SIZE
                );
            }
        }

        this.trees.forEach(tree => {
            tree.draw(context);
            if (tree.equipment == 0) {
                this.grid[tree.y][tree.x] = 0;
                es.setGrid(this.grid);
                this.trees = this.trees.filter((e, i) => {
                    return (e != tree);
                });
            }
        });
    }
}

//#endregion

window.addEventListener('keydown', k => {
    if (k.key == "d")
        hero.findNearestTree();
});

//#region HERO CLASS


class Hero {
    constructor() {
        //PLAYER POSITION
        this.position = {
            x: 64,
            y: 64
        }

        this.gridPosition = {
            x: this.position.x / 32,
            y: this.position.y / 32
        }
        //PATH FINDING VARS
        this.path = null;
        this.pathStep = 1;

        //GAME VARS

        //0 = idle
        this.states = Object.freeze({
            IDLE: 0,
            FINDING_TREE: 1,
            GETTING_TREE: 2,
            WALKING_TO_TREE: 3,
            WALKING_TO_HOUSE: 4,
            TIRED: 5,
            WALKING_FOR_REST: 6,
            RESTING: 7
        });
        this.state = this.states.FINDING_TREE;
        this.equipment = [];
        this.tiredness = 0;

    }

    moveTo(x, y) {
        es.findPath(this.position.x / 32, this.position.y / 32, x, y, path => {
            if (path !== null) {
                this.path = path;
                this.moveAlongPath();
            }
        });

    }

    moveAlongPath() {
        const tw = new TWEEN.Tween(this.position)
            .to({ x: this.path[this.pathStep].x * 32, y: this.path[this.pathStep].y * 32 }, 350).onComplete(() => {
                if (this.pathStep !== this.path.length - 1) {
                    this.pathStep++;
                    this.moveAlongPath();
                } else {
                    this.pathStep = 0;
                }
            }).start();

    }

    findNearestTree() {
        let trees = [];
        for (let y = 0; y < scene.grid.length; y++) {
            for (let x = 0; x < scene.grid[y].length; x++) {
                if (scene.grid[y][x] == 1) {
                    trees.push({ x: x, y: y });
                }
            }
        }

        let nearestTree = null;

        trees.forEach(e => {
            let distance = distanceFromObject(hero.position.x / 32, hero.position.y / 32, e.x, e.y);
            if (nearestTree == null || distance < nearestTree.distance) {
                nearestTree = { distance: distance, x: e.x, y: e.y };
            }
        });

        return nearestTree;

    }

    draw(context) {
        context.fillStyle = '#0000ff';
        context.fillRect(
            this.position.x + ((settings.GRID_SIZE / 2) / 2),
            this.position.y + ((settings.GRID_SIZE / 2) / 2),
            settings.GRID_SIZE / 2, settings.GRID_SIZE / 2
        );
    }

    update() {

        this.gridPosition = {
            x: this.position.x / 32,
            y: this.position.y / 32
        }

        if (this.state === this.states.FINDING_TREE) {
            this.state = this.states.WALKING_TO_TREE;
            let tree = this.findNearestTree();
            this.moveTo(tree.x, tree.y);
        } else if (this.state === this.states.GETTING_TREE) {
            this.state = this.states.WALKING_TO_HOUSE;
            this.moveTo(house.gridPosition.x, house.gridPosition.y);
        } else if (this.state === this.states.TIRED) {
            this.state = this.states.WALKING_FOR_REST;
            this.moveTo(house.gridPosition.x, house.gridPosition.y);
            console.log("TEST");
        }

        scene.trees.forEach(tree => {
            if (tree.x == this.gridPosition.x && tree.y == this.gridPosition.y && this.state == this.states.WALKING_TO_TREE) {
                tree.equipment -= 1;
                this.equipment.push({ type: "tree", count: 1 });
                this.tiredness += 1;
                this.state = this.states.GETTING_TREE;
            }
        });

        if (house.gridPosition.x == this.gridPosition.x &&
            house.gridPosition.y == this.gridPosition.y) {

            if (this.state == this.states.WALKING_TO_HOUSE) {
                house.equipment.push(this.equipment[0]);
                this.equipment = [];
                this.state = this.states.FINDING_TREE;
            } else if (this.state == this.states.WALKING_FOR_REST) {
                this.state = this.states.RESTING;
            }

        }

        if (this.state == this.states.RESTING) {
            setInterval(() => {
                this.tiredness--;
            }, 1000);

            if (this.tiredness == 0) {
                this.state = this.states.FINDING_TREE;
            }
        }

        if (this.tiredness == 10) {
            this.state = this.states.TIRED;
        }


    }
}


//#endregion

//#region HOUSE

class House {
    constructor() {
        this.equipment = [];
        this.x = 17 * 32;
        this.y = 32;
        this.gridPosition = {
            x: 17,
            y: 1
        }
    }

    draw(context) {
        context.fillStyle = '#ff0000';
        context.fillRect(17 * 32, 32, 64, 64);
    }
}

//#endregion

//#region TREE CLASS

class Tree {
    constructor(x, y) {
        this.equipment = 5;
        this.x = x;
        this.y = y;
    }

    draw(context) {
        context.globalAlpha = this.equipment / 5;
        context.fillStyle = "#153619";
        context.beginPath();
        context.arc(
            this.x * settings.GRID_SIZE + (settings.GRID_SIZE / 2),
            this.y * settings.GRID_SIZE + (settings.GRID_SIZE / 2),
            16,
            0,
            2 * Math.PI
        );
        context.fill();
        context.globalAlpha = 1;
    }
}

//#endregion

//#region VARS

const scene = new Scene(0.2);
const hero = new Hero();
const house = new House();

//#endregion

function distanceFromObject(x, y, x2, y2) {
    let hDis = Math.abs(x - x2);
    let vDis = Math.abs(y - y2);
    return Math.sqrt(Math.pow(hDis, 2) + Math.pow(vDis, 2));
}

//at start
window.onload = () => {
    scene.generateMap();
    canvas.width = 640;
    canvas.height = 480;
    es.setGrid(scene.grid);
    es.setAcceptableTiles([0, 1]);

    loop();
}

//app loop
const loop = () => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    //rendering everything
    scene.drawMap(ctx);
    house.draw(ctx);
    hero.draw(ctx);

    //writing wood supply
    ctx.font = "20px Verdana";
    ctx.fillStyle = '#fff';
    ctx.fillText("Drewno: " + house.equipment.filter((e, i) => { return (e.type == "tree"); }).length, 16, 32);


    //updating player status
    hero.update();


    es.calculate();
    //setting animation
    requestAnimationFrame(loop);
    TWEEN.update();
}



