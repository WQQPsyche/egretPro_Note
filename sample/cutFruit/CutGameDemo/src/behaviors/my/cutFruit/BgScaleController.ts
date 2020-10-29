import { Behaviour, Vector2, Matrix3 } from "@egret/engine";
import { component } from "@egret/ecs";
import { MeshRenderer, Material } from "@egret/render";
/** 桌布材质 缩放 repeat*/
@component()
export class BgScaleController extends Behaviour {

    private readonly _offset: Vector2 = Vector2.create();
    private readonly _repeat: Vector2 = Vector2.create(50.0, 50.0);
    private readonly _uvTransformMatrix: Matrix3 = Matrix3.create();

    onStart() {
        const material = this.entity.getComponent(MeshRenderer)!.material!;
        this._uvTransformMatrix.fromUVTransform(0, 0, this._repeat.x, this._repeat.y, 0, 0.0, 0.0);
        material.setUVTransform(this._uvTransformMatrix);
        material.getTexture().setRepeat(true);

    }

}