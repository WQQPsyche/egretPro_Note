import { system, System } from "@egret/ecs";
import { Application } from "@egret/engine";
import { PhysicsSystem } from "@egret/oimo";
import { CutController } from "../cutFruit/CutController";
import { CutFlySystem } from "../cutFruit/CutFlySystem";
import { MyPhysicsSystem } from "../cutFruit/physics/MyPhysicsSystem";

@system()
export class GameSystem extends System {

    /**是否使用物理 */
    public usePhysics = true;

    onStart() {
        Application.instance.systemManager.registerSystem(CutFlySystem);
       

        if (this.usePhysics) {
            Application.instance.systemManager.registerSystem(MyPhysicsSystem);
        } else {
            Application.instance.systemManager.unregisterSystem(PhysicsSystem);
            console.log("unregisterSystem  PhysicsSystem");

        }

    }

    


}