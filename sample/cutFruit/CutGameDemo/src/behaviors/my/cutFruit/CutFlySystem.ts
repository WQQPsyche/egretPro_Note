import { Matcher, System, system } from "@egret/ecs";
import { GameEntity } from "@egret/engine";
import { CutFly } from "./CutFly";
import { CutFillFace } from "./CutFillFace";
import { CutFillFacePool } from "./CutFillFacePool";
import { CutFlyEntityPool } from "./CutFlyEntityPool";

@system()
export class CutFlySystem extends System{
    getMatchers(){
        return[
            Matcher.create(GameEntity,true,CutFly),
            Matcher.create(GameEntity,true,CutFillFace)
        ];
    }

    public flyDistance = 5;

    onFrame(dt:number){
        
        const entities = this.groups[0].entities as GameEntity[];
        //遍历匹配到的实体，超出距离之后 回收 否则，移动距离f
        for (const entity of entities) {
            if (!entity.enabled) {
                return;
            }
            const cutFly = entity.getComponent(CutFly);
            if (cutFly.distance > this.flyDistance) {
                for (const component of entity.getComponentsInChildren(CutFillFace)) {
                    CutFillFacePool.Instance.returnPool(component.entity as GameEntity);
                }
                cutFly.distance = 0;
                CutFlyEntityPool.Instance.returnPool(entity);
            } else {
                entity.transform.position.set(
                    entity.transform.position.x + cutFly.moveSpeed.x * dt,
                    entity.transform.position.y + cutFly.moveSpeed.y * dt,
                    entity.transform.position.z + cutFly.moveSpeed.z * dt,
                )
                entity.transform.position = entity.transform.position;

                entity.transform.localEulerAngles.set(
                    entity.transform.localEulerAngles.x + dt * cutFly.rotateSpeed.x,
                    entity.transform.localEulerAngles.y + dt * cutFly.rotateSpeed.y,
                    entity.transform.localEulerAngles.z + dt * cutFly.rotateSpeed.z,
                );
                entity.transform.localEulerAngles = entity.transform.localEulerAngles;

                cutFly.distance += cutFly.moveSpeedLength * dt;   
               
                             
            }

        }
    }
}