import { IGroup, component, system, System, Matcher } from "@egret/ecs";
import {
    RigidbodyType,
    GameEntity, Transform, Behaviour,
    SystemOrder, Application,
} from "@egret/engine";
import {
    Rigidbody,
    BaseCollider, BoxCollider, SphereCollider, CylinderCollider, ConeCollider, CapsuleCollider
} from "@egret/oimo";
/**
 * 将场景中的刚体重置的组件。
 */
@component()
export class RigidbodyReseter extends Behaviour {

    public onAwake() {
        Application.instance.systemManager.registerSystem(RigidbodysResetSystem);
        Application.instance.systemManager.registerSystem(CollidersContactSystem, SystemOrder.LateUpdate);
    }
}
/**
 * 重置刚体位置的系统。
 */
@system()
class RigidbodysResetSystem extends System {

    public top: float = 20.0;
    public bottom: float = -20.0;
    public area: float = 10.0;

    protected getMatchers() {
        return [
            Matcher.create(GameEntity, true, Transform, Rigidbody),
        ];
    }

    public onTickCleanup() {
        for (const entity of this.groups[0].entities) {
            const rigidbody = entity.getComponent(Rigidbody)!;
            if (
                rigidbody.type === RigidbodyType.Dynamic
                && entity.getComponent(Transform)!.localPosition.y < this.bottom
            ) {
                entity.getComponent(Transform)!.setLocalPosition(
                    Math.random() * this.area - this.area * 0.5,
                    this.top,
                    Math.random() * this.area - this.area * 0.5,
                );
            }
        }
    }
}
/**
 * 检测碰撞体接触碰撞的系统。
 */
@system()
class CollidersContactSystem extends System {

    private readonly _contactCallback: OIMO.ContactCallback = new OIMO.ContactCallback();

    protected getMatchers() {
        return [
            Matcher.create(GameEntity, false, Transform, Rigidbody)
                .extraOf(BoxCollider, SphereCollider, CylinderCollider, ConeCollider, CapsuleCollider),
        ];
    }

    public onAwake() {
        this._contactCallback.beginContact = (contact: OIMO.Contact) => {
            const colliderA = contact.getShape1().userData as BaseCollider;
            const colliderB = contact.getShape2().userData as BaseCollider;
            console.info("beginContact", colliderA.entity.node.name, colliderB.entity.node.name);
        };
        this._contactCallback.preSolve = (contact: OIMO.Contact) => { };
        this._contactCallback.postSolve = (contact: OIMO.Contact) => { };
        this._contactCallback.endContact = (contact: OIMO.Contact) => {
            const colliderA = contact.getShape1().userData as BaseCollider;
            const colliderB = contact.getShape2().userData as BaseCollider;
            // console.info("endContact", colliderA.entity.node.name, colliderB.entity.node.name);
        };
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
