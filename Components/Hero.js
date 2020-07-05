import GameObject from "./GameObject.js";
import Base from "./Base.js";
import Tree from "./Tree.js";

let States = Object.freeze({
  IDLE: 0,
  FINDING_TREE: 1,
  GETTING_TREE: 2,
  WALKING_TO_TREE: 3,
  WALKING_TO_HOUSE: 4,
  TIRED: 5,
  WALKING_FOR_REST: 6,
  RESTING: 7,
});

class Hero extends GameObject {
  constructor(x, y) {
    super(x, y);

    this.Pathfinding = {
      Grid: new PF.Grid(Base.WorldInstance.PathfindingGrid),
      Finder: new PF.AStarFinder(),
      Path: [],
      PathStep: 0,
    };

    this.Properties = {
      State: States.IDLE,
      Inventory: [],
      Tiredness: 0,
    };

    this.FocusedObject = null;
  }

  Draw(Context) {
    Context.fillStyle = "#34ebeb";
    Context.fillRect(
      this.RenderPosition.x + Base.GRID_SIZE * 0.15,
      this.RenderPosition.y + Base.GRID_SIZE * 0.15,
      Base.GRID_SIZE * 0.7,
      Base.GRID_SIZE * 0.7
    );
  }

  MoveTo(x, y) {
    let BackupGrid = this.Pathfinding.Grid.clone();
    var Path = this.Pathfinding.Finder.findPath(
      this.Position.x,
      this.Position.y,
      x,
      y,
      this.Pathfinding.Grid
    );
    this.Pathfinding.Path = Path;
    this.MoveAlongPath();
    this.Pathfinding.Grid = BackupGrid;
  }

  MoveAlongPath() {
    const Tween = new TWEEN.Tween(this.Position)
      .to(
        {
          x: this.Pathfinding.Path[this.Pathfinding.PathStep][0],
          y: this.Pathfinding.Path[this.Pathfinding.PathStep][1],
        },
        350
      )
      .onComplete(() => {
        if (this.Pathfinding.PathStep !== this.Pathfinding.Path.length - 1) {
          this.Pathfinding.PathStep++;
          this.MoveAlongPath();
        } else {
          this.Pathfinding.PathStep = 0;
        }
      })
      .start();
  }

  FindNearestTree() {
    let Trees = Base.WorldInstance.GameObjects.filter((e, i) => {
      return e instanceof Tree;
    });
    let TreesDistance = [],
      HorizontalDistance,
      VerticalDistance;
    let NearestTree;

    Trees.forEach((Tree) => {
      HorizontalDistance = Math.abs(this.Position.x - Tree.Position.x);
      VerticalDistance = Math.abs(this.Position.y - Tree.Position.y);
      let Distance = Math.sqrt(
        Math.pow(HorizontalDistance, 2) + Math.pow(VerticalDistance, 2)
      );
      TreesDistance.push({
        Distance: Distance,
        Tree: Tree,
      });
    });

    TreesDistance.forEach((Tree) => {
      if (
        typeof NearestTree == "undefined" ||
        NearestTree.Distance > Tree.Distance
      )
        NearestTree = Tree;
    });

    return NearestTree;
  }

  Update() {
    if (this.Properties.State == States.IDLE) {
      this.Properties.State = States.FINDING_TREE;
    }

    if (this.Properties.State == States.FINDING_TREE) {
      let NearestTree = this.FindNearestTree();
      this.MoveTo(NearestTree.Tree.Position.x, NearestTree.Tree.Position.y);
      this.Properties.State = States.WALKING_TO_TREE;
      this.FocusedObject = NearestTree.Tree;
    }

    Base.WorldInstance.GameObjects.forEach((GameObject) => {
      if (
        this.StandingOn(GameObject) &&
        this.Properties.State == States.WALKING_TO_TREE &&
        this.FocusedObject.ID === GameObject.ID
      ) {
        GameObject.Properties.Inventory[0].Count -= 1;
        this.Properties.Inventory.push({ Type: "Wood", Count: 1 });
        this.Properties.State = States.GETTING_TREE;
      }
    });

    //console.log(Base.WorldInstance.GameObjects);

    if (this.Properties.State == States.GETTING_TREE) {
      this.Properties.State = States.WALKING_TO_HOUSE;
      this.MoveTo(
        Base.WorldInstance.HouseObject.Position.x,
        Base.WorldInstance.HouseObject.Position.y
      );
    }

    if (
      this.StandingOn(Base.WorldInstance.HouseObject) &&
      this.Properties.State == States.WALKING_TO_HOUSE
    ) {
      this.Properties.Inventory.forEach((Item) => {
        let Contain = false;
        Base.WorldInstance.HouseObject.Properties.Inventory.forEach(
          (HouseItem) => {
            if (Item.Type == HouseItem.Type) {
              HouseItem.Count += Item.Count;
              this.Properties.Inventory = this.Properties.Inventory.filter(
                (e) => {
                  return e.Type != Item.Type;
                }
              );

              Contain = true;
            }
          }
        );

        if (!Contain) {
          Base.WorldInstance.HouseObject.Properties.Inventory.push(Item);
          this.Properties.Inventory = this.Properties.Inventory.filter((e) => {
            return e.Type != Item.Type;
          });
        }
      });

      this.Properties.State = States.FINDING_TREE;
    }

    TWEEN.update();
    super.Update();
  }
}

export { States, Hero };
