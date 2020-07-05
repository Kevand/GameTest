import GameObject from "./GameObject.js";
import { Extra } from "./Extra.js";
import Base from "./Base.js";

let TreeTypes = Object.freeze({
  SMALL: {
    Inventory: [
      {
        Type: "Wood",
        Count: 2,
      },
    ],
    Size: 4,
  },
  MEDIUM: {
    Inventory: [
      {
        Type: "Wood",
        Count: 4,
      },
    ],
    Size: 8,
  },
  LARGE: {
    Inventory: [
      {
        Type: "Wood",
        Count: 6,
      },
    ],
    Size: 12,
  },
  EXTRA_LARGE: {
    Inventory: [
      {
        Type: "Wood",
        Count: 8,
      },
    ],
    Size: 4,
  },
});

export default class Tree extends GameObject {
  constructor(x, y) {
    super(x, y);

    this.Properties = Extra.GetRandomProperty(TreeTypes);
    this.LastEq = this.Properties.Inventory[0].Count;
  }

  Draw(context) {
    context.fillStyle = "#153619";
    context.beginPath();
    context.arc(
      this.RenderPosition.x + Base.GRID_SIZE / 2,
      this.RenderPosition.y + Base.GRID_SIZE / 2,
      this.Properties.Size,
      0,
      2 * Math.PI
    );
    context.fill();
  }

  Update() {
    if (this.LastEq != this.Properties.Inventory[0].Count) {
      this.LastEq = this.Properties.Inventory[0].Count;
      console.log("Value Changed: ( ID: " + this.ID + " )");
    }

    super.Update();
  }
}
