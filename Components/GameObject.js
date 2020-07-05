import Base from "./Base.js";

export default class GameObject {
  constructor(x, y) {
    this.ID;

    this.Position = {
      x: x,
      y: y,
    };

    this.RenderPosition = {
      x: this.Position.x * Base.WorldInstance.GridSize,
      y: this.Position.y * Base.WorldInstance.GridSize,
    };
  }

  Update() {
    this.RenderPosition = {
      x: this.Position.x * Base.WorldInstance.GridSize,
      y: this.Position.y * Base.WorldInstance.GridSize,
    };
  }

  StandingOn(GameObject) {
    if (
      GameObject.Position.x == this.Position.x &&
      GameObject.Position.y == this.Position.y
    )
      return true;
  }
}
