import Base from "./Components/Base.js";

Base.Canvas = document.getElementById("ctx");
Base.Context = Base.Canvas.getContext("2d");

let PAUSE = false;

let Render = () => {
  if (!PAUSE) {
    Base.Context.clearRect(0, 0, Base.WIDTH, Base.HEIGHT);
    Base.Draw();
    Base.Update();
    requestAnimationFrame(Render);
  }
};

window.onload = () => {
  Base.Init();
  Render();
};

window.addEventListener("keydown", (e) => {
  if (e.key == "p" && PAUSE == true) PAUSE = false;
  if (e.key == "p" && PAUSE == false) PAUSE = true;
});
