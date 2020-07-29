import { property, EditType } from "@egret/core";
import { CameraPostprocessing, Material, Camera } from "@egret/render";

export class ThermalVisionPostprocess extends CameraPostprocessing {
    @property(EditType.Float, { minimum: 0, maximum: 1 })
    public thermaValue: number = 1.0;
    private _material: Material = Material.create(RES.getRes("shaders/thermalVision/thermalVision.shader.json"));

    public onRender(camera: Camera) {
        this.renderPostprocessTarget(camera);
        //
        const material = this._material;
        material.setFloat("thermaValue", this.thermaValue);
        material.setTexture(camera.postprocessingRenderTarget);
        this.blit(camera.postprocessingRenderTarget, material);
    }
}