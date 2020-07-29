import { property, EditType } from "@egret/core";
import { FrontFace, CullFace } from "@egret/gltf";
import { component } from "@egret/ecs";
import { Vector2, Application, GameEntity, Matrix4, Stage } from "@egret/engine";
import { CameraPostprocessing, RenderTexture, Material, Camera, TextureFilterMode } from "@egret/render";

@component()
export class MotionBlurPostprocess extends CameraPostprocessing {
    private _velocityFactor: number = 1.0;
    private _samples: number = 20;
    private _resolution: Vector2 = Vector2.create(1.0, 1.0);

    private _depthRenderTarget: RenderTexture | null = null;
    private _preMatrix: Matrix4 | null = null;
    private _stage: Stage | null = null;
    private readonly _depathMaterial: Material = Material.create(RES.getRes("shaders/motionBlur/blurDepth.shader.json"));
    private readonly _material: Material = Material.create(RES.getRes("shaders/motionBlur/motionBlur.shader.json"));

    public initialize(defaultEnabled: boolean, config: any, entity: GameEntity) {
        super.initialize(defaultEnabled, config, entity);

        const stage = this._stage = Application.instance.stage;

        this._resolution.set(stage.viewport.w, stage.viewport.h);

        this._depathMaterial.setDepth(true, true).setCullFace(true);
        this._material.setDepth(true, true).setCullFace(false).setFloat("velocityFactor", this._velocityFactor);
    }

    public uninitialize() {
        super.uninitialize();

        // if (this._depthRenderTarget) { 
        //     this._depthRenderTarget.dispose();
        // }

        // if (this._depathMaterial) {
        //     this._depathMaterial.dispose();
        // }

        // if (this._material) {
        //     this._material.dispose();
        // }

        this._resolution.release();

        if (this._preMatrix) {
            this._preMatrix.release();
        }
    }

    public onRender(camera: Camera) {
        this.renderPostprocessTarget(camera);
        const stage = this._stage!;
        const depthMaterial = this._depathMaterial;
        const material = this._material;
        const renderContext = this._renderContext;
        const postProcessingRenderTarget = camera.postprocessingRenderTarget;

        if (!this._depthRenderTarget) {
            this._depthRenderTarget = RenderTexture.create({ width: stage.viewport.w, height: stage.viewport.h, premultiplyAlpha: 1 }).setFilter(TextureFilterMode.Bilinear).setRepeat(false).setMipmap(true);
        }

        depthMaterial.setFloat("mNear", camera.near).setFloat("mFar", camera.far);
        if (!this._preMatrix) {
            this._preMatrix = camera.worldToClipMatrix.clone();
        }

        //
        material.setTexture("tColor", postProcessingRenderTarget);
        material.setTypedArray("viewProjectionInverseMatrix", camera.clipToWorldMatrix.rawData);
        material.setTypedArray("previousViewProjectionMatrix", this._preMatrix.rawData);

        camera.renderTarget = this._depthRenderTarget;
        renderContext.render(camera, depthMaterial, null);
        camera.renderTarget = null;

        material.setTexture("tDepth", this._depthRenderTarget);

        this.blit(postProcessingRenderTarget, this._material);

        this._preMatrix.copy(camera.worldToClipMatrix);
    }

    @property(EditType.Float, { minimum: 0.1 })
    public get velocityFactor() {
        return this._velocityFactor;
    }

    @property(EditType.Float, { minimum: 1 })
    public get samples() {
        return this._samples;
    }
    public set velocityFactor(value: number) {
        if (this._velocityFactor !== value) {
            this._velocityFactor = value;
            this._material.setFloat("velocityFactor", value);
        }
    }

    public set samples(value: number) {
        if (this._samples !== value) {
            this._material.removeDefine(`SAMPLE_NUM ${this._samples}`);
            this._samples = value;
            this._material.addDefine(`SAMPLE_NUM ${this._samples}`);
        }
    }
}
