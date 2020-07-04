import GameObject from "./GameObject.js";
import { Extra } from "./Extra.js";
import Base from "./Base.js";

let TreeTypes = Object.freeze({
  SMALL: {
    Equipment: [
      {
        Type: "Wood",
        Count: 2,
      },
    ],
    Size: 4,
  },
  MEDIUM: {
    Equipment: [
      {
        Type: "Wood",
        Count: 4,
      },
    ],
    Size: 8,
  },
  LARGE: {
    Equipment: [
      {
        Type: "Wood",
        Count: 6,
      },
    ],
    Size: 12,
  },
  EXTRA_LARGE: {
    Equipment: [
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

  Update() {}
}
