import GameObject from "./GameObject.js";
import Base from "./Base.js";

export default class Stone extends GameObject {
  constructor(x, y) {
    super(x, y);
  }

  Draw(Context) {
    Context.fillStyle = "#454545";
    Context.fillRect(
      this.RenderPosition.x,
      this.RenderPosition.y,
      Base.GRID_SIZE,
      Base.GRID_SIZE
    );
  }

  Update() {
    super.Update();
  }
}
