import { Matcher, System, system } from "@egret/ecs";
import { Application, GameEntity, Vector3 } from "@egret/engine";
import { CutFly } from "./CutFly";
import { CutFillFace } from "./CutFillFace";
import { CutFillFacePool } from "./CutFillFacePool";
import { CutFlyEntityPool } from "./CutFlyEntityPool";
import { GameSystem } from "../game/GameSystem";
import { MeshFilter } from "@egret/render";
import { BoxCollider, CylinderCollider, Rigidbody } from "@egret/oimo";

@system()
export class CutFlySystem extends System{
    getMatchers(){
        return[
            Matcher.create(GameEntity,true,CutFly),
            Matcher.create(GameEntity,true,CutFillFace)
        ];
    }


    public flyDistance = 5;

    //飞出去的力 s
    // private flyForce = Vector3.create(0, 3, 0);
    private flyForce = Vector3.create(1, 2, 0);
    private flyAngle = Vector3.create(2, 0, 0);
    //回收所有切割的物体以及创建的面 
    public recycleEntiies() {
        for (const entity of this.groups[1].entities) {
            CutFillFacePool.Instance.returnPool(entity as GameEntity)
        }
        for (const entity of this.groups[0].entities) {
            CutFlyEntityPool.Instance.returnPool(entity as GameEntity);
        }
    }

    //TODO 不删除刚体
    public removeALLEnititiesRigidBody() {
        for (const entity of this.groups[0].entities) {

            entity.removeComponent(Rigidbody)
            if (entity.getComponent(CylinderCollider)) {
                entity.removeComponent(CylinderCollider);

            }
            if (entity.getComponent(BoxCollider)) {
                entity.removeComponent(BoxCollider);
            }

        }
    }


    //该系统关心的实体组有实体被添加的生命周期。
    onEntityAdded(entity: GameEntity) {
        if (!Application.instance.systemManager.getSystem(GameSystem).usePhysics) {
            return;
        }
        if (entity.getComponent(CutFly)) {

            //添加物理组件
            const boxCollider = entity.addComponent(BoxCollider);
            //添加碰撞盒size
            const mesh = entity.getComponent(MeshFilter).mesh;
            const boundingBox = mesh.boundingBox;
            boxCollider.box.size.set(
                boundingBox.size.x,
                boundingBox.size.y,
                boundingBox.size.z,
            )
            boxCollider.box.size = boxCollider.box.size;
            boxCollider.box.center.set(boundingBox.center.x, boundingBox.center.y, boundingBox.center.z)
            boxCollider.box.center = boxCollider.box.center;

            boxCollider.friction = 0.4;//默认0.2
            boxCollider.restitution = 0.1;

            const rigidbody = entity.addComponent(Rigidbody);
            this.flyForce.x = (Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1);
            rigidbody.linearVelocity = this.flyForce;
            rigidbody.angularVelocity = this.flyAngle

        }
    } 


    onFrame(dt:number){  
        return;
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