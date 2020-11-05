import { BaseCollider, BoxCollider } from "@egret/oimo";
import { component, IGroup, Matcher, System, system } from "@egret/ecs";
import { Application, ExecuteMode, GameEntity, Transform } from "@egret/engine";
import { CapsuleCollider, ConeCollider, CylinderCollider, PhysicsSystem, PhysicsWorld, Rigidbody, SphereCollider } from "@egret/oimo";

@system({allOfExecuteMode:ExecuteMode.Running})
export class MyPhysicsSystem extends System{
    public physicsWorld:PhysicsWorld = null;
    public physicsSystem:PhysicsSystem = null;

    private readonly _contactCallback:OIMO.ContactCallback = new OIMO.ContactCallback();

    protected getMatchers(){
        return [
            Matcher.create(GameEntity,false,Transform,Rigidbody)
                   .extraOf(BoxCollider,SphereCollider,CylinderCollider,ConeCollider,CapsuleCollider)
        ];
    }

    onStart(){
        // 设置物理世界的刷新频率
        Application.instance.clock.tickInterval = 1/30;
        this.physicsSystem = Application.instance.systemManager.getSystem(PhysicsSystem);
        this.physicsWorld = Application.instance.globalEntity.getComponent(PhysicsWorld);

        this.physicsWorld.oimoWorld.setGravity( new OIMO.Vec3(0,0,5));
        

        
    }

    // public onComponentEnabled(componet:BaseCollider,group:IGroup){
    //     const {groups } = this;
    //     if (group === groups[0]) {
    //         const {oimoShape} = componet as BaseCollider;
    //         if (!oimoShape.getContactCallback()) {
    //             oimoShape.setContactCallback( this._contactCallback);
    //         }

            
    //     }
    // }
}