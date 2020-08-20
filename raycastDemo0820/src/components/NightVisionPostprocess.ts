import { EditType, property } from "@egret/core";
import { Application, GameEntity } from "@egret/engine";
import { Camera, CameraPostprocessing, Material } from "@egret/render";

export class NightVisionPostprocess extends CameraPostprocessing {
    @property(EditType.Float, { minimum: 0, maximum: 1 })
    public fadeFX: number = 1.0;
    private _matrix9: Float32Array | null = new Float32Array(9);
    private _material: Material = Material.create(RES.getRes("shaders/nightVision/nightVision.shader.json"));
    private _time: number = 0.0;
    public initialize(defaultEnabled: boolean, config: any, entity: GameEntity) {
        super.initialize(defaultEnabled, config, entity);

        this._matrix9.set([2, -2, -2, 1.95, 0.04, -1.6, 2, -2, -2, -2, 0.1, -2]);
        this._material.setTypedArray("matrix9[0]", this._matrix9);
    }

    public uninitialize() {
        super.uninitialize();
    }

    public onRender(camera: Camera) {
        this.renderPostprocessTarget(camera);

        this._time += Application.instance.clock.tickTime;
        if (this._time > 100) {
            this._time = 0.0;
        }
        //
        const material = this._material;
        material.setFloat("fadeFX", this.fadeFX);
        material.setFloat("time", this._time);
        material.setTexture(camera.postprocessingRenderTarget);

        this.blit(camera.postprocessingRenderTarget, material);
    }
}