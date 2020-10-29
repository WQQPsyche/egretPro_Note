import { System, system, Matcher, IGroup } from "@egret/ecs";
import { Application, ExecuteMode, GameEntity, Transform, RigidbodyType } from "@egret/engine";
import { PhysicsWorld, PhysicsSystem, BaseCollider, Rigidbody, BoxCollider, SphereCollider, CylinderCollider, ConeCollider, CapsuleCollider } from "@egret/oimo";

export let test2 = 123;

@system({ allOfExecuteMode: ExecuteMode.Running })
export class MyPhysicsSystem extends System {

    public physicsWorld: PhysicsWorld = null;
    public physicsSystem: PhysicsSystem = null;

    private readonly _contactCallback: OIMO.ContactCallback = new OIMO.ContactCallback();

    protected getMatchers() {
        return [
            Matcher.create(GameEntity, false, Transform, Rigidbody)
                .extraOf(BoxCollider, SphereCollider, CylinderCollider, ConeCollider, CapsuleCollider),
        ];
    }

    onStart() {
        Application.instance.clock.tickInterval = 1 / 30;
        this.physicsSystem = Application.instance.systemManager.getSystem(PhysicsSystem);
        this.physicsWorld = Application.instance.globalEntity.getComponent(PhysicsWorld);
        this.physicsWorld.oimoWorld.setGravity(new OIMO.Vec3(0, 0, 5));

    }

    public onComponentEnabled(component: BaseCollider, group: IGroup) {
        const { groups } = this;
        if (group === groups[0]) {
            const { oimoShape } = component as BaseCollider;
            if (!oimoShape.getContactCallback()) {
                oimoShape.setContactCallback(this._contactCallback);
            }
        }
    }

}