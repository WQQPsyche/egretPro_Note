import { Matcher, System, system } from "@egret/ecs";
import { Application, GameEntity, Vector3 } from "@egret/engine";
import { CutFly } from "./CutFly";
import { CutFillFace } from "./CutFillFace";
import { CutFillFacePool } from "./CutFillFacePool";
import { CutFlyEntityPool } from "./CutFlyEntityPool";
import { MeshFilter } from "@egret/render";
import { BoxCollider, Rigidbody } from "@egret/oimo";


@system()
export class CutFlySystem extends System{
    getMatchers(){
        return[
            Matcher.create(GameEntity,true,CutFly),
            Matcher.create(GameEntity,true,CutFillFace)
        ];
    }


    public flyDistance = 5;

    private flyforce = Vector3.create(1,2,0);
    private flyAngle = Vector3.create(2,0,0);
    onStart(){
        console.log(this.groups);
        
    }
    onEntityAdded(entity:GameEntity){
       
        
        // if ( Application.instance.systemManager.getSystem(GameSystem).usePhysics) {
        //     return;
        // }
        if ( entity.getComponent(CutFly)) {

            const boxColider = entity.addComponent(BoxCollider);
            const mesh = entity.getComponent(MeshFilter).mesh;
            const boundingBox = mesh.boundingBox;
            boxColider.box.size.set(
                boundingBox.size.x,
                boundingBox.size.y,
                boundingBox.size.z
            );
            boxColider.box.size = boxColider.box.size;

            boxColider.box.center.set(boundingBox.center.x,boundingBox.center.y,boundingBox.center.z);
            boxColider.box.center = boxColider.box.center;

            boxColider.friction = 0.4;
            boxColider.restitution = 0.1;

            const rigidBody = entity.addComponent(Rigidbody);
            this.flyforce.x = (Math.random()*0.3) * (Math.random()>0.5? 1:-1);
            rigidBody.linearVelocity = this.flyforce;
            rigidBody.angularVelocity = this.flyAngle;

        }
        
    }

    public changePhysics(){
        for(const entity of this.groups[0].entities as GameEntity[]){
            const boxColider = entity.addComponent(BoxCollider);
            const mesh = entity.getComponent(MeshFilter).mesh;
            const boundingBox = mesh.boundingBox;
            boxColider.box.size.set(
                boundingBox.size.x,
                boundingBox.size.y,
                boundingBox.size.z
            );
            boxColider.box.size = boxColider.box.size;

            boxColider.box.center.set(boundingBox.center.x,boundingBox.center.y,boundingBox.center.z);
            boxColider.box.center = boxColider.box.center;

            boxColider.friction = 0.4;
            boxColider.restitution = 0.1;

            const rigidBody = entity.addComponent(Rigidbody);
            this.flyforce.x = (Math.random()*0.3) * (Math.random()>0.5? 1:-1);
            rigidBody.linearVelocity = this.flyforce;
            rigidBody.angularVelocity = this.flyAngle;
        }
    }

    // 回收所有的切割物体以及创建的面
    public recycleEntities(){
        for(const entity of this.groups[0].entities){
            
            CutFlyEntityPool.Instance.returnPool(entity as GameEntity);
            // CutFlyEntityPool.Instance.clear();
        }
        for( const entity of this.groups[1].entities){
            CutFillFacePool.Instance.returnPool(entity as GameEntity)
            // CutFillFacePool.Instance.clear();
        }
        
    }

    public  removeEntityRigidBody(){
        for(const entity of this.groups[0].entities){
            entity.removeComponent(Rigidbody)
            if (entity.getComponent(BoxCollider)) {
                entity.removeComponent(BoxCollider);
            }
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