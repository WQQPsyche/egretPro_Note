import { ResourceManager } from "@egret/core";
import { component } from "@egret/ecs";
import { Behaviour, EngineFactory, Matrix3, Vector2 } from "@egret/engine";
import { BlendMode, DefaultMeshes, DefaultShaders, DefaultTextures, Material, MeshFilter, MeshRenderer, RenderQueue } from "@egret/render";

@component()
export class Blending extends Behaviour {
    public async onAwake() {
        const textures = [
            "assets/textures/blending/UV_Grid_Sm.image.json",
            "assets/textures/blending/sprite0.image.json",
            "assets/textures/blending/sprite0_p.image.json",
            "assets/textures/blending/lensflare0.image.json",
            "assets/textures/blending/lensflare0_alpha.image.json"
        ];
        const Res = ResourceManager.instance;
        Res.baseUrl = "resource/";
        for (let i = 0; i < textures.length; i++) {
            await Res.loadUri(textures[i]);
        }
        const blends = [BlendMode.None, BlendMode.Normal, BlendMode.Additive, BlendMode.Subtractive, BlendMode.Multiply];
        //const blendNames = ["None", "Normal", "Additive", "Subtractive", "Multiply"];
        for (let i = 0; i < textures.length; i++) {
            for (let j = 0; j < blends.length; j++) {
                // const texture = textures[i];
                const texture = Res.getResource(textures[i]);
                //const gameObject = creater.createGameObject(texture.name.split("/").pop() + " " + blendNames[j], {
                const gameObject = EngineFactory.createGameEntity3D();
                gameObject.addComponent(MeshFilter).mesh = DefaultMeshes.QUAD;
                const material = Material.create(DefaultShaders.MESH_BASIC);
                material.setTexture(texture).setBlend(blends[j], RenderQueue.Blend);
                gameObject.addComponent(MeshRenderer).material = material;
                gameObject.transform.setLocalPosition((j - blends.length * 0.5 + 0.5) * 1.1, -(i - textures.length * 0.5 + 0.5) * 1.1, 0.0);
            }
        }
        { // Background.
            const gameObject = EngineFactory.createGameEntity3D("background");
            gameObject.addComponent(MeshFilter).mesh = DefaultMeshes.PLANE;
            const material = Material.create(DefaultShaders.MESH_BASIC);
            material.setTexture(DefaultTextures.GRID);
            // const _uvTransformMatrix: Matrix3 = Matrix3.create();
            // const offset: Vector2 = Vector2.create();
            // const repeat: Vector2 = Vector2.create(50.0, 50.0);
            // offset.x = 0;
            // offset.y = 0;
            // _uvTransformMatrix.fromUVTransform(offset.x, offset.y, repeat.x, repeat.y, 0.0, 0.0, 0.0);
            // material.setUVTransform(_uvTransformMatrix);
            gameObject.addComponent(MeshRenderer).material = material;
            gameObject.transform.setLocalPosition(0.0, 0.0, 1.0).setLocalScale(2.0);
            gameObject.addComponent(UVUpdater);


        }

    }
    onUpdate(deltaTime: number): any {

    }
}
@component()
class UVUpdater extends Behaviour {
    private readonly _offset: Vector2 = Vector2.create();
    private readonly _repeat: Vector2 = Vector2.create(50.0, 50.0);
    private readonly _uvTransformMatrix: Matrix3 = Matrix3.create();
    private speed = 0.01;
    private time = 0;
    public onUpdate() {


        //const material = this.entity.getComponent(MeshRenderer)!.material!;
        this._offset.x = (this.time) % 1;
        this._offset.y = (this.time) % 1;
        this._uvTransformMatrix.fromUVTransform(this._offset.x, this._offset.y, this._repeat.x, this._repeat.y, 0.0, 0.0, 0.0);
        //material.setUVTransform(this._uvTransformMatrix);
        this.entity.getComponent(MeshRenderer)!.material!.setUVTransform(this._uvTransformMatrix);
        this.time = this.time + this.speed;
    }
}