import { EditType, property, serializedField } from "@egret/core";
import { component } from "@egret/ecs";
import { Application, Behaviour, Transform, Vector3 } from "@egret/engine";
/**
 * 
 */
@component()
export class Wander extends Behaviour {
    /**
     * 
     */
    @property(EditType.Float)
    @serializedField
    public radius: float = 1.0;
    /**
     * 
     */
    @property(EditType.Vector3)
    @serializedField
    public readonly timeScale: Vector3 = Vector3.create(1.0, 0.7, 0.4);
    /**
     * 
     */
    @property(EditType.Vector3)
    @serializedField
    public readonly center: Vector3 = Vector3.create();
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
        const time = Application.instance.clock.frameTime;
        const radius = this.radius;
        const timeScale = this.timeScale;
        const center = this.center;
        if (this.target !== null) {
            center.copy(this.target.position);
        }
        this.entity.transform.setLocalPosition(
            Math.sin(time * timeScale.x) * radius + center.x,
            Math.cos(time * timeScale.y) * radius + center.y,
            Math.cos(time * timeScale.z) * radius + center.z,
        );
    }
}
