import { property, EditType, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import { Vector3, Transform, Behaviour } from "@egret/engine";
/**
 * 
 */
@component()
export class LookAtTarget extends Behaviour {
    /**
     * 
     */
    @property(EditType.Vector3)
    @serializedField
    public readonly lookAtPoint: Vector3 = Vector3.create();
    /**
     * 
     */
    @property(EditType.Component, { componentClass: Transform })
    @serializedField
    public target: Transform | null = null;
    /**
     * 
     */
    public onUpdate() {
        const target = this.lookAtPoint;
        if (this.target !== null) {
            target.copy(this.target.position);
        }
        this.entity.transform.lookAt(target);
    }
}
