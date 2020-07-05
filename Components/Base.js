import World from "./World.js";

export default class Base {
  static WIDTH = 640;
  static HEIGHT = 480;
  static GRID_SIZE = 32;

  static Canvas;
  static Context;

  static WorldInstance = new World(
    this.WIDTH,
    this.HEIGHT,
    this.GRID_SIZE,
    0.5
  );

  static Init() {
    //setting size of canvas
    this.Canvas.width = this.WIDTH;
    this.Canvas.height = this.HEIGHT;

    //initiating world
    this.WorldInstance.Init();
  }

  static Draw() {
    //draw whole world
    this.WorldInstance.Draw(this.Context);
  }

  static Update() {
    //update whole world
    this.WorldInstance.Update();
  }
}
