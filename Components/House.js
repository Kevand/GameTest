import GameObject from "./GameObject.js";
import Base from "./Base.js";

class House extends GameObject {
  constructor(x, y) {
    super(x, y);

    this.Properties = {
      Inventory: [],
    };
  }

  Draw(Context) {
    Context.fillStyle = "#0000ff";
    Context.fillRect(
      this.RenderPosition.x,
      this.RenderPosition.y,
      Base.GRID_SIZE,
      Base.GRID_SIZE
    );
  }
}

class HousePart extends GameObject {
  constructor(x, y) {
    super(x, y);
  }

  Draw(Context) {
    Context.fillStyle = "#ff0000";
    Context.fillRect(
      this.RenderPosition.x,
      this.RenderPosition.y,
      Base.GRID_SIZE,
      Base.GRID_SIZE
    );
  }
}

export { House, HousePart };
