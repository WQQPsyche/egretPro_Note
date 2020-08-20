import { property, EditType } from "@egret/core";
import { GameEntity, Vector2 } from "@egret/engine";
import { CameraPostprocessing, Material, Camera } from "@egret/render";

export class ThermalVisionPostprocess2 extends CameraPostprocessing {
    @property(EditType.Float, { minimum: 0, maximum: 5 })
    public hotLight: number = 3.0;
    private _material: Material = Material.create(RES.getRes("shaders/thermalVision2/thermalVision2.shader.json"));
    private _rnd: Vector2 = Vector2.create();
    public initialize(defaultEnabled: boolean, config: any, entity: GameEntity) {
        super.initialize(defaultEnabled, config, entity);

        this._material.setTexture("heatLookupMap", RES.getRes("textures/HeatLookup.png"));
        this._material.setTexture("noiseMap", RES.getRes("textures/HeatNoise.png"));
    }

    public uninitialize() {
        super.uninitialize();
    }

    public onRender(camera: Camera) {
        this.renderPostprocessTarget(camera);
        //
        this._rnd.set(Math.random(), Math.random());
        const material = this._material;
        material.setVector2("rnd", this._rnd);
        material.setFloat("hotLight", this.hotLight);
        material.setTexture(camera.postprocessingRenderTarget);
        this.blit(camera.postprocessingRenderTarget, material);
    }
}