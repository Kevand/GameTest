import Tree from "./Tree.js";
import Stone from "./Stone.js";
import { House, HousePart } from "./House.js";
import Base from "./Base.js";
import { Hero } from "./Hero.js";

export default class World {
    constructor(width, height, grid_size, collectable_density) {

        //properties
        this.Width = width;
        this.Height = height;
        this.GridSize = grid_size;
        this.CollectableDensity = collectable_density;
        this.GridDimensions = {
            Width: this.Width / this.GridSize,
            Height: this.Height / this.GridSize
        }

        //actual grid
        this.Grid = [];
        this.PathfindingGrid = [];
        this.GameObjects = [];

        this.HouseObject;
        this.HeroObject;
    }

    Init() {
        let g = [];

        console.log("Initializing");

        //generating map with trees and stones
        for (let y = 0; y < this.GridDimensions.Height; y++) {
            g[y] = [];
            this.PathfindingGrid[y] = [];
            for (let x = 0; x < this.GridDimensions.Width; x++) {

                if (Math.random() < this.CollectableDensity) {
                    g[y][x] = Math.round(1 + Math.random());
                }

                this.PathfindingGrid[y][x] = 0;

            }
        }

        //setting house position

        let RandomHousePosition = {
            x: Math.round(3 + (Math.random() * (this.GridDimensions.Width - 7))),
            y: Math.round(3 + (Math.random() * (this.GridDimensions.Height - 6)))
        };

        //Setting grid to match the house and house parts positions

        //actual house
        g[RandomHousePosition.y][RandomHousePosition.x] = 3;

        //house parts

        if (RandomHousePosition.x > this.GridDimensions.Width / 2) {
            //if house on left side of map
            g[RandomHousePosition.y][RandomHousePosition.x + 1] = 4;
            g[RandomHousePosition.y][RandomHousePosition.x + 2] = 4;
            g[RandomHousePosition.y + 1][RandomHousePosition.x + 1] = 4;
            g[RandomHousePosition.y + 1][RandomHousePosition.x + 2] = 4;
            g[RandomHousePosition.y - 1][RandomHousePosition.x + 1] = 4;
            g[RandomHousePosition.y - 1][RandomHousePosition.x + 2] = 4;

            //clear around house

            //right side
            g[RandomHousePosition.y][RandomHousePosition.x + 3] = 0;
            g[RandomHousePosition.y + 1][RandomHousePosition.x + 3] = 0;
            g[RandomHousePosition.y - 1][RandomHousePosition.x + 3] = 0;
            g[RandomHousePosition.y + 2][RandomHousePosition.x + 3] = 0;
            g[RandomHousePosition.y - 2][RandomHousePosition.x + 3] = 0;

            //top down around house parts
            g[RandomHousePosition.y + 2][RandomHousePosition.x + 2] = 0;
            g[RandomHousePosition.y - 2][RandomHousePosition.x + 2] = 0;
            g[RandomHousePosition.y + 2][RandomHousePosition.x + 1] = 0;
            g[RandomHousePosition.y - 2][RandomHousePosition.x + 1] = 0;

            //around house
            g[RandomHousePosition.y + 2][RandomHousePosition.x] = 0;
            g[RandomHousePosition.y - 2][RandomHousePosition.x] = 0;
            g[RandomHousePosition.y + 1][RandomHousePosition.x] = 0;
            g[RandomHousePosition.y - 1][RandomHousePosition.x] = 0;
            g[RandomHousePosition.y][RandomHousePosition.x - 1] = 0;
            g[RandomHousePosition.y + 1][RandomHousePosition.x - 1] = 0;
            g[RandomHousePosition.y - 1][RandomHousePosition.x - 1] = 0;

        } else {
            //on the right side
            g[RandomHousePosition.y][RandomHousePosition.x - 1] = 4;
            g[RandomHousePosition.y][RandomHousePosition.x - 2] = 4;
            g[RandomHousePosition.y + 1][RandomHousePosition.x - 1] = 4;
            g[RandomHousePosition.y + 1][RandomHousePosition.x - 2] = 4;
            g[RandomHousePosition.y - 1][RandomHousePosition.x - 1] = 4;
            g[RandomHousePosition.y - 1][RandomHousePosition.x - 2] = 4;

            //clear around house

            //left side
            g[RandomHousePosition.y][RandomHousePosition.x - 3] = 0;
            g[RandomHousePosition.y + 1][RandomHousePosition.x - 3] = 0;
            g[RandomHousePosition.y - 1][RandomHousePosition.x - 3] = 0;
            g[RandomHousePosition.y + 2][RandomHousePosition.x - 3] = 0;
            g[RandomHousePosition.y - 2][RandomHousePosition.x - 3] = 0;

            //top down around house parts
            g[RandomHousePosition.y + 2][RandomHousePosition.x - 2] = 0;
            g[RandomHousePosition.y - 2][RandomHousePosition.x - 2] = 0;
            g[RandomHousePosition.y + 2][RandomHousePosition.x - 1] = 0;
            g[RandomHousePosition.y - 2][RandomHousePosition.x - 1] = 0;

            //around house
            g[RandomHousePosition.y + 2][RandomHousePosition.x] = 0;
            g[RandomHousePosition.y - 2][RandomHousePosition.x] = 0;
            g[RandomHousePosition.y + 1][RandomHousePosition.x] = 0;
            g[RandomHousePosition.y - 1][RandomHousePosition.x] = 0;
            g[RandomHousePosition.y][RandomHousePosition.x + 1] = 0;
            g[RandomHousePosition.y + 1][RandomHousePosition.x + 1] = 0;
            g[RandomHousePosition.y - 1][RandomHousePosition.x + 1] = 0;
        }

        //setting main grid

        this.Grid = g;

        //after generating grid, add gameobject to array for every assigned number in grid

        //support variable for ID's
        let ID = 0;

        for (let y = 0; y < this.GridDimensions.Height; y++) {
            for (let x = 0; x < this.GridDimensions.Width; x++) {
                if (this.Grid[y][x] == 1) {
                    let t = new Tree(x, y);
                    t.ID = ID;
                    ID++;
                    this.GameObjects.push(t);
                }
                if (this.Grid[y][x] == 2) {
                    let s = new Stone(x, y);
                    s.ID = ID;
                    ID++;
                    this.GameObjects.push(s);
                    this.PathfindingGrid[y][x] = 1;
                }
                if (this.Grid[y][x] == 4) {
                    let hp = new HousePart(x, y);
                    hp.ID = ID;
                    ID++;
                    this.PathfindingGrid[y][x] = 1;
                    this.GameObjects.push(hp);
                }
            }
        }

        //adding player on house

        this.HouseObject = new House(RandomHousePosition.x, RandomHousePosition.y);
        this.HeroObject = new Hero(RandomHousePosition.x, RandomHousePosition.y);

        console.log(this.GameObjects);
    }

    //Drawing all game objects
    Draw(Context) {
        //drawing grass
        Context.fillStyle = "#53995b";
        for (let y = 0; y < this.GridDimensions.Height; y++) {
            for (let x = 0; x < this.GridDimensions.Width; x++) {
                Context.fillRect(x * Base.GRID_SIZE, y * Base.GRID_SIZE, Base.GRID_SIZE, Base.GRID_SIZE);
            }
        }

        //drawing every game object
        this.GameObjects.forEach(GameObject => {
            GameObject.Draw(Context);
        });

        //drawing player
        this.HouseObject.Draw(Context);
        this.HeroObject.Draw(Context);
    }

    Update() {
        //updating state of every gameobject
        this.GameObjects.forEach(GameObject => {
            GameObject.Update();
            if (GameObject instanceof Tree && GameObject.Properties.Equipment == 0) {
                this.GameObjects = this.GameObjects.filter((e, i) => { return (e.ID != GameObject.ID) });
            }
        });

        //updating state of player
        this.HouseObject.Update();
        this.HeroObject.Update();
    }
}