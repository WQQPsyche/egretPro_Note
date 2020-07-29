import { EditType, property, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import { Behaviour, Vector3 } from "@egret/engine";
/**
 * 
 */
@component()
export class Rotater extends Behaviour {
    /**
     * 
     */
    @property(EditType.Vector3)
    @serializedField
    public readonly speed: Vector3 = Vector3.create(0.0, 45.0, 0.0);
    /**
     * 
     */
    public onUpdate(deltaTime: float) {
        const { speed } = this;
        this.entity.transform.rotate(
            speed.x * deltaTime,
            speed.y * deltaTime,
            speed.z * deltaTime
        );
    }
}
