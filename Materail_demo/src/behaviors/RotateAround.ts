import { component } from "@egret/ecs";
import { property, EditType, serializedField } from "@egret/core";
import { Vector3, Transform, Behaviour } from "@egret/engine";
/**
 * 
 */
@component()
export class RotateAround extends Behaviour {
    /**
     * 
     */
    @property(EditType.Float, { minimum: -10.0, maximum: 10.0 })
    @serializedField
    public rotateSpeed: float = 0.5;
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
    /** */
    private _radius: float = 0.0;
    private _radian: float = 0.0;
    /**
     * 
     * @param deltaTime 
     */
    public onLateUpdate(deltaTime: float): any {
        const transform = this.entity.transform;
        const position = transform.position;
        const target = this.lookAtPoint;
        if (this.target !== null) {
            target.copy(this.target.position);
        }
        //
        if (this.rotateSpeed !== 0.0) {
            const radius = Math.sqrt(Math.pow(position.x - target.x, 2) + Math.pow(position.z - target.z, 2));
            const radian = Math.atan2(position.z - target.z, position.x - target.x);
            //
            if (Math.abs(this._radius - radius) > 0.05) {
                this._radius = radius;
            }
            //
            if (Math.abs(this._radian - radian) > 0.05) {
                this._radian = radian;
            }
            //
            this._radian += deltaTime * this.rotateSpeed * 0.5;
            transform.setPosition(
                target.x + Math.cos(this._radian) * this._radius,
                position.y,
                target.z + Math.sin(this._radian) * this._radius
            );
        }
        transform.lookAt(target);
    }
}

// window['__reflectMap']['RotateAround'] = RotateAround;