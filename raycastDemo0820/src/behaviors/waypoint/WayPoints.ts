// import { component } from "@egret/ecs";
// import { Behaviour, Transform } from "@egret/engine";
// import { WayPointsController } from "@egret/waypoint";
// import { property, EditType } from "@egret/core";


// @component()
// export class RunningController extends Behaviour {

//     private _time: float = 0;

//     @property(EditType.Float)
//     private _totalTime: float = 10;

//     onStart() {
//         this._time = 0;
//     }

//     onUpdate(deltaTime: float) {
//         const controller = this.entity.getComponent(WayPointsController);
//         const transform = this.entity.getComponent(Transform);

//         transform.setLocalPosition(controller.getPointPosition(Math.min(this._time / this._totalTime, 1.0)));
//         this._time += deltaTime;
//     }

// }



