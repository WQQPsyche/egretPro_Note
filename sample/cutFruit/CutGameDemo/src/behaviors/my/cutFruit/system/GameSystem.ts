import { System, system } from "@egret/ecs";
import { Application } from "@egret/engine";
import { CutFlySystem } from "../CutFlySystem";
import { MyPhysicsSystem } from "./MyPhysicsSystem";

@system()
export class GameSystem extends System{
    // 是否使用物理引擎

    public usePhysics = true;

    onStart(){
        Application.instance.systemManager.registerSystem(CutFlySystem);
        if (this.usePhysics) {
            Application.instance.systemManager.registerSystem(MyPhysicsSystem);
        }else{
            Application.instance.systemManager.unregisterSystem(MyPhysicsSystem);
        }
    }
}