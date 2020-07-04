import GameObject from "./GameObject.js";
import { Extra } from "./Extra.js";
import Base from "./Base.js";

let TreeTypes = Object.freeze({
    SMALL: { Equipment: 2, Size: 4 },
    MEDIUM: { Equipment: 4, Size: 8 },
    LARGE: { Equipment: 6, Size: 12 },
    EXTRA_LARGE: { Equipment: 8, Size: 16 },
});

export default class Tree extends GameObject {
    constructor(x, y) {
        super(x, y);

        this.Properties = Extra.GetRandomProperty(TreeTypes);
        this.LastEq = this.Properties.Equipment;

    }

    Draw(context) {
        context.fillStyle = "#153619";
        context.beginPath();
        context.arc(this.RenderPosition.x + (Base.GRID_SIZE / 2), this.RenderPosition.y + (Base.GRID_SIZE / 2), this.Properties.Size, 0, 2 * Math.PI);
        context.fill();
    }

    Update() {
        if (this.LastEq != this.Properties.Equipment) {
            console.log(this.LastEq + "|" + this.ID);
            this.LastEq = this.Properties.Equipment;
        }
    }
}